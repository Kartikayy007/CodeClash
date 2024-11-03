import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setEmail } from '../features/authSlice';
import './css/signup.css';
import img4 from '../assets/img4.svg';
import img5 from '../assets/img5.svg';
import frame from '../assets/Frame.svg'
import img6 from '../assets/img6.svg';
import img7 from '../assets/img7.svg';
import img8 from '../assets/img8.svg';
import tick from '../assets/tick.svg';
import cross from '../assets/cross.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Modal from './modal'; 
import PrivacyPolicy from './content/Policy';
import TermsAndConditions from './content/Terms';


const element2 = <FontAwesomeIcon icon={faEyeSlash} />;
const element = <FontAwesomeIcon icon={faEye} />;
const images = [img4, img5, img6, img7, img8];

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  

  const [passwordConditions, setPasswordConditions] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false
  });
  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  const closePrivacyModal = () => {
    setShowPrivacyModal(false);
  };
  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  const handlePrivacyClick = () => {
    setShowPrivacyModal(true);
  };

  const [passwordStrength, setPasswordStrength] = useState("Weak");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (emailError && email) {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    handleFocus();
  }, [password]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

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
    
      setEmailError('');
      setLoading(true);
    

    try {
      const response = await axios.post("https://singhanish.me/api/auth/register", {
        name,
        email,
        password
      });

      if (response.data.success) {
        dispatch(setEmail(email));
        toast.dismiss();
        toast.success(response.data.message, { className: 'custom-toastS', autoClose: 3000,hideProgressBar:true });
        setTimeout(() => navigate('/otp'), 1000);
        sessionStorage.setItem('isRegistered', 'true');

      }
    } catch (error) {
      toast.error(error.response.data.error, { className: 'custom-toast', autoClose: 3000,hideProgressBar:true  });
    } finally {
      setName('');
      setEmailState('');
      setPassword('');
      setIsChecked(false);
      setPasswordConditions({
        length: false,
        uppercase: false,
        specialChar: false,
        number: false
      });
      setPasswordStrength("Weak");
      setPopupVisible(false);
      setLoading(false); 
    }
  };

  const handleFocus = () => {
    if (password.length === 0 || Object.values(passwordConditions).every(condition => condition)) {
      setPopupVisible(false);
      return;
    }
    setPopupVisible(true);
  };

  const handleBlur = () => {
    setPopupVisible(false);
  };

  const progress = Object.values(passwordConditions).filter(Boolean).length * 25;
  const formIsValid = name && email && password && Object.values(passwordConditions).every(condition => condition) && isChecked;

  return (
    <div className='signUpPage'>
      {loading && (
        <div className="loading-overlay">
          <div className="moving-circle"></div>
        </div>
      )}
      <div className='signupleft'>
      <div id="signmobscreenlogo">
          <img src={frame} alt="" />
        </div>
        <div className="signupleftSub">
          <h2 id='signuph2'>Create Your Account</h2>
          <p>Start organizing your classes, assignments, and meetings all in one place.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                className="textinput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
              />
              <label className="label">User Name</label>
            </div>

            <div className="input-container">
              <input
                type="email"
                className={`textinput ${emailError ? 'input-error no-margin' : ''}`}
                value={email}
                onChange={(e) => setEmailState(e.target.value)}
                required
                placeholder=" "
              />
              <label className={`label ${emailError ? 'input-error' : ''}`}>Email Address</label>
            </div>
            {emailError && <p className="error-message">{emailError}</p>}

            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="textinput password-input"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handleBlur}
                required
                placeholder=" "
              />
              <label className="label">Password</label>
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? element2 : element}
              </button>
            </div>

            <div
              className="password-popup"
              style={{
                opacity: popupVisible ? 1 : 0,
                zIndex: popupVisible ? 1 : -1,
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
              <img src={passwordConditions.length ? tick : cross} alt={passwordConditions.length ? "Met" : "Not Met"} />
              Minimum 8 characters
              </p>
              <p className={passwordConditions.uppercase ? "met" : "not-met"}>
              <img src={passwordConditions.uppercase ? tick : cross} alt={passwordConditions.uppercase ? "Met" : "Not Met"} />
                At least one uppercase letter
              </p>
              <p className={passwordConditions.specialChar ? "met" : "not-met"}>
              <img src={passwordConditions.specialChar ? tick : cross} alt={passwordConditions.specialChar ? "Met" : "Not Met"} />
                At least one special character
              </p>
              <p className={passwordConditions.number ? "met" : "not-met"}>
              <img src={passwordConditions.number ? tick : cross} alt={passwordConditions.number ? "Met" : "Not Met"} />
                At least one number
              </p>

              <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Strength: {passwordStrength}
              </p>
            </div>

            <div className="policy-container">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
               <label htmlFor="terms">
                I agree to the &nbsp;
                <span onClick={handleTermsClick} style={{ cursor: 'pointer', color: 'blue' }} className='tc'>
                  Terms & Conditions
                </span>
                &nbsp; and &nbsp;
                <span onClick={handlePrivacyClick} style={{ cursor: 'pointer', color: 'blue', marginLeft:'37px'}} className='tc'>
                  Privacy Policy
                </span>
              </label>
            </div>

            <input
              type="submit"
              value="Create Account"
              id='sub'
              disabled={!formIsValid || loading}
              className={!formIsValid || loading ? 'disabled-button' : ''}
              style={{ opacity: formIsValid ? 1 : 0.5,transition: 'opacity 0.3s ease-in-out' }}
            />
          </form>

          <div className="asklogin">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
      <div className="signupright">
        <div className="content">
          <div className="slider2">
            <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Slide ${index + 1}`} className="slide" />
              ))}
            </div>
          </div>

          <div className="scroller">
            {images.map((_, index) => (
              <div
                key={index}
                className={`rec ${currentIndex === index ? 'recActive' : 'rec2'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer position='top-center'/>
      {showTermsModal && (
        <Modal
          title="Terms and Conditions"
          content={TermsAndConditions()}       
           onClose={closeTermsModal}
        />
      )}
      {showPrivacyModal && (
        <Modal
          title="Privacy Policy"
          content={PrivacyPolicy()}
          onClose={closePrivacyModal}
        />
      )}
    </div>
  );
};

export default Signup;
