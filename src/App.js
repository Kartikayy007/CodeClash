import React from 'react';
import Login from './components/login';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Navigate to="./components/login" />} />
    //   </Routes>
    // </BrowserRouter>
   <Login />
  );
};

export default App;