import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

import React from 'react';
import './css/pwreset.css';

import bro1 from '../assets/bro.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pwreset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  useEffect(() => {
    if (emailError && email) {
      setEmailError('');
    }
  }, [email]);
  const handleResendLink = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email');
      return;
    } else {
      setEmailError('');
    }



    try {
      const response = await axios.post("https://singhanish.me/api/auth/reset-password", {

        email
      });

      if (response.data.success) {

        navigate('/resetlink');
      }
    } catch (error) {

      toast.error(error.response.data.error, {
        className: "custom-toast",
        hideProgressBar: true,
        autoClose: 3000,

      });

    } finally {


      setEmail('');



    }
  };






  return (
    <div className='resetPage'>
      <div className='resetleft'>
        <div className="resetleftSub">
          <h2 id="reseth2">Reset your password</h2>
          <p id="resetp">Enter the email associated with your account, and we'll send you a link to reset your password. </p>

          <div className="input-container">
            <input
              type="email"
              className={`textinput ${emailError ? 'input-error no-margin' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label className={`label  ${emailError ? 'input-error ' : ''}`}>Email address</label>
          </div>
          {emailError && <p className="error-message">{emailError}</p>}

          <br />

          <div id="resmobscreenlogo">
          <img src={bro1} alt="" />
        </div>



          <input type="submit" id='resetsubmit' value="Send reset link" onClick={handleResendLink} />
          <div className="askSign"> <p>Remember your password?  <Link to="/login">Log in</Link></p></div>


        </div>

      </div>
      <div className="resetright">
        <div className="resetcontent">

          <img src={bro1} alt="" />




        </div>


      </div>'
      <ToastContainer position='top-center' />
    </div>
  )
}
export default Pwreset;