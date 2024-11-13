import React, { useState } from 'react';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import {  setIsEnrolled  } from '../features/toggleSlice';
import { useSelector, useDispatch } from 'react-redux';

const Modal2 = ({ onClose }) => {
  const [code, setCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();



  const handleSubmit = async (e) => {



    e.preventDefault();


    const token=sessionStorage.getItem("authToken")||localStorage.getItem("authToken")
    console.log(code)
    console.log(token)

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
     
     

     
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/classroom/join`,
        {
          code,
          token,
       
        },
        {
          headers
        }
      );
      

      if (response.data.success) {
        console.log(response)
        dispatch(setIsEnrolled(true));  

       
      }
    } catch (error) {
      console.log(error)
    } finally {
   
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[432px] h-[398px] flex flex-col justify-center items-center  relative overflow-y-auto ">
        <div className="w-[80%] h-[90%] flex flex-col justify-around">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-4xl mt-[1%] mr-[1%] font-bold text-gray-600"
          >
             <CloseIcon fontSize='large'/>
          </button>

          <div className="">
            <h2 className="text-4xl font-medium ">Join Class</h2>
          </div>

          <form>
            <input
            value={code} onChange={(e)=>setCode(e.target.value)} 
              type="text"
              placeholder="Class Code"
              className="w-full p-2 border border-gray-300 rounded-md "
              style={{marginBottom:0}}
            />
          </form>

          <div className=''>
            <button className="bg-[#008080] py-5 w-full text-white rounded-md text-lg font-semibold text-center grid place-content-center  "onClick={handleSubmit}>
              Join Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal2;
