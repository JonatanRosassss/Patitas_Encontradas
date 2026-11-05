import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db, auth } from "./firebase";
import { obtenerExpoPushTokenSeguro } from "./pushNotificationsAdapter";

export type TipoNotificacion =
  | "cerca"
  | "avistamiento"
  | "estado"
  | "publicacion";

export interface Notificacion {
  id: string;
  destinatarioId: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  publicacionId?: string | null;
  leida: boolean;
  createdAt?: unknown;
}

const notificacionesRef = collection(db, "notificaciones");
const LIMITE_BATCH_NOTIFICACIONES = 450;
const LIMITE_FANOUT_DESTINATARIOS = 50;

/**
 * Escucha las notificaciones de un usuario en tiempo real desde Firestore.
 */
export function escucharNotificaciones(
  usuarioId: string,
  alRecibirNotificaciones: (notificaciones: Notificacion[]) => void,
  alOcurrirError?: (error: unknown) => void
) {
  if (!usuarioId) return () => {};

  const uidActual = auth.currentUser?.uid;
  if (uidActual && uidActual !== usuarioId) {
    return () => {};
  }

  const q = query(
    collection(db, "notificaciones"),
    where("destinatarioId", "==", usuarioId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const lista = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Notificacion[];

      alRecibirNotificaciones(lista);
    },
    (err) => {
      if (alOcurrirError) {
        alOcurrirError(err);
      }
    }
  );
}

/**
 * Marca una notificación específica como leída en Firestore.
 */
export async function marcarComoLeida(notificacionId: string): Promise<void> {
  if (!notificacionId) return;
  const notifRef = doc(db, "notificaciones", notificacionId);
  await updateDoc(notifRef, { leida: true });
}

/**
 * Marca todas las notificaciones pendientes de un usuario como leídas.
 */
export async function marcarTodasComoLeidas(usuarioId: string): Promise<void> {
  if (!usuarioId) return;

  const uidActual = auth.currentUser?.uid;
  if (uidActual && uidActual !== usuarioId) {
    throw new Error("No tenés permisos para modificar notificaciones de otro usuario.");
  }

  const q = query(
    collection(db, "notificaciones"),
    where("destinatarioId", "==", usuarioId),
    where("leida", "==", false)
  );

  const querySnap = await getDocs(q);
  const batch = writeBatch(db);

  querySnap.docs.slice(0, LIMITE_BATCH_NOTIFICACIONES).forEach((docSnap) => {
    batch.update(docSnap.ref, { leida: true });
  });

  await batch.commit();
}

/**
 * Crea una notificación interna para un usuario en Firestore.
 */
export async function crearNotificacion(datos: {
  destinatarioId: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  publicacionId?: string | null;
}): Promise<string> {
  if (!datos.destinatarioId) {
    throw new Error("El destinatario es obligatorio.");
  }

  const tituloSeguro = String(datos.titulo || "").trim().slice(0, 120);
  const mensajeSeguro = String(datos.mensaje || "").trim().slice(0, 500);

  const resultado = await addDoc(notificacionesRef, {
    ...datos,
    titulo: tituloSeguro,
    mensaje: mensajeSeguro,
    leida: false,
    createdAt: serverTimestamp(),
  });

  return resultado.id;
}

/**
 * Registra al usuario como interesado en una publicación.
 */
export async function registrarInteraccionPublicacion(
  publicacionId: string
): Promise<void> {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error("Tenés que iniciar sesión para registrar la interacción.");
  }

  if (!publicacionId) {
    throw new Error("La publicación no es válida.");
  }

  const alertaRef = doc(db, "alertas", publicacionId);
  const alertaSnap = await getDoc(alertaRef);

  if (!alertaSnap.exists()) {
    throw new Error("La publicación ya no existe.");
  }

  const datos = alertaSnap.data();

  if (datos.creadoPor === usuario.uid) {
    throw new Error("No podés registrar una interacción en tu propia publicación.");
  }

  await updateDoc(alertaRef, {
    usuariosInteresados: arrayUnion(usuario.uid),
  });
}

/**
 * Notifica a las personas que interactuaron con una publicación
 * cuando su dueño la marca como encontrada.
 */
export async function notificarMascotaEncontrada(
  publicacionId: string
): Promise<void> {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error("Tenés que iniciar sesión.");
  }

  const alertaRef = doc(db, "alertas", publicacionId);
  const alertaSnap = await getDoc(alertaRef);

  if (!alertaSnap.exists()) {
    throw new Error("No se encontró la publicación.");
  }

  const alerta = alertaSnap.data();

  if (alerta.creadoPor !== usuario.uid) {
    throw new Error("Solo el dueño de la publicación puede cambiar su estado.");
  }

  if (alerta.estado === "ENCONTRADO") {
    return;
  }

  const interesados: string[] = Array.isArray(alerta.usuariosInteresados)
    ? alerta.usuariosInteresados
    : [];

  const destinatarios = [
    ...new Set(
      interesados.filter(
        (uid) => typeof uid === "string" && uid !== usuario.uid
      )
    ),
  ].slice(0, LIMITE_FANOUT_DESTINATARIOS);

  const batch = writeBatch(db);

  batch.update(alertaRef, {
    estado: "ENCONTRADO",
    updatedAt: serverTimestamp(),
  });

  destinatarios.forEach((destinatarioId) => {
    const nuevaNotifRef = doc(notificacionesRef);
    batch.set(nuevaNotifRef, {
      destinatarioId,
      tipo: "estado",
      titulo: "¡Mascota encontrada!",
      mensaje: `La publicación de "${alerta.nombreMascota || "mascota"}" se marcó como encontrada.`,
      publicacionId,
      leida: false,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

/**
 * Registra y obtiene el token de Expo Notifications para notificaciones push
 * de forma desacoplada y resiliente ante Expo Go, Web y emuladores.
 */
export async function registrarPushToken(usuarioId?: string): Promise<string | null> {
  const token = await obtenerExpoPushTokenSeguro();
  const uidActual = auth.currentUser?.uid;
  const uidDestino = usuarioId || uidActual;

  if (uidDestino && token && (!uidActual || uidDestino === uidActual)) {
    const userRef = doc(db, "usuarios", uidDestino);
    await updateDoc(userRef, {
      pushToken: token,
      notificacionesActivas: true,
    });
  }

  return token;
}
