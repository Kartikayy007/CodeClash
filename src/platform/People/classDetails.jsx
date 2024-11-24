import React, { useEffect, useState } from "react";
import InviteModal from "./inviteModal";
import RemoveStudentModal from "./removeModal";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import avatar from "../assets/man.png";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ClassDetails = () => {
  const location = useLocation();
  const [instructor, setInstructor] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Invite modal state
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false); // Remove confirmation modal state
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student to remove
  const [activePopup, setActivePopup] = useState(null); // ID of student with active popup
  const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
  const classCode = location.state?.code;

  const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (classCode) {
      fetchClassDetails();
    }
  }, [classCode]);

  const fetchClassDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/classroom/details?code=${classCode}`,
        axiosConfig
      );
      const { teacher, students } = response.data.classroom;
      setInstructor(teacher);
      setStudents(students);
    } catch (error) {
      console.error("Failed to fetch class details:", error);
    }
  };

  const handleRemoveStudent = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/classroom/remove`,
        
         { code:classCode, studentId: selectedStudent._id },
          axiosConfig,
        
      );
      alert(`${selectedStudent.name} has been removed from the class.`);
      setStudents(students.filter((student) => student._id !== selectedStudent._id));
      setIsRemoveModalOpen(false);
    } catch (error) {
      console.error("Failed to remove student:", error);
      alert("Failed to remove the student. Please try again.");
    }
  };

  return (
    <div className="rounded-lg">
      {/* Instructor Section */}
      <div className="mb-6 h-[90px] bg-white p-4 rounded-lg flex items-center border border-[#BCE2DF] justify-between">
        <div className="flex flex-col gap-[10px]">
          <h1 className="text-lg">Instructor</h1>
          <div className="flex">
            <img
              src={avatar}
              alt="Instructor"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-grow flex flex-col justify-center">
              <p className="text-sm text-gray-700 font-medium">
                {instructor?.name || "Loading..."}
              </p>
              <p className="text-sm text-gray-600">Instructor</p>
            </div>
          </div>
        </div>
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11 8.38 8.38 0 013.8.9L21 3v7.5z"
            />
          </svg>
        </button>
      </div>

      {/* Students Section */}
      <div className="bg-white p-4 rounded-lg border border-[#BCE2DF]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">Classmates</h2>
          <div className="flex gap-[10px] items-center">
            <p className="text-sm text-gray-600">
              {students.length} {students.length === 1 ? "Student" : "Students"}
            </p>
            {!isEnrolled && (
              <PersonAddAltIcon
                onClick={() => setIsModalOpen(true)} // Open invite modal on click
                className="cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4 flex flex-col gap-[10px]">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student._id} className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <p className="text-gray-700">{student.name}</p>
                </div>
                <MoreVertIcon
                  onClick={() =>
                    setActivePopup((prev) => (prev === student._id ? null : student._id))
                  }
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                />
                {/* Popup Menu */}
                {activePopup === student._id && (
                  <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsRemoveModalOpen(true); // Open confirmation modal
                        setActivePopup(null); // Close popup
                      }}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No students enrolled yet.</p>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Remove Confirmation Modal */}
      <RemoveStudentModal
        isOpen={isRemoveModalOpen}
        student={selectedStudent}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemoveStudent}
      />
    </div>
  );
};

export default ClassDetails;
