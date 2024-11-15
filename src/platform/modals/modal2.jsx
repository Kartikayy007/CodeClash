import React, { useState } from 'react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { setIsEnrolled } from '../features/toggleSlice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal2 = ({ onClose }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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
        toast.success("Class joined successfully!");
       onClose();
      }
    } catch (error) {
      toast.error("Failed to join class. Please check the code.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[432px] h-[398px] flex flex-col justify-center items-center relative overflow-y-auto">
        <div className="w-[80%] h-[90%] flex flex-col justify-around">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-4xl font-bold text-gray-600"
          >
            <CloseIcon fontSize='large'/>
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
      {/* <ToastContainer position="top-center" autoClose={3000} /> */}
    </div>
  );
};

export default Modal2;
