import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AssignmentAnalysis = () => {
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const [data, setData] = useState({ datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/assignment`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (isEnrolled) {
          setData({
            labels: ["Assignments"],
            datasets: [
              {
                label: "Completed Assignments",
                data: [response.data.user.joinedClassrooms.completedAssignments],
                backgroundColor: "#0A5757",
              },
              {
                label: "Assignments due soon",
                data: [response.data.user.joinedClassrooms.dueSoonAssignments],
                backgroundColor: "#00A8A5",
              },
              {
                label: "Overdue Assignments",
                data: [response.data.user.joinedClassrooms.overdueAssignments],
                backgroundColor: "#71DBD3",
              },
            ],
          });
        } else {
          setData({
            labels: ["Assignments"],
            datasets: [
              {
                label: "Completed Assignments",
                data: [response.data.user.createdClassrooms.completedAssignments],
                backgroundColor: "#0A5757",
              },
              {
                label: "Assignments due soon",
                data: [response.data.user.createdClassrooms.dueSoonAssignments],
                backgroundColor: "#00A8A5",
              },
              {
                label: "Overdue Assignments",
                data: [response.data.user.createdClassrooms.overdueAssignments],
                backgroundColor: "#71DBD3",
              },
            ],
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [isEnrolled]);

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
            {data.datasets.length > 0 ? <Bar data={data} options={options} /> : <p>Loading...</p>}
          </div>
        </div>
        <div className="space-y-2 w-[50%] flex flex-col items-start">
      
          <div className="flex flex-col items-start gap-4 justify-center h-full">
            {data.datasets.length > 0 && (
              <>
                <div className="flex items-center text-lg">
                  <div className="w-4 h-4 bg-[#0A5757] rounded-sm mr-2"></div>
                  Completed Assignments ({data.datasets[0].data[0]})
                </div>
                <div className="flex items-center text-lg">
                  <div className="w-4 h-4 bg-[#00A8A5] rounded-sm mr-2"></div>
                  Assignments due soon ({data.datasets[1].data[0]})
                </div>
                <div className="flex items-center text-lg">
                  <div className="w-4 h-4 bg-[#71DBD3] rounded-sm mr-2"></div>
                  Overdue Assignments ({data.datasets[2].data[0]})
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAnalysis;