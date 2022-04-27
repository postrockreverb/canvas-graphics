import styles from './index.module.css';

import React from 'react';

import { Surface } from './surface';

import { Line } from './line';
import { Point } from '../../utils/point';

class CanvasProvider extends React.Component {
  constructor({ width, height }) {
    super();
    this.width = width;
    this.height = height;
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const randomLines = (n) => {
      const randPoint = () => new Point(Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height));
      const lines = [];
      for (let i = 0; i < n; i++) {
        lines.push(new Line(randPoint(), randPoint()));
      }
      return lines;
    };

    this.canvasRef.current.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);

    const canvas = this.canvasRef.current;
    canvas.width = this.width;
    canvas.height = this.height;

    this.surface = new Surface(canvas, randomLines(5));
    this.surface.draw();
  }

  handleMouseMove = (e) => {
    const mousePos = getMousePos(this.canvasRef.current, e);
    this.surface.moveRect(mousePos.x, mousePos.y);
    this.surface.draw();
  };

  render() {
    return (
      <div className={styles.container}>
        <canvas ref={this.canvasRef} width={this.width} height={this.height} />
      </div>
    );
  }
}

export default CanvasProvider;

const getMousePos = (canvas, evt) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};
