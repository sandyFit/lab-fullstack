const express = require('express');
const ruta = express.Router();
const conexion = require('../config/db');

// Ruta para registrar disponibilidad de los médicos
ruta.post('/', (req, res) => {
    const { cedula, fecha, hora_inicio, hora_fin, centro_id } = req.body;

    console.log("Cédula recibida:", cedula);  // Verificar valor de la cédula

    // Verificar si la cédula corresponde a un médico
    const consultaMedico = 'SELECT id FROM usuarios WHERE cedula = ? AND tipo_usuario = "medico"';
    console.log("Consulta SQL:", consultaMedico, [cedula]);  // Verificar consulta

    conexion.query(consultaMedico, [cedula], (err, resultsMedico) => {
        if (err) {
            return res.status(500).json({
                error: 'Error al verificar la cédula del médico',
                detalles: err
            });
        }

        console.log("Resultado consulta médico:", resultsMedico);  // Verificar resultados de la consulta

        if (resultsMedico.length === 0) {
            return res.status(400).json({
                error: 'No se encontró un médico con esa cédula'
            });
        }

        const medico_id = resultsMedico[0].id;

        // Verificar si la disponibilidad ya existe para ese médico y centro
        const consultaDisponibilidad = 'SELECT * FROM disponibilidad WHERE medico_id = ? AND centro_id = ? AND fecha = ?';
        conexion.query(consultaDisponibilidad, [medico_id, centro_id, fecha], (err, resultsDisponibilidad) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error al verificar la disponibilidad',
                    detalles: err
                });
            }

            if (resultsDisponibilidad.length > 0) {
                return res.status(400).json({
                    error: 'El médico ya tiene disponibilidad registrada para ese centro en esa fecha'
                });
            }

            // Registrar la nueva disponibilidad
            const consultaRegistro = 'INSERT INTO disponibilidad (medico_id, fecha, hora_inicio, hora_fin, centro_id) VALUES (?, ?, ?, ?, ?)';
            conexion.query(consultaRegistro, [medico_id, fecha, hora_inicio, hora_fin, centro_id], (err, results) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al registrar disponibilidad',
                        detalles: err
                    });
                }

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
