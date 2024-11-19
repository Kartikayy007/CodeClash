import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const Attendance = () => {
    const attendedClasses = 75;
    const totalClasses = 100;
    const notAttendedClasses = totalClasses - attendedClasses;

    const data = {
        labels: ['Class Attendance'],
        datasets: [
            {
                label: 'Attended',
                data: [attendedClasses],
                backgroundColor: '#8A7FF7', // Purple
                barThickness: 40,
            },
            {
                label: 'Not Attended',
                data: [notAttendedClasses],
                backgroundColor: '#F9A8A8', // Soft red
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
                position: 'top',
                align: 'center',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'rect',
                    boxWidth: 20,
                    font: {
                        
                        size: 12,
                        family: 'Arial, sans-serif',
                    },
                    color: '#4A4A4A',
                },
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Remove vertical gridlines
                },
                ticks: {
                    display: false, // Hide x-axis labels
                },
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 25, // Control divisions (100 / 25 = 4 divisions)
                    color: '#4A4A4A', // Tick label color
                    font: {
                        size: 12,
                        family: 'Arial, sans-serif',
                    },
                },
                grid: {
                    color: '#E5E7EB', // Light gray gridlines
                    borderDash: [5, 5], // Dotted gridline style
                },
            },
        },
    };

    return (
        <div className="w-full h-full p-6 border border-teal-200 rounded-lg bg-white flex flex-col items-center justify-center">
            <h2 className="text-xl mr-auto mb-6 text-black">Your Attendance</h2>
            <div className="w-[90%] h-[300px]">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default Attendance;
