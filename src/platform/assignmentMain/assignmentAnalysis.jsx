import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AssignmentAnalysis = () => {
  const data = {
    labels: ["Assignments"],
    datasets: [
      {
        label: "Completed Assignments",
        data: [4],
        backgroundColor: "#0A5757",
      },
      {
        label: "Assignments due soon",
        data: [5],
        backgroundColor: "#00A8A5",
      },
      {
        label: "Overdue Assignments",
        data: [3],
        backgroundColor: "#71DBD3",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 

    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
        barPercentage: 0.5, 

      },
      y: {
        beginAtZero: true,
        grid: { color: "#E5E7EB" },
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <h2 className="text-xl text-black w-[95%] mx-auto">
        Assignment Performance Analysis
      </h2>
      <div className="bg-gray-100 p-5 rounded-md h-[80%] border border-[#BCE2DF] w-[95%] flex gap-12 mx-auto">
        <div className="flex flex-col w-[50%] h-full">
          <div className="flex items-center justify-center h-full">

            <Bar data={data} options={options} />
          </div>
        </div>
        <div className="space-y-2 w-[50%] flex flex-col items-start">
          <button className="bg-gray-200 text-sm px-3 py-1 rounded-md shadow-sm self-end">
            All Classes
          </button>
          <div className="flex flex-col items-start gap-4 justify-center h-full">
            <div className="flex items-center text-lg">
              <div className="w-4 h-4 bg-[#0A5757] rounded-sm mr-2"></div>
              Completed Assignments (4)
            </div>
            <div className="flex items-center text-lg">
              <div className="w-4 h-4 bg-[#00A8A5] rounded-sm mr-2"></div>
              Assignments due soon (5)
            </div>
            <div className="flex items-center text-lg">
              <div className="w-4 h-4 bg-[#71DBD3] rounded-sm mr-2"></div>
              Overdue Assignments (3)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAnalysis;
