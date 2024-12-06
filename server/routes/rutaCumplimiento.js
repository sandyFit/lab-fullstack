const express = require('express');
const ruta = express.Router();
const { registrarCumplimiento } = require('../models/cumplimiento');

ruta.post('/registrarCumplimiento', async (req, res) => {
    try {
        const cumplimiento = req.body;
        const resultado = await registrarCumplimiento(cumplimiento);
        res.status(201).json({
            mensaje: 'Cumplimiento registrado con éxito',
            data: resultado
        })

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar el cumplimiento',
            detalles: error
        });
    }
});

module.exports = ruta;
