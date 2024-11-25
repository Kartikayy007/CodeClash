import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const AttendanceChart = () => {
    const sidebarWidth = useSelector((state) => state.sidebar.width); // Sidebar width state
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed); // Sidebar collapsed state

    const subjects = ['English', 'Maths', 'Science'];
    const dataValues = [25, 50, 75];
    const data = {
        labels: subjects,
        datasets: [
            {
                data: dataValues,
                backgroundColor: ['#8ED1FC', '#B388EB', '#FF8A80'],
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
                ticks: {
                    color: 'black',
                    maxRotation: 0, // Prevent label rotation
                    minRotation: 0, // Prevent label rotation
                    autoSkip: false, // Ensure all labels are displayed
                },
                grid: {
                    display: false, // Optionally hide x-axis grid lines
                },
            },
            y: {
                beginAtZero: true,
                display: true,
                max: 100,
                ticks: {
                    color: 'black',
                    stepSize: 25,
                },
                title: {
                    display: true,
                    text: '% of Students',
                    color: 'gray',
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: 'lightgray',
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 40,
    };

    return (
        <div
            className="flex flex-col p-4 border border-[#BCE2DF] rounded-lg bg-white ml-0 w-full justify-center gap-[25px]"
            style={{
                transition: 'margin 0.3s ease',
            }}
        >
            <h2 className="text-[16px] ">Average Attendance</h2>
            <div className="flex items-center ">
                <div className="w-[50%] h-[200px] text-gray-500 ">
                    <Bar data={data} options={options} />
                </div>
                <div className="flex flex-col gap-10 w-[50%]">
                    <ul
                        className={`${
                            isCollapsed ? 'items-center' : 'ml-5'
                        } text-sm space-y-2 flex flex-col gap-2 text-gray-600`}
                    >
                        {subjects.map((subject, index) => (
                            <li
                                key={subject}
                                className={`${
                                    isCollapsed ? 'items-center' : 'ml-5'
                                } flex items-center`}
                            >
                                <span
                                    className="w-3 h-3 mr-2 rounded-sm ml-2"
                                    style={{
                                        backgroundColor: data.datasets[0].backgroundColor[index],
                                    }}
                                ></span>
                                {`Greater than ${dataValues[index]}%`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AttendanceChart;
