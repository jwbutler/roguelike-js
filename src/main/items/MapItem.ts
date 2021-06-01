import InventoryItem from './InventoryItem';
import Sprite from '../graphics/sprites/Sprite';
import { Coordinates, GameObject } from '../types/types';

class MapItem implements GameObject {
  x: number;
  y: number;
  readonly sprite: Sprite;
  inventoryItem: InventoryItem;

  constructor({ x, y }: Coordinates, sprite: Sprite, inventoryItem: InventoryItem) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.inventoryItem = inventoryItem;
  }
}

export default MapItem;