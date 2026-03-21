// Función para cargar datos de una categoría
export async function loadCategory(category) {
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

// Función para cargar todas las categorías
export async function loadAllCategories(categories) {
    try {
        const loadPromises = categories.map(category => loadCategory(category));
        const results = await Promise.all(loadPromises);
        return results.filter(result => result !== null);
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        return [];
    }
}