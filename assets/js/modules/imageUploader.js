/**
 * imageUploader.js
 * Maneja carga de imágenes a Firebase Cloud Storage
 * Optimiza performance al evitar almacenar Base64 en Firestore
 */

import { storage } from './firebase.js';
import { 
    ref, 
    uploadBytes, 
    getDownloadURL,
    deleteObject 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";

// ========== VALIDAR IMAGEN ==========
export function validarImagen(archivo) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        throw new Error('❌ Solo se permiten imágenes JPG, PNG o WEBP');
    }

    if (archivo.size > MAX_SIZE) {
        throw new Error(`❌ La imagen no puede superar 5MB (tu archivo: ${(archivo.size / 1024 / 1024).toFixed(2)}MB)`);
    }

    return true;
}

// ========== COMPRIMIR IMAGEN ==========
export async function comprimirImagen(archivo) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Reducir tamaño si es muy grande
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = (height * MAX_WIDTH) / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = (width * MAX_HEIGHT) / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir a blob con compresión
                canvas.toBlob(
                    (blob) => {
                        resolve(blob);
                    },
                    'image/jpeg',
                    0.8 // 80% de calidad
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(archivo);
    });
}

// ========== SUBIR IMAGEN A STORAGE ==========
export async function subirImagenAStorage(archivo, telefono, indice) {
    try {
        // Validar
        validarImagen(archivo);

        // Comprimir
        const imagenComprimida = await comprimirImagen(archivo);

        // Crear referencia en Storage
        const timestamp = Date.now();
        const nombreArchivo = `conductores/${telefono}/${timestamp}_${indice}.jpg`;
        const storageRef = ref(storage, nombreArchivo);

        // Subir
        console.log(`📤 Subiendo imagen ${indice + 1}...`);
        await uploadBytes(storageRef, imagenComprimida);

        // Obtener URL pública
        const url = await getDownloadURL(storageRef);
        console.log(`✅ Imagen ${indice + 1} subida:`, url);

        return url;

    } catch (error) {
        console.error(`❌ Error al subir imagen ${indice}:`, error);
        throw error;
    }
}

// ========== SUBIR MÚLTIPLES IMÁGENES ==========
export async function subirMultiplesImagenes(archivos, telefono) {
    try {
        const uploadPromises = archivos.map((archivo, indice) =>
            subirImagenAStorage(archivo, telefono, indice)
        );

        const urls = await Promise.all(uploadPromises);
        console.log(`✅ Todas las imágenes subidas:`, urls);
        return urls;

    } catch (error) {
        console.error('❌ Error al subir múltiples imágenes:', error);
        throw error;
    }
}

// ========== ELIMINAR IMAGEN DE STORAGE ==========
export async function eliminarImagenDeStorage(urlImagen) {
    try {
        // Extraer ruta de la URL pública
        const startIndex = urlImagen.lastIndexOf('/') + 1;
        const endIndex = urlImagen.lastIndexOf('?');
        const nombreArchivo = decodeURIComponent(
            urlImagen.substring(startIndex, endIndex)
        );

        const storageRef = ref(storage, nombreArchivo);
        await deleteObject(storageRef);
        console.log('🗑️ Imagen eliminada de Storage');

    } catch (error) {
        console.warn('⚠️ Error al eliminar imagen:', error);
        // No fallar si la imagen ya no existe
    }
}

// ========== ELIMINAR GALERÍA COMPLETA ==========
export async function eliminarGaleriaCompleta(urlsImagenes) {
    try {
        const deletePromises = urlsImagenes.map(url =>
            eliminarImagenDeStorage(url)
        );

        await Promise.all(deletePromises);
        console.log('✅ Galería eliminada completamente');

    } catch (error) {
        console.error('❌ Error al eliminar galería:', error);
        throw error;
    }
}

export default {
    validarImagen,
    comprimirImagen,
    subirImagenAStorage,
    subirMultiplesImagenes,
    eliminarImagenDeStorage,
    eliminarGaleriaCompleta
};
