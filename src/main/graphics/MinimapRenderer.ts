import SpriteRenderer from './SpriteRenderer';
import Colors from '../types/Colors';
import { TileType } from '../types/types';

class MinimapRenderer {
  private readonly _canvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;

  constructor() {
    this._canvas = document.createElement('canvas');
    this._context = <any>this._canvas.getContext('2d');
    this._canvas.width = SpriteRenderer.SCREEN_WIDTH;
    this._canvas.height = SpriteRenderer.SCREEN_HEIGHT;
    this._context.imageSmoothingEnabled = false;
  }

  render(): Promise<ImageBitmap> {
    this._context.fillStyle = Colors.BLACK;
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    const map = jwb.state.getMap();
    const m = Math.floor(Math.min(
      this._canvas.width / map.width,
      this._canvas.height / map.height
    ));
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tileType = map.getTile({ x, y }).type;
        let color: Colors;
        switch (tileType) {
          case TileType.FLOOR:
          case TileType.FLOOR_HALL:
          case TileType.STAIRS_DOWN:
            color = Colors.LIGHT_GRAY;
            break;
          case TileType.WALL:
          case TileType.WALL_HALL:
            color = Colors.DARK_GRAY;
            break;
          case TileType.NONE:
          case TileType.WALL_TOP:
          default:
            color = Colors.BLACK;
            break;
        }
        this._context.fillStyle = color;
        this._context.fillRect(x * m, y * m, m, m);
      }
    }
    const imageData = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
    return createImageBitmap(imageData);
  }
}

export default MinimapRenderer;