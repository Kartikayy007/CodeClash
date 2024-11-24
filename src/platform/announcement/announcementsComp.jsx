import './flip.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import defaultImg from '../assets/banner5.jpg';
import AssignmentSection from '../assignmentSec/assignment';
import RevisionClassCard from '../schedule/scheduleComp';
import ClassDetails from "../People/classDetails";
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecentAnnouncements from './recentAnnouncement';
import AttendanceSection from '../attendanceSec/attendance';

const AnnouncementComponent = () => {
  const location = useLocation();
  const classCode = location.state?.code;
  const navigate = useNavigate(); // For navigation
console.log(location.state)

  const [announcementsList, setAnnouncementsList] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  

  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);

  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (classCode) {
      fetchAnnouncements();
    }
    
  
  }, [classCode]);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/classroom/details?code=${classCode}`, axiosConfig);
      console.log(response)

      setAnnouncementsList(response.data.classroom.announcements); // Adjusted to match correct structure
      setSubjectName(response.data.classroom.subject);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const postAnnouncement = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/announcement/create`,
        { title: announcementTitle, description: announcement, code: classCode },
        axiosConfig
      );
      setAnnouncementsList([response.data, ...announcementsList]); // Add new announcement to the list
      setAnnouncement('');
      setAnnouncementTitle('');
      setIsEditable(false);
    } catch (error) {
      console.error('Failed to post announcement:', error);
    }
  };

  const enableEditing = () => {
    setIsEditable(true);
  };

  const handleAnnouncementChange = (event) => {
    setAnnouncement(event.target.value);
  };

  const handleAnnouncementTitleChange = (event) => {
    setAnnouncementTitle(event.target.value);
  };

  const handleBannerImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerClick = () => {
    setIsFlipped((prevState) => !prevState);
  
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div
      className="font-sans p-4 bg-[#E1EAE8] mt-[50px] transition-all duration-300 h-[100vh] animate-fadeIn overflow-y-auto pb-[80px]"
      style={{ marginLeft: sidebarWidth }}
    >
      <div className="w-[95%] mx-auto">
        {activeTab === null && (
          <div className="flip-container w-full h-[236px] rounded-xl mb-5 mx-auto relative animate-fadeIn">
            <div
              className={`flip-card ${isFlipped ? 'flip' : ''} w-full h-full rounded-xl relative`}
              onClick={handleBannerClick}
              style={{
                backgroundImage: bannerImage
                  ? `url(${bannerImage})`
                  : `url(${defaultImg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              <div className="flip-card-front w-full h-full absolute inset-0 rounded-xl">
                <input
                  type="file"
                  id="bannerUpload"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="bannerUpload"
                  className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded-md cursor-pointer"
                >
                  <EditIcon />
                </label>
              </div>
              <div
                className={`flip-card-back w-full h-full absolute inset-0 rounded-xl flex items-center justify-center bg-black bg-opacity-[70%] text-white p-4 ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="text-center">
                  <h2 className="text-xl font-bold">Class Details</h2>
                  <p className="mt-2">This is the class schedule and details!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4 text-gray-600 gap-5">
          <header
            className="py-2 px-4 border-b border-gray-200 flex gap-[20px] animate-slideIn cursor-pointer"
            onClick={() => setActiveTab(null)}
          >
            <h1 className="text-2xl text-black">{subjectName}</h1>
          </header>
          {['Announcement', 'Assignments', 'Schedule', 'Attendance', 'People'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 ${
                activeTab === tab ? 'text-[#394141] border-b-2 border-[#00A8A5]' : ''
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <main className="bg-[#E1EAE8] p-4 rounded-lg animate-fadeIn">
          {activeTab === 'Announcement' && (
            <div>
              {!isEnrolled && (
                <div className="relative mb-6 flex flex-col items-center transition-all duration-300">
                  <button
                    onClick={enableEditing}
                    className={`absolute bottom-2 left-3 flex items-center justify-center bg-[#919F9E] text-black rounded-full w-16 h-16 ${
                      isEditable ? 'hidden' : 'flex'
                    }`}
                  >
                    <AddIcon fontSize="large" />
                  </button>
                  <input
                    type="text"
                    value={announcementTitle}
                    onChange={handleAnnouncementTitleChange}
                    placeholder="Title of the Announcement"
                    className="w-full p-3 pl-12 border bg-[#E1EAE8] border-[#738484] rounded-xl mb-4 focus:outline-none text-gray-700"
                    readOnly={!isEditable}
                  />
                  <textarea
                    value={announcement}
                    onChange={handleAnnouncementChange}
                    placeholder={!isEditable ? 'Post a new announcement' : ''}
                    className={`w-full p-3 pl-12 border bg-[#E1EAE8] border-[#738484] rounded-xl resize-none focus:outline-none text-gray-700`}
                    rows="4"
                    readOnly={!isEditable}
                  />
                </div>
              )}
              {isEditable && (
                <button
                  onClick={postAnnouncement}
                  className="px-4 py-2 bg-[#919F9E] text-black rounded-md focus:outline-none hover:scale-105 transition-transform"
                >
                  Post
                </button>
              )}
              <div className="mt-6 space-y-3">
                {announcementsList.length > 0 ? (
                  announcementsList.map((announce, index) => (
                    <div key={index} className="p-3 border border-[#738484] rounded-md">
                      <h3 className="font-bold">{announce.title}</h3>
                      <p>{announce.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No announcements yet.</p>
                )}
              </div>
            </div>
          )}
          {activeTab === 'Assignments' && <AssignmentSection />}
          {activeTab === 'Schedule' && <RevisionClassCard />}
          {activeTab === 'People' && <ClassDetails />}
          {activeTab === 'Attendance' && <AttendanceSection />}
         
        </main>
      </div>
    </div>
  );
};

export default AnnouncementComponent;
