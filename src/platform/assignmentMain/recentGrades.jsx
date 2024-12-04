import React, { useEffect, useState } from "react";
import cardimg from "../assets/bro.svg";
import axios from "axios";

const RecentGrades = () => {
  const [assignmentData, setAssignmentData] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/assignment`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setAssignmentData(response.data.user.recentGrades);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="flex flex-col gap-5 h-full">
      <h2 className="text-xl w-[95%] mx-auto">Recent Grades</h2>
      <div className="bg-[#FAFAFA] border border-[#BCE2DF] p-4 rounded-md mx-auto w-[95%] h-[80%] overflow-y-auto">
        <div className="space-y-4 h-full">
          {assignmentData && assignmentData.length > 0 ? (
            assignmentData.map((grade, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-md border border-[#D9DEDE] p-4 transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={cardimg}
                    alt="Grade Icon"
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-lg text-gray-700">
                    {grade}
                  </span>
                </div>
                <div className="text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-xl font-semibold">No grades available.</p>
              <p>Grades will appear here once they are available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentGrades;