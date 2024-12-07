import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FormUsuarios = ({ closeModal }) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        email: '',
        telefono: '',
        tipo_usuario: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.nombre ||
            !formData.cedula ||
            !formData.email ||
            !formData.telefono ||
            !formData.tipo_usuario ||
            !formData.password
        ) {
            toast.error('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/registro/usuario', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.success) {
                toast.success('Usuario registrado con éxito');
                navigate('/disponibilidad');

                closeModal(); // Cerrar el modal al finalizar el registro
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Algo salió mal');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <label htmlFor="nombre" className="flex flex-col">
                Nombre Completo:
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingrese nombres y apellidos"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
            </label>
            <label htmlFor="cedula" className="flex flex-col">
                Número de Cédula:
                <input
                    type="text"
                    id="cedula"
                    name="cedula"
                    placeholder="Ingrese el número de cédula"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                />
            </label>
            <label htmlFor="email" className="flex flex-col">
                Correo Electrónico:
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ej: usuario@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </label>
            <label htmlFor="telefono" className="flex flex-col">
                Número de Contacto:
                <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    placeholder="Ingrese su número telefónico"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
            </label>
            <label htmlFor="tipo_usuario" className="flex flex-col">
                Tipo de Usuario:
                <select
                    id="tipo_usuario"
                    name="tipo_usuario"
                    value={formData.tipo_usuario}
                    onChange={handleChange}
                    required
                >
                    <option disabled value="">
                        Seleccione el tipo de usuario
                    </option>
                    <option value="medico">Médico</option>
                    <option value="paciente">Paciente</option>
                </select>
            </label>
            <label htmlFor="password" className="flex flex-col">
                Contraseña:
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </label>
            <button
                type="submit"
                className="px-4 "
            >
                Registrar Usuario
            </button>
        </form>
    );
};

export default FormUsuarios;
