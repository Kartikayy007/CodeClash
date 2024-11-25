import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";
import ScheduleLectureModal from "./scheduleModal";
import pana2 from "../assets/pana2.svg";

const RevisionClassCard = ({ title, description, time, language }) => {
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleEdit = () => {
    console.log("Edit Lecture");
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete Lecture");
    setIsMenuOpen(false);
  };

  return (
    <div>
      {!isEnrolled && (
        <div>
          <button
            className="bg-[#066769] text-white font-medium mb-4 py-4 px-8 rounded-lg"
            onClick={openModal}
          >
            Schedule Lecture
          </button>
        </div>
      )}

      <div className="flex justify-between items-center bg-white rounded-lg px-6 py-4 h-[150px] border border-[#D9DEDE] relative">
        <div className="flex items-center h-full">
          <img
            src={pana2}
            alt="Class Illustration"
            className="h-full mr-4"
          />
          <div className="flex flex-col gap-5 ml-[50px] h-full justify-around">
            <h3 className="text-xl text-gray-800">{title || "Class Title"}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
            <div className="flex flex-col text-sm text-gray-500 mt-2 space-x-4 gap-2">
              <span className="flex items-center">
                <i className="far fa-clock mr-2"></i> {time || "8:00 AM"}
              </span>
              <span className="flex items-center" style={{ marginLeft: 0 }}>
                <i className="fas fa-globe mr-2"></i> {language || "English"}
              </span>
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col justify-between items-end">
           <div>
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <FaEllipsisV />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-8 bg-white shadow-lg border rounded-lg w-40">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleEdit}
              >
                Edit Lecture
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                onClick={handleDelete}
              >
                Delete Lecture
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <button className=" px-4 py-2 border border-[#066769] text-[#066769] rounded-lg">
            Set Reminder
          </button>
          <button className=" px-4 py-2 bg-[#066769] text-white rounded-lg hover:bg-teal-900">
            Join Lecture
          </button>
        </div>

        {/* Three dots menu */}
       
        </div>
      </div>
      <ScheduleLectureModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default RevisionClassCard;
