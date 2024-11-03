import React from 'react';
import frame from '../assets/Frame.svg';
import cuate from '../assets/cuate.svg';

function Getstarted() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      {/* Header */}
      <div className="flex items-center justify-center mt-[4vh] ">
        <h1 className="text-6xl font-bold text-[#008080] mr-[1.5vw]">Welcome to</h1>
        <img src={frame} alt="Frame" className="h-20" />
      </div>

      {/* Description */}
      <div className="flex justify-center mt-[3vh] ">
        <p className="text-[24px] leading-relaxed text-[#414A4B} w-[80vw]">
          Your all-in-one platform for collaborative, efficient, and engaging learning. Join or create classes, manage assignments, connect with classmates, and stay on top of your academic journey.
        </p>
      </div>

      {/* Image */}
      <div className="flex justify-center mt-6">
        <img src={cuate} alt="Illustration"  />
      </div>

      {/* Buttons */}
      <div className="flex justify-center  space-x-4 mt-[5vh]">
        <button className="bg-[#008080] w-[10vw] text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-teal-700  ">
          Log In
        </button>
        <button className="bg-[#008080] w-[10vw] text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-teal-700 ">
          Create Account
        </button>
      </div>

      {/* Call to action */}
      <div className="flex justify-center  text-[#4C5858] text-lg mt-[4vh]">
        <p className='text-xl'>Ready to start? Your classroom is just a click away!</p>
      </div>

      {/* Footer */}
      <div className="flex justify-center text-[#414A4B] text-[12px] mt-[5vh] font-semibold ">
        Classence | ESTD. 2024
      </div>
    </div>
  );
}

export default Getstarted;
