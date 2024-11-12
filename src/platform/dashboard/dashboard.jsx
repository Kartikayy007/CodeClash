import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';
import Performance from '../performance/performance';
import WeekView from '../week/week';
import TodoList from '../todolist/todolist';
import { useDispatch } from 'react-redux';
import { setJoinedClasses } from '../features/joinedClasses';
import { setCreatedClasses } from '../features/createdClasses';

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
   





    return (<div className='bg-[#E1EAE8] h-[100vh]'>

        <Sidebar />
        <Header />
        <div className='flex mt-[20px] ml-[15px] bg-[#E1EAE8]'>
            <Performance />
            <div className='mt-[83px] w-[30%] '> <WeekView />
                <TodoList />
            </div>



        </div>



    </div>
    );
};

export default Dashboard;
