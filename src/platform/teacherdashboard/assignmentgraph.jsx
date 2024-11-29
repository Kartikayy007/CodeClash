import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';
import AttendanceChart from './teacherattendancegraph';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const AssignmentChart = () => {
    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

    const subjects = ['English', 'Maths', 'Science'];
    const dataValues = [25, 50, 75];
    const data = {
        labels: subjects,
        datasets: [
            {
                data: dataValues, 
                backgroundColor: ['#0A5757', '#00A8A5', '#71DBD3'], 
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                display: false,
                ticks: { color: 'black'},
            },
            y: {
                beginAtZero: true,
                display: true,
                max: 100,
                ticks: { color: 'black', stepSize: 25 },
                title: {
                    display: true,
                    text: '% of Students',
                    color: 'gray', 
                    font: {
                        size: 12, 
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 30,
    };

    return (
        
                    <div className="flex flex-col h-[100%] p-6 border border-[#BCE2DF] rounded-lg bg-white ">
                        <h2 className="text-[16px] bold">% of Students completed Assignment</h2>
                        <div className="flex items-center h-full pt-6">
                            <div className="w-[50%] h-[100%] text-gray-500">
                                <Bar data={data} options={options} />
                            </div>
                            <div className="flex flex-col gap-[40px] w-[60%] items-center">
                                <ul className={`${isCollapsed ? "items-start" : "self-start"} text-sm space-y-2 flex flex-col gap-[10px] text-gray-600`}>
                                    {subjects.map((subject, index) => (
                                        <li key={subject} className="flex items-center">
                                            <span
                                                className="w-3 h-3 mr-2 rounded-sm ml-5 "
                                                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                                                
                                            ></span>
                                            {` ${subject} ${dataValues[index]}%`}
                                        </li>
                                    ))}
                                </ul>
                                <button className={` mt-4 px-4 py-2 w-[90%] bg-teal-700 text-white rounded-md hover:bg-teal-800`}>
                                    View Analysis
                                </button>
                            </div>
                        </div>
                    </div>
                
    );
};

export default AssignmentChart;
