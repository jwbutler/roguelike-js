{
  function keyHandler(e) {
    const { actions } = jwb;
    switch (e.key) {
      case 'w':
      case 'a':
      case 's':
      case 'd':
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'ArrowDown':
      case 'ArrowRight':
        _handleArrowKey(e.key);
        break;
      case ' ': // spacebar
        actions.render(true);
        break;
      case 'Enter':
        _handleEnter();
        return;
      case 'Tab':
        _handleTab();
        e.preventDefault();
        break;
      default:
    }
  }

  function _handleArrowKey(key) {
    const { state, actions } = jwb;
    const { playerUnit, screen } = state;
    const { tryMove } = jwb.utils.unitBehavior;
    const { inventory } = playerUnit;
    const { render } = actions;

    switch (screen) {
      case 'GAME':
        let [dx, dy] = [];
        switch (key) {
          case 'w':
          case 'ArrowUp':
            [dx, dy] = [0, -1];
            break;
          case 'a':
          case 'ArrowLeft':
            [dx, dy] = [-1, 0];
            break;
          case 's':
          case 'ArrowDown':
            [dx, dy] = [0, 1];
            break;
          case 'd':
          case 'ArrowRight':
            [dx, dy] = [1, 0];
            break;
          default:
            throw `Invalid key ${key}`;
        }

        playerUnit.queuedOrder = u => {
          tryMove(u, u.x + dx, u.y + dy);
        };
        break;
      case 'INVENTORY':
        const { inventoryCategory } = state;
        const items = inventory[inventoryCategory];
        const inventoryKeys = Object.keys(inventory);
        let keyIndex = inventoryKeys.indexOf(inventoryCategory);
        switch (key) {
          case 'w':
          case 'ArrowUp':
            state.inventoryIndex = (state.inventoryIndex + items.length - 1) % items.length;
            break;
          case 'a':
          case 'ArrowLeft':
          {
            keyIndex = (keyIndex + inventoryKeys.length - 1) % inventoryKeys.length;
            state.inventoryCategory = inventoryKeys[keyIndex];
            state.inventoryIndex = 0;
            break;
          }
          case 's':
          case 'ArrowDown':
            state.inventoryIndex = (state.inventoryIndex + 1) % items.length;
            break;
          case 'd':
          case 'ArrowRight':
          {
            keyIndex = (keyIndex + 1) % inventoryKeys.length;
            state.inventoryCategory = inventoryKeys[keyIndex];
            state.inventoryIndex = 0;
            break;
          }
        }
    }
    render(screen === 'GAME');
  }

  function _handleEnter() {
    const { state, actions } = jwb;
    const { playerUnit, screen } = state;
    const { inventory } = playerUnit;
    const { pickupItem, useItem, loadMap, render } = actions;

    switch (screen) {
      case 'GAME': {
        const { Tiles } = jwb.types;
        const { map, mapIndex } = state;
        const { x, y } = playerUnit;
        const item = map.getItem(x, y);
        if (!!item) {
          pickupItem(playerUnit, item);
          map.removeItem({ x, y });
        } else if (map.getTile(x, y) === Tiles.STAIRS_DOWN) {
          loadMap(mapIndex + 1);
        }
        break;
      }
      case 'INVENTORY': {
        const { inventoryCategory, inventoryIndex } = state;
        const items = inventory[inventoryCategory];
        const item = items[inventoryIndex] || null;
        useItem(playerUnit, item);
        break;
      }
    }
    render(screen === 'GAME');
  }

  function _handleTab() {
    const { state, actions } = jwb;
    const { playerUnit } = state;
    const { render } = actions;

    switch (state.screen) {
      case 'INVENTORY':
        state.screen = 'GAME';
        break;
      default:
        state.screen = 'INVENTORY';
        state.inventoryCategory = state.inventoryCategory || Object.keys(playerUnit.inventory)[0] || null;
        break;
    }
    render(false);
  }

  function attachEvents() {
    window.onkeydown = keyHandler;
  }

  jwb = jwb || {};

  jwb.input = {
    attachEvents,
    simulateKeyPress: keyHandler
  };
}
