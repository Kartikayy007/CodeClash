import React from 'react';
import createclass1 from '../assets/createclass1.svg';

const Modal = ({ onClose }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white w-[78vw] h-[72vh] flex justify-center items-center rounded-lg relative'>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-4xl mt-[1%] mr-[1%] font-bold text-gray-600"
        >
          &times;
        </button>
        
        <div className='left w-[39vw] h-[72vh]'>
          <div className='leftsub w-[50%] ml-[20%]'>
            <div>
              <h2 className='text-5xl font-semibold mb-[4vh]'>Create Class</h2>
            </div>
            <div>
              <form className="flex flex-col gap-6">
                <input type="text" placeholder='Class Name'/>
                <input type="text" placeholder='Subject' />
                <input type="text" placeholder='Class Privacy' />
              </form>
            </div>
            <div className="flex items-center mt-[7vh]">
              <button className='bg-[#008080] h-[40px] w-[100%] text-white rounded-md text-lg grid place-content-center font-semibold text-center'>
                Create Class
              </button>
            </div>
          </div>
        </div>
        <div className='right w-[39vw] h-[72vh] flex-col bg-[#EEF0F0]'>
          <div className='ml-[5%] mr-[5%] mb-[7vh] flex flex-col items-center justify-center'>
            <p className='text-2xl text-[#4C5858] text-center'>Set up a class space for your students to receive assignments,
            announcements, and join class meetings.</p>
          </div>
          <div>
            <img src={createclass1} alt="" className="w-[600px] h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
