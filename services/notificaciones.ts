import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

import { db, auth } from "./firebase";

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

/**
 * Escucha las notificaciones de un usuario en tiempo real desde Firestore.
 */
export function escucharNotificaciones(
  usuarioId: string,
  alRecibirNotificaciones: (notificaciones: Notificacion[]) => void
) {
  if (!usuarioId) return () => {};

  const q = query(
    collection(db, "notificaciones"),
    where("destinatarioId", "==", usuarioId)
  );

  return onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Notificacion[];

    alRecibirNotificaciones(lista);
  });
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

  const resultado = await addDoc(notificacionesRef, {
    ...datos,
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
  ];

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
 * Registra y obtiene el token de Expo Notifications para notificaciones push.
 */
export async function registrarPushToken(usuarioId?: string) {
  // En Web ignoramos el registro de tokens push de celular de forma limpia
  if (Platform.OS === "web") {
    console.log("Las notificaciones push nativas solo están disponibles en celulares.");
    return null;
  }

  if (!Device.isDevice) {
    console.log("Las notificaciones push solo funcionan en dispositivos físicos.");
    return null;
  }

  const { status: statusExistente } = await Notifications.getPermissionsAsync();
  let statusFinal = statusExistente;

  if (statusExistente !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    statusFinal = status;
  }

  if (statusFinal !== "granted") {
    console.log("No se obtuvieron permisos para notificaciones.");
    return null;
  }

  const respuestaToken = await Notifications.getExpoPushTokenAsync();
  const token = respuestaToken.data;

  if (usuarioId && token) {
    const userRef = doc(db, "usuarios", usuarioId);
    await updateDoc(userRef, {
      pushToken: token,
      notificacionesActivas: true,
    });
  }

  return token;
}
