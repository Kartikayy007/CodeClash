import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ScheduleLectureModal = ({ isOpen, onClose,initialData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const classCode = location.state?.code;
  const isEditing=initialData?true:false;
  

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      

      if (initialData) {
        setLectureTitle(initialData.title || "");
        setDescription(initialData.description || "");

        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16); 

        };
        setTime(formatDate(initialData.startTime));
      } else {

        setLectureTitle("");
        setDescription("");
        setTime("");
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lectureTitle || !description || !time) {
      setError("All fields are required.");
      return;
    }


    setError("");
    setLoading(true);
  
console.log(isEditing)
    try {
      const token =
        sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
        

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let response;
     if(isEditing){
       response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/lecture/update?lectureId=${initialData._id}`, 
        {
          title: lectureTitle,
          description,
          startTime:time,
          code:classCode,
 
          
        },
        axiosConfig
      );
     }
     else{
       response = await axios.post(
        `${process.env.REACT_APP_API_URL}/lecture/create`, 
        {
          title: lectureTitle,
          description,
          startTime:time,
          code:classCode
          
        },
        axiosConfig
      );}

      if (response.status === 201) {
        console.log("Lecture scheduled successfully:", response.data);
        handleClose();
      }else if(response.status===200){
        console.log("Lecture updated successfully:", response.data);
        handleClose();
      } else {
        setError("Failed to schedule the lecture.");
        
      }
    } catch (error) {
      console.error("Error scheduling lecture:", error);
      setError("An error occurred while scheduling the lecture.");
    } finally {
      setLoading(false);
    }
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

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>
          <div>
            <textarea
              placeholder="Description"
              className="w-full p-[20px] border border-[#4C5858] placeholder-black::placeholder rounded-lg focus:outline-none resize-none"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <input
              type="datetime-local"
              className="w-full p-[20px] border border-[#4C5858] mt-[20px] rounded-md focus:outline-none"
              value={time}
              onChange={(e) => setTime(e.target
                .value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#066769] text-white py-2 rounded-md transition-all h-[50px]"
            disabled={loading}
          >
            {loading ? "Scheduling..." : "Schedule Lecture"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleLectureModal;
