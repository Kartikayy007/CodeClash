import React, { useState } from 'react';
import teachassign from "../assets/teachassign.svg";

const Newassignment = () => {
  const [selectedClass, setSelectedClass] = useState('');

  const handleChange = (event) => {
    setSelectedClass(event.target.value);
  };

  return (
    <div className="flex flex-col gap-5 h-full ">
      <h2 className="text-xl w-[95%] mx-auto">Create New Assignment</h2>
      <div className="bg-[#FAFAFA] border border-[#BCE2DF] p-6 rounded-md mx-auto w-[95%] h-[80%] ">
        <div className="flex flex-wrap space-y-4">
          
          <div className="w-[70%]">
            <form className="flex flex-col ">
             
              <div className="flex flex-col">
                <input
                  id="assignment-title"
                  type="text"
                  placeholder="Assignment Title"
                  className="border border-gray-300 rounded-md p-2 w-full"
                  style={{ borderColor: 'gray !important', borderWidth: '1px !important' }}
                />
              </div>

              
              <div className="flex flex-col">
                <select
                  id="class-select"
                  value={selectedClass}
                  onChange={handleChange}
                  className="rounded-lg w-full p-[20px] text-xl  border border-[#4C5858] "
                  style={{
                    
                    outline: 'none',
                  }}
                >
                  <option value="" disabled>
                    Class
                  </option>
                  <option value="english">English</option>
                  <option value="maths">Maths</option>
                  <option value="science">Science</option>
                </select>
              </div>

              
              <button
                type="submit"
                className="w-[70%] p-3 bg-[#066769] rounded-md text-white text-xl mt-8"
              >
                Create Assignment
              </button>
            </form>
          </div>

          
          <div className="w-[20%] ml-auto">
            <img src={teachassign} alt="Teacher Assign Illustration" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newassignment;
