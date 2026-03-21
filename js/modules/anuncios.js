// Módulo para manejar los anuncios locales con carrusel automático

// Configuración
const ANUNCIOS_URL = 'db/anuncios.json';
const CATEGORIAS_URL = 'db/categorias.json';
let intervaloActual = null;
let indiceActual = 0;
let anunciosData = [];

// Función para cargar anuncios
export async function loadAnuncios() {
    try {
        const response = await fetch(ANUNCIOS_URL);
        if (!response.ok) throw new Error('Error al cargar anuncios');
        return await response.json();
    } catch (error) {
        console.error('Error cargando anuncios:', error);
        return [];
    }
}

// Función para cargar categorías
export async function loadCategorias() {
    try {
        const response = await fetch(CATEGORIAS_URL);
        if (!response.ok) throw new Error('Error al cargar categorías');
        return await response.json();
    } catch (error) {
        console.error('Error cargando categorías:', error);
        return [];
    }
}

// Función para crear una tarjeta de anuncio
export function createAnuncioCard(anuncio, categoria) {
    const card = document.createElement('div');
    card.className = 'anuncio-card';
    
    const whatsappNumber = anuncio.whatsapp.replace(/[^0-9]/g, '');
    const phoneNumber = anuncio.phone.replace(/[^0-9]/g, '');
    
    card.innerHTML = `
        <div class="anuncio-header" style="background: ${categoria?.color || '#667eea'}20">
            <i class="fas ${anuncio.icon || categoria?.icon || 'fa-store'}"></i>
            <span class="anuncio-category">${categoria?.name || anuncio.category}</span>
        </div>
        <div class="anuncio-body">
            <h3>${escapeHtml(anuncio.name)}</h3>
            <p class="anuncio-description">${escapeHtml(anuncio.description)}</p>
            ${anuncio.address ? `<p class="anuncio-address"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(anuncio.address)}</p>` : ''}
        </div>
        <div class="anuncio-footer">
            <a href="tel:${phoneNumber}" class="btn btn-call anuncio-btn">
                <i class="fas fa-phone-alt"></i> Llamar
            </a>
            <a href="https://wa.me/${whatsappNumber}" class="btn btn-whatsapp anuncio-btn" target="_blank">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
        </div>
    `;
    
    return card;
}

// Función para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para crear el carrusel de anuncios
function createCarouselStructure() {
    return `
        <div class="anuncios-carousel-container">
            <button class="carousel-btn carousel-prev" aria-label="Anterior">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="anuncios-carousel-track">
                <div class="anuncios-carousel-slides"></div>
            </div>
            <button class="carousel-btn carousel-next" aria-label="Siguiente">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="carousel-dots"></div>
        </div>
    `;
}

// Función para mover el carrusel
function moveToSlide(container, index, totalSlides) {
    const track = container.querySelector('.anuncios-carousel-track');
    const slides = container.querySelector('.anuncios-carousel-slides');
    const dots = container.querySelectorAll('.carousel-dot');
    
    if (!slides) return;
    
    const slideWidth = slides.children[0]?.offsetWidth || 0;
    const newPosition = -index * slideWidth;
    
    slides.style.transform = `translateX(${newPosition}px)`;
    
    // Actualizar dots activos
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Función para iniciar el carrusel automático
function startAutoSlide(container, totalSlides, intervalTime = 5000) {
    if (intervaloActual) clearInterval(intervaloActual);
    
    intervaloActual = setInterval(() => {
        indiceActual = (indiceActual + 1) % totalSlides;
        moveToSlide(container, indiceActual, totalSlides);
    }, intervalTime);
}

// Función para renderizar carrusel de anuncios
export async function renderAnunciosDestacados(container) {
    if (!container) return;
    
    try {
        const [anuncios, categorias] = await Promise.all([
            loadAnuncios(),
            loadCategorias()
        ]);
        
        // Guardar datos para uso global
        anunciosData = anuncios;
        
        // Filtrar anuncios destacados (si hay pocos, mostrar todos)
        let destacados = anuncios.filter(a => a.featured === true);
        if (destacados.length === 0) {
            destacados = anuncios.slice(0, 5);
        }
        
        if (destacados.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        // Limpiar contenedor
        container.innerHTML = '';
        
        // Título
        const titulo = document.createElement('h3');
        titulo.className = 'anuncios-titulo';
        titulo.innerHTML = '<i class="fas fa-star"></i> Negocios Destacados <i class="fas fa-star"></i>';
        container.appendChild(titulo);
        
        // Crear estructura del carrusel
        container.insertAdjacentHTML('beforeend', createCarouselStructure());
        
        const carouselContainer = container.querySelector('.anuncios-carousel-container');
        const slidesContainer = container.querySelector('.anuncios-carousel-slides');
        const dotsContainer = container.querySelector('.carousel-dots');
        
        // Crear cada slide (3 anuncios por slide para escritorio, 1 para móvil)
        const anunciosPorSlide = window.innerWidth >= 768 ? 3 : 1;
        const slides = [];
        
        for (let i = 0; i < destacados.length; i += anunciosPorSlide) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const slideAnuncios = destacados.slice(i, i + anunciosPorSlide);
            slideAnuncios.forEach(anuncio => {
                const categoria = categorias.find(c => c.id === anuncio.category);
                const card = createAnuncioCard(anuncio, categoria);
                slide.appendChild(card);
            });
            
            slidesContainer.appendChild(slide);
            slides.push(slide);
        }
        
        // Crear dots de navegación
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', () => {
                indiceActual = i;
                moveToSlide(carouselContainer, indiceActual, slides.length);
                if (intervaloActual) {
                    clearInterval(intervaloActual);
                    startAutoSlide(carouselContainer, slides.length, 5000);
                }
            });
            dotsContainer.appendChild(dot);
        }
        
        // Botones de navegación
        const prevBtn = carouselContainer.querySelector('.carousel-prev');
        const nextBtn = carouselContainer.querySelector('.carousel-next');
        
        prevBtn.addEventListener('click', () => {
            indiceActual = (indiceActual - 1 + slides.length) % slides.length;
            moveToSlide(carouselContainer, indiceActual, slides.length);
            if (intervaloActual) {
                clearInterval(intervaloActual);
                startAutoSlide(carouselContainer, slides.length, 5000);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            indiceActual = (indiceActual + 1) % slides.length;
            moveToSlide(carouselContainer, indiceActual, slides.length);
            if (intervaloActual) {
                clearInterval(intervaloActual);
                startAutoSlide(carouselContainer, slides.length, 5000);
            }
        });
        
        // Iniciar carrusel automático
        startAutoSlide(carouselContainer, slides.length, 5000);
        
        // Pausar al pasar el mouse
        carouselContainer.addEventListener('mouseenter', () => {
            if (intervaloActual) clearInterval(intervaloActual);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoSlide(carouselContainer, slides.length, 5000);
        });
        
        // Manejar resize de ventana
        window.addEventListener('resize', () => {
            // Recargar el carrusel para ajustar el número de anuncios por slide
            renderAnunciosDestacados(container);
        });
        
    } catch (error) {
        console.error('Error renderizando anuncios:', error);
        container.innerHTML = '<p class="error-anuncios">Error al cargar los anuncios</p>';
    }
}

// Función para detener el carrusel (útil si se necesita)
export function stopCarousel() {
    if (intervaloActual) {
        clearInterval(intervaloActual);
        intervaloActual = null;
    }
}