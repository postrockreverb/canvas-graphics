import { Cube } from '../Lab01/figure';
import { Point } from '../../utils/point';
import { toRad } from '../../utils/toRad';

const scalePoint = (point, factor) => {
  return new Point(point.get('x') * factor, point.get('y') * factor, point.get('z') * factor);
};

const addPoint = (pointA, pointB) => {
  return new Point(pointA.get('x') + pointB.get('x'), pointA.get('y') + pointB.get('y'), pointA.get('z') + pointB.get('z'));
};

export class Surface {
  constructor(canvas, knots) {
    const ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;
    this.knots = knots;

    this.size = 100;
    this.center = this.getCenter();
    this.cube = new Cube(this.canvas, this.center, this.size);

    this.bSurface = [];
  }

  getCenter() {
    const knots = this.knots;
    let center = new Point(0, 0, 0);
    let i = 0;
    for (; i < knots.length; i++) {
      const p = knots[i];
      center = addPoint(center, p);
    }
    center = scalePoint(center, 1 / i);
    return center;
  }

  buildSurface() {
    const interpolate = (u, w) => {
      const points = [];
      const knots = this.knots;

      points[0] = scalePoint(knots[0], (1 - u) * (1 - w));
      points[1] = scalePoint(knots[1], (1 - u) * w);
      points[2] = scalePoint(knots[2], u * (1 - w));
      points[3] = scalePoint(knots[3], u * w);

      let res = new Point(0, 0, 0);
      res = addPoint(res, points[0]);
      res = addPoint(res, points[1]);
      res = addPoint(res, points[2]);
      res = addPoint(res, points[3]);
      return res;
    };

    for (let i = 0; i < 1; i += 0.1)
      for (let j = 0; j < 1; j += 0.1) {
        this.bSurface.push(interpolate(i, j, this.knots));
      }
  }

  rotateBSurface(axes, rads) {
    let axisDict = {
      x: ['y', 'z'],
      y: ['x', 'z'],
      z: ['x', 'y'],
    };
    let a = axisDict[axes][0];
    let b = axisDict[axes][1];

    for (let v of this.bSurface) {
      let distA = v.get(a) - this.center.get(a);
      let distB = v.get(b) - this.center.get(b);

      let valA = distA * Math.cos(rads) - distB * Math.sin(rads);
      let valB = distA * Math.sin(rads) + distB * Math.cos(rads);

      v.set(a, valA + this.center.get(a));
      v.set(b, valB + this.center.get(b));
    }
  }

  // --------------------------------------------------

  rotate(axes, degs) {
    const rads = toRad(degs);
    this.cube.setRotation(axes, rads);
    this.rotateBSurface(axes, rads);
    this.draw();
  }

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
    for (const p of this.bSurface) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }
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
    this.cube.draw();

    this.buildSurface();
    this.drawSurface();

    // this.drawKnots();
  }
}
