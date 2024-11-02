import React, { useEffect, useState } from 'react';
import createnewpass from '../assets/creatnewpass.svg';
import './css/newpass.css';
import axios from 'axios';


const Newpass = () => {
  const [token, setToken] = useState('');
  const [password, setNewPassword] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
   
    console.log('Token:', token);

    try {
      
      const response = await axios.put(`https://singhanish.me/api/auth/reset-password/${token}`, {
        password
      });

      if (response.data.success) {
        console.log(response);
      } 
    } catch (error) {
      console.log(error);
    } finally {
     
      
      setNewPassword('');
    }
    
  };

  return (
    <div id='newpasspage'>
      <div id='newpassleft'>
        <div id='newpassleftsub'>
          <h2 id="newpassh2">Create a New Password</h2>
          <p id="newpassp">Enter a new password to regain access to your <br /> account.</p>
          <form onSubmit={handleSubmit}>
            <input type="password" className="textinput" placeholder='Password' value={password}   onChange={(e) => setNewPassword(e.target.value)} required />
            <input type="password" className="textinput" placeholder='Confirm Password' required />
            
            <div id="newmobscreenlogo">
                                <img src={createnewpass} alt="" />
                    </div>
            <input type="submit" id='newpasssubmit' value="Reset Password" />
          </form>
        </div>
      </div>
      <div className="newpassright">
        <div className="newpasscontent">
          <img src={createnewpass} alt="Create New Password" />
        </div>
      </div>
    </div>
  );
};

export default Newpass;
