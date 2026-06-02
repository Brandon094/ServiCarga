/**
 * modules/utils.js
 * DEPRECADO: Usar ../utils/ directamente
 * Este archivo se mantiene para retrocompatibilidad
 */

export * from '../utils/index.js';

// Mantener funciones originales para retrocompatibilidad
export { 
    formatPhoneNumber, 
    escapeHtml 
} from '../utils/index.js';