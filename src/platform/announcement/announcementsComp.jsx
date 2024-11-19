import './flip.css';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import defaultImg from '../assets/banner5.jpg';
import AssignmentSection from '../assignmentSec/assignment';
import RevisionClassCard from '../schedule/scheduleComp';
import ClassDetails from "../People/classDetails";



const AnnouncementComponent = () => {
  const instructor = {
    name: "Username",
    avatar: "https://via.placeholder.com/150",
  };
  
  const students = [
    { name: "Student 1", avatar: "https://via.placeholder.com/150" },
    { name: "Student 2", avatar: "https://via.placeholder.com/150" },
    { name: "Student 3", avatar: "https://via.placeholder.com/150" },
    { name: "Student 4", avatar: "https://via.placeholder.com/150" },
    { name: "Student 5", avatar: "https://via.placeholder.com/150" },
    { name: "Student 6", avatar: "https://via.placeholder.com/150" },
    { name: "Student 7", avatar: "https://via.placeholder.com/150" },
    { name: "Student 8", avatar: "https://via.placeholder.com/150" },
    { name: "Student 9", avatar: "https://via.placeholder.com/150" },
    { name: "Student 10", avatar: "https://via.placeholder.com/150" },
  ];
  
  const [activeTab, setActiveTab] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const [announcementsList, setAnnouncementsList] = useState([
    'Welcome to the English class! Stay tuned for updates.',
  ]);
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const [isEditable, setIsEditable] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleAnnouncementChange = (event) => {
    setAnnouncement(event.target.value);
  };

  const postAnnouncement = () => {
    if (announcement.trim()) {
      setAnnouncementsList([announcement, ...announcementsList]);
      setAnnouncement('');
      setIsEditable(false);
    }
  };

  const enableEditing = () => {
    setIsEditable(true);
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

  return (
    <div
      className="font-sans p-4 bg-[#E1EAE8] mt-[50px] transition-all duration-300 h-[100vh] animate-fadeIn"
      style={{ marginLeft: sidebarWidth }}
    >
      <div className="w-[95%] mx-auto">
        {/* Show banner only when activeTab is null */}
        {activeTab === null && (
          <div
            className={`flip-container w-full h-[236px] rounded-xl mb-5 mx-auto relative animate-fadeIn`}
          >
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
            onClick={() => setActiveTab(null)} // Reset to English and show the banner
          >
            <h1 className="text-2xl text-black">English</h1>
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
              {!isEnrolled ? (
                <div className="relative mb-6 flex items-center transition-all duration-300">
                  <button
                    onClick={enableEditing}
                    className={`absolute left-3 flex items-center justify-center bg-[#919F9E] text-black rounded-full w-16 h-16 ${
                      isEditable ? 'hidden' : 'flex'
                    }`}
                  >
                    <AddIcon fontSize="large" />
                  </button>
                  <textarea
                    value={announcement}
                    onChange={handleAnnouncementChange}
                    placeholder={!isEditable ? 'Post a new announcement' : ''}
                    className={`w-full p-3 pl-12 border bg-[#E1EAE8] border-[#738484] rounded-xl resize-none focus:outline-none text-gray-700 ${
                      !isEditable
                        ? ' placeholder:translate-y-[85%] pl-[80px] placeholder-black'
                        : ''
                    }`}
                    rows="4"
                    readOnly={!isEditable}
                    style={{
                      minHeight: '80px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  />
                </div>
              ) : null}

              {isEditable && (
                <button
                  onClick={postAnnouncement}
                  className="px-4 py-2 bg-[#919F9E] text-black rounded-md focus:outline-none hover:scale-105 transition-transform"
                >
                  Post
                </button>
              )}

              <div className="mt-6 space-y-3 transition-all duration-300">
                {announcementsList.length > 0 ? (
                  announcementsList.map((announce, index) => (
                    <div
                      key={index}
                      className={`p-3 border border-[#738484] min-h-[60px] rounded-md animate-staggeredFadeUp flex items-center`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {announce}
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
          {activeTab === 'People' && <ClassDetails instructor={instructor} students={students} />}

          {activeTab !== 'Announcement' && activeTab !== 'Assignments'&& activeTab !== 'Schedule' && activeTab!=='People' && (
            <p className="text-gray-500">{`${activeTab} content goes here.`}</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default AnnouncementComponent;
