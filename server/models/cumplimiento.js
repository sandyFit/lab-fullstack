const conexion = require('../config/db');

function registrarCumplimiento(cumplimiento) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO cumplimiento (cita_id, fecha, motivo, historia_clinica, 
            tratamiento) VALUES (?, ?, ?, ?, ?)`;
        const { cita_id, fecha, motivo, historia_clinica, tratamiento } = cumplimiento;

        conexion.query(query, [cita_id, fecha, motivo, historia_clinica, tratamiento],
            (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
    });
}

module.exports = { registrarCumplimiento };
