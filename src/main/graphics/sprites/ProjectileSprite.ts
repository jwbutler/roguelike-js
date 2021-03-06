import Color from '../../types/Color';
import Direction from '../../types/Direction';
import PaletteSwaps from '../../types/PaletteSwaps';
import ImageSupplier from '../ImageSupplier';
import Sprite, { Offsets } from './Sprite';
import { fillTemplate } from '../../utils/TemplateUtils';

/**
 * Projectiles have a direction but no activity or frame numbers
 */
class ProjectileSprite extends Sprite {
  private static readonly TEMPLATE = '${sprite}/${sprite}_${direction}_${number}';
  private readonly _spriteName: string;
  private readonly _direction: Direction;
  private readonly _paletteSwaps: PaletteSwaps;

  constructor(direction: Direction, spriteName: string, paletteSwaps: PaletteSwaps, spriteOffsets: Offsets) {
    super(spriteOffsets);
    this._spriteName = spriteName;
    this._direction = direction;
    this._paletteSwaps = paletteSwaps;
  }

  getImage(): Promise<ImageBitmap> {
    const variables = {
      sprite: this._spriteName,
      direction: Direction.toString(this._direction),
      number: 1
    };
    const filename = fillTemplate(ProjectileSprite.TEMPLATE, variables);
    return new ImageSupplier(filename, Color.WHITE, this._paletteSwaps).get();
  }
}

export default ProjectileSprite;
