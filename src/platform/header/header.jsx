import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/AddOutlined';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { setToggleState, setIsEnrolled  } from '../features/toggleSlice';

const Header = () => {
  

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const joinedClasses = useSelector((state) => state.joinedClasses.joinedClasses);
    const createdClasses = useSelector((state) => state.createdClasses.createdClasses);
    const [joinedClassesCheck, setJoinedClassesCheck] = useState(0);
    const [createdClassesCheck, setCreatedClassesCheck] = useState(0);
    const isEnrolled = useSelector((state) => state.toggleState.isEnrolled); 


    useEffect(() => {
        const fetchData = async () => {
            const token = sessionStorage.getItem("authToken");
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };

                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/user/details`,
                    {},
                    { headers }
                );
       

                if (response.data.success) {
                   
                    const joinedClassesLength = response.data.user.joinedClasses.length;
                    const createdClassesLength = response.data.user.createdClasses.length;

                    setJoinedClassesCheck(joinedClassesLength);
                    setCreatedClassesCheck(createdClassesLength);
                 

    
                   
                    if (response.data.user.joinedClasses.length > 0 && response.data.user.createdClasses.length > 0) {
                        dispatch(setToggleState(true));
                    } else if (joinedClasses.length > 0) {
                        setIsEnrolled(true); 
                        dispatch(setToggleState(false)); 
                    } else if (createdClasses.length > 0) {
                        setIsEnrolled(false);  
                        dispatch(setToggleState(false));
                    } else {
                    }
                }
            } catch (error) {
                console.error("Error fetching class data:", error);
            }
        };


        fetchData();
    }, [dispatch, navigate]);

  

    
    const toggleSwitch = () => {
        const newEnrolledState = !isEnrolled;
        dispatch(setIsEnrolled(newEnrolledState)); 
    };


    const handleProfileClick = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="w-[82%] h-fit flex items-start gap-[2%] pt-[15px]" style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.3s ease' }}>
           {
  (joinedClassesCheck > 0 && createdClassesCheck > 0) ? (
    <div
      onClick={toggleSwitch}
      className="relative flex items-center bg-[#D9DEDE] rounded-lg cursor-pointer ml-[40px] "
      style={{ width: '150px', height: '38px' }}
    >
      <div
        className={`absolute top-0 ml-[2%] mt-[4px] left-0 h-[80%] w-[48%] bg-[#008080] rounded-lg transition-transform duration-300 ${
          isEnrolled ? 'transform translate-x-0' : 'transform translate-x-full'
        }`}
      ></div>
      <div className="flex w-full text-center font-medium z-10">
        <div
          className={`flex-1 p-2 ${isEnrolled ? 'text-white' : 'text-gray-700'} transition-color duration-300`}
        >
          Joined
        </div>
        <div
          className={`flex-1 p-2 ${!isEnrolled ? 'text-white' : 'text-gray-700'} transition-color duration-300`}
        >
          Created
        </div>
      </div>
    </div>
  ) : null
}


            <div className="flex items-center my-auto ml-[2%] text-gray-700 h-[38px]">
                <span>
                    <Link to="/" className="hover:text-black text-xl">Home</Link>
                    {location.pathname.split('/').filter(Boolean).map((segment, index) => (
                        <span key={index}>
                            {' > '}
                            <Link to={`/${location.pathname.split('/').slice(0, index + 1).join('/')}`} className="hover:text-black text-xl">
                                {segment.charAt(0).toUpperCase() + segment.slice(1)}
                            </Link>
                        </span>
                    ))}
                </span>
            </div>

            <div className="w-[150px] absolute right-[10px] flex justify-center items-center gap-[24px]">
                <div><AddIcon style={{ fontSize: 30 }} /></div>
                <div><NotificationsIcon style={{ fontSize: 30 }} /></div>
                <div>
                    <div onClick={handleProfileClick}><AccountIcon style={{ fontSize: 30 }} /></div>
                    {isPopupVisible && (
                        <div className="absolute top-[50px] right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-[150px]">
                            <button onClick={handleLogout} className="w-full text-red-600 hover:bg-gray-100 p-2 rounded-md">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
