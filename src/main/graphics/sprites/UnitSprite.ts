import PaletteSwaps from '../../types/PaletteSwaps';
import ImageSupplier from '../ImageSupplier';
import Sprite from './Sprite';
import Color from '../../types/Color';
import Unit from '../../units/Unit';
import Direction from '../../types/Direction';
import { Activity } from '../../types/types';
import { fillTemplate } from '../../utils/TemplateUtils';
import { replaceAll } from '../ImageUtils';
import SpriteConfig from './SpriteConfig';

function _memoize<V>(key: string, valueSupplier: (k: string) => V, cache: { [k: string]: V }): V {
  if (cache[key]) {
    return cache[key];
  }

  const value = valueSupplier(key);
  cache[key] = value;
  return value;
}

class UnitSprite extends Sprite {
  private readonly _unit: Unit;
  private readonly _spriteConfig: SpriteConfig;
  private readonly _paletteSwaps: PaletteSwaps;
  private readonly _imageCache: { [key: string]: Promise<ImageBitmap> };

  constructor(spriteConfig: SpriteConfig, unit: Unit, paletteSwaps: PaletteSwaps) {
    super(spriteConfig.offsets);
    this._spriteConfig = spriteConfig;
    this._unit = unit;
    this._paletteSwaps = paletteSwaps;
    this._imageCache = {};
  }

  /**
   * @override {@link Sprite#getImage}
   */
  getImage(): Promise<ImageBitmap> {
    const unit = this._unit;
    const activity = unit.activity.toLowerCase();
    const direction = Direction.toLegacyDirection(unit.direction!!);
    return _memoize(`${activity}_${direction}`, () => this._getImage(), this._imageCache);
  }

  _getImage(): Promise<ImageBitmap> {
    const unit = this._unit;
    const spriteConfig = this._spriteConfig;

    let activity = unit.activity.toLowerCase();
    const direction = Direction.toLegacyDirection(unit.direction!!);
    const animation = spriteConfig.animations[activity];
    const frame = animation.frames[0];
    activity = frame.activity || activity;

    const variables = {
      sprite: spriteConfig.name,
      activity,
      direction,
      number: animation.frames[0].number
    };

    const patterns = spriteConfig.patterns || [spriteConfig.pattern!!];
    const filenames = patterns.map(pattern => `units/${spriteConfig.name}/${pattern}`)
      .map(pattern => fillTemplate(pattern, variables));
    const effects = (unit.activity === Activity.DAMAGED)
      ? [(img: ImageData) => replaceAll(img, Color.WHITE)]
      : [];
    return new ImageSupplier(filenames, Color.WHITE, this._paletteSwaps, effects).get();
  }
}

export default UnitSprite;
