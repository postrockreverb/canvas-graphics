import { Point } from './point';

export class Entity {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  points: Point[];
  pivot: Point;

  constructor(canvas: HTMLCanvasElement, points: Point[], pivot: Point) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.points = points;
    this.pivot = pivot;
  }
}
