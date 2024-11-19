import React from "react";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useSelector } from "react-redux";
import AssignmentAnalysis from "./assignmentAnalysis";
import RecentGrades from "./recentGrades";
import YourAssignments from "./yourAssingSec";

const AssignmentMain = () => {
  const sidebarWidth = useSelector((state) => state.sidebar.width);

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
