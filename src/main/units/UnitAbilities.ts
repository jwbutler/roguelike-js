import Unit from './Unit';
import Sounds from '../sounds/Sounds';
import { Direction, EquipmentSlot } from '../types/types';
import { playSound } from '../sounds/SoundFX';
import { attack, heavyAttack } from './UnitUtils';
import { playArrowAnimation } from '../graphics/animations/Animations';

abstract class Ability {
  readonly name: string;
  readonly cooldown: number;
  readonly icon: string | null;

  protected constructor(name: string, cooldown: number, icon: string | null = null) {
    this.name = name;
    this.cooldown = cooldown;
    this.icon = icon;
  }

  abstract use(unit: Unit, direction: Direction | null): Promise<any>
}

class NormalAttack extends Ability {
  constructor() {
    super('ATTACK', 0);
  }

  use(unit: Unit, direction: Direction | null): Promise<void> {
    if (!direction) {
      throw 'NormalAttack requires a direction!';
    }

    const { dx, dy } = direction;
    const { x, y } = { x: unit.x + dx, y: unit.y + dy };

    const { playerUnit } = jwb.state;
    const map = jwb.state.getMap();
    unit.direction = { dx: x - unit.x, dy: y - unit.y };

    return new Promise(resolve => {
      if (map.contains({ x, y }) && !map.isBlocked({ x, y })) {
        [unit.x, unit.y] = [x, y];
        if (unit === playerUnit) {
          playSound(Sounds.FOOTSTEP);
        }
        resolve();
      } else {
        const targetUnit = map.getUnit({ x, y });
        if (!!targetUnit) {
          attack(unit, targetUnit)
            .then(resolve);
        } else {
          resolve();
        }
      }
    });
  }
}

class HeavyAttack extends Ability {
  constructor() {
    super('HEAVY_ATTACK', 15, 'strong_icon');
  }

  use(unit: Unit, direction: Direction | null): Promise<void> {
    if (!direction) {
      throw 'HeavyAttack requires a direction!';
    }

    const { dx, dy } = direction;
    const { x, y } = { x: unit.x + dx, y: unit.y + dy };

    const { playerUnit } = jwb.state;
    const map = jwb.state.getMap();
    unit.direction = { dx: x - unit.x, dy: y - unit.y };

    return new Promise(resolve => {
      if (map.contains({ x, y }) && !map.isBlocked({ x, y })) {
        [unit.x, unit.y] = [x, y];
        if (unit === playerUnit) {
          playSound(Sounds.FOOTSTEP);
        }
        resolve();
      } else {
        const targetUnit = map.getUnit({ x, y });
        if (!!targetUnit) {
          unit.useAbility(this);
          heavyAttack(unit, targetUnit)
            .then(resolve);
        } else {
          resolve();
        }
      }
    });
  }
}

class KnockbackAttack extends Ability {
  constructor() {
    super('KNOCKBACK_ATTACK', 15, 'knockback_icon');
  }

  use(unit: Unit, direction: Direction | null): Promise<void> {
    if (!direction) {
      throw 'KnockbackAttack requires a direction!';
    }

    const { dx, dy } = direction;
    const { x, y } = { x: unit.x + dx, y: unit.y + dy };

    const { playerUnit } = jwb.state;
    const map = jwb.state.getMap();
    unit.direction = { dx: x - unit.x, dy: y - unit.y };

    return new Promise(resolve => {
      if (map.contains({ x, y }) && !map.isBlocked({ x, y })) {
        [unit.x, unit.y] = [x, y];
        if (unit === playerUnit) {
          playSound(Sounds.FOOTSTEP);
        }
        resolve();
      } else {
        const targetUnit = map.getUnit({ x, y });
        if (!!targetUnit) {
          unit.useAbility(this);
          attack(unit, targetUnit)
            .then(() => {
              let targetCoordinates = { x, y };

              // knockback by one tile
              const oneTileBack = { x: targetCoordinates.x + dx, y: targetCoordinates.y + dy };
              if (map.contains(oneTileBack) && !map.isBlocked(oneTileBack)) {
                targetCoordinates = oneTileBack;
              }
              [targetUnit.x, targetUnit.y] = [targetCoordinates.x, targetCoordinates.y];

              // stun for 1 turn (if they're already stunned, just leave it)
              targetUnit.stunDuration = Math.max(targetUnit.stunDuration, 1);
            })
            .then(resolve);
        } else {
          resolve();
        }
      }
    });
  }
}

class StunAttack extends Ability {
  constructor() {
    super('STUN_ATTACK', 15, 'knockback_icon');
  }

  use(unit: Unit, direction: Direction | null): Promise<void> {
    if (!direction) {
      throw 'StunAttack requires a direction!';
    }

    const { dx, dy } = direction;
    const { x, y } = { x: unit.x + dx, y: unit.y + dy };

    const { playerUnit } = jwb.state;
    const map = jwb.state.getMap();
    unit.direction = { dx: x - unit.x, dy: y - unit.y };

    return new Promise(resolve => {
      if (map.contains({ x, y }) && !map.isBlocked({ x, y })) {
        [unit.x, unit.y] = [x, y];
        if (unit === playerUnit) {
          playSound(Sounds.FOOTSTEP);
        }
        resolve();
      } else {
        const targetUnit = map.getUnit({ x, y });
        if (!!targetUnit) {
          unit.useAbility(this);
          attack(unit, targetUnit)
            .then(() => {
              // stun for 2 turns (if they're already stunned, just leave it)
              targetUnit.stunDuration = Math.max(targetUnit.stunDuration, 2);
            })
            .then(resolve);
        } else {
          resolve();
        }
      }
    });
  }
}

class ShootArrow extends Ability {
  constructor() {
    super('SHOOT_ARROW', 0);
  }

  use(unit: Unit, direction: Direction | null): Promise<void> {
    if (!direction) {
      throw 'ShootArrow requires a direction!';
    }

    const { dx, dy } = direction;
    unit.direction = { dx, dy };

    return unit.sprite.update()
      .then(() => jwb.renderer.render())
      .then(() => new Promise(resolve => {
        if (!unit.equipment.get(EquipmentSlot.RANGED_WEAPON)) {
          // change direction and re-render, but don't do anything (don't spend a turn)
          resolve();
          return;
        }
        const map = jwb.state.getMap();
        const coordinatesList = [];
        let { x, y } = { x: unit.x + dx, y: unit.y + dy };
        while (map.contains({ x, y }) && !map.isBlocked({ x, y })) {
          coordinatesList.push({ x, y });
          x += dx;
          y += dy;
        }

        const targetUnit = map.getUnit({ x, y });
        if (!!targetUnit) {
          const { messages } = jwb.state;
          const damage = unit.getRangedDamage();
          messages.push(`${unit.name} hit ${targetUnit.name} for ${damage} damage!`);

          playArrowAnimation(unit, { dx, dy }, coordinatesList, targetUnit)
            .then(() => targetUnit.takeDamage(damage, unit))
            .then(() => resolve());
        } else {
          playArrowAnimation(unit, { dx, dy }, coordinatesList, null)
            .then(() => resolve());
        }
      }));
  }
}

const UnitAbilities = {
  ATTACK: new NormalAttack(),
  HEAVY_ATTACK: new HeavyAttack(),
  KNOCKBACK_ATTACK: new KnockbackAttack(),
  STUN_ATTACK: new StunAttack(),
  SHOOT_ARROW: new ShootArrow()
};

export default UnitAbilities;
export {
  Ability
};