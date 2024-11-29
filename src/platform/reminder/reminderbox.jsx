import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import book from '../assets/book.svg';

const classes = [
  {
    id: 1,
    title: "Differentiation-I",
    language: "English",
    classTime: "9:00am",
  },
  {
    id: 2,
    title: "Biology Basics",
    language: "English",
    classTime: "1:00am",
  },
  {
    id: 3,
    title: "Solid State Physics",
    language: "English",
    classTime: "1:00pm",
  },
  {
    id: 4,
    title: "Linear Algebra",
    language: "English",
    classTime: "3:00pm",
  },
  {
    id: 5,
    title: "Organic Chemistry",
    language: "English",
    classTime: "5:00pm",
  },
];

const Reminderbox = () => {
  const [reminderStates, setReminderStates] = useState(
    classes.reduce((acc, cls) => {
      acc[cls.id] = false;
      return acc;
    }, {})
  );

  const toggleReminder = (id) => {
    setReminderStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleStartNow = (title) => {
    alert(`Starting ${title}!`);
  };

  return (
    <div className="p-6 ">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="flex justify-between items-center p-4 bg-[#FFF9EE] border border-[#E5E5E5] rounded-xl shadow-md"
          >
            <div >
              <h2 className="text-lg font-bold text-gray-800 ">{classItem.title}</h2>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <img src={book} alt="" className="mr-2 w-4 h-4" />
                <span>{classItem.language}</span>
              </div>
              <span className="text-sm text-gray-600 mt-1">Class Time: {classItem.classTime}</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleReminder(classItem.id)}
                className={`flex justify-center px-4 py-2 border rounded-md items-center w-[130px]  ${
                  reminderStates[classItem.id]
                    ? "border-green-500 text-green-500 hover:bg-green-100"
                    : "border-gray-400 text-gray-400 hover:bg-gray-100"
                }`}
              >
                {!reminderStates[classItem.id] && <Add className="mr-1" />}
                {reminderStates[classItem.id] ? "Reminder Set" : "Set Reminder"}
              </button>

              <button
                onClick={() => handleStartNow(classItem.title)}
                className="px-4 py-2 bg-[#107D7E] text-white rounded-md hover:bg-[#0B6061] "
              >
                Start Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Reminderbox;
