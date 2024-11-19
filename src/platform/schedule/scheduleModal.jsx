import React, { useState, useEffect } from "react";

const ScheduleLectureModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true); 
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); 
  };

  if (!isOpen && !isVisible) return null; 

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-lg p-[50px] w-[400px] md:w-[500px] relative transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Schedule Lecture</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black font-semibold"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="English"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
              readOnly
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Lecture Title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div>
            <textarea
              placeholder="Description"
              className="w-full p-[20px] border border-[#4C5858] placeholder-black::placeholder rounded-lg focus:outline-none resize-none"
              rows="3"
            ></textarea>
          </div>
          <div>
            <input
              type="time"
              className="w-full p-[20px] border border-[#4C5858] mt-[20px] rounded-md focus:outline-none"
            />
          </div>
          <button
            style={{ marginTop: "50px" }}
            type="submit"
            className="w-full bg-[#066769] text-white py-2 rounded-md transition-all h-[50px]"
          >
            Schedule Lecture
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleLectureModal;
