/**
 * analytics.js
 * Funciones para rastreo de eventos con Google Analytics
 */

/**
 * Verifica si Google Analytics está disponible
 * @returns {boolean} True si gtag está definido
 */
function isGAAvailable() {
    return typeof gtag !== 'undefined';
}

/**
 * Envía un evento genérico a Google Analytics
 * @param {string} eventName - Nombre del evento
 * @param {Object} data - Datos adicionales del evento
 */
export function trackEvent(eventName, data = {}) {
    if (!isGAAvailable()) {
        console.warn('Google Analytics no disponible');
        return;
    }

    gtag('event', eventName, {
        ...data,
        timestamp: new Date().toISOString()
    });
}

/**
 * Rastrea cuando un usuario contacta a un conductor
 * @param {string} driverId - ID del conductor
 * @param {string} driverName - Nombre del conductor
 * @param {string} contactMethod - Método de contacto ('call' o 'whatsapp')
 * @param {string} vehicleType - Tipo de vehículo
 */
export function trackDriverContact(driverId, driverName, contactMethod, vehicleType) {
    trackEvent('driver_contact', {
        driver_id: driverId,
        driver_name: driverName,
        contact_method: contactMethod,
        vehicle_type: vehicleType
    });
}

/**
 * Rastrea cuando se registra un conductor
 * @param {string} vehicleType - Tipo de vehículo
 */
export function trackDriverRegistration(vehicleType) {
    trackEvent('driver_registration', {
        vehicle_type: vehicleType
    });
}

/**
 * Rastrea cuando se visualiza una categoría
 * @param {string} categoryName - Nombre de la categoría
 * @param {number} driverCount - Cantidad de conductores en la categoría
 */
export function trackCategoryView(categoryName, driverCount) {
    trackEvent('category_view', {
        category_name: categoryName,
        driver_count: driverCount
    });
}

/**
 * Rastrea cambio de tema
 * @param {string} theme - Tema seleccionado ('light' o 'dark')
 */
export function trackThemeChange(theme) {
    trackEvent('theme_change', {
        theme: theme
    });
}

/**
 * Rastrea cuando se abre un formulario
 * @param {string} formName - Nombre del formulario
 */
export function trackFormOpen(formName) {
    trackEvent('form_open', {
        form_name: formName
    });
}

/**
 * Rastrea cuando se envía un formulario
 * @param {string} formName - Nombre del formulario
 * @param {boolean} success - Si fue exitoso
 */
export function trackFormSubmit(formName, success = true) {
    trackEvent('form_submit', {
        form_name: formName,
        success: success
    });
}

/**
 * Rastrea errores de la aplicación
 * @param {string} errorMessage - Mensaje de error
 * @param {string} context - Contexto del error
 */
export function trackError(errorMessage, context = 'general') {
    trackEvent('app_error', {
        error_message: errorMessage,
        context: context,
        severity: 'error'
    });
}

/**
 * Rastrea advertencias
 * @param {string} warningMessage - Mensaje de advertencia
 * @param {string} context - Contexto
 */
export function trackWarning(warningMessage, context = 'general') {
    trackEvent('app_warning', {
        warning_message: warningMessage,
        context: context,
        severity: 'warning'
    });
}

/**
 * Envía una excepción a Google Analytics
 * @param {string} description - Descripción del error
 * @param {boolean} fatal - Si es fatal
 */
export function trackException(description, fatal = false) {
    trackEvent('exception', {
        description: description,
        fatal: fatal
    });
}
