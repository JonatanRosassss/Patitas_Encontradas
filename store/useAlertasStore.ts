import { create } from 'zustand';
import {
  listarTodasLasAlertas,
  listarAlertasParaMapa,
  obtenerIdsPublicacionesGuardadas,
  guardarPublicacion,
  quitarPublicacionGuardada,
} from '@/services/mascotasService';
import type { AlertasStoreState } from '@/types/AlertasStore';
import type { EstadoMascota, Pet } from '@/types/Pet';
import type { MapPet } from '@/types/map';

let promesaGuardadasEnCurso: Promise<string[]> | null = null;
let promesaAlertasEnCurso: Promise<Pet[]> | null = null;

export const useAlertasStore = create<AlertasStoreState>((set, get) => ({
  alertas: [],
  alertasMapa: [],
  idsGuardadas: [],
  cargandoAlertas: false,
  cargandoMapa: false,
  cargandoGuardadas: false,
  guardadasCargadas: false,
  errorAlertas: null,

  sincronizarAlertas: async (): Promise<Pet[]> => {
    if (promesaAlertasEnCurso) {
      return promesaAlertasEnCurso;
    }

    set({ cargandoAlertas: true, errorAlertas: null });

    promesaAlertasEnCurso = (async () => {
      try {
        const lista = await listarTodasLasAlertas();
        const alertasSeguras = lista || [];
        set({ alertas: alertasSeguras, cargandoAlertas: false, errorAlertas: null });
        return alertasSeguras;
      } catch (error) {
        set({
          cargandoAlertas: false,
          errorAlertas: 'No se pudieron sincronizar las publicaciones. Verificá tu conexión a internet.',
        });
        throw error;
      } finally {
        promesaAlertasEnCurso = null;
      }
    })();

    return promesaAlertasEnCurso;
  },

  sincronizarAlertasMapa: async (): Promise<MapPet[]> => {
    set({ cargandoMapa: true });
    try {
      const puntos = await listarAlertasParaMapa();
      const puntosSeguros = puntos || [];
      set({ alertasMapa: puntosSeguros, cargandoMapa: false });
      return puntosSeguros;
    } catch (error) {
      set({ cargandoMapa: false });
      throw error;
    }
  },

  sincronizarIdsGuardadas: async (idUsuario?: string, forzar = false): Promise<string[]> => {
    const estadoActual = get();
    if (estadoActual.guardadasCargadas && !forzar) {
      return estadoActual.idsGuardadas;
    }

    if (promesaGuardadasEnCurso) {
      return promesaGuardadasEnCurso;
    }

    set({ cargandoGuardadas: true });

    promesaGuardadasEnCurso = (async () => {
      try {
        const ids = await obtenerIdsPublicacionesGuardadas(idUsuario);
        const idsSeguros = Array.isArray(ids) ? ids : [];
        set({
          idsGuardadas: idsSeguros,
          cargandoGuardadas: false,
          guardadasCargadas: true,
        });
        return idsSeguros;
      } catch {
        set({ cargandoGuardadas: false });
        return get().idsGuardadas;
      } finally {
        promesaGuardadasEnCurso = null;
      }
    })();

    return promesaGuardadasEnCurso;
  },

  alternarGuardadoStore: async (idPublicacion: string, idUsuario?: string): Promise<boolean> => {
    const estabaGuardada = get().idsGuardadas.includes(idPublicacion);

    if (estabaGuardada) {
      await quitarPublicacionGuardada(idPublicacion, idUsuario);
      set((state) => ({
        idsGuardadas: state.idsGuardadas.filter((item) => item !== idPublicacion),
      }));
      return false;
    }

    await guardarPublicacion(idPublicacion, idUsuario);
    set((state) => ({
      idsGuardadas: state.idsGuardadas.includes(idPublicacion)
        ? state.idsGuardadas
        : [...state.idsGuardadas, idPublicacion],
    }));
    return true;
  },

  quitarGuardadoLocal: (idPublicacion: string): void => {
    set((state) => ({
      idsGuardadas: state.idsGuardadas.filter((item) => item !== idPublicacion),
    }));
  },

  actualizarEstadoLocal: (idAlerta: string, nuevoEstado: EstadoMascota): void => {
    set((state) => ({
      alertas: state.alertas.map((pet) =>
        pet.id === idAlerta ? { ...pet, estado: nuevoEstado } : pet
      ),
      alertasMapa: state.alertasMapa.map((point) =>
        point.id === idAlerta
          ? { ...point, estado: nuevoEstado === 'ENCONTRADO' ? 2 : 1 }
          : point
      ),
    }));
  },

  eliminarAlertaLocal: (idAlerta: string): void => {
    set((state) => ({
      alertas: state.alertas.filter((pet) => pet.id !== idAlerta),
      alertasMapa: state.alertasMapa.filter((point) => point.id !== idAlerta),
      idsGuardadas: state.idsGuardadas.filter((id) => id !== idAlerta),
    }));
  },

  limpiarStore: (): void => {
    set({
      idsGuardadas: [],
      guardadasCargadas: false,
      errorAlertas: null,
    });
  },
}));
