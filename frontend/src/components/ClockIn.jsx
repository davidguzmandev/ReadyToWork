import { useState, useEffect } from 'react';

const ClockIn = () => {
    const [clients, setClients] = useState([]); // Agregar los clientes
    const [selectedClient, setSelectedClient] = useState(''); // Estado para el cliente seleccionado
    const [work, setWork] = useState([]);
    const [km, setKm] = useState('');
    const [comments, setComments] = useState('');
    const [location, setLocation] = useState({latitude:null, longitude:null});

    const works = ['Commercial', 'Supervisor', 'Residential', 'Displacement KM']

    //URL de la API backend
    const API_URL = import.meta.env.VITE_BACK_API_URL;;

    // Fecha y hora actual
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    //Obtener la ubicacion
    const fetchLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error al obtener la ubicación: ',error);
                }
            );
        } else {
            console.error('La geolocalización no es soportada en este navegador.')
        }
    };

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
        fetchLocation();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

    const punchIn = async (e) => {
        e.preventDefault();

        const formData = {
            data: {
                client: selectedClient,
                work: work,
                date: currentDate,
                hour: currentTime,
                km: km,
                comments: comments,
                location: location
            }
        };

        try {
            const response = await fetch(`${API_URL}/saveData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.statusText}`);
            }

            const data = await response.json(); // Espera el resultado de la conversión a JSON
            console.log(data); // Muestra los datos recibidos del servidor

        } catch (error) {
            console.error('Error al enviar los datos: ', error);
        }
        // Aquí puedes manejar el envío del formulario
        console.log({ formData});
    };

    return (
        <div className="mx-auto max-w-screen-xl px-6 py-3">
            <form onSubmit={punchIn} className="p-4 bg-gray-100 rounded shadow-md">
                <div className="mb-4">
                    <label htmlFor="client" className="block text-gray-700">Client:</label>
                    <select 
                        id="client"
                        className="border rounded p-2 w-full"
                        onChange={(e) => setSelectedClient(e.target.value)} // Cambiado a selectedClient
                        required>
                        <option value=""></option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.name}>{client.name}</option>
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
                <div className='text-right'>
                    <button
                        type="submit"
                        className="bg-green-800 text-white p-2 rounded hover:bg-green-600"
                    >
                        Punch-in
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClockIn;
