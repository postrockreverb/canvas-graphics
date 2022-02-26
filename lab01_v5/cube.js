class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// sliders

function toRads(degs) {
  return (degs * Math.PI) / 180;
}

var slider = new Point(
  document.getElementById("rangeX"),
  document.getElementById("rangeY"),
  document.getElementById("rangeZ")
);

var sliderValue = new Point(0, 0, 0);

slider.x.oninput = function () {
  rotate("x", toRads(this.value - sliderValue.x));
  sliderValue.x = this.value;
};
slider.y.oninput = function () {
  rotate("y", toRads(this.value));
};
slider.z.oninput = function () {
  rotate("z", toRads(this.value));
};

// ctx

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var h = document.documentElement.clientHeight;
var w = document.documentElement.clientWidth;
canvas.height = h;
canvas.width = w;

// style

ctx.fillStyle = "black";
ctx.strokeStyle = "yellow";
ctx.lineWidth = w / 100;
ctx.lineCap = "round";

// initial

var c = new Point(w / 2, h / 2, 0); // initial coordinates (center)
var curAngle = new Point(0, 0, 0); // initial rotation (isometrical)
var size = h / 4; // size of cube
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

// edges connection
// prettier-ignore
const edges = [
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

  // y = x z
  // z = x y
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
