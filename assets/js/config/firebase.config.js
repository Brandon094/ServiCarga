/**
 * firebase.config.js
 * Configuración de Firebase centralizada
 * 
 * NOTA: Las credenciales públicas de Firebase están seguras aquí.
 * Las restricciones de seguridad se configuran en Firebase Console.
 */

const firebaseConfig = {
    apiKey: "AIzaSyB1i55B6-ibO5IW4wCcYKKVtTR-xLqeKNU",
    authDomain: "servicargahuila.firebaseapp.com",
    projectId: "servicargahuila",
    storageBucket: "servicargahuila.firebasestorage.app",
    messagingSenderId: "202344705500",
    appId: "1:202344705500:web:4366e5d58acfe8e997b319",
    measurementId: "G-PQE1DTKEQY"
};

// Versión de Firebase
export const FIREBASE_VERSION = "12.14.0";

// URLs de CDN de Firebase
export const FIREBASE_CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;

export default firebaseConfig;
