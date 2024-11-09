import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import frameImage from '../../auth/assets/Frame.svg'; 
import DashboardIcon from '@mui/icons-material/GridViewOutlined';
import ClassIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';
const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState('');
    useEffect(() => {
        setActive(location.pathname);
    }, [location.pathname]);

    const menuItems = [
        { icon: <DashboardIcon fontSize='large' />, label: 'Dashboard', path: '/dashboard' },
        { icon: <ClassIcon fontSize='large' />, label: 'Your Classes', path: '/classes' },
        { icon: <AssignmentIcon fontSize='large' />, label: 'Assignments', path: '/assignments' },
        { icon: <CalendarIcon fontSize='large' />, label: 'Calendar', path: '/calendar' },
        { icon: <SettingsIcon fontSize='large' />, label: 'Settings', path: '/settings' },
        { icon: <HelpIcon fontSize='large' />, label: 'Help and Support', path: '/help' },
    ];

    
    return (
        <div className='bg-[#EEF0F0] w-[18%] h-screen flex flex-col items-start fixed'>
        <img src={frameImage} alt="logo" className='w-[70%] mt-[5vh] ml-9 ' />

 
           

            <div className='w-[95%] h-[70%] mt-[10vh]'>
                {menuItems.map((item) => (
                    <div
                        key={item.path}
                     
                        className={` mt-[22px] h-[48px] flex items-center justify-start ml-5 pl-4 
                                      ${active === item.path ? 'bg-[#008080] text-white transform scale-105' : ''}`}
                        style={{ borderRadius: 50, transition: 'background-color 0.3s, transform 0.3s ease-in-out' }}
                    >
                        <button
                            onClick={() => navigate(item.path)}
                            className='flex items-center justify-center gap-5'
                        >
                            {item.icon}
                            <p className='text-xl'>{item.label}</p>
                        </button>
                    </div>
                ))}
            </div>

         
        </div>
 
    );
};

export default Sidebar;
