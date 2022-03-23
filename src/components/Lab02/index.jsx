import React from 'react';
import { Canvas } from './Canvas';
import Selector from './Selector';

class CanvasProvider extends React.Component {
  constructor(width, height) {
    super();
    this.canvasRef = React.createRef();
    this.mouseIsDown = false;
    this.figure = null;
  }

  componentDidMount() {
    this.canvasRef.current.width = 1000;
    this.canvasRef.current.height = 800;
    this.canvasRef.current.addEventListener('mousedown', (e) => this.handleMouseDown(e), false);
    this.canvasRef.current.addEventListener('mouseup', () => this.handleMouseUp(), false);
    this.canvasRef.current.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);

    this.figure = new Canvas(this.canvasRef.current);
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

  render() {
    return (
      <>
        <Selector onChange={(o) => this.figure.setBoundaryCondition(o)} />
        <canvas ref={this.canvasRef} />
      </>
    );
  }
}

export default CanvasProvider;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
