import React from 'react';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';
import CalendarComponent from './calenderComp';
import Reminders from '../reminder/reminder'


const Calender = () => {
 


    

    return (<div className='bg-[#E1EAE8] h-[100vh]'>

        <Sidebar/>
        <Header/>
        <CalendarComponent />
   

        
      
       
       
        
        </div>
        
        
   
    );
};

export default Calender;
