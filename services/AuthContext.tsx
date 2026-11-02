import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
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
  cambiarContrasenia: (contraseniaActual: string, nuevaContrasenia: string) => Promise<void>;
  enviarCorreoRestablecimiento: (email?: string) => Promise<void>;
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

  const cambiarContrasenia = async (
    contraseniaActual: string,
    nuevaContrasenia: string
  ): Promise<void> => {
    const usuarioActual = auth.currentUser ?? usuario;
    if (!usuarioActual) {
      throw new Error('No hay una sesión activa para cambiar la contraseña.');
    }
    if (!usuarioActual.email) {
      throw new Error('La cuenta no tiene un correo electrónico asociado para cambiar la contraseña.');
    }
    if (!contraseniaActual || !contraseniaActual.trim()) {
      throw new Error('Debes ingresar tu contraseña actual.');
    }
    if (!nuevaContrasenia || nuevaContrasenia.length < 6) {
      throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
    }
    if (contraseniaActual === nuevaContrasenia) {
      throw new Error('La nueva contraseña debe ser diferente a la contraseña actual.');
    }

    try {
      // 1. Re-autenticar con la contraseña actual
      const credencial = EmailAuthProvider.credential(usuarioActual.email, contraseniaActual);
      await reauthenticateWithCredential(usuarioActual, credencial);

      // 2. Actualizar la contraseña en Firebase Auth
      await updatePassword(usuarioActual, nuevaContrasenia);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error) {
        const codigo = (error as { code: string }).code;
        switch (codigo) {
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            throw new Error('La contraseña actual ingresada es incorrecta.');
          case 'auth/weak-password':
            throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
          case 'auth/requires-recent-login':
            throw new Error('Por seguridad, debes cerrar sesión y volver a ingresar antes de cambiar tu contraseña.');
          case 'auth/too-many-requests':
            throw new Error('Demasiados intentos fallidos. Por favor, intentá nuevamente más tarde.');
          case 'auth/network-request-failed':
            throw new Error('Error de conexión. Verificá tu acceso a internet.');
          default:
            break;
        }
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('No se pudo cambiar la contraseña. Verificá los datos e intentá de nuevo.');
    }
  };

  const enviarCorreoRestablecimiento = async (emailDestino?: string): Promise<void> => {
    const emailAUsar = emailDestino?.trim() || auth.currentUser?.email || usuario?.email;
    if (!emailAUsar) {
      throw new Error('No se encontró un correo electrónico válido para enviar el enlace.');
    }
    try {
      await sendPasswordResetEmail(auth, emailAUsar);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error) {
        const codigo = (error as { code: string }).code;
        switch (codigo) {
          case 'auth/user-not-found':
            throw new Error('No existe una cuenta registrada con este correo electrónico.');
          case 'auth/invalid-email':
            throw new Error('El correo electrónico no tiene un formato válido.');
          case 'auth/too-many-requests':
            throw new Error('Demasiadas solicitudes. Por favor, esperá unos minutos antes de reintentar.');
          case 'auth/network-request-failed':
            throw new Error('Error de conexión. Verificá tu acceso a internet.');
          default:
            break;
        }
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('No se pudo enviar el correo de recuperación.');
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
        cambiarContrasenia,
        enviarCorreoRestablecimiento,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
