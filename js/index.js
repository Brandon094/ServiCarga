// Importar todos los módulos
import { categories } from './modules/config.js';
import { loadAllCategories } from './modules/dataLoader.js';
import { createCategorySection, showLoading, showError, showEmpty } from './modules/ui.js';

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

// Actualizar el año en el footer
function updateCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentYear();
    loadAllDrivers();
});

// Exportar funciones para uso global (opcional)
window.loadAllDrivers = loadAllDrivers;