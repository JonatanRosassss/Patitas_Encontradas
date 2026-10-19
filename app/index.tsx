import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerAuth } from '../services/ConexionFirebase';
import { Colors } from '../constants/theme';

export default function Index() {
  const router = useRouter();
  const [comprobando, setComprobando] = useState(true);

  useEffect(() => {
    const auth = obtenerAuth();

    // 1. Escuchar el estado de autenticación de Firebase
    const desuscribir = onAuthStateChanged(auth, async (usuario) => {
      try {
        if (usuario) {
          // El usuario tiene sesión activa en Firebase: renovar/asegurar token en storage local
          const token = await usuario.getIdToken();
          await AsyncStorage.setItem(
            'user_session',
            JSON.stringify({
              uid: usuario.uid,
              token,
              email: usuario.email,
            })
          );

          // Redirigir a la app principal
          router.replace('/(tabs)');
        } else {
          // 2. Si Firebase no detecta usuario activo, verificar si quedó residuo local y limpiar
          await AsyncStorage.removeItem('user_session');
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        router.replace('/(auth)/login');
      } finally {
        setComprobando(false);
      }
    });

    return () => desuscribir();
  }, []);

  return (
    <View style={estilos.contenedor}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
  },
});