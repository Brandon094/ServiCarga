# 🚚 ServiCarga - Nátaga

**Directorio digital para conectar a la comunidad de Nátaga, Colombia, con servicios locales de transporte de carga (motocarros, camionetas y tuktuks).**

[![Responsive](https://img.shields.io/badge/Responsive-Yes-green.svg)](https://github.com/Brandon094/ServiCarga)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📖 Acerca del Proyecto

ServiCarga es una plataforma web innovadora diseñada específicamente para la comunidad de Nátaga, Huila, Colombia. Nuestro objetivo es facilitar la conexión entre residentes y visitantes con conductores locales de transporte de carga, promoviendo el comercio local y mejorando la accesibilidad a servicios esenciales.

### 🎯 Problema que Resuelve
- **Dificultad para encontrar transportistas locales:** Antes, la contratación dependía de referencias personales o llamadas aleatorias.
- **Falta de información centralizada:** No existía un lugar confiable para consultar servicios disponibles.
- **Acceso limitado:** Especialmente para personas sin conexiones locales o visitantes.

### 💡 Solución
Una aplicación web moderna que:
- Lista conductores verificados por categoría de vehículo.
- Proporciona contacto directo vía teléfono y WhatsApp.
- Ofrece una interfaz intuitiva y responsive.
- Garantiza actualización fácil de datos sin modificar código.

## ✨ Características Principales
* 📱 **Completamente Responsive:** Optimizado para móviles, tablets y escritorio.
* 🗂️ **Categorización Clara:** Motocarros, camionetas y tuktuks con iconos distintivos.
* 📞 **Integración Directa:** Botones de llamada y WhatsApp integrados.
* ⚡ **Performance Optimizada:** Carga dinámica vía JSON, arquitectura modular ES6+.
* 🔒 **Seguro y Accesible:** Prevención XSS, navegación por teclado, contrastes adecuados.
* 🎨 **Diseño Moderno:** Gradientes, animaciones suaves y glassmorphism.

## 🛠️ Stack Tecnológico
* **Frontend:** HTML5 semántico, CSS3 con variables y animaciones, JavaScript Vanilla (ES6+ Modules).
* **Recursos Externos:** Font Awesome 6 para iconos, Google Fonts para tipografía.
* **Datos:** JSON para almacenamiento ligero y fácil mantenimiento.
* **Desarrollo:** Arquitectura modular, responsive design, best practices de accesibilidad.

## 📂 Estructura del Proyecto
```
ServiCarga/
├── index.html             # Punto de entrada principal
├── css/
│   └── style.css          # Estilos globales con variables CSS
├── js/
│   ├── index.js           # Inicialización y orquestación
│   └── modules/
│       ├── config.js      # Configuración de categorías
│       ├── dataLoader.js  # Carga asíncrona de datos
│       ├── ui.js          # Gestión de interfaz de usuario
│       ├── cards.js       # Creación de componentes de tarjetas
│       └── utils.js       # Utilidades (formateo, escape HTML)
├── db/
│   ├── motocarros.json    # Datos de conductores de motocarros
│   ├── camionetas.json    # Datos de conductores de camionetas
│   └── tuktuk.json        # Datos de conductores de tuktuk
├── img/
│   └── banner.jpeg        # Imagen del banner principal
└── README.md              # Este archivo
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge).
- Servidor local para evitar restricciones CORS al cargar JSON.

### Instalación Rápida

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Brandon094/ServiCarga.git
   cd ServiCarga
   ```

2. **Ejecutar localmente:**
   - **Opción VS Code:** Instalar extensión "Live Server" y abrir `index.html`.
   - **Opción Terminal:** 
     ```bash
     python -m http.server 8000
     ```
     Luego abrir `http://localhost:8000` en tu navegador.

3. **¡Listo!** La aplicación cargará automáticamente los datos y mostrará los conductores disponibles.

## ⚙️ Personalización y Mantenimiento

### Agregar Nuevos Conductores
Edita los archivos JSON en `/db/` siguiendo este formato:
```json
{
  "id": 1,
  "name": "Nombre del Conductor",
  "phone": "3001234567",
  "vehicle": "Tipo de Vehículo"
}
```

### Modificar Estilos
Los colores y variables globales están definidos en `:root` dentro de `css/style.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-main: #2d3436;
  /* ... más variables */
}
```

### Agregar Nuevas Categorías
1. Actualizar `js/modules/config.js` con la nueva categoría.
2. Crear archivo JSON correspondiente en `/db/`.
3. Los módulos se encargarán del resto automáticamente.

## 🛠️ Roadmap y Mejoras Futuras
- [ ] **Buscador Avanzado:** Filtros por ubicación, precio, disponibilidad.
- [ ] **Registro de Conductores:** Formulario para que conductores se registren.
- [ ] **Sistema de Calificaciones:** Reviews y ratings de usuarios.
- [ ] **PWA (Progressive Web App):** Instalación offline y notificaciones.
- [ ] **Integración con Mapas:** Mostrar ubicación aproximada de conductores.
- [ ] **API Backend:** Para gestión centralizada de datos.

## 🤝 Contribución
¡Las contribuciones son bienvenidas! Si quieres mejorar ServiCarga:

1. Fork el proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

### Guías de Contribución
- Seguir estándares de código (ESLint recomendado).
- Mantener responsive design.
- Probar en múltiples navegadores.
- Actualizar documentación si es necesario.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos
- Comunidad de Nátaga por la inspiración.
- Font Awesome y Google Fonts por los recursos gratuitos.
- Open source community por las herramientas utilizadas.

---
**Desarrollado con ❤️ por [ChopCode Solutions](https://portfolio-chop-code-solutions-brando.vercel.app/)** ⭐️

*Si ServiCarga te ha sido útil, ¡dale una estrella al repositorio!* 🚚✨
