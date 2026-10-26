/**
 * Utilidades puras de presentación para la Ficha de Mascota.
 * Sin efectos secundarios ni dependencias de UI: fáciles de testear y reutilizar.
 */
import { Colors } from '@/constants/theme';
import { PILAR_DEFAULT_CENTER } from '@/data/mapMockData';
import type { Coordinates } from '@/types/map';
import type { MapPoint } from '@/types/MapPoint';
import type { EspecieMascota, EstadoMascota, Pet } from '@/types/Pet';
import type { PresentacionEstado, UbicacionResuelta } from '@/types/Detalle';

const DIRECCION_POR_DEFECTO = 'Ubicación no especificada';

/** Imagen de respaldo de alta calidad (golden retriever) si una alerta no tiene foto. */
export const IMAGEN_MASCOTA_DEFAULT =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800';

/**
 * Valida si un URI de imagen es utilizable por React Native Image.
 * Detecta y descarta strings corruptos o errores serializados (ej. "File not found" en base64).
 */
export function esFotoValida(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const limpio = url.trim();
  if (!limpio) return false;
  if (limpio.includes('File not found') || limpio.includes('RmlsZSBub3QgZm91bmQ=')) return false;
  if (limpio.startsWith('http://') || limpio.startsWith('https://')) return true;
  if (limpio.startsWith('data:image/')) return true;
  if (limpio.startsWith('file://')) return true;
  return false;
}

/**
 * Devuelve un array de fotos válidas garantizadas.
 * Si no hay ninguna válida y fallbackPorDefecto es true, devuelve [IMAGEN_MASCOTA_DEFAULT].
 */
export function obtenerFotosValidas(
  fotos: unknown,
  fallbackPorDefecto: boolean = true
): string[] {
  const validas = Array.isArray(fotos) ? fotos.filter(esFotoValida) : [];
  if (validas.length > 0) return validas;
  return fallbackPorDefecto ? [IMAGEN_MASCOTA_DEFAULT] : [];
}

/**
 * Devuelve la primera foto válida de la mascota o la imagen de respaldo por defecto.
 */
export function obtenerImagenPrincipal(fotos: unknown): string {
  const validas = obtenerFotosValidas(fotos, true);
  return validas[0] || IMAGEN_MASCOTA_DEFAULT;
}

/** Pone en mayúscula la primera letra (ej. "rosita" -> "Rosita"). */
export function capitalizar(texto: string): string {
  const limpio = texto.trim();
  if (!limpio) return limpio;
  return limpio.charAt(0).toLocaleUpperCase('es-AR') + limpio.slice(1);
}

/** Agrega separador de miles con punto (formato es-AR) sin depender de Intl. */
function separarMiles(valor: number): string {
  return Math.round(valor)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formatea la recompensa para mostrarla destacada.
 * - "20000" | "20.000" | "$ 20000" -> "$20.000"
 * - Texto libre ("A convenir") se respeta tal cual.
 * - Vacío / null -> null (no se muestra el bloque).
 */
export function formatearRecompensa(recompensa?: string | null): string | null {
  if (recompensa === null || recompensa === undefined) return null;
  const limpio = String(recompensa).trim();
  if (!limpio) return null;

  const numerico = limpio.replace(/[$\s.]/g, '').replace(',', '.');
  if (/^\d+(\.\d+)?$/.test(numerico)) {
    const monto = Number(numerico);
    if (!Number.isFinite(monto) || monto <= 0) return null;
    return `$${separarMiles(monto)}`;
  }

  return limpio;
}

function esCoordenadaValida(lat: unknown, lng: unknown): lat is number {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

function esMapPoint(ubicacion: Pet['ubicacion']): ubicacion is MapPoint {
  return typeof ubicacion === 'object' && ubicacion !== null;
}

/** Extrae coordenadas válidas de un MapPoint (Y = latitud, X = longitud). */
function coordenadasDesdeMapPoint(punto: MapPoint): Coordinates | null {
  const { coordenadasX, coordenadasY } = punto;
  if (esCoordenadaValida(coordenadasY, coordenadasX)) {
    return { latitude: coordenadasY, longitude: coordenadasX };
  }
  // Tolerancia a datos cargados con ejes invertidos
  if (esCoordenadaValida(coordenadasX, coordenadasY)) {
    return { latitude: coordenadasX, longitude: coordenadasY };
  }
  return null;
}

/** Devuelve la dirección legible de la alerta, sea string o MapPoint. */
export function obtenerDireccionAlerta(alerta: Pick<Pet, 'ubicacion'>): string {
  const { ubicacion } = alerta;
  if (typeof ubicacion === 'string') {
    return ubicacion.trim() ? capitalizar(ubicacion) : DIRECCION_POR_DEFECTO;
  }
  if (esMapPoint(ubicacion) && ubicacion.direccion?.trim()) {
    return capitalizar(ubicacion.direccion);
  }
  return DIRECCION_POR_DEFECTO;
}

/**
 * Normaliza ubicación y coordenadas de una alerta.
 * Prioridad: alerta.coordenadas > coords del MapPoint > centro de Pilar (aproximada).
 */
export function resolverUbicacionAlerta(
  alerta: Pick<Pet, 'ubicacion' | 'coordenadas'>
): UbicacionResuelta {
  const direccion = obtenerDireccionAlerta(alerta);
  const { coordenadas, ubicacion } = alerta;

  if (coordenadas && esCoordenadaValida(coordenadas.latitude, coordenadas.longitude)) {
    return {
      direccion,
      coordenadas: { latitude: coordenadas.latitude, longitude: coordenadas.longitude },
      esAproximada: false,
    };
  }

  if (esMapPoint(ubicacion)) {
    const desdePunto = coordenadasDesdeMapPoint(ubicacion);
    if (desdePunto) {
      return { direccion, coordenadas: desdePunto, esAproximada: false };
    }
  }

  return {
    direccion,
    coordenadas: {
      latitude: PILAR_DEFAULT_CENTER.latitude,
      longitude: PILAR_DEFAULT_CENTER.longitude,
    },
    esAproximada: true,
  };
}

/** Etiqueta y color del estado de la alerta. */
export function obtenerPresentacionEstado(estado: EstadoMascota | string): PresentacionEstado {
  switch (String(estado).toUpperCase()) {
    case 'ENCONTRADO':
      return { etiqueta: 'ENCONTRADO', color: Colors.detailStatusFound };
    case 'VISTO':
      return { etiqueta: 'AVISTADO', color: Colors.detailStatusSeen };
    default:
      return { etiqueta: 'PERDIDO', color: Colors.detailStatusLost };
  }
}

/** Nombre legible de la especie. */
export function obtenerEtiquetaEspecie(especie: EspecieMascota | string): string {
  switch (String(especie).toUpperCase()) {
    case 'PERRO':
      return 'Perro';
    case 'GATO':
      return 'Gato';
    default:
      return 'Otra mascota';
  }
}
