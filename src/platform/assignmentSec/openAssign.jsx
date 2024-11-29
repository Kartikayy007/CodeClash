import React, { useState, useEffect } from "react";
import AssignOpenComp from "./openAssignComp";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import { useSelector } from "react-redux";

const AssignOpen = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const sidebarWidth = useSelector((state) => state.sidebar.width);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div className="fixed top-0">
        <Header />
      </div>
      <div className="fixed top-0">
        <Sidebar />
      </div>
      <div 
        style={{ marginLeft: isMobile ? '0' : sidebarWidth }} 
        className="transition-all duration-300"
      >
        <AssignOpenComp />
      </div>
    </div>
  );
};

export default AssignOpen;
