import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'
import ClockIn from '../components/ClockIn';

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
          <div className="mx-auto max-w-screen-xl px-6 py-3">
            <div className="flex items-center justify-between text-blue-gray-900 border-0 rounded-lg p-8 shadow-lg">
              <Navbar />
            </div>
            <div className='m-10'>
              <ClockIn/>
            </div>

          </div>
        </>
    );
};

export default Dashboard;