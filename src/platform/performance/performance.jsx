import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Attendance from '../attendance/attendance';
import RecentClasses from '../cards/recentClasses';
import { useSelector } from 'react-redux';




ChartJS.register(BarElement, CategoryScale, LinearScale);

const Performance = () => {

    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);


    const data = {
        labels: ['Assignments'],
        datasets: [
            {
                label: 'Completed Assignments',
                data: [4],
                backgroundColor: '#8ED1FC',
             
            },
            {
                label: 'Assignments due soon',
                data: [5],
                backgroundColor: '#B388EB',
            },
            {
                label: 'Overdue Assignments',
                data: [3],
                backgroundColor: '#FF8A80',
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { 
                display: true,
                ticks: { color: 'black' },
                barThickness: 15,
                
               
               
            },
            y: {
                beginAtZero: true,
                display: true,
                ticks: { color: 'black', stepSize: 1 },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 30,
       
        
    };

    return (
        
        <div className="w-[65%] pl-1   " style={{ marginLeft: sidebarWidth,transition: 'margin-left 0.3s ease'}}>
             <div className="w-full h-[70px]">
                <p className="text-[23px] pt-[15px]  font-semibold mt-[5px]">Good Morning, Shreyanshu!</p>
            </div>
            <div className='flex '>
            
            <div className='w-[60%]' >
                
            <h2 className="text-xl mb-8 ">Class performance Overview</h2>
            <div className="flex items-center h-[250px] p-4 pt-8 border border-teal-200 rounded-lg bg-white">
                <div className="w-[200px] h-[100%]">
                    <Bar data={data} options={options} />
                </div>
                <div className=" ml-[5%] flex flex-col gap-[40px] w-[100%]">
                    <ul className={`${isCollapsed?"items-center":""} text-sm space-y-2 flex flex-col gap-[10px]`}>
                        <li className="flex items-center">
                            <span className="w-3 h-3 bg-[#8ED1FC] mr-2 rounded-sm"></span>
                            Completed Assignments (4)
                        </li>
                        <li className="flex items-center">
                            <span className="w-3 h-3 bg-[#B388EB] mr-2 rounded-sm"></span>
                            Assignments due soon (5)
                        </li>
                        <li className="flex items-center">
                            <span className="w-3 h-3 bg-[#FF8A80] mr-2 rounded-sm"></span>
                            Overdue Assignments (3)
                        </li>
                    </ul>
                    <button className="mt-4 px-4 py-2 w-[70%] ml-[15%] bg-teal-700 text-white rounded-md hover:bg-teal-800">
                        View Analysis
                    </button>
                </div>
            </div>
            </div>
            <div className="flex gap-4 mt-[45px] ml-[20px] w-[40%]">
                <Attendance />
                

                </div></div>
                <RecentClasses/>
        </div>
    );
};

export default Performance;
