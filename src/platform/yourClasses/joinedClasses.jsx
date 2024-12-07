import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Users } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import './joined.css';
import axios from 'axios';
import { setJoinedClasses } from '../features/joinedClasses';
import { setCreatedClasses } from '../features/createdClasses';
import { setIsEnrolled } from '../features/toggleSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import card from '../assets/cardImg.svg';
import image from '../assets/noclass.svg';

const JoinedClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const joinedClasses = useSelector((state) => state.joinedClasses.joinedClasses);
  const createdClasses = useSelector((state) => state.createdClasses.createdClasses);
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  const [activePopupIndex, setActivePopupIndex] = useState(null);
  const [deletedClassIndex, setDeletedClassIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const handlePopupToggle = (index) => {
    setActivePopupIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDeleteClass = async (classCode, index) => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    setDeletedClassIndex(index);

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/classroom/delete`,
        { code: classCode },
        { headers }
      );

      if (response.status === 200) {
        dispatch(setCreatedClasses(createdClasses.filter((classInfo) => classInfo.code !== classCode)));
        toast.success('Class deleted successfully!', {
          className: 'custom-toastS',
          hideProgressBar: true,
          autoClose: 3000,
        });
        setDeletedClassIndex(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');

      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/details`,
          { headers, signal }
        );

        if (response.data.success) {
          const { joinedClasses, createdClasses } = response.data.user;
          dispatch(setJoinedClasses(joinedClasses));
          dispatch(setCreatedClasses(createdClasses));


          if (createdClasses.length > 0 && joinedClasses.length === 0) {
            dispatch(setIsEnrolled(false));
          } else if (createdClasses.length === 0 && joinedClasses.length > 0) {
            dispatch(setIsEnrolled(true));
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled');
        } else {
          console.log(error);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [dispatch, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  const isEmpty = joinedClasses.length === 0 && createdClasses.length === 0;

  return (
    <div
      className="p-8 bg-[#E1EAE8] min-h-screen"
      style={{ 
        marginLeft: isMobile ? '0' : sidebarWidth,
        transition: 'margin-left 0.3s ease' 
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isEmpty ? (
          <div className="text-center text-gray-500 text-lg col-span-full flex flex-col items-center justify-center h-[100vh]">
            <img src={image} alt="" />
            <p className='font-semibold mt-5 text-xl'> You Haven't Joined or Created Any Classes Yet! </p>
            <p>Start your learning journey by joining or creating a class. All your classes will appear here once added.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-semibold mb-4 mt-[50px] col-span-full">
              {isEnrolled ? 'Your Joined Classes' : 'Your Created Classes'}
            </h2>
            {isEnrolled ? (
              joinedClasses.map((classInfo, index) => (
                <ClassCard
                  key={index}
                  {...classInfo}
                  index={index}
                  activePopupIndex={activePopupIndex}
                  onPopupToggle={handlePopupToggle}
                  navigate={navigate}
                />
              ))
            ) : (
              createdClasses.map((classInfo, index) => (
                <ClassCard
                  key={index}
                  {...classInfo}
                  index={index}
                  activePopupIndex={activePopupIndex}
                  onPopupToggle={handlePopupToggle}
                  onDelete={() => handleDeleteClass(classInfo.code, index)}
                  isDeleting={deletedClassIndex === index}
                  navigate={navigate}
                />
              ))
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

const ClassCard = ({
  name,
  noOfStudents,
  teacher,
  code,
  index,
  onDelete,
  activePopupIndex,
  onPopupToggle,
  isDeleting,
  navigate,
  _id,
}) => {
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onPopupToggle(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onPopupToggle]);

  const handleCardClick = () => {
    if (activePopupIndex !== index) {
      navigate(`/announcement`, { state: { code, _id,name } });
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden ${
        isDeleting ? 'fade-out' : 'fade-in-up'
      }`}
      style={{ animationDelay: `${index * 0.2}s` }}
      onClick={handleCardClick}
    >
      <div className="w-full bg-gradient-to-l from-[#339999] via-[#339999] to-teal-700 text-white p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col h-48">
          <div className="absolute top-4 right-4 z-10">
            {!isEnrolled?
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPopupToggle(index);
              }}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
            
              <MoreHorizontal className="text-white" size={20} />
            </button>  :<></>
            }
            {activePopupIndex === index && !isEnrolled && (
              <PopupMenu
                onClose={() => onPopupToggle(null)}
                onDelete={onDelete}
                ref={popupRef}
              />
            )}
          </div>

          <div className="mb-4 mt-auto flex justify-between">
            <h2 className="text-3xl font-medium">{name}</h2>
            <img src={card} alt="" className='absolute bottom-[20px] right-[20px] w-[140px]'/>
          </div>

          <div className="">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="text-xl">{noOfStudents}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {teacher.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xl">{teacher.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopupMenu = React.forwardRef(({ onClose, onDelete }, ref) => (
  <div 
    ref={ref} 
    className="popup absolute right-0 top-12 bg-white border rounded-lg shadow-lg w-40 z-20"
  >
    <ul>
      <li 
        className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700" 
        onClick={onDelete}
      >
        Delete Class
      </li>
    </ul>
  </div>
));

export default JoinedClasses;