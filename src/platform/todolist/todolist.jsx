import React, { useState, useEffect } from "react";
import axios from "axios";
import AlarmIcon from "@mui/icons-material/Alarm";
import checked from "../assets/checked.svg";
import unchecked from "../assets/unchecked.svg";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token =
          sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/todo`,
          axiosConfig
        );

        if (response.status === 200) {
          setTasks(response.data.todos);
        } else {
          console.error("Invalid tasks response format", response.data);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleComplete = async (_id) => {
    try {
      const token =
        sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const taskToToggle = tasks.find((task) => task._id === _id);
      if (!taskToToggle) return;

      const updatedCompletionStatus = !taskToToggle.isCompleted;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === _id ? { ...task, isCompleted: updatedCompletionStatus } : task
        )
      );

      await axios.put(
        `${process.env.REACT_APP_API_URL}/todo/update/${_id}`,
        { isCompleted: updatedCompletionStatus },
        axiosConfig
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.trim()) return;

    try {
      const token =
        sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/todo/create`,
        { title: newTask, description: "Task" },
        axiosConfig
      );

      if (response.status === 201 || response.status === 200) {
        const createdTask = response.data.todo;
        setTasks((prevTasks) => [...prevTasks, createdTask]);
        setNewTask("");
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (_id) => {
    try {
      const token =
        sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/todo/delete/${_id}`,
        {},
        axiosConfig
      );

      if (response.status === 200 || response.status === 204) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== _id));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newTask.trim().length >= 5) {
      handleCreateTask();
    }
  };


  const sortedTasks = tasks.sort((a, b) => a.isCompleted - b.isCompleted);

  return (
    <div className={`h-[100%] p-5 bg-white border overflow-y-auto border-[#BCE2DF] rounded-lg ${
      isMobile ? 'w-[100%] ml-0 min-h-[500px] mb-[50px]' : 'w-[90%] ml-[22px]'
    } pb-[100px]`}>
      <h3 className="text-xl mb-3">To-Do List</h3>
      <input
        type="text"
        placeholder="Enter your task here"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full p-2 mb-4 mt-3 border border-gray-300 rounded"
      />
      <div className="space-y-2 flex flex-col gap-[5px] pb-[20px]">
        {Array.isArray(sortedTasks) && sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-center justify-between p-3 rounded-lg h-[45px] bg-[#EEF0F0]`}
            >
              <div className="flex">
                <img
                  src={task.isCompleted ? checked : unchecked}
                  alt={task.isCompleted ? "Checked" : "Unchecked"}
                  onClick={() => handleToggleComplete(task._id)}
                  className="mr-2 cursor-pointer w-7 h-7"
                />
                <span>{task.title}</span>
              </div>
              <div className="flex">
                {task.hasReminder && (
                  <span className="text-lg mr-2">
                    <AlarmIcon />
                  </span>
                )}
                <span
                  className="text-lg cursor-pointer ml-auto"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  <DeleteIcon />
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default TodoList;
