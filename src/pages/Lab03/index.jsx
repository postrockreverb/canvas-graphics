import React, { useEffect, useState, useRef } from 'react';

import { Surface } from './surface';

import { Point } from '../../utils/point.js';

const points = [new Point(0, 0, 0), new Point(1, 1, 1), new Point(1, 0, 1), new Point(0, 1, 0)];

const CanvasProvider = ({ width, height }) => {
  const canvasRef = useRef();
  const [figure, setFigure] = useState();

  useEffect(() => {
    setFigure(new Surface(canvasRef.current, points));
  }, []);

  return (
    <>
      <canvas width={width} height={height} ref={canvasRef} />
    </>
  );
};

export default CanvasProvider;
