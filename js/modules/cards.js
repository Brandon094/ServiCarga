import { formatPhoneNumber, escapeHtml, trackDriverContact } from './utils.js';

// Función para crear una tarjeta de contacto
// Ahora recibe un tercer parámetro: vehicleIcon
export function createContactCard(driver, vehicleType, vehicleIcon = 'fa-truck') {
    const card = document.createElement('div');
    card.className = 'contact-card';
    
    const whatsappNumber = driver.phone.replace(/[^0-9]/g, '');
    
    card.innerHTML = `
        <h3>
            ${escapeHtml(driver.name)}
            <span class="vehicle-badge">${vehicleType}</span>
        </h3>
        <div class="contact-info">
            <p>
                <i class="fas fa-phone"></i>
                <span>${formatPhoneNumber(driver.phone)}</span>
            </p>
            <p>
                <i class="fas ${vehicleIcon}"></i>  <!-- ← Usa el ícono recibido -->
                <span>${escapeHtml(driver.vehicle || vehicleType)}</span>
            </p>
        </div>
        <div class="contact-links">
            <a href="tel:${driver.phone}" class="btn btn-call">
                <i class="fas fa-phone-alt"></i>
                Llamar
            </a>
            <a href="https://wa.me/${whatsappNumber}" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-whatsapp"></i>
                WhatsApp
            </a>
        </div>
    `;
    
    // Agregar event listeners para rastrear clics
    const callBtn = card.querySelector('.btn-call');
    const whatsappBtn = card.querySelector('.btn-whatsapp');
    
    callBtn.addEventListener('click', (e) => {
        trackDriverContact(
            driver.id,
            driver.name,
            'call',
            vehicleType
        );
    });
    
    whatsappBtn.addEventListener('click', (e) => {
        trackDriverContact(
            driver.id,
            driver.name,
            'whatsapp',
            vehicleType
        );
    });
    
    return card;
}