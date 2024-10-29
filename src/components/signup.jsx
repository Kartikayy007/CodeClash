
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import cuate  from '../assets/cuate.svg'
import './css/signup.css';
import img4 from '../assets/img4.svg';
import img5 from '../assets/img5.svg';
import img6 from '../assets/img6.svg';
import img7 from '../assets/img7.svg';
import img8 from '../assets/img8.svg';
const images = [img4, img5, img6,img7 ,img8];

const Signup = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='signUpPage'>
    <div className='left'>
        <div className="leftSub">
        <h2 id='signuph2'>Create Your Account</h2>
        <p>start organizing your classes, assignments, and<br/>meetings all in one place</p>

        <input type="text" className="textinput"placeholder="User Name"/>
        <br/>
        <input type="email" className="textinput" placeholder='Email Address'/>
        <br />
        <input type="password"  className="textinput"placeholder='Password' />
        <br />
      
       
        <div class="policy-container">
        <input type="checkbox" id="terms" name="terms"/>
        <label for="terms" id="terms">I agree to the &nbsp;<a href="" >Terms & conditions  </a>&nbsp;and <a href="">  <br/> &emsp;&emsp;&emsp; Privacy Policy</a></label>

  
</div>

    
        <input type="submit" value="Create Account" id='sub'/>
        <div className="asklogin"> <p>Already have an account?  <Link to="/login">Log in</Link></p></div>
       
       
        </div>
  
    </div>
    <div className="right">
     <div className="content">
    
     <div className="slider2">
            <div className="slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="slide"
                />
              ))}
            </div>
          </div>

          <div className="scroller">
            {images.map((_, index) => (
              <div
                key={index}
                className={`rec ${currentIndex === index ? 'recActive' : 'rec2'}`}
              ></div>
            ))}
          </div>

     

   
     </div>
     

    </div>
  </div>
  
   
  )
}

export default Signup;