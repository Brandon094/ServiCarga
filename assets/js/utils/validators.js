/**
 * validators.js
 * Funciones para validación de datos
 */

/**
 * Valida un teléfono colombiano
 * @param {string} phone - Número de teléfono
 * @returns {boolean} True si es válido
 */
export function isValidPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return false;

    const cleaned = phone.replace(/\D/g, '');
    
    // Número colombiano debe tener 10 dígitos (sin código de país)
    // o 12 dígitos (con código 57)
    return (cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('57')));
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Valida una contraseña (mínimo 8 caracteres)
 * @param {string} password - Contraseña a validar
 * @returns {boolean} True si es válida
 */
export function isValidPassword(password) {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 8;
}

/**
 * Valida que no esté vacío o solo espacios
 * @param {string} value - Valor a validar
 * @returns {boolean} True si no está vacío
 */
export function isNotEmpty(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
}

/**
 * Valida una URL
 * @param {string} url - URL a validar
 * @returns {boolean} True si es una URL válida
 */
export function isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;

    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Valida un objeto de formulario
 * @param {Object} data - Objeto con datos del formulario
 * @param {Object} rules - Reglas de validación {field: validator}
 * @returns {Object} {isValid: boolean, errors: {field: message}}
 */
export function validateForm(data, rules) {
    const errors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
        const validator = rules[field];
        const value = data[field];

        const result = typeof validator === 'function' 
            ? validator(value) 
            : isNotEmpty(value);

        if (!result) {
            isValid = false;
            errors[field] = `${field} no es válido`;
        }
    });

    return { isValid, errors };
}

/**
 * Valida que un número esté dentro de un rango
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo (inclusive)
 * @param {number} max - Valor máximo (inclusive)
 * @returns {boolean} True si está dentro del rango
 */
export function isInRange(value, min, max) {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
}

/**
 * Valida que el valor sea un número
 * @param {any} value - Valor a validar
 * @returns {boolean} True si es un número
 */
export function isNumber(value) {
    return !isNaN(value) && value !== '' && value !== null && value !== undefined;
}

/**
 * Valida la longitud de una cadena
 * @param {string} value - Cadena a validar
 * @param {number} min - Longitud mínima
 * @param {number} max - Longitud máxima
 * @returns {boolean} True si cumple con la longitud
 */
export function isValidLength(value, min = 0, max = Infinity) {
    if (!value || typeof value !== 'string') return false;
    const length = value.length;
    return length >= min && length <= max;
}
