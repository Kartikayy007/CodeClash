import React from "react";
import card from "../assets/pana.svg";

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
    return (
        <div className="bg-[#E1EAE8] p-6 rounded-lg">
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
