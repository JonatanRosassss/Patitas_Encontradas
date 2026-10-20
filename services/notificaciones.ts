
import {
  addDoc,
  collection,
  doc,
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
 * Escucha las notificaciones de un usuario en tiempo real.
 * El orden se calcula localmente para evitar el índice compuesto.
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
        const fechaA = obtenerMilisegundos(a.createdAt);
        const fechaB = obtenerMilisegundos(b.createdAt);

        return fechaB - fechaA;
      });

      callback(items);
    },
    (error) => {
      console.error("Error al escuchar notificaciones:", error);
      alError?.(error);
    }
  );
}

/**
 * Convierte el timestamp de Firestore a milisegundos.
 */
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

/**
 * Marca una notificación como leída.
 */
export async function marcarComoLeida(
  notificacionId: string
): Promise<void> {
  await updateDoc(doc(db, "notificaciones", notificacionId), {
    leida: true,
  });
}

/**
 * Marca todas las notificaciones de un usuario como leídas.
 */
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
