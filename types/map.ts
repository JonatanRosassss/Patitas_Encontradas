export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type MapCoordinates = Coordinates;

export type PetState = 1 | 2; // 1 = Perdido, 2 = Encontrado

export interface MapPet {
  id: string;
  nombre: string;
  estado: PetState;
  descripcion: string;
  ubicacion: string;
  tiempo: string;
  recompensa?: string | null;
  foto: { uri: string };
  coordenadas: Coordinates;
}

export type MapFilterIndex = 0 | 1 | 2; // 0: Todos los Puntos, 1: Perdidos, 2: Encontrados

export interface MapBridgeEvent {
  type: 'MAP_READY' | 'MARKER_CLICK' | 'MAP_CLICK' | 'MAP_ERROR';
  payload?: {
    id?: string;
    error?: string;
    lat?: number;
    lng?: number;
    [key: string]: unknown;
  };
}
