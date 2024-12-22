import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar el icono del marcador por defecto
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para renderizar el mapa con las ubicaciones de los usuarios
export const MapsAdm = () => {
  const [userLocations, setUserLocations] = useState([]);
  const API_URL = import.meta.env.VITE_BACK_API_URL;

  useEffect(() => {
    const fetchUserLocations = async () => {
      try {
        const response = await fetch(`${API_URL}/time`);
        if (!response.ok) {
          throw new Error(`Error al obtener los usuarios: ${response.statusText}`);
        }
        const data = await response.json();

        // Filtrar usuarios con `open: true` antes de actualizar el estado
        const openUsers = data.filter((user) => user.open === true);
        setUserLocations(openUsers);
      } catch (error) {
        console.error('Error fetching user locations:', error.message);
      }
    };

    fetchUserLocations();
  }, [API_URL]);

  return (
    <div className="relative">
      <MapContainer
        center={[45.5216391, -73.567026]} // Centrado inicial en coordenadas MTL
        zoom={10} // Zoom inicial
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-[400px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Renderizar marcadores para usuarios con open: true */}
        {userLocations.map((user, index) => (
          <Marker
            key={index}
            position={[user.location.latitude, user.location.longitude]}
          >
            <Popup>
              <div className="font-bold">
              {user.name} <br />
              </div>
              Working at {user.client} <br />
              {/* User at: {user.location.latitude.toFixed(4)}, {user.location.longitude.toFixed(4)} */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
