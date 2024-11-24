import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useSelector } from "react-redux";
import card from "../assets/addWork.svg";
import StudentSubmissions from "./studentSubmission";



const AssignmentDetails = () => {
    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const location = useLocation();
    const assignment = location.state?.assignment;
    const isEnrolled = useSelector((state) => state.toggleState.isEnrolled); // get toggle state from Redux


    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [uploadedFiles, setUploadedFiles] = useState([]); // State to store uploaded files
    const [uploading, setUploading] = useState(false); // State to manage upload status

    if (!assignment) {
        return <p>No assignment details available.</p>;
    }

    // Function to handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles((prev) => [...prev, ...files]);
    };

    // Function to handle file upload submission
    const handleFileSubmit = async () => {
        if (!uploadedFiles.length) {
            alert("Please upload at least one file.");
            return;
        }

        try {
            setUploading(true);
            const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

            const formData = new FormData();
            uploadedFiles.forEach((file) => {
                formData.append("media", file);
            });
            formData.append("assignmentId", assignment._id);

            await axios.post(
                `${process.env.REACT_APP_API_URL}/submission/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            alert("Files submitted successfully!");
            setUploadedFiles([]); // Clear uploaded files after submission
            setIsModalOpen(false); // Close modal
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("File upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Header />
            <Sidebar />
            <div className="bg-[#E1EAE8] min-h-screen flex p-8">
                <div
                    className="mt-[50px] rounded-lg transition-all duration-300 w-full"
                    style={{ marginLeft: sidebarWidth }}
                >
                    {/* Two-Column Layout */}
                    <div className="flex gap-8 h-[90%] ">
                        {/* Left Section */}
                        <div className="w-2/3 h-[100%] bg-white rounded-lg">
                            <div className="p-4 rounded-lg mb-6">
                                <h1 className="text-3xl font-bold text-[#394141] mb-4">{assignment.name}</h1>
                                <div className="flex flex-col gap-4 text-sm text-[#394141]">
                                    <p>
                                        <span className="font-medium">Status: </span>
                                        <span
                                            className={`${assignment.status === "Due" ? "text-red-600" : "text-green-600"
                                                }`}
                                        >
                                            {assignment.status}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium">Due Date: </span>
                                        {assignment.dueDate}
                                    </p>
                                    <p>
                                        <span className="font-medium">Created On: </span>
                                        {assignment.createdOn}
                                    </p>
                                    <hr />
                                </div>
                            </div>
                            <div className="p-4 rounded-lg">
                                <h2 className="text-xl font-medium text-[#394141]">Description</h2>
                                <p className="text-[#394141] mt-3 text-xl">{assignment.description}</p>
                                <ul className="list-disc list-inside mt-6 text-[#394141]">
                                    <li>
                                        <span className="font-medium">Minimum Word Count: </span>
                                        {assignment.minWordCount}
                                    </li>
                                    <li>
                                        <span className="font-medium">Formatting: </span>
                                        {assignment.formatting}
                                    </li>
                                    <li>
                                        <span className="font-medium">Include: </span>
                                        {assignment.include}
                                    </li>
                                    <li>
                                        <span className="font-medium">Submission File Format: </span>
                                        {assignment.fileFormat}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {isEnrolled?<div className="w-1/3 flex flex-col gap-6 overflow-y-auto">
                            {/* Your Work */}
                            <div className="rounded-lg p-4 h-[40%] bg-white flex flex-col items-center">
                                <h3 className="text-xl text-gray-800 self-start h-[10%]">Your Work</h3>
                                <img src={card} alt="" className="w-[70%] h-[60%]" />
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className=" px-8 py-3 rounded-lg bg-[#066769] text-white mt-[30px]"
                                >
                                    + Add your work
                                </button>
                            </div>
                            <div className=" rounded-lg p-4 h-[30%] bg-white flex flex-col justify-around">
                                <div>
                                <h3 className="text-2xl font-medium text-[#4C5858]">Have any questions?</h3>
                                <h4 className="text-xl  text-[#4C5858]">Ask your teacher</h4>
                                </div>
                                <textarea
                                    placeholder="Ask questions"
                                    className="w-full border rounded-lg p-2 mt-4 resize-none"
                                ></textarea>
                               
                            </div>

                            
                        </div>:<StudentSubmissions />}
                        
                    </div>
                </div>
            </div>

            {/* File Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-white rounded-lg p-8 w-1/3">
                        <h2 className="text-xl font-bold mb-4">Upload Your Work</h2>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className="mb-4 w-full border p-2 rounded-lg"
                        />
                        <ul className="mb-4">
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className="text-gray-700">
                                    {file.name}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFileSubmit}
                                disabled={uploading}
                                className={`px-4 py-2 rounded-lg ${uploading
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {uploading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentDetails;
