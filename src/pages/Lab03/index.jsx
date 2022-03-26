import styles from './index.module.css';

import React from 'react';

import { Surface } from './surface';

import { Point } from '../../utils/point.js';

import { Slider } from '../../components/Slider/Slider';

const points = [new Point(200, 200, 0), new Point(300, 300, 200), new Point(300, 200, 200), new Point(200, 300, 0)];

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

    this.figure = new Surface(this.canvasRef.current, points);
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
