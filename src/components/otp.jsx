import { Link } from 'react-router-dom';
import { useRef } from 'react';

import axios from 'axios';

import React from 'react';
import './css/otp.css';
import bro1 from '../assets/pana.svg';
import { useSelector } from 'react-redux';


const Otp = () => {
    
  
    const email = useSelector((state) => state.auth.email); 

    const inputRefs = useRef([]);

    const handleSubmit = async (e) => {
   
        e.preventDefault();
        const digit1 = document.getElementById('digit1').value;
    const digit2 = document.getElementById('digit2').value;
    const digit3 = document.getElementById('digit3').value;
    const digit4 = document.getElementById('digit4').value;
    const digit5 = document.getElementById('digit5').value;
    const digit6 = document.getElementById('digit6').value;

    const otp = digit1 + digit2 + digit3 + digit4 + digit5 + digit6;

    try {
        const response = await axios.post("https://singhanish.me/api/auth/verify", {
          
         email,
         otp
        });
        
        if (response.data.success) {

        alert('Signed up successfully')
          
        }
      } catch (error) {
     
      } finally {
        
  
        
        
       
      }
    };
  
  
    
    const handleInputChange = (e,index) => {
        const { value, id } = e.target;
        // Only allow digits 0-9
        if (!/^\d$/.test(value)) {
            e.target.value = '';
            return;
        }
        if (value) {
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) {
                nextInput.focus();
            }
        }
    };


    return(
        <div className='otpPage'>
        <div className='otpleft'>
            <div className="otpleftSub">
            <h2 id="otph2">Verify Your Email</h2>
            <p id="otpp">We’ve sent a 6-digit verification code to {email}</p>
    <form className="digits">
    
 <input type="text" id='digit1' maxLength="1" onChange={handleInputChange} />
                        <input type="text" id="digit2" maxLength="1" onChange={handleInputChange} />
                        <input type="text" id="digit3" maxLength="1" onChange={handleInputChange} />
                        <input type="text" id="digit4" maxLength="1" onChange={handleInputChange} />
                        <input type="text" id="digit5" maxLength="1" onChange={handleInputChange} />
                        <input type="text" id="digit6" maxLength="1" onChange={handleInputChange} />
   
           
            
        
    </form>
    <p id='resend'>Resend OTP in 27s</p>
           
            
            
          
           
           
        
            <input type="submit" id='otpsubmit'value="Verify" onClick={handleSubmit}/>
            <div className="askSign"> <p>Back to  <Link to="/signup">Sign Up</Link></p></div>
           
           
            </div>
      
        </div>
        <div className="otpright">
         <div className="otpcontent">
          
          <img src={bro1} alt="" />
    
          
    
       
         </div>
         
    
        </div>
      </div>
    )
}
export default Otp;