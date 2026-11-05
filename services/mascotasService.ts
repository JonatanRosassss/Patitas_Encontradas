// services/mascotasService.ts
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage';
import { Platform } from 'react-native';
import { ConexionFirebase } from '@/services/ConexionFirebase';
import { resolverUbicacionAlerta } from '@/utils/detalleMascota';
import type {
  Pet,
  NuevaAlertaMascota,
  ActualizarAlertaMascota,
  FiltrosListadoMascotas,
  PetConUsuario,
} from '@/types/Pet';
import type { Usuario } from '@/types/User';
import type { MapPet, PetState } from '@/types/map';

const db = ConexionFirebase.obtenerFirestore();
const storage = ConexionFirebase.obtenerStorage();
const auth = ConexionFirebase.obtenerAuth();

const COLECCION_ALERTAS = 'alertas';
const COLECCION_USUARIOS = 'usuarios';

// ==========================================
// HELPERS INTERNOS
// ==========================================

/**
 * Elimina las claves con valor undefined (incluso en objetos anidados como coordenadas)
 * para evitar que Firestore lance excepciones como:
 * "Function addDoc() called with invalid data. Unsupported field value: undefined"
 */
function limpiarUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const limpio: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    // Si es un objeto plano anidado (no Date, Timestamp, FieldValue, ni Array)
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof Timestamp) &&
      typeof (value as any)?.toMillis !== 'function'
    ) {
      const subLimpio = limpiarUndefined(value);
      if (Object.keys(subLimpio).length > 0) {
        limpio[key] = subLimpio;
      }
    } else {
      limpio[key] = value;
    }
  }
  return limpio as Partial<T>;
}

/**
 * Convierte un Timestamp o valor de fecha de Firestore a string legible / ISO.
 */
function normalizarFecha(fecha: any): string {
  if (!fecha) return new Date().toISOString();
  if (fecha instanceof Timestamp) {
    return fecha.toDate().toISOString();
  }
  if (typeof fecha.toDate === 'function') {
    return fecha.toDate().toISOString();
  }
  if (typeof fecha === 'string' || typeof fecha === 'number') {
    return new Date(fecha).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Formatea una fecha en texto relativo amigable (ej: "Hace 15 min", "Hace 2 h", "Hace 3 d").
 */
export function formatearTiempoRelativo(fechaRaw: any): string {
  try {
    const fecha = fechaRaw instanceof Timestamp ? fechaRaw.toDate() : new Date(normalizarFecha(fechaRaw));
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - fecha.getTime();

    if (isNaN(diferenciaMs) || diferenciaMs < 0) return 'Reciente';

    const minutos = Math.floor(diferenciaMs / (1000 * 60));
    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} min`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas} h`;

    const dias = Math.floor(horas / 24);
    if (dias < 30) return `Hace ${dias} d`;

    return fecha.toLocaleDateString();
  } catch {
    return 'Reciente';
  }
}

/**
 * Mapea un snapshot de Firestore a la interfaz tipada Pet.
 */
function docAPet(id: string, data: any): Pet {
  return {
    id,
    nombre: data.nombre ?? '',
    especie: data.especie ?? 'OTRO',
    estado: data.estado ?? 'PERDIDO',
    descripcion: data.descripcion ?? '',
    fotos: Array.isArray(data.fotos) ? data.fotos : [],
    ubicacion: data.ubicacion ?? '',
    coordenadas: data.coordenadas ?? undefined,
    contacto: data.contacto ?? undefined,
    creadoPor: data.creadoPor ?? undefined,
    fechaReporte: normalizarFecha(data.fechaReporte),
    recompensa: data.recompensa ?? null,
  };
}

// ==========================================
// GESTI├ôN DE ARCHIVOS / STORAGE
// ==========================================

const LIMITE_MAX_FOTOS_ALERTA = 5;
const LIMITE_MAX_BYTES_IMAGEN = 5 * 1024 * 1024; // 5 MB
const LIMITE_MAX_BASE64_FIRESTORE = 1048576; // 1 MB
const LIMITE_MAX_FANOUT_NOTIFICACIONES = 50;
const REGEX_MIME_IMAGEN = /^image\/(jpeg|jpg|png|webp)$/i;

function sanitizarCampoTexto(valor: unknown, maxLongitud: number): string {
  if (typeof valor !== 'string') return '';
  return valor
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<\s*\/?\s*(script|iframe|object|embed|svg|style)\b[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim()
    .slice(0, maxLongitud);
}

/**
 * Verifica que el usuario autenticado sea el propietario legítimo de la alerta
 * antes de permitir su edición o eliminación (Defensa contra BOLA / IDOR).
 */
async function verificarPropiedadAlerta(idAlerta: string): Promise<void> {
  const usuario = auth.currentUser;
  if (!usuario) {
    throw new Error('Debes iniciar sesión para modificar o eliminar una publicación.');
  }
  if (!idAlerta || typeof idAlerta !== 'string') {
    throw new Error('Identificador de publicación inválido.');
  }

  const docRef = doc(db, COLECCION_ALERTAS, idAlerta);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error('La publicación no existe.');
  }

  const data = docSnap.data();
  if (data?.creadoPor && data.creadoPor !== usuario.uid) {
    throw new Error('Solo el dueño de la publicación puede modificarla o eliminarla.');
  }
}

/**
 * Convierte un Blob a Data URL base64 para entornos web donde las políticas
 * de CORS de Firebase Storage restrinjan las llamadas XMLHttpRequest.
 */
async function blobADataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('No se pudo convertir el archivo a Data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Sube una imagen local a Firebase Storage y retorna su URL pública de descarga.
 * Soporta Data URLs base64 nativos con uploadString para máxima resiliencia en React Native.
 */
export async function subirImagenMascota(uriLocal: string): Promise<string> {
  if (!uriLocal || uriLocal.includes('RmlsZSBub3QgZm91bmQ=')) {
    throw new Error('Imagen inválida');
  }

  // Si ya es una URL remota HTTPS válida, retornarla
  if ((uriLocal.startsWith('http://') || uriLocal.startsWith('https://')) && !uriLocal.startsWith('blob:')) {
    return uriLocal;
  }

  // Si es un Data URL base64 válido (data:image/...;base64,...)
  if (uriLocal.startsWith('data:')) {
    const match = uriLocal.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mimeType = (match[1] || 'image/jpeg').trim();
      const base64Content = match[2];

      if (!REGEX_MIME_IMAGEN.test(mimeType)) {
        throw new Error('Formato de imagen no permitido. Solo se admiten JPG, PNG o WEBP.');
      }

      const bytesEstimados = Math.ceil((base64Content.length * 3) / 4);
      if (bytesEstimados > LIMITE_MAX_BYTES_IMAGEN) {
        throw new Error('La imagen supera el tamaño máximo permitido de 5 MB.');
      }

      try {
        const nombreArchivo = `mascotas/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const referencia = ref(storage, nombreArchivo);
        await uploadString(referencia, base64Content, 'base64', { contentType: mimeType });
        const downloadUrl = await getDownloadURL(referencia);
        if (downloadUrl) return downloadUrl;
      } catch {
        // Fallback resiliente solo si no excede el límite seguro de documento en Firestore
        if (uriLocal.length <= LIMITE_MAX_BASE64_FIRESTORE) {
          return uriLocal;
        }
        throw new Error('No se pudo subir la imagen al servidor.');
      }
    }
    if (uriLocal.length <= LIMITE_MAX_BASE64_FIRESTORE) {
      return uriLocal;
    }
    throw new Error('La imagen codificada excede el límite permitido.');
  }

  // Para URIs locales de archivo (file://, content://, blob:)
  const respuesta = await fetch(uriLocal);
  const blob = await respuesta.blob();

  // Validar que no sea un error "File not found" serializado como octet-stream
  if (blob.size < 100 && blob.type === 'application/octet-stream') {
    throw new Error('Archivo local no disponible');
  }

  if (blob.size > LIMITE_MAX_BYTES_IMAGEN) {
    throw new Error('La imagen supera el tamaño máximo permitido de 5 MB.');
  }

  if (blob.type && blob.type !== 'application/octet-stream' && !REGEX_MIME_IMAGEN.test(blob.type)) {
    throw new Error('Formato de archivo no permitido. Solo se admiten imágenes JPG, PNG o WEBP.');
  }

  if (Platform.OS === 'web' && blob.size < 650 * 1024) {
    try {
      return await blobADataUrl(blob);
    } catch {
      // Fallback a subida directa si falla
    }
  }

  const nombreArchivo = `mascotas/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
  const referencia = ref(storage, nombreArchivo);

  await uploadBytes(referencia, blob);
  return await getDownloadURL(referencia);
}

// ==========================================
// OPERACIONES CRUD DE ALERTAS
// ==========================================

/**
 * Crea una nueva alerta en Firestore y sube sus fotos a Storage.
 */
export async function crearAlertaMascota(
  datos: Omit<NuevaAlertaMascota, 'fotos' | 'fechaReporte' | 'creadoPor'>,
  fotosLocales: string[] = []
): Promise<string> {
  const usuario = auth.currentUser;
  if (!usuario) {
    throw new Error('Debes iniciar sesión para publicar una alerta.');
  }

  const fotosRecortadas = Array.isArray(fotosLocales)
    ? fotosLocales.slice(0, LIMITE_MAX_FOTOS_ALERTA)
    : [];

  // 1. Subir fotos a Firebase Storage en paralelo con manejo resiliente
  const resultadosFotos = await Promise.all(
    fotosRecortadas.map(async (uri) => {
      if (!uri || uri.includes('RmlsZSBub3QgZm91bmQ=')) {
        return null;
      }
      try {
        return await subirImagenMascota(uri);
      } catch {
        // Si el archivo local falló pero es un data URL genuino dentro del límite, conservarlo
        if (uri.startsWith('data:image/') && uri.length <= LIMITE_MAX_BASE64_FIRESTORE) {
          return uri;
        }
        return null;
      }
    })
  );

  const urlsFotos = resultadosFotos.filter(
    (url): url is string => Boolean(url && !url.includes('RmlsZSBub3QgZm91bmQ='))
  );

  // 2. Si vienen coordenadas, validar que sean numéricas y finitas
  let coordenadasValidas = datos.coordenadas;
  if (
    coordenadasValidas &&
    (typeof coordenadasValidas.latitude !== 'number' ||
      typeof coordenadasValidas.longitude !== 'number' ||
      !Number.isFinite(coordenadasValidas.latitude) ||
      !Number.isFinite(coordenadasValidas.longitude))
  ) {
    coordenadasValidas = undefined;
  }

  const datosSanitizados = {
    ...datos,
    nombre: sanitizarCampoTexto(datos.nombre, 80),
    descripcion: sanitizarCampoTexto(datos.descripcion, 2000),
    ubicacion:
      typeof datos.ubicacion === 'string'
        ? sanitizarCampoTexto(datos.ubicacion, 200)
        : datos.ubicacion,
  };

  // 3. Construir el payload sin campos undefined
  const payload = limpiarUndefined({
    ...datosSanitizados,
    ...(coordenadasValidas ? { coordenadas: coordenadasValidas } : {}),
    fotos: urlsFotos,
    creadoPor: usuario.uid,
    fechaReporte: serverTimestamp(),
  });

  if (payload.coordenadas === undefined) {
    delete payload.coordenadas;
  }

  const docRef = await addDoc(collection(db, COLECCION_ALERTAS), payload);
  return docRef.id;
}

/**
 * Modifica una alerta existente por su ID.
 * Permite actualizar datos y opcionalmente subir nuevas fotos locales.
 */
export async function modificarAlertaMascota(
  idAlerta: string,
  cambios: ActualizarAlertaMascota,
  nuevasFotosLocales?: string[]
): Promise<void> {
  await verificarPropiedadAlerta(idAlerta);

  const docRef = doc(db, COLECCION_ALERTAS, idAlerta);

  // 1. Si se proporcionan nuevas fotos locales, subirlas respetando el tope máximo
  let fotosActualizadas = cambios.fotos;
  if (nuevasFotosLocales && nuevasFotosLocales.length > 0) {
    const fotosLimitadas = nuevasFotosLocales.slice(0, LIMITE_MAX_FOTOS_ALERTA);
    const urlsNuevas = await Promise.all(
      fotosLimitadas.map((uri) => (uri.startsWith('http') ? uri : subirImagenMascota(uri)))
    );
    fotosActualizadas = [...(cambios.fotos ?? []), ...urlsNuevas].slice(
      0,
      LIMITE_MAX_FOTOS_ALERTA
    );
  }

  // 2. Filtrar campos inmutables (creadoPor, fechaReporte, id) y sanitizar textos
  const cambiosSeguros: Record<string, unknown> = { ...cambios };
  delete cambiosSeguros.id;
  delete cambiosSeguros.creadoPor;
  delete cambiosSeguros.fechaReporte;

  if (typeof cambiosSeguros.nombre === 'string') {
    cambiosSeguros.nombre = sanitizarCampoTexto(cambiosSeguros.nombre, 80);
  }
  if (typeof cambiosSeguros.descripcion === 'string') {
    cambiosSeguros.descripcion = sanitizarCampoTexto(cambiosSeguros.descripcion, 2000);
  }
  if (typeof cambiosSeguros.ubicacion === 'string') {
    cambiosSeguros.ubicacion = sanitizarCampoTexto(cambiosSeguros.ubicacion, 200);
  }

  const payload = limpiarUndefined({
    ...cambiosSeguros,
    ...(fotosActualizadas ? { fotos: fotosActualizadas } : {}),
    fechaModificacion: serverTimestamp(),
  });

  await updateDoc(docRef, payload);
}

/**
 * Elimina una alerta por su ID previa verificación de titularidad.
 */
export async function eliminarAlertaMascota(idAlerta: string): Promise<void> {
  await verificarPropiedadAlerta(idAlerta);
  const docRef = doc(db, COLECCION_ALERTAS, idAlerta);
  await deleteDoc(docRef);
}

/**
 * Obtiene los datos de una ├║nica alerta por su ID.
 */
export async function obtenerAlertaPorId(idAlerta: string): Promise<Pet | null> {
  const docRef = doc(db, COLECCION_ALERTAS, idAlerta);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docAPet(docSnap.id, docSnap.data());
}

/**
 * Obtiene los datos de una alerta cruzando y enriqueciendo con la informaci├│n
 * de contacto del usuario creador (para la pantalla de detalle de mascota y enlace a WhatsApp).
 */
export async function obtenerAlertaConUsuarioPorId(
  idAlerta: string
): Promise<PetConUsuario | null> {
  const pet = await obtenerAlertaPorId(idAlerta);
  if (!pet) {
    return null;
  }

  if (!pet.creadoPor || pet.creadoPor === 'anonimo') {
    return { ...pet, usuario: null };
  }

  try {
    const userDoc = await getDoc(doc(db, COLECCION_USUARIOS, pet.creadoPor));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const usuario: Usuario = {
        id: userDoc.id,
        nombre: data.nombre ?? 'Vecino de la comunidad',
        email: data.correo ?? data.email ?? '',
        telefono: data.telefono ?? undefined,
        avatarUrl: data.avatarUrl ?? undefined,
        fechaCreacion: data.fechaRegistro ? normalizarFecha(data.fechaRegistro) : undefined,
      };
      return { ...pet, usuario };
    }
  } catch {
    // Retorno resiliente: si la consulta de usuario falla, se mantiene la alerta sin romper la UI
  }

  return { ...pet, usuario: null };
}

// ==========================================
// OPERACIONES DE LISTADO Y CONSULTAS
// ==========================================

/**
 * [SELECT ALL PUBLICACIONES]
 * Obtiene todas las publicaciones de la base de datos con filtros modulares y opcionales.
 */
export async function listarTodasLasAlertas(
  filtros?: FiltrosListadoMascotas
): Promise<Pet[]> {
  const condiciones: QueryConstraint[] = [];

  if (filtros?.estado) {
    condiciones.push(where('estado', '==', filtros.estado));
  }

  if (filtros?.especie) {
    condiciones.push(where('especie', '==', filtros.especie));
  }

  if (filtros?.creadoPor) {
    condiciones.push(where('creadoPor', '==', filtros.creadoPor));
  }

  try {
    const qOrdenada = query(
      collection(db, COLECCION_ALERTAS),
      ...condiciones,
      orderBy('fechaReporte', 'desc'),
      ...(filtros?.limite ? [limit(filtros.limite)] : [])
    );
    const snap = await getDocs(qOrdenada);
    return snap.docs.map((d) => docAPet(d.id, d.data()));
  } catch (error) {
    // Si Firestore requiere un ├¡ndice compuesto a├║n no creado en consola,
    // ordenamos en memoria para garantizar continuidad
    const qSinOrder = query(
      collection(db, COLECCION_ALERTAS),
      ...condiciones,
      ...(filtros?.limite ? [limit(filtros.limite)] : [])
    );
    const snap = await getDocs(qSinOrder);
    const mascotas = snap.docs.map((d) => docAPet(d.id, d.data()));

    return mascotas.sort((a, b) => {
      const fechaA = new Date(a.fechaReporte ?? 0).getTime();
      const fechaB = new Date(b.fechaReporte ?? 0).getTime();
      return fechaB - fechaA;
    });
  }
}

/**
 * [SELECT ALL PUBLICACIONES JOIN USER: idUser == publicacion.idUser]
 * Obtiene todas las alertas cruzando y enriqueciendo cada una con la informaci├│n del usuario creador
 * (nombre, correo, tel├⌐fono, avatar) desde la colecci├│n 'usuarios'.
 */
export async function listarAlertasConUsuario(
  filtros?: FiltrosListadoMascotas
): Promise<PetConUsuario[]> {
  // 1. Obtener todas las alertas seg├║n los filtros
  const alertas = await listarTodasLasAlertas(filtros);

  if (alertas.length === 0) {
    return [];
  }

  // 2. Extraer UIDs ├║nicos de los autores para evitar llamadas duplicadas (deduplicaci├│n en memoria)
  const uidsUnicos = Array.from(
    new Set(
      alertas
        .map((a) => a.creadoPor)
        .filter((uid): uid is string => Boolean(uid && uid !== 'anonimo'))
    )
  );

  // 3. Consultar los perfiles de los usuarios en paralelo
  const usuariosMap = new Map<string, Usuario>();

  await Promise.all(
    uidsUnicos.map(async (uid) => {
      try {
        const userDoc = await getDoc(doc(db, COLECCION_USUARIOS, uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          usuariosMap.set(uid, {
            id: userDoc.id,
            nombre: data.nombre ?? 'Usuario',
            email: data.correo ?? data.email ?? '',
            telefono: data.telefono ?? undefined,
            avatarUrl: data.avatarUrl ?? undefined,
            fechaCreacion: data.fechaRegistro ? normalizarFecha(data.fechaRegistro) : undefined,
          });
        }
      } catch {
        // Silencioso en producci├│n: si no se puede cargar el perfil, contin├║a sin datos adicionales
      }
    })
  );

  // 4. Mapear (JOIN) cada alerta con los datos del usuario correspondiente
  return alertas.map((alerta) => ({
    ...alerta,
    usuario: alerta.creadoPor ? usuariosMap.get(alerta.creadoPor) ?? null : null,
  }));
}

/**
 * Obtiene las publicaciones creadas por un usuario espec├¡fico (para la pantalla de Perfil "Mis Publicaciones").
 */
export async function listarAlertasPorUsuario(idUsuario: string): Promise<Pet[]> {
  return listarTodasLasAlertas({ creadoPor: idUsuario });
}

/**
 * [M├ëTODO DE LISTAR PARA MAPS]
 * Desacoplado y modular: Consulta las publicaciones activas, filtra las que cuentan con
 * coordenadas geogr├íficas v├ílidas y las adapta a la estructura MapPet requerida por el mapa.
 */
export async function listarAlertasParaMapa(): Promise<MapPet[]> {
  const alertas = await listarTodasLasAlertas();

  const alertasMapeables: MapPet[] = [];

  for (const pet of alertas) {
    // Si la alerta no tiene coordenadas num├⌐ricas v├ílidas en Firestore,
    // se resuelve autom├íticamente a partir de su ubicaci├│n o zona de Pilar
    let coords = pet.coordenadas;
    if (
      !coords ||
      typeof coords.latitude !== 'number' ||
      typeof coords.longitude !== 'number' ||
      isNaN(coords.latitude) ||
      isNaN(coords.longitude)
    ) {
      const resuelta = resolverUbicacionAlerta(pet);
      coords = resuelta.coordenadas;
    }

    if (
      !coords ||
      typeof coords.latitude !== 'number' ||
      typeof coords.longitude !== 'number' ||
      isNaN(coords.latitude) ||
      isNaN(coords.longitude)
    ) {
      continue;
    }

    // Mapear estado de negocio a PetState del mapa (1 = Perdido, 2 = Encontrado)
    const petState: PetState = pet.estado === 'ENCONTRADO' ? 2 : 1;

    // Obtener la primera foto disponible o fallback
    const fotoUri =
      Array.isArray(pet.fotos) && pet.fotos.length > 0 && pet.fotos[0]
        ? pet.fotos[0]
        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500';

    const ubicacionTexto =
      typeof pet.ubicacion === 'string'
        ? pet.ubicacion
        : (pet.ubicacion as any)?.direccion ?? 'Ubicaci├│n no especificada';

    alertasMapeables.push({
      id: pet.id,
      nombre: pet.nombre || 'Mascota sin nombre',
      estado: petState,
      descripcion: pet.descripcion || '',
      ubicacion: ubicacionTexto,
      tiempo: formatearTiempoRelativo(pet.fechaReporte),
      recompensa: pet.recompensa ?? null,
      foto: { uri: fotoUri },
      coordenadas: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  }

  return alertasMapeables;
}

/**
 * Marca una publicación propia como encontrada
 * y notifica a quienes interactuaron con ella.
 */
export async function marcarMascotaComoEncontrada(
  idAlerta: string
): Promise<void> {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error('Tenés que iniciar sesión.');
  }

  if (!idAlerta) {
    throw new Error('La publicación no es válida.');
  }

  const alertaRef = doc(db, COLECCION_ALERTAS, idAlerta);
  const alertaSnap = await getDoc(alertaRef);

  if (!alertaSnap.exists()) {
    throw new Error('La publicación no existe.');
  }

  const alerta = alertaSnap.data();

  if (alerta.creadoPor !== usuario.uid) {
    throw new Error(
      'Solo el dueño de la publicación puede marcarla como encontrada.'
    );
  }

  if (alerta.estado === 'ENCONTRADO') {
    throw new Error('Esta publicación ya está marcada como encontrada.');
  }

  const interesados: string[] = Array.isArray(alerta.usuariosInteresados)
    ? alerta.usuariosInteresados
    : [];

  const destinatarios = [
    ...new Set(
      interesados.filter(
        (uid) => typeof uid === 'string' && uid !== usuario.uid
      )
    ),
  ].slice(0, LIMITE_MAX_FANOUT_NOTIFICACIONES);

  // Actualizar el estado de la publicación.
  await updateDoc(alertaRef, {
    estado: 'ENCONTRADO',
    fechaModificacion: serverTimestamp(),
  });

  // Crear las notificaciones internas.
  const notificacionesRef = collection(db, 'notificaciones');

  for (const destinatarioId of destinatarios) {
    await addDoc(notificacionesRef, {
      destinatarioId,
      tipo: 'estado',
      titulo: '¡Mascota encontrada!',
      mensaje: `¡Buenas noticias! ${
        alerta.nombre || 'La mascota'
      } fue marcada como encontrada.`,
      publicacionId: idAlerta,
      leida: false,
      createdAt: serverTimestamp(),
    });
  }
}


// ==========================================
// PUBLICACIONES GUARDADAS
// ==========================================

function resolverUidSeguroGuardados(idUsuario?: string, mensajeError?: string): string {
  const uidActual = auth.currentUser?.uid;
  if (idUsuario && uidActual && idUsuario !== uidActual) {
    throw new Error('No tenés permisos para operar sobre los guardados de otro usuario.');
  }
  const uid = idUsuario || uidActual;
  if (!uid) {
    throw new Error(mensajeError || 'Debes iniciar sesion para gestionar tus guardados.');
  }
  return uid;
}

/**
 * Guarda una publicacion en la cuenta del usuario autenticado.
 */
export async function guardarPublicacion(
  idPublicacion: string,
  idUsuario?: string
): Promise<void> {
  const uid = resolverUidSeguroGuardados(
    idUsuario,
    'Debes iniciar sesion para guardar publicaciones.'
  );

  if (!idPublicacion) {
    throw new Error('No se recibio el ID de la publicacion.');
  }

  const referencia = doc(
    db,
    COLECCION_USUARIOS,
    uid,
    'guardadas',
    idPublicacion
  );

  await setDoc(referencia, {
    publicacionId: idPublicacion,
    guardadaEn: serverTimestamp(),
  });
}

/**
 * Elimina una publicacion de los guardados del usuario.
 */
export async function quitarPublicacionGuardada(
  idPublicacion: string,
  idUsuario?: string
): Promise<void> {
  const uid = resolverUidSeguroGuardados(
    idUsuario,
    'Debes iniciar sesion para modificar tus guardados.'
  );

  const referencia = doc(
    db,
    COLECCION_USUARIOS,
    uid,
    'guardadas',
    idPublicacion
  );

  await deleteDoc(referencia);
}

/**
 * Obtiene los IDs de las publicaciones guardadas por el usuario.
 */
export async function obtenerIdsPublicacionesGuardadas(
  idUsuario?: string
): Promise<string[]> {
  const uid = resolverUidSeguroGuardados(
    idUsuario,
    'Debes iniciar sesion para consultar tus guardados.'
  );

  const referencia = collection(
    db,
    COLECCION_USUARIOS,
    uid,
    'guardadas'
  );

  const resultado = await getDocs(referencia);

  return resultado.docs.map((documento) => documento.id);
}

/**
 * Obtiene la lista completa de publicaciones guardadas por el usuario.
 */
export async function obtenerPublicacionesGuardadas(
  idUsuario?: string
): Promise<Pet[]> {
  const ids = await obtenerIdsPublicacionesGuardadas(idUsuario);

  if (ids.length === 0) {
    return [];
  }

  const todas = await listarTodasLasAlertas();
  return todas.filter((pet) => ids.includes(pet.id));
}
