import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const StudentSubmissions = () => {
    const navigate =useNavigate();
    const [questions, setQuestions] = useState([
        {
            id: 1,
            name: "John Doe",
            question: "Can we include personal anecdotes in the essay?",
            answered: false,
            reply: "",
            timestamp: "Mon, 7:00 PM",
        },
        {
            id: 2,
            name: "Jane Smith",
            question: "What is the word limit for the essay?",
            answered: true,
            reply: "The word limit is 1000 words.",
            timestamp: "Mon, 7:30 PM",
        },
        {
            id: 3,
            name: "Jane Smith",
            question: "What is the word limit for the essay?",
            answered: false,
            reply: "The word limit is 1000 words.",
            timestamp: "Mon, 7:30 PM",
        },
    ]);

    // Calculate stats
    const totalQuestions = questions.length;
    const completedQuestions = ((questions.filter((q) => q.answered).length / totalQuestions) * 100).toFixed(1); // Percentage with 1 decimal
    const notCompletedQuestions = (100 - parseFloat(completedQuestions)).toFixed(1); // Subtract from 100 and keep only 1 decimal

    // Use percentages in pie chart data
    const submissionData = [
        { name: "Completed", value: parseFloat(completedQuestions) }, // Convert string back to float
        { name: "Not Completed", value: parseFloat(notCompletedQuestions) }, // Convert string back to float
    ];

    const COLORS = ["#6366F1", "#F87171"]; // Tailwind Indigo and Red

    // Handle reply submission
    const handleReply = (id, reply) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id ? { ...q, reply, answered: true } : q
            )
        );
    };

    const handleViewSubmissions = () => {
        navigate("/assignment-open"); // Pass assignment details as state
    };
    return (
        <div className="font-sans w-1/3 max-w-lg mx-auto rounded-lg overflow-y-auto  ">
            {/* Header */}
            <h2 className="text-2xl  text-gray-800 p-6 bg-white rounded-t-lg">
                Student Submissions
            </h2>

            {/* Chart Section */}

            <div className=" bg-white  justify-center items-center p-6 rounded-b-lg">
            <div className="flex">
                <div className="w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={submissionData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                fill="#8884d8"
                                label={({ value }) => `${value}%`} // Format as percentage
                            >
                                {submissionData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="ml-4 text-sm mt-4 md:mt-0 flex flex-col justify-center">
                    {submissionData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center mb-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: COLORS[index % COLORS.length],
                                }}
                            ></span>
                            <span className="ml-2 text-gray-700">
                                {entry.value}% {entry.name}
                            </span>
                        </div>
                    ))}
                    </div>
                  
                </div>
                <div>
                <button className="mt-4 w-full bg-[#066769] text-white px-6 py-3 rounded-md hover:bg-teal-700 transition" onClick={handleViewSubmissions}>
                View Submissions
            </button>
                </div>
              
               
            </div>
       
            {/* Button */}
            

            <h3 className="text-2xl mt-6 bg-white p-6 rounded-t-lg">Student Questions</h3>
            <p className="text-gray-600 text-xl p-6 pb-4 bg-white">
                View and respond to questions from your students for this assignment.
            </p>

            <div className="space-y-6 bg-white p-6">
                {/* Unanswered Questions */}
                <div>
                    <h4 className="text-xl font-medium pb-4">Unanswered Questions</h4>
                    {questions
                        .filter((q) => !q.answered)
                        .map((q) => (
                            <div
                                key={q.id}
                                className="border rounded-lg p-4 bg-gray-50 shadow-sm mb-4"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <strong className="block text-lg">{q.name}</strong>
                                        <p className="text-gray-700">{q.question}</p>
                                    </div>
                                    <small className="text-gray-500">{q.timestamp}</small>
                                </div>
                                <button
                                    onClick={() => handleReply(q.id, "Sample reply text")}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                                >
                                    Reply
                                </button>
                            </div>
                        ))}
                </div>

                {/* Answered Questions */}
                <div>
                    <h4 className="text-xl pb-4 font-medium">Answered Questions</h4>
                    {questions
                        .filter((q) => q.answered)
                        .map((q) => (
                            <div
                                key={q.id}
                                className="border rounded-lg p-4 bg-gray-50 shadow-sm mb-4"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <strong className="block text-lg">{q.name}</strong>
                                        <p className="text-gray-700">{q.question}</p>
                                    </div>
                                    <small className="text-gray-500">{q.timestamp}</small>
                                </div>
                                <p className="mt-4 bg-gray-100 p-3 rounded-md text-gray-700">
                                    <strong>You:</strong> {q.reply}
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default StudentSubmissions;
