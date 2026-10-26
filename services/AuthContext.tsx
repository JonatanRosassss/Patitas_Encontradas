import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  obtenerAuth,
  obtenerFirestore,
  obtenerStorage,
} from '../services/ConexionFirebase';
import type { Usuario } from '@/types/User';

export interface Session {
  uid: string;
  email: string | null;
  token: string;
}

export interface ActualizarPerfilPayload {
  nombre: string;
  telefono?: string;
}

export interface AuthContextType {
  usuario: User | null;
  perfilUsuario: Usuario | null;
  sesionLocal: Session | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
  recargarSesion: () => Promise<void>;
  actualizarFotoPerfil: (uriLocal: string, base64Data?: string | null) => Promise<string>;
  actualizarDatosPerfil: (datos: ActualizarPerfilPayload) => Promise<void>;
}

const COLECCION_USUARIOS = 'usuarios';
const PREFIJO_CACHE_PERFIL = 'perfil_usuario_';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function derivarNombreDesdeEmail(email?: string | null): string {
  if (!email || !email.includes('@')) {
    return 'Vecino Patitas';
  }
  const parteLocal = email.split('@')[0] ?? '';
  const limpio = parteLocal.replace(/[._-]+/g, ' ').trim();
  if (!limpio) {
    return 'Vecino Patitas';
  }
  return limpio
    .split(' ')
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(' ');
}

function normalizarFechaCreacion(fechaRaw: unknown, fallback?: string): string {
  if (!fechaRaw) {
    return fallback ?? new Date().toISOString();
  }
  if (fechaRaw instanceof Timestamp) {
    return fechaRaw.toDate().toLocaleDateString();
  }
  if (
    typeof fechaRaw === 'object' &&
    fechaRaw !== null &&
    'toDate' in fechaRaw &&
    typeof (fechaRaw as { toDate: () => Date }).toDate === 'function'
  ) {
    return (fechaRaw as { toDate: () => Date }).toDate().toLocaleDateString();
  }
  if (typeof fechaRaw === 'string' || typeof fechaRaw === 'number') {
    const fecha = new Date(fechaRaw);
    if (!Number.isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString();
    }
    return String(fechaRaw);
  }
  return fallback ?? new Date().toLocaleDateString();
}

async function blobADataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('No se pudo serializar la imagen de perfil'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [perfilUsuario, setPerfilUsuario] = useState<Usuario | null>(null);
  const [sesionLocal, setSesionLocal] = useState<Session | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  const auth = obtenerAuth();
  const db = obtenerFirestore();
  const storage = obtenerStorage();

  const sincronizarPerfilUsuario = useCallback(
    async (firebaseUser: User): Promise<Usuario> => {
      const claveCache = `${PREFIJO_CACHE_PERFIL}${firebaseUser.uid}`;
      let perfilCacheado: Partial<Usuario> | null = null;

      try {
        const rawCache = await AsyncStorage.getItem(claveCache);
        if (rawCache) {
          perfilCacheado = JSON.parse(rawCache) as Partial<Usuario>;
        }
      } catch {
        // Ignorar fallo de lectura en caché local
      }

      let datosFirestore: Record<string, unknown> | null = null;
      try {
        const docSnap = await getDoc(doc(db, COLECCION_USUARIOS, firebaseUser.uid));
        if (docSnap.exists()) {
          datosFirestore = docSnap.data() as Record<string, unknown>;
        }
      } catch {
        // Continuar con datos de Auth y caché local si Firestore no responde
      }

      const nombreFirestore =
        typeof datosFirestore?.nombre === 'string' ? datosFirestore.nombre.trim() : '';
      const nombreAuth = firebaseUser.displayName?.trim() ?? '';
      const nombreCache =
        typeof perfilCacheado?.nombre === 'string' &&
        perfilCacheado.nombre !== 'Usuario Patitas'
          ? perfilCacheado.nombre.trim()
          : '';

      const nombreResuelto =
        nombreFirestore ||
        nombreAuth ||
        nombreCache ||
        derivarNombreDesdeEmail(firebaseUser.email);

      const avatarFirestore =
        typeof datosFirestore?.avatarUrl === 'string' && datosFirestore.avatarUrl.trim()
          ? datosFirestore.avatarUrl.trim()
          : typeof datosFirestore?.fotoPerfil === 'string' &&
              datosFirestore.fotoPerfil.trim()
            ? datosFirestore.fotoPerfil.trim()
            : '';

      const avatarCache =
        typeof perfilCacheado?.avatarUrl === 'string' && perfilCacheado.avatarUrl.trim()
          ? perfilCacheado.avatarUrl.trim()
          : '';

      const avatarAuth = firebaseUser.photoURL?.trim() ?? '';
      const avatarResuelto = avatarFirestore || avatarCache || avatarAuth || undefined;

      const telefonoFirestore =
        typeof datosFirestore?.telefono === 'string' && datosFirestore.telefono.trim()
          ? datosFirestore.telefono.trim()
          : undefined;

      const telefonoResuelto = telefonoFirestore || perfilCacheado?.telefono || undefined;

      const emailResuelto =
        firebaseUser.email ||
        (typeof datosFirestore?.correo === 'string' ? datosFirestore.correo : '') ||
        (typeof datosFirestore?.email === 'string' ? datosFirestore.email : '') ||
        perfilCacheado?.email ||
        '';

      const fechaCreacionResuelta = normalizarFechaCreacion(
        datosFirestore?.fechaRegistro ?? datosFirestore?.fechaCreacion,
        firebaseUser.metadata?.creationTime
          ? normalizarFechaCreacion(firebaseUser.metadata.creationTime)
          : undefined
      );

      // Si Firebase Auth no tenía displayName pero Firestore o caché sí, sincronizar Auth
      if (!nombreAuth && nombreResuelto) {
        try {
          await updateProfile(firebaseUser, { displayName: nombreResuelto });
        } catch {
          // No bloquear si falla sincronización secundaria
        }
      }

      const perfilConsolidado: Usuario = {
        id: firebaseUser.uid,
        nombre: nombreResuelto,
        email: emailResuelto,
        ...(telefonoResuelto ? { telefono: telefonoResuelto } : {}),
        ...(avatarResuelto ? { avatarUrl: avatarResuelto } : {}),
        fechaCreacion: fechaCreacionResuelta,
      };

      setPerfilUsuario(perfilConsolidado);

      try {
        await AsyncStorage.setItem(claveCache, JSON.stringify(perfilConsolidado));
      } catch {
        // Fallback silencioso
      }

      return perfilConsolidado;
    },
    [db]
  );

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUsuario(firebaseUser);
          const token = await firebaseUser.getIdToken();
          const datos: Session = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            token,
          };
          await AsyncStorage.setItem('user_session', JSON.stringify(datos));
          setSesionLocal(datos);
          await sincronizarPerfilUsuario(firebaseUser);
        } else {
          setUsuario(null);
          setPerfilUsuario(null);
          setSesionLocal(null);
          await AsyncStorage.removeItem('user_session');
        }
      } catch {
        // Fallback silencioso en verificación inicial
      } finally {
        setCargando(false);
      }
    });

    return () => desuscribir();
  }, [auth, sincronizarPerfilUsuario]);

  const actualizarFotoPerfil = async (
    uriLocal: string,
    base64Data?: string | null
  ): Promise<string> => {
    const usuarioActual = auth.currentUser ?? usuario;
    const dataUrlDirecto =
      base64Data && base64Data.length > 0
        ? `data:image/jpeg;base64,${base64Data}`
        : uriLocal.startsWith('data:image/')
          ? uriLocal
          : null;

    if (!usuarioActual) {
      return dataUrlDirecto ?? uriLocal;
    }

    const uid = usuarioActual.uid;
    const claveCache = `${PREFIJO_CACHE_PERFIL}${uid}`;

    // 1. Intentar obtener versión serializable (Storage o DataURL base64)
    let urlPersistente: string = dataUrlDirecto ?? uriLocal;

    try {
      const respuesta = await fetch(uriLocal);
      const blob = await respuesta.blob();

      if (!dataUrlDirecto && blob.size < 900 * 1024) {
        try {
          urlPersistente = await blobADataUrl(blob);
        } catch {
          // Conservar uriLocal si FileReader no está disponible
        }
      }

      // Intentar subir a Firebase Storage para obtener URL pública corta
      try {
        const rutaStorage = `mascotas/perfiles_${uid}_${Date.now()}.jpg`;
        const referencia = ref(storage, rutaStorage);
        await uploadBytes(referencia, blob);
        const downloadUrl = await getDownloadURL(referencia);
        if (downloadUrl) {
          urlPersistente = downloadUrl;
        }
      } catch {
        // Si Storage falla por reglas o red, se conserva urlPersistente (Data URL base64)
      }
    } catch {
      // Si fetch(uriLocal) falla en entorno nativo específico, usar dataUrlDirecto
    }

    // 2. Actualizar estado en memoria y AsyncStorage de inmediato
    const perfilActualizado: Usuario = {
      id: uid,
      nombre:
        perfilUsuario?.nombre ||
        usuarioActual.displayName ||
        derivarNombreDesdeEmail(usuarioActual.email),
      email: perfilUsuario?.email || usuarioActual.email || '',
      ...(perfilUsuario?.telefono ? { telefono: perfilUsuario.telefono } : {}),
      avatarUrl: urlPersistente,
      fechaCreacion:
        perfilUsuario?.fechaCreacion ||
        normalizarFechaCreacion(usuarioActual.metadata?.creationTime),
    };

    setPerfilUsuario(perfilActualizado);

    try {
      await AsyncStorage.setItem(claveCache, JSON.stringify(perfilActualizado));
    } catch {
      // Continuar
    }

    // 3. Persistir en la colección 'usuarios' de Firestore (con merge para crear o actualizar)
    try {
      await setDoc(
        doc(db, COLECCION_USUARIOS, uid),
        {
          uid,
          nombre: perfilActualizado.nombre,
          correo: perfilActualizado.email,
          ...(perfilActualizado.telefono ? { telefono: perfilActualizado.telefono } : {}),
          avatarUrl: urlPersistente,
          actualizadoEn: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch {
      // Si Firestore está offline o restringido, AsyncStorage mantiene la foto persistida
    }

    // 4. Si es una URL HTTP/HTTPS corta, sincronizar también con Firebase Auth photoURL
    if (urlPersistente.startsWith('http') && urlPersistente.length < 2000) {
      try {
        await updateProfile(usuarioActual, { photoURL: urlPersistente });
        setUsuario({ ...usuarioActual, photoURL: urlPersistente } as User);
      } catch {
        // Ignorar límite de longitud en Auth
      }
    }

    return urlPersistente;
  };

  const actualizarDatosPerfil = async (datos: ActualizarPerfilPayload): Promise<void> => {
    const usuarioActual = auth.currentUser ?? usuario;
    if (!usuarioActual) {
      return;
    }

    const uid = usuarioActual.uid;
    const claveCache = `${PREFIJO_CACHE_PERFIL}${uid}`;
    const nombreLimpio = datos.nombre.trim() || derivarNombreDesdeEmail(usuarioActual.email);
    const telefonoLimpio = datos.telefono?.trim();

    const nuevoPerfil: Usuario = {
      id: uid,
      nombre: nombreLimpio,
      email: perfilUsuario?.email || usuarioActual.email || '',
      ...(telefonoLimpio ? { telefono: telefonoLimpio } : {}),
      ...(perfilUsuario?.avatarUrl ? { avatarUrl: perfilUsuario.avatarUrl } : {}),
      fechaCreacion:
        perfilUsuario?.fechaCreacion ||
        normalizarFechaCreacion(usuarioActual.metadata?.creationTime),
    };

    setPerfilUsuario(nuevoPerfil);

    try {
      await AsyncStorage.setItem(claveCache, JSON.stringify(nuevoPerfil));
    } catch {
      // Continuar
    }

    try {
      await updateProfile(usuarioActual, { displayName: nombreLimpio });
      setUsuario({ ...usuarioActual, displayName: nombreLimpio } as User);
    } catch {
      // Continuar
    }

    try {
      await setDoc(
        doc(db, COLECCION_USUARIOS, uid),
        {
          uid,
          nombre: nombreLimpio,
          correo: nuevoPerfil.email,
          ...(telefonoLimpio ? { telefono: telefonoLimpio } : {}),
          ...(nuevoPerfil.avatarUrl ? { avatarUrl: nuevoPerfil.avatarUrl } : {}),
          actualizadoEn: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch {
      // Resiliente ante desconexión
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user_session');
      setUsuario(null);
      setPerfilUsuario(null);
      setSesionLocal(null);
    } catch {
      // Silencioso en producción
    }
  };

  const recargarSesion = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUsuario({ ...auth.currentUser } as User);
      await sincronizarPerfilUsuario(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        perfilUsuario,
        sesionLocal,
        cargando,
        cerrarSesion,
        recargarSesion,
        actualizarFotoPerfil,
        actualizarDatosPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
