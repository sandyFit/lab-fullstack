import React, { useState } from 'react';
import { esFechaValida, primeraEnMayuscula, esCedulaValida } from '../../utils/functions';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const FormDisponibilidad = ({ disponibilidad, agregarDisponibilidad }) => {

    const [formData, setFormData] = useState({
        centro: '',
        cedula: '',
        fecha: '',
        horaInicio: '',
        horaFin: ''
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const { cedula, fecha, horaInicio, horaFin } = formData;

        const formDataProcessed = {
            centro_id: parseInt(formData.centro, 10), // Convertir a número
            cedula,
            fecha,
            hora_inicio: horaInicio,
            hora_fin: horaFin
        };
        console.log("Datos enviados al backend como formData:", formDataProcessed); 

        // Validar fecha
        if (!esFechaValida(formData.fecha)) {
            toast.error('La fecha ingresada debe ser posterior a la fecha actual.');
            return;
        }

        // Validar cédula
        if (!esCedulaValida(formData.cedula)) {
            toast.error('La cédula debe contener solo números entre 8 y 10 dígitos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/registro/disponibilidad',
                formDataProcessed, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log(response.config.headers);


            if (response.data.success) {
                toast.success('Disponibilidad registrada con éxito');
                agregarDisponibilidad(formDataProcessed);
                setFormData({
                    centro: '',
                    cedula: '',
                    fecha: '',
                    horaInicio: '',
                    horaFin: ''
                });

            } else {
                console.log(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error('El médico ya tiene disponibilidad registrada para el centro y la fecha seleccionados.');
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.error || 'Datos inválidos. Revisa los campos.');
            } else if (error.response?.status === 500) {
                toast.error('Error del servidor. Intenta de nuevo más tarde.');
            } else {
                toast.error('Algo salió mal. Por favor, revisa tu conexión e inténtalo nuevamente.');
            }
        }
    };

    return (
        <section className='w-full flex flex-col justify-center items-center'>
            <div className="w-[75%] flex flex-col justify-center items-center">
                <div className='mt-2'>
                    <h3 className='uppercase text-center'>
                        Registro de Disponibilidad
                    </h3>
                    <p>Estimado profesional de la salud, para garantizar un mejor servicio a sus pacientes
                        registre su disponibilidad a continuación. Recuerde que los horarios de atención son:</p>
                    <ul>
                        <li className='list-disc ml-6'>Centros de Atención Primaria: de 08:00 a 18:00.</li>
                        <li className='list-disc ml-6'>Centros de Atención Especializada: de 09:00 a 17:00.</li>
                    </ul>
                </div>
                <div className="w-full flex flex-col bg-neutral-50 py-8 px-10 rounded-lg shadow-lg gap-6 mt-6">
                    <form onSubmit={handleFormSubmit} className='flex flex-col gap-6'>
                        <label htmlFor="centro" className="flex flex-col ">
                            Centro de atención:
                            <select
                                id="centro"
                                name="centro"
                                value={formData.centro}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Seleccione el centro de Atención</option>
                                <option value="1">Centro de Atención Primaria</option>
                                <option value="2">Centro de Atención Especializada</option>
                            </select>
                        </label>

                        <label htmlFor="cedula" className='flex flex-col'>
                            Número de Cédula:
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                                placeholder="Ingrese el número de la cédula"
                            />
                        </label>
                        <div className="flex justify-between gap-8">
                            <label htmlFor="fecha" className='flex flex-col w-1/2'>
                                Fecha Disponible:
                                <input
                                    type="date"
                                    id="fecha"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <div className="flex gap-6">
                                <label htmlFor="hora-inicio" className='flex flex-col'>
                                    Hora de inicio:
                                    <input
                                        type="time"
                                        id="hora-inicio"
                                        name="horaInicio"
                                        value={formData.horaInicio}
                                        onChange={handleChange}
                                        min="08:00"
                                        max="18:00"
                                        step="1800"
                                        required
                                    />
                                </label>

                                <label htmlFor="hora-fin" className='flex flex-col'>
                                    Hora de fin:
                                    <input
                                        type="time"
                                        id="hora-fin"
                                        name="horaFin"
                                        value={formData.horaFin}
                                        onChange={handleChange}
                                        min="08:00"
                                        max="18:00"
                                        step="1800"
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                        <button type="submit">Registrar Disponibilidad</button>
                    </form>
                    <h4>Datos Registrados</h4>
                    <ul id="listaCitas" className="list-disc ml-6">
                        {disponibilidad.map((item) => (
                            <li key={item.cedula}>
                                <strong>Médico:</strong> {primeraEnMayuscula(item.nombre)} <br />
                                <strong>Cédula:</strong> {item.cedula} <br />
                                <strong>Fecha:</strong> {item.fecha} <br />
                                <strong>Horario:</strong> {item.horaInicio} - {item.horaFin} <br />
                                <strong>Centro:</strong> {item.centro}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default FormDisponibilidad;
