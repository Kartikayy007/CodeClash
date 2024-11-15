import React, { useEffect, useState } from 'react';
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
    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    setDeletedClassIndex(index);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/classroom/delete`,
        { code: classCode },
        { headers }
      );

      if (response.status === 200) {
        setTimeout(() => {
          dispatch(setCreatedClasses(createdClasses.filter(classInfo => classInfo.code !== classCode)));
          setDeletedClassIndex(null);
        }, 500); 
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      const token = sessionStorage.getItem("authToken");

      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
          }else if(createdClasses.length>0&& joinedClasses.length===0){
            dispatch(setIsEnrolled(false));
          }else if(createdClasses.length===0&& joinedClasses.length>0){
            dispatch(setIsEnrolled(true));
          }else{
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
          ? (joinedClasses && joinedClasses.length > 0
              ? joinedClasses.map((classInfo, index) => (
                  <ClassCard
                    key={index}
                    {...classInfo}
                    index={index}
                    activePopupIndex={activePopupIndex}
                    onPopupToggle={handlePopupToggle}
                  />
                ))
              : <div>No joined classes available.</div>)
          : (createdClasses && createdClasses.length > 0
              ? createdClasses.map((classInfo, index) => (
                  <ClassCard
                    key={index}
                    {...classInfo}
                    index={index}
                    activePopupIndex={activePopupIndex}
                    onPopupToggle={handlePopupToggle}
                    onDelete={() => handleDeleteClass(classInfo.code, index)}
                    isDeleting={deletedClassIndex === index}
                  />
                ))
              : <div>No created classes available.</div>)
        }
      </div>
    </div>
  );
};

const ClassCard = ({ name, noOfStudents, teacher, index, onDelete, activePopupIndex, onPopupToggle, isDeleting }) => {
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  const handleDelete = () => {
    onPopupToggle(index); // Close the popup when delete is triggered
    onDelete(); // Delete the class
  };

  return (
    <div
      className={`bg-white rounded-lg p-3 flex flex-col justify-between border border-teal-200 w-[240px] h-[200px] fade-in-up mt-7 relative ${isDeleting ? 'fade-out' : ''}`}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="bg-[#919F9E] rounded-lg relative flex justify-between items-start h-fit p-5">
        <img
          src={card}
          alt={`${name} Class`}
          className="rounded-t-lg w-fit h-fit object-cover"
        />
        <MoreHorizIcon
          className="absolute top-2 right-2 text-white cursor-pointer"
          onClick={() => onPopupToggle(index)}
        />
        {activePopupIndex === index && !isEnrolled && (
          <PopupMenu
            onClose={() => onPopupToggle(null)}
            onDelete={handleDelete}
          />
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-2xl ">{name}</h3>
        <div className="flex items-center gap-2 mt-1 text-gray-600">
          <PeopleIcon fontSize="small" />
          <span>{noOfStudents}</span>
          <span className="text-gray-500 text-sm ml-auto">{teacher.name}</span>
        </div>
      </div>
    </div>
  );
};

const PopupMenu = ({ onClose, onDelete }) => (
  <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg w-40 z-10">
    <ul>
      <li
        className="p-2 hover:bg-gray-100 cursor-pointer"
        onClick={onDelete}
      >
        Delete Class
      </li>
    </ul>
  </div>
);

export default JoinedClasses;
