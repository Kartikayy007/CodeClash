import React, { useState } from "react";
import { useSelector } from "react-redux";
import image from "../assets/image.svg";
import pass from "../assets/pass.svg";
import notifications from "../assets/notifications.svg";
import logout from "../assets/logout.svg";
import modes from "../assets/nodes.svg";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import Resetpass from "../modals/resetpass";


const DayNightToggle = () => {
    const [isDay, setIsDay] = useState(true);
  
    const toggleSwitch = () => {
      setIsDay(!isDay);
    };
  
    return (
      <div
        className={`w-24 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
          isDay ? "bg-white" : "bg-gray-600"
        }`}
        onClick={toggleSwitch}
      >
        <div
          className={`w-full h-full flex items-center rounded-full 
            
               bg-gray-600`}
         
        >
          <img
            src={sun}
            alt="Sun Icon"
            className={`w-6 h-6 mx-2 transition-opacity ${
              isDay ? "opacity-100" : "opacity-0"
            }`}
          />
          <img
            src={moon}
            alt="Moon Icon"
            className={`w-6 h-6 mx-2 transition-opacity ${
              isDay ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
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

const SettingsPage = () => {
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const [isModalOpen, setModalOpen] = useState(false); 
  return (
    <div
      className="mt-12 mx-auto  ml-[2%] bg-[#E1EAE8] p-6 rounded-lg shadow-md h-[100vh] overflow-y-auto"
      style={{ marginLeft: sidebarWidth }}
    >
      <h1 className="text-4xl font-semibold mb-8 leading-tight">Settings</h1>
      <p className="text-2xl text-gray-600 mb-20 leading-relaxed">
        Customize your Classence experience to suit your preferences.
      </p>

      {/* Your Profile Section */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-medium mb-4 leading-snug">Your Profile</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={image} alt="" />
            </span>
            <div>
              <p className="font-semibold text-xl leading-snug">Name</p>
              <p className="text-gray-600 text-xl leading-snug">Email address</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={pass} alt="" />
            </span>
            <div>
              <p className="font-semibold text-xl leading-snug">
                Change Password
              </p>
              <p className="text-gray-600 text-xl leading-snug">
                Change your password.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={modes} alt="" />
            </span>
            <div>
              <p className="font-semibold text-xl leading-snug">Appearance</p>
              <p className="text-gray-600 text-xl leading-snug">
                Switch between light and dark mode to match your environment.
              </p>
            </div>
          </div>
          <DayNightToggle />
        </div>
      </div>

       {/* Notification Section */}
       <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={notifications} alt="" />
            </span>
            <div>
              <p className="font-semibold text-xl leading-snug">Notification</p>
              <p className="text-gray-600 text-xl leading-snug">
                Get notified about assignments, upcoming classes via email.
              </p>
            </div>
          </div>
          <ToggleSwitch />
        </div>
      </div>

    
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={logout} alt="" />
            </span>
            <div>
              <p className="font-semibold text-xl leading-snug">
                Sign Out from all devices
              </p>
              <p className="text-gray-600 text-xl leading-snug">
                Log out your account from all devices.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Resetpass
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default SettingsPage;
