import React, { useState, useRef, useEffect } from 'react';

import Spline from './Spline';

const Canvas = ({ width, height }) => {
  const canvasRef = useRef();
  const [rendered, setRendered] = useState(false);

  const [figure, setFigure] = useState(new Spline());

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // style
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'thistle';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    canvasRef.current.addEventListener('mousedown', function (e) {
      getMousePosition(canvasRef.current, e);
    });
  }, []);

  useEffect(() => {
    if (rendered) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillRect(0, 0, width, height); // fill background

    figure.draw(ctx);

    setRendered(true);
  }, [height, width, rendered]);

  function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log('Coordinate x: ' + x, 'Coordinate y: ' + y);
  }

  return (
    <>
      <canvas width={width} height={height} ref={canvasRef} />
    </>
  );
};

export default Canvas;
