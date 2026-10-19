// services/mascotasService.ts
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ConexionFirebase } from '@/services/ConexionFirebase';
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
 * Elimina las claves con valor undefined para evitar que Firestore lance excepciones.
 */
function limpiarUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const limpio: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
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
function formatearTiempoRelativo(fechaRaw: any): string {
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
// GESTIÓN DE ARCHIVOS / STORAGE
// ==========================================

/**
 * Sube una imagen local a Firebase Storage y retorna su URL pública de descarga.
 */
export async function subirImagenMascota(uriLocal: string): Promise<string> {
  const respuesta = await fetch(uriLocal);
  const blob = await respuesta.blob();
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

  // 1. Subir fotos a Firebase Storage en paralelo
  const urlsFotos = await Promise.all(
    fotosLocales.map((uri) => (uri.startsWith('http') ? uri : subirImagenMascota(uri)))
  );

  // 2. Construir el payload sin campos undefined
  const payload = limpiarUndefined({
    ...datos,
    fotos: urlsFotos,
    creadoPor: usuario?.uid ?? 'anonimo',
    fechaReporte: serverTimestamp(),
  });

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
  const docRef = doc(db, COLECCION_ALERTAS, idAlerta);

  // 1. Si se proporcionan nuevas fotos locales, subirlas
  let fotosActualizadas = cambios.fotos;
  if (nuevasFotosLocales && nuevasFotosLocales.length > 0) {
    const urlsNuevas = await Promise.all(
      nuevasFotosLocales.map((uri) => (uri.startsWith('http') ? uri : subirImagenMascota(uri)))
    );
    fotosActualizadas = [...(cambios.fotos ?? []), ...urlsNuevas];
  }

  // 2. Limpiar undefined para no romper Firestore
  const payload = limpiarUndefined({
    ...cambios,
    ...(fotosActualizadas ? { fotos: fotosActualizadas } : {}),
    fechaModificacion: serverTimestamp(),
  });

  await updateDoc(docRef, payload);
}

/**
 * Elimina una alerta por su ID.
 */
export async function eliminarAlertaMascota(idAlerta: string): Promise<void> {
  const docRef = doc(db, COLECCION_ALERTAS, idAlerta);
  await deleteDoc(docRef);
}

/**
 * Obtiene los datos de una única alerta por su ID.
 */
export async function obtenerAlertaPorId(idAlerta: string): Promise<Pet | null> {
  const docRef = doc(db, COLECCION_ALERTAS, idAlerta);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docAPet(docSnap.id, docSnap.data());
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
    // Si Firestore requiere un índice compuesto aún no creado en consola,
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
 * Obtiene todas las alertas cruzando y enriqueciendo cada una con la información del usuario creador
 * (nombre, correo, teléfono, avatar) desde la colección 'usuarios'.
 */
export async function listarAlertasConUsuario(
  filtros?: FiltrosListadoMascotas
): Promise<PetConUsuario[]> {
  // 1. Obtener todas las alertas según los filtros
  const alertas = await listarTodasLasAlertas(filtros);

  if (alertas.length === 0) {
    return [];
  }

  // 2. Extraer UIDs únicos de los autores para evitar llamadas duplicadas (deduplicación en memoria)
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
      } catch (err) {
        console.warn(`No se pudo cargar el perfil del usuario ${uid}:`, err);
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
 * Obtiene las publicaciones creadas por un usuario específico (para la pantalla de Perfil "Mis Publicaciones").
 */
export async function listarAlertasPorUsuario(idUsuario: string): Promise<Pet[]> {
  return listarTodasLasAlertas({ creadoPor: idUsuario });
}

/**
 * [MÉTODO DE LISTAR PARA MAPS]
 * Desacoplado y modular: Consulta las publicaciones activas, filtra las que cuentan con
 * coordenadas geográficas válidas y las adapta a la estructura MapPet requerida por el mapa.
 */
export async function listarAlertasParaMapa(): Promise<MapPet[]> {
  const alertas = await listarTodasLasAlertas();

  const alertasMapeables: MapPet[] = [];

  for (const pet of alertas) {
    // Validar existencia de coordenadas numéricas válidas
    if (
      !pet.coordenadas ||
      typeof pet.coordenadas.latitude !== 'number' ||
      typeof pet.coordenadas.longitude !== 'number' ||
      isNaN(pet.coordenadas.latitude) ||
      isNaN(pet.coordenadas.longitude)
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
        : (pet.ubicacion as any)?.direccion ?? 'Ubicación no especificada';

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
        latitude: pet.coordenadas.latitude,
        longitude: pet.coordenadas.longitude,
      },
    });
  }

  return alertasMapeables;
}