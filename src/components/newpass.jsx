import React, { useEffect, useState } from 'react';
import createnewpass from '../assets/creatnewpass.svg';
import './css/newpass.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Newpass = () => {
  const [token, setToken] = useState('');
  const [password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordConditions, setPasswordConditions] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const calculateStrength = (conditions) => {
    const metConditions = Object.values(conditions).filter(Boolean).length;

    if (metConditions === 4) {
      setPasswordStrength("Strong");
    } else if (metConditions === 2 || metConditions === 3) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 


    
    const allConditionsMet = Object.values(passwordConditions).every(condition => condition);
    if (!allConditionsMet) {
      toast.dismiss();
      toast.error('Password does not meet all requirements',{ className: "custom-toast",
        hideProgressBar: true,
        autoClose: 3000,});
        setLoading(false); 

      return;
    }

    if (password !== confirmPassword) {
      toast.dismiss(); 
      toast.error('Passwords do not match',{ className: "custom-toast",
        hideProgressBar: true,
        autoClose: 3000,});
        setLoading(false); 

      return;
    }

    setPasswordError(''); 

    try {
      const response = await axios.put(`https://singhanish.me/api/auth/reset-password/${token}`, {
        password,
      });

      if (response.data.success) {
        console.log(response);
        toast.dismiss();
        toast.success(response.data.message, {
          className: "custom-toastS",
          hideProgressBar: true,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error.response.data.error, {
        className: "custom-toast",
        hideProgressBar: true,
        autoClose: 3000,
      });
    } finally {
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false); 

    }
  };

  const progress = Object.values(passwordConditions).filter(Boolean).length * 25;

  const handleFocus = () => {
    if (password.length > 0) {
      setPopupVisible(true);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);

    const updatedConditions = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      number: /[0-9]/.test(newPassword)
    };
    setPasswordConditions(updatedConditions);
    calculateStrength(updatedConditions);

    if (newPassword.length > 0) {
      setPopupVisible(true);
    } else {
      setPopupVisible(false); 
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div id='newpasspage'>
       {loading && (
        <div className="loading-overlay">
          <div className="moving-circle"></div>
        </div>
      )}
      <div id='newpassleft'>
        <div id='newpassleftsub'>
          <h2 id="newpassh2">Create a New Password</h2>
          <p id="newpassp">Enter a new password to regain access to your <br /> account.</p>
          <form onSubmit={handleSubmit}>

            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="textinput password-input"
                value={password}
                onFocus={handleFocus}
                onChange={handlePasswordChange}
                required
                placeholder=" "
              />
              <label className="label">Password</label>
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
            </div>

            <div className="input-container">
              <input
                type="password"
                className="textinput password-input"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                placeholder=" "
              />
              <label className="label">Confirm Password</label>
            </div>

            {password.length > 0 && (
              <div
                className="password-popup2"
                style={{
                  opacity: 1,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              >
                <div className="progress-bar-container">
                  <div
                    className={`progress-bar ${passwordStrength.toLowerCase()}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className={passwordConditions.length ? "met" : "not-met"}>
                  {passwordConditions.length ? '✔️' : '✖️'} Minimum 8 characters
                </p>
                <p className={passwordConditions.uppercase ? "met" : "not-met"}>
                  {passwordConditions.uppercase ? '✔️' : '✖️'} At least one uppercase letter
                </p>
                <p className={passwordConditions.specialChar ? "met" : "not-met"}>
                  {passwordConditions.specialChar ? '✔️' : '✖️'} At least one special character
                </p>
                <p className={passwordConditions.number ? "met" : "not-met"}>
                  {passwordConditions.number ? '✔️' : '✖️'} At least one number
                </p>
                <br />
                <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                  Strength: {passwordStrength}
                </p>
              </div>
            )}
            
             <div id="newmobscreenlogo">
                                <img src={createnewpass} alt="" />
                    </div>

            <input type="submit" id='newpasssubmit' value="Reset Password" disabled={loading} />

          </form>
        </div>
      </div>
      <div className="newpassright">
        <div className="newpasscontent">
          <img src={createnewpass} alt="Create New Password" />
        </div>
      </div>
      <ToastContainer position='top-center'/>
    </div>
  );
};

export default Newpass;
