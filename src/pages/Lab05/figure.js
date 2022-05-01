import { Point } from '../../utils/point.js';

const compareArrays = (arrayA, arrayB) => {
  return arrayA.length === arrayB.length && arrayA.every((e, i) => e === arrayB[i]);
};

const objectsEqual = (o1, o2) =>
  typeof o1 === 'object' && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
  if (dashLen == undefined) dashLen = 2;
  this.beginPath();
  this.moveTo(x1, y1);

  var dX = x2 - x1;
  var dY = y2 - y1;
  var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
  var dashX = dX / dashes;
  var dashY = dY / dashes;

  var q = 0;
  while (q++ < dashes) {
    x1 += dashX;
    y1 += dashY;
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
  }
  this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);

  this.stroke();
  this.closePath();
};

class Figure {
  state = {
    rotation: new Point(0, 0, 0),
  };

  constructor(canvas, center, size) {
    const ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;

    this.c = center;
    this.size = size;
    this.vertices = [];
    this.edges = [];
    this.faces = [];
    this.visibleEdges = [];

    this.showInvEdges = true;
    this.showVisEdges = true;
    this.showVert = 'Labels';

    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'thistle';
    ctx.lineWidth = this.canvas.width / 300;
    ctx.lineCap = 'round';
  }

  shape(vertices, edges, faces) {
    this.vertices = vertices;
    this.edges = edges;
    this.faces = faces;
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

  getVisible() {
    const visibleEdges = [];

    for (let face of this.faces) {
      const a = this.vertices[face[0]];
      const b = this.vertices[face[1]];
      const c = this.vertices[face[2]];

      const ax = b.x - a.x;
      const ay = b.y - a.y;

      const bx = c.x - b.x;
      const by = c.y - b.y;

      const z = ax * by - ay * bx;
      if (z < 0) {
        const curEdges = [];
        for (let i = 1; i < face.length; i++) curEdges.push([face[i - 1], face[i]]);
        curEdges.push([face[face.length - 1], face[0]]);
        curEdges.forEach((edge) => {
          let contains = false;
          for (const e of visibleEdges) {
            if (compareArrays(e.sort(), edge.sort())) contains = true;
          }
          if (!contains) visibleEdges.push(edge);
        });
      }
    }

    return visibleEdges;
  }

  drawPoints() {
    const ctx = this.ctx;
    const visibleVertices = new Set();
    for (const e of this.visibleEdges) for (const v of e) visibleVertices.add(v);
    ctx.font = `${Math.min(this.canvas.width, this.canvas.height) / 30}px Arial`;
    ctx.fillStyle = 'white';
    for (let i = 0; i < this.vertices.length; i++) {
      const v = this.vertices[i];
      if (visibleVertices.has(i)) {
        ctx.fillText(i, v.x, v.y);
      }
    }
  }

  drawCoordinates() {
    const ctx = this.ctx;
    const visibleVertices = new Set();
    for (const e of this.visibleEdges) for (const v of e) visibleVertices.add(v);
    ctx.font = `${Math.min(this.canvas.width, this.canvas.height) / 48}px Arial`;
    ctx.fillStyle = 'white';
    for (let i = 0; i < this.vertices.length; i++) {
      const v = this.vertices[i];
      if (visibleVertices.has(i)) {
        ctx.fillText(`(${Math.floor(v.x)}; ${Math.floor(v.y)}; ${Math.floor(v.z)})`, v.x, v.y);
      }
    }
  }

  drawVisible() {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.strokeStyle = '#DA70D6';
    for (let edge of this.visibleEdges) {
      const v1 = this.vertices[edge[0]];
      const v2 = this.vertices[edge[1]];
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v2.x, v2.y);
    }
    ctx.stroke();
  }

  drawInvisible() {
    const ctx = this.ctx;
    const invisibleEdges = [];

    for (const e of this.edges) {
      let contains = false;
      for (const v of this.visibleEdges) {
        if (compareArrays(v.sort(), e.sort())) contains = true;
      }
      if (!contains) invisibleEdges.push(e);
    }
    ctx.beginPath();
    ctx.strokeStyle = '#6a006a';
    for (let edge of invisibleEdges) {
      const v1 = this.vertices[edge[0]];
      const v2 = this.vertices[edge[1]];
      ctx.dashedLine(v1.x, v1.y, v2.x, v2.y, Math.min(this.canvas.width, this.canvas.height) / 72);
    }
    ctx.stroke();
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // fill background
    this.visibleEdges = this.getVisible();
    if (this.showInvEdges) this.drawInvisible();
    if (this.showVisEdges) this.drawVisible();
    if (this.showVert === 'Labels') this.drawPoints();
    if (this.showVert === 'Coords') this.drawCoordinates();
  }
}

class Cube extends Figure {
  constructor(canvas, c, size) {
    super(canvas, c, size);
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

    const f = [
      [0, 1, 2, 3],
      [0, 4, 5, 1],
      [1, 5, 6, 2],
      [3, 2, 6, 7],
      [0, 3, 7, 4],
      [4, 7, 6, 5],
    ];

    this.shape(v, e, f);
  }
}

class Pyramid extends Figure {
  constructor(canvas, c, size) {
    super(canvas, c, size);
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

    const f = [
      [0, 1, 2, 3],
      [4, 1, 0],
      [0, 3, 4],
      [2, 4, 3],
      [2, 1, 4],
    ];

    this.shape(v, e, f);
  }
}

class Diamond extends Figure {
  constructor(canvas, c, size) {
    super(canvas, c, size);
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

    const f = [
      [1, 0, 8],
      [2, 1, 8],
      [3, 2, 8],
      [4, 3, 8],
      [5, 4, 8],
      [6, 5, 8],
      [7, 6, 8],
      [0, 7, 8],

      [0, 1, 9],
      [1, 2, 9],
      [2, 3, 9],
      [3, 4, 9],
      [4, 5, 9],
      [5, 6, 9],
      [6, 7, 9],
      [7, 0, 9],
    ];

    this.shape(v, e, f);
  }
}

export { Cube, Pyramid, Diamond };
