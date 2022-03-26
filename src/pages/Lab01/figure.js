import { Point } from '../../utils/point.js';

class Figure {
  state = {
    rotation: new Point(0, 0, 0),
  };

  constructor(c, size) {
    this.c = c;
    this.size = size;
    this.vertices = [];
    this.edges = [];
  }

  shape(vertices, edges) {
    this.vertices = vertices;
    this.edges = edges;
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

  getRotation() {
    return this.state.rotation;
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
    for (let edge of this.edges) {
      ctx.beginPath();
      ctx.moveTo(this.vertices[edge[0]].x, this.vertices[edge[0]].y);
      ctx.lineTo(this.vertices[edge[1]].x, this.vertices[edge[1]].y);
      ctx.stroke();
    }
  }
}

class Cube extends Figure {
  constructor(c, size) {
    super(c, size);
    const v = [
      new Point(c.x - size, c.y - size, c.z - size),
      new Point(c.x + size, c.y - size, c.z - size),
      new Point(c.x + size, c.y + size, c.z - size),
      new Point(c.x - size, c.y + size, c.z - size),
      new Point(c.x - size, c.y - size, c.z + size),
      new Point(c.x + size, c.y - size, c.z + size),
      new Point(c.x + size, c.y + size, c.z + size),
      new Point(c.x - size, c.y + size, c.z + size),
    ];
    // prettier-ignore
    const e = [
      [0, 1],[1, 2],[2, 3],[3, 0],[4, 5],[5, 6],
      [6, 7],[7, 4],[0, 4],[1, 5],[2, 6],[3, 7],
    ];

    this.shape(v, e);
  }
}

class Pyramid extends Figure {
  constructor(c, size) {
    super(c, size);
    const v = [
      new Point(c.x - size, c.y - size, c.z - size),
      new Point(c.x + size, c.y - size, c.z - size),
      new Point(c.x + size, c.y + size, c.z - size),
      new Point(c.x - size, c.y + size, c.z - size),
      new Point(c.x, c.y, c.z + size),
    ];
    // prettier-ignore
    const e = [
      [0, 1],[1, 2],[2, 3],[3, 0],[0, 4],[1, 4],
      [2, 4],[3, 4],
    ];

    this.shape(v, e);
  }
}

class Diamond extends Figure {
  constructor(c, size) {
    super(c, size);
    const v = [
      new Point(c.x - size / 2, c.y - size, c.z),
      new Point(c.x + size / 2, c.y - size, c.z),
      new Point(c.x + size, c.y - size / 2, c.z),
      new Point(c.x + size, c.y + size / 2, c.z),
      new Point(c.x + size / 2, c.y + size, c.z),
      new Point(c.x - size / 2, c.y + size, c.z),
      new Point(c.x - size, c.y + size / 2, c.z),
      new Point(c.x - size, c.y - size / 2, c.z),

      new Point(c.x, c.y, c.z + size / 2),
      new Point(c.x, c.y, c.z - size),
    ];
    // prettier-ignore
    const e = [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],
      [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],
      [0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],
    ];

    this.shape(v, e);
  }
}

export { Cube, Pyramid, Diamond };
