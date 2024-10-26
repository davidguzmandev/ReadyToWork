import { useState } from 'react';
import { useHandleLogout } from '../utils/auth';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importa iconos para abrir y cerrar el menú

export function NavList() {
    const handleLogout = useHandleLogout();
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className='relative'>
            {/* Icono del burger menu */}
            <button
                onClick={toggleMenu}
                className='text-white lg:hidden focus:outline-none'
            >
                {isOpen ? <FaTimes size={24}/> : <FaBars size={24} />}
            </button>

        <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
            Home
            </a>
        
        
            <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
            Account
            </a>

        
            <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
            Time
            </a>

        
            <button 
                onClick={handleLogout} 
                className="flex items-center hover:text-blue-500 transition-colors"
            >
                Logout
            </button>

        </ul>
        </nav>
    );
}

