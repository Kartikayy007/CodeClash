import React from "react";
import card from "../assets/pana.svg";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const assignments = [
    {
        title: "Mid-Term Essay",
        status: "Due",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        dueDate: "Nov 7, 11:59 PM",
    },
    {
        title: "Mid-Term Essay",
        status: "Completed",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        dueDate: "Nov 7, 11:59 PM",
    },
];

const AssignmentSection = () => {
    const isEnrolled = useSelector((state) => state.toggleState.isEnrolled);
    return (
        <div className="bg-[#E1EAE8] p-6 rounded-lg">
            
            {isEnrolled?<></> : <button className='w-[170px] h-[35px] pr-[10px] pl-[10px] bg-[#066769] rounded-xl text-white  flex items-center mb-[30px]'>
            <Add className="mr-1" />Create  Assignment
            </button> }
           
            {assignments.map((assignment, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg  p-4 mb-4 flex items-start gap-4 border border-[#BCE2DF]"
                >
                    <div className="flex-1 ">
                        <h2 className="text-2xl f text-black">
                            {assignment.title}
                        </h2>
                        <div className="flex items-center gap-2 my-2">
                            <span
                                className={`px-2 py-1 text-sm rounded ${assignment.status === "Due"
                                        ? "bg-[#FFF3D4]"
                                        : "bg-[#E3F5E3]"
                                    }`}
                            >
                                {assignment.status}
                            </span>
                        </div>
                        <p className="text-gray-600 text-lg mt-[20px]">{assignment.description}</p>
                        <p className="text-gray-500 text-lg mt-[10px]">
                            <span className="font-medium">Due Date:</span> {assignment.dueDate}
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
            ))}
        </div>
    );
};

export default AssignmentSection;
