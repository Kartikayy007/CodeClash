import React from "react";
import AssignOpenComp from "./openAssignComp";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import { useSelector } from "react-redux";


const AssignOpen = () => {
    const sidebarWidth = useSelector((state) => state.sidebar.width);

  return (
    <div>
        <div className=" fixed top-0">

<Header/>
        </div>
        <div className=" fixed top-0">

<Sidebar/>
        </div>
<div style={{marginLeft:sidebarWidth}} className="  transition-all duration-300"><AssignOpenComp/></div>

    </div>
  );
};

export default AssignOpen;
