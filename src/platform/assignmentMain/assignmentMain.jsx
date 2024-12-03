import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useSelector } from "react-redux";
import AssignmentAnalysis from "./assignmentAnalysis";
import RecentGrades from "./recentGrades";
import YourAssignments from "./yourAssingSec";
import Newassignment from "./newassignment";
import axios from "axios";

const AssignmentMain = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      fetchAssignments();
    }
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/assignment`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response);

    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  return (
    <div className="h-[100%] w-full relative">
      <div className="top-0 fixed">
        <Sidebar />
        <Header />
      </div>
      <div
        className="bg-[#E1EAE8] mt-[50px]  pt-[15px] transition-all duration-300"
        style={{ 
          marginLeft: isMobile ? '0' : sidebarWidth,
          height:isMobile ? '100%' : '100vh',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <div className={`flex w-full  ${isMobile?'flex-col h-[80%]':'flex-row h-[40%]'}`}>
          <div className="flex-1 h-full">
            <AssignmentAnalysis />
          </div>
          <div className="flex-1 h-full">
            {isEnrolled ? <RecentGrades /> : <Newassignment />}
          </div>
        </div>
        <YourAssignments />
      </div>
    </div>
  );
};

export default AssignmentMain;
