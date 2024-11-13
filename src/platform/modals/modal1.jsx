import React, { useState } from 'react';
import createclass1 from '../assets/createclass1.svg'
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import {  setIsEnrolled  } from '../features/toggleSlice';
import { useSelector, useDispatch } from 'react-redux';





const Modal = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Class Privacy");
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [privacy, setPrivacy] = useState('');
  const dispatch = useDispatch();

  

  const handleSelect = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    setPrivacy(selectedOption==="Private"?"private":"public")

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
  const handleSubmit = async (e) => {



    e.preventDefault();


    const token=sessionStorage.getItem("authToken")
    console.log(token)




    // console.log(selectedOption);

    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log(name)
      console.log(subject)
      console.log(privacy)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/classroom/create`,
        {
          name,
          subject,
          privacy,
        },
        {
          headers
        }
      );
      

      if (response.data.success) {
        console.log(response)
        dispatch(setIsEnrolled(false));  

       
      }
    } catch (error) {
      console.log(error)
    } finally {
   
    }
  };


  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 '>
      <div className='bg-white w-[432px] h-[690px] flex justify-center items-center  relative overflow-y-auto '>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-4xl mt-[1%] mr-[1%] font-bold text-gray-600"
        >
          <CloseIcon fontSize='large'/>
        </button>
        

        <div className=' w-[90%] h-[90%] flex justify-center items-center '>
          <div className='  w-[80%] flex flex-col justify-around gap-[50px]'>

            <div>
              <h2 className='text-4xl font-medium '>Create Class</h2>
            </div>
            <div>
              <form className="flex flex-col gap-3">
                <input type="text" placeholder='Class Name' className="border rounded-md p-2" value={name} onChange={(e)=>setName(e.target.value)} />
                <input type="text" placeholder='Subject' className="border rounded-md p-2" value={subject} onChange={(e)=>setSubject(e.target.value)}/>

            
                <div className="relative">
                  <button 
                    type="button" 
                    className="border border-black rounded-md pl-5 h-24 w-full text-left text-xl "
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {selectedOption}
                    <span className="float-right px-3"><KeyboardArrowDownIcon/></span>
                  </button>

                  {isOpen && (
                    <div className=" absolute left-0  w-full mt-1 bg-white border border-black rounded-lg">
                      {options.map((option, index) => (
                        <div 
                          key={index} 
                          
                          onClick={() => handleSelect(option)}
                          className="p-6 h-[80px] hover:bg-gray-100 cursor-pointer rounded-lg"
                        >
                          <div className="text-xl">{option.label}</div>
                          <div className="text-xl text-gray-500">{option.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="flex items-center">
              <button className='bg-[#008080] py-5 w-[100%] text-white rounded-md text-lg grid place-content-center font-semibold text-center' onClick={handleSubmit}>
                Create Class
                
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
