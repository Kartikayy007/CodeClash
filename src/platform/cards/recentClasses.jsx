import React, { useState, useEffect } from 'react';
import card1 from '../assets/recent.svg';
import PeopleIcon from '@mui/icons-material/People';

const classesData = [
    {
        subject: 'English',
        studentsCount: 45,
        teacherInitials: 'AS',
        teacherName: 'Abc Sharma',
        image: 'path-to-image/english.png', 
    },
    {
        subject: 'Science',
        studentsCount: 45,
        teacherInitials: 'AX',
        teacherName: 'Abc XYZ',
        image: 'path-to-image/science.png', 
    },
];

const RecentClasses = ({ classes }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`bg-[#FAFAFA] p-6 border border-[#BCE2DF] rounded-lg ${isMobile ? 'w-[100%]' : 'w-[45%]'} h-[100%] mt-[20px]`}>
            <h2 className="text-2xl  mb-6 h-[10%]">Recent Classes</h2>
            <div className="space-y-4 h-[90%]">
                {classesData.map((classItem, index) => (
                    <div key={index} className="flex items-center bg-[#F7F8F8] p-[6px] border border-[#D9DEDE] rounded-lg shadow-sm h-[45%]">
                        <div className=" rounded-lg w-[50%] h-[100%] p-2 flex flex-col justify-center">
                            <img
                                src={card1}
                                alt={classItem.subject}
                                className=" w-[100%] rounded-md"
                            />
                            </div>
                        <div className="w-3/4 flex flex-col h-[100%] justify-between p-4">
                            <h3 className="text-2xl">{classItem.subject}</h3>
                            <div className="flex flex-col  text-gray-600 text-sm mt-2 justify-between gap-2">
                                <span className="mr-4 flex gap-2"><PeopleIcon/>{classItem.studentsCount}</span>
                                <div>
                                <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs mr-2">
                                    {classItem.teacherInitials}
                                </span>
                                <span>{classItem.teacherName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentClasses;
