import React, { useState } from "react";
import CentroDropdown from "../ui/CentroDropdown";
import { centrosAtencion } from "../../utils/centros";
import { esCedulaValida, esFechaValida } from "../../utils/functions";
import { toast } from 'react-hot-toast';

const FormCitas = ({cita, agregarCitas, disponibilidad}) => {
    const [centro, setCentro] = useState("Seleccione un de atención");
    const [paciente, setPaciente] = useState('');
    const [cedula, setCedula] = useState('');
    const [tipo, setTipo] = useState('');
    const [medico, setMedico] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [citas, setCitas] = useState([]);


    const centroSeleccionado = centrosAtencion.find(c => c.nombre === centro);

    function hayDisponibilidad(medico, fecha, hora) {

        const [horaCita, minutoCita] = hora.split(":").map(Number);

        const disponibilidadMedico = disponibilidad.find(
            d => d.medico === medico && d.fecha === fecha
        );      

        // Validar si se encuentra la disponibilidad
        if (!disponibilidadMedico) {
            return "El médico no está disponible en la fecha seleccionada.";
        }


        // Desglosar las horas del horario del médico
        const [horaInicioMedico, minutoInicioMedico] = disponibilidadMedico.horaInicio.split(":").map(Number);
        const [horaFinMedico, minutoFinMedico] = disponibilidadMedico.horaFin.split(":").map(Number);

        // Convertir horas de la cita y horarios de disponibilidad del médico a minutos
        const tiempoCita = horaCita * 60 + minutoCita;
        const tiempoInicioMedico = horaInicioMedico * 60 + minutoInicioMedico;
        const tiempoFinMedico = horaFinMedico * 60 + minutoFinMedico;

        // Verificar la hora de la cita dentro del horario del médico
        if (tiempoCita < tiempoInicioMedico || tiempoCita > tiempoFinMedico) {
            return "La hora seleccionada está fuera del horario del médico.";
        }

        // Si la hora y la fecha son correctas, la cita es válida
        return true;
    }

    function esCitaDeSeguimiento(ultimaCita) {
        return ultimaCita && this.tipo !== "urgencia" &&
            new Date(this.fecha) - new Date(ultimaCita.fecha) < 7 * 24 * 60 * 60 * 1000;
    }



    const handleSubmit = (e) => {
        e.preventDefault();

        if (!esFechaValida(fecha)) {
            toast.error('La fecha ingresada debe ser posterior a la fecha actual.')
            return;
        }

        if (!esCedulaValida(cedula)) {
            toast.error('La cédula debe contener 10 dígitos');
            return;
        }

        if (!centroSeleccionado) {
            toast.error('Debe Seleccionar un centro de atención');
            return;
        }

        const validarDisponibilidadMedico = hayDisponibilidad(medico, fecha, hora);

        if (validarDisponibilidadMedico !== true) {
            toast.error(validarDisponibilidadMedico);
            return;
        }

        const overlaps = disponibilidad.some(d =>
            d.fecha === fecha && d.medico === nombre &&
            ((horaInicio >= d.horaInicio && horaInicio < d.horaFin) ||
                (horaFin > d.horaInicio && horaFin <= d.horaFin))
        );
        if (overlaps) {
            toast.error("El horario seleccionado se cruza con otra cita.");
            return;
        }


        const nuevaCita = {
            paciente,
            cedula,
            tipo,
            medico,
            fecha,
            hora,
            centro,
        };

        agregarCitas(nuevaCita);
        console.log(citas);

        // Limpiar el formulario
        setCentro('Seleccione un centro de atención');
        setPaciente('');
        setCedula('');
        setTipo('');
        setMedico('');
        setFecha('');
        setHora('');
    };

    return (
        <section className='w-full flex flex-col justify-center items-center'>
            <div className="w-[75%] flex flex-col justify-center ">
                <h3 className='uppercase text-center'>
                    Registro de Citas
                </h3>
                <div className='mt-2'>
                    <p>
                        Complete el formulario para agendar una cita.
                        Recuerde que los horarios de atención son:
                    </p>
                    <ul>
                        <li className='list-disc ml-6'>
                            Centros de Atención Primaria: de 08:00 a 18:00.
                        </li>
                        <li className='list-disc ml-6'>
                            Centros de Atención Especializada: de 09:00 a 17:00.
                        </li>
                    </ul>
                </div>
                <div
                    className="w-full flex flex-col bg-neutral-50 py-8 px-10 rounded-lg shadow-lg gap-6
                    mt-6"
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <CentroDropdown
                            value={centro}
                            onChange={e => setCentro(e.target.value)}
                            options={centrosAtencion.map(c => c.nombre)}
                        />
                        <label htmlFor="paciente" className="flex flex-col">
                            Nombre del Paciente:
                            <input
                                type="text"
                                id="paciente"
                                placeholder="Ingrese el nombre completo del paciente"
                                value={paciente}
                                onChange={(e) => setPaciente(e.target.value)}
                                required
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

                        <label htmlFor="medicoCita" className="flex flex-col">
                            Médico:
                            <input
                                type="text"
                                id="medicoCita"
                                placeholder="Ingrese el nombre completo del médico"
                                value={medico}
                                onChange={(e) => setMedico(e.target.value)}
                                required
                            />
                        </label>
                        <div className="flex justify-between gap-4">
                            <label htmlFor="tipoDeCita" className="flex flex-col w-1/3">
                                Tipo de Solicitud:
                                <select
                                    id="tipoDeCita"
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
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
                            <label htmlFor="fechaCita" className="flex flex-col w-1/3">
                                Fecha de la Cita:
                                <input
                                    type="date"
                                    id="fechaCita"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    required
                                />
                            </label>

                            <label htmlFor="horaCita" className="flex flex-col w-1/3">
                                Hora de la Cita:
                                <input
                                    type="time"
                                    id="horaCita"
                                    value={hora}
                                    onChange={(e) => setHora(e.target.value)}
                                    min="08:00"
                                    max="18:00"
                                    step="1800"
                                    required
                                />
                            </label>
                        </div>
                        <button
                            type="submit"
                            className=""
                        >
                            Registrar Cita
                        </button>
                    </form>

                    <h3 className="text-lg font-semibold">Lista de Citas</h3>
                    <ul id="listaCitas" className="list-disc ml-6">
                        {citas.map((cita, index) => (
                            <li key={index} className="mb-4">
                                <strong>Centro:</strong> {cita.centro} <br />
                                <strong>Paciente:</strong> {cita.paciente} <br />
                                <strong>Tipo de Cita:</strong> {cita.tipo} <br />
                                <strong>Médico:</strong> {cita.medico} <br />
                                <strong>Fecha:</strong> {cita.fecha} <br />
                                <strong>Hora:</strong> {cita.hora}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default FormCitas;
