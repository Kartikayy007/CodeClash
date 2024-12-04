import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const Attendance = ({ averageAttendance }) => {
    const totalClasses = averageAttendance.reduce((sum, classData) => sum + classData.totalLectures, 0);
    const attendedClasses = averageAttendance.reduce((sum, classData) => sum + (classData.attendance * classData.totalLectures / 100), 0);
    const notAttendedClasses = totalClasses - attendedClasses;
    const attendancePercentage = ((attendedClasses / totalClasses) * 100).toFixed(1);
    const notAttendedPercentage = ((notAttendedClasses / totalClasses) * 100).toFixed(1);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

    const data = {
        labels: ['Class Attendance'],
        datasets: [
            {
                label: 'Present',
                data: [attendancePercentage],
                backgroundColor: '#0A5757',
                barThickness: 40,
            },
            {
                label: 'Absent',
                data: [notAttendedPercentage],
                backgroundColor: '#00A8A5',
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
        <div className="w-full h-full p-6 border border-[#BCE2DF] rounded-lg bg-white flex flex-col items-center justify-center">
            
            {totalClasses > 0 ? (
                
                <div className="w-[90%] h-[90%] flex flex-col justify-center">
                    <h2 className="text-xl self-start mb-6 ml-6">Your Attendance</h2>
                    <Bar data={data} options={options} style={{ width: 390 }} />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <h1 className='text-center text-gray-500 text-xl font-semibold'>No attendance records yet.</h1>
                    <p className='text-center text-gray-500'>Live classes haven't started yet.</p>
                </div>
            )}
        </div>
    );
};

export default Attendance;