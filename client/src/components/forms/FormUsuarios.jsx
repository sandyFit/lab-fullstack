import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const FormUsuarios = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        email: '',
        telefono: '',
        tipo_usuario: '', 
        password: ''
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones de los campos
        if (!formData.nombre || !formData.cedula || !formData.email || !formData.telefono || !formData.tipo_usuario || !formData.password) {
            toast.error('Todos los campos son obligatorios.');
            return;
        }

        // Validación del correo electrónico (expresión regular simple)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(formData.email)) {
            toast.error('Por favor ingrese un correo electrónico válido.');
            return;
        }

        // Validación de teléfono (asegurarse de que es numérico)
        if (isNaN(formData.telefono)) {
            toast.error('El número de contacto debe ser numérico.');
            return;
        }

        console.log(`Form values before submit: ${JSON.stringify(formData)}`);

        try {
            const response = await axios.post('http://localhost:5000/registro/usuario', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                toast.success('Usuario registrado con éxito');
                navigate('/disponibilidad');
            } else {
                console.log(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log('Algo salió mal:', error.response?.data || error.message);
            toast.error('Algo salió mal');
        }
    };


    return (
        <section className="w-full flex flex-col justify-center items-center">
            <div className="w-[75%] flex flex-col justify-center ">
                <h3 className="uppercase text-center">
                    Registro de Usuarios
                </h3>
                <p className="mt-2">
                    Complete el formulario para ingresar al dashboard.
                </p>
                <div
                    className="w-full flex flex-col bg-neutral-50 py-8 px-10 rounded-lg shadow-lg gap-6 mt-6"
                >
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

                        <div className="flex justify-between gap-4 w-full">
                            <label htmlFor="cedula" className="flex flex-col w-2/3">
                                Número de Cédula:
                                <input
                                    type="text"
                                    id="cedula"
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ingrese el número de cédula"
                                />
                            </label>

                            <label htmlFor="email" className="flex flex-col w-full">
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
                        </div>

                        <div className="flex justify-between gap-4">
                            <label htmlFor="telefono" className="flex flex-col w-1/2">
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

                            <label htmlFor="tipo_usuario" className="flex flex-col w-1/2">
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
                        </div>

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
                            className=""
                        >
                            Registrar Usuario
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormUsuarios;
