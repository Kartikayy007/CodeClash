import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';
import Performance from '../performance/performance';
import WeekView from '../week/week';
import TodoList from '../todolist/todolist';
import { useDispatch } from 'react-redux';
import { setJoinedClasses } from '../features/joinedClasses';
import { setCreatedClasses } from '../features/createdClasses';
import { setUserName,setUserMail, setNoOfJoinedClasses,setNoOfCreatedClasses } from '../features/userSlice';  
import axios from 'axios';

const Dashboard = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth >= 1024);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            const token = sessionStorage.getItem("authToken")|| localStorage.getItem("authToken");
           console.log(token)
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/details`,
                    { headers },
                    { signal }  
                );

              
                if (response.data.success) {
                    console.log(response.data.user)
                    sessionStorage.setItem('userId',response.data.user._id);
                    
                    const { joinedClasses, createdClasses } = response.data.user;
                    dispatch(setJoinedClasses(joinedClasses));
                    dispatch(setCreatedClasses(createdClasses));
                    dispatch(setUserName(response.data.user.name)); 
                    dispatch(setUserMail(response.data.user.email));
                    dispatch(setNoOfJoinedClasses(response.data.user.noOfJoinedClasses));
                    dispatch(setNoOfCreatedClasses(response.data.user.noOfCreatedClasses));
                    
                    console.log(response)
                    

                }
            } catch (error) {
                console.log(error)
            }
        };

        fetchData();

        return () => {
            controller.abort(); 
        };
    }, []); 

    return (
    <div className={`bg-[#E1EAE8] ${isMobile?'h-[110vh]':'h-[230vh]'}`}>

        <Sidebar />
        <Header />
        <div className={`flex ${isMobile?' ml-[15px]':'flex-col '}  h-[100vh] bg-[#E1EAE8]`}>
            <Performance />
            <div className={` ${isMobile?'w-[30%]':'w-[97%]'} `}> 
                <div className='h-[10%] mt-[70px]'></div>
                {isMobile && <WeekView />}
                <div className={`h-[60%] ${isMobile?'mt-[20px]':'ml-[3%]'}`}><TodoList />
                </div>
            </div>
        </div>
    </div>
    );
};

export default Dashboard;
