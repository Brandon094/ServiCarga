import { db } from './firebase.js';
import { loginAdmin, onAuthChange } from './auth.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const form = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn') || document.querySelector('.login-btn');
const errorMsg = document.getElementById('errorMsg');
const errorText = document.getElementById('errorText');

// Verificar si ya está autenticado
onAuthChange(async (user) => {
    if (user) {
        // Verificar que sea admin (documento en colección admin)
        const adminRef = doc(db, "admin", user.uid);
        const adminDoc = await getDoc(adminRef);
        
        if (adminDoc.exists()) {
            window.location.href = 'admin.html';
        }
    }
});

// Manejar envío del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Validaciones básicas
    if (!email || !password) {
        errorText.textContent = '❌ Por favor completa todos los campos';
        errorMsg.classList.add('show');
        setTimeout(() => errorMsg.classList.remove('show'), 3000);
        return;
    }
    
    // Deshabilitar botón y mostrar loading
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="loading-spinner"></span> Verificando...';
    
    try {
        // Intentar login
        const result = await loginAdmin(email, password);
        
        if (!result.success) {
            errorText.textContent = result.error;
            errorMsg.classList.add('show');
            setTimeout(() => errorMsg.classList.remove('show'), 3000);
            return;
        }
        
        // Verificar que sea admin
        const adminRef = doc(db, "admin", result.uid);
        const adminDoc = await getDoc(adminRef);
        
        if (adminDoc.exists()) {
            // Es admin, redirigir al dashboard
            window.location.href = 'admin.html';
        } else {
            // No es admin, cerrar sesión
            const { logoutAdmin } = await import('../js/modules/auth.js');
            await logoutAdmin();
            errorText.textContent = '❌ No tienes permisos de administrador';
            errorMsg.classList.add('show');
            setTimeout(() => errorMsg.classList.remove('show'), 3000);
        }
        
    } catch (error) {
        console.error('Error:', error);
        errorText.textContent = '❌ Error al iniciar sesión';
        errorMsg.classList.add('show');
        setTimeout(() => errorMsg.classList.remove('show'), 3000);
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
    }
});