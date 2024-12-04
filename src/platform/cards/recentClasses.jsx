import React, { useState, useEffect } from 'react';
import card1 from '../assets/recent.svg';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import image from '../assets/cuate.svg'

const RecentClasses = ({ recentClasses }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const createdClasses = useSelector((state) => state.createdClasses.createdClasses);
    const Navigate = useNavigate();
    const classesData = recentClasses;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getInitials = (name) => {
        const nameArray = name.split(' ');
        const initials = nameArray.map(word => word[0]).join('');
        return initials.toUpperCase();
    };

    const handleCardClick = (classId) => {
        const classInfo = createdClasses.find((classItem) => classItem._id === classId);
        if (classInfo) {
            Navigate("/announcement", { state: { code: classInfo.code, _id: classInfo._id } });
        }
    };

    return (
        <div className={`bg-[#FAFAFA] p-6 border border-[#BCE2DF] rounded-lg ${isMobile ? 'w-[100%]' : 'w-[45%]'} h-[100%] mt-[20px]`}>
            <h2 className="text-2xl mb-6 h-[10%]">Recent Classes</h2>
            <div className="space-y-4 h-[90%]">
                {classesData.length > 0 ? (
                    classesData.map((classItem, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-[#F7F8F8] p-[6px] border border-[#D9DEDE] rounded-lg shadow-sm h-[45%]"
                            onClick={() => handleCardClick(classItem._id)}
                        >
                            <div className="rounded-lg w-[50%] h-[100%] p-2 flex flex-col justify-center">
                                <img
                                    src={card1}
                                    alt={classItem.subject}
                                    className="w-[100%] rounded-md"
                                />
                            </div>
                            <div className="w-3/4 flex flex-col h-[100%] justify-between p-4">
                                <h3 className="text-2xl">{classItem.subject}</h3>
                                <div className="flex flex-col text-gray-600 text-sm mt-2 justify-between gap-2">
                                    <span className="mr-4 flex gap-2"><PeopleIcon />{classItem.students ? classItem.students.length : 0}</span>
                                    <div>
                                        <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs mr-2">
                                            {getInitials(classItem.teacher.name)}
                                        </span>
                                        <span>{classItem.teacher.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <img src={image} alt="" className='w-1/2' />
                        <h1 className='font-semibold text-xl'>No upcoming classes scheduled</h1>
                        <p className='text-center'>You're all set for now. Check back later or use the calendar to plan ahead.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentClasses;