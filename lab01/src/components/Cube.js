import { Point } from './Point.js';

// edges connection
// prettier-ignore
const edges = [
  [0, 1],[1, 2],[2, 3],[3, 0],[4, 5],[5, 6],
  [6, 7],[7, 4],[0, 4],[1, 5],[2, 6],[3, 7],
];

class Cube {
  state = {
    rotation: new Point(0, 0, 0),
  };

  constructor(c, size) {
    this.c = c;
    this.size = size;
    this.vertices = [
      new Point(c.x - size, c.y - size, c.z - size),
      new Point(c.x + size, c.y - size, c.z - size),
      new Point(c.x + size, c.y + size, c.z - size),
      new Point(c.x - size, c.y + size, c.z - size),
      new Point(c.x - size, c.y - size, c.z + size),
      new Point(c.x + size, c.y - size, c.z + size),
      new Point(c.x + size, c.y + size, c.z + size),
      new Point(c.x - size, c.y + size, c.z + size),
    ];
  }

  setRotation(axes, rads) {
    const drads = rads - this.state.rotation.get(axes);
    this.state.rotation.set(axes, rads);
    this.rotate(axes, drads);
  }

  setRotationPoint(point) {
    this.setRotation('x', point.get('x'));
    this.setRotation('y', point.get('y'));
    this.setRotation('z', point.get('z'));
  }

  getRotationRad() {
    return this.rotate();
  }

  rotate(axes, rads) {
    let axisDict = {
      x: ['y', 'z'],
      y: ['x', 'z'],
      z: ['x', 'y'],
    };
    let a = axisDict[axes][0];
    let b = axisDict[axes][1];

    for (let v of this.vertices) {
      let distA = v.get(a) - this.c.get(a);
      let distB = v.get(b) - this.c.get(b);

      let valA = distA * Math.cos(rads) - distB * Math.sin(rads);
      let valB = distA * Math.sin(rads) + distB * Math.cos(rads);

      v.set(a, valA + this.c.get(a));
      v.set(b, valB + this.c.get(b));
    }
  }

  draw(ctx) {
    for (let edge of edges) {
      ctx.beginPath();
      ctx.moveTo(this.vertices[edge[0]].x, this.vertices[edge[0]].y);
      ctx.lineTo(this.vertices[edge[1]].x, this.vertices[edge[1]].y);
      ctx.stroke();
    }
  }
}

export { Cube };
