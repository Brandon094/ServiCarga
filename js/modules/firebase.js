import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB1i55B6-ibO5IW4wCcYKKVtTR-xLqeKNU",
    authDomain: "servicargahuila.firebaseapp.com",
    projectId: "servicargahuila",
    storageBucket: "servicargahuila.firebasestorage.app",
    messagingSenderId: "202344705500",
    appId: "1:202344705500:web:4366e5d58acfe8e997b319",
    measurementId: "G-PQE1DTKEQY"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);