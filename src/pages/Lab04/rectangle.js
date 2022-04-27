import { Point } from '../../utils/point';

export class Rectangle {
  constructor(knotA, knotB) {
    this.knots = this.mapKnots(knotA, knotB);
  }

  mapKnots(knotA, knotB) {
    const knots = [];
    knots[0] = knotA;
    knots[1] = new Point(knotA.x, knotB.y);
    knots[2] = knotB;
    knots[3] = new Point(knotB.x, knotA.y);
    return knots;
  }

  move(x, y) {
    const knots = this.knots;
    const rectCenter = new Point((knots[0].x + knots[2].x) / 2, (knots[0].y + knots[2].y) / 2);
    const dxy = new Point(x - rectCenter.x, y - rectCenter.y);
    knots.forEach((k) => k.addPoint(dxy));
  }

  draw(ctx) {
    const knots = this.knots;
    ctx.save();
    ctx.beginPath();
    for (const p of knots) {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(knots[0].x, knots[0].y);
    ctx.stroke();
    ctx.restore();
  }

  hasPointOnEdge(point) {
    const hasPointOnLine = (point1, point2, currPoint) => {
      const dxc = currPoint.x - point1.x;
      const dyc = currPoint.y - point1.y;

      const dxl = point2.x - point1.x;
      const dyl = point2.y - point1.y;

      const cross = dxc * dyl - dyc * dxl;
      if (cross != 0) return false;

      if (Math.abs(dxl) >= Math.abs(dyl))
        return dxl > 0 ? point1.x <= currPoint.x && currPoint.x <= point2.x : point2.x <= currPoint.x && currPoint.x <= point1.x;
      else
        return dyl > 0 ? point1.y <= currPoint.y && currPoint.y <= point2.y : point2.y <= currPoint.y && currPoint.y <= point1.y;
    };
    for (let i = 1; i < this.knots.length; i++) {
      const a = this.knots[i - 1];
      const b = this.knots[i];
      if (hasPointOnLine(a, b, point)) return true;
    }
    return false;
  }

  hasPoint(point) {
    const knots = this.knots;
    const x = point.x;
    const y = point.y;

    const x1 = knots[0].x;
    const y1 = knots[0].y;
    const x2 = knots[1].x;
    const y2 = knots[1].y;
    const x3 = knots[2].x;
    const y3 = knots[2].y;
    const x4 = knots[3].x;
    const y4 = knots[3].y;

    let s, s1, s2, s3, square;

    s = 0.5 * Math.abs((x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3));
    s1 = 0.5 * Math.abs((x - x3) * (y2 - y3) - (x2 - x3) * (y - y3));
    s2 = 0.5 * Math.abs((x1 - x3) * (y - y3) - (x - x3) * (y1 - y3));
    s3 = 0.5 * Math.abs((x1 - x) * (y2 - y) - (x2 - x) * (y1 - y));
    if (s == s1 + s2 + s3) return true;
    square = square + s;

    s = 0.5 * Math.abs((x1 - x4) * (y3 - y4) - (x3 - x4) * (y1 - y4));
    s1 = 0.5 * Math.abs((x - x4) * (y3 - y4) - (x3 - x4) * (y - y4));
    s2 = 0.5 * Math.abs((x1 - x4) * (y - y4) - (x - x4) * (y1 - y4));
    s3 = 0.5 * Math.abs((x1 - x) * (y3 - y) - (x3 - x) * (y1 - y));
    if (s == s1 + s2 + s3) return true;
    square = square + s;

    return false;
  }
}
