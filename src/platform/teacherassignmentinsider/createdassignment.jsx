import React from "react";
import { useSelector } from 'react-redux';
import pdf from '../assets/pdf.svg';
import { Pie } from "react-chartjs-2";
import  { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

  
const Studentsubmissions=()=>{

  const data = {
    labels: [],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#A78BFA", "#FDA4AF"], 
        borderWidth: 1,
      },
    ],
  };
  return ( 
   <div className="bg-white p-6 rounded-lg shadow-lg mr-[5%] mx-auto">
      <h2 className="text-3xl font-semibold mb-4">Student Submissions</h2>
      <div className="flex justify-around"> 
         <div className="flex items-center mb-6 ">
        <div className="w-36 ml-[9%]">
          <Pie data={data} />
        </div>
      </div>
      <div className="flex  flex-col justify-center mt-4 text-xl ml-4">
        <div className="flex items-center mr-4 mb-[9px]">
          <span
            className="block w-3 h-3 rounded-full mr-2 "
            style={{ backgroundColor: "#A78BFA" }}
          ></span>
           75% Completed
        </div>
        <div className="flex items-center">
          <span
            className="block w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: "#FDA4AF" }}
          ></span>
          25% Not completed
        </div>
      </div>
      </div>
     
      <button className="mt-6 bg-teal-700 text-white py-2 px-4 rounded-lg hover:bg-teal-800 w-[90%]  block mx-auto" >
        View Submissions
      </button>
    </div>
   
  )
  


} 

const Assignmentdetails=()=>{
 
 return (

  <div className="">
  <div className="mb-9">
    <h1 className="text-4xl font-bold mb-5 pt-[30px] text-[#394141]">
      Mid-Term Essay
    </h1>
    <div>
      <p className="mb-4 text-xl">
        <span className="text-2xl font-medium">Status:</span> <span className="text-2xl">Due</span>
      </p>
      <p className="mb-4 text-xl">
        <span className="text-2xl font-medium">Due Date:</span >{" "}
        <span className="text-2xl">Nov 17, 11:59 PM</span>
      </p>
      <p className="mb-4 text-xl">
        <span className="text-2xl font-medium">Created On:</span>{" "}
        <span className="text-2xl">Nov 2, 3:04 PM</span>
      </p>
    </div>
  </div>
  <hr />
  <div className="mt-14 mb-10">
    <h2 className="text-3xl font-semibold mb-2">Description</h2>
    <p className="text-gray-700 mb-9 mt-[10px] text-2xl">
      Write a 900-word essay on the topic: "The Impact of Social Media on Modern
      Communication." Your essay should include at least three references and
      follow MLA formatting guidelines.
    </p>
    <ul className="text-gray-700 list-disc ml-5 pl-[10px]">
      <li className="text-2xl mb-3">Minimum Word Count: 900 words</li>
      <li className="text-2xl mb-3">Formatting Style: MLA</li>
      <li className="text-2xl mb-3">
        Include Introduction, Body (with subheadings), and Conclusion
      </li>
      <li className="text-2xl mb-3">Submit in the format of a Word document</li>
    </ul>
  </div>
  <div>
    <h2 className="text-3xl font-semibold mb-2">Attachment</h2>
    <ul className="pl-[5px] list-none p-0 pb-[25px]">
      <li className="flex items-center mb-3 text-2xl">
        <img src={pdf} alt="PDF icon" className="w-6 h-6 mr-3" />
        <a href="#" className=" text-blue-500 mr-3 text-2xl">
          MLA Formatting Guide
        </a>{" "}
        (PDF Download)
      </li>
      <li className="flex items-center text-2xl">
        <img src={pdf} alt="PDF icon" className="w-6 h-6 mr-3" />
        <a href="#" className=" text-blue-500 mr-3 text-2xl">
          Sample Essay
        </a>{" "}
        (PDF Download)
      </li>
    </ul>
  </div>
</div>

   


 );

}
const StudentQuestions = () => {
  const [activeTab, setActiveTab] = useState("All");

  const questions = [
    {
      id: 1,
      student: "John Doe",
      question: "Can we include personal anecdotes in the essay?",
      answer: null,
      time: "Mon, 7:00 PM",
    },
    {
      id: 2,
      student: "John Doe",
      question: "Can we include personal anecdotes in the essay?",
      answer: "Yes, you can include anecdotes, but ensure they are relevant.",
      time: "Mon, 7:00 PM",
    },
  ];

  const filteredQuestions =
    activeTab === "All"
      ? questions
      : activeTab === "Unanswered"
      ? questions.filter((q) => !q.answer)
      : questions.filter((q) => q.answer);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mr-[5%]">
      <h2 className="text-3xl font-semibold mb-2">Student Questions</h2>
      <p className="text-2xl text-gray-600 mb-7">
        View and respond to questions from your students for this assignment.
      </p>

      
      <div className="flex gap-4 mb-10">
        {["All", "Unanswered", "Answered"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-1 px-3 text-xl rounded-md ${
              activeTab === tab
                ? "bg-gray-200 font-semibold text-gray-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>


      <div className="space-y-6 ">
       {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <p className="font-semibold text-xl mb-2">{q.student}</p>
            <p className="text-xl mb-2">{q.question}</p>
            {q.answer && (
              <div className= " flex flex-col bg-gray-100 p-3 rounded-md text-xl mb-2">
                <p className="font-medium text-xl text-teal-700">You</p>
                <p className="text-xl">{q.answer}</p>
              </div>
            )}
            <div className="flex justify-between items-center text-xl text-gray-500">
              <button className="text-teal-600">↩ Reply</button>
              <p className="text-xl">{q.time}</p>
            </div>
          </div>
        ))}
        {filteredQuestions.length === 0 && (
          <p className="text-gray-500 text-sm">No questions to display.</p>
        )}
      </div>
    </div>
  );
};

const Assignmentcreated= () => {




  const sidebarWidth = useSelector((state) => state.sidebar.width); 


  return (
    <div  className="flex mt-[50px] bg-green-500">  
   
    <div className=" w-[65%]  mt-[15px] pl-[16px] h-[80vh] rounded-lg shadow-lg pr-[20px] bg-white" style={{marginLeft: sidebarWidth,transition: 'margin-left 0.3s ease' }}>
      <Assignmentdetails/></div>
  <div className="w-[33%] ml-[20px] h-[90vh] mt-[15px]">
       <div className=" h-[30vh] "><Studentsubmissions/></div>
  <div className=" h-[60vh] "><StudentQuestions/></div></div>

  </div>
  
  );
};

export default Assignmentcreated;
