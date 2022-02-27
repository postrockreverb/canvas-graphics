import React from 'react';
import { Cube } from './Cube';
import { Point } from './Point';
import { Slider } from './Slider';

const toRad = (degs) => {
  return (degs * Math.PI) / 180;
};

const initRotDeg = new Point(45, 45, 45);
const initRotRad = new Point(toRad(initRotDeg.get('x')), toRad(initRotDeg.get('y')), toRad(initRotDeg.get('z')));

class Canvas extends React.Component {
  constructor({ width, height }) {
    super();

    this.w = width;
    this.h = height;
    this.setContext = this.setContext.bind(this);

    var c = new Point(this.w / 2, this.h / 2, 0); // initial coordinates (center)
    var size = (this.w < this.h ? this.w : this.h) / 4; // size of cube
    this.cube = new Cube(c, size);

    this.cube.setRotationPoint(initRotRad);
  }

  setContext(r) {
    console.log(r);
    this.ctx = r.getContext('2d');
    // style
    this.ctx.fillStyle = 'white';
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = this.w / 100;
    this.ctx.lineCap = 'round';
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    this.ctx.fillRect(0, 0, this.w, this.h); // fill background
    this.cube.draw(this.ctx);
  }

  rotateCube(axes, degs) {
    const rads = toRad(degs);
    this.cube.setRotation(axes, rads);
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Slider label="x" min={0} max={360} defaultValue={initRotDeg.get('x')} onChange={(v) => this.rotateCube('x', v)} />
        <Slider label="y" min={0} max={360} defaultValue={initRotDeg.get('y')} onChange={(v) => this.rotateCube('y', v)} />
        <Slider label="z" min={0} max={360} defaultValue={initRotDeg.get('z')} onChange={(v) => this.rotateCube('z', v)} />
        <canvas width={this.w} height={this.h} ref={this.setContext} />
      </div>
    );
  }
}

export default Canvas;
