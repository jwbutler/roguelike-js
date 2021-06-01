import Sprite from './Sprite';
import Unit from '../../units/Unit';
import { Direction, PaletteSwaps } from '../../types/types';
import StaticSprite from './StaticSprite';
import UnitSprite from './UnitSprite';
import ProjectileSprite from './ProjectileSprite';
import Equipment from '../../items/equipment/Equipment';
import EquipmentSprite from './EquipmentSprite';
import { SpriteConfigs } from './SpriteConfig';
import { StaticSpriteConfigs } from './StaticSpriteConfig';
import Door from '../../objects/Door';
import DoorSprite from './DoorSprite';

type ProjectileSpriteSupplier = (direction: Direction, paletteSwaps: PaletteSwaps) => Sprite;

function createStaticSprite(spriteName: string, paletteSwaps: PaletteSwaps={}) {
  const spriteConfig = StaticSpriteConfigs[spriteName]!!;
  return new StaticSprite(spriteConfig, paletteSwaps);
}

function createUnitSprite(unit: Unit): Sprite {
  const { unitClass } = unit;
  const spriteConfig = SpriteConfigs[unitClass.sprite]!!;
  return new UnitSprite(spriteConfig, unit, unitClass.paletteSwaps);
}

function createEquipmentSprite(equipment: Equipment): Sprite {
  const { equipmentClass } = equipment;
  const spriteConfig = SpriteConfigs[equipmentClass.sprite]!!;
  return new EquipmentSprite(spriteConfig, equipment, equipmentClass.paletteSwaps);
}

function createDoorSprite(door: Door): Sprite {
  const direction = door.direction.toLowerCase();
  return new DoorSprite(door, {}, `door_${direction}_open`, `door_${direction}_closed`);
}

const ProjectileSprites: { [name: string]: ProjectileSpriteSupplier } = {
  ARROW: (direction: Direction, paletteSwaps: PaletteSwaps) => new ProjectileSprite(direction, 'arrow', paletteSwaps, { dx: 0, dy: -8 })
};

// the following does not work: { ...StaticSprites, ...UnitSprites }
// :(
export default {
  ARROW: ProjectileSprites.ARROW,
  createStaticSprite,
  createUnitSprite,
  createEquipmentSprite,
  createDoorSprite
};