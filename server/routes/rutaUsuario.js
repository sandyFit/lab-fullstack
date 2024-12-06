const express = require('express');
const ruta = express.Router();
const conexion = require('../config/db');

ruta.post('/', (req, res) => {
        const { nombre, cedula, email, telefono, tipo_usuario, password } = req.body;

        // Verificar que el tipo de usuario sea válido
        if (!['medico', 'paciente'].includes(tipo_usuario)) {
            return res.status(400).json({
                error: 'El tipo de usuario debe ser "medico" o "paciente".'
            });
        }

        // Insertar el nuevo usuario en la base de datos
        const consultaRegistro = `INSERT INTO usuarios (nombre, cedula, email, telefono, tipo_usuario, 
        password) VALUES (?, ?, ?, ?, ?, ?)`;
        conexion.query(consultaRegistro, [nombre, cedula, email, telefono, tipo_usuario, password],
            (err, results) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Error al registrar el usuario',
                        detalles: err
                    });
                }

                res.status(200).json({
                    success: true,
                    message: 'Usuario registrado con éxito',
                    usuario_id: results.insertId,
                    tipo_usuario: tipo_usuario
                });
            });
    });



module.exports = ruta;
