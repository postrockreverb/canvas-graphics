import { Cube } from '../Lab01/figure';
import { Point } from '../../utils/point';
import { toRad } from '../../utils/toRad';

export class Surface {
  state = {
    rotation: new Point(0, 0, 0),
  };

  constructor(canvas, knots) {
    const getCenter = () => {
      const knots = this.knots;
      const center = new Point(0, 0, 0);
      let i = 0;
      for (; i < knots.length; i++) {
        center.addPoint(knots[i]);
      }
      center.scalePoint(1 / i);
      return center;
    };

    const getSize = () => {
      const knots = this.knots.map((item) => {
        const p = new Point(item.x, item.y, item.z);
        p.subtrPoint(this.center);
        return p;
      });

      const diff = new Point(0, 0, 0);
      const dims = ['x', 'y', 'z'];
      for (const p of knots)
        for (const d of dims) {
          if (p.get(d) > diff.get(d)) diff.set(d, p.get(d));
        }

      return Math.max(diff.x, diff.y, diff.z);
    };

    const ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;
    this.knots = knots;

    this.center = getCenter();
    this.size = getSize();
    this.cube = new Cube(this.canvas, this.center, this.size);
    this.drawMethod = 'lines';

    this.bSurface = [];
    this.buildSurface(20);
  }

  buildSurface(density) {
    const interpolate = (u, w) => {
      const knots = this.knots.map((item) => {
        return new Point(item.x, item.y, item.z);
      });

      knots[0].scalePoint((1 - u) * (1 - w));
      knots[1].scalePoint((1 - u) * w);
      knots[2].scalePoint(u * (1 - w));
      knots[3].scalePoint(u * w);

      let res = new Point(0, 0, 0);
      res.addPoint(knots[0]);
      res.addPoint(knots[1]);
      res.addPoint(knots[2]);
      res.addPoint(knots[3]);
      return res;
    };

    const surface = [];
    density = 1 / density;
    for (let i = 0; i < 1; i += density)
      for (let j = 0; j < 1; j += density) {
        surface.push(interpolate(i, j, this.knots));
      }

    this.bSurface = surface;
  }

  rotateSurface(axes, rads) {
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

  setRotation(axes, rads) {
    const drads = rads - this.state.rotation.get(axes);
    this.state.rotation.set(axes, rads);
    this.rotateSurface(axes, drads);
    this.cube.rotate(axes, drads);
  }

  rotate(axes, degs) {
    const rads = toRad(degs);
    this.setRotation(axes, rads);
    this.draw();
  }

  setDensity(value) {
    this.buildSurface(value);
    this.rotateSurface('x', this.state.rotation.x);
    this.rotateSurface('y', this.state.rotation.y);
    this.rotateSurface('z', this.state.rotation.z);
    this.draw();
  }

  setDrawMethod(value) {
    this.drawMethod = value;
    this.draw();
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

  drawSurface(style) {
    const ctx = this.ctx;

    const drawDots = () => {
      for (const p of this.bSurface) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawLines = () => {
      ctx.save();
      ctx.beginPath();
      for (const p of this.bSurface) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI);
      }
      ctx.stroke();
      ctx.restore();
    };

    if (style === 'lines') drawLines();
    else drawDots();
  }

  draw() {
    this.clearCanvas();
    this.drawSurface(this.drawMethod);
    this.cube.drawCube();
  }
}
