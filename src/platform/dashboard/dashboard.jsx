import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';
import Performance from '../performance/performance';
import WeekView from '../week/week';
import TodoList from '../todolist/todolist';

const Dashboard = () => {
 


    

    return (<div className='bg-[#E1EAE8] h-[100vh]'>

        <Sidebar/>
        <Header/>
        <div className='flex mt-[20px] ml-[15px]'>
        <Performance/>
        <div className='mt-[86px]'> <WeekView />
        <TodoList /></div>

       
        
        </div>
       
        
        
    </div>
    );
};

export default Dashboard;
