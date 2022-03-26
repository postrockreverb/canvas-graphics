export class Surface {
  constructor(canvas, points) {
    const ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.ctx = ctx;
    this.points = points;
  }

  getPoints() {}
}
