import { MapPoint } from './MapPoint';

export interface Pet {
  id: string,
  nombre?: string,
  especie: 'PERRO' | "GATO" | "OTRO",
  estado: 'ENCONTRADO' | 'PERDIDO' | 'VISTO',
  descripcion: string,
  fotos: [],
  ubicacion: MapPoint,
  contacto: string,
  creadoPor: string,
  fechaReporte: Date
}

export type { MapPoint };
