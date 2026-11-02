import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * Redirección de compatibilidad:
 * La pantalla oficial del detalle de mascota según la arquitectura del proyecto
 * reside en `app/detalle/[id].tsx`. Este componente redirige cualquier intento de navegación
 * hacia la ruta oficial preservando el identificador.
 */
export default function MascotaRedirectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/detalle/${id}`} />;
}
