import type { WelcomeCalloutBadge, WelcomePillarItem } from '@/types/Welcome';

export const WELCOME_PILLARS: readonly WelcomePillarItem[] = [
  {
    id: 'mapa',
    etiqueta: 'Mapa en vivo',
    emoji: '📍',
    tituloPrefijo: 'Tu red barrial para\nque ',
    tituloDestacado: 'vuelvan a casa',
    descripcion:
      'Geolocalizá mascotas perdidas, recibí alertas en tiempo real en tu barrio y conectá directo con tus vecinos.',
    badgeperdidoTexto: 'PERDIDO',
    badgeEncontradoTexto: 'ENCONTRADO',
  },
  {
    id: 'reporte',
    etiqueta: 'Reporte rápido',
    emoji: '🚨',
    tituloPrefijo: 'Publicá una alerta\nbarrial en ',
    tituloDestacado: '60 segundos',
    descripcion:
      'Subí una foto, marcá la esquina exacta en el mapa interactivo de Pilar y activá el radar vecinal al instante.',
    badgeperdidoTexto: 'ALERTA GPS',
    badgeEncontradoTexto: 'RADAR ACTIVO',
  },
  {
    id: 'comunidad',
    etiqueta: 'Comunidad',
    emoji: '🤝',
    tituloPrefijo: 'Vecinos unidos sin\n',
    tituloDestacado: 'intermediarios',
    descripcion:
      'Coordiná avistamientos por WhatsApp con un toque, ofrecé tránsito solidario y celebrá cada reencuentro en tu zona.',
    badgeperdidoTexto: 'AVISTADO',
    badgeEncontradoTexto: 'EN CASA',
  },
] as const;

export const WELCOME_CALLOUT_BADGES: readonly WelcomeCalloutBadge[] = [
  {
    id: 'callout-gps',
    texto: 'Alerta GPS\nen 60s',
    emoji: '📍',
    posicion: 'topLeft',
    rotacionGrados: -7,
    pilarAsociado: 'reporte',
  },
  {
    id: 'callout-vecinos',
    texto: 'Vecinos en Pilar\nconectados',
    emoji: '💬',
    posicion: 'topRight',
    rotacionGrados: 7,
    pilarAsociado: 'mapa',
  },
  {
    id: 'callout-comunidad',
    texto: 'Contacto directo\npor WhatsApp',
    emoji: '🤝',
    posicion: 'bottomRight',
    rotacionGrados: 5,
    pilarAsociado: 'comunidad',
  },
] as const;
