import ImageSupplier from '../ImageSupplier';
import Sprite from './Sprite';
import Colors from '../../types/Colors';
import Unit from '../../units/Unit';
import Directions from '../../types/Directions';
import { Activity, PaletteSwaps } from '../../types/types';
import { fillTemplate } from '../../utils/TemplateUtils';
import { replaceAll } from '../ImageUtils';
import { SpriteConfig } from './SpriteConfig';
import { memoize } from '../../utils/MemoUtils';

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
    const direction = Directions.toLegacyDirection(unit.direction!!);
    return memoize(`${activity}_${direction}`, () => this._getImage(), this._imageCache);
  }

  _getImage(): Promise<ImageBitmap> {
    const unit = this._unit;
    const spriteConfig = this._spriteConfig;

    let activity = unit.activity.toLowerCase();
    const direction = Directions.toLegacyDirection(unit.direction!!);
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
      ? [(img: ImageData) => replaceAll(img, Colors.WHITE)]
      : [];
    return new ImageSupplier(filenames, Colors.WHITE, this._paletteSwaps, effects).get();
  }
}

export default UnitSprite;