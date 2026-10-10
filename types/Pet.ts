import { MapPoint } from './MapPoint';
import { Coordinates } from './map';
import { Usuario } from './User';

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

export type ActualizarAlertaMascota = Partial<Omit<Pet, 'id' | 'creadoPor' | 'fechaReporte'>>;

export interface FiltrosListadoMascotas {
  estado?: EstadoMascota;
  especie?: EspecieMascota;
  creadoPor?: string;
  limite?: number;
}

export interface PetConUsuario extends Pet {
  usuario?: Usuario | null;
}

export type { MapPoint };

