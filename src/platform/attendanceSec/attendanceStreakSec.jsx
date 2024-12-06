import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import card from '../assets/amico.svg'
import AnimatedGraph from "./attendanceChart";
import { useSelector } from "react-redux";
import axios from "axios";
const AttendanceDashboard = ({ classCode }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const [data, setData] = useState({});
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
          setData(response.data);
        }
      } catch (error) {
        console.log('Error fetching attendance data:', error);
      }
    }
    fetchData();
  }, [])
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const chartData = {
    labels: ["Class Attendance"],
    datasets: [
      {
        label: "Attended",
        data: [data.totalPresent],
        backgroundColor: "#0A5757",
        borderRadius: 5,
        barPercentage: 0.5,
      },
      {
        label: "Not Attended",
        data: [data.totalAbsent],
        backgroundColor: "#00A8A5",
        borderRadius: 5,
        barPercentage: 0.5,
      },
    ],
  };
  const maxValue = Math.max(data.totalPresent, data.totalAbsent);
  const stepSize = Math.max(1, Math.ceil(maxValue / 4));
  // console.log(stepSize)
  const chartOptions = {

    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 12,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: maxValue,
        ticks: {
          stepSize: stepSize,
        },
      },
    },
  };
  return (
    <div className={`${isMobile ? 'flex flex-col' : 'flex flex-row'} p-6 px-0 rounded-lg ${isMobile ? 'h-auto' : 'h-[300px]'} ${isMobile ? 'space-y-4' : 'space-x-4'}`}>
      <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-white p-6 rounded-lg`}>
        { }
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Your Attendance</h2>
        </div>
        <div className="h-60">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      {isEnrolled ? (
        <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-white p-6 rounded-lg flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
          <div className={`flex flex-col ${isMobile ? 'w-full' : 'w-1/2'} gap-5`}>
            <div className=" flex flex-col justify-center">
              <h2 className="text-xl pb-5  ">Attendance Streak</h2>
            </div>
            <div className="mb-4 mt-[15px]">
              <p className="text-sm font-medium mb-2">Current Streak :</p>
              {data.currentStreak === 0 ? (
                <p className="text-lg text-gray-700 mb-2">
                  Start your streak today!
                </p>
              ) : data.currentStreak === 1 ? (
                <p className="text-lg text-gray-700 mb-2">
                  Great start! Keep it going!
                </p>
              ) : (
                <p className="text-lg text-gray-700 mb-2">
                  <LocalFireDepartmentIcon /> {data.currentStreak || 0} Classes Attended in a Row!
                  <p className="text-lg text-gray-500 mb-2">
                    "You're on fire! Keep it going."
                  </p>
                </p>
              )}

              <p className="text-sm font-medium mb-2">Longest Streak :</p>
              <p className="text-lg  text-gray-700 mb-2">
                <EmojiEventsIcon /> {data.longestStreak || 0} Classes Attended
              </p>
            </div>
          </div>
          <div className={`${isMobile ? 'mt-4' : ''} flex flex-col justify-center align-center ${isMobile ? 'w-full' : 'w-1/2'} m-[20px]`}>
            <img src={card} alt="Illustration" className="rounded-md w-fill max-w-[200px]" />
          </div>
        </div>
      ) : (
        <div className={`${isMobile ? 'w-full' : 'w-1/2'}`}>
          <AnimatedGraph classCode={classCode} />
        </div>
      )}
    </div>
  );
};
export default AttendanceDashboard;