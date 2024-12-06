import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AlarmIcon from "@mui/icons-material/Alarm";
import checked from "../assets/checked.svg";
import unchecked from "../assets/unchecked.svg";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NoDataIllustration from '../assets/todo.svg'; 

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [inputLength, setInputLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/todo`,
        axiosConfig
      );

      if (response.status === 200) {
        setTasks(response.data.todos);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleComplete = async (_id) => {
    setLoadingTaskId(_id);
    try {
      const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const taskToToggle = tasks.find((task) => task._id === _id);
      if (!taskToToggle) return;

      const updatedCompletionStatus = !taskToToggle.isCompleted;

      await axios.put(
        `${process.env.REACT_APP_API_URL}/todo/update/${_id}`,
        { isCompleted: updatedCompletionStatus },
        axiosConfig
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === _id ? { ...task, isCompleted: updatedCompletionStatus } : task
        )
      );
      
      toast.success("Task status updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task status");
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.trim()) return;
    setIsCreating(true);
    
    try {
      const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
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
        toast.success("Task created successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTask = async (_id) => {
    setIsDeleting(true);
    setLoadingTaskId(_id);
    try {
      const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/todo/delete/${_id}`,
        {},
        axiosConfig
      );

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== _id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
      setLoadingTaskId(null);
    }
  };

  const handleUpdateTask = async (taskId) => {
    if (editedTitle.trim().length < 5) {
      toast.error("Task title must be at least 5 characters long");
      return;
    }

    setIsUpdating(true);
    setLoadingTaskId(taskId);
    try {
      const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/todo/update/${taskId}`,
        { title: editedTitle },
        axiosConfig
      );

      if (response.status === 200) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? { ...task, title: editedTitle } : task
          )
        );
        setEditingTask(null);
        setEditedTitle("");
        toast.success("Task updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setIsUpdating(false);
      setLoadingTaskId(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newTask.trim().length >= 5) {
      handleCreateTask();
    }
  };

  const handleMenuToggle = (taskId, event) => {
    event.stopPropagation();
    setActiveMenu(activeMenu === taskId ? null : taskId);
  };

  const sortedTasks = tasks.sort((a, b) => a.isCompleted - b.isCompleted);

  return (
    <div className={`h-[100%] p-5 bg-white border overflow-y-auto border-[#BCE2DF] rounded-lg ${
      isMobile ? 'w-[100%] ml-0 min-h-[500px] mb-[50px]' : 'w-[90%] ml-[22px]'
    } pb-[100px]`}>
      <h3 className="text-xl mb-3">To-Do List</h3>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Enter your task here"
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
            setInputLength(e.target.value.length);
          }}
          onKeyPress={handleKeyPress}
          disabled={isCreating}
          className={`w-full p-2 mb-1 border rounded transition-colors ${
            newTask.length > 0 && newTask.length < 5 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-300 focus:border-teal-500'
          } ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div 
          className={`text-sm transition-opacity duration-200 ${
            newTask.length > 0 && newTask.length < 5 
              ? 'text-gray-700 opacity-100' 
              : 'text-gray-400 opacity-0'
          }`}
        >
          Enter at least 5 characters ({inputLength}/5)
        </div>
      </div>
      <div className="space-y-2 flex flex-col gap-[5px] pb-[20px] min-w-[300px]">
        {isLoading ? (
          <div className="text-center py-4">Loading tasks...</div>
        ) : Array.isArray(sortedTasks) && sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-center justify-between p-3 rounded-lg h-auto min-h-[45px] bg-[#EEF0F0] ${
                loadingTaskId === task._id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center flex-1 w-[80%]">
                <img
                  src={task.isCompleted ? checked : unchecked}
                  alt={task.isCompleted ? "Checked" : "Unchecked"}
                  onClick={() => handleToggleComplete(task._id)}
                  className="mr-2 cursor-pointer w-7 h-7"
                />
                {editingTask === task._id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editedTitle.trim().length >= 5) {
                        handleUpdateTask(task._id);
                      } else if (e.key === "Escape") {
                        setEditingTask(null);
                        setEditedTitle("");
                      }
                    }}
                    className="flex-1 bg-white px-2 py-1 rounded border border-gray-300 focus:border-teal-500 outline-none"
                    autoFocus
                    style={{border:'none',background:'none',padding:'0',margin:'0'}}
                  />
                ) : (
                  <span className={`w-[80%] break-words whitespace-normal overflow-wrap-break-word ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </span>
                )}
              </div>
              <div className="flex items-center relative">
                {task.hasReminder && (
                  <span className="text-lg mr-2">
                    <AlarmIcon />
                  </span>
                )}
                <button
                  onClick={(e) => handleMenuToggle(task._id, e)}
                  disabled={loadingTaskId === task._id}
                  className={`p-1 hover:bg-gray-200 rounded-full transition-colors ${
                    loadingTaskId === task._id ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <MoreVertIcon />
                </button>
                
                {activeMenu === task._id && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 top-8 bg-white shadow-lg rounded-lg py-1 min-w-[120px] z-10"
                  >
                    <button 
                      onClick={() => {
                        setEditingTask(task._id);
                        setEditedTitle(task.title);
                        setActiveMenu(null);
                      }}
                      disabled={isUpdating}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating && loadingTaskId === task._id ? 'Updating...' : 'Edit'}
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                     
                      {isDeleting && loadingTaskId === task._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-6">
            <img
              src={NoDataIllustration}
              alt="No Tasks"
              className="w-auto h-auto object-contain mb-4"
            />
            <p className="text-2xl font-semibold">Your to-do list is empty!</p>
            <p className="text-lg">Add a task to stay organized.</p>
          </div>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default TodoList;
