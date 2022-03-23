import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from './Canvas';

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
    this.canvasRef.current.addEventListener('mouseup', (e) => this.handleMouseUp(e), false);
    this.canvasRef.current.addEventListener('mousemove', (e) => this.handleMouseMove(e), false);

    this.figure = new Canvas(this.canvasRef.current);
    this.figure.draw();
  }

  handleMouseDown = (e) => {
    const mousePos = getMousePos(this.canvasRef.current, e);
    this.figure.startDragging(mousePos);
    this.mouseIsDown = true;
  };
  handleMouseUp = (e) => {
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
        <div>
          <label htmlFor="interpolationMethod">Interpolation:</label>
          <select id="interpolationMethod">
            <option value="fixed">Фиксированные</option>
            <option value="loose">Слабые</option>
            <option value="">Цикличность</option>
            <option value="nearestNeighbor">Ацикличность</option>
          </select>
        </div>
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

// const CanvasProvider = ({ width, height }) => {
//   const canvasRef = useRef();

//   const [figure, setFigure] = useState();

//   const [rendered, setRendered] = useState(true);

//   const [cursor, setCursor] = useState();
//   const [selected, setSelected] = useState();

//   useEffect(() => {
//     setFigure(new Canvas(canvasRef.current));
//     setRendered(false);
//     canvasRef.current.addEventListener('mousedown', (e) => handleMouseDown(e), false);
//   }, []);

//   useEffect(() => {
//     if (rendered) return;
//     figure.draw();
//     console.log('rendered');
//     setRendered(true);
//   }, [figure, rendered]);

//   useEffect(() => {
//     if (!figure) return;
//     setSelected(!selected);
//     if (selected) {
//       figure.dragPoint(cursor);
//       setRendered(false);
//     } else figure.startDragging(cursor);
//   }, [cursor, selected]);

//   const handleMouseDown = (e) => {
//     const mousePos = getMousePos(canvasRef.current, e);
//     setCursor({ x: mousePos.x, y: mousePos.y });
//   };

//   return (
//     <>
//       <div>
//         <label htmlFor="interpolationMethod">Interpolation:</label>
//         <select id="interpolationMethod">
//           <option value="fixed">Фиксированные</option>
//           <option value="loose">Слабые</option>
//           <option value="">Цикличность</option>
//           <option value="nearestNeighbor">Ацикличность</option>
//         </select>
//       </div>
//       <canvas width={width} height={height} ref={canvasRef} />
//     </>
//   );
// };

// export default CanvasProvider;

// function getMousePos(canvas, evt) {
//   var rect = canvas.getBoundingClientRect();
//   return {
//     x: evt.clientX - rect.left,
//     y: evt.clientY - rect.top,
//   };
// }
