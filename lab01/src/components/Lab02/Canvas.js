import * as math from 'mathjs';
import { cubicSplineInterpolation } from './CubicSplineInterpolation';

const initialKnots = [
  { x: 50, y: 150 },
  { x: 100, y: 170 },
  { x: 150, y: 250 },
  { x: 200, y: 400 },
  { x: 300, y: 350 },
  { x: 400, y: 250 },
  { x: 500, y: 50 },
  { x: 600, y: 250 },
  { x: 650, y: 200 },
  { x: 700, y: 180 },
  { x: 725, y: 120 },
  { x: 750, y: 90 },
];

export class Canvas {
  constructor(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available.');
    this.canvas = canvas;
    this.ctx = ctx;
  }

  clearCanvas() {
    const ctx = this.ctx;
    ctx.save();
    const width = this.canvas.width;
    const height = this.canvas.height;
    ctx.fillStyle = '#F8F8F8';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  drawFunctionCurveFromKnots() {
    const ctx = this.ctx;
    const functions = cubicSplineInterpolation(initialKnots, 'quadratic');
    for (const f of functions) {
      for (let x = f.range.xmin; x < f.range.xmax; x++) {
        const y = f.a * math.pow(x, 3) + f.b * math.pow(x, 2) + f.c * x + f.d;
        ctx.save();
        ctx.beginPath();
        ctx.fillRect(x, y, 2, 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  drawKnots() {
    const ctx = this.ctx;
    for (let i = 0; i < initialKnots.length; i++) {
      const knot = initialKnots[i];
      ctx.save();
      ctx.beginPath();
      ctx.arc(knot.x, knot.y, 5, 0, 2 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#CC4444';
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
