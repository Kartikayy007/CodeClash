import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useSelector } from "react-redux";

const SummaryCard = ({ title, value, bgColor }) => (
  <div className={`flex flex-col items-center justify-center w-1/4 p-4 rounded-lg ${bgColor}`}>
    <h2 className="text-3xl font-bold">{value}</h2>
    <p className="text-lg text-gray-700">{title}</p>
  </div>
);

const AssignOpenComp = () => {
  const [editingGradeIndex, setEditingGradeIndex] = useState(null);
  const [currentGrade, setCurrentGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const location = useLocation();
  const assignment = location.state?.assignment;
  const createdClasses = useSelector((state) => state.createdClasses.createdClasses);
  const currentClass = createdClasses.find((cls) => cls._id === assignment?.classroom);
  const totalStudents = currentClass ? currentClass.noOfStudents : 0;
  const totalSubmissions = assignment?.submissions.length;
  const submissions = assignment?.submissions || [];
  useEffect(()=>{
    if(!assignment){
      navigate("/dashboard");
    }
  })
  const handleEditClick = (index, grade) => {
    setEditingGradeIndex(index);
    setCurrentGrade(grade === "Not Graded" ? "" : grade);
  };

  const handleGradeChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value >= 0 && value <= 10)) {
      setCurrentGrade(value);
    }
  };

  const handleGradeSave = async (index, submission) => {
    if (currentGrade.trim() === "" || isNaN(currentGrade) || currentGrade < 0 || currentGrade > 10) {
      return;
    }
    try {
      setLoading(true);
      const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/submission/grade`, {
        submissionId: submission._id,
        marks: currentGrade
      }, { headers });
      console.log("Grade updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating grade:", error);
    } finally {
      setLoading(false);
    }
    submissions[index].marks = currentGrade;
    submissions[index].isGraded = true;
    setEditingGradeIndex(null);
  };

  const handleKeyPress = (e, index, submission) => {
    if (e.key === "Enter") {
      handleGradeSave(index, submission);
    }
  };

  const getFileName = (url) => {
    try {
      return new URL(url).pathname.split('/').pop();
    } catch (error) {
      return url;
    }
  };

  return (
    <div className="p-8 mt-[50px] bg-[#E1EAE8] min-h-screen">
      <h1 className="text-2xl mb-8">{assignment?.name} Submissions</h1>

      <div className="flex justify-between mb-8 text-center">
        <SummaryCard title="Total Students" value={totalStudents} bgColor="bg-[#FFF3D4]" />
        <SummaryCard title="Student Completed" value={totalSubmissions} bgColor="bg-[#C8EAC9]" />
        <SummaryCard title="Not Completed" value={totalStudents - totalSubmissions} bgColor="bg-[#F8D0D0]" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#D9DEDE]">
              <th className="border border-gray-300 px-4 py-2 text-center h-[50px] text-xl font-medium">Student</th>
              <th className="border border-gray-300 px-4 py-2 text-center h-[50px] text-xl font-medium">Submission Time</th>
              <th className="border border-gray-300 px-4 py-2 text-center h-[50px] text-xl font-medium">Attachments</th>
              <th className="border border-gray-300 px-4 py-2 text-center h-[50px] text-xl font-medium">Grade</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={submission._id} className="even:bg-[#EEF0F0] odd:bg-[#FAFAFA] h-[50px]">
                <td className="border border-gray-300 px-4 py-2 text-center">{submission.student.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{submission.createdAt || "Nov 2"}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {submission.media.map((file, fileIndex) => (
                    <div key={fileIndex} className="flex items-center justify-center mb-2">
                      {file.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img
                          src={file}
                          alt={`Attachment ${fileIndex + 1}`}
                          className="w-10 h-10 object-cover cursor-zoom-in transition-transform hover:scale-105"
                          onClick={() => window.open(file, '_blank')}
                        />
                      ) : (
                        <a
                          href={file}
                          download
                          className="flex items-center p-2 rounded-lg transition-colors"
                        >
                          <AttachFileIcon className="mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                            {getFileName(file)}
                          </span>
                        </a>
                      )}
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center relative">
                  {editingGradeIndex === index ? (
                    <input
                      type="number"
                      min="0"
                      max="10"
                      style={{ margin: "0", border: "none", padding: "0", background: "none", width: "40px" }}
                      value={currentGrade}
                      onChange={handleGradeChange}
                      onKeyDown={(e) => handleKeyPress(e, index, submission)}
                      onBlur={() => handleGradeSave(index, submission)}
                      className="w-full text-center"
                      autoFocus
                      disabled={loading}
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>{submission.isGraded ? submission.marks : "Not Graded"}</span>
                      <EditIcon
                        className={`ml-2 text-gray-500 cursor-pointer hover:text-gray-700 ${loading ? 'cursor-not-allowed' : ''}`}
                        onClick={() => !loading && handleEditClick(index, submission.isGraded ? submission.marks : "Not Graded")}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignOpenComp;
