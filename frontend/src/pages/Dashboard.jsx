import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'
import { UserContext } from '../utils/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/'); // Redirige a SignIn si no hay token
      }
  }, [navigate]);

  return (
      <>
        <Navbar />
        <div>
            <h1>Welcome, {user ? user.name : 'Guest'}</h1>
            {user && (
                <div>
                    <p>Email: {user.email}</p>
                    <p>ID: {user.id}</p>
                </div>
            )}
        </div>
      </>
  );
};

export default Dashboard;