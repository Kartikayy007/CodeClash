
import React, { useState, useEffect} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ReactDom from "react-dom"
import axios from 'axios';
import { setEmail } from '../features/authSlice'; 


import cuate  from '../assets/cuate.svg'
import './css/signup.css';
import img4 from '../assets/img4.svg';
import img5 from '../assets/img5.svg';
import img6 from '../assets/img6.svg';
import img7 from '../assets/img7.svg';
import img8 from '../assets/img8.svg';
const images = [img4, img5, img6,img7 ,img8];

const Signup = () => {

  const [name, setName] = useState('');
  const [email, setEmailState] = useState('');
  const [password, setPassword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);
  const handleSubmit = async (e) => {
   
    e.preventDefault();
   
    
  

    try {
      const response = await axios.post("https://singhanish.me/api/auth/register", {
        name,
        email,
        password
      });
      
      if (response.data.success) {
       
        dispatch(setEmail(email));

        navigate('/otp');
  
        
      }
    } catch (error) {

    } finally {
      

      setName('');
      setEmailState('');
      setPassword('');
    }
  };

  return (
    <div className='signUpPage'>
    <div className='left'>
        <div className="leftSub">
        <h2 id='signuph2'>Create Your Account</h2>
        <p>start organizing your classes, assignments, and<br/>meetings all in one place</p>

        <form onSubmit={handleSubmit}>

        <input
              type="text"
              className="textinput"
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br/>
            <input
              type="email"
              className="textinput"
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmailState(e.target.value)}
            />
            <br />
            <input
              type="password"
              className="textinput"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />

      
       
        <div className="policy-container">
        <input type="checkbox" id="terms" name="terms"/>

        <label htmlFor="terms" id="terms">I agree to the &nbsp;<a href="" >Terms & conditions  </a>&nbsp;and <a href="">  <br/>&emsp;&emsp;&emsp; Privacy Policy</a></label>


  
</div>

    
        <input type="submit" value="Create Account" id='sub'/>
        </form>
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