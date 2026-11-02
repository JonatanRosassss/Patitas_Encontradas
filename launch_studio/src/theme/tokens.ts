/**
 * Patitas Encontradas - Remotion Launch Studio Design Tokens
 * Ingested from constants/theme.ts, calibrated for 1080p 60fps cinematic rendering.
 */

export const Colors = {
  // Brand Core Colors
  primary: '#FF8A00',
  secondary: '#FFC28A',
  accent: '#FFE7D2',
  text: '#5A3A1F',
  textSecondary: '#8D735C',
  textMuted: '#B5A496',
  backgroundLight: '#FAF8F5',
  background: '#F2F2F2',
  card: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',

  // Status Colors
  statusPerdido: '#E65100',
  statusPerdidoBg: '#FFDBC8',
  statusPerdidoText: '#FFFFFF',
  statusEncontrado: '#FF8A00',
  statusEncontradoBg: '#FFE7D2',
  statusEncontradoText: '#5A3A1F',
  statusAdopcion: '#2E7D32',
  statusAdopcionBg: '#E8F5E9',
  statusAdopcionText: '#FFFFFF',

  // WhatsApp & Actions
  whatsapp: '#25D366',
  whatsappPressed: '#1DA851',
  detailContactDisabled: '#B5A496',

  // Reward Badges
  reward: '#E65100',
  rewardBg: '#FFF1E4',
  rewardBorder: '#FFD3AD',

  // UI Borders & Shadows
  border: '#E8DFD8',
  borderLight: '#F3ECE6',
  borderFocus: '#FF8A00',
  shadow: '#5A3A1F',
  overlay: 'rgba(90, 58, 31, 0.45)',
  tintPrimary: 'rgba(255, 138, 0, 0.12)',

  // Dark Void Cinematic Stage Colors
  darkVoidBg: '#0F0D0B',
  darkVoidSurface: '#1A1612',
  darkVoidSurfaceLight: '#26201A',
  darkVoidRim: '#FF8A00',
  darkVoidGlow: 'rgba(255, 138, 0, 0.22)',
  darkVoidBorder: 'rgba(255, 194, 138, 0.18)',
  darkVoidGlowIntense: 'rgba(255, 138, 0, 0.45)',
  darkVoidBackdrop: 'radial-gradient(ellipse at 50% 30%, rgba(255, 138, 0, 0.20) 0%, rgba(15, 13, 11, 0.98) 75%)',

  // Telemetry & Payoff Accents
  goldHighlight: '#FFD700',
  successGreen: '#2E7D32',
  pilarBlue: '#1565C0',
} as const;

export const Typography = {
  fonts: {
    display: "'Baloo 2', cursive, sans-serif",
    body: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
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
    heroTitle: 48,
    displaySuper: 64,
    impactStat: 72,
    megaStat: 96,
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
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
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  epic: 64,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  phoneBezel: 44,
  screenInner: 38,
  full: 9999,
} as const;

export const DetailMetrics = {
  heroBottomRadius: 28,
  contactButtonHeight: 56,
  mapHeight: 196,
  floatingButtonSize: 44,
  dotSize: 7,
  dotActiveWidth: 20,
  avatarSize: 52,
} as const;

/**
 * Deterministic Timing & Video Configuration Constants
 */
export const VideoMetrics = {
  fps: 60,
  width: 1920,
  height: 1080,
  durationInSeconds: 68.00,
  durationInFrames: 4080,
  audioSampleRate: 48000,
  audioChannels: 2,
} as const;

/**
 * 6-Act Timeline Allocation (frames @ 60fps)
 */
export const TimelineActs = {
  act1: {
    id: 'act1_alert',
    name: 'Alerta de Emergencia',
    startFrame: 0,
    endFrame: 600,
    durationFrames: 600,
    startSec: 0,
    endSec: 10.0,
  },
  act2: {
    id: 'act2_radar',
    name: 'Radar Barrial en Leaflet',
    startFrame: 600,
    endFrame: 1320,
    durationFrames: 720,
    startSec: 10.0,
    endSec: 22.0,
  },
  act3: {
    id: 'act3_report',
    name: 'Ficha Rápida & Recompensa',
    startFrame: 1320,
    endFrame: 1980,
    durationFrames: 660,
    startSec: 22.0,
    endSec: 33.0,
  },
  act4: {
    id: 'act4_whatsapp',
    name: 'Conexión Inmediata WhatsApp 1-Tap',
    startFrame: 1980,
    endFrame: 2580,
    durationFrames: 600,
    startSec: 33.0,
    endSec: 43.0,
  },
  act5: {
    id: 'act5_payoff',
    name: 'Payoff ¡ENCONTRADO!',
    startFrame: 2580,
    endFrame: 3180,
    durationFrames: 600,
    startSec: 43.0,
    endSec: 53.0,
  },
  act6: {
    id: 'act6_telemetry',
    name: 'Telemetría de Impacto & Municipio de Pilar',
    startFrame: 3180,
    endFrame: 4080,
    durationFrames: 900,
    startSec: 53.0,
    endSec: 68.0,
  },
} as const;

/**
 * Landmark Coordinates for Pilar, Buenos Aires
 */
export const PilarLandmarks = {
  plaza12Octubre: {
    lat: -34.4586,
    lng: -58.9142,
    name: 'Plaza 12 de Octubre',
    zone: 'Pilar Centro',
  },
  barrioChampagnat: {
    lat: -34.4497,
    lng: -58.9194,
    name: 'Barrio Champagnat',
    zone: 'Pilar Norte',
  },
  estacionPilar: {
    lat: -34.4620,
    lng: -58.9080,
    name: 'Estación Pilar (FFCC San Martín)',
    zone: 'Pilar Sur',
  },
  panamericanaKm50: {
    lat: -34.4410,
    lng: -58.8710,
    name: 'Las Palmas del Pilar (Km 50)',
    zone: 'Corredor Panamericana',
  },
} as const;

/**
 * Lead Pet Dataset for Demo
 */
export const LeadPet = {
  id: 'milo',
  name: 'Milo',
  species: 'Perro',
  breed: 'Caniche Toy',
  gender: 'Macho',
  location: 'Barrio Champagnat, Pilar',
  timeAgo: 'Hace 15 min',
  reward: '$15.000',
  rewardNumeric: 15000,
  photoUrl: '/images/welcome_dog_badge.png',
  heroBannerUrl: '/images/welcome_hero_3d.png',
  author: {
    name: 'María González',
    subtitle: 'Vecina de Pilar · Contacto verificado',
    phone: '+54 9 11 5555-4321',
  },
} as const;
