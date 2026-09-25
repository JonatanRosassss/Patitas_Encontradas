import { MapPoint } from './MapPoint';
import { Coordinates } from './map';

export type EstadoMascota = 'ENCONTRADO' | 'PERDIDO' | 'VISTO';
export type EspecieMascota = 'PERRO' | 'GATO' | 'OTRO';

export interface Pet {
  id: string;
  nombre?: string;
  especie: EspecieMascota;
  estado: EstadoMascota;
  descripcion: string;
  fotos?: string[];
  ubicacion: string | MapPoint;
  coordenadas?: Coordinates;
  contacto?: string;
  creadoPor?: string;
  fechaReporte?: Date | string | number;
  recompensa?: string | null;
}

export type NuevaAlertaMascota = Omit<Pet, 'id'>;

export type { MapPoint };
