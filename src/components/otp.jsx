import { Link } from 'react-router-dom';

import React from 'react';
import './css/otp.css';
import bro1 from '../assets/pana.svg';

const Otp = () => {


    return(
        <div className='otpPage'>
        <div className='otpleft'>
            <div className="otpleftSub">
            <h2 id="otph2">Verify Your Email</h2>
            <p id="otpp">We’ve sent a 6-digit verification code to xxx@gmail.com </p>
    <form className="digits">
    
    <input type="text" id='digit1' maxLength="1"/>
    <input type="text" id="digit2" maxLength="1"/>
    <input type="text" id="digit3" maxLength="1"/>
    <input type="text" id="digit4" maxLength="1"/>
    <input type="text" id="digit5" maxLength="1" />
    <input type="text" id="digit6" maxLength="1"/>
   
           
            
        
    </form>
    <p id='resend'>Resend OTP in 27s</p>
           
            
            
          
           
           
        
            <input type="submit" id='otpsubmit'value="Verify" />
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