import React from 'react';

import Login from './auth/components/login';
import Pwreset from './auth/components/pwreset';
import Signup from './auth/components/signup';
import Otp from './auth/components/otp';
import Dashboard from './platform/dashboard/dashboard';
import Getstarted from './auth/components/getstarted'
import Dashsignup from './platform/dashboard/dashsignup';
import Calender from './platform/calenderPage/calender'

import Card from './platform/cards/cards';

import Newpass from './auth/components/newpass';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import YourClasses from './platform/yourClasses/yourClasses';


const App = () => {
   return (
  
    <BrowserRouter>
      <Routes>


        <Route path="/" element={<Getstarted/>} />
        <Route path="/card" element={<Card/>} />

     <Route path="/signup" element={<Signup />} />
     
    <Route path="/pwreset" element={<Pwreset />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/reset-password" element={< Newpass/>} />
      
     
      <Route path="/classes" element={<Dashsignup/>} />


      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calendar" element={<Calender />} />
      <Route path="/settings" element={<YourClasses />} />
      

      </Routes>

    </BrowserRouter>
  );
};

export default App;
