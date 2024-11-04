import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect,useRef } from 'react';

import React from 'react';
import './css/pwreset.css';


import bro1 from '../assets/bro.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Pwreset = () => {
  const emailRef = useRef(null);

  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (emailError && email) {
      setEmailError('');
    }
  }, [email]);
  const handleResendLink = async (e) => {
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
      const response = await axios.post("https://singhanish.me/api/auth/reset-password", {

        email
      });

      if (response.data.success) {
        setSuccess(true); 
        
     
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.error, {
        className: "custom-toast",
        hideProgressBar: true,
        autoClose: 3000,

      });

    } finally {
      setLoading(false); 
    }
  };
  const handleKeyDown = (e, nextField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField === 'submit' && email) {
        handleResendLink(e); 
      }
    }
  };






  return (
    <div className='resetPage'>
       {loading && (
        <div className="loading-overlay">
          <div className="moving-circle"></div>
        </div>
      )}
      <div className='resetleft'>
        <div className="resetleftSub">
          <h2 id="reseth2">{success?"Link sent!":"Reset your password"}</h2>
          <p id="resetp">  {success? "We've  sent a password reset link to "+email+". Click the link to reset your password. If you don't see it in your inbox, check your spam folder.":"Enter the email associated with your account, and we'll send you a link to reset your password. "}  </p>
          {success?<></>: <div className="input-container">
          
          <input
            type="email"
            ref={emailRef}
            className={`textinput ${emailError ? 'input-error no-margin' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'submit')}
            required
            placeholder=" "
          />
          <label className={`label  ${emailError ? 'input-error ' : ''}`}>Email address</label>
        </div>}
         
          {emailError && <p className="error-message">{emailError}</p>}

        

          <div id="resmobscreenlogo">
          <img src={bro1} alt="" />
        </div>


{success?<></>:          <input type="submit" id='resetsubmit' value="Send reset link" onClick={handleResendLink} disabled={loading} />
}
                 <div className="resaskSign askSign"> <p>{success?"Go back to":"Remember your password?"}  <Link to="/login">Log in</Link></p></div>
          


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
 