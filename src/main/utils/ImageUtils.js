{

  /**
   * @param {!string} filename
   * @return {!Promise<!ImageBitmap>}
   * @private
   */
  function loadImage(filename) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.style.display = 'none';

      /**
       * @type {HTMLImageElement}
       */
      const img = document.createElement('img');

      img.addEventListener('load', () => {
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, img.width, img.height);
        img.parentElement.removeChild(img);
        canvas.parentElement.removeChild(canvas);
        resolve(imageData);
      });

      img.style.display = 'none';
      img.onerror = () => {
        reject(`Failed to load image ${img.src}`);
      };
      img.src = `png/${filename}.png`;
      document.body.appendChild(canvas);
      document.body.appendChild(img);
    });
  }

  /**
   * @param {ImageData} imageData
   * @param {string} transparentColor e.g. '#ff0000'
   * @returns {Promise<ImageData>}
   */
  function applyTransparentColor(imageData, transparentColor) {
    return new Promise((resolve, reject) => {
      const [tr, tg, tb] = hex2rgb(transparentColor);
      const array = new Uint8ClampedArray(imageData.data.length);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const [r, g, b, a] = imageData.data.slice(i, i + 4);
        array[i] = r;
        array[i + 1] = g;
        array[i + 2] = b;
        if (r === tr && g === tg && b === tb) {
          array[i + 3] = 0;
        } else {
          array[i + 3] = a;
        }
      }
      resolve(new ImageData(array, imageData.width, imageData.height));
    });
  }

    /**
   * @param {!ImageData} imageData
   * @param {?Object<string, string>} colorMap A map of (hex => hex)
   * @return !Promise<!ImageData>
   */
  function replaceColors(imageData, colorMap) {
    return new Promise(resolve => {
      if (!colorMap) {
        resolve(imageData);
      }
      const array = new Uint8ClampedArray(imageData.data.length);
      const entries = Object.entries(colorMap);

      const srcRGB = {};
      const destRGB = {};
      entries.forEach(([srcColor, destColor]) => {
        srcRGB[srcColor] = hex2rgb(srcColor);
        destRGB[destColor] = hex2rgb(destColor);
      });

      for (let i = 0; i < imageData.data.length; i += 4) {
        const [r, g, b, a] = imageData.data.slice(i, i + 4);
        array[i] = r;
        array[i + 1] = g;
        array[i + 2] = b;
        array[i + 3] = a;
        for (let j = 0; j < entries.length; j++) {
          const [srcColor, destColor] = entries[j];
          const [sr, sg, sb] = srcRGB[srcColor];
          const [dr, dg, db] = destRGB[destColor];

          if (r === sr && g === sg && b === sb) {
            array[i] = dr;
            array[i + 1] = dg;
            array[i + 2] = db;
            break;
          }
        }
      }
      resolve(new ImageData(array, imageData.width, imageData.height));
    });
  }

  /**
   * @param {string} hex e.g. '#ff0000'
   * @return {[int, int, int]} [r,g,b]
   */
  function hex2rgb(hex) {
    const div = document.createElement('div');
    div.style.backgroundColor = hex;
    return div.style.backgroundColor
      .split(/[(),]/)
      .map(c => parseInt(c))
      .filter(c => c != null && !isNaN(c));
  }

  window.jwb = window.jwb || {};
  jwb.utils = jwb.utils || {};
  jwb.utils.ImageUtils = {
    loadImage,
    applyTransparentColor,
    replaceColors,
    hex2rgb
  };
}
