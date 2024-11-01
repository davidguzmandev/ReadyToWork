import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../partials/Navbar'
import { UserContext } from '../utils/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRecording, setTimeRecording] = useState([]); // Agregar los rejistros de tiempo
  const [matchingRecords, setMatchingRecords] = useState([]); // Registros con email coincidente

  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_BACK_API_URL;;

  useEffect(() => {
    if(!user) return; // Espera a que user este definido
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/'); // Redirige a SignIn si no hay token
      }

      // Cargar registros desde el archivo JSON y encontrar coincidencias de email
    const fetchTimeRecording = async () => {
        try {
          const response = await fetch(`${API_URL}/time`);
          const data = await response.json();
          setTimeRecording(data);
  
          // Filtrar los registros que coinciden con el email del usuario logueado
          const recordsWithSameEmail = data.filter((record) => record.email === user.email);
          setMatchingRecords(recordsWithSameEmail);
  
         
        } catch (error) {
          console.error('Error al cargar los registros:', error);
        }
      };

    fetchTimeRecording();
  }, [navigate, user, API_URL]);

  return (
      <>
        <Navbar />
        <div className="mx-auto max-w-screen-xl px-6 py-3">
            {user ? (
                <div>
                    <h2 className='font-semibold text-xl'>Welcome, {user.name}</h2>
                    {matchingRecords.length > 0 ? (
                        <div>
                            <p className='text-sm mb-4'>{user.email}</p>
                            <ul className='flex'>
                                {matchingRecords.map((record) => (
                                    <li 
                                    key={record.id}
                                    className='max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-2'
                                    >
                                        <div className="p-5">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{record.client}</h5>
                                            <p className='font-normal text-gray-700 dark:text-gray-400'>Work: {Object.keys(record.work).join(', ')}</p>
                                            <p className='font-normal text-gray-700 dark:text-gray-400'>KM: {record.km}</p>
                                            <p className='font-normal text-gray-700 dark:text-gray-400'>Comments: {record.comments}</p>
                                            <p className='font-normal text-gray-700 dark:text-gray-400'>Location: {record.location.latitude}, {record.location.longitude}</p>
                                            <p className='font-normal text-gray-700 dark:text-gray-400'>Date: {record.date}</p>
                                            <p className='font-normal text-gray-700 dark:text-gray-400'>Hour: {record.hour}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No hay registros con el mismo email.</p>
                    )}
                </div>
            ) : (
                <p>Cargando datos del usuario...</p>
            )}
        </div>
      </>
  );
};

export default Dashboard;