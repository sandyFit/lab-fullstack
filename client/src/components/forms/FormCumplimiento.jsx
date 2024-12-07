import React, { useState } from 'react';
import { esCedulaValida } from '../../utils/functions';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const FormCumplimiento = ({cumplimiento, agregarCumplimiento}) => {

    const [formData, setFormData] = useState({
        cedula: '',
        medico: '',
        cita: '',
        motivo: '',
        tratamiento: ''
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            cedula_paciente: formData.cedula,
            cedula_medico: formData.medico,
            cita_id: formData.cita,
            motivo: formData.motivo,
            tratamiento: formData.tratamiento,
        };

        // Validaciones antes de enviar al servidor
        if (!formData.cedula || !formData.medico || !formData.cita || !formData.motivo
            || !formData.tratamiento) {
            toast.error('Todos los campos son obligatorios.');
            return;
        }

        if (!esCedulaValida(formData.cedula)) {
            toast.error('La cédula debe contener solo números entre 8 y 10 dígitos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/registro/cumplimiento', dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                toast.success('Cumplimiento registrada con éxito.');
                agregarCumplimiento(dataToSend);
                setFormData({
                    cedula: '',
                    medico: '',
                    cita: '',
                    motivo: '',
                    tratamiento: '',
                });
            } else {
                toast.error(response.data.message || 'Error desconocido al registrar el cumplimiento.');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                // Mapear los errores retornados por el backend
                switch (status) {
                    case 400:
                        toast.error(data.error || 'Datos inválidos. Revisa los campos ingresados.');
                        if (data.error.includes('paciente')) {
                            // Ejemplo: Resalta el campo de la cédula del paciente
                            document.querySelector('#cedulaPaciente').focus();
                        }
                        break;
                    case 404:
                        toast.error(data.error || 'Recurso no encontrado. Verifica la información.');
                        break;
                    case 409:
                        toast.error(data.error || 'Conflicto: La cita o disponibilidad ya están ocupadas.');
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
    }

    return (
        <section className="w-full flex flex-col justify-center items-center">
            <div className="w-[75%] flex flex-col justify-center ">
                <h3 className="uppercase text-center">Registro de Cumplimiento</h3>
                <div className="mt-2 text-center">
                    <p>Complete el formulario para actualizar la historia clínica y registrar el
                        cumplimiento de la cita médica.
                    </p>
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
                            Cédula del Médico:
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
                            
                            <label htmlFor="cita" className="flex flex-col w-1/3">
                                Número de Cita:
                                <input
                                    type="number"
                                    id="cita"
                                    name="cita"
                                    value={formData.cita}
                                    onChange={handleChange}
                                    placeholder='Ingrese el número de cita'
                                    required
                                />
                            </label>
                            <label htmlFor="motivo" className="flex flex-col w-1/3">
                                Motivo de la Cita:
                                <input
                                    type="text"
                                    id="motivo"
                                    name="motivo"
                                    value={formData.motivo}
                                    onChange={handleChange}
                                    placeholder='Ingrese el motivo de la consulta'
                                    required
                                />
                            </label>
                        </div>
                        <label htmlFor="tratamiento" className="flex flex-col">
                            Tratamiento:
                            <textarea
                                type="text"
                                id="tratamiento"
                                name="tratamiento"
                                value={formData.tratamiento}
                                onChange={handleChange}
                                required
                                placeholder="Ingrese el tratamiento recomendado"
                            />
                        </label>
                        <button type="submit">Registrar Cumplimiento</button>
                    </form>
                    <h3 className="text-lg font-semibold">Lista de Citas</h3>
                    <ul id="listaCitas" className="list-disc ml-6">
                        {cumplimiento.map((c, index) => (
                            <li key={index} className="mb-4">
                                <strong>Paciente:</strong> {c.cedula_paciente} <br />
                                <strong>Médico:</strong> {c.cedula_medico} <br />
                                <strong>Cita Número:</strong> {c.cita_id} <br />
                                <strong>Motivo:</strong> {c.motivo} <br />
                                <strong>Tratamiento:</strong> {c.tratamiento} <br />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default FormCumplimiento;
