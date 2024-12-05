import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';
import dash1 from '../assets/dashGIF.gif';
import Modal from '../modals/modal1';  
import { useSelector } from 'react-redux';
import Modal2 from '../modals/modal2';  

const Dashsignup = () => {
  const [createclassModal, setCreateclassModal] = useState(false);
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const [JoinclassModal, setJoinclassModal] = useState(false);

  const handleJoinClass = () => {
    setJoinclassModal(true);
  };
 
  const closeJoinclassmodal = () => {
    setJoinclassModal(false);
  };

  const handleCreateClass = () => {
    setCreateclassModal(true);
  };

  const closeCreateClassModal = () => {
    setCreateclassModal(false);
  };

  return (
    <div>
      <Header />
      <Sidebar />
      
      <div className="w-full bg-[#E1EAE8] h-screen flex items-center justify-center">
        <div className={`flex flex-col items-center ${isCollapsed ? "" : "md:ml-[80px]"} transition-all duration-300`}>
          <div className="flex justify-center">
            <img src={dash1} alt="Dashboard" className="w-full max-w-md" />
          </div>
          <div className="flex flex-col md:flex-row mt-8 space-y-4 md:space-y-0 md:space-x-4">
            <button 
              onClick={handleJoinClass} 
              className="bg-[#008080] w-[250px] h-[40px] text-white rounded-md text-lg grid place-content-center font-semibold text-center"
            >
              Join Your first Class
            </button>
            <button 
              onClick={handleCreateClass} 
              className="bg-[#008080] w-[250px] h-[40px] text-white rounded-md text-lg grid place-content-center font-semibold text-center"
            >
              Create Your first Class
            </button>
          </div>
        </div>
      </div>
      
      {createclassModal && (
        <Modal onClose={closeCreateClassModal} />
      )}
      {JoinclassModal && (
        <Modal2 onClose={closeJoinclassmodal} />
      )}
    </div>
  );
};

export default Dashsignup;
