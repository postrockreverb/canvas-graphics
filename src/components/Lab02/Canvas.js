import { cubicSplineInterpolation } from './CubicSplineInterpolation';

Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
};

export class Canvas {
  setBoundaryCondition(condition) {
    this.boundaryCondition = condition;
    this.draw();
  }

  constructor(canvas, knots) {
    const ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;
    this.knots = knots;
    this.selectedKnot = undefined;
    this.boundaryCondition = 'fixed';
  }

  startDragging(cursor) {
    this.selectedKnot = this.getNearestKnot(cursor);
  }

  stopDragging() {
    this.selectedKnot = undefined;
  }

  dragPoint(cursor) {
    if (this.selectedKnot !== undefined) {
      this.moveKnot(this.selectedKnot, cursor);
    }
  }

  moveKnot(nKnot, newPosition) {
    this.knots[nKnot] = newPosition;
    this.sortKnots();
    this.selectedKnot = this.getNearestKnot(newPosition);
  }

  sortKnots() {
    const knots = this.knots;
    const selected = this.selectedKnot;
    if (selected !== knots.length - 1 && knots[selected].x > knots[selected + 1].x) this.knots.swap(selected, selected + 1);
    else if (selected !== 0 && knots[selected].x < knots[selected - 1].x) this.knots.swap(selected, selected - 1);
  }

  getNearestKnot(point) {
    const knots = this.knots;
    const radius = 15;
    for (let i = 0; i < knots.length; i++) {
      const knot = knots[i];
      if (Math.abs(point.x - knot.x) <= radius && Math.abs(point.y - knot.y) <= radius) {
        return i;
      }
    }
    return undefined;
  }

  //------------------------------------------------------------

  clearCanvas() {
    const ctx = this.ctx;
    ctx.save();
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  drawFunctionCurveFromKnots() {
    const ctx = this.ctx;
    const knots = this.knots;
    const functions = cubicSplineInterpolation(knots, this.boundaryCondition);

    ctx.save();
    ctx.beginPath();
    for (const f of functions) {
      for (let x = f.range.xmin; x < f.range.xmax; x++) {
        const y = f.a * Math.pow(x, 3) + f.b * Math.pow(x, 2) + f.c * x + f.d;
        ctx.lineTo(x, y);
      }
    }
    ctx.lineWidth = 3;
    ctx.fillStyle = 'thistle';
    ctx.strokeStyle = 'thistle';
    ctx.stroke();
    ctx.restore();
  }

  drawKnots() {
    const ctx = this.ctx;
    const knots = this.knots;
    for (let i = 0; i < knots.length; i++) {
      const isSelected = i === this.selectedKnot;
      const knot = knots[i];
      ctx.save();
      ctx.beginPath();
      ctx.arc(knot.x, knot.y, 5, 0, 2 * Math.PI);
      ctx.lineWidth = isSelected ? 5 : 3;
      ctx.strokeStyle = isSelected ? '#0080FF' : '#CC4444';
      ctx.stroke();
      ctx.restore();
    }
  }

  draw() {
    this.clearCanvas();
    this.drawFunctionCurveFromKnots();
    this.drawKnots();
  }
}
