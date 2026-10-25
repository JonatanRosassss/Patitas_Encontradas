import { Coordinates } from '@/types/map';
import { isValidCoordinate } from '@/utils/geoValidation';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface GeocodingResult {
  direccion: string;
  coordenadas: Coordinates;
}

/**
 * Zonas y puntos de referencia populares en el Partido del Pilar
 * para selección inmediata con un solo toque.
 */
export const ZONAS_PILAR_PRESETS: Array<{ nombre: string; etiqueta: string; coordenadas: Coordinates }> = [
  {
    nombre: 'Plaza 12 de Octubre, Pilar Centro',
    etiqueta: '🏛️ Pilar Centro',
    coordenadas: { latitude: -34.4587, longitude: -58.9142 },
  },
  {
    nombre: 'Barrio Champagnat, Pilar',
    etiqueta: '🏘️ Champagnat',
    coordenadas: { latitude: -34.4497, longitude: -58.9194 },
  },
  {
    nombre: 'Estación Pilar (Línea San Martín)',
    etiqueta: '🚆 Estación Pilar',
    coordenadas: { latitude: -34.4620, longitude: -58.9080 },
  },
  {
    nombre: 'Panamericana Km 50, Pilar',
    etiqueta: '🛍️ Km 50 (Palmas)',
    coordenadas: { latitude: -34.4410, longitude: -58.8710 },
  },
  {
    nombre: 'Del Viso, Pilar',
    etiqueta: '🌳 Del Viso',
    coordenadas: { latitude: -34.4430, longitude: -58.8030 },
  },
  {
    nombre: 'Presidente Derqui, Pilar',
    etiqueta: '🏡 Derqui',
    coordenadas: { latitude: -34.4850, longitude: -58.8350 },
  },
  {
    nombre: 'Villa Rosa, Pilar',
    etiqueta: '🌻 Villa Rosa',
    coordenadas: { latitude: -34.4320, longitude: -58.8820 },
  },
];

/**
 * Parsea y geocodifica una dirección o nombre de lugar a coordenadas geográficas (lat, lng).
 * Utiliza OpenStreetMap Nominatim (sin claves de API ni costos), con fallback a presets locales
 * y expo-location en dispositivos nativos.
 */
export async function geocodificarDireccion(textoDireccion: string): Promise<GeocodingResult[]> {
  const query = textoDireccion.trim();
  if (!query) {
    return [];
  }

  // 1. Verificar coincidencia exacta o cercana con presets de Pilar
  const queryLower = query.toLowerCase();
  for (const preset of ZONAS_PILAR_PRESETS) {
    if (
      preset.nombre.toLowerCase().includes(queryLower) ||
      queryLower.includes(preset.nombre.toLowerCase()) ||
      preset.etiqueta.toLowerCase().includes(queryLower)
    ) {
      return [
        {
          direccion: preset.nombre,
          coordenadas: preset.coordenadas,
        },
      ];
    }
  }

  // 2. Geocodificación remota con OpenStreetMap Nominatim
  try {
    const consulta = queryLower.includes('pilar')
      ? query
      : `${query}, Pilar, Buenos Aires, Argentina`;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      consulta
    )}&limit=5&countrycodes=ar`;

    const respuesta = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PatitasEncontradasMobileApp/1.0',
      },
    });

    if (respuesta.ok) {
      const data = await respuesta.json();
      if (Array.isArray(data) && data.length > 0) {
        const resultadosValidos: GeocodingResult[] = [];

        for (const item of data) {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);

          if (isValidCoordinate(lat, lon)) {
            resultadosValidos.push({
              direccion: item.display_name,
              coordenadas: {
                latitude: lat,
                longitude: lon,
              },
            });
          }
        }

        if (resultadosValidos.length > 0) {
          return resultadosValidos;
        }
      }
    }
  } catch {
    // Si falla la red remota o Nominatim tiene latencia, continúa a fallbacks
  }

  // 3. Fallback nativo con expo-location si no estamos en Web
  if (Platform.OS !== 'web') {
    try {
      const consultaNativa = queryLower.includes('pilar')
        ? query
        : `${query}, Pilar, Buenos Aires`;
      const coordsNativas = await Location.geocodeAsync(consultaNativa);

      if (Array.isArray(coordsNativas) && coordsNativas.length > 0) {
        const primerResultado = coordsNativas[0];
        if (isValidCoordinate(primerResultado.latitude, primerResultado.longitude)) {
          return [
            {
              direccion: `${query}, Pilar`,
              coordenadas: {
                latitude: primerResultado.latitude,
                longitude: primerResultado.longitude,
              },
            },
          ];
        }
      }
    } catch {
      // Ignorar fallo en geocodificación nativa
    }
  }

  // 4. Si la consulta menciona Pilar o barrios conocidos, aproximar al centro de Pilar
  if (queryLower.includes('pilar') || queryLower.includes('centro') || queryLower.includes('plaza')) {
    return [
      {
        direccion: `${query} (Aproximado en Pilar Centro)`,
        coordenadas: { latitude: -34.4587, longitude: -58.9142 },
      },
    ];
  }

  return [];
}
