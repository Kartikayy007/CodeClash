import React, { useState } from "react";
import axios from "axios";

const ChangeNameModal = ({ isOpen, onClose }) => {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/settings/change-name`,
        { newName },
        axiosConfig
      );

      // On success, update the success state
      setSuccess(response.data.message || "Name updated successfully!");
      setNewName("");

      // Optionally close the modal after success
      setTimeout(onClose, 2000);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Failed to change name.");
      } else if (err.request) {
        setError("No response from the server. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-2xl font-bold text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">Change Name</h2>

        {/* Error Message */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Success Message */}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700">New Name</span>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Update Name
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeNameModal;
