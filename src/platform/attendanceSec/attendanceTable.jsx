import React, { useEffect, useState } from "react";
import profile from '../assets/profile.svg';
import axios from "axios";
const AttendanceTable = ({classCode}) => {
  const [selectedLecture, setSelectedLecture] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [lectureData, setLectureData] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(()=>{
    const fetchData = async()=>{
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/classroom/attendance?classCode=${classCode}`, { headers });
            if (response.data.success) {
              // console.log(response.data.lectureData)
                setLectureData(response.data.lectureData);
                setIsTeacher(response.data.isTeacher);
            }
        } catch (error) {
            console.log('Error fetching attendance data:', error);
        }
    }
    fetchData();
},[])
  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedLecture(null);
    setIsModalOpen(false);
  };
  return (
    <div className="p-6 rounded-lg overflow-y-auto">
      {}
      <table className="w-full border-collapse border text-center border-[#5D6C6C] rounded-lg text-left text-sm text-[#394141]">
        <thead>
          <tr className="bg-[#D9DEDE]">
            <th className="p-6 border border-[#5D6C6C] font-medium">Lecture Title</th>
            <th className="p-6 border border-[#5D6C6C] font-medium">Date</th>
            <th className="p-6 border border-[#5D6C6C] font-medium">Time</th>
            <th className="p-6 border border-[#5D6C6C] font-medium">{!isTeacher?"Attendance":"Total Present"}</th>
          </tr>
        </thead>
        <tbody>
          {lectureData && lectureData.map((item, index) => (
            <tr
              key={index}
              onClick={() => handleLectureClick(item)}
              className={`cursor-pointer ${
                index % 2 === 0 ? "bg-white" : "bg-[#EEF0F0]"
              }`}
            >
              <td className="p-6">{item.title}</td>
              <td className="p-6">{item.date}</td>
              <td className="p-6">{item.time}</td>
              <td className="p-6">
                {!isTeacher?<span
                  className={`px-4 py-2 rounded-lg text-xs ${
                    item.attendance === "Present"
                      ? "bg-[#9DD89F]"
                      : "bg-[#F1B0B0]"
                  }`}
                >
                  {item.attendance}
                </span>:<span
                  className={`px-4 py-2 rounded-lg text-xs 
                  }`}
                >
                  {item.totalPresent}
                </span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {}
      {isModalOpen && selectedLecture && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white overflow-y-auto p-8 w-[70%] h-[70%]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{selectedLecture.title} Attendees</h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900 text-4xl "
              >
                &times;
              </button>
            </div>
            <div className="mt-4">
            <p className="text-right mt-4 text-gray-600">{selectedLecture.totalPresent} Students</p>
              <h3 className="text-lg ">Students</h3>
              <ul className="mt-2 ">
                {}
                {Array.from({ length: selectedLecture.totalPresent }).map((_, index) => (
                  <li key={index} className="flex items-center gap-4 py-2">
                    <img
                      src={profile}
                      alt={`Student ${index + 1}`}
                      className="w-10 h-10 rounded-full mt-2"
                    />
                    <span className="text-gray-800 ">{selectedLecture.presentStudents[index].name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AttendanceTable;