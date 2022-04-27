import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Lab01 from './pages/Lab01';
import Lab02 from './pages/Lab02';
import Lab03 from './pages/Lab03';
import Lab04 from './pages/Lab04';

import { Welcome } from './components/Welcome/Welcome';

import useWindowDimensions from './hooks/useWindowDimensions';

const App = () => {
  const { width, height } = useWindowDimensions();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Welcome />} />
          <Route path="Lab01" element={<Lab01 width={width} height={height} />} />
          <Route path="Lab02" element={<Lab02 width={width} height={height} />} />
          <Route path="Lab03" element={<Lab03 width={width} height={height} />} />
          <Route path="Lab04" element={<Lab04 width={width} height={height} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
