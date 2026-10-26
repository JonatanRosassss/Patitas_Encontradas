
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
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "./firebase";
import { auth } from "./firebase";

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
const alertasRef = collection(db, "alertas");

/**
 * Crea una notificación interna para un usuario.
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
 * Se debe llamar cuando confirma que vio la mascota.
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
 *
 * Esta función también actualiza el estado de la publicación.
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
    ...new Set(interesados.filter(
      (uid) => typeof uid === "string" && uid !== usuario.uid
    )),
  ];

  // Primero actualizamos el estado de la publicación.
  await updateDoc(alertaRef, {
    estado: "ENCONTRADO",
    fechaModificacion: serverTimestamp(),
  });

  // Después generamos las notificaciones para los interesados.
  for (const destinatarioId of destinatarios) {
    await crearNotificacion({
      destinatarioId,
      tipo: "estado",
      titulo: "¡Mascota encontrada!",
      mensaje: `¡Buenas noticias! ${alerta.nombre || "La mascota"} fue marcada como encontrada.`,
      publicacionId,
    });
  }
}

/**
 * Escucha las notificaciones de un usuario en tiempo real.
 */
export function escucharNotificaciones(
  usuarioId: string,
  callback: (items: Notificacion[]) => void,
  alError?: (error: Error) => void
): Unsubscribe {
  const consulta = query(
    notificacionesRef,
    where("destinatarioId", "==", usuarioId)
  );

  return onSnapshot(
    consulta,
    (snapshot) => {
      const items: Notificacion[] = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Notificacion[];

      items.sort((a, b) => {
        return obtenerMilisegundos(b.createdAt) -
          obtenerMilisegundos(a.createdAt);
      });

      callback(items);
    },
    (error) => {
      console.error("Error al escuchar notificaciones:", error);
      alError?.(error);
    }
  );
}

function obtenerMilisegundos(fecha: unknown): number {
  if (
    fecha &&
    typeof fecha === "object" &&
    "toMillis" in fecha &&
    typeof fecha.toMillis === "function"
  ) {
    return fecha.toMillis();
  }

  return 0;
}

export async function marcarComoLeida(
  notificacionId: string
): Promise<void> {
  await updateDoc(doc(db, "notificaciones", notificacionId), {
    leida: true,
  });
}

export async function marcarTodasComoLeidas(
  usuarioId: string
): Promise<void> {
  const consulta = query(
    notificacionesRef,
    where("destinatarioId", "==", usuarioId),
    where("leida", "==", false)
  );

  const resultado = await getDocs(consulta);

  for (let i = 0; i < resultado.docs.length; i += 500) {
    const lote = writeBatch(db);

    resultado.docs.slice(i, i + 500).forEach((item) => {
      lote.update(item.ref, { leida: true });
    });

    await lote.commit();
  }
}
