import React from 'react';

import Login from './auth/components/login';
import Pwreset from './auth/components/pwreset';
import Signup from './auth/components/signup';
import Otp from './auth/components/otp';
import Dashboard from './platform/dashboard/dashboard';
import ClassenceLanding from './auth/components/getstarted'
import Dashsignup from './platform/dashboard/dashsignup';
import Calender from './platform/calenderPage/calender'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssignmentSection from './platform/assignmentSec/assignment';
import AssignmentDetails from './platform/assignmentSec/viewAssign';
import LiveLec from './platform/liveLec/liveLec';

import Card from './platform/cards/cards';
import Newpass from './auth/components/newpass';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import YourClasses from './platform/yourClasses/yourClasses';
import Settingpage from './platform/header/settingpage';
import Announcement from './platform/announcement/announcement';
import AssignmentMain from './platform/assignmentMain/assignmentMain'
import Assignmentcreated from './platform/teacherassignmentinsider/createdassignment';
import Helpmain from './platform/helpandsupport/helpmain';
import SettingsPage from './platform/settings/settings';
import ScheduleLectureModal from './platform/modals/modal3';
import AssignOpen from './platform/assignmentSec/openAssign';

const App = () => {
   return (
   <div>
    <BrowserRouter>
      <Routes>
      <Route path="/assignment" element={<Assignmentcreated/>} />
      <Route path="/schedule" element={<ScheduleLectureModal/>} />
        <Route path="/" element={<ClassenceLanding/>} />
        <Route path="/card" element={<Card/>} />
        <Route path="/help" element={<Helpmain/>} />
     <Route path="/signup" element={<Signup />} />
     
    <Route path="/pwreset" element={<Pwreset />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/reset-password" element={< Newpass/>} />
      
     
      <Route path="/classes" element={<YourClasses/>} />
      <Route path="/dashsignup" element={<Dashsignup/>} />


      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calendar" element={<Calender />} />
      <Route path="/settings" element={<Settingpage />} />
      <Route path="/live" element={<LiveLec />} />

      <Route path="/announcement" element={<Announcement />} />
      <Route path="/assignments" element={<AssignmentMain />} />
      <Route path="/" element={<AssignmentSection />} />
      <Route path="/assignment-details" element={<AssignmentDetails />} />
      <Route path="/assignment-open" element={<AssignOpen />} />

      
      

 

      

      </Routes>

    </BrowserRouter>
    <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default App;
