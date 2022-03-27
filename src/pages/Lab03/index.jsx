import styles from './index.module.css';

import React from 'react';

import { Surface } from './surface';

import { Point } from '../../utils/point.js';

import { Slider } from './Slider';
import { Selector } from '../../components/Selector/Selector';

const points = [new Point(0, 0, 1), new Point(1, 0, 0), new Point(1, 1, 1), new Point(0, 1, 0)];

const getCenteredPoints = (width, height) => {
  const center = new Point(width / 2, height / 2, 0);
  const size = (width < height ? width : height) / 2;
  const newPoints = points.map((item) => {
    const p = new Point(item.x, item.y, item.z);
    p.scalePoint(size);
    p.addPoint(center);
    p.x -= size / 2;
    p.y -= size / 2;
    return p;
  });
  return newPoints;
};

class CanvasProvider extends React.Component {
  constructor({ width, height }) {
    super();
    this.state = { rotation: new Point(0, 0, 0), density: 20 };
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

  rebuild(point, axes, v) {
    this.setState({ rotation: new Point(0, 0, 0) });
    points[point].set(axes, +v);
    const density = this.figure.density;
    this.figure = new Surface(this.canvasRef.current, getCenteredPoints(this.width, this.height));
    this.figure.setDensity(density);
    this.figure.draw();
  }

  rotate(axes, value) {
    const r = this.state.rotation;
    r.set(axes, value);
    this.setState({ rotation: r });
    this.figure.rotate(axes, value);
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.sliders}>
          <Selector onChange={(o) => this.figure.setDrawMethod(o)} options={options} />
          <Slider
            label="density"
            min={0}
            max={100}
            value={this.state.density}
            onChange={(e) => {
              this.setState({ density: e.target.value });
              this.figure.setDensity(e.target.value);
            }}
          />
          <Slider
            label="x"
            min={0}
            max={360}
            value={this.state.rotation.get('x')}
            onChange={(e) => this.rotate('x', e.target.value)}
          />
          <Slider
            label="y"
            min={0}
            max={360}
            value={this.state.rotation.get('y')}
            onChange={(e) => this.rotate('y', e.target.value)}
          />
          <Slider
            label="z"
            min={0}
            max={360}
            value={this.state.rotation.get('z')}
            onChange={(e) => this.rotate('z', e.target.value)}
          />
        </div>
        <div className={styles.points}>
          <div>
            <div>a</div>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[0].get('x')}
              onChange={(e) => this.rebuild(0, 'x', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[0].get('y')}
              onChange={(e) => this.rebuild(0, 'y', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[0].get('z')}
              onChange={(e) => this.rebuild(0, 'z', e.target.value)}
            />
          </div>
          <div>
            <div>b</div>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[1].get('x')}
              onChange={(e) => this.rebuild(1, 'x', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[1].get('y')}
              onChange={(e) => this.rebuild(1, 'y', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[1].get('z')}
              onChange={(e) => this.rebuild(1, 'z', e.target.value)}
            />
          </div>
          <div>
            <div>c</div>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[2].get('x')}
              onChange={(e) => this.rebuild(2, 'x', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[2].get('y')}
              onChange={(e) => this.rebuild(2, 'y', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[2].get('z')}
              onChange={(e) => this.rebuild(2, 'z', e.target.value)}
            />
          </div>
          <div>
            <div>d</div>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[3].get('x')}
              onChange={(e) => this.rebuild(3, 'x', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[3].get('y')}
              onChange={(e) => this.rebuild(3, 'y', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              defaultValue={points[3].get('z')}
              onChange={(e) => this.rebuild(3, 'z', e.target.value)}
            />
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
