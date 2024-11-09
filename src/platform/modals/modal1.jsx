import React, { useState } from 'react';
import createclass1 from '../assets/createclass1.svg'

const Modal = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Class Privacy");

  const handleSelect = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
  };

  const options = [
    {
      label: "Public",
      description: "Visible to all students who have a class code",
    },
    {
      label: "Private",
      description: "Only students you invite can join",
    }
  ];

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
                <input type="text" placeholder='Class Name' className="border rounded-md p-2" />
                <input type="text" placeholder='Subject' className="border rounded-md p-2" />

            
                <div className="relative">
                  <button 
                    type="button" 
                    className="border border-black rounded-md pl-5 h-24 w-full text-left text-xl "
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {selectedOption}
                    <span className="float-right">▼</span>
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 w-full mt-1 bg-white border border-black rounded">
                      {options.map((option, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleSelect(option)}
                          className="p-3 hover:bg-gray-100 cursor-pointer"
                        >
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
            <img src={createclass1} alt="Create Class" className="w-[600px] h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
