import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const ScheduleLectureModal = ({ isOpen, onClose }) => {
  const [classOption, setClassOption] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  if (!isOpen) return null;

  const handleSchedule = () => {
    console.log("Class:", classOption, "Title:", title, "Description:", description, "Time:", time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-500 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col"
        style={{ width: "25vw", height: "65vh" }}
      >
        
        <div className="flex justify-between items-center mb-9">
          <h2 className="text-3xl font-semibold">Schedule Lecture</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <CloseIcon fontSize="large" />
          </button>
        </div>

        {/* Class Dropdown */}
        <div className="mb-12">
          <select
            id="class"
            value={classOption}
            onChange={(e) => setClassOption(e.target.value)}
            className="w-full border border-gray-600 rounded-lg p-7 text-2xl"
          >
            <option value="">Select Class</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
            <option value="SST">SST</option>
            <option value="Maths">Maths</option>
          </select>
        </div>

        {/* Lecture Title Input */}
        <div className="mb-6">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lecture Title"
            className="w-full p-2 border border-gray-300 rounded-lg text-xl"
          />
        </div>

        {/* Description Input */}
        <div className="mb-6">
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-8 border border-gray-300 rounded-lg text-xl"
          />
        </div>

        {/* Time Input */}
        <div className="mb-12">
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-8 border border-gray-500 rounded-lg"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleSchedule}
            className="flex-1 bg-[#008080] text-white py-6 rounded-lg text-xl hover:bg-[#006666]"
          >
            Schedule Lecture
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleLectureModal;
