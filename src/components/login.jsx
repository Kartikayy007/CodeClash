import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img1 from '../assets/img1.svg';
import img2 from '../assets/img2.svg';
import img3 from '../assets/img3.svg';
import frame from '../assets/Frame.svg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const element2 = <FontAwesomeIcon icon={faEyeSlash} />;
const element = <FontAwesomeIcon icon={faEye} />;
const images = [img1, img2, img3];

const Login = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email');
      setLoading(false);
      return;
    } else {
      setEmailError('');
    }



    try {
      const response = await axios.post("https://singhanish.me/api/auth/login", {
        email,
        password
      });

      if (response.data.success) {
        const token = response.data.token;
        rememberMe ? localStorage.setItem('authToken', token) : sessionStorage.setItem('authToken', token);
        toast.success("Logged in successfully", {
          className: "custom-toastS",
          hideProgressBar: true,
          autoClose: 3000,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response.data.error.includes('Password')) {
        setPasswordError('Incorrect password');
      }

      toast.error(error.response.data.error || "Login failed", {
        className: "custom-toast",
        hideProgressBar: true,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <div className='loginPage'>
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
          <h2 id="leftsubh2">Log In</h2>
          <p>to access your classes, assignments and more.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="email"
                className={`textinput ${emailError ? 'input-error no-margin' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label className={`label  ${emailError ? 'input-error ' : ''}`}>Email Address</label>
            </div>
            {emailError && <p className="error-message">{emailError}</p>}

            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`textinput password-input ${passwordError ? 'input-error no-margin  ' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                required
                placeholder=" "
              />

              <label className={`label  ${passwordError ? 'input-error ' : ''}`}>Password</label>
              {passwordError && <p className="error-message">{passwordError}</p>}
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? element2 : element}
              </button>
            </div>

            <div className="checkbox-container">

              <Link to="/pwreset" id='Fp'>Forget Password?</Link>
              <input

                type="checkbox"
                id="remember"
                name="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            
              
            </div>

            <input
              type="submit"
              value="Log in"
              disabled={loading || !email || !password}
              className={`${loading || !email || !password ? 'disabled-button' : ''}`}
              style={{ opacity: loading || !email || !password ? 0.5 : 1, transition: 'opacity 0.3s ease-in-out' }}
            />

          </form>

          <div className="askSign">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="content">
          <div className="slider">
            <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Slide ${index + 1}`} className="slide" />
              ))}
            </div>
          </div>

          <div className="scroller">
            {images.map((_, index) => (
              <div key={index} className={`rec ${currentIndex === index ? 'recActive' : 'rec2'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer position='top-center' />
    </div>
  );
}

export default Login;
