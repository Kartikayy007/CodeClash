import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useSelector } from "react-redux";
import AssignmentAnalysis from "./assignmentAnalysis";
import RecentGrades from "./recentGrades";
import YourAssignments from "./yourAssingSec";
import Newassignment from "./newassignment";
import axios from "axios";
import noAssignmentsImage from "../assets/noAssign.svg";
import { height } from "@mui/system";

const AssignmentMain = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isJoinedAssignmentsFilled, setIsJoinedAssignmentsFilled] = useState(false);
  const [isCreatedAssignmentsFilled, setIsCreatedAssignmentsFilled] = useState(false);
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
  
      // Check for joined classroom assignments
      const joinedAssignments = response.data.user.joinedClassrooms.allAssignments;
      setIsJoinedAssignmentsFilled(joinedAssignments.length > 0);
  
      // Check for created classroom assignments
      const createdAssignments = response.data.user.createdClassrooms?.allAssignments || [];
      setIsCreatedAssignmentsFilled(createdAssignments.length > 0);
  
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    }
  };

  // Determine if there are no assignments based on enrollment status
  const isEmpty = isEnrolled ? !isJoinedAssignmentsFilled : !isCreatedAssignmentsFilled;

  return (
    <div className="h-[100%] w-full relative">
      <div className="top-0 fixed">
        <Sidebar />
        <Header />
      </div>
      <div
        className="bg-[#E1EAE8] mt-[50px] pt-[15px] transition-all duration-300"
        style={{ 
          marginLeft: isMobile ? '0' : sidebarWidth,
          height: isMobile ? '100%' : '100vh',
          transition: 'margin-left 0.3s ease'
        }}
      >
        {isEmpty ? (
          <div className={`flex flex-col items-center justify-center  text-gray-500 ${isMobile?'h-[100vh]':'h-full'}`} >
            <img src={noAssignmentsImage} alt="No Assignments" />
            {isEnrolled ? (
              <>
                <p className="font-semibold mt-5 text-xl">No Assignments Assigned Yet</p>
                <p className="mt-2">Your teachers hasn’t assigned any tasks yet. Once they do, you’ll see them here. Stay tuned!</p>
              </>
            ) : (
              <>
                <p className="font-semibold mt-5 text-xl">No Assignments Assigned Yet</p>
                <p className="mt-2">Once you assign an assignment, it will appear here</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className={`flex w-full ${isMobile ? 'flex-col h-[80%]' : 'flex-row h-[40%]'}`}>
              <div className="flex-1 h-full">
                <AssignmentAnalysis />
              </div>
              <div className="flex-1 h-full">
                {isEnrolled ? <RecentGrades /> : <Newassignment />}
              </div>
            </div>
            <YourAssignments />
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentMain;