import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        if (!token) {
            navigate('/login'); 
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('authToken');
        
        navigate('/login'); 
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white shadow-md rounded-lg p-12 max-w-lg w-full"> 
                <h1 className="text-3xl font-bold text-center mb-6">Welcome to Classence!</h1> 
                <p className="text-gray-600 text-center mb-8 text-lg"> 
                    This is a temporary landing page. Exciting stuff is coming soon...
                </p>
                <div className="text-center">
                    <button
                        className="bg-[#066769] text-white font-bold py-3 px-6 rounded text-lg" 
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
