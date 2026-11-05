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
const auth = ConexionFirebase.obtenerAuth();
export const COLECCION_TICKETS = 'tickets_soporte';

const TIPOS_TICKET_VALIDOS = new Set([
  'ERROR_TECNICO',
  'PROBLEMA_MAPA',
  'REPORTE_FALSO',
  'CONSULTA_GENERAL',
  'OTRO',
]);

function sanitizarTextoTicket(texto: string, maxLen: number): string {
  return texto
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<\s*\/?\s*(script|iframe|object|embed|svg|style)\b[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim()
    .slice(0, maxLen);
}

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

  // Prevenir suplantación de usuarioId cuando hay sesión activa
  const uidAutenticado = auth.currentUser?.uid ?? null;
  if (input.usuarioId && uidAutenticado && input.usuarioId !== uidAutenticado) {
    throw new Error('No se permite enviar un ticket en nombre de otro usuario.');
  }

  const tipoSeguro = TIPOS_TICKET_VALIDOS.has(input.tipoProblema)
    ? input.tipoProblema
    : 'OTRO';

  const payload = {
    usuarioId: uidAutenticado ?? input.usuarioId ?? null,
    nombreContacto: sanitizarTextoTicket(input.nombreContacto || 'Vecino anónimo', 80) || 'Vecino anónimo',
    emailContacto: sanitizarTextoTicket(input.emailContacto, 120).toLowerCase(),
    tipoProblema: tipoSeguro,
    titulo: sanitizarTextoTicket(input.titulo, 150),
    descripcion: sanitizarTextoTicket(input.descripcion, 2000),
    estado: 'ABIERTO',
    fechaCreacion: new Date().toISOString(),
    creadoEnServidor: serverTimestamp(),
    dispositivo: sanitizarTextoTicket(input.dispositivo || 'Mobile App', 60),
  };

  const coleccionRef = collection(db, COLECCION_TICKETS);
  const docRef = await addDoc(coleccionRef, payload);
  return docRef.id;
}

/**
 * Consulta los tickets de soporte enviados por un usuario determinado.
 * Valida que el usuario autenticado coincida con el consultado para evitar enumeración ajena (IDOR).
 */
export async function listarTicketsPorUsuario(usuarioId: string): Promise<TicketSoporte[]> {
  if (!usuarioId) return [];

  const uidAutenticado = auth.currentUser?.uid;
  if (uidAutenticado && uidAutenticado !== usuarioId) {
    throw new Error('No tenés permisos para consultar tickets de otro usuario.');
  }

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
