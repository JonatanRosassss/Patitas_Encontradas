export interface MapPoint {
  id: string;
  tipo: 'perdido' | 'visto' | 'campania';
  titulo: string;
  subtitulo: string;
  direccion: string;
  tiempo: string;
  foto: string;
  coordenadasX: number;
  coordenadasY: number;
}
