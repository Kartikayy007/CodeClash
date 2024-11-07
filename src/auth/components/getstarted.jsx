import React, { useEffect, useState } from 'react';
import frame from '../assets/Frame.svg';
import cuate from '../assets/cuate.svg';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import get1 from '../assets/get1.svg';
import get2 from '../assets/get2.svg';
import get3 from '../assets/get3.svg';
import get4 from '../assets/get4.svg';
import get5 from '../assets/get5.svg';

const images = [get1, get2, get3, get4, get5];

const Getstarted = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const reachlast = () => {
    setCurrentIndex(images.length - 1);
  };

  const nextimage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Handling touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart - touchEnd > 50) {
      nextimage(); // Swipe left
    }
    if (touchEnd - touchStart > 50) {
      prevImage(); // Swipe right
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-3 text-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {currentIndex !== images.length - 1 && (
        <button 
          onClick={reachlast} 
          className="absolute top-0 right-0 mt-4 mr-4 text-black text-md lg:hidden"
        >
          Skip
        </button>
      )}

      <div className="flex items-center justify-center lg:mt-[5vh] hidden lg:flex">
        <h1 className="text-4xl black md:text-4xl lg:text-6xl text-[#008080] font-bold mr-4">Welcome to Classence</h1>
        <img src={frame} alt="Frame" className="hidden h-16 md:h-16 lg:h-20 " />
      </div>

      <div className="flex justify-center mt-4">
        <p className="text-lg md:text-[20px] leading-relaxed text-[#414A4B] w-[90%] md:w-[80vw] hidden lg:block">
          Your all-in-one platform for collaborative, efficient, and engaging learning. Join or create classes, manage assignments, connect with classmates, and stay on top of your academic journey.
        </p>
      </div>

      <div className="flex justify-center mt-[6vh]">
        <img src={cuate} alt="Illustration" className="w-[90%] max-w-2xl hidden lg:block" />
        <div className="flex justify-center max-w-2xl content block lg:hidden">
          <div className="slider2">
            <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Slide ${index + 1}`} className="slide" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-[6vh] block gap-x-3 lg:hidden">
        {images.map((_, index) => (
          <div key={index} className={`rec ${currentIndex === index ? 'recActive' : 'rec2'}`}></div>
        ))}
      </div>

      {currentIndex === 0 && (
        <button onClick={nextimage} className="bg-[#008080] w-[90%] text-white px-6 py-3 rounded-md text-lg md:text-2xl font-semibold mt-[5vh] block lg:hidden">
          Get Started
        </button>
      )}

      {currentIndex !== images.length-1 && currentIndex !== 0 && (
        <button onClick={nextimage} className="bg-[#008080] w-[90%] text-white px-6 py-3 rounded-md text-lg md:text-2xl font-semibold mt-[3vh] block lg:hidden">
          Next
        </button>
      )}
    
      {currentIndex === images.length - 1 && (
      <div className="flex justify-center space-x-4 mt-[6vh] block lg:hidden w-[90%]">
      <Link 
      to="/login" 
      className="bg-[#008080] w-[200px] text-white px-6 py-3 rounded-md text-lg  grid place-content-center md:text-2xl font-semibold text-center ml-[vw]">
      Log In
        </Link>
      <Link 
      to="/signup" 
      className="bg-[#008080] w-[200px] text-white px-6 py-3 rounded-md text-lg md:text-2xl font-semibold text-center mr-[1vw]">
      Create Account
    </Link>
     </div>
     )}
     <div className="flex justify-center space-x-4 mt-[6vh] lg:flex">
      <Link 
      to="/login" 
      className="bg-[#008080] w-[200px] text-white px-6 py-3 rounded-md text-lg md:text-2xl font-semibold text-center ml-[vw] hidden lg:block">
      Log In
        </Link>
      <Link 
      to="/signup" 
      className="bg-[#008080] w-[200px] text-white px-6 py-3 rounded-md text-lg md:text-2xl font-semibold text-center mr-[1vw] hidden lg:block">
      Create Account
    </Link>
     </div>
  
      <div className="flex justify-center text-[#4C5858] text-lg mt-[4vh] font-semibold hidden lg:block">
        <p className="text-lg md:text-xl">Ready to start? Your classroom is just a click away!</p>
      </div>

      <div className="flex justify-center items-center gap-2 text-[#414A4B] text-md md:text-xl mt-[5vh] font-semibold hidden lg:block relative">
        <FontAwesomeIcon icon={faCopyright} className="mr-5"/>
        Classence | ESTD. 2024
      </div>
    </div>
  );
};

export default Getstarted;
