import { Coordinates, Direction, Projectile } from '../types/types';
import SpriteFactory from '../graphics/sprites/SpriteFactory';

function createArrow({ x, y }: Coordinates, direction: Direction): Projectile {
  return {
    x,
    y,
    direction,
    sprite: SpriteFactory.ARROW(direction, {})
  };
}

export {
  createArrow
};