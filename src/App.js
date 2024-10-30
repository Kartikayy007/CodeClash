import React from 'react';
import Login from './components/login';
import Pwreset from './components/pwreset';
import Signup from './components/signup';
import Otp from './components/otp';

import Resetlink from './components/resetlink';


import Newpass from './components/newpass';

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
      <Route path="/resetlink" element={< Resetlink/>} />
      <Route path="/reset-password" element={< Newpass/>} />
      
     
     
      
      </Routes>

    </BrowserRouter>
  );
};

export default App;
