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

import { Platform } from 'react-native';

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

  // Marcas Sociales (OAuth)
  google: '#DB4437',
  facebook: '#4267B2',

  // Tokens de Pantalla de Bienvenida (Unificados con Paleta Oficial y Login)
  welcomeCanvas: '#FAF8F5',
  welcomeHeadlineDark: '#5A3A1F',
  welcomeAccentCoral: '#FF8A00',
  welcomeAccentWarm: '#FF8A00',
  welcomeGlowOuter: 'rgba(255, 194, 138, 0.30)',
  welcomeGlowInner: 'rgba(255, 138, 0, 0.14)',
  welcomeCalloutBg: '#FFFFFF',
  welcomeCalloutBorder: '#E8DFD8',
  welcomePillBg: '#FFFFFF',
  welcomePillActiveBg: '#FFE7D2',
  welcomePillBorder: '#E8DFD8',
  welcomePinLost: '#E65100',
  welcomePinFound: '#2E7D32',
  welcomeDotInactive: '#FFC28A',
  welcomeSkipText: '#8D735C',

  // Tokens de Ficha de Mascota
  detailWhatsapp: '#25D366', // Verde oficial de WhatsApp (reconocimiento inmediato del CTA)
  detailWhatsappPressed: '#1DA851',
  detailContactDisabled: '#B5A496',
  detailOverlayButton: 'rgba(255, 255, 255, 0.90)',
  detailOverlayButtonPressed: 'rgba(255, 255, 255, 0.72)',
  detailOverlayChip: 'rgba(255, 255, 255, 0.92)',
  detailDotActive: '#FFFFFF',
  detailDotInactive: 'rgba(255, 255, 255, 0.55)',
  detailDotsTrack: 'rgba(43, 26, 12, 0.32)',
  detailHeroPlaceholder: '#FFE7D2',
  detailHeroPlaceholderIconBg: '#FFC28A',
  detailStatusLost: '#E65100',
  detailStatusFound: '#2E7D32',
  detailStatusSeen: '#1565C0',
  detailReward: '#E65100',
  detailRewardBg: '#FFF1E4',
  detailRewardBorder: '#FFD3AD',
  detailMapPinShadow: 'rgba(90, 58, 31, 0.35)',
  detailContactBarShadow: 'rgba(90, 58, 31, 0.10)',
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
  // Alias estandar
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  full: 9999,
} as const;

export const BorderRadius = Radius;

/**
 * Métricas de layout de la Ficha de Mascota (app/detalle/[id].tsx).
 * El alto del hero se calcula como ratio del alto de pantalla, acotado por min/max
 * para que se vea proporcionado tanto en 360dp como en tablets.
 */
export const DetailMetrics = {
  heroHeightRatio: 0.45,
  heroMinHeight: 300,
  heroMaxHeight: 480,
  heroBottomRadius: 28,
  floatingButtonSize: 44,
  floatingIconSize: 22,
  arrowButtonSize: 40,
  arrowIconSize: 20,
  dotSize: 7,
  dotActiveWidth: 20,
  statusDotSize: 8,
  placeholderIconCircle: 112,
  placeholderIconSize: 56,
  mapHeight: 196,
  mapApproxRadiusMeters: 450,
  mapZoomExact: 16,
  mapZoomApprox: 14,
  avatarSize: 52,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  errorIconSize: 64,
  errorTextMaxWidth: 320,
  contactButtonHeight: 56,
  rewardMaxWidthRatio: 0.42,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Métricas de la barra inferior de pestañas.
 * La altura final = contentHeight + inset inferior real del dispositivo
 * (barra de 3 botones / gestos de Android edge-to-edge, home indicator de iOS).
 */
export const TabBarMetrics = {
  contentHeight: 58,
  paddingTop: Spacing.sm,
  minBottomPadding: Spacing.sm,
  iconSize: 24,
} as const;
