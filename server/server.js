const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const rutaUsuario = require('./routes/rutaUsuario');
const rutaDisponibilidad = require('./routes/rutaDisponibilidad');
const rutaCitas = require('./routes/rutaCitas');
const rutaCumplimiento = require('./routes/rutaCumplimiento');

app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use('/registro/usuario', rutaUsuario);
app.use('/registro/disponibilidad', rutaDisponibilidad);
app.use('/registro/cita', rutaCitas);
app.use('/registro/cumplimiento', rutaCumplimiento);


const port = 5000;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
