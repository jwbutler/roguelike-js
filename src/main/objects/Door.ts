import Sprite from '../graphics/sprites/Sprite';
import { Coordinates, GameObject } from '../types/types';
import SpriteFactory from '../graphics/sprites/SpriteFactory';

type Direction = 'HORIZONTAL' | 'VERTICAL';

class Door implements GameObject {
  x: number;
  y: number;
  readonly direction: Direction;
  readonly sprite: Sprite;
  isOpen: boolean

  constructor({ x, y }: Coordinates, direction: Direction, isOpen: boolean) {
    this.x = x;
    this.y = y;
    this.sprite = SpriteFactory.createDoorSprite(this);
    this.direction = direction;
    this.isOpen = isOpen;
  }
}

export default Door;
export { Direction as DoorDirection };