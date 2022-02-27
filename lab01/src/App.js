import React from 'react';

import Canvas from './components/Canvas';

import useWindowDimensions from './hooks/useWindowDimensions';

const App = () => {
  const { width, height } = useWindowDimensions();
  return (
    <div>
      <Canvas width={width} height={height} />
    </div>
  );
};

export default App;
