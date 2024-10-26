import { useState } from 'react';
import { IconMail, IconKey } from '@tabler/icons-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/', { email, password });
            console.log('Ingreso exitoso');
            const { token } = response.data;

            // Almacenar el token en el almacenamiento local o en una cookie
            localStorage.setItem('token', token);

            // Redirigir a otra página
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                console.log('Respuesta del servidor:', error.response.data);
                console.log('Estado de la respuesta:', error.response.status);
            } else {
                console.log('Error de red o configuración:', error.message);
            }
            setErrorMessage('Error en la autenticación:' + error);
        }
    };

  return (
    <>
        
                        <form onSubmit={handleSubmit}>
                            <div>
                                <div className="flex -mx-3">
                                    <div className="w-full px-3 mb-5">
                                        <label htmlFor="" className="text-xs font-semibold px-1">Email</label>
                                        <div className="flex">
                                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"> <IconMail stroke={1} /> </div>
                                            <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="johnsmith@example.com"
                                            required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex -mx-3">
                                    <div className="w-full px-3 mb-12">
                                        <label htmlFor="" className="text-xs font-semibold px-1">Password</label>
                                        <div className="flex">
                                            <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><IconKey stroke={1} /></div>
                                            <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" placeholder="************"
                                            required/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex -mx-3">
                                    <div className="w-full px-3 mb-5">
                                        <button className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">Log In</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    
    </>
  )
}
