import { loadMap} from './actions';
import { Coordinates, GameScreen, ItemCategory } from './types';
import TurnHandler from './classes/TurnHandler';
import Tiles from './types/Tiles';
import Sounds from './Sounds';
import { pickupItem, useItem } from './utils/ItemUtils';
import { resolvedPromise } from './utils/PromiseUtils';
import { fireProjectile, moveOrAttack } from './utils/UnitUtils';
import { playSound } from './utils/AudioUtils';

enum KeyCommand {
  UP = 'UP',
  LEFT = 'LEFT',
  DOWN = 'DOWN',
  RIGHT = 'RIGHT',
  SHIFT_UP = 'SHIFT_UP',
  SHIFT_LEFT = 'SHIFT_LEFT',
  SHIFT_DOWN = 'SHIFT_DOWN',
  SHIFT_RIGHT = 'SHIFT_RIGHT',
  TAB = 'TAB',
  ENTER = 'ENTER',
  SPACEBAR = 'SPACEBAR'
}

function _mapToCommand(e: KeyboardEvent): (KeyCommand | null) {
  switch (e.key) {
    case 'w':
    case 'W':
    case 'UpArrow':
      return (e.shiftKey ? KeyCommand.SHIFT_UP : KeyCommand.UP);
    case 's':
    case 'S':
    case 'DownArrow':
      return (e.shiftKey ? KeyCommand.SHIFT_DOWN : KeyCommand.DOWN);
    case 'a':
    case 'A':
    case 'LeftArrow':
      return (e.shiftKey ? KeyCommand.SHIFT_LEFT : KeyCommand.LEFT);
    case 'd':
    case 'D':
    case 'RightArrow':
      return (e.shiftKey ? KeyCommand.SHIFT_RIGHT : KeyCommand.RIGHT);
    case 'Tab':
      return KeyCommand.TAB;
    case 'Enter':
      return KeyCommand.ENTER;
    case ' ':
      return KeyCommand.SPACEBAR;
  }
  return null;
}

let BUSY = false;

function keyHandlerWrapper(e: KeyboardEvent) {
  if (!BUSY) {
    BUSY = true;
    keyHandler(e)
      .then(() => { BUSY = false; });
  }
}

function keyHandler(e: KeyboardEvent): Promise<void> {
  const command : (KeyCommand | null) = _mapToCommand(e);
  console.log(command);

  switch (command) {
    case KeyCommand.UP:
    case KeyCommand.LEFT:
    case KeyCommand.DOWN:
    case KeyCommand.RIGHT:
    case KeyCommand.SHIFT_UP:
    case KeyCommand.SHIFT_DOWN:
    case KeyCommand.SHIFT_LEFT:
    case KeyCommand.SHIFT_RIGHT:
      return _handleArrowKey(command);
    case KeyCommand.SPACEBAR:
      return TurnHandler.playTurn(null, true);
    case KeyCommand.ENTER:
      return _handleEnter();
    case KeyCommand.TAB:
      e.preventDefault();
      return _handleTab();
    default:
  }
  return resolvedPromise();
}

function _handleArrowKey(command: KeyCommand): Promise<void> {
  const { playerUnit, screen } = jwb.state;

  switch (screen) {
    case GameScreen.GAME:
      let dx: Number | null = null;
      let dy: Number | null = null;

      switch (command) {
        case KeyCommand.UP:
        case KeyCommand.SHIFT_UP:
          [dx, dy] = [0, -1];
          break;
        case KeyCommand.DOWN:
        case KeyCommand.SHIFT_DOWN:
          [dx, dy] = [0, 1];
          break;
        case KeyCommand.LEFT:
        case KeyCommand.SHIFT_LEFT:
          [dx, dy] = [-1, 0];
          break;
        case KeyCommand.RIGHT:
        case KeyCommand.SHIFT_RIGHT:
          [dx, dy] = [1, 0];
          break;
        default:
          throw `Invalid direction command ${command}`;
      }

      const queuedOrder = (() => {
        switch (command) {
          case KeyCommand.SHIFT_UP:
          case KeyCommand.SHIFT_DOWN:
          case KeyCommand.SHIFT_LEFT:
          case KeyCommand.SHIFT_RIGHT:
            return u => fireProjectile(u, { dx, dy });
          default:
            return u => moveOrAttack(u, { x: u.x + dx, y: u.y + dy });
        }
      })();
      return TurnHandler.playTurn(
        queuedOrder,
        true
      );
    case GameScreen.INVENTORY:
      const { state } = jwb;
      const { inventoryCategory } = state;
      const inventoryKeys = <ItemCategory[]>Object.keys(playerUnit.inventory);
      const items = !!inventoryCategory ? playerUnit.inventory[inventoryCategory] || [] : [];
      let keyIndex = !!inventoryCategory ? inventoryKeys.indexOf(inventoryCategory) : 0;

      switch (command) {
        case KeyCommand.UP:
        case KeyCommand.SHIFT_UP:
          state.inventoryIndex = (state.inventoryIndex + items.length - 1) % items.length;
          break;
        case KeyCommand.DOWN:
        case KeyCommand.SHIFT_DOWN:
          state.inventoryIndex = (state.inventoryIndex + 1) % items.length;
          break;
        case KeyCommand.LEFT:
        case KeyCommand.SHIFT_LEFT:
        {
          keyIndex = (keyIndex + inventoryKeys.length - 1) % inventoryKeys.length;
          state.inventoryCategory = inventoryKeys[keyIndex];
          state.inventoryIndex = 0;
          break;
        }
        case KeyCommand.RIGHT:
        case KeyCommand.SHIFT_RIGHT:
        {
          keyIndex = (keyIndex + 1) % inventoryKeys.length;
          state.inventoryCategory = inventoryKeys[keyIndex];
          state.inventoryIndex = 0;
          break;
        }
      }
      return TurnHandler.playTurn(null, false);
    default:
      throw `fux`;
  }
}

function _handleEnter(): Promise<void> {
  const { state } = jwb;
  const { playerUnit, screen } = state;
  const { inventory } = playerUnit;

  switch (screen) {
    case GameScreen.GAME: {
      const { mapIndex } = state;
      const map = state.getMap();
      const { x, y }: Coordinates = playerUnit;
      if (!map || (mapIndex === null)) {
        throw `fux`;
      }
      const item = map.getItem({ x, y });
      if (!!item) {
        pickupItem(playerUnit, item);
        map.removeItem({ x, y });
      } else if (map.getTile({ x, y }) === Tiles.STAIRS_DOWN) {
        playSound(Sounds.DESCEND_STAIRS);
        loadMap(mapIndex + 1);
      }
      return TurnHandler.playTurn(null, true);
    }
    case GameScreen.INVENTORY: {
      const { inventoryCategory, inventoryIndex } = state;
      if (inventoryCategory) {
        const items = inventory[inventoryCategory];
        if (items) {
          const item = items[inventoryIndex] || null;
          state.screen = GameScreen.GAME;
          return useItem(playerUnit, item)
            .then(() => TurnHandler.playTurn(null, false));
        }
      }
      return resolvedPromise();
    }
    default:
      throw `fux`;
  }
}

function _handleTab(): Promise<void> {
  const { state } = jwb;
  const { playerUnit } = state;

  switch (state.screen) {
    case GameScreen.INVENTORY:
      state.screen = GameScreen.GAME;
      break;
    default:
      state.screen = GameScreen.INVENTORY;
      state.inventoryCategory = state.inventoryCategory || <any>Object.keys(playerUnit.inventory)[0] || null;
      break;
  }
  return TurnHandler.playTurn(null, false);
}

function attachEvents() {
  window.onkeydown = keyHandlerWrapper;
}

export {
  attachEvents,
  keyHandler as simulateKeyPress
};