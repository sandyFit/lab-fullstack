import React, { useState } from "react";
import { esCedulaValida, esFechaValida } from "../../utils/functions";
import { toast } from 'react-hot-toast';
import axios from 'axios';

const FormCitas = ({ cita, agregarCita }) => {
    const [formData, setFormData] = useState({
        cedula: '',
        medico: '',
        tipo: '',
        fecha: '',
        hora: '',
        motivo: ''
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

        const dataToSend = {
            cedula_paciente: formData.cedula,
            nombre_medico: formData.medico,
            tipo_solicitud: formData.tipo,
            fecha: formData.fecha,
            hora: formData.hora,
            motivo: formData.motivo,
        };

        // Validaciones antes de enviar al servidor
        if (!formData.cedula || !formData.medico || !formData.tipo || !formData.fecha || !formData.hora || !formData.motivo) {
            toast.error('Todos los campos son obligatorios.');
            return;
        }

        if (!esFechaValida(formData.fecha)) {
            toast.error('La fecha ingresada debe ser posterior a la fecha actual.');
            return;
        }

        if (!esCedulaValida(formData.cedula)) {
            toast.error('La cédula debe contener solo números entre 8 y 10 dígitos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/registro/cita', dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                toast.success('Cita registrada con éxito.');
                agregarCita(dataToSend);
                setFormData({
                    cedula: '',
                    medico: '',
                    tipo: '',
                    fecha: '',
                    hora: '',
                    motivo: ''
                });
            } else {
                toast.error(response.data.message || 'Error desconocido al registrar la cita.');
            }
        } catch (error) {
            // Manejo de errores con base en el código HTTP del servidor
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        toast.error(data.error || 'Datos inválidos. Revisa los campos ingresados.');
                        break;
                    case 404:
                        toast.error(data.error || 'Recurso no encontrado. Verifica la información.');
                        break;
                    case 409:
                        toast.error(data.error || 'Conflicto: Verifica la disponibilidad del médico o las citas existentes.');
                        break;
                    case 500:
                        toast.error('Error del servidor. Intenta de nuevo más tarde.');
                        break;
                    default:
                        toast.error('Ocurrió un error desconocido. Intenta de nuevo más tarde.');
                }
            } else {
                toast.error('Error de red: Verifica tu conexión a Internet.');
            }
        }
    };

    return (
        <section className="w-full flex flex-col justify-center items-center">
            <div className="w-[75%] flex flex-col justify-center ">
                <h3 className="uppercase text-center">Registro de Citas</h3>
                <div className="mt-2 text-center">
                    <p>Complete el formulario para agendar una cita.</p>
                </div>
                <div className="w-full flex flex-col bg-neutral-50 py-8 px-10 rounded-lg shadow-lg gap-6 mt-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <label htmlFor="cedula" className="flex flex-col">
                            Cédula del Paciente:
                            <input
                                type="text"
                                id="cedula"
                                name="cedula"
                                placeholder="Ingrese el número de la cédula"
                                value={formData.cedula}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label htmlFor="medico" className="flex flex-col">
                            Nombre del Médico:
                            <input
                                type="text"
                                id="medico"
                                name="medico"
                                value={formData.medico}
                                onChange={handleChange}
                                required
                                placeholder="Ingrese el nombre completo del médico"
                            />
                        </label>
                        <div className="flex justify-between gap-4">
                            <label htmlFor="tipo" className="flex flex-col w-1/3">
                                Tipo de Solicitud:
                                <select
                                    id="tipo"
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    required
                                >
                                    <option disabled value="">
                                        Seleccione el tipo de cita
                                    </option>
                                    <option value="normal">Normal</option>
                                    <option value="prioritaria">Prioritaria</option>
                                    <option value="urgencia">Urgencia</option>
                                </select>
                            </label>
                            <label htmlFor="fecha" className="flex flex-col w-1/3">
                                Fecha de la Cita:
                                <input
                                    type="date"
                                    id="fecha"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label htmlFor="hora" className="flex flex-col w-1/3">
                                Hora de la Cita:
                                <input
                                    type="time"
                                    id="hora"
                                    name="hora"
                                    value={formData.hora}
                                    onChange={handleChange}
                                    min="08:00"
                                    max="18:00"
                                    step="1800"
                                    required
                                />
                            </label>
                        </div>
                        <label htmlFor="motivo" className="flex flex-col">
                            Motivo de la Consulta:
                            <input
                                type="text"
                                id="motivo"
                                name="motivo"
                                value={formData.motivo}
                                onChange={handleChange}
                                required
                                placeholder="Ingrese el motivo de la consulta"
                            />
                        </label>
                        <button type="submit">Registrar Cita</button>
                    </form>
                    <h3 className="text-lg font-semibold">Lista de Citas</h3>
                    <ul id="listaCitas" className="list-disc ml-6">
                        {cita.map((c, index) => (
                            <li key={index} className="mb-4">
                                <strong>Paciente:</strong> {c.cedula_paciente} <br />
                                <strong>Médico:</strong> {c.nombre_medico} <br />
                                <strong>Tipo:</strong> {c.tipo_solicitud} <br />
                                <strong>Fecha:</strong> {c.fecha} <br />
                                <strong>Hora:</strong> {c.hora} <br />
                                <strong>Motivo:</strong> {c.motivo}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default FormCitas;
