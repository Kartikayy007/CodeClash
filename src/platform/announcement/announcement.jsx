import React from "react";
import AnnouncementComponent from "./announcementsComp";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
const Announcement = () => {
    return(
        <div className="fixed w-full top-0">
        <Sidebar/>
<Header/>
        <AnnouncementComponent />
        </div>
    )
}
export default Announcement;