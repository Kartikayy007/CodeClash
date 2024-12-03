import React from "react";
import assignmentImg from "../assets/pana.svg"
import FilterListIcon from '@mui/icons-material/FilterList';
const assignments = [
  {
    id: 1,
    title: "Mid-Term Essay",
    subject: "English",
    dueDate: "Nov 7, 11:59 PM",
    status: "Due Soon",
  },
  {
    id: 2,
    title: "Mid-Term Essay",
    subject: "English",
    dueDate: "Nov 7, 11:59 PM",
    status: "Due Soon",
  },
  {
    id: 3,
    title: "Mid-Term Essay",
    subject: "English",
    dueDate: "Nov 7, 11:59 PM",
    status: "Due Soon",
  },
  {
    id: 4,
    title: "Mid-Term Essay",
    subject: "English",
    dueDate: "Nov 7, 11:59 PM",
    status: "Due Soon",
  },
];

const YourAssignments = () => {
  return (
    <div className="p-6  h-[60%] flex flex-col gap-[10px]">
      <h2 className="text-xl  h-[7%] flex w-full items-center">Your Assignments</h2>
      <div className="flex items-center gap-4 h-[13%]">
        <FilterListIcon fontSize="large"/>
        <button className="flex items-center bg-[#D9DEDE] border border-gray-300 px-4 py-2 rounded-md text-lg shadow-sm">
          <span className="mr-2">
           
          </span>
          Filter by Class
        </button>
        <button className="flex items-center bg-[#D9DEDE] border border-gray-300 px-4 py-2 rounded-md text-lg shadow-sm">
          <span>Sort by :</span>
          <select className="ml-2 bg-transparent focus:outline-none text-lg">
            <option>Due Soon</option>
            <option>Completed</option>
          </select>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 h-[80%]">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white p-4 rounded-lg border border-[#BCE2DF] flex gap-4 items-center justify-between"
          >
            <div className="flex flex-col h-full justify-between">
              <h3 className="text-2xl">{assignment.title}</h3>
              <p className="text-lg text-gray-600">{assignment.subject}</p>
              <p className="text-lg text-gray-600 flex items-center">
                <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
                Due Date: {assignment.dueDate}
              </p>
              <div className="flex gap-2 mt-[10px]">
                <button className="bg-[#145A5E] text-white px-4 py-2 text-lg rounded-md shadow-md">
                  View Assignment
                </button>
                <button className="bg-[#EAF2F1] border border-[#145A5E] text-[#145A5E] px-4 py-2 text-lg rounded-md shadow-md">
                  Set Reminder
                </button>
              </div>
            </div>
            <div> 
              <img
                src={assignmentImg}
                alt="Assignment Illustration"
                className=" object-contain"
               
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourAssignments;
