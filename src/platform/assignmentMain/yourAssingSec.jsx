import React, { useState, useEffect } from "react";
import assignmentImg from "../assets/assignCard.svg";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const YourAssignments = () => {
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

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
        console.log(response.data.user);
        if (isEnrolled) {
          const assignments = response.data.user.joinedClassrooms.allAssignments;
          const slicedAssignments = assignments.slice(0, 4);
          setData(slicedAssignments);
        } else {
          const assignments = response.data.user.createdClassrooms.allAssignments;
          const slicedAssignments = assignments.slice(0, 4);
          setData(slicedAssignments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [isEnrolled]);

  const handleSetReminder = () => {
    navigate('/calendar');
  };

  return (
    <div className="p-6 h-[60%] flex flex-col gap-[10px] min-h-[50vh]">
      <h2 className="text-xl h-[7%] flex w-full items-center">Your Assignments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 h-[80%]">
        {console.log(data)}
        {data && data.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white p-4 rounded-lg border border-[#BCE2DF] flex gap-4 items-center justify-between max-h-[150px]"
          >
            <div className="flex flex-col h-full justify-between w-2/3">
              <h3 className="text-2xl truncate">{assignment.title}</h3>
              <p className="text-lg text-gray-600 truncate">{assignment.classroomSubject}</p>
              <p className="text-lg text-gray-600 flex items-center truncate">
                <span className="w-4 h-4 bg-[#00A8A5] rounded-full mr-2"></span>
                Due Date: {assignment.dueDate}
              </p>
              <div className="flex gap-2 mt-[10px]">
                <button
                  className="bg-[#EAF2F1] border border-[#145A5E] text-[#145A5E] px-4 py-2 text-lg rounded-md shadow-md"
                  onClick={handleSetReminder}
                >
                  Set Reminder
                </button>
              </div>
            </div>
            <div className="w-1/3 h-full flex items-center justify-center">
              <img
                src={assignmentImg}
                alt="Assignment Illustration"
                className="object-contain h-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourAssignments;
