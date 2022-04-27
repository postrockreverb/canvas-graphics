import { Point } from '../../utils/point';
import { Line } from './line';
import { Rectangle } from './rectangle';

const rect = new Rectangle(new Point(400, 500), new Point(100, 200));

export class Surface {
  constructor(canvas, linesArray) {
    const ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;

    rect.move(100, 200);
    this.rect = rect;
    this.lines = linesArray;
  }

  // --------------------------------------------------

  clearCanvas() {
    const ctx = this.ctx;
    ctx.save();
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  drawSurface() {
    const ctx = this.ctx;

    this.lines.forEach((e) => e.draw(ctx, '#483d8b'));
    const trimmed = this.lines.map((e) => this.trimLine(e, 10));
    trimmed.forEach((e) => {
      if (e) e.draw(ctx, '#ee82ee');
    });
    this.rect.draw(ctx);
  }

  // ----

  moveRect(x, y) {
    rect.move(x, y);
  }

  // ----

  trimLine(line, depth) {
    let lineArray = [line];
    for (let i = 0; i < depth; i++) lineArray = this.rec(lineArray);
    return this.removeOutBounds(lineArray);
  }

  rec(lineArray) {
    const line = lineArray;
    for (let i = 0, br = 0; i < line.length && br < 100; i++, br++) {
      const l = line[i];
      if (this.inBounds(l)) continue;
      line.splice(i, 1, ...l.div());
      if (!this.inPartBounds(l)) i++;
    }
    return line;
  }

  removeOutBounds(lineArray) {
    const line = lineArray;
    for (let i = 0; i < line.length; i++) {
      const l = line[i];
      if (!this.inPartBounds(l)) {
        line.splice(i, 1);
        i--;
      }
    }
    if (line.length) return new Line(line[0].knotA, line[line.length - 1].knotB);
  }

  inPartBounds(line) {
    const rect = this.rect;
    return rect.hasPoint(line.knotA) || rect.hasPoint(line.knotB);
  }

  inBounds(line) {
    const rect = this.rect;
    return rect.hasPoint(line.knotA) && rect.hasPoint(line.knotB);
  }

  //----

  draw() {
    this.clearCanvas();
    this.drawSurface();
  }
}
