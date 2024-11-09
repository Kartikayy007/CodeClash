import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountIcon from '@mui/icons-material/AccountCircleOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';


const Header = () => {
    const [isFocused, setIsFocused] = useState(false);

 


    

    return (
        
        <div className='  w-[82%] h-fit flex  items-center flex-col pt-[15px] ml-[18%] '>
            <div className="relative flex items-center ">
             {!isFocused && (
                    <SearchIcon
                        className="absolute left-5 text-gray-400 mt-1  "
                        style={{ fontSize: 25 }}
                    />
                )}
                <input
                    id="searchClass"
                    type="text"
                    placeholder={!isFocused ? "        Search for your classes & assignments" : ""}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none "
                    style={{ width: '313px', height: '38px', margin: '0',marginRight:'150px' }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}


                />
            </div>
            <div className=' w-[150px]  absolute right-[10px] flex justify-center items-center gap-[24px]'>

                <div>
                    <AddIcon style={{ fontSize: 30}} />

                </div>
                <div>
                    <NotificationsIcon style={{ fontSize: 30 }} />

                </div>
                <div>
                    <AccountIcon style={{ fontSize: 30 }} />

                </div>
            </div>
  
  <div className='w-full h-[70px]'>
    <p className='text-[18px] pt-[15px] pl-[25px] font-medium'>Good Morning, Shreyanshu!</p>
  </div>
         
         
            
        </div>
        
     
    );
};

export default Header;
