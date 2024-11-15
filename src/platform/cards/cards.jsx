import React from 'react';
import card1 from '../assets/card1.svg'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Card = ({ className, studentCount, teacherName }) => {
    return (
        <div className="bg-white rounded-lg  p-4 flex flex-col items-start w-[30%]  border border-teal-200">
            <div className='bg-[#919F9E] w-full rounded-lg flex justify-between pr-3 pt-1 text-white'>
            <img src={card1} alt={`${className} illustration`} className="w-fit h-32  object-cover rounded-md mb-4" />
            <MoreHorizIcon/>
            </div>
            <h2 className="text-2xl  mt-11">{className}</h2>
            <div className='flex justify-between w-full'>
            <div className="flex items-center text-gray-600 text-sm mt-2">
                <span className="mr-1"> 
                <PeopleOutlineIcon/>
                </span>
                <span>{studentCount}</span>
            </div>
            <div className="flex items-center mt-2">
                <img src={`https://ui-avatars.com/api/?name=${teacherName}`} alt={teacherName} className=" rounded-full mr-2" />
                <span className="text-sm text-gray-600">{teacherName}</span>
            </div>
            </div>
        </div>
    );
};

export default Card;
