import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import defaultImg from '../assets/banner5.jpg';
import AssignmentSection from '../assignmentSec/assignment';
import RevisionClassCard from '../schedule/scheduleComp';
import ClassDetails from "../People/classDetails";
import AttendanceSection from '../attendanceSec/attendance';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import NoDataIllustration from '../assets/noAnnounce.svg';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Announcement } from '@mui/icons-material';
import { toast } from 'react-toastify';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
const tabs = ['Announcement', 'Assignments', 'Schedule', 'Attendance', 'People'];

const AnnouncementComponent = () => {
  const location = useLocation();
  const classCode = location.state?.code;
const navigate = useNavigate();
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Announcement');
  const [underlineStyles, setUnderlineStyles] = useState({});
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');
  const [annoucementId, setAnnoucementId] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const tabsContainerRef = useRef(null);

  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (classCode) {
      fetchClassDetails();
    }
    else{
      navigate('/dashboard');
    }
  }, [classCode]);

  useEffect(() => {
    const activeTabElement = tabsContainerRef.current?.querySelector(
      `button[data-tab="${activeTab}"]`
    );
    if (activeTabElement) {
      setUnderlineStyles({
        width: activeTabElement.offsetWidth,
        left: activeTabElement.offsetLeft,
        marginLeft: '0px',
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (shouldRefetch) {
      fetchClassDetails();
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  const fetchClassDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/classroom/details?code=${classCode}`,
        axiosConfig
      );
      setAnnouncementsList(response.data.classroom.announcements);
      setSubjectName(response.data.classroom.subject);
      setClassName(response.data.classroom.name);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch class details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024); 
    
    if (validFiles.length !== files.length) {
      alert('Some files were too large. Maximum size is 5MB per file.');
    }

    const newProgress = {};
    validFiles.forEach(file => {
      newProgress[file.name] = 0;
    });

    setUploadProgress(prev => ({ ...prev, ...newProgress }));
    setAttachments([...attachments, ...validFiles]);
  };
  
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const postAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcement.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', announcementTitle);
      formData.append('description', announcement);
      formData.append('code', classCode);
      
      attachments.forEach(file => {
        formData.append('media', file);
      });
      // console.log(isEditable,annoucementId);
      if(isEditable && annoucementId !== ''){ 
        // console.log('edit announcement');
        await axios.put(
          `${process.env.REACT_APP_API_URL}/announcement/edit/${annoucementId}`,
          formData,
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig.headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setAnnoucementId('');
      }
      else{
      await axios.post(
        `${process.env.REACT_APP_API_URL}/announcement/create`,
        formData,
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    }
      toast.success('Announcement posted successfully!');
      setAnnouncement('');
      setAnnouncementTitle('');
      setAttachments([]);
      setIsEditable(false);
      setShouldRefetch(true);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post announcement');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAnnouncement = async (announcementId) => {
    if (!announcementId) return;
    
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/announcement/delete/${announcementId}`,
        {
          headers: {
            ...axiosConfig.headers,
          },
          data: { code: classCode }
        }
      );

      if (response.status === 200) {
        toast.success('Announcement deleted successfully');
        handleMenuClose();
        setShouldRefetch(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete announcement');
      console.error('Failed to delete announcement:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMenuOpen = (event, announcement) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedAnnouncement(announcement);
    console.log(announcement);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedAnnouncement(null);
  };

  const handleInfoClick = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div
      className="font-sans p-4 bg-[#E1EAE8] mt-[50px] transition-all duration-300 h-[100vh] overflow-y-auto pb-[80px]"
      style={{ 
        marginLeft: isMobile ? '0' : sidebarWidth,
        transition: 'margin-left 0.3s ease' 
      }}
    >
      {activeTab === 'Announcement' && (
        <div className="relative w-full h-[236px] rounded-xl mb-5 mx-auto overflow-hidden">
          <div
            className="w-full h-full rounded-xl"
            style={{
              backgroundImage: bannerImage
                ? `url(${bannerImage})`
                : `url(${defaultImg})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <button
              onClick={handleInfoClick}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <InfoIcon />
            </button>
            <div
              className={`absolute inset-0 bg-white bg-opacity-90 flex flex-col justify-start p-5 gap-[20px] items-start transition-transform duration-700 ${
                isInfoVisible ? 'translate-y-[20%]' : 'translate-y-full'
              }`}
            >
              <h2 className="text-4xl font-medium text-black">{className}</h2>
              <p className="text-xl text-black">Subject: {subjectName}</p>
              <p className="text-xl text-black">Class Code: {classCode}</p>
              <p className="text-xl text-black flex items-center">
                Link:
                <a
                  href={`https://classence.me/classroom/join/${classCode}?code=${classCode}`}
                  className="text-xl ml-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`https://classence.me/classroom/join/${classCode}?code=${classCode}`}
                </a>
                <button
                  onClick={() => copyToClipboard(`https://classence.me/classroom/join/${classCode}?code=${classCode}`)}
                  className="ml-2 p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                >
                  <ContentCopyIcon fontSize="small" />
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="relative flex space-x-4 overflow-x-auto text-gray-600 gap-10"
        ref={tabsContainerRef}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            data-tab={tab}
            className={`py-2 mb-2 px-4 relative ${
              activeTab === tab ? 'text-[#394141] font-medium' : ''
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
        <motion.div
          className="absolute bottom-0 h-[2px] bg-[#00A8A5] rounded"
          style={underlineStyles}
          initial={false}
          animate={underlineStyles}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>

      <motion.main
        className="bg-[#E1EAE8] p-4 rounded-lg animate-fadeIn"
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'Announcement' && (
          <div>
            {!isEnrolled && !isEditable && (
              <button
                onClick={() => setIsEditable(true)}
                className="flex items-center bg-white shadow rounded-lg px-4 py-3 mt-4 w-full h-[80px]"
              >
                <AddIcon
                  className="text-white mr-3 p-1 bg-[#008080] rounded-full"
                  sx={{ fontSize: '35px' }}
                />
                <span className="text-gray-500">Post a new announcement</span>
              </button>
            )}
            {!isEnrolled && isEditable && (
              <div className="mt-4">
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full mb-2 p-2 border placeholder-gray-400 "
                  style={{border:'none',borderRadius:'4px'}}
                />
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Write your announcement"
                  className=" text-[17px] w-full p-[20px] border rounded-md placeholder-gray-400 min-h-[100px] resize-none"
                  rows="3"
                />
                
                {/* File Attachment Section */}
                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <AddIcon /> Add Attachments
                    </div>
                  </label>
                  

                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <span className="text-md text-gray-600">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className=" text-4xl text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
          
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => {
                      setIsEditable(false);
                      setAttachments([]);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={postAnnouncement}
                    disabled={isUploading || !announcementTitle.trim() || !announcement.trim()}
                    className={`px-4 py-2 bg-[#008080] text-white rounded-md transition-all
                      ${(isUploading || !announcementTitle.trim() || !announcement.trim()) ? 
                        'opacity-50 cursor-not-allowed' : 
                        'hover:bg-teal-700'}`}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                        <span>Posting...</span>
                      </div>
                    ) : (
                      'Post'
                    )}
                  </button>
                </div>
              </div>
            )}
            <div className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600"></div>
                </div>
              ) : (
                announcementsList.length > 0 ? (
                  announcementsList.map((announcement, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold">{announcement.title}</h3>
                        <button onClick={(e) => handleMenuOpen(e, announcement)}>
                          <MoreVertIcon />
                        </button>
                      </div>
                      
                      <p className="mt-2 text-gray-600">{announcement.description}</p>
                      

                      {announcement.media && announcement.media.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {announcement.media.map((media, mediaIndex) => (
                            <div key={mediaIndex} className="relative group">
                              {media.url && media.url.match(/\.(jpeg|jpg|gif|png)$/i) ? (

                                <div className="aspect-square overflow-hidden rounded-lg">
                                  <img 
                                    src={media} 
                                    alt={media.originalName || `Image ${mediaIndex + 1}`}
                                    className="w-full h-full object-cover cursor-zoom-in transition-transform group-hover:scale-105"
                                    onClick={() => window.open(media, '_blank')}
                                  />
                                </div>
                              ) : (

                                <a 
                                  href={media}
                                  download
                                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <AttachFileIcon className="mr-3 text-gray-500" />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                      {media.originalName || `File ${mediaIndex + 1}`}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Click to download
                                    </span>
                                  </div>
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-4 text-sm text-gray-500">
                        {new Date(announcement.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col h-[500px] items-center justify-center text-gray-500 mt-6">
                    <img
                      src={NoDataIllustration}
                      alt="No Announcements"
                      className="w-auto h-auto object-contain mb-4"
                    />
                    <p className="text-lg">No announcements yet. Stay tuned!</p>
                  </div>
                )
              )}
            </div>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  setAnnouncementTitle(selectedAnnouncement?.title || '');
                  setAnnouncement(selectedAnnouncement?.description || '');
                  setAnnoucementId(selectedAnnouncement?._id);
                  setIsEditable(true);
                  handleMenuClose();
                }}
                disabled={isUploading || isDeleting}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => deleteAnnouncement(selectedAnnouncement?._id)}
                disabled={isDeleting || isUploading}
                className={`text-red-600 ${(isDeleting || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Delete'
                )}
              </MenuItem>
            </Menu>
          </div>
        )}

        {activeTab === 'Assignments' && <AssignmentSection classCode={classCode} className={className}/>}
        {activeTab === 'Schedule' && <RevisionClassCard />}
        {activeTab === 'Attendance' && <AttendanceSection classCode={classCode} />}
        {activeTab === 'People' && <ClassDetails classCode={classCode}/>}
      </motion.main>
    </div>
  );
};

export default AnnouncementComponent;
