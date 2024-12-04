import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/AddOutlined';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { setToggleState, setIsEnrolled } from '../features/toggleSlice';
import CreateClassModal from '../modals/modal1';
import JoinClassModal from '../modals/modal2';
import './popup.css';
import created from '../assets/created.svg';  
import joined from '../assets/joined.svg';
import logout from '../assets/logoutImg.svg';

const Header = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAddMenuVisible, setIsAddMenuVisible] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const name = useSelector(state => state.user.name);
  const joinedClasses = useSelector(state => state.user.noOfJoinedClasses);
  const createdClasses = useSelector(state => state.user.noOfCreatedClasses);

  const popupRef = useRef(null);
  const addMenuRef = useRef(null);

  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  const toggleSwitch = () => {
    const newEnrolledState = !isEnrolled;
    dispatch(setIsEnrolled(newEnrolledState));
    sessionStorage.setItem('isEnrolled', JSON.stringify(newEnrolledState));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupVisible(false);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setIsAddMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProfileClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  const openCreateClassModal = () => {
    setIsCreateModalOpen(true);
    setIsAddMenuVisible(false);
  };

  const openJoinClassModal = () => {
    setIsJoinModalOpen(true);
    setIsAddMenuVisible(false);
  };

  const toggleAddMenu = () => {
    setIsAddMenuVisible(!isAddMenuVisible);
  };

  return (
    <>
      <div
        className={`z-10 h-[50px] flex items-center gap-[2%] fixed bg-[#E1EAE8] border-b border-[rgb(218,224,223)] `}
        style={{
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth})`, 
          marginLeft: isMobile ? '0px' : `${sidebarWidth}`, 
          transition: 'margin-left 0.3s ease'
        }}
      >
        {location.pathname !== '/announcement' && 
         location.pathname !== '/assignment-details' && 
         location.pathname !== '/assignment-open' && 
         location.pathname !== '/live' && 
         (joinedClasses > 0 && createdClasses > 0) && (
          <div
            onClick={toggleSwitch}
            className={`relative flex items-center bg-[#D9DEDE] rounded-lg cursor-pointer ${isMobile ? 'ml-auto mr-[50px]' : 'ml-[40px]'}`}
            style={{ width: '150px', height: '38px' }}
          >
            <div
              className={`absolute top-0 ml-[2%] mt-[4px] left-0 h-[80%] w-[48%] bg-[#008080] rounded-lg transition-transform duration-300 ${
                isEnrolled ? 'transform translate-x-0' : 'transform translate-x-full'
              }`}
            ></div>
            <div className="flex w-full text-center font-medium z-10">
              <div className={`flex-1 p-2 ${isEnrolled ? 'text-white' : 'text-gray-700'} transition-color duration-300`}>
                Joined
              </div>
              <div className={`flex-1 p-2 ${!isEnrolled ? 'text-white' : 'text-gray-700'} transition-color duration-300`}>
                Created
              </div>
            </div>
          </div>
        )}

        {!isMobile && (
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
        )}

        <div className="w-[150px] absolute right-[10px] flex justify-end items-center gap-[24px]">
          <div>
            <div onClick={handleProfileClick}>
              <AccountIcon style={{ fontSize: 30 }} />
            </div>
            {isPopupVisible && (
              <div
                ref={popupRef}
                className="popup absolute top-[50px] right-0 bg-[#EEF0F0] border border-gray-300 rounded-lg shadow-lg p-4 w-[200px] flex flex-col items-center text-gray-700"
              >
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                    <AccountIcon style={{ fontSize: 40 }} />
                  </div>
                  <span className="font-medium text-lg">{name}</span>
                </div>

                <div className="flex flex-col items-center w-full mb-4 text-sm">
                  <div className="flex justify-center items-center w-full mb-2">
                    <span className="material-icons text-gray-500 mr-2"><img src={joined} alt="" /></span>
                    <span>Joined Class: {joinedClasses}</span>
                  </div>
                  <div className="flex justify-center items-center w-full mb-2">
                    <span className="material-icons text-gray-500 mr-2"><img src={created} alt="" /></span>
                    <span>Created Class: {createdClasses}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex justify-center items-center w-full text-gray-700 py-2 px-4 rounded-md hover:scale-105 transition-transform"
                >
                  <img src={logout} alt="" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          <button
            onClick={toggleAddMenu}
            className={`bg-[#008080] hover:bg-[#005f5f] text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform duration-300 ${
              isAddMenuVisible ? 'rotate-45' : ''
            }`}
            style={{ width: '60px', height: '60px', zIndex: 60 }}
          >
            <AddIcon style={{ fontSize: 30 }} />
          </button>

          <div 
            ref={addMenuRef} 
            className={`absolute bottom-[80px] right-0 origin-bottom-right transition-all duration-300 ease-in-out ${
              isAddMenuVisible 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="    p-2 w-[180px] space-y-2">
            <button 
                onClick={openJoinClassModal} 
                className="w-full text-left bg-[#066769] text-white p-4 rounded-md flex items-center transition-colors duration-200"
              >
                 Join Class
              </button>
              <button 
                onClick={openCreateClassModal} 
                className="w-full text-left bg-[#066769] text-white p-4 rounded-md flex items-center transition-colors duration-200"
              >
                 Create Class
              </button>
              
            </div>
          </div>
        </div>
      </div>

      {isCreateModalOpen && <CreateClassModal onClose={() => setIsCreateModalOpen(false)} />}
      {isJoinModalOpen && <JoinClassModal onClose={() => setIsJoinModalOpen(false)} />}
    </>
  );
};

export default Header;