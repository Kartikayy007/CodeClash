import React, { useState, useEffect } from "react";
import card from "../assets/assignCard2.svg";
import { useSelector } from "react-redux";

import { useNavigate, useLocation } from "react-router-dom";
import CreateAssignmentModal from "./createAssignModal";
import axios from "axios";
import image from "../assets/noAssignments.svg";

const AssignmentSection = () => {
    const location = useLocation();
    const classId = location.state?._id;
    const className = location.state?.name;
    const classCode = location.state?.code;

    const navigate = useNavigate();

    const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
    const [assignments, setAssignments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldRefetch, setShouldRefetch] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setShouldRefetch(true); 
    };

    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchAssignments = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/assignment/get?classroomId=${classId}`,
                axiosConfig
            );
            console.log(response)
            setAssignments(response.data.assignments);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
       
    };

    useEffect(() => {
        if (shouldRefetch) {
            fetchAssignments();
            setShouldRefetch(false);
        }
    }, [shouldRefetch]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleAssignmentClick = (assignment) => {
        navigate("/assignment-details", { state: { assignment,code:classCode } });
    };

    return (
        <div>
            {!isEnrolled ? (
                <div>
                    <button
                        className="bg-[#066769] text-white font-medium mb-4 py-4 px-8 rounded-lg ml-6"
                        onClick={openModal}
                    >
                        Create Assignment
                    </button>
                </div>
            ) : null}

            <div
                className="bg-[#E1EAE8] p-6 rounded-lg"
                style={{
                    maxHeight: "75vh",
                    overflowY: "auto",
                }}
            >
                {assignments.length === 0 ? (
                    
                    
                <div className="flex flex-col items-center justify-center h-[70vh]">
                    <img src={image} alt="" />
                    <p className="text-center text-gray-500 mt-5 text-xl font-semibold">No assignments available.</p>
                    <p className="text-gray-500">You don’t have any assignments to work on right now.</p></div>
                ) : (
                    assignments.map((assignment, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-4 mb-4 flex items-start gap-4 border border-[#BCE2DF] cursor-pointer hover:shadow-md"
                            onClick={() => handleAssignmentClick(assignment)}
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
            <CreateAssignmentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                className={className}
                classCode={classCode}
            />
        </div>
    );
};

export default AssignmentSection;
