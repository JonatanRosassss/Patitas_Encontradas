import { Platform } from 'react-native';

interface ExpoNativeDeviceModule {
  isDevice?: boolean;
}

interface NotificationPermissionResponse {
  status?: string;
  granted?: boolean;
}

interface ExpoNotificationsPermissionsModule {
  getPermissionsAsync?: () => Promise<NotificationPermissionResponse>;
  requestPermissionsAsync?: () => Promise<NotificationPermissionResponse>;
}

interface ExpoPushTokenResponse {
  data?: string;
}

interface ExpoNotificationsTokenModule {
  getExpoPushTokenAsync?: () => Promise<ExpoPushTokenResponse>;
}

/**
 * Obtiene de forma segura el mapa de módulos nativos de Expo en tiempo de ejecución
 * sin disparar excepciones de `requireNativeModule` cuando un módulo no está compilado
 * en el cliente actual (ej. Expo Go en Android o emuladores).
 */
function obtenerMapaModulosExpo(): Record<string, unknown> | null {
  try {
    const globalConExpo = globalThis as {
      expo?: {
        modules?: Record<string, unknown>;
      };
    };
    return globalConExpo.expo?.modules ?? null;
  } catch {
    return null;
  }
}

/**
 * Verifica si el entorno actual es un dispositivo físico con soporte nativo
 * para notificaciones push de Expo, evitando cargar barriles nativos incompletos
 * como `ExpoTopicSubscriptionModule` en Expo Go o emuladores.
 */
export function soportaPushNativoEnDispositivo(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }

  const modulos = obtenerMapaModulosExpo();
  if (!modulos) {
    return false;
  }

  const moduloDevice = modulos.ExpoDevice as ExpoNativeDeviceModule | undefined;
  if (!moduloDevice || moduloDevice.isDevice !== true) {
    return false;
  }

  const tienePermisosNativos = Boolean(modulos.ExpoNotificationPermissionsModule);
  const tienePushTokenManager = Boolean(modulos.ExpoPushTokenManager);

  return tienePermisosNativos && tienePushTokenManager;
}

/**
 * Solicita permisos y obtiene el Expo Push Token de manera desacoplada y tolerante a fallos.
 * Carga únicamente los submódulos necesarios (`NotificationPermissions` y `getExpoPushTokenAsync`)
 * sin pasar por el índice global que exige `ExpoTopicSubscriptionModule`.
 */
export async function obtenerExpoPushTokenSeguro(): Promise<string | null> {
  if (!soportaPushNativoEnDispositivo()) {
    return null;
  }

  try {
    // Carga perezosa de submódulos específicos para evitar evaluar TopicSubscriptionModule.android.js
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const permisosMod = require('expo-notifications/build/NotificationPermissions') as ExpoNotificationsPermissionsModule;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const tokenMod = require('expo-notifications/build/getExpoPushTokenAsync') as ExpoNotificationsTokenModule;

    if (
      typeof permisosMod?.getPermissionsAsync !== 'function' ||
      typeof permisosMod?.requestPermissionsAsync !== 'function' ||
      typeof tokenMod?.getExpoPushTokenAsync !== 'function'
    ) {
      return null;
    }

    const permisoActual = await permisosMod.getPermissionsAsync();
    let estadoFinal = permisoActual?.status;

    if (estadoFinal !== 'granted') {
      const permisoSolicitado = await permisosMod.requestPermissionsAsync();
      estadoFinal = permisoSolicitado?.status;
    }

    if (estadoFinal !== 'granted') {
      return null;
    }

    const respuestaToken = await tokenMod.getExpoPushTokenAsync();
    return respuestaToken?.data ?? null;
  } catch {
    return null;
  }
}
