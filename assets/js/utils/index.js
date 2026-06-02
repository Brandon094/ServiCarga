/**
 * utils/index.js
 * Exporta todas las funciones utilitarias
 */

// Exportar todas las utilidades
export * from './formatting.js';
export * from './security.js';
export * from './validators.js';
export * from './analytics.js';
export * from './storage.js';

// Re-exportar funciones comunes con alias para facilitar acceso
export {
    formatPhoneNumber,
    formatDate,
    formatCurrency
} from './formatting.js';

export {
    escapeHtml,
    sanitizeHtml,
    isUrlSafe,
    isValidEmail
} from './security.js';

export {
    isValidPhoneNumber,
    isValidPassword,
    validateForm
} from './validators.js';

export {
    trackEvent,
    trackDriverContact,
    trackError
} from './analytics.js';

export {
    setStorage,
    getStorage,
    removeStorage
} from './storage.js';
