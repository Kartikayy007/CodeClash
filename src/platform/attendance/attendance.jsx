import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';


ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const Attendance = () => {
    const attendedClasses = 75;
    const totalClasses = 100;
    const notAttendedClasses = totalClasses - attendedClasses;
    const attendancePercentage = ((attendedClasses / totalClasses) * 100).toFixed(1);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

    const data = {
        labels: ['Class Attendance'],
        datasets: [
            {
                label: 'Present',
                data: [attendedClasses],
                backgroundColor: '#8A7FF7',
                barThickness: 40,
            },
            {
                label: 'Absent',
                data: [notAttendedClasses],
                backgroundColor: '#F9A8A8',
                barThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,

                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect',
                    boxWidth: 12,
                    font: {
                        size: 12
                    }
                },
            },
            tooltip: { enabled: true },
        },
        scales: {
            x: {
                grid: { display: false },
                stacked: true,

                ticks: {
                    display: true,
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    padding: 10,
                },
            },
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: '#E5E7EB' },
                stacked: true,
            },
        },
        barPercentage: 0.6,
    };

    return (
        <div className="w-full h-full p-6 border border-teal-200 rounded-lg bg-[#F4F7F9] flex flex-col items-center justify-center">
            <h2 className="text-xl self-start mb-6 ml-6">Your Attendance</h2>
            <div className="w-[90%] h-[90%] flex flex-col justify-center">
                <Bar data={data} options={options} style={{ width: 390 }} />
            </div>
        </div>
    );
};

export default Attendance;
