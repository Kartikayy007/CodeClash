import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import { useSelector } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";
import card from "../assets/addWork.svg";
import StudentSubmissions from "./studentSubmission";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CreateAssignmentModal from "./createAssignModal";
import { ChatBox } from "./studentSubmission";
import { motion, AnimatePresence } from "framer-motion";
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate } from "react-router-dom";

const AssignmentDetails = () => {
    const sidebarWidth = useSelector((state) => state.sidebar.width);
    const location = useLocation();
    const assignment = location.state?.assignment;
    const assignmentId = assignment?._id;
    const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const classCode = location.state?.classCode;
    const className = location.state?.className;
    console.log(classCode)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    
    useEffect(() => {
        if (!assignment) {
            navigate('/dashboard');
        }
        
      }, [classCode]);

    const dueDate = new Date(assignment?.dueDate);
    const currentDate = new Date();
    const status = dueDate < currentDate ? "Completed" : "Due";

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles((prev) => [...prev, ...files]);
    };

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
            formData.append("assignmentId", assignment?._id);
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
            setUploadedFiles([]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("File upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = () => {
        setEditModalOpen(true);
        setMenuOpen(false); 
    };

    const handleDelete = () => {
        setDeleteModalOpen(true); 
        setMenuOpen(false); 
    };

    const confirmDelete = async () => {
        try {
            const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/assignment/delete?id=${assignment._id}&code=${classCode}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log(response)
            alert("Assignment deleted successfully!");
            setDeleteModalOpen(false);
            navigate("/classes")
        } catch (error) {
            console.error("Error deleting assignment:", error);
            alert("Failed to delete assignment.");
        }
    };

    const handleAddWorkClick = () => {
        setIsModalOpen(true);
        setIsBottomSheetOpen(false); 
    };

    const BottomSheet = () => (
        <AnimatePresence>
            {isBottomSheetOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsBottomSheetOpen(false)}
                    />
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-40 p-6"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                        <div className="rounded-lg p-4 bg-white flex flex-col items-center">
                            <h3 className="text-xl text-gray-800 self-start h-[10%]">Your Work</h3>
                            <img src={card} alt="" className="w-[70%] h-[60%]" />
                            <button
                                onClick={handleAddWorkClick}
                                className="px-8 py-3 rounded-lg bg-[#066769] text-white mt-[30px]"
                            >
                                + Add your work
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <div className="">
            <Header />
            <Sidebar />
            <div className="bg-[#E1EAE8] min-h-screen flex p-8 pb-[70px]">
                <div
                    className={`mt-[50px] rounded-lg transition-all duration-300 w-full `}
                    style={{ 
                        marginLeft: isMobile ? '0' : sidebarWidth,
                    }}
                >
                    <div className={`${isMobile ? 'flex-col' : 'flex'} gap-8 h-full`}>
                        <div className={`${isMobile?'w-full  h-auto min-h-[400px]':'w-2/3 h-[100%]'}  bg-white rounded-lg relative`}>
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                                >
                                    <MoreHorizIcon />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg">
                                        <button
                                            onClick={handleEdit}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded-lg"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 rounded-lg mb-6">
                                <h1 className="text-3xl font-bold text-[#394141] mb-4">{assignment?.name}</h1>
                                <div className="flex flex-col gap-4 text-sm text-[#394141]">
                                    <p>
                                        <span className="font-medium">Status: </span>
                                        <span
                                            
                                        >
                                            {status}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium">Due Date: </span>
                                        {assignment?.dueDate}
                                    </p>
                                    <p>
                                        <span className="font-medium">Created On: </span>
                                        {assignment?.createdAt}
                                    </p>
                                    <hr />
                                </div>
                            </div>
                            <div className="p-4 rounded-lg">
                                <h2 className="text-xl font-medium text-[#394141]">Description</h2>
                                <p className="text-[#394141] mt-3 text-xl">{assignment?.description}</p>
                            </div>
                            {assignment?.media && assignment?.media.length > 0 && (
                                <div className="p-4 rounded-lg">
                                    <h2 className="text-xl font-medium text-[#394141]">Attachments</h2>
                                    <div className="mt-4 grid grid-cols-auto md:grid-cols-auto gap-4">
                                        {assignment.media.map((media, mediaIndex) => (
                                            <div key={mediaIndex} className="relative group h-auto w-auto">
                                                {media && media.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                                    <div className="aspect-square overflow-hidden rounded-lg">
                                                        <img 
                                                            src={media} 
                                                            alt={media.originalName || `Image ${mediaIndex + 1}`}
                                                            className="w-20 h-20 object-cover cursor-zoom-in transition-transform group-hover:scale-105"
                                                            onClick={() => window.open(media.url, '_blank')}
                                                        />
                                                    </div>
                                                ) : (
                                                    <a
                                                        href={media}
                                                        download
                                                        onClick={(e) => {
                                                            if (!media) {
                                                                e.preventDefault();
                                                                alert("File URL is missing or invalid.");
                                                            }
                                                        }}
                                                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <AttachFileIcon className="mr-3 text-gray-500" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                                                {media.originalName || `File ${mediaIndex + 1}`}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Click to download
                                                            </span>
                                                        </div>
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {isEnrolled ? (
                            <div className={`${isMobile?'w-full mt-5 ':'w-1/3 '}flex flex-col gap-6 overflow-y-auto`}>
                                <div className={`rounded-lg p-4 h-[40%] bg-white flex flex-col items-center ${isMobile?'hidden':''}`}>
                                    <h3 className="text-xl text-gray-800 self-start h-[10%]">Your Work</h3>
                                    <img src={card} alt="" className="w-[70%] h-[60%]" />
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-8 py-3 rounded-lg bg-[#066769] text-white mt-[30px]"
                                    >
                                        + Add your work
                                    </button>
                                </div>
                                <div className="rounded-lg p-4 h-full bg-white flex flex-col justify-around">
                                    <ChatBox assignmentId={assignmentId}/>
                                </div>
                            </div>
                        ) : (
                            <StudentSubmissions />
                        )}
                    </div>
                </div>
            </div>
            {isMobile && isEnrolled && (
                <>
                    <button
                        onClick={() => setIsBottomSheetOpen(true)}
                        className="fixed  flex-col bottom-0 right-0 w-full h-[50px] bg-[#FAFAFA] rounded-t-xl flex items-center justify-center shadow-black shadow-2xl z-20"
                    >
                       <HorizontalRuleIcon fontSize="large"/>
                        <p>Your Work</p>
                    </button>
                    <BottomSheet />
                </>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-white rounded-lg p-8 w-1/3 min-w-[250px]">
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
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-white rounded-lg p-8 w-1/3">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this assignment?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editModalOpen && (
                <CreateAssignmentModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    assignment={assignment}
                    className={className}
                    classCode={classCode}
                    isEditing={true} 
                />
            )}
        </div>
    );
};

export default AssignmentDetails;