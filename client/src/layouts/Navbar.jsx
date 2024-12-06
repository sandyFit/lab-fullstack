import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="w-full h-24 bg-emerald-500 flex justify-between items-center px-32">
            <Link to='/' className="text-white text-2xl font-[600]">Gestión de Citas</Link>

            <ul className="flex justify-between gap-20 uppercase text-white">
                {/* Dropdown para Médicos */}
                <li className="cursor-pointer relative group">
                    Médicos
                    <ul className="dropdown group-hover:block">
                        <li className="block px-4 py-2 bg-white text-emerald-500 hover:bg-emerald-100">
                            <a href="/disponibilidad">Registro de Disponibilidad</a>
                        </li>
                        <li className="block px-4 py-2 bg-white text-emerald-500 hover:bg-emerald-100">
                            <a href="/cumplimiento">Registro de Cumplimiento</a>
                        </li>
                    </ul>
                </li>

                {/* Dropdown para Pacientes */}
                <li className="cursor-pointer relative group">
                    Pacientes
                    <ul className="dropdown group-hover:block">
                        <li className="block px-4 py-2 bg-white text-emerald-500 hover:bg-emerald-100">
                            <a href="/citas">Registro de Citas</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
