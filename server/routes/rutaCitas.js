const express = require('express');
const ruta = express.Router();
const conexion = require('../config/db');

// Ruta para registrar una cita
ruta.post('/', (req, res) => {
    const { cedula_paciente, nombre_medico, tipo_solicitud, fecha, hora, motivo, tratamiento } = req.body;

    // Verificar si la cédula del paciente es válida
    const consultaPaciente = 'SELECT id FROM usuarios WHERE cedula = ? AND tipo_usuario = "paciente"';
    conexion.query(consultaPaciente, [cedula_paciente], (err, resultsPaciente) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al verificar la cédula del paciente',
                detalles: err
            });
        }

        if (resultsPaciente.length === 0) {
            return res.status(400).json({
                error: 'No se encontró un paciente con esa cédula'
            });
        }

        const paciente_id = resultsPaciente[0].id;

        // Buscar el medico_id por el nombre del médico
        const consultaMedico = 'SELECT id FROM usuarios WHERE nombre = ? AND tipo_usuario = "medico"';
        conexion.query(consultaMedico, [nombre_medico], (err, resultsMedico) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al verificar el nombre del médico',
                    detalles: err
                });
            }

            if (resultsMedico.length === 0) {
                return res.status(400).json({
                    error: 'No se encontró un médico con ese nombre'
                });
            }

            const medico_id = resultsMedico[0].id;

            // Verificar que el paciente no tiene cita programada en los próximos 7 días (excepto urgencias)
            if (tipo_solicitud !== 'urgencia') {
                // Verificar citas en los próximos 7 días
                const consultaCitasRecientes = `
                    SELECT * FROM citas 
                    WHERE paciente_id = ? 
                    AND DATE(fecha) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
                `;
                conexion.query(consultaCitasRecientes, [paciente_id], (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: 'Error al verificar citas previas',
                            detalles: err
                        });
                    }

                    if (results.length > 0) {
                        return res.status(400).json({
                            error: 'El paciente ya tiene una cita dentro de los próximos 7 días'
                        });
                    }

                    // Verificar que la cita esté dentro del horario del médico
                    const consultaDisponibilidadMedico = `
                        SELECT * FROM disponibilidad 
                        WHERE medico_id = ? AND fecha = ? 
                        AND hora_inicio <= ? AND hora_fin >= ?
                    `;
                    conexion.query(consultaDisponibilidadMedico, [medico_id, fecha, hora, hora], (err, disponibilidad) => {
                        if (err) {
                            return res.status(500).json({
                                error: 'Error al verificar disponibilidad del médico',
                                detalles: err
                            });
                        }

                        if (disponibilidad.length === 0) {
                            return res.status(400).json({
                                error: 'El médico no tiene disponibilidad en este horario'
                            });
                        }

                        // Verificar que la cita no se cruce con otras citas del mismo médico
                        const consultaCitasExistentes = `
                            SELECT * FROM citas 
                            WHERE medico_id = ? 
                            AND DATE(fecha) = ? 
                            AND (
                                (hora BETWEEN ? AND ?) OR 
                                (? BETWEEN hora AND hora)
                            )
                        `;
                        conexion.query(consultaCitasExistentes, [medico_id, fecha, hora, hora, hora], (err, citasExistentes) => {
                            if (err) {
                                return res.status(500).json({
                                    error: 'Error al verificar citas del médico',
                                    detalles: err
                                });
                            }

                            if (citasExistentes.length > 0) {
                                return res.status(400).json({
                                    error: 'La cita se cruza con otra cita ya registrada del médico en este horario'
                                });
                            }

                            // Insertar la nueva cita si todas las validaciones pasan
                            const consultaCita = `
                                INSERT INTO citas (paciente_id, medico_id, tipo_solicitud, fecha, hora, motivo, tratamiento) 
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                            `;
                            conexion.query(consultaCita, [paciente_id, medico_id, tipo_solicitud, fecha, hora, motivo, tratamiento], (err, results) => {
                                if (err) {
                                    return res.status(500).json({
                                        error: 'Error al registrar cita',
                                        detalles: err
                                    });
                                }
                                res.status(200).json({
                                    success: true,
                                    message: 'Cita registrada'
                                });
                            });
                        });
                    });
                });
            } else {
                // Insertar la cita de urgencia sin restricción de fecha
                const consultaCita = `
                    INSERT INTO citas (paciente_id, medico_id, tipo_solicitud, fecha, hora, motivo, tratamiento) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                conexion.query(consultaCita, [paciente_id, medico_id, tipo_solicitud, fecha, hora, motivo, tratamiento], (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: 'Error al registrar cita',
                            detalles: err
                        });
                    }
                    res.status(200).json({
                        success: true,
                        message: 'Cita registrada'
                    });
                });
            }
        });
    });
});

module.exports = ruta;
