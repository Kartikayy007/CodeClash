import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useSelector } from 'react-redux';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const AssignmentChart = () => {
    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

    const [subjects, setSubjects] = useState([]);
    const [completionRates, setCompletionRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchAssignmentData = async () => {
            try {
                setLoading(true);

                const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/dashboard`, {
                    headers,
                });

                const { details } = response.data;
                setUserName(details.name);
                const createdAssignments = details.created.assignments;

                const subjectsData = [];
                const ratesData = [];


                const allAssignments = createdAssignments.flatMap(assignmentGroup => 
                    assignmentGroup.assignments.map(assignment => ({
                        ...assignment,
                        classroomSubject: assignmentGroup.classroomSubject
                    }))
                ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


                const latestThreeAssignments = allAssignments.slice(0, 3);

                latestThreeAssignments.forEach((assignment) => {
                    subjectsData.push(assignment.classroomSubject);
                    const completionRate = assignment.isGraded ? 100 : 0;
                    ratesData.push(completionRate);
                });

                setSubjects(subjectsData);
                setCompletionRates(ratesData);
            } catch (error) {
                console.error('Error fetching assignment data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentData();
    }, []);

    const data = {
        labels: subjects.slice(0, 3),
        datasets: [
            {
                data: completionRates,
                backgroundColor: ['#0A5757', '#00A8A5', '#71DBD3', '#BBE5E1', '#E5F7F6'],
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
                ticks: { color: 'black' },
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
                    font: { size: 12 },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 30,
    };

    const emptyData = {
        labels: ['Subject 1', 'Subject 2', 'Subject 3'],
        datasets: [
            {
                data: [0, 0, 0], // Empty values to show an empty graph
                backgroundColor: ['#E5F7F6', '#BBE5E1', '#71DBD3'],
            },
        ],
    };

    return (
        <div className="flex flex-col h-[100%] p-6 border border-[#BCE2DF] rounded-lg bg-white">
            <h2 className="text-[16px]">% of Students completed Assignment</h2>
            <div className="flex items-center h-full pt-6">
                <div className="w-[50%] h-[100%] text-gray-500">
                    <Bar data={loading ? emptyData : data} options={options} />
                </div>
                <div className="flex flex-col gap-[40px] w-[60%] items-center">
                    <ul
                        className={`${
                            isCollapsed ? 'items-start' : 'self-start'
                        } text-sm space-y-2 flex flex-col gap-[10px] text-gray-600`}
                    >
                        {subjects.slice(0, 3).map((subject, index) => (
                            <li key={subject} className="flex items-center">
                                <span
                                    className="w-3 h-3 mr-2 rounded-sm ml-5"
                                    style={{
                                        backgroundColor: data.datasets[0].backgroundColor[index % 5],
                                    }}
                                ></span>
                                {`${subject}`}
                            </li>
                        ))}
                    </ul>
                    <button
                        className={`mt-4 px-4 py-2 w-[90%] bg-teal-700 text-white rounded-md hover:bg-teal-800`}
                        onClick={() => { window.location.href = '/assignments'; }}
                    >
                        View Analysis
                    </button>
                </div>
            </div>
            {subjects.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p className='font-semibold text-xl'>No data yet</p>
                    <p>No assignments available.</p>
                </div>
            )}
        </div>
    );
};

export default AssignmentChart;
