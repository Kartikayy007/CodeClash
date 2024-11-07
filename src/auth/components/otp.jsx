import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import './css/otp.css';
import bro1 from '../assets/pana.svg';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Otp = () => {
    const email = useSelector((state) => state.auth.email);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    
    const [timer, setTimer] = useState(59);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState(null);

    useEffect(() => {
        if (!sessionStorage.getItem('isRegistered') || !email) {
            navigate('/signup');
        }
    }, [navigate]);

    useEffect(() => {
        if (isResendDisabled) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(countdown);
                        setIsResendDisabled(false);
                        return 59;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [isResendDisabled]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleSubmit = async () => {
        const otp = inputRefs.current.map((input) => input.value).join('');
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify`, {
                email,
                otp
            });
            if (response.data.success) {
                toast.dismiss();
                toast.success(response.data.message, {
                    className: "custom-toastS",
                    hideProgressBar: true,
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
                setVerificationStatus(true);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response.data.error, {
                className: "custom-toast",
                hideProgressBar: true,
                autoClose: 3000,
            });
            setVerificationStatus(false);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/resend-otp`, {
                email
            });
            if (response.data.success) {
                toast.dismiss();
                toast.success(response.data.message, {
                    className: "custom-toastS",
                    hideProgressBar: true,
                    autoClose: 3000,
                });
                setIsResendDisabled(true);
                setTimer(59);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response.data.error, {
                className: "custom-toast",
                hideProgressBar: true,
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        if (/^\d$/.test(value)) {
            const nextInput = inputRefs.current[index + 1];
            if (nextInput) nextInput.focus();
        }
        
        if (inputRefs.current.every(input => input.value !== '')) {
            handleSubmit();
        }
    };

    const handleKeyPress = (e) => {
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!e.target.value && index > 0) {
                const prevInput = inputRefs.current[index - 1];
                if (prevInput) {
                    prevInput.value = '';
                    prevInput.focus();
                }
            } else {
                e.target.value = '';
            }
        } else if (e.key === 'ArrowLeft') {
            if (index > 0) {
                const prevInput = inputRefs.current[index - 1];
                if (prevInput) prevInput.focus();
            }
        } else if (e.key === 'ArrowRight') {
            if (index < inputRefs.current.length - 1) {
                const nextInput = inputRefs.current[index + 1];
                if (nextInput) nextInput.focus();
            }
        }
    };
    

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('Text'); 
        const otpDigits = pasteData.slice(0, 6);
        otpDigits.split('').forEach((digit, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = digit; 
            }
        });
        const nextEmptyInput = inputRefs.current.find((input) => !input.value);
        if (nextEmptyInput) {
            nextEmptyInput.focus();
        }
        
        if (inputRefs.current.every(input => input.value !== '')) {
            handleSubmit();
        }
    };

    return (
        <div className='otpPage'>
            {loading && (
                <div className="loading-overlay">
                    <div className="moving-circle"></div>
                </div>
            )}
            <div className='otpleft'>
                <div className="otpleftSub">
                    <h2 id="otph2">Verify Your Email</h2>
                    <p id="otpp">We’ve sent a 6-digit verification code to {email}</p>
                    <form className="digits">
                        <div id="digitbox">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    id={`digit${index + 1}`}
                                    maxLength="1"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    onKeyPress={handleKeyPress}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onChange={(e) => handleInputChange(e, index)}
                                    onPaste={handlePaste} 
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    className={verificationStatus === false ? 'error' : verificationStatus === true ? 'success' : ''}
                                />
                            ))}
                        </div>

                        <div id="otpmobscreenlogo">
                            <img src={bro1} alt="" />
                        </div>
                    </form>
                    <p id='resend'>
                        <span 
                            onClick={isResendDisabled ? null : handleClick}
                            style={{ color: isResendDisabled ? 'gray' : '#066769', cursor: isResendDisabled ? 'default' : 'pointer' }}
                        >
                            Resend OTP
                        </span> 
                        {isResendDisabled ? ` in ${timer}s` : ''}
                    </p>
                    <div className="askSign">
                        <p>Back to <Link to="/signup">Sign Up</Link></p>
                    </div>
                </div>
            </div>
            <div className="otpright">
                <div className="otpcontent">
                    <img src={bro1} alt="" />
                </div>
            </div>
            <ToastContainer position='top-center' />
        </div>
    );
}

export default Otp;
