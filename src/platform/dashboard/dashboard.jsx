import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';
import Performance from '../performance/performance';
import WeekView from '../week/week';
import TodoList from '../todolist/todolist';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinedClasses } from '../features/joinedClasses';
import { setCreatedClasses } from '../features/createdClasses';
import { setUserName, setUserMail, setNoOfJoinedClasses, setNoOfCreatedClasses } from '../features/userSlice';  
import axios from 'axios';
import Modal2 from '../modals/modal2';  

const Dashboard = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth >= 1024);
    const [loading, setLoading] = useState(true);  // Add loading state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { joinToken, queryParams } = location.state || {};
    const [JoinclassModal, setJoinclassModal] = useState(false);
    const createdClasses = useSelector((state) => state.createdClasses.createdClasses);
    const joinedClasses = useSelector((state) => state.joinedClasses.joinedClasses);

    const closeJoinclassmodal = () => {
        setJoinclassModal(false);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (createdClasses.length === 0 && joinedClasses.length === 0 && !loading) {
            navigate('/dashsignup');
        }
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
       
        if (!token) {
            navigate('/login');
        }
    }, [navigate, createdClasses, joinedClasses, loading]);

    useEffect(() => {
        if (joinToken && queryParams && queryParams.code) {
            setJoinclassModal(true);
        }
    }, [joinToken, queryParams]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
            try {
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                };

                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/details`,
                    { headers },
                    { signal }
                );
                const response2 = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/dashboard`,
                    { headers },
                    { signal }
                );

                if (response.data.success && response2.data.success) {
                    sessionStorage.setItem('userId', response.data.user._id);
                    const { joinedClasses, createdClasses } = response.data.user;
                    dispatch(setJoinedClasses(joinedClasses));
                    dispatch(setCreatedClasses(createdClasses));
                    dispatch(setUserName(response.data.user.name));
                    dispatch(setUserMail(response.data.user.email));
                    dispatch(setNoOfJoinedClasses(response.data.user.noOfJoinedClasses));
                    dispatch(setNoOfCreatedClasses(response.data.user.noOfCreatedClasses));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);  // Set loading to false after the data is fetched
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [dispatch]);

    return (
        <div className={`bg-[#E1EAE8] ${isMobile ? 'h-[110vh]' : 'h-[230vh]'}`}>
            <Sidebar />
            <Header />
            <div className={`flex ${isMobile ? 'ml-[15px]' : 'flex-col'} h-[100vh] bg-[#E1EAE8]`}>
                <Performance />
                <div className={`${isMobile ? 'w-[30%]' : 'w-[97%]'}`}> 
                    <div className='h-[10%] mt-[70px]'></div>
                    {isMobile && <WeekView />}
                    <div className={`h-[60%] ${isMobile ? 'mt-[20px]' : 'ml-[3%]'}`}>
                        <TodoList />
                    </div>
                </div>
            </div>
            {JoinclassModal && (
                <Modal2
                    joinToken={joinToken}
                    classCode={queryParams?.code}
                    onClose={closeJoinclassmodal}
                />
            )}
        </div>
    );
};

export default Dashboard;
