import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector, useDispatch } from 'react-redux';
import './joined.css';
import card from '../assets/card1.svg';
import axios from 'axios';
import { setJoinedClasses } from '../features/joinedClasses';
import { setCreatedClasses } from '../features/createdClasses';
import { setIsEnrolled } from '../features/toggleSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JoinedClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const joinedClasses = useSelector((state) => state.joinedClasses.joinedClasses);
  const createdClasses = useSelector((state) => state.createdClasses.createdClasses);
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  const [activePopupIndex, setActivePopupIndex] = useState(null);
  const [deletedClassIndex, setDeletedClassIndex] = useState(null);

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
      const token = sessionStorage.getItem('authToken');

      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/details`,
          {},
          { headers, signal }
        );

        if (response.data.success) {
          const { joinedClasses, createdClasses } = response.data.user;
          dispatch(setJoinedClasses(joinedClasses));
          dispatch(setCreatedClasses(createdClasses));

          if (createdClasses.length === 0 && joinedClasses.length === 0) {
            navigate('/dashsignup');
          } else if (createdClasses.length > 0 && joinedClasses.length === 0) {
            dispatch(setIsEnrolled(false));
          } else {
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

  return (
    <div
      className="p-8 bg-[#E1EAE8] min-h-screen"
      style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.3s ease' }}
    >
      <h2 className="text-3xl font-semibold mb-4 mt-[50px]">
        {isEnrolled ? 'Your Joined Classes' : 'Your Created Classes'}
      </h2>

      <div className="flex flex-wrap gap-6">
        {isEnrolled
          ? joinedClasses?.map((classInfo, index) => (
              <ClassCard
                key={index}
                {...classInfo}
                index={index}
                activePopupIndex={activePopupIndex}
                onPopupToggle={handlePopupToggle}
                navigate={navigate}
              />
            ))
          : createdClasses?.map((classInfo, index) => (
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
            ))}
      </div>
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
      navigate(`/announcement`);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg p-3 flex flex-col justify-between border border-teal-200 w-[240px] h-[200px] fade-in-up mt-7 relative ${isDeleting ? 'fade-out' : ''}`}
      style={{ animationDelay: `${index * 0.2}s` }}
      onClick={handleCardClick}
    >
      <div className="bg-[#919F9E] rounded-lg relative flex justify-between items-start h-fit p-5">
        <img
          src={card}
          alt={`${name} Class`}
          className="rounded-t-lg w-fit h-fit object-cover"
        />
        <MoreHorizIcon
          className="absolute top-2 right-2 text-white cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onPopupToggle(index);
          }}
        />
        {activePopupIndex === index && !isEnrolled && (
          <PopupMenu
            onClose={() => onPopupToggle(null)}
            onDelete={onDelete}
            ref={popupRef}
          />
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-2xl">{name}</h3>
        <div className="flex items-center gap-2 mt-1 text-gray-600">
          <PeopleIcon fontSize="small" />
          <span>{noOfStudents}</span>
          <span className="text-gray-500 text-sm ml-auto">{teacher.name}</span>
        </div>
      </div>
    </div>
  );
};

const PopupMenu = React.forwardRef(({ onClose, onDelete }, ref) => (
  <div ref={ref} className="popup absolute right-0 top-8 bg-white border rounded-lg shadow-lg w-40 z-10">
    <ul>
      <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={onDelete}>
        Delete Class
      </li>
    </ul>
  </div>
));

export default JoinedClasses;
