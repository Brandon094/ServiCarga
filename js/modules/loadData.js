// Configuración de categorías
const categories = [
    {
        id: 'motocarros',
        name: 'Motocarros',
        icon: 'fa-motorcycle',
        file: 'db/motocarros.json',
        vehicleType: 'Motocarro'
    },
    {
        id: 'camionetas',
        name: 'Camionetas',
        icon: 'fa-truck-pickup',
        file: 'db/camionetas.json',
        vehicleType: 'Camioneta'
    },
    {
        id: 'tuktuk',
        name: 'TukTuk',
        icon: 'fa-car-side',
        file: 'db/tuktuk.json',
        vehicleType: 'TukTuk'
    }
];

// Función para crear una tarjeta de contacto
function createContactCard(driver, vehicleType) {
    const card = document.createElement('div');
    card.className = 'contact-card';
    
    // Formatear número de teléfono para WhatsApp (eliminar espacios, +, etc.)
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
                <i class="fas fa-truck"></i>
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
    
    return card;
}

// Función para formatear números de teléfono
function formatPhoneNumber(phone) {
    // Limpiar el número de teléfono
    const cleaned = phone.replace(/\D/g, '');
    
    // Formatear según longitud (ejemplo para Colombia)
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    
    return phone;
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para cargar datos de una categoría
async function loadCategory(category) {
    try {
        const response = await fetch(category.file);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
            console.warn(`No hay datos disponibles para ${category.name}`);
            return null;
        }
        
        return {
            category: category,
            drivers: data
        };
        
    } catch (error) {
        console.error(`Error al cargar ${category.name}:`, error);
        return null;
    }
}

// Función para crear la sección de una categoría
function createCategorySection(categoryData) {
    if (!categoryData || !categoryData.drivers || categoryData.drivers.length === 0) {
        return null;
    }
    
    const section = document.createElement('div');
    section.className = 'driver-category';
    section.id = `category-${categoryData.category.id}`;
    
    // Crear header de categoría
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <i class="fas ${categoryData.category.icon}"></i>
        <h2>${escapeHtml(categoryData.category.name)}</h2>
        <span class="category-count">${categoryData.drivers.length}</span>
    `;
    
    // Crear grid de conductores
    const grid = document.createElement('div');
    grid.className = 'drivers-grid';
    
    // Agregar cada conductor
    categoryData.drivers.forEach(driver => {
        const card = createContactCard(driver, categoryData.category.vehicleType);
        grid.appendChild(card);
    });
    
    section.appendChild(header);
    section.appendChild(grid);
    
    return section;
}

// Función principal para cargar todos los datos
async function loadAllDrivers() {
    const container = document.getElementById('drivers-container');
    
    if (!container) {
        console.error('No se encontró el contenedor de conductores');
        return;
    }
    
    // Mostrar loading
    container.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-truck-fast fa-3x"></i>
            <p>Cargando conductores disponibles...</p>
        </div>
    `;
    
    try {
        // Cargar todas las categorías en paralelo
        const loadPromises = categories.map(category => loadCategory(category));
        const results = await Promise.all(loadPromises);
        
        // Filtrar resultados válidos
        const validCategories = results.filter(result => result !== null);
        
        if (validCategories.length === 0) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-exclamation-triangle fa-3x"></i>
                    <p>No hay conductores disponibles en este momento</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Por favor, vuelve a intentar más tarde</p>
                </div>
            `;
            return;
        }
        
        // Limpiar contenedor
        container.innerHTML = '';
        
        // Agregar cada categoría al contenedor
        validCategories.forEach(categoryData => {
            const section = createCategorySection(categoryData);
            if (section) {
                container.appendChild(section);
            }
        });
        
        // Mostrar mensaje de éxito en consola
        const totalDrivers = validCategories.reduce((sum, cat) => sum + cat.drivers.length, 0);
        console.log(`✅ Cargados ${totalDrivers} conductores en ${validCategories.length} categorías`);
        
    } catch (error) {
        console.error('Error al cargar los conductores:', error);
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-exclamation-circle fa-3x"></i>
                <p>Error al cargar los conductores</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Por favor, recarga la página o intenta más tarde</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: white; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-sync-alt"></i> Reintentar
                </button>
            </div>
        `;
    }
}