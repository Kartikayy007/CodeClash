import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const AttendanceChart = () => {
    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

    const [subjects, setSubjects] = useState([]);
    const [dataValues, setDataValues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                setLoading(true);
                const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                };
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/dashboard`, { headers });

                if (response.data.success) {
                    const averageAttendanceData = response.data.details.created.averageAttendance;


                    const sortedData = averageAttendanceData.sort((a, b) => new Date(b.date) - new Date(a.date));


                    const lastThreeClasses = sortedData.slice(0, 3);

                    const subjectsData = [];
                    const attendanceRates = [];

                    lastThreeClasses.forEach((classData) => {
                        subjectsData.push(classData.className);
                        if (classData.attendance === null) {
                            classData.attendance = 0;
                        }
                        attendanceRates.push(Math.round(classData.attendance));
                    });

                    setSubjects(subjectsData);
                    setDataValues(attendanceRates);
                }
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, []);

    // Empty data for loading state (initial empty graph)
    const emptyData = {
        labels: [], // Empty labels for loading state
        datasets: [
            {
                data: [0, 0, 0], // Empty values to show an empty graph
                backgroundColor: ['#E5F7F6', '#BBE5E1', '#71DBD3'],
            },
        ],
    };

    // Actual data once loaded
    const data = {
        labels: loading ? [] : subjects, // Show no labels while loading
        datasets: [
            {
                data: dataValues,
                backgroundColor: dataValues.map(value => {
                    if (value > 80) return '#0A5757';
                    if (value > 60) return '#00A8A5';
                    if (value >= 0) return '#71DBD3';
                    return '#BBE5E1';
                }),
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
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: false,
                },
                grid: {
                    display: false,
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
            
            <div className="flex items-center gap-12">
                <div className="w-[50%] h-[200px] text-gray-500">
                    <Bar data={loading ? emptyData : data} options={options} />
                </div>
                <div className="flex flex-col w-[50%] pb-[50px]">
                    <div className="flex flex-col gap-4 text-gray-600">
                        <div className="flex items-center ">
                            <span className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: '#0A5757' }}></span>
                            Greater than 80%
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: '#00A8A5' }}></span>
                            Between 60 - 80%
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: '#71DBD3' }}></span>
                            Less than 60%
                        </div>
                    </div>
                </div>
            </div>
            
            {subjects.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p className='text-xl font-semibold text-center'>No attendance data available.</p>
                    <p className='text-center'>It'll show up once live classes are held.</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceChart;
