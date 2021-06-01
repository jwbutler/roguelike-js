import ImageSupplier from '../ImageSupplier';
import Sprite from './Sprite';
import Colors from '../../types/Colors';
import { PaletteSwaps } from '../../types/types';
import Door from '../../objects/Door';
import { memoize } from '../../utils/MemoUtils';

class DoorSprite extends Sprite {
  private readonly _door: Door;
  private readonly _paletteSwaps: PaletteSwaps;
  private readonly _imageCache: { [key: string]: Promise<ImageBitmap> };
  private readonly _openFilename: string;
  private readonly _closedFilename: string;

  constructor(door: Door, paletteSwaps: PaletteSwaps, openFilename: string, closedFilename: string) {
    super({ dx: 0, dy: 0 });
    this._door = door;
    this._paletteSwaps = paletteSwaps;
    this._imageCache = {};
    this._openFilename = openFilename;
    this._closedFilename = closedFilename;
  }

  /**
   * @override {@link Sprite#getImage}
   */
  getImage(): Promise<ImageBitmap> {
    const door = this._door;
    const { isOpen } = door;
    return memoize(`${isOpen}`, () => this._getImage(), this._imageCache);
  }

  _getImage(): Promise<ImageBitmap> {
    const door = this._door;
    const filename = door.isOpen ? this._openFilename : this._closedFilename;
    return new ImageSupplier([filename], Colors.WHITE, this._paletteSwaps, []).get();
  }
}

export default DoorSprite;