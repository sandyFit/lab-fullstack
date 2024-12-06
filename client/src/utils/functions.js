/**  Función para validar si la fecha ingresada es válida(posterior a la fecha actual)
        * @param {string} fecha - Fecha en formato ISO(yyyy - mm - dd)
        * @returns {boolean} - Retorna true si la fecha es válida
    */
export function esFechaValida (fecha) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaInput = new Date(fecha);
    return fechaInput > hoy;
}

/**  Función para validar si la cédula tiene el formato correcto
    * @param {string} cedula - solo números de 10 dígitos
    * @returns {boolean} - Retorna true si la cédula es válida
*/
export const esCedulaValida = (cedula) => {
    return /^\d{10}$/.test(cedula);  
};

/**
     * Función para poner mayúsculas a cada palabra de un nombre completo
     * @param {string} string - El texto a convertir (nombre completo)
     * @returns {string} - El texto con la primera letra de cada palabra en mayúscula y el resto en minúsculas
 */
export function primeraEnMayuscula(string) {
    // Verificar si la cadena es válida
    if (!string) return "";  // Retornar una cadena vacía si 'string' es undefined, null o vacío

    return string
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

/**
    * Muestra un mensaje de alerta en la interfaz de usuario.
    * @param {string} message - El mensaje de alerta que se desea mostrar al usuario.
    * Esta función actualiza el contenido de un elemento con la clase '.alert' en el DOM,
    * mostrando el mensaje proporcionado. Luego, el mensaje desaparece automáticamente después de 3 segundos.
    * @returns {void} - Esta función no retorna ningún valor.
 */

export function esFechaDuplicada(fecha, cedula, disponibilidades) {
    // Convertir las fechas a formato Date para comparar sin importar el formato de la cadena
    const fechaIngresada = new Date(fecha);

    // Buscar si ya existe una disponibilidad para ese médico en la fecha ingresada
    const esDuplicada = disponibilidades.some(
        (disponibilidad) =>
            disponibilidad.cedula === cedula &&
            new Date(disponibilidad.fecha).getTime() === fechaIngresada.getTime()
    );

    return esDuplicada;
}

