const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const rutaUsuario = require('./routes/rutaUsuario');
const rutaCitas = require('./routes/rutaCitas');
const rutaDisponibilidad = require('./routes/rutaDisponibilidad');
const rutaCumplimiento = require('./routes/rutaCumplimiento');

// server.js
const conexion = require('./config/db');

const app = express();
const PORT = 5000;

dotenv.config({ path: './config/.env' });

// Middleware
app.use(cors()); // Permite que el frontend se conecte
app.use(express.json()); // Para manejar datos en JSON
app.use(bodyParser.json()); // Para parsear el cuerpo de las peticiones JSON

// Definir rutas específicas
app.use('/api/usuarios', rutaUsuario);
app.use('/api/citas', rutaCitas);
app.use('/api/disponibilidad', rutaDisponibilidad);
app.use('/api/cumplimiento', rutaCumplimiento);

// Rutas de ejemplo
app.get('/', (req, res) => {
    res.send('Servidor inicializado');
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    console.log('Datos recibidos:', data);
    res.json({ message: 'Datos recibidos correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
