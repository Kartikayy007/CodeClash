// Header.js
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/AddOutlined';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';

const Header = () => {
    const [isEnrolled, setIsEnrolled] = useState(true);

    const toggleSwitch = () => {
        setIsEnrolled(!isEnrolled);
    };

    return (
        <div className="w-[82%] h-fit flex items-start flex-col pt-[15px] ml-[18%] ">
            <div
                onClick={toggleSwitch}
                className="relative flex items-center bg-[#D9DEDE] rounded-lg cursor-pointer ml-[40px]"
                style={{ width: '150px', height: '38px' }}
            >
                <div
                    className={`absolute top-0 ml-[2%] mt-[4px] left-0 h-[80%] w-[48%] bg-[#008080] rounded-lg transition-transform duration-300 ${
                        isEnrolled ? 'transform translate-x-0' : 'transform translate-x-full'
                    }`}
                ></div>
                
                <div className="flex w-full text-center font-medium z-10">
                    <div
                        className={`flex-1 p-2 ${
                            isEnrolled ? 'text-white' : 'text-gray-700'
                        } transition-color duration-300`}
                    >
                        Enrolled
                    </div>
                    <div
                        className={`flex-1 p-2 ${
                            !isEnrolled ? 'text-white' : 'text-gray-700'
                        } transition-color duration-300`}
                    >
                        Teaching
                    </div>
                </div>
            </div>

            <div className="w-[150px] absolute right-[10px] flex justify-center items-center gap-[24px]">
                <div>
                    <AddIcon style={{ fontSize: 30 }} />
                </div>
                <div>
                    <NotificationsIcon style={{ fontSize: 30 }} />
                </div>
                <div>
                    <AccountIcon style={{ fontSize: 30 }} />
                </div>
            </div>


            <div className="w-full h-[70px]">
                <p className="text-[23px] pt-[15px] pl-[40px] font-semibold mt-[20px]">Good Morning, Shreyanshu!</p>
            </div>

        </div>
    );
};

export default Header;
