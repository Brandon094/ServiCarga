/**
 * categories.config.js
 * Configuración de categorías de vehículos
 */

export const categories = [
    {
        id: 'motos',
        name: 'Mototaxi',
        icon: 'fa-motorcycle',
        vehicleIcon: 'fa-motorcycle',
        vehicleType: 'moto',
        description: 'Transporte rápido en moto'
    },
    {
        id: 'motocarros',
        name: 'Motocarros',
        icon: 'fa-motorcycle',
        vehicleIcon: 'fa-motorcycle',
        vehicleType: 'motocarro',
        description: 'Carga pequeña en motocarro'
    },
    {
        id: 'tuktuk',
        name: 'TukTuk',
        icon: 'fa-car-side',
        vehicleIcon: 'fa-car-side',
        vehicleType: 'tuktuk',
        description: 'Transporte de 3 ruedas'
    },
    {
        id: 'camionetas',
        name: 'Camionetas',
        icon: 'fa-truck-pickup',
        vehicleIcon: 'fa-truck-pickup',
        vehicleType: 'camioneta',
        description: 'Transporte de carga mediana'
    },
    {
        id: 'camiones',
        name: 'Camiones',
        icon: 'fa-truck',
        vehicleIcon: 'fa-truck',
        vehicleType: 'camion',
        description: 'Transporte de carga pesada'
    }
];

/**
 * Obtiene una categoría por su tipo de vehículo
 * @param {string} vehicleType - Tipo de vehículo
 * @returns {Object|null} Objeto categoría o null
 */
export function getCategoryByVehicleType(vehicleType) {
    return categories.find(cat => cat.vehicleType === vehicleType) || null;
}

/**
 * Obtiene todas las categorías
 * @returns {Array} Array de categorías
 */
export function getAllCategories() {
    return categories;
}
