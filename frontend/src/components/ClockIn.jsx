import { useState, useEffect } from 'react';

const ClockIn = () => {
    const [clients, setClients] = useState([]); // Agregar los clientes
    const [km, setKm] = useState('');
    const [comments, setComments] = useState('');
    const [work, setWork] = useState([]);

    const works = ['Commercial', 'Supervisor', 'Residential', 'Displacement KM']

    //URL de la API backend
    const API_URL = import.meta.env.VITE_BACK_API_URL;;

    // Fecha y hora actual
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        // Cargar clientes desde el archivo JSON
        const fetchClientes = async () => {
            try {
                const response = await fetch(`${API_URL}/clients`);
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.log(API_URL);
                console.error('Error al cargar los clientes:', error);
            }
        };

        fetchClientes();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar el envío del formulario
        console.log({ km, comments, work });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded shadow-md">
            <div className="mb-4">
                <label htmlFor="client" className="block text-gray-700">Client:</label>
                <select id="client" className="border rounded p-2 w-full" required>
                    <option value=""></option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
            </div>

            <fieldset className="mb-4">
                <legend>Type of Work:</legend>
                {works.map((option) => (
                    <div key={option}>
                        <label htmlFor="scales">
                            <input 
                                type="checkbox" 
                                id={`work-${option}`}
                                name="scales" 
                                onChange={() => setWork(prevWork => ({
                                    ...prevWork,
                                    [option]: !prevWork[option] // Cambia solo el valor de la opción actual
                                }))}
                                className="mr-2"
                            />
                            {option} 
                        </label>
                     </div>
                ))}
            </fieldset>

            <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={currentDate}
                    readOnly
                    className="border rounded p-2 w-full bg-gray-200 cursor-not-allowed"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="hour" className="block text-gray-700">Hour:</label>
                <input
                    type="time"
                    id="hour"
                    value={currentTime}
                    readOnly
                    className="border rounded p-2 w-full bg-gray-200 cursor-not-allowed"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="km" className="block text-gray-700">Km:</label>
                <input
                    type="number"
                    id="km"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="comments" className="block text-gray-700">comments:</label>
                <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="border rounded p-2 w-full"
                    rows="4"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Send
            </button>
        </form>
    );
};

export default ClockIn;
