import React, { useState, useEffect } from "react";
import card from "../assets/pana.svg";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CreateAssignmentModal from "./createAssignModal";
import axios from "axios";

const AssignmentSection = () => {
    const location = useLocation();
    const classId = location.state?._id; // Using the existing location state for classId
    const navigate = useNavigate();

    const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
    const [assignments, setAssignments] = useState([]); // State for assignments
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

    // Open and close modal functions
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Fetch assignments from the existing API
    const fetchAssignments = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/assignment/get?classroomId=${classId}`,
                axiosConfig
            );
            setAssignments(response.data); // Set the assignments state with the fetched data
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    // Fetch assignments on component mount
    useEffect(() => {
        fetchAssignments();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Navigate to the assignment details page
    const handleAssignmentClick = (assignment) => {
        navigate("/assignment-details", { state: { assignment } });
    };

    return (
        <div>
            {/* Conditionally render the 'Create Assignment' button based on enrollment status */}
            {!isEnrolled ? (
                <div>
                    <button
                        className="bg-[#066769] text-white font-medium mb-4 py-4 px-8 rounded-lg ml-6"
                        onClick={openModal} // Open modal on button click
                    >
                        Create Assignment
                    </button>
                </div>
            ) : null}

            {/* Assignments list with scrollbar */}
            <div
                className="bg-[#E1EAE8] p-6 rounded-lg"
                style={{
                    maxHeight: "75vh", // Adjust the max height based on your design
                    overflowY: "auto", // Add vertical scrollbar
                }}
            >
                {assignments.length === 0 ? (
                    <p className="text-center text-gray-500">No assignments available.</p>
                ) : (
                    assignments.map((assignment, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-4 mb-4 flex items-start gap-4 border border-[#BCE2DF] cursor-pointer hover:shadow-md"
                            onClick={() => handleAssignmentClick(assignment)} // Navigate to details page
                        >
                            <div className="flex-1">
                                <h2 className="text-2xl text-black">{assignment.name}</h2>
                                <div className="flex items-center gap-2 my-2">
                                    <span
                                        className={`px-2 py-1 text-sm rounded ${
                                            assignment.status === "Due"
                                                ? "bg-[#FFF3D4]"
                                                : "bg-[#E3F5E3]"
                                        }`}
                                    >
                                        {assignment.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-lg mt-[20px]">
                                    {assignment.description}
                                </p>
                                <p className="text-gray-500 text-lg mt-[10px]">
                                    <span className="font-medium">Due Date:</span>{" "}
                                    {assignment.dueDate}
                                </p>
                            </div>
                            <div className="w-32 h-32 bg-cover bg-center rounded-lg my-auto">
                                <img
                                    src={card}
                                    alt="Assignment Illustration"
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <CreateAssignmentModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default AssignmentSection;
