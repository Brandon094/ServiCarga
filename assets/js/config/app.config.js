/**
 * app.config.js
 * Configuración global de la aplicación
 */

// ============ CONSTANTES GLOBALES ============

// URLs y rutas
export const ROUTES = {
    HOME: '/index.html',
    ADMIN_LOGIN: '/pages/admin-login.html',
    ADMIN_PANEL: '/pages/admin.html',
    REGISTER: '/pages/register.html',
    REGISTER_ADMIN: '/pages/register-admin.html'
};

// Nombre de la aplicación
export const APP_NAME = 'ServiCarga';
export const APP_TAGLINE = 'Transporte de carga Rápido, Local y Confiable';

// IDs de elementos del DOM
export const DOM_IDS = {
    DRIVERS_CONTAINER: 'drivers-container',
    THEME_BUTTON: 'theme-button',
    THEME_CHECKBOX: 'theme-toggle',
    LOGIN_FORM: 'loginForm',
    DRIVER_FORM: 'driverForm',
    ERROR_MSG: 'errorMsg'
};

// Clases CSS
export const CSS_CLASSES = {
    DARK_THEME: 'dark-theme',
    LOADING_SPINNER: 'loading-spinner',
    ERROR_MESSAGE: 'error-message',
    CATEGORY_SECTION: 'driver-category'
};

// Almacenamiento local
export const STORAGE_KEYS = {
    THEME: 'theme',
    USER_DATA: 'userData',
    AUTH_TOKEN: 'authToken'
};

// Temas
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Mensajes comunes
export const MESSAGES = {
    LOADING: 'Cargando conductores disponibles...',
    NO_DRIVERS: 'No hay conductores disponibles en esta categoría',
    ERROR: 'Ha ocurrido un error',
    SUCCESS: 'Operación completada exitosamente'
};

// Configuración de Firebase Firestore
export const FIREBASE_COLLECTIONS = {
    DRIVERS: 'conductores',
    ADMINS: 'admins',
    ANNOUNCEMENTS: 'anuncios'
};

// Campos de Firestore
export const DRIVER_FIELDS = {
    NAME: 'nombre',
    PHONE: 'telefono',
    VEHICLE: 'vehiculo',
    GALLERY: 'galeria',
    LOCATION: 'ubicacion',
    RATING: 'calificacion'
};
