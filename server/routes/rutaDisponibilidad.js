const express = require('express');
const ruta = express.Router();
const { registrarDisponibilidad } = require('../models/disponibilidad');

ruta.post('/registrarDisponibilidad', async (req, res) => {
    try {
        const disponibilidad = req.body;
        const resultado = await registrarDisponibilidad(disponibilidad);
        res.status(201).json({
            mensaje: 'Disponibilidad registrada con éxito',
            data: resultado
        })

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar la disponibilidad',
            detalles: error
        });
    }
});

module.exports = ruta;

