// admin.js - Panel administrativo con autenticación real
import { db } from './firebase.js';
import { logoutAdmin, onAuthChange } from './auth.js';
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    query,
    orderBy,
    getDoc,        // 👈 NUEVO: para obtener documento individual
    addDoc,        // 👈 NUEVO: para agregar a conductores
    where,         // 👈 NUEVO: para buscar por teléfono
    deleteDoc      // 👈 NUEVO: opcional para eliminar
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

let todasSolicitudes = [];

// ========== VERIFICAR AUTENTICACIÓN ==========
onAuthChange((user) => {
    if (!user) {
        window.location.href = 'admin-login.html';
    }
});

// ========== CERRAR SESIÓN ==========
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            const result = await logoutAdmin();
            if (result.success) {
                window.location.href = 'admin-login.html';
            } else {
                alert('Error al cerrar sesión: ' + result.error);
            }
        }
    });
}

// ========== CARGAR SOLICITUDES ==========
window.cargarSolicitudes = async function () {
    const container = document.getElementById('solicitudesContainer');
    if (!container) return;

    container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i><p>Cargando solicitudes...</p></div>';

    try {
        const q = query(collection(db, "solicitudes"), orderBy("fechaRegistro", "desc"));
        const querySnapshot = await getDocs(q);

        todasSolicitudes = [];
        querySnapshot.forEach((doc) => {
            todasSolicitudes.push({
                id: doc.id,
                ...doc.data()
            });
        });

        actualizarEstadisticas();
        aplicarFiltros();

    } catch (error) {
        console.error("Error al cargar:", error);
        container.innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar solicitudes. Verifica tu conexión.</p></div>';
    }
};

// ========== ACTUALIZAR ESTADÍSTICAS ==========
function actualizarEstadisticas() {
    const totalEl = document.getElementById('totalCount');
    const pendienteEl = document.getElementById('pendienteCount');
    const aprobadoEl = document.getElementById('aprobadoCount');

    if (totalEl) totalEl.textContent = todasSolicitudes.length;
    if (pendienteEl) pendienteEl.textContent = todasSolicitudes.filter(s => s.estado === 'pendiente').length;
    if (aprobadoEl) aprobadoEl.textContent = todasSolicitudes.filter(s => s.estado === 'aprobado').length;
}

// ========== APLICAR FILTROS ==========
function aplicarFiltros() {
    const filtroEstado = document.getElementById('filtroEstado');
    const buscador = document.getElementById('buscador');

    const filtroEstadoValue = filtroEstado ? filtroEstado.value : 'todos';
    const buscadorValue = buscador ? buscador.value.toLowerCase() : '';

    let filtradas = [...todasSolicitudes];

    if (filtroEstadoValue !== 'todos') {
        filtradas = filtradas.filter(s => s.estado === filtroEstadoValue);
    }

    if (buscadorValue) {
        filtradas = filtradas.filter(s =>
            s.nombre?.toLowerCase().includes(buscadorValue) ||
            s.telefono?.includes(buscadorValue)
        );
    }

    renderizarSolicitudes(filtradas);
}

// ========== RENDERIZAR TARJETAS COMPACTAS ==========
function renderizarSolicitudes(solicitudes) {
    const container = document.getElementById('solicitudesContainer');
    if (!container) return;

    if (solicitudes.length === 0) {
        container.innerHTML = '<div class="no-results"><i class="fas fa-inbox"></i><p>No hay solicitudes que coincidan con los filtros</p></div>';
        return;
    }

    container.innerHTML = solicitudes.map(solicitud => `
        <div class="solicitud-card" data-id="${solicitud.id}">
            <div class="card-header">
                <strong>
                    <i class="fas fa-user"></i> ${escapeHtml(solicitud.nombre || 'Sin nombre')}
                </strong>
                <span class="estado-badge estado-${solicitud.estado || 'pendiente'}">
                    <i class="${getEstadoIcono(solicitud.estado)}"></i> ${getEstadoTexto(solicitud.estado)}
                </span>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <i class="fab fa-whatsapp"></i>
                    <strong>WhatsApp:</strong>
                    <span>${formatearTelefono(solicitud.telefono)}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-truck"></i>
                    <strong>Vehículo:</strong>
                    <span>${escapeHtml(solicitud.tipoVehiculo || 'No especificado')}</span>
                </div>
                <div class="info-row">
                    <i class="fas fa-calendar-alt"></i>
                    <strong>Fecha:</strong>
                    <span>${formatearFecha(solicitud.fechaRegistro)}</span>
                </div>
                
                ${solicitud.galeria && solicitud.galeria.length > 0 ? `
                    <div class="info-row">
                        <i class="fas fa-images"></i>
                        <strong>Fotos (${solicitud.galeria.length}):</strong>
                    </div>
                    <div class="fotos-gallery">
                        ${solicitud.galeria.slice(0, 4).map((foto, idx) => `
                            <img src="${foto}" class="foto-miniatura" onclick="verFoto('${foto.replace(/'/g, "\\'")}')" alt="Foto ${idx + 1}" loading="lazy">
                        `).join('')}
                        ${solicitud.galeria.length > 4 ? `<div class="foto-mas" onclick="verMasFotos(${JSON.stringify(solicitud.galeria).replace(/"/g, '&quot;')})">+${solicitud.galeria.length - 4}</div>` : ''}
                    </div>
                ` : `
                    <div class="info-row">
                        <i class="fas fa-camera-slash"></i>
                        <span class="text-muted">Sin fotografías</span>
                    </div>
                `}
                
                <div class="acciones">
                    ${solicitud.estado === 'pendiente' ? `
                        <button class="btn-accion btn-aprobar" onclick="cambiarEstado('${solicitud.id}', 'aprobado')">
                            <i class="fas fa-check-circle"></i> Aprobar
                        </button>
                        <button class="btn-accion btn-rechazar" onclick="cambiarEstado('${solicitud.id}', 'rechazado')">
                            <i class="fas fa-times-circle"></i> Rechazar
                        </button>
                    ` : `
                        <button class="btn-accion btn-revertir" onclick="cambiarEstado('${solicitud.id}', 'pendiente')">
                            <i class="fas fa-undo-alt"></i> Revertir
                        </button>
                    `}
                    <button class="btn-accion btn-whatsapp" onclick="enviarWhatsApp('${solicitud.telefono}', '${escapeHtml(solicitud.nombre || 'conductor')}', '${solicitud.estado}')">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== FUNCIONES AUXILIARES PARA ESTADOS ==========
function getEstadoIcono(estado) {
    switch (estado) {
        case 'pendiente': return 'fas fa-clock';
        case 'aprobado': return 'fas fa-check-circle';
        case 'rechazado': return 'fas fa-times-circle';
        default: return 'fas fa-question-circle';
    }
}

function getEstadoTexto(estado) {
    switch (estado) {
        case 'pendiente': return 'Pendiente';
        case 'aprobado': return 'Aprobado';
        case 'rechazado': return 'Rechazado';
        default: return 'Desconocido';
    }
}

// ========== ESCAPAR HTML (SEGURIDAD) ==========
function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ========== CAMBIAR ESTADO CON COPIA A CONDUCTORES ==========
window.cambiarEstado = async function (id, nuevoEstado) {
    const mensajeConfirmacion = nuevoEstado === 'aprobado' ? 'aprobar' : nuevoEstado === 'rechazado' ? 'rechazar' : 'revertir a pendiente';
    if (!confirm(`¿Estás seguro de ${mensajeConfirmacion} esta solicitud?`)) {
        return;
    }

    try {
        console.log("🚀 Iniciando cambio de estado para:", id, "nuevoEstado:", nuevoEstado);

        // 1. Obtener la solicitud completa
        const solicitudRef = doc(db, "solicitudes", id);
        const solicitudDoc = await getDoc(solicitudRef);

        if (!solicitudDoc.exists()) {
            mostrarToast('❌ No se encontró la solicitud', 'error');
            return;
        }

        const solicitudData = solicitudDoc.data();
        console.log("📋 Datos de la solicitud:", solicitudData);

        // 2. Si se está APROBANDO, copiar a la colección de conductores
        if (nuevoEstado === 'aprobado') {
            console.log("✍️ Intentando copiar a conductores...");

            // Verificar si ya existe un conductor con ese teléfono
            const conductoresQuery = query(
                collection(db, "conductores"),
                where("telefono", "==", solicitudData.telefono)
            );
            const existingDriver = await getDocs(conductoresQuery);
            console.log("🔍 Búsqueda de conductor existente:", existingDriver.empty ? "No existe" : "Ya existe");

            if (existingDriver.empty) {
                // Crear nuevo documento en conductores
                const conductorData = {
                    nombre: solicitudData.nombre,
                    telefono: solicitudData.telefono,
                    vehiculo: solicitudData.tipoVehiculo || 'No especificado',
                    galeria: solicitudData.galeria || [],
                    fechaRegistro: new Date(),
                    estado: 'activo',
                    activo: true,
                    solicitudId: id,
                    fechaAprobacion: new Date()
                };

                console.log("📝 Datos del conductor a guardar:", conductorData);

                try {
                    const docRef = await addDoc(collection(db, "conductores"), conductorData);
                    console.log("✅ Conductor guardado con ID:", docRef.id);
                    mostrarToast(`✅ Conductor ${solicitudData.nombre} agregado a la lista`, 'success');
                } catch (firestoreError) {
                    console.error("❌ Error específico de Firestore:", firestoreError);
                    mostrarToast(`❌ Error al guardar: ${firestoreError.message}`, 'error');
                    throw firestoreError;
                }
            } else {
                // Si ya existe, actualizar su estado
                const conductorDoc = existingDriver.docs[0];
                await updateDoc(doc(db, "conductores", conductorDoc.id), {
                    estado: 'activo',
                    activo: true,
                    fechaReactivacion: new Date()
                });
                console.log("✅ Conductor reactivado:", conductorDoc.id);
                mostrarToast(`⚠️ El conductor ${solicitudData.nombre} ya estaba registrado, se ha reactivado`, 'warning');
            }
        }

        // 3. Si se RECHAZA, marcar como inactivo en conductores (si existía)
        if (nuevoEstado === 'rechazado') {
            console.log("❌ Procesando rechazo...");
            const conductoresQuery = query(
                collection(db, "conductores"),
                where("telefono", "==", solicitudData.telefono)
            );
            const existingDriver = await getDocs(conductoresQuery);

            if (!existingDriver.empty) {
                const conductorDoc = existingDriver.docs[0];
                await updateDoc(doc(db, "conductores", conductorDoc.id), {
                    estado: 'inactivo',
                    activo: false,
                    fechaRechazo: new Date(),
                    motivoRechazo: 'Solicitud rechazada'
                });
                console.log("⚠️ Conductor marcado como inactivo");
                mostrarToast(`⚠️ Conductor ${solicitudData.nombre} marcado como inactivo`, 'warning');
            }
        }

        // 4. Si se REVIERTE a pendiente (viniendo de aprobado), marcar como pendiente en conductores
        if (nuevoEstado === 'pendiente') {
            const solicitudActual = todasSolicitudes.find(s => s.id === id);
            if (solicitudActual && solicitudActual.estado === 'aprobado') {
                console.log("🔄 Revirtiendo conductor...");
                const conductoresQuery = query(
                    collection(db, "conductores"),
                    where("telefono", "==", solicitudData.telefono)
                );
                const existingDriver = await getDocs(conductoresQuery);

                if (!existingDriver.empty) {
                    const conductorDoc = existingDriver.docs[0];
                    await updateDoc(doc(db, "conductores", conductorDoc.id), {
                        estado: 'pendiente',
                        activo: false,
                        fechaRevertida: new Date()
                    });
                    console.log("⚠️ Conductor revertido");
                    mostrarToast(`⚠️ Conductor ${solicitudData.nombre} revertido a estado pendiente`, 'warning');
                }
            }
        }

        // 5. Actualizar el estado de la solicitud
        console.log("📝 Actualizando estado de la solicitud a:", nuevoEstado);
        await updateDoc(solicitudRef, {
            estado: nuevoEstado,
            fechaActualizacion: new Date()
        });

        // 6. Mostrar mensaje de éxito
        let mensajeExito = '';
        if (nuevoEstado === 'aprobado') {
            mensajeExito = 'aprobada y conductor agregado al sistema';
        } else if (nuevoEstado === 'rechazado') {
            mensajeExito = 'rechazada';
        } else {
            mensajeExito = 'revertida a pendiente';
        }
        mostrarToast(`✅ Solicitud ${mensajeExito} correctamente`, 'success');

        // 7. Recargar solicitudes
        cargarSolicitudes();

    } catch (error) {
        console.error("❌ Error GENERAL al actualizar:", error);
        console.error("Código de error:", error.code);
        console.error("Mensaje:", error.message);

        if (error.code === 'permission-denied') {
            mostrarToast('❌ No tienes permisos para escribir en la base de datos. Contacta al administrador.', 'error');
        } else {
            mostrarToast('❌ Error al cambiar el estado: ' + error.message, 'error');
        }
    }
};

// ========== MOSTRAR TOAST (NOTIFICACIÓN) ==========
function mostrarToast(mensaje, tipo = 'info') {
    // Crear toast si no existe
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);

        // Estilos del toast
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 500;
            z-index: 3000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            border-left: 4px solid var(--accent);
            box-shadow: var(--shadow-lg);
        `;
    }

    // Cambiar color según tipo
    const borderColor = tipo === 'success' ? '#1f8f3c' : tipo === 'error' ? '#ef4444' : '#ff7a1a';
    toast.style.borderLeftColor = borderColor;
    toast.textContent = mensaje;

    // Mostrar
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
    }, 3000);
}

// ========== ENVIAR WHATSAPP ==========
window.enviarWhatsApp = function (telefono, nombre, estado) {
    let mensaje = '';
    const icono = estado === 'aprobado' ? '✅' : estado === 'rechazado' ? '❌' : '📋';

    if (estado === 'aprobado') {
        mensaje = `¡Felicidades ${nombre}! ${icono} Tu solicitud en ServiCarga ha sido APROBADA. Ya puedes comenzar a recibir clientes. ¡Bienvenido al equipo! 🚛`;
    } else if (estado === 'rechazado') {
        mensaje = `Hola ${nombre}, ${icono} lamentamos informarte que tu solicitud en ServiCarga no ha sido aprobada. Por favor contáctanos al WhatsApp para más información.`;
    } else {
        mensaje = `Hola ${nombre}, ${icono} tu solicitud en ServiCarga está siendo revisada. Te contactaremos pronto. ¡Gracias por confiar en nosotros!`;
    }

    // Limpiar número (solo dígitos)
    let numeroLimpio = telefono?.toString().replace(/\D/g, '') || '';
    if (numeroLimpio.startsWith('57')) {
        numeroLimpio = numeroLimpio.substring(2);
    }

    const url = `https://wa.me/57${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
};

// ========== VER FOTO EN MODAL ==========
window.verFoto = function (url) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    if (modal && modalImg) {
        modalImg.src = url;
        modal.classList.add('active');
    }
};

// ========== VER MÁS FOTOS ==========
window.verMasFotos = function (fotos) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    if (modal && modalImg && fotos && fotos.length) {
        modalImg.src = fotos[0];
        modal.classList.add('active');
        console.log('Ver más fotos:', fotos.length);
    }
};

// ========== CERRAR MODAL ==========
window.cerrarModal = function () {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
};

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});

// ========== FORMATEAR TELÉFONO ==========
function formatearTelefono(telefono) {
    if (!telefono) return 'No disponible';
    const telStr = telefono.toString();
    if (telStr.length === 10) {
        return `${telStr.slice(0, 3)} ${telStr.slice(3, 6)} ${telStr.slice(6)}`;
    }
    return telStr;
}

// ========== FORMATEAR FECHA ==========
function formatearFecha(fecha) {
    if (!fecha) return 'Fecha no disponible';
    try {
        const date = fecha.toDate ? fecha.toDate() : new Date(fecha);
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha inválida';
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    // Configurar event listeners
    const filtroEstado = document.getElementById('filtroEstado');
    const buscador = document.getElementById('buscador');
    const refreshBtn = document.getElementById('refreshBtn');

    if (filtroEstado) filtroEstado.addEventListener('change', aplicarFiltros);
    if (buscador) buscador.addEventListener('input', aplicarFiltros);
    if (refreshBtn) refreshBtn.addEventListener('click', cargarSolicitudes);

    // Cargar solicitudes
    cargarSolicitudes();
});