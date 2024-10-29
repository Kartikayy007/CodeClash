import React from 'react';
import cuate  from '../assets/cuate.svg'
import './css/signup.css';

const Signup = () => {
  return (
    <div className='signUpPage'>
    <div className='left'>
        <div className="leftSub">
        <h2>Create Your Account</h2>
        <p>start organizing your classes, assignments, and<br/>meetings all in one place</p>

        <input type="text" class="textinput"placeholder="User Name"/>
        <br/>
        <input type="email" class="textinput" placeholder='Email Address'/>
        <br />
        <input type="password"  class="textinput"placeholder='Password' />
        <br />
      
       
        <div class="policy-container">
        <input type="checkbox" id="terms" name="terms"/>
        <label for="terms" id="terms">I agree to the &nbsp;<a href="https://example.com" >Terms & conditions  </a>&nbsp;and <a href="https://example.com">  <br/>&emsp;&emsp;&emsp; Privacy Policy</a></label>

  
</div>

    
        <input type="submit" value="Create Account" />
        <div className="asklogin"> <p>Already have an account?  <a href="https://example.com">Log In</a></p></div>
       
       
        </div>
  
    </div>
    <div className="right">
     <div className="content">
     <h1>Welcome to Classence!</h1>
      <p>Your go-to platform for effortless class organization, assignment<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; tracking,and collaboration.</p>
      <img src={cuate} alt="" />

      <div className="scroller">
      <div className="rec1"></div>
      <div className="rec2"></div>
      <div className="rec2"></div>
      <div className="rec2"></div>
      <div className="rec2"></div>
      </div>

   
     </div>
     

    </div>
  </div>
  
   
  )
}

export default Signup;