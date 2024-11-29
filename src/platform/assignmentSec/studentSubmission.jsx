import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SendIcon from '@mui/icons-material/Send';

const StudentSubmissions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const assignment = location.state?.assignment;

    console.log()
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


    const totalQuestions = questions.length;
    const completedQuestions = ((questions.filter((q) => q.answered).length / totalQuestions) * 100).toFixed(1); // Percentage with 1 decimal
    const notCompletedQuestions = (100 - parseFloat(completedQuestions)).toFixed(1); 



    const submissionData = [
        { name: "Completed", value: parseFloat(completedQuestions) }, 

        { name: "Not Completed", value: parseFloat(notCompletedQuestions) }, 

    ];

    const COLORS = ["#6366F1", "#F87171"]; 



    const handleReply = (id, reply) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === id ? { ...q, reply, answered: true } : q
            )
        );
    };

    const handleViewSubmissions = () => {
        navigate("/assignment-open");

    };

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`font-sans ${isMobile ? 'w-full mt-[15px]' : 'w-1/3'} mx-auto rounded-lg overflow-y-auto`}>

            <h2 className="text-2xl  text-gray-800 p-6 p-0 bg-white rounded-t-lg">
                Student Submissions
            </h2>



            <div className=" bg-white  justify-center items-center p-6 rounded-b-lg mb-5">
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
                                    label={({ value }) => `${value}%`} 

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







            <ChatBox assignmentId={assignment._id} />
        </div>
    );
};

export const ChatBox = ({ assignmentId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const chatContainerRef = useRef(null);
    const studentId = sessionStorage.getItem('userId');
    const [socket, setSocket] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [participants, setParticipants] = useState([]); 

    const [activeChatUserId, setActiveChatUserId] = useState(null); 

    const [isParticipantView, setIsParticipantView] = useState(true); 

    const token = sessionStorage.getItem("authToken") || localStorage.getItem('authToken');

    useEffect(() => {
        const socketConnection = io('http://13.127.67.116:5001', {
            query: { token: token },
            autoConnect: false,
        });

        socketConnection.on('connect', () => {
            console.log('Connected to socket server');
            socketConnection.emit('joinAssignmentChat', { studentId, assignmentId });

            setSocket(socketConnection);
        });

        socketConnection.on("AssignemntChats", (chats) => {

            console.log("Chats:", chats);
            const uniqueParticipants = chats.map((chat) => chat.participants);
            setParticipants(uniqueParticipants);
        });

        socketConnection.on("notTeacher", () => {

        });

        socketConnection.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        socketConnection.connect();

        socketConnection.on('chatHistory', (chatHistory) => {
            console.log('Chat History:', chatHistory);
            if (chatHistory.length > 0 && chatHistory[0].messages) {
                setMessages(chatHistory[0].messages);
            }
        });

        socketConnection.on("chatUpdate", (chat) => {
            console.log('Chat Update:', chat);
            setMessages((prevMessages) => [...prevMessages, chat]);
            scrollToBottom();
        });

        socketConnection.on('auth_error', (error) => {
            console.error('Authentication Error:', error);
        });

        socketConnection.on("error", (err) => {
            console.error("Error:", err);
        });

        return () => {
            socketConnection.disconnect();
        };
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size too large. Maximum size is 5MB.');
                return;
            }

            setFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendMessage = async () => {
        if (!socket || !socket.connected) {
            alert("Not connected to server!");
            return;
        }

        const fileData = file
            ? {
                buffer: Array.from(new Uint8Array(await file.arrayBuffer())),
                name: file.name,
                type: file.type,
                size: file.size,
            }
            : null;
        if (!message && !fileData) return;
        if (isAdmin) {
            socket.emit("assignmentChatMessage", {
                message,
                studentId: activeChatUserId,
                assignmentId,
                file: fileData,
            });
        } else {
            socket.emit("assignmentChatMessage", {
                message,
                studentId: studentId,
                assignmentId,
                file: fileData,
            });
        }

        setMessage('');
        setFile(null);
        setFilePreview(null);
    };

    const joinParticipantChat = (userId) => {
        if (socket) {
            if (isAdmin) {
                socket.emit("joinAssignmentChat", { studentId: userId, assignmentId });
            } else {
                socket.emit("joinAssignmentChat", { studentId, assignmentId });
            }
            setActiveChatUserId(userId);
            setIsParticipantView(false); 

        }
    };

    const goBackToParticipants = () => {
        setActiveChatUserId(null);
        setMessages([]); 

        setIsParticipantView(true);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    return (
        <div className="bg-white p-6 rounded-lg h-auto flex flex-col justify-start">
            {isAdmin && isParticipantView ? (
                <>
                    <h2 className="text-3xl text-gray-800">Select a student to chat with</h2>
                    <p className="text-xl text-gray-600 mt-2 mb-[20px]">
                        Choose a student from the list below
                    </p>

                    <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Participants
                        </h3>
                        <ul className="space-y-2">
                            {participants.map((participant, index) => (
                                <li
                                    key={index}
                                    onClick={() => joinParticipantChat(participant[0]._id)}
                                    className="p-3 cursor-pointer rounded-lg bg-gray-100 hover:bg-blue-100"
                                >
                                    {participant[0].name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <>
                    {isAdmin && (
                        <button 
                            onClick={goBackToParticipants}
                            className="mb-4 p-2 bg-gray-200 rounded-lg flex items-center"
                        >
                            <ArrowBackIosIcon/>Back to Participants
                        </button>
                    )}
                    
                    <h2 className="text-3xl text-gray-800">
                        {isAdmin 
                            ? `Chatting with ${participants.find(p => p[0]._id === activeChatUserId)?.[0].name || 'Student'}` 
                            : "Have any questions?"
                        }
                    </h2>
                    <p className="text-xl text-gray-600 mt-2 mb-[20px]">
                        {isAdmin ? "Discuss the assignment" : "Ask your teacher"}
                    </p>

                    <div
                        ref={chatContainerRef}
                        className="w-full rounded-lg p-4 mt-4 flex flex-col space-y-4 overflow-y-auto"
                        style={{ maxHeight: "200px" }}
                    >
                        {messages.map((chat, index) => {
                            const isSentByCurrentUser = chat.sender.id === (isAdmin ? activeChatUserId : studentId);
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isSentByCurrentUser ? "justify-start" : "justify-start"}`}
                                >
                                    <div
                                        className={`w-full p-4 rounded-lg shadow ${isSentByCurrentUser
                                            ? "bg-blue-500 text-white"
                                            : "bg-[#EEF0F0] text-gray-900"
                                            }`}
                                    >
                                        <div className="text-2xl font-medium">{chat.sender.name}</div>
                                        <div className="text-xl mt-2">{chat.message}</div>
                                        {chat.file && (
                                            <div className="mt-2">
                                                {chat.file.type.startsWith("image/") ? (
                                                    <img
                                                        src={chat.file.url}
                                                        alt={chat.file.name}
                                                        className="w-[100px] h-auto rounded-md"
                                                    />
                                                ) : (
                                                    <div>
                                                        <a
                                                            href={chat.file.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-200 underline"
                                                        >
                                                            {chat.file.name}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-400 mt-2 text-right">
                                            {new Date(chat.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex items-center rounded-lg p-[12px] bg-white">

                        <label
                            htmlFor="fileInput"
                            className="flex items-center justify-center w-[15%] h-[67.59px] bg-gray-200 rounded-lg cursor-pointer mr-2"
                        >
                            <input
                                id="fileInput"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <AttachFileIcon />
                        </label>


                        <input
                            type="text"
                            className="flex-grow px-4 py-2 border-none outline-none text-gray-700"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ margin: '0px', width: '55%' }}
                        />


                        <button
                            className="flex items-center justify-center w-[15%] h-[67.59px] bg-[#066769] rounded-lg text-white ml-2"
                            onClick={sendMessage}
                        >
                            <SendIcon />
                        </button>
                    </div>


                    {filePreview && (
                        <div className="mt-2 flex items-center px-[12px]">
                            <img
                                src={filePreview}
                                alt="File preview"
                                className="w-16 h-16 object-cover rounded-lg mr-2"
                            />
                            <button
                                className="text-red-500 text-xl hover:underline"
                                onClick={() => {
                                    setFile(null);
                                    setFilePreview(null);
                                    document.getElementById("fileInput").value = null;
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};



export default StudentSubmissions;
