import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector } from 'react-redux';
import './joined.css'; 
import card from '../assets/card1.svg'

const classes = [
  {
    name: 'English',
    students: 45,
    teacher: 'Abc Sharma',
    imageUrl: '/path/to/image1.jpg',
  },
  {
    name: 'Maths',
    students: 45,
    teacher: 'XYZ EFG',
    imageUrl: '/path/to/image2.jpg',
  },
  {
    name: 'Science',
    students: 45,
    teacher: 'Abc Mishra',
    imageUrl: '/path/to/image3.jpg',
  },
  {
    name: 'Science',
    students: 45,
    teacher: 'Abc Mishra',
    imageUrl: '/path/to/image3.jpg',
  },
  {
    name: 'Science',
    students: 45,
    teacher: 'Abc Mishra',
    imageUrl: '/path/to/image3.jpg',
  },
];

const ClassCard = ({ name, students, teacher, imageUrl, index }) => {
  return (
    <div
      className={`bg-white rounded-lg p-3 flex flex-col justify-between border border-teal-200 w-[240px] h-[200px] fade-in-up mt-7`}
      style={{ animationDelay: `${index * 0.2}s` }} 
    >
      <div className="bg-[#919F9E] rounded-lg relative flex justify-between items-start h-fit p-5">
        <img src={card} alt={`${name} Class`} className="rounded-t-lg w-fit h-fit object-cover" />
        <MoreHorizIcon className="absolute top-2 right-2 text-white cursor-pointer" />
      </div>
      <div className="mt-2">
        <h3 className="text-2xl ">{name}</h3>
        <div className="flex items-center gap-2 mt-1 text-gray-600">
          <PeopleIcon fontSize="small" />
          <span>{students}</span>
          <span className="text-gray-500 text-sm ml-auto">{teacher}</span>
        </div>
      </div>
    </div>
  );
};

const JoinedClasses = () => {
  const sidebarWidth = useSelector((state) => state.sidebar.width);

  return (
    <div className="p-8 bg-[#E1EAE8] min-h-screen" style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.3s ease' }}>
      <h2 className="text-3xl font-semibold mb-4 mt-9">Your Joined Classes</h2>
      <div className="flex items-center mb-4">
        <span className="text-lg ">Sort by:</span>
        <Menu>
          <MenuItem>Recent Activity</MenuItem>
          <MenuItem>Date Created</MenuItem>
          <MenuItem>Class Name</MenuItem>
        </Menu>
      </div>
      <div className="flex flex-wrap gap-6 ">
        {classes.map((classInfo, index) => (
          <ClassCard key={index} {...classInfo} index={index} />
        ))}
      </div>
    </div>
  );
};

export default JoinedClasses;
