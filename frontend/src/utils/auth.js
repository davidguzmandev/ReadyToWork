import { useNavigate } from 'react-router-dom';

export const useHandleLogout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return handleLogout;
};