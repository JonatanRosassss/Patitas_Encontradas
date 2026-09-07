/**
 * Patitas Encontradas - Design System Theme
 * Basado en la guia de estilos oficial de la aplicacion
 *
 * Paleta de Colores:
 * - Naranja Principal: #FF8A00
 * - Naranja Claro (Secundario): #FFC28A
 * - Durazno Claro (Acento): #FFE7D2
 * - Marron (Texto): #5A3A1F
 * - Gris Claro (Fondos): #F2F2F2
 * - Blanco (Fondo Principal): #FFFFFF
 *
 * Tipografia:
 * - Titulos / Logo: Baloo 2
 * - Textos: Nunito
 */

import { Platform } from "react-native/Libraries/Utilities/Platform";

export const Colors = {
  // Colores de Marca Principales
  primary: '#FF8A00',
  secondary: '#FFC28A',
  accent: '#FFE7D2',
  text: '#5A3A1F',
  textSecondary: '#8D735C',
  textMuted: '#B5A496',
  background: '#F2F2F2',
  backgroundLight: '#FAF8F5',
  card: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',

  // Estados de Mascotas (Badges / Tags)
  statusEncontrado: '#FF8A00',
  statusEncontradoBg: '#FFE7D2',
  statusEncontradoText: '#5A3A1F',

  statusPerdido: '#E65100',
  statusPerdidoBg: '#FFDBC8',
  statusPerdidoText: '#FFFFFF',

  statusAdopcion: '#2E7D32',
  statusAdopcionBg: '#E8F5E9',
  statusAdopcionText: '#FFFFFF',

  // UI & Feedback
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#E53935',
  info: '#2196F3',

  // Bordes y Separadores
  border: '#E8DFD8',
  borderLight: '#F3ECE6',
  borderFocus: '#FF8A00',

  // Navegacion / Tab Bar
  tabActive: '#FF8A00',
  tabInactive: '#A89689',
  tabBackground: '#FFFFFF',

  // Sombras y Overlays
  shadow: '#5A3A1F',
  overlay: 'rgba(90, 58, 31, 0.45)',
  tintPrimary: 'rgba(255, 138, 0, 0.12)',
} as const;

export const Typography = {
  fonts: {
    titleBold: 'Baloo2_700Bold',
    titleSemiBold: 'Baloo2_600SemiBold',
    titleMedium: 'Baloo2_500Medium',
    titleRegular: 'Baloo2_400Regular',
    bodyBold: 'Nunito_700Bold',
    bodySemiBold: 'Nunito_600SemiBold',
    bodyRegular: 'Nunito_400Regular',
    bodyLight: 'Nunito_300Light',
    // Fallbacks para entornos donde las fuentes custom no hayan cargado
    fallbackTitle: 'System',
    fallbackBody: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
    logo: 36,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 28,
    xxl: 32,
    xxxl: 36,
    display: 40,
    logo: 44,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
} as const;


export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;