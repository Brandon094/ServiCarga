// firebase.js - Configuración central de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyB1i55B6-ibO5IW4wCcYKKVtTR-xLqeKNU",
    authDomain: "servicargahuila.firebaseapp.com",
    projectId: "servicargahuila",
    storageBucket: "servicargahuila.firebasestorage.app",
    messagingSenderId: "202344705500",
    appId: "1:202344705500:web:4366e5d58acfe8e997b319",
    measurementId: "G-PQE1DTKEQY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;