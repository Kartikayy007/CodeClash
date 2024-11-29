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
          isDay ? "translate-x-1" : "translate-x-10"
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

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
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
          isOn ? "translate-x-10" : ""
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
  console.log("mail",userMail)
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
          <ToggleSwitch />
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
            <p className="font-medium text-xl">Log Out</p>
            <p className="text-gray-600 text-lg">Sign out of your account.</p>
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
