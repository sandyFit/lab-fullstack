
const conexion = require('../config/db');

// Función para crear un nuevo usuario
function registrarUsuario(usuario) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO usuarios (nombre, cedula, email, telefono, tipo_usuario, password_hash) VALUES (?, ?, ?, ?, ?, ?)';
        const { nombre, cedula, email, telefono, tipo_usuario, password_hash } = usuario;

        conexion.query(query, [nombre, cedula, email, telefono, tipo_usuario, password_hash], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = { registrarUsuario };
