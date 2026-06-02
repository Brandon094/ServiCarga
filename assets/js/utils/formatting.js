/**
 * formatting.js
 * Funciones para formateo de datos
 */

/**
 * Formatea un número de teléfono al formato local
 * @param {string} phone - Número de teléfono sin formato
 * @returns {string} Número formateado
 */
export function formatPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return phone;

    let cleaned = phone.replace(/\D/g, '');

    // Si tiene 12 dígitos y comienza con 57 (código Colombia), remover el prefijo
    if (cleaned.length === 12 && cleaned.startsWith('57')) {
        cleaned = cleaned.slice(2);
    }

    // Formatear números de 10 dígitos
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }

    return phone;
}

/**
 * Formatea una fecha al formato local
 * @param {Date|string} date - Fecha a formatear
 * @param {string} locale - Código de idioma (ej: 'es-CO')
 * @returns {string} Fecha formateada
 */
export function formatDate(date, locale = 'es-CO') {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString(locale);
    } catch (error) {
        console.warn('Error al formatear fecha:', error);
        return '';
    }
}

/**
 * Formatea una moneda al formato local
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (ej: 'COP')
 * @returns {string} Cantidad formateada con símbolo de moneda
 */
export function formatCurrency(amount, currency = 'COP') {
    try {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency
        }).format(amount);
    } catch (error) {
        console.warn('Error al formatear moneda:', error);
        return amount.toString();
    }
}

/**
 * Trunca un texto a un número máximo de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado con puntos suspensivos si es necesario
 */
export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Convierte la primera letra de un texto a mayúscula
 * @param {string} text - Texto a procesar
 * @returns {string} Texto con primera letra en mayúscula
 */
export function capitalize(text) {
    if (!text || typeof text !== 'string') return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}
