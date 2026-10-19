/**
 * Tipos y contratos para el módulo de Soporte, Preguntas Frecuentes y Tickets en Firestore.
 * Proyecto: Patitas Encontradas
 */

export type TipoTicket = 
  | 'ERROR_TECNICO'
  | 'PROBLEMA_MAPA'
  | 'REPORTE_FALSO'
  | 'CONSULTA_GENERAL'
  | 'OTRO';

export type EstadoTicket = 
  | 'ABIERTO'
  | 'EN_REVISION'
  | 'RESUELTO';

export interface TicketSoporte {
  id: string;
  usuarioId: string | null;
  nombreContacto: string;
  emailContacto: string;
  tipoProblema: TipoTicket;
  titulo: string;
  descripcion: string;
  estado: EstadoTicket;
  fechaCreacion: string;
  dispositivo?: string;
}

export type NuevoTicketInput = Omit<TicketSoporte, 'id' | 'estado' | 'fechaCreacion'>;

export type CategoriaFaq = 
  | 'PUBLICACIONES'
  | 'MAPA'
  | 'AVISTAMIENTOS'
  | 'CUENTA';

export interface PreguntaFrecuente {
  id: string;
  categoria: CategoriaFaq;
  pregunta: string;
  respuesta: string;
}
