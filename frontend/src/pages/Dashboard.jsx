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
                    <h1>Welcome, {user.name}</h1>
                    {matchingRecords.length > 0 ? (
                        <div>
                            <p>Email: {user.email}</p>
                            <p>ID: {user.id}</p>
                            <h2>Usuarios con el mismo email:</h2>
                            <ul>
                                {matchingRecords.map((record) => (
                                    <li key={record.id}>
                                        <p>Client: {record.client}</p>
                                        <p>Work: {Object.keys(record.work).join(', ')}</p>
                                        <p>KM: {record.km}</p>
                                        <p>Comments: {record.comments}</p>
                                        <p>Location: {record.location.latitude}, {record.location.longitude}</p>
                                        <p>Date: {record.date}</p>
                                        <p>Hour: {record.hour}</p>
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