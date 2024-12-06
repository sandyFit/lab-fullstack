const express = require('express');
const ruta = express.Router();
const conexion = require('../config/db');

// Ruta para registrar cumplimiento e historia clínica
ruta.post('/', (req, res) => {
    const { cedula_paciente, cedula_medico, cita_id, motivo, tratamiento } = req.body;

    // Obtener paciente_id a partir de la cédula del paciente
    const consultaPaciente = 'SELECT id AS paciente_id FROM usuarios WHERE cedula = ? AND tipo_usuario = "paciente"';
    conexion.query(consultaPaciente, [cedula_paciente], (err, resultsPaciente) => {
        if (err || resultsPaciente.length === 0) {
            return res.status(400).json({
                error: 'No se encontró un paciente con la cédula proporcionada',
                detalles: err
            });
        }
        const paciente_id = resultsPaciente[0].paciente_id;

        // Obtener medico_id a partir de la cédula del médico
        const consultaMedico = 'SELECT id AS medico_id FROM usuarios WHERE cedula = ? AND tipo_usuario = "medico"';
        conexion.query(consultaMedico, [cedula_medico], (err, resultsMedico) => {
            if (err || resultsMedico.length === 0) {
                return res.status(400).json({
                    error: 'No se encontró un médico con la cédula proporcionada',
                    detalles: err
                });
            }
            const medico_id = resultsMedico[0].medico_id;

            // Registrar cumplimiento en la tabla 'cumplimiento'
            const consultaCumplimiento = `
                INSERT INTO cumplimiento (cita_id, tratamiento, motivo, cumplida, fecha_cumplimiento)
                VALUES (?, ?, ?, 1, NOW())
            `;
            conexion.query(consultaCumplimiento, [cita_id, tratamiento, motivo], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al registrar cumplimiento',
                        detalles: err
                    });
                }

                // Verificar que el registro se haya creado
                if (results.affectedRows === 0) {
                    return res.status(400).json({
                        error: 'No se pudo registrar el cumplimiento'
                    });
                }

                // Enviar respuesta exitosa
                res.status(201).json({
                    success: true,
                    message: 'Cumplimiento registrado exitosamente'
                });
            });
        });
    });
});

module.exports = ruta;
