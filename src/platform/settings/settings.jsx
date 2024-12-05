import React, { useState, useRef, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";

import ChangePasswordModal from "./changePasswordModal";
import ChangeNameModal from "./changeNameModal";
import image from "../assets/image.svg";
import pass from "../assets/pass.svg";
import notifications from "../assets/notifications.svg";
import logout from "../assets/logout.svg";
import modes from "../assets/nodes.svg";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import { Pencil } from 'lucide-react';
import { setUserName } from "../features/userSlice";
import { X, Plus, Trash2, Loader } from "lucide-react";
import card from "../assets/assign.svg";

const DayNightToggle = () => {
  const [isDay, setIsDay] = useState(true);

  const toggleSwitch = () => {
    setIsDay(!isDay);
  };

  return (
    <div
      className={`relative w-20 h-10 flex items-center rounded-full cursor-pointer p-1 transition-colors duration-300 ${
        isDay ? "bg-yellow-400" : "bg-gray-700"
      }`}
      onClick={toggleSwitch}
    >
      <div
        className={`absolute w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isDay ? "translate-x-1" : "translate-x-8 md:translate-x-10"
        }`}
      ></div>

      <img
        src={sun}
        alt="Sun Icon"
        className={`absolute left-3 w-6 h-6 transition-opacity duration-300 ${
          isDay ? "opacity-100" : "opacity-0"
        }`}
      />

      <img
        src={moon}
        alt="Moon Icon"
        className={`absolute right-2 w-6 h-6 transition-opacity duration-300 ${
          isDay ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

const ToggleSwitch = ({onToggle}) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onToggle(newValue);
  };

  return (
    <div
      className={`w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        isOn ? "bg-teal-600" : "bg-gray-300"
      }`}
      onClick={toggleSwitch}
    >
      <div
        className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform ${
          isOn ? "translate-x-8 sm:translate-x-10" : ""
        }`}
      ></div>
    </div>
  );
};

const SignOutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-medium mb-4">Confirm Sign Out</h2>
        <p className="text-lg text-gray-600 mb-6">
          Are you sure you want to sign out?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 rounded-lg text-white"
            onClick={onConfirm}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateAssignmentModal = ({ isOpen, onClose, className, classCode }) => {
  const [formData, setFormData] = useState({
    className: className,
    dueDate: "",
    title: "",
    description: "",
    attachments: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
    // Reset the file input value
    fileInputRef.current.value = null;
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    console.log(className, classCode);
    setIsUploading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("code", classCode);
    data.append("dueDate", formData.dueDate);
    data.append("name", formData.title);
    data.append("description", formData.description);

    if (formData.attachments) {
      for (let i = 0; i < formData.attachments.length; i++) {
        data.append("media", formData.attachments[i]);
      }
    }

    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      },
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/assignment/create`,
        data,
        axiosConfig
      );

      console.log("Assignment created:", response.data);
      onClose();
    } catch (error) {
      console.error("Error creating assignment:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[80%] h-[80%] p-8 relative">
        {/* Header */}
        <div className="flex pl-[5%] justify-between items-end h-[5%]">
          <h2 className="text-2xl">Create Assignment</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex justify-center gap-[10%] h-[80%] items-center">
          <div className="flex flex-col space-y-6 w-[40%]">
            <div className="flex flex-col">
              <label className="block text-lg">For</label>
              <input
                type="text"
                name="class"
                placeholder={`${formData.className} (${classCode})`}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                readOnly
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="block text-lg">Assignment Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter assignment title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="block text-lg">Description</label>
              <textarea
                name="description"
                placeholder="Write a brief description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#4C5858] focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none placeholder-black"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-6 w-[40%]">
            <div className="flex flex-col flex-1 space-y-2">
              <label className="block text-lg">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full p-[20px] rounded-lg border border-[#4C5858] focus:outline-none focus:ring-2 focus:ring-teal-500 text-xl"
              />
            </div>

            <div className="flex flex-col space-y-2 flex-1">
              <label className="block text-lg">Attachments</label>
              <div className="border border-[#4C5858] rounded-lg p-4 h-[180px] overflow-y-auto">
                {formData.attachments.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <img
                      src={card}
                      alt="Upload illustration"
                      className="w-32 h-32 mb-4"
                    />
                  </div>
                )}
                <ul className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <label className="mt-4 cursor-pointer flex justify-center">
                  <div className="flex items-center px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add files
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-[8%] flex flex-col items-center justify-center gap-2">
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin">
                <Loader className="w-4 h-4" />
              </div>
              <span>Uploading... {uploadProgress}%</span>
              <div className="w-48 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className={`px-[60px] py-[12px] bg-[#066769] text-white rounded-lg transition-colors
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'}`}
          >
            {isUploading ? 'Creating Assignment...' : 'Create Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const sidebarWidth = useSelector((state) => state.sidebar.width);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSignOutModalOpen, setSignOutModalOpen] = useState(false);
  const userName = useSelector((state) => state.user.name);  
  const userMail = useSelector((state) => state.user.email);  
  // console.log("mail",userMail)
  const formattedUserName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const [editedName, setEditedName] = useState(formattedUserName);
  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!editedName.trim() || editedName === formattedUserName) {
      setIsEditing(false);
      return;
    }
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },}
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/settings/change-name`,{name:editedName},
        axiosConfig
      );
      console.log(response)
      dispatch(setUserName(editedName));
      // Update username in redux store if needed
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const token =
        sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

        const axiosConfig = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      };

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/settings/sign-out-all-devices`,{},
          axiosConfig
        );
        console.log(response)

      if (response.status === 200) {
        console.log("Signed out successfully");
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = "/login"; 
      } else {
        console.error("Error during sign-out");
      }
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setNewUsername(formattedUserName);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleNotificationSetting = async (isOn) => {
    try {
      console.log(isOn)
      // console.log("ASKASKJAKSAJ")
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/settings/change-is-notification-enabled`,{isNotification:isOn},axiosConfig);
      console.log(response)
    }catch (error) {
        console.error("Error updating notification settings:", error);
      }
  }
  return (
    <div
      className="mt-[50px] mx-auto bg-[#E1EAE8] p-6 rounded-lg shadow-md h-[100vh] overflow-y-auto"
      style={{ 
        marginLeft: isMobile ? '0' : sidebarWidth,
        transition: 'margin-left 0.3s ease'
      }}
    >
      <h1 className="text-3xl font-medium mb-2">Settings</h1>
      <p className="text-xl text-gray-600 mb-20">
        Customize your Classence experience to suit your preferences.
      </p>

      {/* Profile Section */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm h-[140px]">
        <h2 className="text-2xl mb-4">Your Profile</h2>
        <div className="flex items-center">
          <img src={image} alt="" className="mr-6" />
          <div>
            {/* <p className="font-medium text-xl">{formattedUserName}</p> */}
            <div className="flex justify-between items-center">
          <div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                      setIsEditing(false);
                    }
                  }}
                  className="font-medium text-xl bg-transparent border-b border-gray-300 focus:border-teal-600 outline-none"
                  style={{ width: `${formattedUserName.length + 2}ch` ,padding:"5px",marginBottom:"5px"}}
                  disabled={isLoading}
                  autoFocus
                />
              ) : (
                <>
                  <p className="font-medium text-xl">{formattedUserName}</p>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedName(formattedUserName);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
            <p className="text-gray-600 text-lg">{userMail}</p>
          </div>
        </div>
       
      </div>

      {/* Change Password */}
      <div
        className="mb-8 p-6 bg-white rounded-lg shadow-sm cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center">
          <img src={pass} alt="" className="mr-6" />
          <div>
            <p className="font-medium text-xl">Change Password</p>
            <p className="text-gray-600 text-lg">Change your password.</p>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={modes} alt="" className="mr-6" />
            <div>
              <p className="font-medium text-xl">Appearance</p>
              <p className="text-gray-600 text-lg">
                Switch between light and dark mode.
              </p>
            </div>
          </div>
          <DayNightToggle />
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={notifications} alt="" className="mr-6" />
            <div>
              <p className="font-medium text-xl">Notifications</p>
              <p className="text-gray-600 text-lg">
                Get notified about assignments and updates.
              </p>
            </div>
          </div>
          <ToggleSwitch onToggle={handleNotificationSetting}/>
        </div>
      </div>

      {/* Log Out Section */}
      <div
        className="p-6 bg-white rounded-lg shadow-sm cursor-pointer"
        onClick={() => setSignOutModalOpen(true)}
      >
        <div className="flex items-center">
          <img src={logout} alt="" className="mr-6" />
          <div>
            <p className="font-medium text-xl">Sign Out</p>
            <p className="text-gray-600 text-lg">Sign out of all your devices.</p>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleSignOut}
      />
    </div>
  );
};

export default SettingsPage;
