import React, { useState } from 'react';
import CentroDropdown from '../ui/CentroDropdown';
import { esFechaValida, esFechaDuplicada, primeraEnMayuscula, esCedulaValida } from '../../utils/functions';
import { toast } from 'react-hot-toast';
import { centrosAtencion } from '../../utils/centros';

const FormDisponibilidad = ({ disponibilidad, agregarDisponibilidad }) => {
    const [centro, setCentro] = useState('Seleccione un centro de atención');
    const [nombre, setNombre] = useState('');
    const [cedula, setCedula] = useState('');
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');

    const centroSeleccionado = centrosAtencion.find(c => c.nombre === centro);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Validar fecha
        if (!esFechaValida(fecha)) {
            toast.error('La fecha ingresada debe ser posterior a la fecha actual.');
            return;
        }

        // Verificar si la fecha está duplicada
        if (esFechaDuplicada(fecha, cedula, disponibilidad)) {
            toast.error('El médico ya tiene disponibilidad registrada en esta fecha.');
            return;
        }

        if (!esCedulaValida(cedula)) {
            toast.error('La cédula debe contener 10 dígitos');
            return;
        }

        // Validar que el horario ingresado coincide con el del centro seleccionado
        if (!centroSeleccionado) {
            toast.error('Seleccione un centro de atención válido.');
            return;
        }

        const { horaInicio: horaMin, horaFin: horaMax } = centroSeleccionado;

        if (horaInicio < horaMin || horaFin > horaMax) {
            toast.error(`Los horarios del ${centroSeleccionado.nombre} deben estar entre
                 ${horaMin} y ${horaMax}.`);
            return;
        }



        // Agregar la nueva disponibilidad
        const nuevaDisponibilidad = {
            centro,
            nombre,
            cedula,
            fecha,
            horaInicio,
            horaFin
        };
        agregarDisponibilidad(nuevaDisponibilidad);

        // Registro exitoso
        toast.success("Disponibilidad registrada con éxito.");
        setCentro("Seleccione un centro de atención");
        setNombre("");
        setCedula("");
        setFecha("");
        setHoraInicio("");
        setHoraFin("");
    };

    return (
        <section className='w-full flex flex-col justify-center items-center'>
            <div className="w-[75%] flex flex-col justify-center items-center">
                <h3 className='uppercase'>
                    Registro de Disponibilidad
                </h3>
                <div className='text-left mt-2'>
                    <p>
                        Estimado profesional de la salud, para brindarle un mejor servicio a sus pacientes, registre su disponibilidad a
                        continuación. 
                        Recuerde que los horarios de atención son:
                    </p>
                    <ul>
                        <li className='list-disc ml-6'>Centros de Atención Primaria: de 08:00 a 18:00.</li>
                        <li className='list-disc ml-6'>Centros de Atención Especializada: de 09:00 a 17:00.</li>
                    </ul>                   
                </div>
                <div className="w-full flex flex-col bg-neutral-50 py-8 px-10 rounded-lg shadow-lg 
                    gap-6 mt-6">
                    <form onSubmit={handleFormSubmit} className='flex flex-col gap-6'>
                        <CentroDropdown
                            value={centro}
                            onChange={e => setCentro(e.target.value)}
                            options={centrosAtencion.map(c => c.nombre)}
                        />

                        <label htmlFor="nombre" className='flex flex-col'>
                            <span className="text-sm text-gray-700">Nombre Completo:</span>
                            <input
                                type="text"
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                placeholder="Ingrese nombres y apellidos"
                            />
                        </label>
                        <label htmlFor="cedula" className='flex flex-col'>
                            <span className="text-sm text-gray-700">Número de Cédula:</span>
                            <input
                                type="text"
                                id="cedula"
                                value={cedula}
                                onChange={(e) => setCedula(e.target.value)}
                                required
                                placeholder="Ingrese el número de la cédula"
                            />
                        </label>
                        <div className="flex justify-between gap-8">
                            <label htmlFor="fecha" className='flex flex-col w-1/2'>
                                <span className="text-sm text-gray-700">Fecha Disponible:</span>
                                <input
                                    type="date"
                                    id="fecha"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    required
                                />
                            </label>
                            <div className="flex gap-6">
                                <label htmlFor="hora-inicio" className='flex flex-col'>
                                    <span className="text-sm text-gray-700">Hora de inicio:</span>
                                    <input
                                        type="time"
                                        id="hora-inicio"
                                        name="hora-inicio"
                                        value={horaInicio}
                                        onChange={(e) => setHoraInicio(e.target.value)}    
                                        min="08:00"
                                        max="18:00"
                                        step="1800"
                                        required
                                    />
                                </label>

                                <label htmlFor="hora-fin" className='flex flex-col'>
                                    <span className="text-sm text-gray-700">Hora de fin:</span>
                                    <input
                                        type="time"
                                        id="hora-fin"
                                        name="hora-fin"
                                        value={horaFin}
                                        onChange={(e) => setHoraFin(e.target.value)}    
                                        min="08:00"
                                        max="18:00"
                                        step="1800"
                                        required
                                    />
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="">
                            Registrar Disponibilidad
                        </button>
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
}

export default FormDisponibilidad;
