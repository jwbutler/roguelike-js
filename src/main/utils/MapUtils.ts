import { randInt } from './RandomUtils';
import { Coordinates } from '../types';

function pickUnoccupiedLocations(tiles, allowedTileTypes, occupiedLocations, numToChoose): Coordinates[] {
  /**
   * @type {{ x: int, y: int }[]}
   */
  const unoccupiedLocations = [];
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      if (allowedTileTypes.indexOf(tiles[y][x]) !== -1) {
        if (occupiedLocations.filter(loc => (loc.x === x && loc.y === y)).length === 0) {
          unoccupiedLocations.push({ x, y });
        }
      }
    }
  }

  const chosenLocations = [];
  for (let i = 0; i < numToChoose; i++) {
    if (unoccupiedLocations.length > 0) {
      const index = randInt(0, unoccupiedLocations.length - 1);
      const { x, y } = unoccupiedLocations[index];
      chosenLocations.push({ x, y });
      occupiedLocations.push({ x, y });
      unoccupiedLocations.splice(index, 1);
    }
  }
  return chosenLocations;
}

/**
 * @param {!Coordinates} first
 * @param {!Coordinates} second
 * @return {!boolean}
 */
function coordinatesEquals(first, second) {
  return (first.x === second.x && first.y === second.y);
}

/**
 * @param {!Rect} rect
 * @param {!Coordinates} coordinates
 * @return {!boolean}
 */
function contains(rect, coordinates) {
  return coordinates.x >= rect.left
    && coordinates.x < (rect.left + rect.width)
    && coordinates.y >= rect.top
    && coordinates.y < (rect.top + rect.height);
}

/**
 * This is implemented as (x distance + y distance), since all movement is just 4-directional
 * so it legitimately takes twice as long to move diagonally
 *
 * @param {!Coordinates} first
 * @param {!Coordinates} second
 * @return {!int}
 * @private
 */
function manhattanDistance(first, second) {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

/**
 * @param {!Coordinates} first
 * @param {!Coordinates} second
 * @return {!number}
 * @private
 */
function hypotenuse(first, second) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  return ((dx * dx) + (dy * dy)) ** 0.5;
}

/**
 * @param {!Coordinates} first
 * @param {!Coordinates} second
 * @return {!int}
 * @private
 */
function civDistance(first, second) {
  const dx = Math.abs(first.x - second.x);
  const dy = Math.abs(first.y - second.y);
  return Math.max(dx, dy) + Math.min(dx, dy)/2;
}

/**
 * @param {!Coordinates} first
 * @param {!Coordinates} second
 * @returns {!boolean}
 */
function isAdjacent(first, second) {
  const dx = Math.abs(first.x - second.x);
  const dy = Math.abs(first.y - second.y);
  return (dx === 0 && (dy === -1 || dy === 1)) || (dy === 0 && (dx === -1 || dx === 1));
}

/**
 * @param {!int} x
 * @param {!int} y
 */
function isTileRevealed({ x, y }) {
  if (jwb.DEBUG) {
    return true;
  }
  return jwb.state.map.revealedTiles.some(tile => coordinatesEquals({ x, y }, tile));
}

export {
  pickUnoccupiedLocations,
  civDistance,
  manhattanDistance,
  hypotenuse,
  contains,
  coordinatesEquals,
  isAdjacent,
  isTileRevealed
};