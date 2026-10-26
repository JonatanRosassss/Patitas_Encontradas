export type WelcomePillarId = 'mapa' | 'reporte' | 'comunidad';

export type CalloutPosition = 'topLeft' | 'topRight' | 'bottomRight';

export interface WelcomeCalloutBadge {
  id: string;
  texto: string;
  emoji: string;
  posicion: CalloutPosition;
  rotacionGrados: number;
  pilarAsociado: WelcomePillarId;
}

export interface WelcomePillarItem {
  id: WelcomePillarId;
  etiqueta: string;
  emoji: string;
  tituloPrefijo: string;
  tituloDestacado: string;
  descripcion: string;
  badgeperdidoTexto: string;
  badgeEncontradoTexto: string;
}
