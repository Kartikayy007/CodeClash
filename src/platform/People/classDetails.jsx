import React from "react";
import './people'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useSelector } from 'react-redux';


const ClassDetails = ({ instructor, students }) => {
    const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  return (
    <div className=" rounded-lg ">
      <div className="mb-6 h-[90px] bg-white p-4 rounded-lg flex items-center border border-[#BCE2DF] justify-between">
        <div className="flex flex-col gap-[10px]"><h1 className="text-lg">Instructor</h1>
        <div className="flex">
        <img
          src={instructor.avatar}
          alt="Instructor"
          className="w-12 h-12 rounded-full mr-4"
        />
       
        <div className="flex-grow flex flex-col justify-center">
         
          <p className="text-sm text-gray-600">{instructor.name}</p>
        </div>
        </div>
        </div>
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11 8.38 8.38 0 013.8.9L21 3v7.5z"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-[#BCE2DF] ">
        <div className="flex justify-between items-center mb-4">
         
          <h2 className="text-lg ">Classmates</h2>
          <div className="flex gap-[10px]">
          <p className="text-sm text-gray-600">{students.length} Students</p>
          {!isEnrolled?<PersonAddAltIcon/>:<></>}
          
          </div>
        </div>
        <div className="space-y-4 flex flex-col gap-[10px]">
          {students.map((student, index) => (
            <div key={index} className="flex items-center">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <p className="text-gray-700">{student.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
