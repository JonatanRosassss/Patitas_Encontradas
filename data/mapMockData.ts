import { Coordinates, MapPet } from '../types/map';

export interface MapCenterConfig extends Coordinates {
  zoom: number;
}

export const PILAR_DEFAULT_CENTER: MapCenterConfig = {
  latitude: -34.4586,
  longitude: -58.9142,
  zoom: 14,
};

export const MAP_FILTERS = ['Todos los Puntos', 'Perdidos', 'Encontrados'] as const;

export const MASCOTAS_MOCK: MapPet[] = [
  {
    id: 'milo',
    nombre: 'Milo',
    estado: 1,
    descripcion: 'Caniche Toy · Macho',
    ubicacion: 'Barrio Champagnat, Pilar',
    tiempo: 'Perdido hace 2 horas',
    recompensa: '$15.000',
    foto: {
      uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
    },
    coordenadas: {
      latitude: -34.4497,
      longitude: -58.9194,
    },
  },
  {
    id: 'luna',
    nombre: 'Luna',
    estado: 2,
    descripcion: 'Mestiza · Hembra',
    ubicacion: 'Plaza 12 de Octubre, Pilar',
    tiempo: 'Encontrada hace 1 hora',
    recompensa: null,
    foto: {
      uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    },
    coordenadas: {
      latitude: -34.4587,
      longitude: -58.9142,
    },
  },
];
