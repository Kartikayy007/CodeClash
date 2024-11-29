import React, { useState, useEffect } from "react";
import axios from "axios";
import tick from '../../auth/assets/tick.svg';
import cross from '../../auth/assets/cross.svg';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [validation, setValidation] = useState({
        uppercase: false,
        number: false,
        specialChar: false,
        minLength: false,
    });

    const token =
        sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const handleClose = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            setIsFadingOut(false);
            onClose();
        }, 300);
    };

    useEffect(() => {
        if (isOpen) setIsFadingOut(false);
    }, [isOpen]);

    // Password validation logic
    const validatePassword = (password) => {
        setValidation({
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
            minLength: password.length >= 8,
        });
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        validatePassword(password);
    };

    const calculateStrength = () => {
        const validCriteria = Object.values(validation).filter(Boolean).length;
        const strength = (validCriteria / 4) * 100;
        return strength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!Object.values(validation).every(Boolean)) {
            setError("Please ensure your password meets all the requirements.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/user/settings/change-password`,
                { oldPassword, newPassword },
                axiosConfig
            );
            console.log(response.data);
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");
            localStorage.setItem("authToken", response.data.token);
            setSuccess(response.data.message || "Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setTimeout(handleClose, 2000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Failed to change password.");
            } else if (err.request) {
                setError("No response from the server. Please try again later.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    // Modal should be visible if 'isOpen' is true and newPassword has content
    const showModal = isOpen;

    // Check if the password is valid (i.e., meets all validation rules)
    const isPasswordValid = Object.values(validation).every(Boolean);

    return (
        <div
            className={`fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
        >
            <div
                className={`bg-white px-8 py-12 w-[90%] max-w-lg relative transform transition-all duration-300 ${showModal ? "scale-100" : "scale-95"
                    }`}
            >
                <button
                    className="absolute top-7 right-5 text-4xl text-gray-700"
                    onClick={handleClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold mb-6">Change Password</h2>

                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <label className="block mb-4">
                        <input
                            type="password"
                            className="w-full mt-1 p-2 border rounded-lg"
                            placeholder="Enter old password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label className="block mb-4">
                        <input
                            type="password"
                            className="w-full mt-1 p-2 border rounded-lg"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </label>

                    {/* Show validation indicators only if password is not empty and invalid */}
                    {newPassword && !isPasswordValid && (
                        <div className="mb-8">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${calculateStrength()}%`,
                                        backgroundColor:
                                            calculateStrength() < 40
                                                ? "#C63C3C"
                                                : calculateStrength() < 70
                                                    ? "#FFB74D"
                                                    : "#358439",
                                    }}
                                ></div>
                            </div>
                            
                        </div>
                    )}
                    {newPassword && !isPasswordValid && (
                        <div className="mb-4 text-sm text-gray-600 flex flex-col gap-2">
                            <p
                                className={`flex items-center gap-2`}
                            >
                                {validation.uppercase ? <img src={tick} alt="" /> : <img src={cross} alt="" />} One uppercase letter
                            </p>
                            <p
                                className={`flex items-center gap-2`}
                            >
                                {validation.number ? <img src={tick} alt="" /> : <img src={cross} alt="" />} One number
                            </p>
                            <p
                                className={`flex items-center gap-2`}
                            >
                                {validation.specialChar ? <img src={tick} alt="" /> : <img src={cross} alt="" />} One special character (@#$% etc.)
                            </p>
                            <p
                                className={`flex items-center gap-2`}
                            >
                                {validation.minLength ? <img src={tick} alt="" /> : <img src={cross} alt="" />} At least 8 characters
                            </p>
                        </div>
                    )}

                    {/* Show Password Strength Progress Bar only if password is not empty and invalid */}
                    

                    <button
                        type="submit"
                        className="bg-[#066769] w-full text-white px-4 py-4 rounded-lg mt-4"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
