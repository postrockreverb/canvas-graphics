const COLOR_BG = "black";
const COLOR_CUBE = "yellow";

// rotation speed
const SPEED_X = 0.01;
const SPEED_Y = 0.01;
const SPEED_Z = 0.01;

class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

var sliderX = document.getElementById("rangeX");
var sliderY = document.getElementById("rangeY");
var sliderZ = document.getElementById("rangeZ");

var rotationX, rotationY, rotationZ;

function toRads(degs) {
  return (degs * Math.PI) / 180;
}

sliderX.oninput = function () {
  rotate("x", toRads(this.value));
};
sliderY.oninput = function () {
  rotate("y", toRads(this.value));
};
sliderZ.oninput = function () {
  rotate("z", toRads(this.value));
};

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var h = document.documentElement.clientHeight;
var w = document.documentElement.clientWidth;
canvas.height = h;
canvas.width = w;

ctx.fillStyle = COLOR_BG;
ctx.strokeStyle = COLOR_CUBE;
ctx.lineWidth = w / 100;
ctx.lineCap = "round";

var c = new Point(w / 2, h / 2, 0); // initial coordinates (center)
var size = h / 4;
var vertices = [
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
var edges = [
  [0, 1],[1, 2],[2, 3],[3, 0],[4, 5],[5, 6],
  [6, 7],[7, 4],[0, 4],[1, 5],[2, 6],[3, 7],
];

function rotate(axes, angle) {
  if (axes === "x") {
    for (let v of vertices) {
      let dy = v.y - c.y;
      let dz = v.z - c.z;
      let y = dy * Math.cos(angle) - dz * Math.sin(angle);
      let z = dy * Math.sin(angle) + dz * Math.cos(angle);
      v.y = y + c.y;
      v.z = z + c.z;
    }
  }
  if (axes === "y") {
    for (let v of vertices) {
      let dx = v.x - c.x;
      let dz = v.z - c.z;
      let x = dz * Math.sin(angle) + dx * Math.cos(angle);
      let z = dz * Math.cos(angle) - dx * Math.sin(angle);
      v.x = x + c.x;
      v.z = z + c.z;
    }
  }
  if (axes === "z") {
    for (let v of vertices) {
      let dx = v.x - c.x;
      let dy = v.y - c.y;
      let x = dx * Math.cos(angle) - dy * Math.sin(angle);
      let y = dx * Math.sin(angle) + dy * Math.cos(angle);
      v.x = x + c.x;
      v.y = y + c.y;
    }
  }
}

function drawCube() {
  for (let edge of edges) {
    ctx.beginPath();
    ctx.moveTo(vertices[edge[0]].x, vertices[edge[0]].y);
    ctx.lineTo(vertices[edge[1]].x, vertices[edge[1]].y);
    ctx.stroke();
  }
}

// prettier-ignore
var timeDelta, timeLast = 0;
requestAnimationFrame(loop);

function loop(timeNow) {
  timeDelta = timeNow - timeLast;
  timeLast = timeNow;

  ctx.fillRect(0, 0, w, h); // background

  drawCube();
  requestAnimationFrame(loop);
}
