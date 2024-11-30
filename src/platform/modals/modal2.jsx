import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { setIsEnrolled } from '../features/toggleSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal2 = ({ onClose }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false); 
  const dispatch = useDispatch();

  useEffect(() => {
    setIsVisible(true); // Trigger fade-in when component mounts
  }, []);

  const handleClose = () => {
    setIsVisible(false); // Trigger fade-out animation
    setTimeout(onClose, 300); // Wait for the animation to complete
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/classroom/join`,
        { code },
        { headers }
      );

      if (response.data.success) {
        dispatch(setIsEnrolled(true));
        toast.dismiss();

        toast.success("Class joined successfully!", {
          className: "custom-toastS",
          hideProgressBar: true,
          autoClose: 3000,
        });
        handleClose();
      }
    } catch (error) {
      toast.dismiss();

      toast.error("Failed to join class.", {
        className: "custom-toast",
        hideProgressBar: true,
        autoClose: 3000,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white w-[432px] h-[398px] flex flex-col justify-center items-center relative overflow-y-auto transform transition-transform duration-300 ${
          isVisible ? 'scale-100' : 'scale-90'
        }`}
      >
        <div className="w-[80%] h-[90%] flex flex-col justify-around">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-4xl font-bold text-gray-600"
          >
            <CloseIcon fontSize="large" />
          </button>

          <h2 className="text-4xl font-medium">Join Class</h2>

          <form onSubmit={handleSubmit}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              type="text"
              placeholder="Class Code"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </form>
          <button
            type="submit"
            className="bg-[#008080] py-5 w-full text-white rounded-md text-lg font-semibold text-center grid place-content-center "
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Joining..." : "Join Class"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal2;
