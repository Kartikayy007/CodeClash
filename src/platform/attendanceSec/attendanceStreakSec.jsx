import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import card from '../assets/amico.svg'
import AnimatedGraph from "./attendanceChart";
import { useSelector } from "react-redux";
const AttendanceDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
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
        data: [80], 
        backgroundColor: "#0A5757", 
        borderRadius: 5,
        barPercentage: 0.5, 
      },
      {
        label: "Not Attended",
        data: [20], 
        backgroundColor: "#00A8A5", 
        borderRadius: 5,
        barPercentage: 0.5,
      },
    ],
  };
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
        max: 100, 
        ticks: {
          stepSize: 25,
        },
      },
    },
  };
  return (
    <div className={`${isMobile ? 'flex flex-col' : 'flex flex-row'} p-6 rounded-lg ${isMobile ? 'h-auto' : 'h-[300px]'} ${isMobile ? 'space-y-4' : 'space-x-4'}`}>
      <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-white p-6 rounded-lg`}>
        {}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Your Attendance</h2>
          <select className="border border-gray-300 text-sm rounded-md p-1">
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
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
              <p className="text-lg  text-gray-700 mb-2">
                <LocalFireDepartmentIcon /> 5 Classes Attended in a Row!
              </p>
              <p className="text-lg text-gray-500 mb-2">
                "You're on fire! Keep it going."
              </p>
              <p className="text-sm font-medium mb-2">Longest Streak :</p>
              <p className="text-lg  text-gray-700 mb-2">
                <EmojiEventsIcon /> 10 Classes Attended
              </p>
            </div>
          </div>
          <div className={`${isMobile ? 'mt-4' : ''} flex flex-col justify-center align-center ${isMobile ? 'w-full' : 'w-1/2'} m-[20px]`}>
            <img src={card} alt="Illustration" className="rounded-md w-fill max-w-[200px]" />
          </div>
        </div>
      ) : (
        <div className={`${isMobile ? 'w-full' : 'w-1/2'}`}>
          <AnimatedGraph />
        </div>
      )}
    </div>
  );
};
export default AttendanceDashboard;