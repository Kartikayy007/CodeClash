import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import frameImage from '../../auth/assets/Frame.svg'; 
import DashboardIcon from '@mui/icons-material/GridViewOutlined';
import ClassIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';
const Sidebar = () => {
    return (
        <div className='bg-[#EEF0F0] w-[18%] h-screen flex flex-col items-start fixed'>
        <img src={frameImage} alt="logo" className='w-[70%] mt-[5vh] ml-9 ' />

        <div className='w-full h-[70%] mt-[10vh]'>
            <div className='w-full h-[70px] flex items-center justify-start ml-9'>
                <button className=' flex items-center justify-center gap-5 '>
                    <DashboardIcon fontSize='large' />
                    <p className='text-2xl'>Dashboard</p>
                </button>
            </div>
            <div className='w-full h-[70px] flex items-center justify-start ml-9'>
                <button className=' flex items-center justify-center gap-5 '>
                    <ClassIcon fontSize='large' />
                    <p className='text-2xl'>Your Classes</p>
                </button>
            </div>
            <div className='w-full h-[70px] flex items-center justify-start ml-9'>
                <button className=' flex items-center justify-center gap-5 '>
                    <AssignmentIcon fontSize='large' />
                    <p className='text-2xl'>Assignments</p>
                </button>
            </div>
            <div className='w-full h-[70px] flex items-center justify-start ml-9'>
                <button className=' flex items-center justify-center gap-5 '>
                    <CalendarIcon fontSize='large' />
                    <p className='text-2xl'>Calendar</p>
                </button>
            </div>
            <div className='w-full h-[70px] flex items-center justify-start ml-9'>
                <button className=' flex items-center justify-center gap-5 '>
                    <SettingsIcon fontSize='large' />
                    <p className='text-2xl'>Settings</p>
                </button>
            </div>
            <div className='w-full h-[70px] flex items-center justify-start ml-9'>
                <button className=' flex items-center justify-center gap-5 '>
                    <HelpIcon fontSize='large' />
                    <p className='text-2xl'>Help and Support</p>
                </button>
            </div>
        </div>
        </div>
    );
};

export default Sidebar;
