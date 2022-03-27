import styles from './index.module.css';

import React from 'react';

import { Surface } from './surface';

import { Point } from '../../utils/point.js';

import { Slider } from '../../components/Slider/Slider';
import { Selector } from '../../components/Selector/Selector';

const points = [new Point(0, 0, 1), new Point(0, 1, 0), new Point(1, 0, 0), new Point(1, 1, 1)];

const getCenteredPoints = (width, height) => {
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

const initRot = new Point(45, 130, 45);

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
    this.figure.rotate('x', initRot.get('x'));
    this.figure.rotate('y', initRot.get('y'));
    this.figure.rotate('z', initRot.get('z'));
    this.figure.draw();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.sliders}>
          <Selector onChange={(o) => this.figure.setDrawMethod(o)} options={options} />
          <Slider label="density" min={0} max={100} defaultValue={20} onChange={(e) => this.figure.setDensity(e.target.value)} />
          <Slider
            label="x"
            min={0}
            max={360}
            defaultValue={initRot.get('x')}
            onChange={(e) => this.figure.rotate('x', e.target.value)}
          />
          <Slider
            label="y"
            min={0}
            max={360}
            defaultValue={initRot.get('y')}
            onChange={(e) => this.figure.rotate('y', e.target.value)}
          />
          <Slider
            label="z"
            min={0}
            max={360}
            defaultValue={initRot.get('z')}
            onChange={(e) => this.figure.rotate('z', e.target.value)}
          />
        </div>
        <div className={styles.points}>
          <div>
            <div>a</div>
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
          </div>
          <div>
            <div>b</div>
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
          </div>
          <div>
            <div>c</div>
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
          </div>
          <div>
            <div>d</div>
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
            <input type="number" min={0} max={1} step={0.1} defaultValue={0} />
          </div>
        </div>
        <canvas ref={this.canvasRef} width={this.width} height={this.height} />
      </div>
    );
  }
}

export default CanvasProvider;

const options = {
  lines: 'линии',
  dots: 'точки',
};
