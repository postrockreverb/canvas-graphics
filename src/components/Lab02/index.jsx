import styles from './index.module.css';

import React from 'react';

import { Canvas } from './Canvas';
import Selector from './Selector';
import { Slider } from './Slider';

const fitKnots = (width, height, n) => {
  const knots = [];
  const step = width / (+n + 1);
  let xOffset = 0;
  for (let i = 0; i < n; i++) {
    let x = (xOffset += step);
    let y = height / 2;
    if (i !== 0 && i !== n - 1) {
      y += +Math.floor((Math.random() * height - height / 2) / 2);
      x += Math.floor((Math.random() * step - step / 2) / 2);
    }
    knots.push({ x: x, y: y });
  }
  return knots;
};

class CanvasProvider extends React.Component {
  state = {
    knots: 5,
  };

  constructor({ width, height }) {
    super();
    this.width = width;
    this.height = height;
    this.canvasRef = React.createRef();
    this.mouseIsDown = false;
    this.figure = null;
  }

  componentDidMount() {
    this.canvasRef.current.addEventListener('mousedown', (e) => this.handleMouseDown(e), false);
    this.canvasRef.current.addEventListener('mouseup', () => this.handleMouseUp(), false);
    this.canvasRef.current.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);

    this.canvasRef.current.width = this.width;
    this.canvasRef.current.height = this.height;

    this.figure = new Canvas(this.canvasRef.current, fitKnots(this.width, this.height, this.state.knots));
    this.figure.draw();
  }

  handleMouseDown = (e) => {
    const mousePos = getMousePos(this.canvasRef.current, e);
    this.figure.startDragging(mousePos);
    this.mouseIsDown = true;
  };
  handleMouseUp = () => {
    this.figure.stopDragging();
    this.mouseIsDown = false;
  };
  handleMouseMove = (e) => {
    if (this.mouseIsDown) {
      const mousePos = getMousePos(this.canvasRef.current, e);
      this.figure.dragPoint(mousePos);
      this.figure.draw();
    }
  };
  handleRange = (e) => {
    const value = e.target.value;
    this.setState({ knots: value });
    const knots = fitKnots(this.width, this.height, value);
    this.figure.setKnots(knots);
    this.figure.draw();
  };
  handleReset = (e) => {
    const knots = fitKnots(this.width, this.height, this.state.knots);
    this.figure.setKnots(knots);
    this.figure.draw();
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.controls}>
          <Selector onChange={(o) => this.figure.setBoundaryCondition(o)} />
          <input className={styles.reset} type="button" value="Reset" onClick={this.handleReset} />
          <Slider min={3} max={15} value={this.state.knots} onChange={this.handleRange.bind(this)} />
        </div>
        <canvas ref={this.canvasRef} width={this.width} height={this.height} />
      </div>
    );
  }
}

export default CanvasProvider;

const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};
