import styles from './index.module.css';

import React from 'react';

import { Surface } from './surface';

import { Point } from '../../utils/point.js';

import { Slider } from '../../components/Slider/Slider';

const getCenteredPoints = (width, height) => {
  const points = [new Point(0, 0, 1), new Point(0, 1, 0), new Point(1, 0, 0), new Point(1, 1, 1)];
  const center = new Point(width / 2, height / 2, 0);
  const size = (width < height ? width : height) / 2;
  points.map((item) => {
    item.scalePoint(size);
    item.addPoint(center);
    item.x -= size / 2;
    item.y -= size / 2;
  });
  return points;
};

class CanvasProvider extends React.Component {
  constructor({ width, height }) {
    super();
    this.width = width;
    this.height = height;
    this.canvasRef = React.createRef();

    this.figure = null;
  }

  componentDidMount() {
    this.canvasRef.current.width = this.width;
    this.canvasRef.current.height = this.height;

    this.figure = new Surface(this.canvasRef.current, getCenteredPoints(this.width, this.height));
    this.figure.draw();
  }

  render() {
    return (
      <>
        <div className={styles.sliders}>
          <Slider label="x" min={0} max={360} defaultValue={0} onChange={(e) => this.figure.rotate('x', e.target.value)} />
          <Slider label="y" min={0} max={360} defaultValue={0} onChange={(e) => this.figure.rotate('y', e.target.value)} />
          <Slider label="z" min={0} max={360} defaultValue={0} onChange={(e) => this.figure.rotate('z', e.target.value)} />
        </div>
        <canvas ref={this.canvasRef} width={this.width} height={this.height} />
      </>
    );
  }
}

export default CanvasProvider;
