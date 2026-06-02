// auth.js - Funciones de autenticación
import { auth } from './firebase.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

// Login para administrador
export const loginAdmin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { 
            success: true, 
            user: userCredential.user,
            uid: userCredential.user.uid,
            email: userCredential.user.email
        };
    } catch (error) {
        let mensaje = "Error al iniciar sesión";
        
        switch (error.code) {
            case 'auth/invalid-credential':
                mensaje = "❌ Credenciales incorrectas";
                break;
            case 'auth/user-not-found':
                mensaje = "❌ Usuario no encontrado";
                break;
            case 'auth/wrong-password':
                mensaje = "❌ Contraseña incorrecta";
                break;
            case 'auth/too-many-requests':
                mensaje = "❌ Demasiados intentos. Intenta más tarde";
                break;
            case 'auth/invalid-email':
                mensaje = "❌ Email inválido";
                break;
            default:
                mensaje = `❌ Error: ${error.message}`;
        }
        
        return { success: false, error: mensaje };
    }
};

// Logout
export const logoutAdmin = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return { success: false, error: error.message };
    }
};

// Obtener usuario actual
export const getCurrentUser = () => {
    return auth.currentUser;
};

// Verificar estado de autenticación
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Verificar si está autenticado
export const isAuthenticated = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(!!user);
        });
    });
};