import React from 'react';

import Login from './components/login';
import Pwreset from './components/pwreset';
import Signup from './components/signup';
import Otp from './components/otp';
import Dashboard from './components/dashboard';
import Getstarted from './components/getstarted'


import Newpass from './components/newpass';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
   return (
  
    <BrowserRouter>
      <Routes>


        <Route path="/" element={<Getstarted/>} />



     <Route path="/signup" element={<Signup />} />
     
    <Route path="/pwreset" element={<Pwreset />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/reset-password" element={< Newpass/>} />
      
     
     
      

      <Route path="/dashboard" element={<Dashboard />} />

      </Routes>

    </BrowserRouter>
  );
};

export default App;
