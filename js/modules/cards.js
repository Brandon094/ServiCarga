import { formatPhoneNumber, escapeHtml, trackDriverContact } from './utils.js';

// Función para crear una tarjeta de contacto
// Ahora recibe un tercer parámetro: vehicleIcon y galerías opcional
function getGallerySlides(vehicleType, vehicleIcon, galleryImages = null) {
    // Si hay imágenes reales, usarlas
    if (galleryImages && galleryImages.length > 0) {
        return galleryImages.map((image, index) => `
            <div class="gallery-slide${index === 0 ? ' active' : ''}" data-index="${index}">
                <div class="gallery-image">
                    <img src="${escapeHtml(image)}" alt="${escapeHtml(vehicleType)} - Foto ${index + 1}" />
                </div>
            </div>
        `).join('');
    }

    // Si no hay imágenes, usar iconos por defecto
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

function createGalleryHtml(vehicleType, vehicleIcon, galleryImages = null) {
    const numSlides = (galleryImages && galleryImages.length > 0) ? galleryImages.length : 3;
    const dots = Array.from({ length: numSlides }, (_, i) => 
        `<button type="button" class="gallery-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Imagen ${i + 1}"></button>`
    ).join('');

    return `
        <div class="vehicle-gallery">
            ${getGallerySlides(vehicleType, vehicleIcon, galleryImages)}
            <div class="gallery-controls">
                <button type="button" class="gallery-nav gallery-prev" aria-label="Imagen anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="gallery-dots">
                    ${dots}
                </div>
                <button type="button" class="gallery-nav gallery-next" aria-label="Siguiente imagen">
                    <i class="fas fa-chevron-right"></i>
                </button>
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
        ${createGalleryHtml(vehicleType, vehicleIcon, driver.gallery)}
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
    const prevBtn = card.querySelector('.gallery-prev');
    const nextBtn = card.querySelector('.gallery-next');
    const gallery = card.querySelector('.vehicle-gallery');
    
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    // Función para cambiar slide
    function goToSlide(index) {
        currentIndex = (index + gallerySlides.length) % gallerySlides.length;
        gallerySlides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === currentIndex);
        });
        galleryDots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === currentIndex);
        });
    }

    // Navegación con puntos (dots)
    galleryDots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(Number(dot.dataset.index));
        });
    });

    // Navegación con botones
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Deslizamiento (touch/swipe)
    gallery.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Deslizamiento hacia la izquierda = siguiente imagen
                goToSlide(currentIndex + 1);
            } else {
                // Deslizamiento hacia la derecha = imagen anterior
                goToSlide(currentIndex - 1);
            }
        }
    }
    
    return card;
}