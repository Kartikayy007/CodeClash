import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";
import ScheduleLectureModal from "./scheduleModal";
import pana2 from "../assets/pana2.svg";
import { useLocation, useNavigate } from "react-router-dom";

const ReminderModal = ({ isOpen, onClose, title, lectureId }) => {
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSetReminder = async () => {
    if (!reminderTime) {
      setError("Please select a valid time.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const utcTime = new Date(reminderTime).toISOString();

      const token =
        sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reminder`,
        {
          lectureId,
          scheduledTime:utcTime,
        },
        axiosConfig
      );
console.log(response)
      if (response.status === 200) {
        setSuccess("Reminder set successfully!");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError("Failed to set the reminder. Please try again.");
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
      setError("An error occurred while setting the reminder.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="flex flex-col justify-around bg-white w-1/3 p-6 h-[40%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl">Set Reminder</h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-4xl hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 mb-4 text-xl">
            We will remind you about your <strong>{`'${title}'`}</strong> lecture via mail.
          </p>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 h-[60px] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#066769]"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <div className="flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-4 w-1/2 border border-[#066769] text-gray-600 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            className="w-1/2 px-4 py-2 bg-[#066769] text-white rounded-lg hover:bg-teal-800"
            onClick={handleSetReminder}
            disabled={loading}
          >
            {loading ? "Setting..." : "Set Reminder"}
          </button>
        </div>
      </div>
    </div>
  );
};

const RevisionClassCard = ({ title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [editingLecture, setEditingLecture] = useState(null);
  const [selectedLectureId, setSelectedLectureId] = useState(null); 

  const classCode = location.state?.code;

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token =
          sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/lecture/?code=${classCode}`,
          axiosConfig
          
        );
        console.log(response.data)
        if (response.status === 200) {
          setLectures(response.data.futureLectures);
         
        }
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchLectures();
  }, [classCode]);

  const handleDelete = async (lectureId) => {
    try {
      const token =
        sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/lecture/delete?lectureId=${lectureId}`,
        axiosConfig
      );

      if (response.status === 200) {
        setLectures((prevLectures) =>
          prevLectures.filter((lecture) => lecture._id !== lectureId)
        );
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
    } finally {
      setOpenMenuId(null);
    }
  };

  const openModal = (lecture = null) => {
    setEditingLecture(lecture);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLecture(null);
  };

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const openReminderModal = (lectureId) => {
    setSelectedLectureId(lectureId);
    setIsReminderModalOpen(true);
  };

  const closeReminderModal = () => {
    setIsReminderModalOpen(false);
    setSelectedLectureId(null);
  };

  const handleJoinLecture = (lectureId,lecture) => {
    navigate('/live', { 
      state: { 
        lectureId,
        classCode ,
        teacherId:lecture.teacher._id
      }
    });
  };

  return (
    <div>
      {!isEnrolled && (
        <button
          className="bg-[#066769] text-white font-medium mb-4 py-4 px-8 rounded-lg"
          onClick={() => openModal()}
        >
          Schedule Lecture
        </button>
      )}

      {Array.isArray(lectures) && lectures.length > 0 ? (
        lectures.map((lecture) => (
          <div
            key={lecture._id}
            className="flex justify-between mb-[10px] items-center bg-white rounded-lg px-6 py-4 h-[150px] border border-[#D9DEDE] relative"
          >
            <div className="flex items-center h-full">
              <img src={pana2} alt="Class Illustration" className="h-full mr-4" />
              <div className="flex flex-col gap-5  h-full justify-around sm:ml-[50px]">
                <h3 className="text-xl text-gray-800">{lecture.title}</h3>
                <p className="text-sm text-gray-600">{lecture.description}</p>
                <div className="flex flex-col text-sm text-gray-500 gap-2">
                  <span>
                    <i className="far fa-clock mr-2"></i> {lecture.time}
                  </span>
                  <span>
                    <i className="fas fa-globe mr-2"></i> {lecture.language}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end h-full">
              <button
                onClick={() => toggleMenu(lecture._id)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <FaEllipsisV />
              </button>
              {openMenuId === lecture._id && (
                <div className="absolute right-0 top-8 bg-white shadow-lg border rounded-lg w-40">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => openModal(lecture)}
                  >
                    Edit Lecture
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    onClick={() => handleDelete(lecture._id)}
                  >
                    Delete Lecture
                  </button>
                </div>
              )}
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 border border-[#066769] text-[#066769] rounded-lg"
                  onClick={() => openReminderModal(lecture._id)}
                >
                  Set Reminder
                </button>
                <button 
                  className="px-4 py-2 bg-[#066769] text-white rounded-lg"
                  onClick={() => handleJoinLecture(lecture._id,lecture)}
                >
                  Join Lecture
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No lectures scheduled</p>
      )}

      <ScheduleLectureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingLecture}
      />
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={closeReminderModal}
        title={title}
        lectureId={selectedLectureId}
      />
    </div>
  );
};

export default RevisionClassCard;
