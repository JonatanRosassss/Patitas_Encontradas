/**
 * Utilidades puras de seguridad defensiva, sanitización anti-XSS y validación de payloads.
 * Protege WebViews, formularios y servicios de base de datos contra inyección y abuso de cuota.
 */

export interface LimitesValidacionSeguridad {
  maxNombreMascota: number;
  maxUbicacion: number;
  maxDescripcion: number;
  maxRazaColor: number;
  maxFotosPorAlerta: number;
  maxRecompensa: number;
  maxBytesImagen: number;
  maxBase64Length: number;
  maxTituloTicket: number;
  maxDescripcionTicket: number;
  maxNombreContacto: number;
  maxEmailContacto: number;
  maxDestinatariosFanOut: number;
}

export const LIMITES_SEGURIDAD: LimitesValidacionSeguridad = {
  maxNombreMascota: 80,
  maxUbicacion: 200,
  maxDescripcion: 2000,
  maxRazaColor: 60,
  maxFotosPorAlerta: 5,
  maxRecompensa: 10000000,
  maxBytesImagen: 5 * 1024 * 1024, // 5 MB
  maxBase64Length: 1048576, // ~1 MB en string base64 para documento Firestore
  maxTituloTicket: 150,
  maxDescripcionTicket: 2000,
  maxNombreContacto: 80,
  maxEmailContacto: 120,
  maxDestinatariosFanOut: 50,
};

const MIME_TYPES_IMAGEN_PERMITIDOS = new Set<string>([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

/**
 * Escapa caracteres especiales HTML para prevenir ataques de Cross-Site Scripting (XSS)
 * al interpolar texto dentro de plantillas HTML/WebView.
 */
export function escaparHtml(texto: string): string {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitiza entradas de texto plano eliminando caracteres de control invisibles,
 * etiquetas potencialmente ejecutables (<script>, <iframe>, javascript:) y truncando a una longitud máxima.
 */
export function sanitizarTextoPlano(texto: string, maxLen: number): string {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/<\s*\/?\s*(script|iframe|object|embed|svg|style|link|meta)\b[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLen);
}

/**
 * Valida que un número telefónico contenga entre 8 y 15 dígitos reales
 * y no incluya etiquetas HTML ni vectores de inyección.
 */
export function esTelefonoValido(telefono: string): boolean {
  if (!telefono || typeof telefono !== 'string') return false;
  if (/[<>'"`;]/.test(telefono)) return false;
  const soloDigitos = telefono.replace(/\D/g, '');
  return soloDigitos.length >= 8 && soloDigitos.length <= 15;
}

/**
 * Valida que un color CSS interpolado en el WebView sea estrictamente un código hexadecimal
 * o un identificador funcional seguro (evita inyección CSS/HTML en estilos inline).
 */
export function sanitizarColorCss(color: string, fallback: string): string {
  if (!color || typeof color !== 'string') return fallback;
  const limpio = color.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(limpio)) {
    return limpio;
  }
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/.test(limpio)) {
    return limpio;
  }
  return fallback;
}

/**
 * Verifica que un archivo o Blob de imagen cumpla con la lista blanca de tipos MIME
 * y no exceda el límite máximo de 5 MB antes de subirlo a Storage.
 */
export function validarArchivoImagen(mimeType?: string, sizeBytes?: number): void {
  if (typeof sizeBytes === 'number' && Number.isFinite(sizeBytes)) {
    if (sizeBytes <= 0) {
      throw new Error('El archivo de imagen seleccionado está vacío.');
    }
    if (sizeBytes > LIMITES_SEGURIDAD.maxBytesImagen) {
      throw new Error('La imagen supera el tamaño máximo permitido de 5 MB.');
    }
  }

  if (mimeType && typeof mimeType === 'string') {
    const mimeNormalizado = mimeType.toLowerCase().trim();
    if (mimeNormalizado.length > 0 && !MIME_TYPES_IMAGEN_PERMITIDOS.has(mimeNormalizado)) {
      throw new Error('Formato de archivo no permitido. Solo se admiten imágenes JPG, PNG o WEBP.');
    }
  }
}
