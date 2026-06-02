# 📦 Guía de Estructura Modular - ServiCarga

## 📁 Nueva Estructura del Proyecto

```
assets/js/
├── config/              ⚙️  Configuraciones centralizadas
│   ├── app.config.js           - Constantes y configuración global
│   ├── firebase.config.js       - Configuración de Firebase
│   ├── categories.config.js     - Categorías de vehículos
│   └── index.js                - Exporta todo
│
├── utils/              🔧 Funciones utilitarias reutilizables
│   ├── formatting.js           - Formateo de datos (teléfono, fecha, moneda)
│   ├── validators.js           - Validación de datos (email, teléfono, etc)
│   ├── security.js             - Seguridad (escapar HTML, sanitizar, etc)
│   ├── analytics.js            - Rastreo con Google Analytics
│   ├── storage.js              - Manejo de localStorage
│   └── index.js                - Exporta todo
│
└── modules/             📦 Lógica de negocio y componentes
    ├── firebase.js             - Inicialización de Firebase
    ├── auth.js                 - Autenticación
    ├── config.js               - [DEPRECADO] usar ../config/categories.config.js
    ├── utils.js                - [DEPRECADO] usar ../utils/index.js
    ├── dataLoader.js           - Carga de datos desde Firestore
    ├── ui.js                   - Componentes de UI
    ├── cards.js                - Tarjetas de conductores
    ├── anuncios.js             - Gestión de anuncios
    ├── admin-login.js          - Login del admin
    ├── admin.js                - Panel administrativo
    ├── register.js             - Registro de conductores
    └── index.js                - Punto de entrada principal
```

## 🎯 Principios de Organización

### 1. **Config /** - Configuración centralizada
Almacena todas las constantes, credenciales y configuraciones:
- Información de Firebase
- Constantes de la aplicación
- Datos estáticos (categorías, rutas, etc)

**Uso:**
```javascript
import { categories } from '../config/categories.config.js';
import { APP_NAME, DOM_IDS } from '../config/app.config.js';
import { firebaseConfig } from '../config/firebase.config.js';
```

### 2. **Utils /** - Funciones utilitarias
Funciones puras y reutilizables sin dependencias de Firebase:

#### `formatting.js`
```javascript
import { formatPhoneNumber, formatDate, formatCurrency } from '../utils/formatting.js';

const phone = formatPhoneNumber('573001234567'); // "300 123 4567"
const date = formatDate(new Date()); // "2/6/2026"
const price = formatCurrency(150000); // "$150,000.00"
```

#### `validators.js`
```javascript
import { isValidPhoneNumber, isValidEmail, isValidPassword } from '../utils/validators.js';

if (isValidPhoneNumber(phone)) {
    // Procesar...
}
```

#### `security.js`
```javascript
import { escapeHtml, sanitizeHtml, isUrlSafe } from '../utils/security.js';

const safe = escapeHtml(userInput); // Previene XSS
```

#### `analytics.js`
```javascript
import { trackDriverContact, trackError, trackEvent } from '../utils/analytics.js';

trackDriverContact(driverId, 'Juan Pérez', 'whatsapp', 'moto');
trackError('Error al cargar conductores', 'dataLoader');
```

#### `storage.js`
```javascript
import { setStorage, getStorage, removeStorage } from '../utils/storage.js';

setStorage('user_theme', 'dark');
const theme = getStorage('user_theme', 'light'); // 'dark'
removeStorage('user_theme');
```

### 3. **Modules /** - Lógica de negocio
Componentes que contienen la lógica específica de la aplicación:

```javascript
// ✅ Importar configuración
import { categories } from '../config/categories.config.js';

// ✅ Importar utilidades
import { formatPhoneNumber, trackError } from '../utils/index.js';

// ✅ Importar servicios
import { db, auth } from './firebase.js';

export function loadDrivers() {
    try {
        // Lógica...
        trackEvent('drivers_loaded');
    } catch (error) {
        trackError(error.message, 'loadDrivers');
    }
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Crear un nuevo componente
```javascript
// modules/features/testimonials.js
import { escapeHtml, trackEvent } from '../utils/index.js';
import { MESSAGES } from '../config/app.config.js';

export function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.innerHTML = `
        <h3>${escapeHtml(testimonial.author)}</h3>
        <p>${escapeHtml(testimonial.text)}</p>
    `;
    
    trackEvent('testimonial_viewed', {
        author: testimonial.author
    });
    
    return card;
}
```

### Ejemplo 2: Validar formulario
```javascript
// modules/admin-login.js
import { isValidEmail, isValidPassword } from '../utils/validators.js';
import { trackFormSubmit } from '../utils/analytics.js';

async function handleLogin(email, password) {
    if (!isValidEmail(email)) {
        console.error('Email inválido');
        return;
    }
    
    if (!isValidPassword(password)) {
        console.error('Contraseña muy corta');
        return;
    }
    
    try {
        // ... lógica de login
        trackFormSubmit('login', true);
    } catch (error) {
        trackFormSubmit('login', false);
    }
}
```

### Ejemplo 3: Usar almacenamiento persistente
```javascript
// modules/index.js
import { getStorage, setStorage } from '../utils/storage.js';
import { STORAGE_KEYS, THEMES } from '../config/app.config.js';

export function initTheme() {
    const savedTheme = getStorage(STORAGE_KEYS.THEME, THEMES.LIGHT);
    applyTheme(savedTheme);
}

export function toggleTheme() {
    const current = getStorage(STORAGE_KEYS.THEME, THEMES.LIGHT);
    const newTheme = current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setStorage(STORAGE_KEYS.THEME, newTheme);
    applyTheme(newTheme);
}
```

## 🔄 Migración de código antiguo

### Antes (Sin estructura)
```javascript
// Imports desordenados
import { db } from './firebase.js';
import { categories } from './config.js';
// Funciones sin clasificar...
function formatPhoneNumber(phone) { /*...*/ }
function escapeHtml(text) { /*...*/ }
```

### Después (Estructura modular)
```javascript
// Imports organizados por tipo
import { categories } from '../config/categories.config.js';
import { db } from './firebase.js';
import { formatPhoneNumber, escapeHtml } from '../utils/index.js';
```

## ✅ Buenas prácticas

1. **Importar por categoría**
   ```javascript
   // ✅ Bien
   import { APP_NAME, DOM_IDS } from '../config/app.config.js';
   
   // ❌ Evitar
   import app from '../config/app.config.js';
   ```

2. **Usar funciones puras en utils**
   ```javascript
   // ✅ Bien - Sin efectos secundarios
   export function formatPrice(price) {
       return `$${price.toFixed(2)}`;
   }
   
   // ❌ Evitar - Con efectos secundarios
   export function formatPrice(price) {
       console.log(price);
       document.getElementById('price').textContent = price;
   }
   ```

3. **Exportar solo lo necesario**
   ```javascript
   // ✅ Bien - Exports explícitos
   export { formatPhoneNumber } from './formatting.js';
   export { trackEvent } from './analytics.js';
   
   // ❌ Evitar - Exportar todo
   export * from './formatting.js';
   ```

4. **Mantener módulos enfocados**
   - `formatting.js` solo formatea
   - `validators.js` solo valida
   - `security.js` solo asegura
   - No mezclar responsabilidades

## 🚀 Ventajas de esta estructura

✅ **Mantenibilidad** - Código organizado y fácil de encontrar  
✅ **Reusabilidad** - Funciones reutilizables en toda la app  
✅ **Testabilidad** - Funciones puras fáciles de testear  
✅ **Escalabilidad** - Fácil agregar nuevas funcionalidades  
✅ **Independencia** - Módulos sin dependencias circulares  
✅ **Profesional** - Estructura estándar de industria

## 📚 Referencias

- **ES Modules**: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules
- **Single Responsibility**: https://en.wikipedia.org/wiki/Single-responsibility_principle
- **Module Pattern**: https://www.patterns.dev/posts/module-pattern/
