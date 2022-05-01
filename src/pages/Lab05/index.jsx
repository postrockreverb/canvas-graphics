import styles from './index.module.css';

import React from 'react';

import { Cube, Diamond, Pyramid } from './figure';

import { Point } from '../../utils/point';
import { toRad } from '../../utils/toRad';

import { Checkbox } from '../../components/Checkbox/Checkbox';
import { RadioButton } from '../../components/RadioButton/RadioButton';

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

    this.mouseIsDown = false;
    this.startDragPos = null;

    this.showInvEdges = true;
    this.showVisEdges = true;
    this.showVert = 'Labels';
  }

  componentDidMount() {
    this.canvasRef.current.width = this.width;
    this.canvasRef.current.height = this.height;

    this.figure = new Cube(this.canvasRef.current, this.center, this.size);
    this.figure.setRotationPoint(initRotRad);

    this.figure.draw();

    this.canvasRef.current.addEventListener('mousedown', this.handleMouseDown, false);
    this.canvasRef.current.addEventListener('mouseup', this.handleMouseUp, false);
    this.canvasRef.current.addEventListener('mousemove', this.handleMouseMove, false);
  }

  handleMouseDown = (e) => {
    this.startDragPos = getMousePos(this.canvasRef.current, e);
    this.mouseIsDown = true;
  };
  handleMouseUp = (e) => {
    this.mouseIsDown = false;
  };
  handleMouseMove = (e) => {
    if (this.mouseIsDown) {
      const mousePos = getMousePos(this.canvasRef.current, e);
      this.rotateFigure('x', (this.startDragPos.y - mousePos.y) / 100);
      this.rotateFigure('y', (this.startDragPos.x - mousePos.x) / 100);
    }
  };

  rotateFigure(axes, degs) {
    const rads = toRad(degs);
    this.figure.rotate(axes, rads);
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
    this.figure.showInvEdges = this.showInvEdges;
    this.figure.showVisEdges = this.showVisEdges;
    this.figure.showVert = this.showVert;
    this.figure.draw();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.sliders}>
          <RadioButton legend="Figure" labels={options} onChange={(o) => this.changeFigure(o)} />
          <fieldset className={styles.edges}>
            <legend>Edges</legend>
            <Checkbox
              label="Invisible edges"
              defaultValue={true}
              onChange={(e) => {
                this.showInvEdges = e;
                this.figure.showInvEdges = e;
                this.figure.draw();
              }}
            />
            <Checkbox
              label="Visible edges"
              defaultValue={true}
              onChange={(e) => {
                this.showVisEdges = e;
                this.figure.showVisEdges = e;
                this.figure.draw();
              }}
            />
          </fieldset>
          <RadioButton
            legend="Vertices"
            labels={['Labels', 'Coords', 'None']}
            onChange={(r) => {
              this.showVert = r;
              this.figure.showVert = r;
              this.figure.draw();
            }}
          />
        </div>
        <canvas ref={this.canvasRef} width={this.width} height={this.height} />
      </div>
    );
  }
}

export default CanvasProvider;

const options = ['Cube', 'Diamond', 'Pyramid'];

const getMousePos = (canvas, evt) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};
