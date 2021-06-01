import { Coordinates, GameObject } from '../types/types';
import Door, { DoorDirection } from './Door';

function createDoor({ x, y }: Coordinates, direction: DoorDirection, isOpen: boolean): GameObject {
  return new Door({ x, y }, direction, isOpen);
}

export default {
  createDoor
};