const express = require('express');
const ruta = express.Router();
const { registrarUsuario } = require('../models/usuarios');

ruta.post('/registrarUsuario', async (req, res) => {
    try {
        const usuario = req.body;
        const resultado = await registrarUsuario(usuario);
        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente', data: resultado
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario', detalles: err });
    }
});

module.exports = ruta;
