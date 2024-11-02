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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [passwordConditions, setPasswordConditions] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false
  });
  const [passwordStrength, setPasswordStrength] = useState("Weak");

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    handleFocus();
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
      <div className='left'>
      <div id="mobscreenlogo">
          <img src={frame} alt="" />
        </div>
        <div className="leftSub">
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
                onFocus={handleFocus} 
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
                {element}
              </button>
            </div>

            {popupVisible && (
              <div
                className="password-popup"
                style={{
                  opacity: 1,
                  zIndex: 1,
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

                <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                  Strength: {passwordStrength}
                </p>
              </div>
            )}

            <div className="policy-container">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="terms" id="terms">
                I agree to the &nbsp;<a href="">Terms & conditions</a>&nbsp; and <a href="" id='priP'>Privacy Policy</a>
              </label>
            </div>

            <input
              type="submit"
              value="Create Account"
              id='sub'
              disabled={!formIsValid||loading}
              className={!formIsValid||loading ? 'disabled-button' : ''}
              style={{ opacity: formIsValid ? 1 : 0.5 }}
            />
          </form>


          <div className="asklogin">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
      <div className="right">
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
    </div>
  );
};

export default Signup;
