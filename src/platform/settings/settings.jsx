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
      className={`relative w-20 h-10 flex items-center rounded-full cursor-pointer p-1 transition-colors duration-300 ${
        isDay ? "bg-yellow-400" : "bg-gray-700"
      }`}
      onClick={toggleSwitch}
    >
      {/* Animated Circle */}
      <div
        className={`absolute w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isDay ? "translate-x-1" : "translate-x-10"
        }`}
      ></div>

      {/* Sun Icon */}
      <img
        src={sun}
        alt="Sun Icon"
        className={`absolute left-3 w-6 h-6 transition-opacity duration-300 ${
          isDay ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Moon Icon */}
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

const SettingsPage = () => {
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div
      className="mt-[50px] mx-auto  ml-[2%] bg-[#E1EAE8] p-6 rounded-lg shadow-md h-[100vh] overflow-y-auto"
      style={{ marginLeft: sidebarWidth }}
    >
      <h1 className="text-3xl font-medium mb-2 leading-tight">Settings</h1>
      <p className="text-xl text-gray-600 mb-20 leading-relaxed">
        Customize your Classence experience to suit your preferences.
      </p>

      {/* Your Profile Section */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl  mb-4 leading-snug">Your Profile</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={image} alt="" />
            </span>
            <div>
              <p className="font-medium text-xl leading-snug">Name</p>
              <p className="text-gray-600 text-lg leading-snug">Email address</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={pass} alt="" />
            </span>
            <div>
              <p className="font-medium text-xl leading-snug">Change Password</p>
              <p className="text-gray-600 text-lg leading-snug">
                Change your password.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={modes} alt="" />
            </span>
            <div>
              <p className="font-medium text-xl leading-snug">Appearance</p>
              <p className="text-gray-600 text-lg leading-snug">
                Switch between light and dark mode to match your environment.
              </p>
            </div>
          </div>
          <DayNightToggle />
        </div>
      </div>

      {/* Notification Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={notifications} alt="" />
            </span>
            <div>
              <p className="font-medium text-xl leading-snug">Notification</p>
              <p className="text-gray-600 text-lg leading-snug">
                Get notified about assignments, upcoming classes via email.
              </p>
            </div>
          </div>
          <ToggleSwitch />
        </div>
      </div>

      {/* Logout Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-6">
              <img src={logout} alt="" />
            </span>
            <div>
              <p className="font-medium text-xl leading-snug">
                Sign Out from all devices
              </p>
              <p className="text-gray-600 text-lg leading-snug">
                Log out your account from all devices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <Resetpass
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default SettingsPage;
