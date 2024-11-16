import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Attendance from '../attendance/attendance';
import RecentClasses from '../cards/recentClasses';
import { useSelector } from 'react-redux';
import DueAssignments from '../dueAssignments/dueAssign';





ChartJS.register(BarElement, CategoryScale, LinearScale);

const Performance = () => {

    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
    const userName = useSelector((state) => state.user.name);  
    const formattedUserName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();





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
             <div className="w-full h-[10%] mt-[70px]">
                <p className="text-[23px] pt-[15px]  font-semibold ">Good Morning, {formattedUserName}!</p>
            </div>
            <div className='flex h-[35%]'>
            
            <div className='w-[55%] h-[100%]' >
            


            <div className="flex items-center h-[100%]  p-4 pt-8 border border-teal-200 rounded-lg bg-white">
                <div className="w-[45%] h-[100%]">
                    <Bar data={data} options={options} />
                </div>
                <div className=" flex flex-col gap-[40px] w-[55%]">
                    <ul className={`${isCollapsed?"items-center ":"ml-[5%]"} text-sm space-y-2 flex flex-col gap-[10px]`}>
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
                    <button className={`${isCollapsed?"mx-auto ":"ml-[15%] "}mt-4 px-4 py-2 w-[70%] bg-teal-700 text-white rounded-md hover:bg-teal-800`}>
                        View Analysis
                    </button>
                </div>
            </div>
            </div>
            <div className="flex gap-4  ml-[20px] w-[45%] h-[100%]">
                <Attendance />
                

                </div></div>
                <div className='flex h-[45%]'>
                <RecentClasses/>
                <DueAssignments/>
                </div>
        </div>
    );
};

export default Performance;
