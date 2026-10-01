import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  // @ts-ignore: React Native persistence is resolved at runtime by Metro
  getReactNativePersistence,
  Auth,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clase Orquestadora de la Conexión con Firebase.
 * Implementa el patrón Singleton para garantizar una única conexión viva
 * compartida en toda la aplicación, desacoplando los servicios de la infraestructura.
 */
export class ConexionFirebase {
  private static instancia: ConexionFirebase | null = null;
  private readonly app: FirebaseApp;
  private readonly auth: Auth;
  private readonly db: Firestore;
  private readonly storage: FirebaseStorage;

  private constructor() {
    const configuracion = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    };

    // Inicializar o reutilizar la instancia de FirebaseApp
    this.app =
      getApps().length === 0
        ? initializeApp(configuracion)
        : getApp();

    // Inicializar Auth con persistencia nativa en AsyncStorage
    try {
      this.auth = initializeAuth(this.app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      this.auth = getAuth(this.app);
    }

    // Inicializar Cloud Firestore
    this.db = getFirestore(this.app);

    // Inicializar Firebase Storage
    this.storage = getStorage(this.app);
  }

  /**
   * Obtiene la instancia única de la conexión (Singleton).
   */
  public static obtenerInstancia(): ConexionFirebase {
    if (!ConexionFirebase.instancia) {
      ConexionFirebase.instancia = new ConexionFirebase();
    }
    return ConexionFirebase.instancia;
  }

  /**
   * Alias en español amigable para que el equipo conecte directamente:
   * const conexion = ConexionFirebase.obtenerConexion();
   */
  public static obtenerConexion(): ConexionFirebase {
    return ConexionFirebase.obtenerInstancia();
  }

  /**
   * Acceso directo a la base de datos Firestore sin configurar nada:
   * const db = ConexionFirebase.obtenerFirestore();
   */
  public static obtenerFirestore(): Firestore {
    return ConexionFirebase.obtenerInstancia().db;
  }

  /**
   * Acceso directo a Firebase Auth:
   * const auth = ConexionFirebase.obtenerAuth();
   */
  public static obtenerAuth(): Auth {
    return ConexionFirebase.obtenerInstancia().auth;
  }

  /**
   * Acceso directo a Firebase Storage (para fotos/imágenes):
   * const storage = ConexionFirebase.obtenerStorage();
   */
  public static obtenerStorage(): FirebaseStorage {
    return ConexionFirebase.obtenerInstancia().storage;
  }

  /**
   * Getters de instancia
   */
  public get firestore(): Firestore {
    return this.db;
  }

  public get autenticacion(): Auth {
    return this.auth;
  }

  public get almacenamiento(): FirebaseStorage {
    return this.storage;
  }

  public get aplicacion(): FirebaseApp {
    return this.app;
  }

  /**
   * Verifica si las variables de entorno están configuradas.
   */
  public verificarVariables(): { configurado: boolean; faltantes: string[] } {
    const obligatorias = [
      'EXPO_PUBLIC_FIREBASE_API_KEY',
      'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
      'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    ];
    const faltantes = obligatorias.filter((variable) => !process.env[variable]);

    return {
      configurado: faltantes.length === 0,
      faltantes,
    };
  }
}

/**
 * Función atajo directa para los desarrolladores:
 * import { obtenerConexion } from '@/services/ConexionFirebase';
 * const conexion = obtenerConexion();
 */
export const obtenerConexion = (): ConexionFirebase => ConexionFirebase.obtenerConexion();
export const obtenerFirestore = (): Firestore => ConexionFirebase.obtenerFirestore();
export const obtenerAuth = (): Auth => ConexionFirebase.obtenerAuth();
export const obtenerStorage = (): FirebaseStorage => ConexionFirebase.obtenerStorage();

