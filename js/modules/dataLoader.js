import { db } from '../modules/firebase.js';

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Cargar una categoría
export async function loadCategory(category) {

    try {

        console.log(`🔍 Consultando categoría: ${category.vehicleType}`);

        const q = query(
            collection(db, "conductores"),
            where("vehiculo", "==", category.vehicleType)
        );

        const snapshot = await getDocs(q);

        console.log(
            `📂 Categoría: ${category.vehicleType}`,
            `| Documentos encontrados: ${snapshot.size}`
        );

        const conductores = snapshot.docs.map(doc => {

            const data = doc.data();

            return {
                id: doc.id,
                name: data.nombre || '',
                phone: data.telefono || '',
                vehicle: data.vehiculo || '',
                gallery: data.galeria || []
            };

        });

        console.log(`👥 Conductores cargados:`, conductores);

        if (conductores.length === 0) {
            console.warn(`⚠️ No se encontraron conductores para ${category.vehicleType}`);
            return null;
        }

        return {
            category,
            drivers: conductores
        };

    } catch (error) {

        console.error(`❌ Error al cargar ${category.name}:`, error);
        return null;

    }

}

// Cargar todas las categorías
export async function loadAllCategories(categories) {

    try {

        const loadPromises = categories.map(category =>
            loadCategory(category)
        );

        const results = await Promise.all(loadPromises);

        const validResults = results.filter(result => result !== null);

        console.log(
            `✅ Categorías cargadas: ${validResults.length}/${categories.length}`
        );

        return validResults;

    } catch (error) {

        console.error('❌ Error al cargar categorías:', error);
        return [];

    }

}