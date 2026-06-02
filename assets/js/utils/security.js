/**
 * security.js
 * Funciones de seguridad y sanitización
 */

/**
 * Escapa caracteres HTML para prevenir ataques XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
export function escapeHtml(text) {
    if (!text || typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitiza HTML removiendo scripts y elementos peligrosos
 * @param {string} html - HTML a sanitizar
 * @returns {string} HTML sanitizado
 */
export function sanitizeHtml(html) {
    if (!html || typeof html !== 'string') return html;

    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remover scripts y estilos
    const scripts = temp.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());

    // Remover atributos peligrosos (on*)
    const elements = temp.querySelectorAll('*');
    elements.forEach(el => {
        const attributes = Array.from(el.attributes);
        attributes.forEach(attr => {
            if (attr.name.startsWith('on')) {
                el.removeAttribute(attr.name);
            }
        });
    });

    return temp.innerHTML;
}

/**
 * Valida si una URL es segura (previene javascript: y data:)
 * @param {string} url - URL a validar
 * @returns {boolean} True si la URL es segura
 */
export function isUrlSafe(url) {
    if (!url || typeof url !== 'string') return false;

    const unsafeProtocols = ['javascript:', 'data:', 'vbscript:'];
    const lowerUrl = url.toLowerCase().trim();

    return !unsafeProtocols.some(protocol => lowerUrl.startsWith(protocol));
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Encripa un texto simple (nota: esto es básico, usar métodos seguros en producción)
 * @param {string} text - Texto a encriptar
 * @returns {string} Texto encriptado en base64
 */
export function encodeBase64(text) {
    if (!text || typeof text !== 'string') return text;
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
        console.warn('Error al encriptar:', error);
        return text;
    }
}

/**
 * Desencripta un texto en base64
 * @param {string} encoded - Texto encriptado en base64
 * @returns {string} Texto desencriptado
 */
export function decodeBase64(encoded) {
    if (!encoded || typeof encoded !== 'string') return encoded;
    try {
        return decodeURIComponent(escape(atob(encoded)));
    } catch (error) {
        console.warn('Error al desencriptar:', error);
        return encoded;
    }
}
