
import cave from '../../../data/tilesets/cave.json';
import dungeon from '../../../data/tilesets/dungeon.json';
import Sprite from '../graphics/sprites/Sprite';
import StaticSprite from '../graphics/sprites/StaticSprite';
import StaticSpriteConfig from '../graphics/sprites/StaticSpriteConfig';
import { TileType } from './types';

type TileSet = {
  [tileType in TileType]?: (Sprite | null)[]
};

type TilesetJson = {
  name: string,
  tiles: {
    [tileType: string]: (string | null)[]
  }
}

const _getTileSprite = (tilesetName: string, filename: string | null): (Sprite | null) => {
  if (!filename) {
    return null;
  }

  const spriteConfig: StaticSpriteConfig = {
    name: filename,
    filename: `tiles/${tilesetName}/${filename}`,
    offsets: { dx: 0, dy: 0 }
  };
  return new StaticSprite(spriteConfig);
}

const _buildTileSet = (json: TilesetJson): TileSet => {
  const tileSet: TileSet = {};
  Object.entries(json.tiles).forEach(([key, filenames]) => {
    const tiles: Sprite[] = [];
    filenames.forEach(filename => {
      const sprite = _getTileSprite(json.name, filename);
      if (sprite) {
        tiles.push(sprite);
      }
    });

    // Wow this is ugly.
    const tileType = TileType[key as keyof typeof TileType];
    tileSet[tileType] = tiles;
  });
  return tileSet;
}

namespace TileSet {
  export const DUNGEON: TileSet = _buildTileSet(dungeon);
  export const CAVE: TileSet = _buildTileSet(cave);
}

export default TileSet;
