import React from 'react'
import { Link } from 'react-router-dom';
import resetlink from '../assets/resetlink.svg'
import './css/resetlink.css';

const Resetlink = () => {


  return (
    <div id="resetlinkpage">
      <div id='resetlinkleft'>
        <div id='resetlinkleftmain'>
       
    <h2 id='resetlinkh2'>Reset your password</h2>
    <p id='sentpass'>We have sent a password reset link to <br/> <a href="me@gmail.com" id='mailId'>me@gmail.com</a><br/> Click the link to reset your password. If you don't <br/>see it in your inbox, check your inbox folder.</p>
    
        <p id="recievemail">Didn't Recieve Email?</p>
        <input type="submit" id='resetlinksubmit'value="Resend Link"/>
        <div className="asklogin"> <p id='resetRem'>Remember your password?  <Link to="/login">Log in</Link></p></div>
        </div>
     
      </div>
      <div id="resetlinkright">
      <div id ="resetlinkcontent"> 
      <img src={resetlink} alt="" />

      </div>
      </div>
      
    </div>
  )
}

export default Resetlink;
