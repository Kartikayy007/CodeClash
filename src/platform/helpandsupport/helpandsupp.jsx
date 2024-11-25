import React, { useState } from "react";
import { useSelector } from "react-redux";
import sademoj from "../assets/sademoj.svg";
import fairemoj from "../assets/fairemoj.svg";
import neutralemoj from "../assets/neutralemoj.svg";
import goodemoj from "../assets/goodemoj.svg";
import amazingemoj from "../assets/amazingemoj.svg";
import { FaSearch } from "react-icons/fa";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const FeedbackForm = () => {
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
          <div>
            <p className="text-xl text-black mb-5">How Was Your Experience?</p>
            <div className="flex justify-center">
              <div className="flex justify-center w-[60%] space-x-10 ">
                {["Poor", "Fair", "Neutral", "Good", "Amazing"].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setRating(option)}
                    className={`flex flex-col items-center justify-center border p-4 rounded-lg w-20 
                      ${
                        rating === option
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
              className="bg-[#066769] text-white py-4 px-8 rounded-lg"
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
  return (
    <div className="bg-white p-6 rounded-lg  h-full flex flex-col justify-end">
      <h2 className="text-2xl font-medium text-gray-800">Chat with Us</h2>
      <p className="text-xl text-gray-600 mt-2">
        Connect with our support team in real time.
      </p>
      <div className="bg-gray-200 w-[60%] rounded-lg p-4 mt-4 mb-auto">
        <p className="text-gray-700 text-xl">
          Hi there! How can we assist you today? Our team is here to help.
        </p>
      </div>
      <input
        type="text"
        placeholder="Type your question here."
        className=" border border-gray-200 rounded-lg px-4 py-2 w-full"
      />
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
                className={`transform transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <KeyboardArrowDownIcon/>
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
                className={`transform transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <KeyboardArrowDownIcon/>
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
  const sidebarWidth = useSelector((state) => state.sidebar.width);

  return (
    <div>
      <div
        className="bg-[#E1EAE8] p-6 mt-10"
        style={{ marginLeft: sidebarWidth, transition: "margin-left 0.3s ease" }}
      >
        <div className="bg-[#E1EAE8] p-4 flex items-center justify-between">
          <h1 className="text-4xl font-semi-bold w-[52%] leading-tight">
            How Can We Help You?
          </h1>

          <div className="relative w-[49%]">
            <FaSearch className="absolute left-3 bottom-[47%] ml-2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Type your question, e.g., 'How to create a class?'"
              className="border  border-gray-300 rounded-lg py-2 w-full px-4"
              style={{paddingLeft: "40px",border:"none",backgroundColor:"#EEF0F0"}}
            />
          </div>
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
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
