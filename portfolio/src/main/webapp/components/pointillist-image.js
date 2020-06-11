/*
 *  Reconstructs an image using coarser pixels.
 *  If there are multiple pointillist images to be rendered,
 *  simply instantiate multiple instances of the
 *  PointillistImage class in the preload() function.
 *  Built using P5, an open-source library for animation and
 *  drawing under the GNU Lesser General Public License.
 */

let pointillistName;

/* eslint-disable */
function preload() {
  pointillistName = new PointillistImage('../assets/name.png', 2, 50, 'name');
  pointillistName.preload();
}

function setup() {
  pointillistName.setup();
}

function draw() {
  pointillistName.draw();
}
/* eslint-enable */

/* eslint-disable */
class PointillistImage {
  constructor(imgPath, pointSize, batchSize, canvasParent) {
    this.imgPath = imgPath;
    this.pointSize = pointSize;
    this.batchSize = batchSize;
    this.canvasParent = canvasParent;
  }

  preload() {
    this.img = loadImage(this.imgPath);
  }

  setup() {
    const canvas = createCanvas(this.img.width, this.img.height);
    canvas.parent(this.canvasParent);
    noStroke();
    background(255);
    this.img.loadPixels();
  }

  draw() {
    let i = 0;
    while (i < this.batchSize) {
      this._drawPixel();
      i += 1;
    }
  }

  _drawPixel() {
    const x = floor(random(this.img.width));
    const y = floor(random(this.img.height));
    const fillColor = this.img.get(x, y);
    fill(fillColor, 128);
    ellipse(x, y, this.pointSize, this.pointSize);
  }
}
/* eslint-enable */
