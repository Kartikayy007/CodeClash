import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import sademoj from "../assets/sademoj.svg";
import fairemoj from "../assets/fairemoj.svg";
import neutralemoj from "../assets/neutralemoj.svg";
import goodemoj from "../assets/goodemoj.svg";
import amazingemoj from "../assets/amazingemoj.svg";
import { FaSearch } from "react-icons/fa";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import io from 'socket.io-client';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
const FeedbackForm = ({isMobile}) => {
  const [rating, setRating] = useState("");
  const [like, setLike] = useState("");
  const [improve, setImprove] = useState("");

  const handleReset = () => {
    setRating("");
    setLike("");
    setImprove("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackData = { rating, like, improve };
    console.log("Feedback Submitted:", feedbackData);
    alert("Thank you for your feedback!");
    handleReset();
  };

  return (
    <div className="bg-[#E1EAE8] items-center justify-center mt-6 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Share Your Feedback
      </h2>
      <p className="text-xl text-gray-600 mb-6">
        We’re always looking to improve Classence. Let us know your thoughts.
      </p>
      <div className="bg-white p-6 rounded-lg  w-full ">
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xl text-black mb-5">How Was Your Experience?</p>
          <div className="">
            <div className={`flex ${isMobile?'justify-start':'justify-center'} overflow-x-auto`}>
              <div className="flex justify-start w-[60%] space-x-10 ">
                {["Amazing", "Good", "Neutral", "Fair", "Poor"].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setRating(option)}
                    className={`flex flex-col min-w-[70px] items-center justify-center border p-4 rounded-lg 
                      ${rating === option
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-[#EEF0F0] border-gray-300 text-black"
                      }`}
                  >
                    <span>
                      {option === "Poor" ? (
                        <img src={sademoj} alt="" />
                      ) : option === "Fair" ? (
                        <img src={fairemoj} alt="" />
                      ) : option === "Neutral" ? (
                        <img src={neutralemoj} alt="" />
                      ) : option === "Good" ? (
                        <img src={goodemoj} alt="" />
                      ) : (
                        <img src={amazingemoj} alt="" />
                      )}
                    </span>
                    <span className="text-sm mt-2">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <input
              type="text"
              id="like"
              value={like}
              onChange={(e) => setLike(e.target.value)}
              placeholder="What Did You Like About Classence?"
              className="w-full border border-gray-300 p-3 rounded-lg  mt-[30px] mb-[30px]"
            />
          </div>
          <div>
            <input
              type="text"
              id="improve"
              value={improve}
              onChange={(e) => setImprove(e.target.value)}
              placeholder="What Can We Improve?"
              className="w-full border border-gray-300 p-3 rounded-lg  mb-[30px]"
            />
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-[#066769] text-white py-4 px-8 rounded-lg whitespace-nowrap overflow-x-auto"
            >
              Submit Feedback
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-white text-[#066769] border border-[#066769] py-4 px-10 rounded-lg ml-[30px]"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const chatContainerRef = useRef(null);
  const studentId = sessionStorage.getItem('userId');
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = useState('');
  const [socket, setSocket] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [activeChatUserId, setActiveChatUserId] = useState(null);
  const token = sessionStorage.getItem("authToken") || localStorage.getItem('authToken');

  useEffect(() => {
    const socketConnection = io('https://singhanish.me', {
      query: { token: token },
      autoConnect: false,
    });

    socketConnection.on('connect', () => {
      console.log('Connected to socket server');
      socketConnection.emit("getDevChats");
      setSocket(socketConnection);
    });

    socketConnection.on("devChats", (chats) => {
      setIsAdmin(true);
      const uniqueParticipants = chats.map((chat) => chat.participants);
      setParticipants(uniqueParticipants);
      console.log("Participants:", uniqueParticipants);
    });

    socketConnection.on("notAdmin", () => {
      socketConnection.emit('joinDeveloperChat', { userId: studentId });
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

    const trimmedMessage = message.trim();
    if (!trimmedMessage && !file) return;

    const fileData = file
      ? {
          buffer: Array.from(new Uint8Array(await file.arrayBuffer())),
          name: file.name,
          type: file.type,
          size: file.size,
        }
      : null;

    if (isAdmin) {
      socket.emit("developerChatMessage", {
        message: trimmedMessage,
        userId: activeChatUserId,
        file: fileData,
      });
    } else {
      socket.emit("developerChatMessage", {
        message: trimmedMessage,
        userId: studentId,
        file: fileData,
      });
    }

    setMessage('');
    setFile(null);
    setFilePreview(null);
  };

  const joinParticipantChat = (userId) => {
    if (socket) {
      socket.emit("joinDeveloperChat", { userId });
      setActiveChatUserId(userId);
    }
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageClick = (imageSrc) => {
    setIsImageEnlarged(true);
    setEnlargedImageSrc(imageSrc);
  };

  const handleCloseImage = () => {
    setIsImageEnlarged(false);
    setEnlargedImageSrc('');
  };

  return (
    <div className="bg-white m-6 p-4 rounded-lg h-full flex flex-col justify-between">
      <div>
      <h2 className="text-3xl text-gray-800 pt-5">Chat with us</h2>
      <p className="text-xl text-gray-600 mt-2 mb-[20px]">
        {isAdmin ? "Select a participant to chat with." : "Connect with our support team in real-time."}
      </p>
      </div>
      {isAdmin && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Participants
          </h3>
          <ul className="space-y-2">
            {participants.map((participant, index) => (
              <li
                key={index}
                onClick={() => joinParticipantChat(participant[0]._id)}
                className={`p-3 cursor-pointer rounded-lg ${activeChatUserId === participant[0]._id ? "bg-blue-100" : "bg-gray-100"
                  }`}
              >
                {participant[0].name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="w-full rounded-lg p-4 mt-4 flex flex-col space-y-4 overflow-y-auto"
        style={{ maxHeight: "200px" }}
      >
        {messages.map((chat, index) => {
          const isSentByCurrentUser = chat.sender.id === studentId;
          return (
            <div
              key={index}
              className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
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
                        className="w-[100px] h-auto rounded-md cursor-pointer"
                        onClick={() => handleImageClick(chat.file.url)}
                      />
                    ) : (
                      <div>
                        <a
                          href={chat.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#066769] font-semibold text-lg hover:underline"
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
          className="flex items-center justify-center w-[17.5%] h-[67.59px] bg-gray-200 rounded-lg cursor-pointer mr-2"
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
          className="flex-grow px-4 py-2 border-none outline-none text-gray-700 w-[65%]"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ margin: '0px', width: '0' }}
          onKeyDown={handleKeyPress}
        />

        <button
          className="flex items-center justify-center w-[17.5%] h-[67.59px] bg-[#066769] rounded-lg text-white ml-2"
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

      {isImageEnlarged && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={handleCloseImage}
        >
          <img
            src={enlargedImageSrc}
            alt="Enlarged Image"
            className="max-w-[90%] max-h-[90%] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};


const GuidesSection = () => {
  const guides = [
    {
      title: "Setting up your profile",
      content: "Guide for setting up your profile",
    },
    {
      title: "Understanding the dashboard",
      content:
        "Explore the features of the dashboard to navigate through your courses and activities.",
    },
    {
      title: "Managing Assignments",
      content:
        "Discover how to upload, manage, and track your assignments effectively.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleGuide = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#E1EAE8] p-6  w-full">
      <h2 className="text-2xl font-medium">Explore Step-by-Step Guides</h2>
      <div className="mt-4 space-y-4">
        {guides.map((guide, index) => (
          <div
            key={index}
            className="bg-white rounded-lg  border border-gray-200"
          >
            <button
              onClick={() => toggleGuide(index)}
              className="w-full text-left px-7 py-8 flex justify-between items-center text-black"
            >
              <span>{guide.title}</span>
              <span
                className={`transform transition-transform ${openIndex === index ? "rotate-180" : ""
                  }`}
              >
                <KeyboardArrowDownIcon />
              </span>
            </button>
            {openIndex === index && (
              <div className="px-4 py-2 text-gray-600 border-t border-gray-200">
                {guide.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How to join a class?",
      answer:
        "Click on the ‘+’ floating button and select join class then enter the class code to join the class.",
    },
    {
      question: "How do I reset my password?",
      answer: "Go to Settings > Account > Reset Password and follow the steps.",
    },
    {
      question: "What should I do if I can’t see my class?",
      answer: "Check if you're enrolled or contact support for assistance.",
    },
    {
      question: "How to schedule a class?",
      answer: "Use the 'Schedule' option in the dashboard to set up a class.",
    },
    {
      question: "How to join a lecture?",
      answer: "Click on the 'Join Lecture' button in the class details page.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#E1EAE8] p-6 pb-0  w-full ">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Frequently Asked Questions</h2>
        <a href="#" className="text-[#066769] text-xl">
          View All &gt;
        </a>
      </div>
      <div className="mt-6 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-3"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-4 py-5 flex justify-between items-center text-black"
            >
              <span>{faq.question}</span>
              <span
                className={`transform transition-transform ${openIndex === index ? "rotate-180" : ""
                  }`}
              >
                <KeyboardArrowDownIcon />
              </span>
            </button>
            {openIndex === index && (
              <div className="px-4 py-2 text-gray-600 border-t border-gray-200">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HelpPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const sidebarWidth = useSelector((state) => state.sidebar.width);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div
        className="bg-[#E1EAE8] p-6 mt-10"
        style={{ 
          marginLeft: isMobile ? '0' : sidebarWidth,
          transition: 'margin-left 0.3s ease' 
        }}
      >
        <div className="bg-[#E1EAE8] p-4 flex items-center justify-between">
          <h1 className="text-4xl font-semi-bold w-[52%] leading-tight">
            How Can We Help You?
          </h1>

          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5 mb-6">
          <FAQSection />


          <div >
            <ChatBox />
          </div>
        </div>

        <div className="mt-8">
          <GuidesSection />
        </div>


        <div className="mt-8">
          <FeedbackForm isMobile={isMobile}/>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
