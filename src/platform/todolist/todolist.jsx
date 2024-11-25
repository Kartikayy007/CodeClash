import React, { useState } from "react";
import AlarmIcon from "@mui/icons-material/AccessAlarm";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import checked from "../assets/checked.svg";
import unchecked from "../assets/unchecked.svg";

const TodoList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Remind Me", completed: false, hasReminder: true },
    { id: 2, text: "Survive", completed: false, hasReminder: false },
    { id: 3, text: "Task1", completed: true, hasReminder: false },
  ]);

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="h-[100%] p-5 bg-white border border-[#BCE2DF] rounded-lg ml-[22px] w-[90%] pb-[100px] ">
      <h3 className="text-xl mb-3">To-Do List</h3>
      <input
        type="text"
        placeholder="Enter your task here"
        className="w-full p-2 mb-4 mt-3 border border-gray-300 rounded"
      />
      <div className="space-y-2 flex flex-col gap-[5px]">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-lg h-[45px] ${
              task.completed ? "bg-[#EEF0F0]" : "bg-[#ADB8B8]"
            }`}
          ><div className="flex">
            <img
              src={task.completed ? checked : unchecked}
              alt={task.completed ? "Checked" : "Unchecked"}
              onClick={() => handleToggleComplete(task.id)}
              className="mr-2 cursor-pointer w-7 h-7"
            />
            <span className="">{task.text}</span>
            </div>
            <div className="flex">
            {task.hasReminder && (
              <span className="text-lg mr-2 "><AlarmIcon /></span>
            )}
            <span className="text-lg cursor-pointer ml-auto"><MoreVertIcon /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
