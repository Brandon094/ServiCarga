import { formatPhoneNumber, escapeHtml, trackDriverContact } from './utils.js';

// Función para crear una tarjeta de contacto
// Ahora recibe un tercer parámetro: vehicleIcon
function getGallerySlides(vehicleType, vehicleIcon) {
    const slides = [
        { title: 'Exterior', description: `Vista frontal y detalles del ${vehicleType}` },
        { title: 'Interior', description: `Espacio de carga y condición del ${vehicleType}` },
        { title: 'Listo para cargar', description: `Vehículo preparado para el próximo acarreo` }
    ];

    return slides.map((slide, index) => `
        <div class="gallery-slide${index === 0 ? ' active' : ''}" data-index="${index}">
            <div class="gallery-image">
                <i class="fas ${vehicleIcon}"></i>
                <div class="gallery-image-label">${escapeHtml(vehicleType)}</div>
            </div>
            <div class="gallery-caption">
                <strong>${escapeHtml(slide.title)}</strong>
                <p>${escapeHtml(slide.description)}</p>
            </div>
        </div>
    `).join('');
}

function createGalleryHtml(vehicleType, vehicleIcon) {
    return `
        <div class="vehicle-gallery">
            ${getGallerySlides(vehicleType, vehicleIcon)}
            <div class="gallery-dots">
                <button type="button" class="gallery-dot active" data-index="0" aria-label="Imagen 1"></button>
                <button type="button" class="gallery-dot" data-index="1" aria-label="Imagen 2"></button>
                <button type="button" class="gallery-dot" data-index="2" aria-label="Imagen 3"></button>
            </div>
        </div>
    `;
}

export function createContactCard(driver, vehicleType, vehicleIcon = 'fa-truck') {
    const card = document.createElement('div');
    card.className = 'contact-card';
    
    const whatsappNumber = driver.phone.replace(/[^0-9]/g, '');
    
    card.innerHTML = `
        <h3>
            <span class="driver-icon"><i class="fas fa-user-tie"></i></span>
            ${escapeHtml(driver.name)}
            <span class="vehicle-badge">${vehicleType}</span>
        </h3>
        ${createGalleryHtml(vehicleType, vehicleIcon)}
        <div class="contact-info">
            <p>
                <i class="fas fa-phone"></i>
                <span>${formatPhoneNumber(driver.phone)}</span>
            </p>
            <p>
                <i class="fas ${vehicleIcon}"></i>
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
    
    const callBtn = card.querySelector('.btn-call');
    const whatsappBtn = card.querySelector('.btn-whatsapp');
    
    callBtn.addEventListener('click', () => {
        trackDriverContact(
            driver.id,
            driver.name,
            'call',
            vehicleType
        );
    });
    
    whatsappBtn.addEventListener('click', () => {
        trackDriverContact(
            driver.id,
            driver.name,
            'whatsapp',
            vehicleType
        );
    });

    const galleryDots = card.querySelectorAll('.gallery-dot');
    const gallerySlides = card.querySelectorAll('.gallery-slide');

    galleryDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = Number(dot.dataset.index);
            gallerySlides.forEach((slide, slideIndex) => {
                slide.classList.toggle('active', slideIndex === index);
            });
            galleryDots.forEach((button, buttonIndex) => {
                button.classList.toggle('active', buttonIndex === index);
            });
        });
    });
    
    return card;
}