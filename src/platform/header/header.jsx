import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/AddOutlined';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import { useSelector } from 'react-redux';


const Header = () => {
    const [isEnrolled, setIsEnrolled] = useState(true);
    const sidebarWidth = useSelector((state) => state.sidebar.width);


    const toggleSwitch = () => {
        setIsEnrolled(!isEnrolled);
    };

    return (
        <div className="w-[82%] h-fit flex items-start flex-col pt-[15px] " style={{ marginLeft: sidebarWidth,transition: 'margin-left 0.3s ease'}}>
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
                        Joined
                    </div>
                    <div
                        className={`flex-1 p-2 ${
                            !isEnrolled ? 'text-white' : 'text-gray-700'
                        } transition-color duration-300`}
                    >
                        Created
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


         

        </div>
    );
};

export default Header;
