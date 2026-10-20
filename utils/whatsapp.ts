import { Linking, Alert } from 'react-native';

/**
 * Sanitiza y normaliza un número de teléfono para generar un enlace universal de WhatsApp (wa.me).
 * Soporta números de Argentina con o sin prefijo internacional (+54 / 549), código de área o prefijo local (15 / 0).
 */
export function formatearTelefonoParaWhatsApp(telefono: string): string {
  // 1. Eliminar caracteres no numéricos
  let numeros = telefono.replace(/\D/g, '');

  if (!numeros) {
    return '';
  }

  // 2. Si empieza con 0 (código de salida nacional en Argentina, ej: 011 / 0230)
  if (numeros.startsWith('0')) {
    numeros = numeros.substring(1);
  }

  // 3. Si contiene el '15' de celular local inmediatamente después del código de área de 2 dígitos (ej: 1115...)
  if (numeros.startsWith('1115') && numeros.length === 10) {
    numeros = '11' + numeros.substring(4);
  }

  // 4. Normalizar formato internacional de Argentina (+54 9 ...)
  if (numeros.startsWith('549')) {
    return numeros;
  }

  if (numeros.startsWith('54') && !numeros.startsWith('549')) {
    // Si tiene 54 pero le falta el 9 de celular móvil argentino
    return '549' + numeros.substring(2);
  }

  // Si tiene formato de número nacional argentino (10 dígitos, ej: 11xxxxxxxx o 2304xxxxxx)
  if (numeros.length === 10) {
    return `549${numeros}`;
  }

  // En cualquier otro caso nacional de 8 a 11 dígitos, asumimos número argentino móvil
  if (numeros.length >= 8 && numeros.length <= 11) {
    return `549${numeros}`;
  }

  return numeros;
}

export interface OpcionesMensajeWhatsApp {
  nombreMascota?: string;
  estado?: string;
  ubicacion?: string;
  idAlerta?: string;
}

/**
 * Genera un mensaje contextualizado y cordial para el primer contacto con el dueño o rescatista.
 */
export function generarMensajeContactoMascota(opciones: OpcionesMensajeWhatsApp): string {
  const { nombreMascota, estado, ubicacion } = opciones;

  const identificador = nombreMascota && nombreMascota.trim()
    ? `"${nombreMascota.trim()}"`
    : 'la mascota';

  const estadoTexto = estado === 'ENCONTRADO' ? 'mascota encontrada' : 'mascota perdida';
  const ubicacionTexto = ubicacion && ubicacion.trim() ? ` en la zona de ${ubicacion.trim()}` : '';

  return `¡Hola! Te contacto desde la app Patitas Encontradas respecto a tu publicación sobre ${identificador} (${estadoTexto}${ubicacionTexto}). Tengo información / novedades para compartirte.`;
}

export interface ParametrosAbrirWhatsApp {
  telefono?: string | null;
  mensaje?: string;
}

/**
 * Abre la conversación en WhatsApp con validaciones y manejo de errores amigable para el vecino.
 */
export async function contactarPorWhatsApp({
  telefono,
  mensaje = '¡Hola! Te contacto desde la app Patitas Encontradas.',
}: ParametrosAbrirWhatsApp): Promise<boolean> {
  if (!telefono || !telefono.trim()) {
    Alert.alert(
      'Contacto no disponible',
      'El vecino que publicó esta alerta no incluyó un número telefónico de contacto directo.'
    );
    return false;
  }

  const telefonoLimpio = formatearTelefonoParaWhatsApp(telefono);

  if (!telefonoLimpio || telefonoLimpio.length < 8) {
    Alert.alert(
      'Número no válido',
      'El número telefónico registrado en esta publicación no tiene un formato válido para WhatsApp.'
    );
    return false;
  }

  const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      // Intentar abrir igualmente ya que wa.me es compatible vía navegador
      await Linking.openURL(url);
      return true;
    }

    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert(
      'No se pudo abrir WhatsApp',
      'Verificá que tengas instalada la aplicación de WhatsApp o un navegador web habilitado en tu dispositivo.'
    );
    return false;
  }
}
