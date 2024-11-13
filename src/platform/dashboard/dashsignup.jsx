import React, { useState } from 'react';
import Sidebar from '../sidebar/sidebar';
import Headersignup from '../header/headersignup';
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
 
   const closeJoinclassmodal =() =>{
    setJoinclassModal(false);
   }

  const handleCreateClass = () => {
    setCreateclassModal(true);
  };

  const closeCreateClassModal = () => {
    setCreateclassModal(false);
  };

  return (
    <div>
      <Sidebar />
      <Headersignup />
      <div className="w-[100%] flex items-center flex-col pt-[15px]  h-[80vh] justify-center">
        <div className={`flex-col items-center ${isCollapsed?"":"ml-[80px]"}`} style={{transition:'margin-left 0.3s '}}>
          <div className="flex justify-center">
            <img src={dash1} alt="Dashboard" />
          </div>
          <div className="flex mt-[3vh]">
            <button 
            onClick={handleJoinClass} 
           className="bg-[#008080] w-[250px] h-[40px] text-white rounded-md text-lg grid place-content-center font-semibold text-center mr-[2vw]">
              Join Your first Class
            </button>
            <button 
              onClick={handleCreateClass} 
              className="bg-[#008080] w-[250px] text-white rounded-md text-lg grid place-content-center font-semibold text-center"
            >
              Create Your first Class
            </button>
          </div>
        </div>
      </div>
      
      {createclassModal && (
        <Modal
        onClose={closeCreateClassModal}/>
      )}
      {JoinclassModal && (
        <Modal2
        onClose={closeJoinclassmodal}/>
      )}
    </div>
  );
};

export default Dashsignup;
