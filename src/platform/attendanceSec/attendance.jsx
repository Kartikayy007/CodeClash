import React, { useEffect, useState } from "react";
import AttendanceTable from "./attendanceTable";
import AttendanceDashboard from "./attendanceStreakSec";
import axios from "axios";
import image from '../assets/noAttendance.svg'

const AttendanceSection = ({ classCode }) => {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/classroom/attendance?classCode=${classCode}`, { headers });
        if (response.data.success) {
          setAttendanceData(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.log('Error fetching attendance data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [classCode]);

  const isEmpty = !attendanceData.totalPresent && !attendanceData.totalAbsent && !attendanceData.currentStreak && !attendanceData.longestStreak;

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loader"></div>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
            <img src={image} alt="" />
          <p className="text-lg font-semibold ">No Attendance Records Found</p>
          <p className="">Attendance will appear here once live classes take place.</p>
        </div>
      ) : (
        <>
          <AttendanceDashboard classCode={classCode} attendanceData={attendanceData} />
          <AttendanceTable classCode={classCode} />
        </>
      )}
    </div>
  );
};

export default AttendanceSection;