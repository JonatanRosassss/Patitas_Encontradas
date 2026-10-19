import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ConexionFirebase } from '@/services/ConexionFirebase';
import type { TicketSoporte, NuevoTicketInput } from '@/types/Ticket';

const db = ConexionFirebase.obtenerFirestore();
export const COLECCION_TICKETS = 'tickets_soporte';

/**
 * Registra un nuevo ticket de soporte o reporte de incidente en la colección de Firestore.
 * @param input Datos del ticket (título, descripción, email, tipo de problema, usuario)
 * @returns Identificador único generado por Firestore (ticketId)
 */
export async function enviarTicketSoporte(input: NuevoTicketInput): Promise<string> {
  if (!input.titulo?.trim()) {
    throw new Error('El título del ticket es obligatorio.');
  }

  if (!input.descripcion?.trim()) {
    throw new Error('La descripción detallada es obligatoria.');
  }

  if (!input.emailContacto?.trim()) {
    throw new Error('El correo electrónico de contacto es obligatorio.');
  }

  const payload = {
    usuarioId: input.usuarioId || null,
    nombreContacto: input.nombreContacto?.trim() || 'Vecino anónimo',
    emailContacto: input.emailContacto.trim().toLowerCase(),
    tipoProblema: input.tipoProblema,
    titulo: input.titulo.trim(),
    descripcion: input.descripcion.trim(),
    estado: 'ABIERTO',
    fechaCreacion: new Date().toISOString(),
    creadoEnServidor: serverTimestamp(),
    dispositivo: input.dispositivo || 'Mobile App',
  };

  const coleccionRef = collection(db, COLECCION_TICKETS);
  const docRef = await addDoc(coleccionRef, payload);
  return docRef.id;
}

/**
 * Consulta los tickets de soporte enviados por un usuario determinado.
 */
export async function listarTicketsPorUsuario(usuarioId: string): Promise<TicketSoporte[]> {
  if (!usuarioId) return [];

  const coleccionRef = collection(db, COLECCION_TICKETS);
  const q = query(coleccionRef, where('usuarioId', '==', usuarioId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      usuarioId: data.usuarioId ?? null,
      nombreContacto: data.nombreContacto ?? '',
      emailContacto: data.emailContacto ?? '',
      tipoProblema: data.tipoProblema ?? 'OTRO',
      titulo: data.titulo ?? '',
      descripcion: data.descripcion ?? '',
      estado: data.estado ?? 'ABIERTO',
      fechaCreacion: data.fechaCreacion ?? new Date().toISOString(),
      dispositivo: data.dispositivo,
    } as TicketSoporte;
  });
}
