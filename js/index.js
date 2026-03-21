// Importar todos los módulos
import { categories } from './modules/config.js';
import { loadAllCategories } from './modules/dataLoader.js';
import { createCategorySection, showLoading, showError, showEmpty } from './modules/ui.js';
import { renderAnunciosDestacados } from './modules/anuncios.js';

// ========== FUNCIONES DE TEMA ==========

/**
 * Cambia el tema entre claro y oscuro
 */
export function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        updateThemeButton(false);
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        updateThemeButton(true);
    }
    
    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { isDark: !isDark } 
    }));
}

/**
 * Actualiza el ícono y texto del botón según el tema actual
 */
function updateThemeButton(isDark) {
    const themeButton = document.getElementById('theme-button');
    const themeCheckbox = document.getElementById('theme-toggle');
    
    if (themeButton) {
        const icon = themeButton.querySelector('i');
        const span = themeButton.querySelector('span');
        
        if (isDark) {
            if (icon) icon.className = 'fas fa-sun';
            if (span) span.textContent = 'Modo claro';
        } else {
            if (icon) icon.className = 'fas fa-moon';
            if (span) span.textContent = 'Modo oscuro';
        }
    }
    
    if (themeCheckbox) {
        themeCheckbox.checked = isDark;
    }
}

/**
 * Inicializa el tema basado en preferencias guardadas o del sistema
 */
export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determinar el tema inicial
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    if (isDark) {
        document.body.classList.add('dark-theme');
        updateThemeButton(true);
    } else {
        document.body.classList.remove('dark-theme');
        updateThemeButton(false);
    }
    
    // Escuchar cambios en preferencias del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Solo cambiar si no hay preferencia guardada
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                updateThemeButton(true);
            } else {
                document.body.classList.remove('dark-theme');
                updateThemeButton(false);
            }
        }
    });
}

/**
 * Crea e inserta el switch toggle de tema en la página
 */
export function createThemeButton() {
    // Verificar si ya existe el switch
    if (document.querySelector('#theme-button') || document.querySelector('.theme-switch-wrapper')) {
        return;
    }
    
    // Crear wrapper del switch
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-switch-wrapper';
    wrapper.innerHTML = `
        <label class="theme-switch" for="theme-toggle">
            <input type="checkbox" id="theme-toggle" />
            <div class="slider round">
                <i class="fas fa-sun"></i>
                <i class="fas fa-moon"></i>
            </div>
        </label>
        <span class="theme-label">Modo oscuro</span>
    `;
    
    document.body.appendChild(wrapper);
    
    const checkbox = document.getElementById('theme-toggle');
    if (checkbox) {
        // IMPORTANTE: Usar la función toggleTheme de este archivo
        checkbox.addEventListener('change', () => toggleTheme());
    }
}

// ========== FUNCIONES PRINCIPALES ==========

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
    // Inicializar tema (antes de cargar cualquier contenido)
    initTheme();
    
    // Crear botón de tema
    createThemeButton();
    
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
window.toggleTheme = toggleTheme;
window.ServiCarga = {
    loadAllDrivers,
    updateCurrentYear,
    toggleTheme,
    initTheme
};