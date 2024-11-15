import React from 'react';
// import { FaBook } from 'react-icons/fa';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import pana from '../assets/pana.svg';

const assignments = [
  {
    title: 'Mid-Term Essay',
    subject: 'English',
    dueDate: 'Nov 7, 11:59 PM',
    illustration: 'https://via.placeholder.com/64',
  },
  {
    title: 'Differentiation-I',
    subject: 'Maths',
    dueDate: 'Nov 9, 8:00 PM',
    illustration: 'https://via.placeholder.com/64',
  },
  
];

const AssignmentCard = ({ title, subject, dueDate, illustration }) => {
  return (
    <div className="h-[45%] flex justify-between border border-[#D9DEDE] items-center p-4 bg-white rounded-lg ">
      <div className='flex flex-col h-[95%] justify-between'>
        <h3 className="text-xl">{title}</h3>
        <div>
        <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
          <MenuBookIcon/>
          <span>{subject}</span>
        </div>
        <div className="flex items-center  text-gray-600 mt-2 text-lg">
          <span className="h-4 w-4 bg-purple-600 rounded-full mr-2"></span>
          Due Date: {dueDate}
        </div>
        </div>
      </div>
      <div className="">
        <img src={pana} alt="Illustration" className="w-full h-full object-cover rounded-md" />
      </div>
    </div>
  );
};

const DueAssignments = () => {
  return (
    <div className="bg-white p-6 border border-teal-200 rounded-lg w-[55%] ml-[20px] mt-[20px] h-[100%]">
      <h2 className="text-2xl  mb-6 h-[10%]">Assignments Due Soon</h2>
      <div className="h-[90%] space-y-4">
        {assignments.map((assignment, index) => (
          <AssignmentCard
            key={index}
            title={assignment.title}
            subject={assignment.subject}
            dueDate={assignment.dueDate}
            illustration={assignment.illustration}
          />
        ))}
      </div>
    </div>
  );
};

export default DueAssignments;
