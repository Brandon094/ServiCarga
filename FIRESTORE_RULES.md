# 🔐 Reglas de Firestore - ServiCarga

## Configuración de Seguridad Actualizada

**Admin UID:** `IzNfIp6D8nQfmFbpm2OevZVhQrl2`

### 📋 Reglas Activas:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // 📍 Colección: conductores
    // - Cualquiera puede LEER (mostrar en página principal)
    // - Solo admin puede ESCRIBIR/ACTUALIZAR
    match /conductores/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'IzNfIp6D8nQfmFbpm2OevZVhQrl2';
      allow update: if request.auth != null && request.auth.uid == 'IzNfIp6D8nQfmFbpm2OevZVhQrl2';
      allow delete: if false;
    }
    
    // 📝 Colección: solicitudes
    // - Cualquiera puede CREAR (registro público sin login)
    // - Solo admin puede LEER y ACTUALIZAR (aceptar/rechazar)
    match /solicitudes/{document} {
      allow read: if request.auth != null && request.auth.uid == 'IzNfIp6D8nQfmFbpm2OevZVhQrl2';
      allow create: if true;  // ✅ Registro público - sin login requerido
      allow update: if request.auth != null && request.auth.uid == 'IzNfIp6D8nQfmFbpm2OevZVhQrl2';
      allow delete: if false;
    }
    
    // 👤 Colección: admin
    // - Solo el admin puede acceder a sus datos
    match /admin/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

## ✅ Flujo de Acceso:

### **1. Visitantes (sin login)**

✅ Ver: Todos los conductores disponibles
✅ Hacer: Enviar solicitud de registro (sin autenticación)
❌ Ver: Solicitudes de otros
❌ Cambiar: Estado de solicitudes


### **2. Admin (con login)**

✅ Ver: Todos los conductores
✅ Ver: Todas las solicitudes
✅ Aceptar/Rechazar: Solicitudes
✅ Crear/Editar: Conductores


### **3. Otros Usuarios Autenticados**

✅ Ver: Todos los conductores
❌ Ver: Solicitudes (aunque estén autenticados)
❌ Cambiar: Estado




## 🔄 Cómo Actualizar en Firebase:

1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto `servicargahuila`
3. Ve a **Firestore Database** → **Reglas**
4. **Reemplaza todo** con el código de arriba
5. Haz clic en **Publicar**



## 🛡️ Seguridad:

- ✅ API key en GitHub **no importa** (está protegida por reglas)
- ✅ Registro público permitido (sin login)
- ✅ Admin es el único que ve y gestiona solicitudes
- ✅ Conductores visibles a todos (es el propósito)
- ✅ No se puede eliminar nada accidentalmente
