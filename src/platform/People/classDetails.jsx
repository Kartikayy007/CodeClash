import React, { useEffect, useState, useRef } from "react";
import InviteModal from "./inviteModal";
import RemoveStudentModal from "./removeModal";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import avatar from "../assets/man.png";
import axios from "axios";
import { useLocation } from "react-router-dom";
import frame from "../assets/Frame.svg";

const ClassDetails = () => {
  const location = useLocation();
  const [instructor, setInstructor] = useState(null);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);

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
        { code: classCode, studentId: selectedStudent._id },
        axiosConfig
      );
      alert(`${selectedStudent.name} has been removed from the class.`);
      setStudents(students.filter((student) => student._id !== selectedStudent._id));
      setIsRemoveModalOpen(false);
    } catch (error) {
      console.error("Failed to remove student:", error);
      alert("Failed to remove the student. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="rounded-lg">
      <div className="mb-6 h-[90px] bg-white p-4 rounded-lg flex items-center border border-[#BCE2DF] justify-between">
        <div className="flex flex-col gap-[10px]">
          <h1 className="text-lg">Instructor</h1>
          <div className="flex ">
            <img
              src={avatar}
              alt="Instructor"
              className="w-12 h-12 rounded-full mr-4 "
            />
            <div className="flex-grow flex flex-col justify-center">
              <p className="text-sm text-gray-700 font-medium">
                {instructor?.name || "Loading..."}
              </p>
              <p className="text-sm text-gray-600">Instructor</p>
            </div>
          </div>
        </div>
        {/*  */}
      </div>

      <div className="bg-white p-4 rounded-lg border border-[#BCE2DF]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">Classmates</h2>
          <div className="flex gap-[10px] items-center">
            <p className="text-sm text-gray-600">
              {students.length} {students.length === 1 ? "Student" : "Students"}
            </p>
            {!isEnrolled && (
              <div className="">
                <PersonAddAltIcon
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer bg-[#066769] rounded-full p-2 text-white"
                  sx={{ fontSize: '30px' }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 flex flex-col">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student._id} className="relative p-5 flex items-center justify-between h-[50px] hover:bg-gray-200 rounded-lg">
                <div className="flex items-center">
                  <img
                    src={avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <p className="text-gray-700">{student.name}</p>
                </div>
                {!isEnrolled ? (
                  <MoreVertIcon
                    onClick={() =>
                      setActivePopup((prev) => (prev === student._id ? null : student._id))
                    }
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                  />
                ) : null}

                {activePopup === student._id && (
                  <div ref={popupRef} className="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsRemoveModalOpen(true);
                        setActivePopup(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-6">
              <div className="mb-6">
                <img
                  src={frame}
                  alt="No students illustration"
                  className="max-w-full h-auto"
                />
              </div>

              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No Students in Your Class Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Your class is empty! Share the class code or invite students directly
                  to get started.
                </p>
              </div>

              <div className="flex space-x-4">
                <button className="bg-[#066769] text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-900 transition">
                  Copy Class Code
                </button>
                <button className="bg-[#066769] text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-900 transition" onClick={() => setIsModalOpen(true)}>
                  Invite Students
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <InviteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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
