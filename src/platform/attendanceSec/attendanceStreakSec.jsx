import React from "react";
import { Bar } from "react-chartjs-2";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import card from '../assets/amico.svg'
import AnimatedGraph from "./attendanceChart";
import { useSelector } from "react-redux";

const AttendanceDashboard = () => {
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  const chartData = {
    labels: ["Class Attendance"], // Label below the bar
    datasets: [
      {
        label: "Attended",
        data: [80], // Dynamic data for attended classes
        backgroundColor: "rgba(99, 102, 241, 0.8)", // Purple
        borderRadius: 5,
        barPercentage: 0.5, // Makes the bar thinner to fit
      },
      {
        label: "Not Attended",
        data: [20], // Dynamic data for not attended classes
        backgroundColor: "rgba(248, 113, 113, 0.7)", // Red
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
        position: "bottom", // Moves legend below the chart
        labels: {
          boxWidth: 12, // Smaller box for legend
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12, // Adjust font size for x-axis labels
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100, // Dynamic scale adjustment
        ticks: {
          stepSize: 25,
        },
      },
    },
  };

  return (
    <div className="flex flex-row  p-6 rounded-lg h-[300px] space-x-4 ">

      {/* Attendance Chart Section */}
      <div className="w-1/2 bg-white p-6 rounded-lg ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Your Attendance</h2>
          <select className="border border-gray-300 text-sm rounded-md p-1">
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <div className="h-60">
          {/* Bar Chart */}
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {isEnrolled ? 
      <div className="w-1/2 bg-white p-6 rounded-lg flex ">
        <div className="flex flex-col  w-1/2 gap-5">
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
        <div className="mt-4 flex flex-col justify-center align-center w-1/2 m-[20px]">
          <img
            src={card}
            alt="Illustration"
            className="rounded-md w-fill"
          />
        </div>
      </div> : <div className="w-1/2"> <AnimatedGraph /></div>
     }

      </div>
  );
};

      export default AttendanceDashboard;
