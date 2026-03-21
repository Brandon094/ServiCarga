import { createContactCard } from './cards.js';
import { escapeHtml } from './utils.js';

// Función para crear la sección de una categoría
export function createCategorySection(categoryData) {
    if (!categoryData || !categoryData.drivers || categoryData.drivers.length === 0) {
        return null;
    }
    
    const section = document.createElement('div');
    section.className = 'driver-category';
    section.id = `category-${categoryData.category.id}`;
    
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
        <i class="fas ${categoryData.category.icon}"></i>
        <h2>${escapeHtml(categoryData.category.name)}</h2>
        <span class="category-count">${categoryData.drivers.length}</span>
    `;
    
    const grid = document.createElement('div');
    grid.className = 'drivers-grid';
    
    // Pasar el ícono del vehículo desde la categoría
    categoryData.drivers.forEach(driver => {
        const card = createContactCard(
            driver, 
            categoryData.category.vehicleType,
            categoryData.category.vehicleIcon  // ← Pasa el ícono de la categoría
        );
        grid.appendChild(card);
    });
    
    section.appendChild(header);
    section.appendChild(grid);
    
    return section;
}

// Función para mostrar el estado de carga
export function showLoading(container) {
    container.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-truck-fast fa-3x"></i>
            <p>Cargando conductores disponibles...</p>
        </div>
    `;
}

// Función para mostrar mensaje de error
export function showError(container, message) {
    container.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-exclamation-circle fa-3x"></i>
            <p>${message}</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">Por favor, recarga la página o intenta más tarde</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: white; border: none; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-sync-alt"></i> Reintentar
            </button>
        </div>
    `;
}

// Función para mostrar mensaje sin datos
export function showEmpty(container) {
    container.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-exclamation-triangle fa-3x"></i>
            <p>No hay conductores disponibles en este momento</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">Por favor, vuelve a intentar más tarde</p>
        </div>
    `;
}