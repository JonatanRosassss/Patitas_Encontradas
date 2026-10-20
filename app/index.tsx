
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerAuth } from '../services/ConexionFirebase';
import { Colors } from '../constants/theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const auth = obtenerAuth();

    const desuscribir = onAuthStateChanged(
      auth,
      async (usuario) => {
        try {
          if (usuario) {
            const token = await usuario.getIdToken();

            await AsyncStorage.setItem(
              'user_session',
              JSON.stringify({
                uid: usuario.uid,
                token,
                email: usuario.email,
              })
            );

            router.replace('/(tabs)');
          } else {
            await AsyncStorage.removeItem('user_session');
            router.replace('/(auth)/login');
          }
        } catch (error) {
          console.error(
            'Error al verificar la sesión:',
            error
          );

          router.replace('/(auth)/login');
        }
      }
    );

    return () => desuscribir();
  }, [router]);

  return (
    <View style={estilos.contenedor}>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
      />
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
