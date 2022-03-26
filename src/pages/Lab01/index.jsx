import styles from './index.module.css';

import React, { useState, useRef, useEffect } from 'react';

import { Cube, Pyramid, Diamond } from './figure';

import { Point } from '../../utils/point';
import { toRad } from '../../utils/toRad';

import { Slider } from '../../components/Slider/Slider';
import { Selector } from '../../components/Selector/Selector';

const initRotDeg = new Point(45, 45, 36);
const initRotRad = new Point(toRad(initRotDeg.get('x')), toRad(initRotDeg.get('y')), toRad(initRotDeg.get('z')));

class CanvasProvider extends React.Component {
  constructor({ width, height }) {
    super();
    this.width = width;
    this.height = height;

    this.center = new Point(width / 2, height / 2, 0);
    this.size = (width < height ? width : height) / 4;

    this.canvasRef = React.createRef();

    this.figure = null;
  }

  componentDidMount() {
    this.canvasRef.current.width = this.width;
    this.canvasRef.current.height = this.height;

    this.figure = new Diamond(this.canvasRef.current, this.center, this.size);
    this.figure.setRotationPoint(initRotRad);

    this.figure.draw();
  }

  rotateFigure(axes, degs) {
    const rads = toRad(degs);
    this.figure.setRotation(axes, rads);
    this.figure.draw();
  }

  changeFigure(name) {
    const currentRotation = this.figure.getRotation();
    const figures = {
      Diamond: new Diamond(this.canvasRef.current, this.center, this.size),
      Cube: new Cube(this.canvasRef.current, this.center, this.size),
      Pyramid: new Pyramid(this.canvasRef.current, this.center, this.size),
    };
    this.figure = figures[name];
    this.figure.setRotationPoint(currentRotation);
    this.figure.draw();
  }

  render() {
    return (
      <>
        <div className={styles.sliders}>
          <Selector onChange={(o) => this.changeFigure(o)} options={options} />
          <Slider
            label="x"
            min={0}
            max={360}
            defaultValue={initRotDeg.get('x')}
            onChange={(e) => this.rotateFigure('x', e.target.value)}
          />
          <Slider
            label="y"
            min={0}
            max={360}
            defaultValue={initRotDeg.get('y')}
            onChange={(e) => this.rotateFigure('y', e.target.value)}
          />
          <Slider
            label="z"
            min={0}
            max={360}
            defaultValue={initRotDeg.get('z')}
            onChange={(e) => this.rotateFigure('z', e.target.value)}
          />
        </div>
        <canvas ref={this.canvasRef} width={this.width} height={this.height} />
      </>
    );
  }
}

export default CanvasProvider;

const options = {
  Diamond: 'Diamond',
  Cube: 'Cube',
  Pyramid: 'Pyramid',
};
