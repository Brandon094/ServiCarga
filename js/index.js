// Importar todos los módulos
import { categories } from './modules/config.js';
import { loadAllCategories } from './modules/dataLoader.js';
import { createCategorySection, showLoading, showError, showEmpty } from './modules/ui.js';
import { renderAnunciosDestacados } from './modules/anuncios.js';

// Función principal para cargar todos los datos
async function loadAllDrivers() {
    const container = document.getElementById('drivers-container');
    
    if (!container) {
        console.error('No se encontró el contenedor de conductores');
        return;
    }
    
    // Mostrar loading
    showLoading(container);
    
    try {
        // Cargar todas las categorías
        const validCategories = await loadAllCategories(categories);
        
        if (validCategories.length === 0) {
            showEmpty(container);
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
        showError(container, 'Error al cargar los conductores');
    }
}

// Función para crear el contenedor de anuncios destacados
function createAnunciosContainer() {
    const anunciosContainer = document.createElement('div');
    anunciosContainer.className = 'container';
    anunciosContainer.id = 'anuncios-destacados-container';
    return anunciosContainer;
}

// Función para insertar el contenedor de anuncios después de la bienvenida
function insertAnunciosContainer() {
    const welcomeSection = document.querySelector('.welcome-section');
    const existingContainer = document.getElementById('anuncios-destacados-container');
    
    // Si ya existe el contenedor, no lo creamos de nuevo
    if (existingContainer) return existingContainer;
    
    const anunciosContainer = createAnunciosContainer();
    
    if (welcomeSection) {
        welcomeSection.insertAdjacentElement('afterend', anunciosContainer);
    } else {
        // Fallback: insertar antes de los conductores
        const driversSection = document.querySelector('.drivers-section');
        if (driversSection) {
            driversSection.insertAdjacentElement('beforebegin', anunciosContainer);
        }
    }
    
    return anunciosContainer;
}

// Actualizar el año en el footer
function updateCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    // Actualizar el año en el footer
    updateCurrentYear();
    
    // Cargar conductores
    await loadAllDrivers();
    
    // Crear e insertar contenedor de anuncios
    const anunciosContainer = insertAnunciosContainer();
    
    // Renderizar anuncios destacados
    await renderAnunciosDestacados(anunciosContainer);
    
    console.log('✅ ServiCarga inicializado correctamente');
});

// Exportar funciones para uso global (opcional)
window.loadAllDrivers = loadAllDrivers;
window.ServiCarga = {
    loadAllDrivers,
    updateCurrentYear
};