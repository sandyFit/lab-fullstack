const express = require('express');
const ruta = express.Router();
const { agendarCita } = require('../models/citas');

ruta.post('/agendar', async (req, res) => {
    try {
        const cita = req.body;
        const resultado = await agendarCita(cita);
        res.status(201).json({
            mensaje: 'Cita agendada con éxito',
            data: resultado
        });

    } catch (error) {
        res.status(500).json({
            error: 'Error al agendar la cita',
            detalles: err
        });
    }
});

module.exports = ruta;
