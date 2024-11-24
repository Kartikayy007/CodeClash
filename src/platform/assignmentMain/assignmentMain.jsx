import React, { useEffect } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useSelector } from "react-redux";
import AssignmentAnalysis from "./assignmentAnalysis";
import RecentGrades from "./recentGrades";
import YourAssignments from "./yourAssingSec";
import axios from "axios";

const AssignmentMain = () => {
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      fetchAssignments();
    }
  }, [token]);

  const fetchAssignments = async () => {
    try {
      // Ensure headers are being passed properly as part of the axios request
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/assignment`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(response); // Check the response
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  return (
    <div className="h-[100vh] w-full relative">
      <div className="top-0 fixed">
        <Sidebar />
        <Header />
      </div>
      <div
        className="bg-[#E1EAE8] mt-[50px] h-full pt-[15px] transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="flex w-full h-[40%] ">
          <div className="flex-1 h-full">
            <AssignmentAnalysis />
          </div>
          <div className="flex-1 h-full">
            <RecentGrades />
          </div>
        </div>
        <YourAssignments />
      </div>
    </div>
  );
};

export default AssignmentMain;
