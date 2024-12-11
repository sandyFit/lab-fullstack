const express = require('express');
const ruta = express.Router();
const conexion = require('../config/db');

ruta.post('/', (req, res) => {
    const {cedula_paciente, nombre_medico, tipo_cita, fecha, hora, motivo } = req.body;

    // Verificar si la cédula del paciente es válida
    const consultaPaciente = 'SELECT id FROM usuarios WHERE cedula = ? AND tipo_usuario = "paciente"';
    conexion.query(consultaPaciente, [cedula_paciente], (err, resultsPaciente) => {
        if (err) {
            return res.status(500).json({
                error: 'Hubo un error al verificar la cédula del paciente.',
                detalles: err.message
            });
        }

        if (resultsPaciente.length === 0) {
            return res.status(404).json({
                error: 'El paciente con la cédula proporcionada no fue encontrado.'
            });
        }

        const paciente_id = resultsPaciente[0].id;

        // Buscar el medico_id por el nombre del médico
        const consultaMedico = 'SELECT id FROM usuarios WHERE nombre = ? AND tipo_usuario = "medico"';
        conexion.query(consultaMedico, [nombre_medico], (err, resultsMedico) => {
            if (err) {
                return res.status(500).json({
                    error: 'Hubo un error al verificar el nombre del médico.',
                    detalles: err.message
                });
            }

            if (resultsMedico.length === 0) {
                return res.status(404).json({
                    error: `No se encontró un médico con el nombre "${nombre_medico}".`
                });
            }

            const medico_id = resultsMedico[0].id;

            // Verificar que el paciente no tiene cita programada en los próximos 7 días (excepto urgencias)
            if (tipo_cita !== 'urgencia') {
                const consultaCitasRecientes = `
                    SELECT * FROM citas 
                    WHERE paciente_id = ? 
                    AND DATE(fecha) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
                `;
                conexion.query(consultaCitasRecientes, [paciente_id], (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: 'Hubo un error al verificar citas previas del paciente.',
                            detalles: err.message
                        });
                    }

                    if (results.length > 0) {
                        return res.status(409).json({
                            error: 'El paciente ya tiene una cita programada en los próximos 7 días.'
                        });
                    }

                    // Verificar que la cita esté dentro del horario del médico
                    const consultaDisponibilidadMedico = `
                        SELECT * FROM disponibilidad 
                        WHERE medico_id = ? AND fecha = ? 
                        AND hora_inicio <= ? AND hora_fin >= ?
                    `;
                    conexion.query(consultaDisponibilidadMedico, [medico_id, fecha, hora, hora],
                        (err, disponibilidad) => {
                            if (err) {
                                return res.status(500).json({
                                    error: 'Hubo un error al verificar la disponibilidad del médico.',
                                    detalles: err.message
                                });
                            }

                            if (disponibilidad.length === 0) {
                                return res.status(409).json({
                                    error: 'El médico no tiene disponibilidad en el horario y fecha seleccionados.'
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
                            conexion.query(consultaCitasExistentes, [medico_id, fecha, hora, hora, hora],
                                (err, citasExistentes) => {
                                    if (err) {
                                        return res.status(500).json({
                                            error: 'Hubo un error al verificar citas previas del médico.',
                                            detalles: err.message
                                        });
                                    }

                                    if (citasExistentes.length > 0) {
                                        return res.status(409).json({
                                            error: 'El horario seleccionado ya está ocupado por otra cita del médico.'
                                        });
                                    }

                                    // Insertar la nueva cita si todas las validaciones pasan
                                    const consultaCita = `
                                        INSERT INTO citas (paciente_id, medico_id, tipo_cita, fecha, hora, motivo) 
                                        VALUES (?, ?, ?, ?, ?, ?)
                                    `;
                                    conexion.query(consultaCita,
                                        [paciente_id, medico_id, tipo_cita, fecha, hora, motivo],
                                        (err, results) => {
                                            if (err) {
                                                return res.status(500).json({
                                                    error: 'Hubo un error al registrar la cita.',
                                                    detalles: err.message
                                                });
                                            }
                                            res.status(201).json({
                                                success: true,
                                                message: 'La cita se ha registrado exitosamente.',
                                                data: results
                                            });
                                        });
                                });
                        });
                });
            } else {
                // Insertar la cita de urgencia sin restricción de fecha
                const consultaCita = `
                    INSERT INTO citas (paciente_id, medico_id, tipo_cita, fecha, hora, motivo) 
                    VALUES (? ?, ?, ?, ?, ?, ?)
                `;
                conexion.query(consultaCita, [paciente_id, medico_id, tipo_cita, fecha, hora, motivo],
                    (err, results) => {
                        if (err) {
                            return res.status(500).json({
                                error: 'Hubo un error al registrar la cita de urgencia.',
                                detalles: err.message
                            });
                        }
                        res.status(201).json({
                            success: true,
                            message: 'La cita de urgencia se ha registrado exitosamente.',
                            data: results
                        });
                    });
            }
        });
    });
});

module.exports = ruta;
