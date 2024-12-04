import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import pana from '../assets/pana.svg';
import axios from 'axios';
import noDue from '../assets/rafiki.svg';

const AssignmentCard = ({ assignment }) => {
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  return (
    <div className="h-[45%] flex justify-between border border-[#D9DEDE] items-center p-4 bg-white rounded-lg ">
      <div className='flex flex-col h-[95%] justify-between'>
        <h3 className="text-xl">{assignment.title}</h3>
        <div>
          <div className="flex items-center text-sm text-gray-500 mt-1 gap-2">
            <MenuBookIcon />
            <span>{assignment.classroomSubject}</span>
          </div>
          <div className="flex items-center text-gray-600 mt-2 text-lg">
            <span className="h-4 w-4 bg-purple-600 rounded-full mr-2"></span>
            Submitted On: {assignment.dueDate}
          </div>
          {!isEnrolled && <div>
            Reviewed: {assignment.reviewedSubmissions}/{assignment.totalSubmissions}
          </div>}
        </div>
      </div>
      <div className="">
        <img src={pana} alt="Illustration" className="w-full h-full object-cover rounded-md" />
      </div>
    </div>
  );
};

const DueAssignments = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [dashboardData, setDashboardData] = useState([]);
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/dashboard`, { headers });
        console.log(response.data.details);
        if (isEnrolled) {
          setDashboardData(response.data.details.joined.dueSoonAssignments);
        } else {
          setDashboardData(response.data.details.created.dueSoonAssignments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [isEnrolled]);

  return (
    <div className={`bg-white p-6 border border-[#BCE2DF] rounded-lg ${isMobile ? 'w-[100%] ml-0' : 'w-[55%] ml-[20px]'} mt-[20px] h-[100%]`}>
      <h2 className="text-2xl mb-6 h-[10%]">Assignments Due Soon</h2>
      <div className="h-[90%] space-y-4">
        {dashboardData.length > 0 ? (
          dashboardData.map((assignment, index) => (
            <AssignmentCard
              key={index}
              assignment={assignment}
              illustration={"https://via.placeholder.com/64"}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <img src={noDue} alt="" className='w-1/2' />

            <p className='text-xl font-semibold'>No assignments due soon.</p>
            <p>You're on top of your work. Keep up the great effort!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DueAssignments;