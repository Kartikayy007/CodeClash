import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';


ChartJS.register(ArcElement, Tooltip, Legend);

const Attendance = () => {
    const attendedClasses = 25;
    const totalClasses = 36;
    const notAttendedClasses = totalClasses - attendedClasses;
    const attendancePercentage = ((attendedClasses / totalClasses) * 100).toFixed(1);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);


    const data = {
        labels: ['Class Attended', 'Class Not Attended'],
        datasets: [
            {
                data: [attendedClasses, notAttendedClasses],
                backgroundColor: ['#4CAF50', '#E57373'],
                hoverBackgroundColor: ['#66BB6A', '#EF9A9A'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: '85%', 
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false } 
        },
    };

    return (
        <div className="w-[100%] h-[250px] p-4 border border-teal-200 rounded-lg flex flex-col items-center justify-center bg-white">
            <h2 className={`text-lg  mb-4 ${isCollapsed?'':'self-start '} `}>Your Attendance</h2>
            <div className='flex'>
            <div className="relative w-[100px]">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex items-center justify-center  text-xl">
                    {attendancePercentage}%
                </div>
            </div>
            <div className="flex flex-col   space-x-4 justify-center pl-[10px] items-baseline">
                <div className="flex items-center justify-center">
                    <span className="w-3 h-3 bg-[#4CAF50] mr-2 rounded-sm"></span>
                    Class Attended
                </div>
                <div className="flex items-center justify-center">
                    <span className="w-3 h-3 bg-[#E57373] mr-2 rounded-sm"></span>
                    Class Not Attended
                </div>
            </div>
            </div>
            <div className="text-center mt-8 text-sm flex gap-[15px]">
                <p>Total Present: {attendedClasses}</p>
                <p>Total Classes: {totalClasses}</p>
            </div>
        </div>
    );
};

export default Attendance;
