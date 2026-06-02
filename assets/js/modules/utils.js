// Función para formatear números de teléfono
export function formatPhoneNumber(phone) {
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

// Función para enviar eventos personalizados a Google Analytics
export function trackDriverContact(driverId, driverName, contactMethod, vehicleType) {
    if (typeof gtag === 'undefined') return; // Si GA no está disponible

    gtag('event', 'driver_contact', {
        'driver_id': driverId,
        'driver_name': driverName,
        'contact_method': contactMethod, // 'call' o 'whatsapp'
        'vehicle_type': vehicleType,
        'timestamp': new Date().toISOString()
    });
}

// Función para escapar HTML y prevenir XSS
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}