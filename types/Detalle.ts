/**
 * Contratos TypeScript de la Ficha de Mascota (app/detalle/[id].tsx)
 * y de sus componentes de presentación en components/detalle/.
 */
import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';

import type { Coordinates } from './map';
import type { EspecieMascota, EstadoMascota } from './Pet';

/** Nombre válido de ícono de Ionicons (tipado estricto, sin `any`). */
export type NombreIonicon = ComponentProps<typeof Ionicons>['name'];

/** Resultado de normalizar la ubicación de una alerta para su visualización. */
export interface UbicacionResuelta {
  /** Dirección legible para el vecino. */
  direccion: string;
  /** Coordenadas a centrar en el mapa (reales o el centro por defecto de Pilar). */
  coordenadas: Coordinates;
  /** true cuando la alerta no trae GPS y se usa una zona aproximada. */
  esAproximada: boolean;
}

/** Presentación visual del estado de la alerta (pill sobre la foto, pin del mapa). */
export interface PresentacionEstado {
  etiqueta: string;
  color: string;
}

export interface PetFloatingButtonProps {
  icono: NombreIonicon;
  onPress: () => void;
  accessibilityLabel: string;
  /** Diámetro del botón. Por defecto DetailMetrics.floatingButtonSize. */
  tamano?: number;
  /** Tamaño del ícono. Por defecto DetailMetrics.floatingIconSize. */
  tamanoIcono?: number;
  style?: StyleProp<ViewStyle>;
}

export interface PetHeroCarouselProps {
  fotos: string[];
  nombre: string;
  estado: EstadoMascota;
  /** Alto total del hero (ya acotado por DetailMetrics). */
  alturaHero: number;
  /** Inset superior real del dispositivo (status bar / notch). */
  insetSuperior: number;
  onVolver: () => void;
  onCompartir: () => void;
}

export interface PetInfoHeaderProps {
  nombre: string;
  especie: EspecieMascota;
  tiempoRelativo: string;
  /** Monto ya formateado (ej. "$20.000") o null si no hay recompensa. */
  recompensa: string | null;
}

export interface PetLocationMapProps {
  coordenadas: Coordinates;
  esAproximada: boolean;
  /** Color del pin / zona (según estado de la alerta). */
  colorPin: string;
  onPress?: () => void;
}

export interface PetLocationSectionProps {
  ubicacion: UbicacionResuelta;
  tiempoRelativo: string;
  colorPin: string;
  onAbrirMapa?: () => void;
}

export interface PetAuthorCardProps {
  nombre: string;
  avatarUrl?: string;
  telefonoDisponible: boolean;
}

export interface PetContactBarProps {
  telefonoDisponible: boolean;
  contactando: boolean;
  /** Inset inferior real (barra de navegación de Android / home indicator iOS). */
  insetInferior: number;
  onContactar: () => void;
  /** Reporta la altura real renderizada de la barra para calcular el espaciador del scroll. */
  onCambioAltura: (altura: number) => void;
}
