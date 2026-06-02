import { db } from '/js/modules/firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// DOM elements
const form = document.getElementById('driverForm');
const mensajeDiv = document.getElementById('mensaje');
const MAX_FOTOS = 3;

// ========== FUNCIÓN: Mostrar mensajes ==========
function mostrarMensaje(texto, tipo) {
    mensajeDiv.innerHTML = `
        <div class="${tipo === 'success' ? 'success-message' : 'error-message'}">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${texto}
        </div>
    `;

    mensajeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (tipo === 'success') {
        setTimeout(() => {
            mensajeDiv.innerHTML = '';
        }, 5000);
    }
}

// ========== FUNCIÓN: Convertir imagen a Base64 ==========
function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// ========== FUNCIÓN: Procesar todas las fotos ==========
async function procesarFotos(archivos) {
    const fotosBase64 = [];

    for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];

        // Validar tamaño máximo (2MB por imagen)
        if (archivo.size > 2 * 1024 * 1024) {
            throw new Error(`La imagen ${archivo.name} pesa más de 2MB. Por favor reduce su tamaño.`);
        }

        const base64 = await convertirImagenABase64(archivo);
        fotosBase64.push(base64);
    }

    return fotosBase64;
}

// ========== FUNCIÓN: Validar teléfono ==========
function validarTelefono(telefono) {
    const telefonoLimpio = telefono.replace(/\D/g, '');
    return telefonoLimpio.length >= 10;
}

// ========== PREVIEW DE IMÁGENES ==========
const inputFotos = document.getElementById('fotos');
const previewContainer = document.getElementById('previewContainer');
const contadorFotos = document.getElementById('contadorFotos');
const fotoOpcionalMsg = document.getElementById('fotoOpcionalMsg');

// Mostrar mensaje opcional si existe el elemento
if (fotoOpcionalMsg && inputFotos) {
    inputFotos.addEventListener('change', function() {
        if (inputFotos.files.length > 0) {
            fotoOpcionalMsg.style.opacity = '0.5';
        } else {
            fotoOpcionalMsg.style.opacity = '1';
        }
    });
}

if (inputFotos) {
    inputFotos.addEventListener('change', function (e) {
        // Limpiar preview anterior
        if (previewContainer) previewContainer.innerHTML = '';

        const archivos = Array.from(e.target.files);

        // Limitar a 3 fotos
        if (archivos.length > MAX_FOTOS) {
            mostrarMensaje(`📸 Solo puedes subir máximo ${MAX_FOTOS} fotografías`, 'error');
            inputFotos.value = '';
            if (contadorFotos) contadorFotos.textContent = '';
            return;
        }

        // Mostrar contador
        if (contadorFotos) {
            if (archivos.length === 0) {
                contadorFotos.textContent = `📸 Sin fotos (opcional)`;
            } else {
                contadorFotos.textContent = `📸 ${archivos.length} / ${MAX_FOTOS} fotografías seleccionadas`;
            }
        }

        // Generar preview de cada imagen
        archivos.forEach(archivo => {
            if (archivo.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = archivo.name;
                    if (previewContainer) previewContainer.appendChild(img);
                }

                reader.readAsDataURL(archivo);
            }
        });
    });
}

// ========== ENVÍO DEL FORMULARIO ==========
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const telefonoRaw = document.getElementById('telefono').value.trim();
    const vehiculoSelect = document.getElementById('vehiculo');
    let vehiculo = vehiculoSelect.options[vehiculoSelect.selectedIndex]?.text || vehiculoSelect.value;
    vehiculo = vehiculo.toLowerCase();
    const confirmacion = document.getElementById('confirmacion').checked;
    const estado = document.getElementById('estado').value;
    const archivos = Array.from(document.getElementById('fotos').files);

    // 2. Validaciones básicas (fotos NO son obligatorias)
    if (!nombre) {
        mostrarMensaje('❌ Por favor ingresa tu nombre completo', 'error');
        return;
    }

    if (!telefonoRaw) {
        mostrarMensaje('❌ Por favor ingresa tu número de WhatsApp', 'error');
        return;
    }

    const telefonoLimpio = telefonoRaw.replace(/\D/g, '');
    if (!validarTelefono(telefonoRaw)) {
        mostrarMensaje('❌ El número de WhatsApp debe tener al menos 10 dígitos', 'error');
        return;
    }

    if (!vehiculo || vehiculo === 'Selecciona una opción') {
        mostrarMensaje('❌ Por favor selecciona el tipo de vehículo', 'error');
        return;
    }

    if (!confirmacion) {
        mostrarMensaje('❌ Debes confirmar que el número de WhatsApp es correcto', 'error');
        return;
    }

    if (archivos.length > MAX_FOTOS) {
        mostrarMensaje(`❌ Solo puedes subir máximo ${MAX_FOTOS} fotografías`, 'error');
        return;
    }

    // Validar tipos de archivo (solo si hay archivos)
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    for (const archivo of archivos) {
        if (!tiposPermitidos.includes(archivo.type)) {
            mostrarMensaje('❌ Solo se permiten imágenes JPG, PNG o WEBP', 'error');
            return;
        }
    }

    // 3. Deshabilitar botón y mostrar loading
    const btnSubmit = form.querySelector('.btn-submit');
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Procesando solicitud...';
    btnSubmit.disabled = true;

    try {
        let galeria = [];
        
        // 4. Convertir imágenes a Base64 SOLO si hay fotos
        if (archivos.length > 0) {
            mostrarMensaje('📸 Procesando fotografías...', 'success');
            galeria = await procesarFotos(archivos);
        } else {
            console.log("📷 No se subieron fotos, continuando con galería vacía");
        }

        // 5. Guardar en Firestore (SOLO con campo galeria)
        mostrarMensaje('💾 Guardando información...', 'success');

        const solicitud = {
            nombre: nombre,
            telefono: telefonoLimpio,
            tipoVehiculo: vehiculo,
            galeria: galeria,              // 🔥 UN SOLO CAMPO: galeria
            estado: estado,
            fechaSolicitud: new Date().toISOString(),
            fechaRegistro: new Date(),
            tieneFotos: galeria.length > 0  // Indicador útil para el admin
        };

        const docRef = await addDoc(collection(db, "solicitudes"), solicitud);
        console.log("Documento guardado con ID:", docRef.id);
        console.log(`📸 Fotos: ${galeria.length} imagen(es) subidas`);

        // 6. Mensaje personalizado según si tiene fotos o no
        const mensajeExito = galeria.length > 0
            ? '✅ ¡Solicitud enviada con éxito! Hemos recibido tus fotos. Revisaremos tus datos y te contactaremos vía WhatsApp en las próximas 24-48 horas.'
            : '✅ ¡Solicitud enviada con éxito! Puedes agregar fotos más tarde desde tu perfil. Revisaremos tus datos y te contactaremos pronto.';
        
        mostrarMensaje(mensajeExito, 'success');

        // 7. Limpiar formulario
        form.reset();
        if (previewContainer) previewContainer.innerHTML = '';
        if (contadorFotos) contadorFotos.innerHTML = '📸 Sin fotos (opcional)';

        // Redirigir después de 3 segundos
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);

    } catch (error) {
        console.error('Error detallado:', error);

        if (error.message.includes('2MB')) {
            mostrarMensaje(error.message, 'error');
        } else if (error.message.includes('permission')) {
            mostrarMensaje('❌ Error de permisos en Firebase. Contacta al administrador.', 'error');
        } else {
            mostrarMensaje(
                '❌ Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.',
                'error'
            );
        }
    } finally {
        // Restaurar botón
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
    }
});