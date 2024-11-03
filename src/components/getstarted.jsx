import React, { useEffect } from 'react';
import frame from '../assets/Frame.svg';
import cuate from '../assets/cuate.svg';
import { Link, useNavigate } from 'react-router-dom';

function Getstarted() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="flex items-center justify-center mt-4">
        <h1 className="text-4xl md:text-6xl font-bold text-[#008080] mr-4">Welcome to</h1>
        <img src={frame} alt="Frame" className="h-16 md:h-20" />
      </div>

      <div className="flex justify-center mt-4">
        <p className="text-lg md:text-[24px] leading-relaxed text-[#414A4B] w-[90%] md:w-[80vw]">
          Your all-in-one platform for collaborative, efficient, and engaging learning. Join or create classes, manage assignments, connect with classmates, and stay on top of your academic journey.
        </p>
      </div>

      <div className="flex justify-center mt-6">
        <img src={cuate} alt="Illustration" className="w-[80%] max-w-md" />
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <Link 
          to="/login" 
          className="bg-[#008080] w-[200px] md:w-[250px] text-white px-6 py-3 rounded-md text-lg md:text-2xl font-semibold">
          Log In
        </Link>
        <Link 
          to="/signup" 
          className="bg-[#008080] w-[200px] md:w-[250px] text-white px-6 py-3 rounded-md text-lg md:text-2xl font-semibold">
          Create Account
        </Link>
      </div>

      <div className="flex justify-center text-[#4C5858] text-lg mt-4 font-semibold">
        <p className='text-lg md:text-xl'>Ready to start? Your classroom is just a click away!</p>
      </div>

      <div className="flex justify-center text-[#414A4B] text-[10px] md:text-[12px] mt-4 font-semibold">
        Classence | ESTD. 2024
      </div>
    </div>
  );
}

export default Getstarted;
