import React from 'react';

import Canvas from './components/Lab02/Canvas';

import useWindowDimensions from './hooks/useWindowDimensions';

const App = () => {
  const { width, height } = useWindowDimensions();
  return <Canvas width={width} height={height} />;
};

export default App;
