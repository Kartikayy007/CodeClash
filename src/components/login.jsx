import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import img1 from '../assets/img1.svg';
import './css/login.css';
const Login = () => {

  
 

 

  return (
  <div className='loginPage'>
    <div className='left'>
        <div className="leftSub">
        <h2>Log In</h2>
        <p>to access your classes, assignments and more. </p>

        <input type="email" placeholder='Email address'/>
        <br />
        <input type="password" placeholder='Password' />
        <br />
      
       
        <div class="checkbox-container">
        <a href="">Forget Password?</a>
        <input type="checkbox" id="remember" name="remember"/>
        <label for="remember">Remember me</label>

  
</div>

    
        <input type="submit" value="Log in" />
        <div className="askSign"> <p>Don't have an account?  <a href="">Sign up</a></p></div>
       
       
        </div>
  
    </div>
    <div className="right">
     <div className="content">
      <h1>Welcome back to Classence!</h1>
      <p>Where learning and collaboration happen seamlessly</p>
      <img src={img1} alt="" />

      <div className="scroller">
      <div className="rec1"></div>
      <div className="rec2"></div>
      <div className="rec2"></div>
      </div>

   
     </div>
     

    </div>
  </div>
)}

export default Login;