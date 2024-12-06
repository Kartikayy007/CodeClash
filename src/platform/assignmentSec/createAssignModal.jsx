import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Plus, Trash2, Loader } from "lucide-react";
import card from "../assets/assign.svg";

function CreateAssignmentModal({
  isOpen,
  onClose,
  className,
  classCode,
  assignment,
  isEditing,
}) {
  const [formData, setFormData] = useState({
    className: className,
    dueDate: "",
    title: "",
    description: "",
    attachments: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Populate formData when editing
  useEffect(() => {
    if (isEditing && assignment) {
      console.log(assignment, className, classCode);
      setFormData({
        className: className,
        dueDate: assignment.dueDate || "",
        title: assignment.name || "",
        description: assignment.description || "",
        attachments: assignment.media || [],
      });
    }
  }, [isEditing, assignment, className]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
    // Reset the file input value
    fileInputRef.current.value = null;
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("code", classCode);
    data.append("dueDate", formData.dueDate);
    data.append("name", formData.title);
    data.append("description", formData.description);

    if (formData.attachments) {
      for (let i = 0; i < formData.attachments.length; i++) {
        if (formData.attachments[i] instanceof File) {
          // Only append new files to the form data
          data.append("media", formData.attachments[i]);
        }
      }
    }

    const token =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(progress);
      },
    };

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/assignment/edit/${assignment._id}`,
          data,
          axiosConfig
        );
        console.log("Assignment updated:", response.data);
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/assignment/create`,
          data,
          axiosConfig
        );
        console.log("Assignment created:", response.data);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting assignment:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] md:w-[80%] h-[90%] md:h-[80%] p-4 md:p-8 relative overflow-y-auto rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">
            {isEditing ? "Edit Assignment" : "Create Assignment"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className={`flex flex-col ${isMobile ? 'gap-4 overflow-y-auto pt-[100px]' : 'md:flex-row gap-[10%]'} justify-center h-[80%] items-stretch`}>
          <div className="flex flex-col space-y-6 w-full md:w-[40%] justify-center">
            <div className="flex flex-col">
              <label className="block text-lg mt-10 md:mt-0">For</label>
              <input
                type="text"
                name="class"
                placeholder={`${formData.className} (${classCode})`}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                readOnly
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="block text-lg">Assignment Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter assignment title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="block text-lg">Description</label>
              <textarea
                name="description"
                placeholder="Write a brief description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#4C5858] focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none placeholder-black"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-6 w-full md:w-[40%] justify-center">
            <div className="flex flex-col space-y-2">
              <label className="block text-lg">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full p-[20px] rounded-lg border border-[#4C5858] focus:outline-none focus:ring-2 focus:ring-teal-500 text-xl"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="block text-lg">Attachments</label>
              <div className="border border-[#4C5858] rounded-lg p-4 h-[180px] overflow-y-auto">
                {formData.attachments.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center">
                    <img
                      src={card}
                      alt="Upload illustration"
                      className="w-32 h-32 mb-4"
                    />
                  </div>
                )}
                <ul className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span className="text-sm text-gray-600">
                        {file instanceof File ? file.name : file}
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <label className="mt-4 cursor-pointer flex justify-center">
                  <div className="flex items-center px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add files
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-col items-center justify-center gap-2">
          {isUploading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin">
                <Loader className="w-4 h-4" />
              </div>
              <span>Uploading... {uploadProgress}%</span>
              <div className="w-48 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className={`px-[60px] py-[12px] bg-[#066769] text-white rounded-lg transition-colors mt-10 md:mt-0
              ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"}`}
          >
            {isUploading
              ? isEditing
                ? "Updating Assignment..."
                : "Creating Assignment..."
              : isEditing
              ? "Update Assignment"
              : "Create Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAssignmentModal;
