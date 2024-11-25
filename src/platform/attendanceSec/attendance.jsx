import React from "react";
import AttendanceTable from "./attendanceTable";
import AttendanceDashboard from "./attendanceStreakSec";




const AttendanceSection=()=>{
    return(
        <div >
            <AttendanceDashboard/>
                  
                 

            <AttendanceTable/>
        </div>
    )
}
export default AttendanceSection;