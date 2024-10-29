import React from 'react'
import createnewpass from '../assets/creatnewpass.svg'
import './css/newpass.css';
const Newpass=()=> {
  return (
    <div id='newpasspage'>
      <div id='newpassleft'>
     <div id='newpassleftsub'>
     <h2 id="newpassh2">Create  a New password</h2>
     <p id="newpassp">Enter a new password to regain access to your <br/> account.</p>

    
     <input type="password"  className="textinput" placeholder='Password' />
     <input type="password"  className="textinput" placeholder=' Confirm Password' />
     <input type="submit" id='newpasssubmit'value="Reset Password"/>
     </div>

      </div>
      <div className="newpassright">
         <div className="newpasscontent">
          
          <img src={createnewpass} alt="" />
    
         </div>
         
        </div>



    </div>
  )
}

export default Newpass;
