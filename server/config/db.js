require('dotenv').config({ path: './config/.env' }); // Carga las variables de entorno al inicio

const mysql = require('mysql2');

console.log('Intentando conectar a la base de datos...');

console.log(`host: ${process.env.DB_HOST}`);  
console.log(`user: ${process.env.DB_USER}`);  
console.log(`password: ${process.env.DB_PASSWORD}`); 

// Verificar que todas las variables estén definidas
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.DB_PORT) {
    console.error('Faltan algunas variables de entorno');
    process.exit(1);
}

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306 
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Exporta la conexión para poder reutilizarla en otros archivos si es necesario
module.exports = conexion;

// Cerrar la conexión cuando termine la ejecución (por ejemplo, al finalizar el servidor)
process.on('SIGINT', () => {
    conexion.end((err) => {
        if (err) {
            console.error('Error al cerrar la conexión:', err);
        } else {
            console.log('Conexión cerrada');
        }
        process.exit();
    });
});
