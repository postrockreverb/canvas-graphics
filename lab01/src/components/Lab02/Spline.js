import { interpolate } from './interpolate';

export default class Spline {
  state = {
    points: [
      [50, 50],
      [100, 250],
      [350, 100],
      [450, 450],
    ],
    degree: 2,
  };

  draw(ctx) {
    var pointPrev = this.state.points[0];
    for (var t = 0; t < 1; t += 0.01) {
      var point = interpolate(t, this.state.degree, this.state.points);
      ctx.beginPath();
      ctx.moveTo(pointPrev[0], pointPrev[1]);
      ctx.lineTo(point[0], point[1]);
      ctx.stroke();
      pointPrev = point;
    }

    for (let p of this.state.points) {
      ctx.beginPath();
      ctx.arc(p[0], p[1], 4, 0, 2 * Math.PI, true);
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();
    }
  }
}
