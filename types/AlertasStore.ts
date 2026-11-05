import type { EstadoMascota, Pet } from './Pet';
import type { MapPet } from './map';

export interface AlertasStoreState {
  alertas: Pet[];
  alertasMapa: MapPet[];
  idsGuardadas: string[];
  cargandoAlertas: boolean;
  cargandoMapa: boolean;
  cargandoGuardadas: boolean;
  guardadasCargadas: boolean;
  errorAlertas: string | null;
  sincronizarAlertas: () => Promise<Pet[]>;
  sincronizarAlertasMapa: () => Promise<MapPet[]>;
  sincronizarIdsGuardadas: (idUsuario?: string, forzar?: boolean) => Promise<string[]>;
  alternarGuardadoStore: (idPublicacion: string, idUsuario?: string) => Promise<boolean>;
  quitarGuardadoLocal: (idPublicacion: string) => void;
  actualizarEstadoLocal: (idAlerta: string, nuevoEstado: EstadoMascota) => void;
  eliminarAlertaLocal: (idAlerta: string) => void;
  limpiarStore: () => void;
}
