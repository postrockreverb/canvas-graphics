import React from 'react';

import Canvas from './components/Canvas';

import useWindowDimensions from './hooks/useWindowDimensions';

const App = () => {
  const { width, height } = useWindowDimensions();
  return (
    <div>
      <Canvas width={width * 0.8} height={height * 0.8} />
    </div>
  );
};

export default App;
