import React, { useState } from "react";
import LiveVideoCall from "./liveLecComp";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import { useSelector } from "react-redux";

const LiveLec = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sidebarWidth = useSelector((state) => state.sidebar.width);

  return (
    <div>
      <div className="fixed top-0">
        <Header />
      </div>
      <div className="fixed top-0">
        <Sidebar />
      </div>
      <div style={{ marginLeft: isMobile ? '0' : sidebarWidth }}>
        <LiveVideoCall />
      </div>
    </div>
  );
};

export default LiveLec;