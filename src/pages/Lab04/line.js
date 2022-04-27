import { Point } from '../../utils/point';

export class Line {
  constructor(knotA, knotB) {
    this.knotA = knotA;
    this.knotB = knotB;
  }

  draw(ctx, color) {
    const a = this.knotA;
    const b = this.knotB;

    ctx.save();

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  setPoints(knotA, knotB) {
    this.knotA = knotA;
    this.knotB = knotB;
  }

  getMiddlePoint() {
    const knotA = this.knotA;
    const knotB = this.knotB;
    return new Point((knotA.x + knotB.x) / 2, (knotA.y + knotB.y) / 2);
  }

  drawMiddlePoint(ctx) {
    const middle = this.getMiddlePoint();
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.fillRect(middle.x, middle.y, 5, 5);
    ctx.restore();
  }

  div() {
    return [new Line(this.knotA, this.getMiddlePoint()), new Line(this.getMiddlePoint(), this.knotB)];
  }
}
