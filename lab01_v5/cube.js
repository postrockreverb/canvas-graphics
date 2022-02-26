class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get(coordName) {
    switch (coordName) {
      case "x":
        return this.x;

      case "y":
        return this.y;

      case "z":
        return this.z;

      default:
        break;
    }
  }

  set(coordName, value) {
    switch (coordName) {
      case "x":
        this.x = value;
        break;

      case "y":
        this.y = value;
        break;

      case "z":
        this.z = value;
        break;

      default:
        break;
    }
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
  rotate("y", toRads(this.value - sliderValue.y));
  sliderValue.y = this.value;
};
slider.z.oninput = function () {
  rotate("z", toRads(this.value - sliderValue.z));
  sliderValue.z = this.value;
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
  axisDict = {
    x: ["y", "z"],
    y: ["x", "z"],
    z: ["x", "y"],
  };
  let a = axisDict[axes][0];
  let b = axisDict[axes][1];

  for (let v of vertices) {
    let distA = v.get(a) - c.get(a);
    let distB = v.get(b) - c.get(b);

    let valA = distA * Math.cos(angle) - distB * Math.sin(angle);
    let valB = distA * Math.sin(angle) + distB * Math.cos(angle);

    v.set(a, valA + c.get(a));
    v.set(b, valB + c.get(b));
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

  ctx.fillRect(0, 0, w, h); // fill background

  drawCube();
  requestAnimationFrame(loop);
}
