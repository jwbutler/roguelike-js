import SpriteFactory from '../graphics/sprites/SpriteFactory';
import UnitClass from './UnitClass';
import Colors from '../types/Colors';
import { UnitType } from '../types/types';
import { HUMAN_DETERMINISTIC } from './UnitAI';

const PLAYER: UnitClass = {
  name: 'PLAYER',
  type: UnitType.HUMAN,
  sprite: SpriteFactory.PLAYER,
  // Green/brown colors
  paletteSwaps: {
    [Colors.DARK_PURPLE]: Colors.DARK_BROWN, // Shirt
    [Colors.MAGENTA]: Colors.DARK_GREEN, // Upper Sleeves
    [Colors.DARK_BLUE]: Colors.DARK_GREEN, // Lower sleeves
    [Colors.CYAN]: Colors.LIGHT_PINK, // Hands
    [Colors.BLACK]: Colors.BLACK, // Belt
    [Colors.DARK_GRAY]: Colors.DARK_BROWN, // Skirt
    [Colors.LIGHT_GRAY]: Colors.LIGHT_BROWN, // Legs
    [Colors.DARK_GREEN]: Colors.DARK_BROWN, // Socks
    [Colors.GREEN]: Colors.DARK_BROWN, // Shoes
    [Colors.ORANGE]: Colors.LIGHT_PINK // Face
  },
  startingLife: 100,
  startingMana: 100,
  startingDamage: 8,
  minLevel: 1,
  maxLevel: 20,
  lifePerLevel: level => 10,
  manaPerLevel: level => 0,
  damagePerLevel: level => 1,
  experienceToNextLevel: currentLevel => (currentLevel < 10) ? 2 * currentLevel + 2: null, // 4, 6, 8, 10, 12, 14...
};

const ENEMY_SNAKE: UnitClass = {
  name: 'ENEMY_SNAKE',
  type: UnitType.ANIMAL,
  sprite: SpriteFactory.SNAKE,
  paletteSwaps: {},
  startingLife: 50,
  startingMana: null,
  startingDamage: 4,
  minLevel: 1,
  maxLevel: 3,
  lifePerLevel: () => 12,
  manaPerLevel: () => null,
  damagePerLevel: () => 2,
  aiHandler: HUMAN_DETERMINISTIC,
  aiParams: {
    speed: 0.95,
    visionRange: 12,
    fleeThreshold: 0.2
  }
};

const ENEMY_GRUNT: UnitClass = {
  name: 'ENEMY_GRUNT',
  type: UnitType.HUMAN,
  sprite: SpriteFactory.GRUNT,
  paletteSwaps: {},
  startingLife: 60,
  startingMana: null,
  startingDamage: 6,
  minLevel: 1,
  maxLevel: 4,
  lifePerLevel: () => 12,
  manaPerLevel: () => null,
  damagePerLevel: () => 2,
  aiHandler: HUMAN_DETERMINISTIC,
  aiParams: {
    speed: 0.8,
    visionRange: 8,
    fleeThreshold: 0.1
  }
};

const ENEMY_SOLDIER: UnitClass = {
  name: 'ENEMY_SOLDIER',
  type: UnitType.HUMAN,
  sprite: SpriteFactory.SOLDIER,
  paletteSwaps: {},
  startingLife: 100,
  startingMana: null,
  startingDamage: 10,
  minLevel: 3,
  maxLevel: 6,
  lifePerLevel: () => 15,
  manaPerLevel: () => null,
  damagePerLevel: () => 3,
  aiHandler: HUMAN_DETERMINISTIC,
  aiParams: {
    speed: 0.9,
    visionRange: 10,
    fleeThreshold: 0.2
  }
};

const ENEMY_GOLEM: UnitClass = {
  name: 'ENEMY_GOLEM',
  type: UnitType.GOLEM,
  sprite: SpriteFactory.GOLEM,
  paletteSwaps: {
    [Colors.DARK_GRAY]: Colors.DARKER_GRAY,
    [Colors.LIGHT_GRAY]: Colors.DARKER_GRAY,
  },
  startingLife: 120,
  startingMana: null,
  startingDamage: 20,
  minLevel: 5,
  maxLevel: 9,
  lifePerLevel: () => 25,
  manaPerLevel: () => null,
  damagePerLevel: () => 4,
  aiHandler: HUMAN_DETERMINISTIC,
  aiParams: {
    speed: 0.7,
    visionRange: 12,
    fleeThreshold: 0
  }
};

function getEnemyClasses() {
  return [ENEMY_SNAKE, ENEMY_GRUNT, ENEMY_SOLDIER, ENEMY_GOLEM];
}

export default {
  PLAYER,
  ENEMY_GRUNT,
  ENEMY_GOLEM,
  getEnemyClasses
};