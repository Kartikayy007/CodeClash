import React from 'react';
import Login from './components/login';
import Pwreset from './components/pwreset';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pwreset/>} />

      </Routes>

    </BrowserRouter>

  );
};

export default App;