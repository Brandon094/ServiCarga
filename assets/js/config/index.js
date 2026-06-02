/**
 * config/index.js
 * Exporta todas las configuraciones
 */

export * from './app.config.js';
export * from './firebase.config.js';
export * from './categories.config.js';

// Importar y re-exportar la configuración por defecto de firebase
import firebaseConfig from './firebase.config.js';
export { firebaseConfig };
