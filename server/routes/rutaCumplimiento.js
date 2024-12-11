const express = require('express');
const ruta = express.Router();
const conexion = require('../config/db');

// Ruta para registrar cumplimiento e historia clínica
ruta.post('/', (req, res) => {
    const { cedula_paciente, cedula_medico, cita_id, motivo, tratamiento } = req.body;

    if (!cedula_paciente || !cedula_medico || !cita_id || !motivo || !tratamiento) {
        return res.status(400).json({
            error: 'Todos los campos son obligatorios.'
        });
    }

    // Obtener paciente_id a partir de la cédula del paciente
    const consultaPaciente = 'SELECT id AS paciente_id FROM usuarios WHERE cedula = ? AND tipo_usuario = "paciente"';
    conexion.query(consultaPaciente, [cedula_paciente], (err, resultsPaciente) => {
        if (err) {
            console.error('Error al buscar el paciente:', err);
            return res.status(500).json({
                error: 'Error interno al buscar el paciente.',
                detalles: err.message
            });
        }
        if (resultsPaciente.length === 0) {
            return res.status(404).json({
                error: 'No se encontró un paciente con la cédula proporcionada.'
            });
        }

        const paciente_id = resultsPaciente[0].paciente_id;

        // Obtener medico_id a partir de la cédula del médico
        const consultaMedico = 'SELECT id AS medico_id FROM usuarios WHERE cedula = ? AND tipo_usuario = "medico"';
        conexion.query(consultaMedico, [cedula_medico], (err, resultsMedico) => {
            if (err) {
                console.error('Error al buscar el médico:', err);
                return res.status(500).json({
                    error: 'Error interno al buscar el médico.',
                    detalles: err.message
                });
            }
            if (resultsMedico.length === 0) {
                return res.status(404).json({
                    error: 'No se encontró un médico con la cédula proporcionada.'
                });
            }

            const medico_id = resultsMedico[0].medico_id;

            // Registrar cumplimiento en la tabla 'cumplimiento'
            const consultaCumplimiento = `
                INSERT INTO cumplimiento (cita_id, tratamiento, motivo)
                VALUES (?, ?, ?)
            `;
            conexion.query(consultaCumplimiento, [cita_id, tratamiento, motivo], (err, results) => {
                if (err) {
                    console.error('Error al registrar el cumplimiento:', err);
                    return res.status(500).json({
                        error: 'Error interno al registrar el cumplimiento.',
                        detalles: err.message
                    });
                }

                if (results.affectedRows === 0) {
                    return res.status(400).json({
                        error: 'No se pudo registrar el cumplimiento.'
                    });
                }

                res.status(201).json({
                    success: true,
                    message: 'Cumplimiento registrado exitosamente.',
                    cumplimiento_id: results.insertId
                });
            });
        });
    });
});

module.exports = ruta;
