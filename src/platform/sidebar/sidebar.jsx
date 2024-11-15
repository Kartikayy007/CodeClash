import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../platform/features/sidebarSlice';
import frameImage from '../../auth/assets/Frame.svg';
import frameImage2 from '../assets/logo.svg';
import DashboardIcon from '@mui/icons-material/GridViewOutlined';
import ClassIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarIcon from '@mui/icons-material/CalendarMonthOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import HelpIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import sideBarImg from '../assets/sidebar.svg';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);

    const handleClick = (path) => {
        navigate(path);
    };

    const menuItems = [
        { icon: <DashboardIcon fontSize="large" />, label: 'Dashboard', path: '/dashboard' },
        { icon: <ClassIcon fontSize="large" />, label: 'Your Classes', path: '/classes' },
        { icon: <AssignmentIcon fontSize="large" />, label: 'Assignments', path: '/assignments' },
        { icon: <CalendarIcon fontSize="large" />, label: 'Calendar', path: '/calendar' },
        { icon: <SettingsIcon fontSize="large" />, label: 'Settings', path: '/settings' },
        { icon: <HelpIcon fontSize="large" />, label: 'Help and Support', path: '/help' },
    ];

    return (
        <div className={`bg-[#EEF0F0] ${isCollapsed ? 'w-[80px]' : 'w-[18%]'} h-screen flex flex-col items-start fixed transition-all duration-300`}>
            <div className="flex items-center w-full pt-[5vh] h-[70px] justify-center">
                <img
                    src={isCollapsed ? frameImage2 : frameImage}
                    alt="logo"
                    className={`transition-transform duration-300 ease-in-out ${isCollapsed ? 'w-[35px]' : 'w-[70%] scale-100'}`}
                    style={{ opacity: isCollapsed ? 1 : 0.9, transition: 'opacity 0.3s ease, transform 0.3s ease' }}
                />
            </div>

            <div className={`w-full mt-[10vh] flex flex-col ${isCollapsed?'items-center':'items-start'} space-y-4`}>
                {menuItems.map((item) => (
                    <div
                        key={item.path}
                        onClick={() => handleClick(item.path)}
                        className={`flex items-center ${isCollapsed ? 'justify-center w-[50px] h-[50px]' : 'justify-start pl-4 w-[90%] h-[48px]'}  ml-[5%] rounded-full  ${
                            location.pathname === item.path ? 'bg-[#008080] text-white active-animation' : ''
                        } transition-transform duration-150 ease-in-out active:scale-95 hover:scale-105`}
                    >
                        <button
                            className={`flex items-center gap-4 w-full h-full cursor-default ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            {item.icon}
                            {!isCollapsed && <p className="text-xl whitespace-nowrap text-clip">{item.label}</p>}
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => dispatch(toggleSidebar())}
                className={`${isCollapsed ? 'right-[35%]' : 'right-[10px]'} absolute bottom-[20px] text-gray-600 hover:text-gray-800`}
            >
                <img src={sideBarImg} alt="" />
            </button>
        </div>
    );
};

export default Sidebar;
