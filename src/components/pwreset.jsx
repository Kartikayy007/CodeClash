import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

import React from 'react';
import './css/pwreset.css';
import bro1 from '../assets/bro.svg';

const Pwreset = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleResendLink = async(e) => {
      e.preventDefault();
      navigate('/resetlink');


      try {
        const response = await axios.post("https://singhanish.me/api/auth/reset-password", {
          
         email
        });
        
        if (response.data.success) {
         
          
        }
      } catch (error) {
        
      } finally {
        
  
        setEmail('');

        
       
      }
    };
  
    

    


    return(
        <div className='resetPage'>
        <div className='resetleft'>
            <div className="resetleftSub">
            <h2 id="reseth2">Reset your password</h2>
            <p id="resetp">Enter the email associated with your account, and we'll send you a link to reset your password. </p>
    
            <input type="email" id='resetemail'  className="textinput" placeholder='Email address'  value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>
            <br />
            
          
           
           
        
            <input type="submit" id='resetsubmit'value="Send reset link"  onClick={handleResendLink}/>
            <div className="askSign"> <p>Remember your password?  <Link to="/login">Log in</Link></p></div>
           
           
            </div>
      
        </div>
        <div className="resetright">
         <div className="resetcontent">
          
          <img src={bro1} alt="" />
    
          
    
       
         </div>
         
    
        </div>
      </div>
    )
}
export default Pwreset;