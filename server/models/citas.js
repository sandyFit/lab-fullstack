const conexion = require('../config/db');

function agendarCita(cita) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO citas (paciente_id, medico_id, centro_id, fecha, hora, 
            tipo_cita) VALUES (?, ?, ?, ?, ?, ?)`;
        
        const { paciente_id, medico_id, centro_id, fecha, hora, tipo_cita } = cita;

        conexion.query(query, [paciente_id, medico_id, centro_id, fecha, hora, tipo_cita],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
    });
}

function obtenerCitas(paciente_id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM citas WHERE paciente_id = ?';

        conexion.query(query, [paciente_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });

}

module.exports = { agendarCita };
module.exports = { obtenerCitas };


