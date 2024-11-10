import React from 'react';

const Modal2 = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[25vw] h-[45vh] flex flex-col justify-center items-center rounded-lg relative">
        <div className="w-[80%] h-[90%]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-4xl mt-[1%] mr-[1%] font-bold text-gray-600"
          >
            &times;
          </button>

          <div className="mt-[5vh] mb-[5vh]">
            <h2 className="text-5xl font-semibold mb-[4vh]">Join Class</h2>
          </div>

          <form>
            <input
              type="text"
              placeholder="Class Code"
              className="w-full p-2 border border-gray-300 rounded-md mb-[4vh]"
            />
          </form>

          <div className='mt-[4vh]'>
            <button className="bg-[#008080] h-[40px] w-full text-white rounded-md text-lg font-semibold text-center grid place-content-center">
              Join Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal2;
