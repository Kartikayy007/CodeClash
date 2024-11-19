import React from "react";
import cardimg from "../assets/bro.svg";

const grades = [
  {
    icon: cardimg,
    text: "You got A+ grade in Mid-term Essay!",
  },
  {
    icon: cardimg,
    text: "You got 80/100 in Algebra!",
  },
  {
    icon: cardimg,
    text: "You got 80/100 in Biomolecules!",
  },
];

const RecentGrades = () => {
  return (
    <div className="flex flex-col gap-5 h-full">
      <h2 className="text-xl w-[95%] mx-auto">Recent Grades</h2>
      <div className="bg-[#FAFAFA] border border-[#BCE2DF] p-4 rounded-md mx-auto w-[95%] h-[80%] overflow-y-auto">
        <div className="space-y-4">
          {grades.map((grade, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white rounded-md border border-[#D9DEDE] p-4  transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={grade.icon}
                  alt="Grade Icon"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-lg text-gray-700">
                  {grade.text}
                </span>
              </div>
              <div className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentGrades;
