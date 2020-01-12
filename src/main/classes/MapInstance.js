{
  function MapInstance(width, height, tiles, units, items) {
    /**
     * @type int
     */
    this.width = width;
    /**
     * @type int
     */
    this.height = height;
    /**
     * [y][x]
     * @type Tile[][]
     */
    this.tiles = tiles;
    /**
     * @type Unit[]
     */
    this.units = units;
    /**
     * @type MapItem[]
     */
    this.items = items;

    /**
     * @returns Tile
     */
    this.getTile = function (x, y) {
      const { Tiles } = jwb.types;
      return (this.tiles[y] || [])[x] || Tiles.NONE;
    };

    /**
     * @returns {Unit|null}
     */
    this.getUnit = function (x, y) {
      return this.units.filter(u => u.x === x && u.y === y)[0] || null;
    };

    /**
     * @returns {MapItem|null}
     */
    this.getItem = function (x, y) {
      return this.items.filter(i => i.x === x && i.y === y)[0] || null;
    };

    /**
     * @returns boolean
     */
    this.contains = function (x, y) {
      return x >= 0 && x < this.width && y >= 0 && y < this.height;
    };

    /**
     * @returns boolean
     */
    this.isBlocked = function (x, y) {
      if (!this.contains(x, y)) {
        throw `(${x}, ${y}) is not on the map`;
      }
      return this.getUnit(x, y) || this.getTile(x, y).isBlocking;
    };

    this.removeItem = function ({ x, y }) {
      const index = this.items.findIndex(i => (i.x === x && i.y === y));
      this.items.splice(index, 1);
    }
  }

  window.jwb = window.jwb || {};
  jwb.MapInstance = MapInstance;
}
