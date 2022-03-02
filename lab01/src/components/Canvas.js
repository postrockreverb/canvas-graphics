import React, { useState, useRef, useEffect } from 'react';
import { Cube, Pyramid, Diamond } from './Figure';
import Point from './Point';
import Slider from './Slider';
import Selector from './Selector';

const toRad = (degs) => {
  return (degs * Math.PI) / 180;
};

const initRotDeg = new Point(45, 45, 36);
const initRotRad = new Point(toRad(initRotDeg.get('x')), toRad(initRotDeg.get('y')), toRad(initRotDeg.get('z')));

const Canvas = ({ width, height }) => {
  const canvasRef = useRef();

  const center = new Point(width / 2, height / 2, 0);
  const size = width < height ? width : height / 4;
  const [figure, setFigure] = useState(new Diamond(center, size));

  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // style
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'thistle';
    ctx.lineWidth = width / 300;
    ctx.lineCap = 'round';

    figure.setRotationPoint(initRotRad);
  }, [figure, width]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillRect(0, 0, width, height); // fill background
    figure.draw(ctx);

    setRendered(true);
  }, [figure, height, width, rendered]);

  const rotateFigure = (axes, degs) => {
    const rads = toRad(degs);
    figure.setRotation(axes, rads);
    setRendered(false);
  };

  const changeFigure = (name) => {
    const currentRotation = figure.getRotation();
    const figures = {
      Diamond: new Diamond(center, size),
      Cube: new Cube(center, size),
      Pyramid: new Pyramid(center, size),
    };
    setFigure(figures[name]);
    figure.setRotationPoint(currentRotation);
  };

  return (
    <>
      <div style={styles.sliders}>
        <Selector onChange={(o) => changeFigure(o)} />
        <Slider label="x" min={0} max={360} defaultValue={initRotDeg.get('x')} onChange={(v) => rotateFigure('x', v)} />
        <Slider label="y" min={0} max={360} defaultValue={initRotDeg.get('y')} onChange={(v) => rotateFigure('y', v)} />
        <Slider label="z" min={0} max={360} defaultValue={initRotDeg.get('z')} onChange={(v) => rotateFigure('z', v)} />
      </div>
      <canvas width={width} height={height} ref={canvasRef} />
    </>
  );
};

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
