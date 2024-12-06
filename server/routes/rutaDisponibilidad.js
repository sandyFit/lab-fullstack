const express = require('express');
const ruta = express.Router();
const conexion = require('../config/db');

// Ruta para registrar disponibilidad de los médicos
ruta.post('/', (req, res) => {
    console.log("Ruta POST alcanzada");
    console.log("Cuerpo de la solicitud recibido:", req.body);

    const { centro_id, cedula, fecha, hora_inicio, hora_fin } = req.body;


    if (isNaN(centro_id)) {
        return res.status(400).json({ success: false, message: 'Centro inválido.' });
    }

    // Verificar si la cédula corresponde a un médico
    const consultaMedico = 'SELECT id FROM usuarios WHERE cedula = ? AND tipo_usuario = "medico"';
    console.log("Consulta SQL para verificar médico:", consultaMedico, [cedula]);

    conexion.query(consultaMedico, [cedula], (err, resultsMedico) => {
        if (err) {
            console.error("Error al verificar cédula de médico:", err);
            return res.status(500).json({
                error: 'Error al verificar la cédula del médico',
                detalles: err.message
            });
        }

        console.log("Resultado de la consulta de médico:", resultsMedico);
        if (resultsMedico.length === 0) {
            return res.status(400).json({
                error: 'No se encontró un médico con esa cédula'
            });
        }

        const medico_id = resultsMedico[0].id;

        // Verificar si ya hay disponibilidad registrada para ese médico, centro y fecha
        const consultaDisponibilidad = 'SELECT * FROM disponibilidad WHERE medico_id = ? AND centro_id = ? AND fecha = ?';
        console.log("Consulta SQL para verificar disponibilidad:", consultaDisponibilidad, [medico_id, centro_id, fecha]);

        conexion.query(consultaDisponibilidad, [medico_id, centro_id, fecha], (err, resultsDisponibilidad) => {
            if (err) {
                console.error("Error al verificar disponibilidad:", err);
                return res.status(500).json({
                    error: 'Error al verificar la disponibilidad',
                    detalles: err
                });
            }

            console.log("Resultado de la consulta de disponibilidad:", resultsDisponibilidad);

            if (resultsDisponibilidad.length > 0) {
                return res.status(409).json({
                    error: 'El médico ya tiene disponibilidad registrada para ese centro en esa fecha'
                });
            }

            // Registrar nueva disponibilidad
            const consultaRegistro = 'INSERT INTO disponibilidad (medico_id, fecha, hora_inicio, hora_fin, centro_id) VALUES (?, ?, ?, ?, ?)';
            console.log("Consulta SQL para registrar disponibilidad:", consultaRegistro, [medico_id, fecha, hora_inicio, hora_fin, centro_id]);

            conexion.query(consultaRegistro, [medico_id, fecha, hora_inicio, hora_fin, centro_id], (err, results) => {
                if (err) {
                    console.error("Error al registrar disponibilidad:", err);
                    return res.status(500).json({
                        error: 'Error al registrar disponibilidad',
                        detalles: err
                    });
                }

                console.log("Disponibilidad registrada correctamente:", results);
                res.status(200).json({
                    success: true,
                    message: 'Disponibilidad registrada correctamente',
                    data: results
                });
            });
        });
    });
});

module.exports = ruta;
