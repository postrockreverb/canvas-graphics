import React from 'react';
import { Cube, Pyramid } from './Figure';
import Point from './Point';
import Slider from './Slider';
import Selector from './Selector';

const toRad = (degs) => {
  return (degs * Math.PI) / 180;
};

const initRotDeg = new Point(45, 45, 36);
const initRotRad = new Point(toRad(initRotDeg.get('x')), toRad(initRotDeg.get('y')), toRad(initRotDeg.get('z')));

class Canvas extends React.Component {
  constructor({ width, height }) {
    super();

    this.w = width;
    this.h = height;
    this.setContext = this.setContext.bind(this);

    var c = new Point(this.w / 2, this.h / 2, 0); // initial coordinates (center)
    var size = (this.w < this.h ? this.w : this.h) / 4; // size of cube
    this.figure = new Cube(c, size);

    this.figure.setRotationPoint(initRotRad);
  }

  setContext(r) {
    console.log(r);
    this.ctx = r.getContext('2d');
    // style
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'thistle';
    this.ctx.lineWidth = this.w / 300;
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
    this.figure.draw(this.ctx);
  }

  rotateFigure(axes, degs) {
    const rads = toRad(degs);
    this.figure.setRotation(axes, rads);
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <div style={styles.sliders}>
          <Slider label="x" min={0} max={360} defaultValue={initRotDeg.get('x')} onChange={(v) => this.rotateFigure('x', v)} />
          <Slider label="y" min={0} max={360} defaultValue={initRotDeg.get('y')} onChange={(v) => this.rotateFigure('y', v)} />
          <Slider label="z" min={0} max={360} defaultValue={initRotDeg.get('z')} onChange={(v) => this.rotateFigure('z', v)} />
        </div>
        <canvas width={this.w} height={this.h} ref={this.setContext} />
      </div>
    );
  }
}

export default Canvas;

const styles = {
  sliders: {
    padding: '7px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'black',
    color: 'white',
    fontSize: 'large',
  },
};
