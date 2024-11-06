import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import Header from '../header/header';
import Performance from '../performance/performance';

const Dashboard = () => {
 


    

    return (<div>

        <Sidebar/>
        <Header/>
        <Performance/>
        
    </div>
    );
};

export default Dashboard;
