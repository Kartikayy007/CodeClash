

import React from 'react';
import './css/pwreset.css';
import bro1 from '../assets/bro.svg';

const Pwreset = () => {


    return(
        <div className='resetPage'>
        <div className='left'>
            <div className="leftSub">
            <h2>Reset your password</h2>
            <p>Enter the email associated with your account, and we'll send you a link to reset your password. </p>
    
            <input type="email" placeholder='Email address'/>
            <br />
            
          
           
           
        
            <input type="submit" value="Send reset link" />
            <div className="askSign"> <p>Remember your password?  <a href="">Login</a></p></div>
           
           
            </div>
      
        </div>
        <div className="right">
         <div className="content">
          
          <img src={bro1} alt="" />
    
          
    
       
         </div>
         
    
        </div>
      </div>
    )
}
export default Pwreset;