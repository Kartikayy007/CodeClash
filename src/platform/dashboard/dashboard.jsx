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
import { setUserName } from '../features/userSlice';  



import axios from 'axios';

const Dashboard = () => {
    const navigate=useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            const token = sessionStorage.getItem("authToken");
console.log(token)
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/user/details`,{},
                    { headers },
                    { signal }  
                );

              
                if (response.data.success) {
                    console.log(response.data.user)
                    
                    const { joinedClasses, createdClasses } = response.data.user;
                    dispatch(setJoinedClasses(joinedClasses));
                    dispatch(setJoinedClasses(createdClasses));
                    dispatch(setUserName(response.data.user.name)); 
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
   





    return (<div className='bg-[#E1EAE8] h-[110vh]'>

        <Sidebar />
        <Header />
        <div className='flex  ml-[15px] h-[100vh] bg-[#E1EAE8]'>
            <Performance />
            <div className='w-[30%] '> 
                <div className='h-[10%] mt-[70px]'></div>
                <WeekView />
                <div className='h-[60%] mt-[20px]'><TodoList /></div>
             
            </div>



        </div>



    </div>
    );
};

export default Dashboard;
