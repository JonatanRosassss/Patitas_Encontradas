import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerAuth } from '../services/ConexionFirebase';

interface Session{
  uid: string,
  email: string | null,
  token: string;
}

interface AuthContextType {
  usuario: User | null,
  sesionLocal: Session | null,
  cargando: boolean,
  cerrarSesion: () => Promise<void>;
  recargarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [sesionLocal, setSesionLocal] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);

  const auth = obtenerAuth();

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUsuario(firebaseUser);
          const token = await firebaseUser.getIdToken();
          const datos = { uid: firebaseUser.uid, email: firebaseUser.email, token };
          await AsyncStorage.setItem('user_session', JSON.stringify(datos));
          setSesionLocal(datos);
        } else {
          setUsuario(null);
          setSesionLocal(null);
          await AsyncStorage.removeItem('user_session');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    });

    return () => desuscribir();
  }, []);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('user_session');
      setUsuario(null);
      setSesionLocal(null);

    }
    catch(e)
    {
      console.error(e);
    }
  }

  const recargarSesion = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUsuario({ ...auth.currentUser })
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, sesionLocal, cargando, cerrarSesion, recargarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
