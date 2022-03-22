import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from './Canvas';

const CanvasProvider = ({ width, height }) => {
  const canvasRef = useRef();

  const [figure, setFigure] = useState();

  const [rendered, setRendered] = useState(true);

  useEffect(() => {
    setFigure(new Canvas(canvasRef.current));
    setRendered(false);
  }, []);

  useEffect(() => {
    if (rendered) return;
    figure.draw();
    console.log('rendered');
    setRendered(true);
  }, [figure, rendered]);

  return (
    <>
      <canvas width={width} height={height} ref={canvasRef} />
    </>
  );
};

export default CanvasProvider;
