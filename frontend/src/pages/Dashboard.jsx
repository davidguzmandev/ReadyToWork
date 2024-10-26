import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirige a SignIn si no hay token
        }
    }, [navigate]);

    return (
        <>
          <Navbar />
        </>
    );
};

export default Dashboard;