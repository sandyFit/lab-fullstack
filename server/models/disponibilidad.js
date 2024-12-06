const conexion = require('../config/db');

// Función para registrar la disponibilidad de un médico
function registrarDisponibilidad(disponibilidad) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO disponibilidad (medico_id, centro_id, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)';
        const { medico_id, centro_id, fecha, hora_inicio, hora_fin } = disponibilidad;

        conexion.query(query, [medico_id, centro_id, fecha, hora_inicio, hora_fin], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = { registrarDisponibilidad };
