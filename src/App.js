import React from 'react';
import Login from './components/login';
import Pwreset from './components/pwreset';
import Signup from './components/signup';
import Otp from './components/otp';
import NewPass from './components/newpass';
import Resetlink from './components/resetlink';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
   return (
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />

     <Route path="/signup" element={<Signup />} />
    <Route path="/pwreset" element={<Pwreset />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/newpass" element={<NewPass />} />
      <Route path="/resetlink" element={<Resetlink />} />
      
      </Routes>

    </BrowserRouter>
  );
};

export default App;
