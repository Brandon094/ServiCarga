/**
 * storage.js
 * Manejo de almacenamiento local (localStorage)
 */

/**
 * Guarda un valor en localStorage
 * @param {string} key - Clave
 * @param {any} value - Valor a guardar (se serializa a JSON)
 * @returns {boolean} True si fue exitoso
 */
export function setStorage(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.warn(`Error guardando en localStorage: ${key}`, error);
        return false;
    }
}

/**
 * Obtiene un valor de localStorage
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} Valor deserializado o defaultValue
 */
export function getStorage(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) return defaultValue;
        return JSON.parse(stored);
    } catch (error) {
        console.warn(`Error leyendo de localStorage: ${key}`, error);
        return defaultValue;
    }
}

/**
 * Elimina un valor de localStorage
 * @param {string} key - Clave
 * @returns {boolean} True si fue exitoso
 */
export function removeStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`Error eliminando de localStorage: ${key}`, error);
        return false;
    }
}

/**
 * Limpia todo localStorage
 * @returns {boolean} True si fue exitoso
 */
export function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.warn('Error limpiando localStorage', error);
        return false;
    }
}

/**
 * Verifica si una clave existe en localStorage
 * @param {string} key - Clave
 * @returns {boolean} True si existe
 */
export function hasStorage(key) {
    return localStorage.getItem(key) !== null;
}

/**
 * Obtiene todas las claves de localStorage
 * @returns {Array} Array de claves
 */
export function getStorageKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
    }
    return keys;
}

/**
 * Obtiene el tamaño aproximado de localStorage en bytes
 * @returns {number} Tamaño aproximado
 */
export function getStorageSize() {
    let size = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            size += localStorage[key].length + key.length;
        }
    }
    return size;
}

/**
 * Establece un valor con expiración
 * @param {string} key - Clave
 * @param {any} value - Valor
 * @param {number} expirationMinutes - Minutos hasta expiración
 * @returns {boolean} True si fue exitoso
 */
export function setStorageWithExpiry(key, value, expirationMinutes = 60) {
    try {
        const expirationTime = Date.now() + (expirationMinutes * 60 * 1000);
        const data = {
            value: value,
            expiry: expirationTime
        };
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn(`Error guardando con expiración: ${key}`, error);
        return false;
    }
}

/**
 * Obtiene un valor con verificación de expiración
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto
 * @returns {any} Valor o defaultValue si expiró
 */
export function getStorageWithExpiry(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) return defaultValue;

        const data = JSON.parse(stored);
        if (Date.now() > data.expiry) {
            removeStorage(key);
            return defaultValue;
        }

        return data.value;
    } catch (error) {
        console.warn(`Error leyendo con expiración: ${key}`, error);
        return defaultValue;
    }
}
