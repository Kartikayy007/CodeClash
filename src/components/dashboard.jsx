import React from 'react';
import './css/dashboard.css';
import frame from "../assets/Frame.svg"
import dashboardimg from '../assets/dashboardimg.svg'
import dashboardmain from '../assets/dashboardmain.svg'
import btn from '../assets/btn.svg'
function Dashboard() {
  return (
    <div id="dashboardpage">
     <div id="dashboardpageleft">
   <div id="dashboardpageleftsub1">
    <img src={frame} alt="" />
   </div>
    <div id='dashboardpageleftsub2'>
        <div id='dashboardpageleftsub21'>
        <img src={dashboardimg} alt="" />
        <span>Dashboard</span>
        </div>
        <div id='dashboardpageleftsub21'>
        <img src={dashboardimg} alt="" />
        <span>Your Classes</span>
         </div>
        <div id='dashboardpageleftsub21'>
        <img src={dashboardimg} alt="" />
        <span>Notifications</span>
        </div>
        <div id='dashboardpageleftsub21'>
        <img src={dashboardimg} alt="" />
        <span>Calendar</span>
        </div>
        <div id='dashboardpageleftsub21'>
        <img src={dashboardimg} alt="" />
        <span>Settings</span>
        </div>
        <div id='dashboardpageleftsub21'>
        <img src={dashboardimg} alt="" />
        <span>Help & Support</span>
        </div>
    </div>
    <div id='dashboardpageleftsub3'>
        <img src={dashboardimg} alt="" />
    </div>
     </div>
     <div id="dashboardpageright">
    <div id="dashboardpagerightsub1">
       <input  type='text'placeholder='Search for your classes,assignments'></input>  
       <div>  
         <img src={dashboardimg} alt="" />
       <img src={dashboardimg} alt="" /></div>
    </div>
    <div id="dashboardpagerightsub2">
         <div id="dashboardpagerightsub21">
            <div id="dashboardpagerightsub211"></div>
            <img src={dashboardmain} alt="" />
            <div id="dashboardpagerightsub212">
                <button>Join Your First Class</button>
                <button>Create Your First Class</button>
            </div>
         </div>
    </div>
    <div id="dashboardpagerightsub3">
<img src={btn} alt="" />
    </div>
     </div>

    </div>
  )
}

export default Dashboard;
