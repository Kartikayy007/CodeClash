import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import defaultImg from '../assets/group.avif';

const AnnouncementComponent = () => {
  const [activeTab, setActiveTab] = useState('Announcement');
  const [announcement, setAnnouncement] = useState('');
  const [announcementsList, setAnnouncementsList] = useState([]);
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const [isEditable, setIsEditable] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);

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

  return (
    <div
      className="font-sans p-4 bg-[#E1EAE8] mt-[50px] transition-all duration-300 h-[100vh]"
      style={{ marginLeft: sidebarWidth }}
    >
      <div className="w-[95%] mx-auto">

        <div
          className="w-full h-[236px] rounded-xl mb-5 mx-auto relative"
          style={{
            backgroundImage: bannerImage
              ? `url(${bannerImage})`
              : `url(${defaultImg})`,

            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >

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
            <EditIcon/>
          </label>
        </div>

        <header className="border-b border-gray-200 pb-4 mb-4 flex gap-[20px]">
          <h1 className="text-2xl mb-2">English</h1>
          <div className="flex space-x-4 text-gray-600">
            {['Announcement', 'Assignments', 'Schedule', 'Attendance', 'People'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 ${activeTab === tab ? 'text-[#394141] border-b-2 border-[#00A8A5]' : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <main className="bg-[#E1EAE8] p-4 rounded-lg">
          {activeTab === 'Announcement' && (
            <div>
              <div className="relative mb-6 flex items-center">
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
                    !isEditable ? ' placeholder:translate-y-[85%] pl-[80px] placeholder-black' : ''
                  }`}
                  rows="4"
                  readOnly={!isEditable}
                  style={{ minHeight: '80px', display: 'flex', alignItems: 'center' }}
                />
              </div>

              {isEditable && (
                <button
                  onClick={postAnnouncement}
                  className="px-4 py-2 bg-[#919F9E] text-black rounded-md focus:outline-none"
                >
                  Post
                </button>
              )}

              <div className="mt-6">
                {announcementsList.length > 0 ? (
                  announcementsList.map((announce, index) => (
                    <div key={index} className="p-3 mb-3 border border-gray-200 rounded-md bg-gray-50">
                      {announce}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No announcements yet.</p>
                )}
              </div>
            </div>
          )}
          {activeTab !== 'Announcement' && (
            <p className="text-gray-500">{`${activeTab} content goes here.`}</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default AnnouncementComponent;
