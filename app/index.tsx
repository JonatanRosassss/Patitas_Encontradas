import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerAuth } from '@/services/ConexionFirebase';
import { Colors } from '@/constants/theme';
import WelcomeScreenView from '@/components/bienvenida/WelcomeScreenView';

export default function Index() {
  const router = useRouter();
  const [verificandoSesion, setVerificandoSesion] = useState<boolean>(true);

  useEffect(() => {
    const auth = obtenerAuth();

    const desuscribir = onAuthStateChanged(auth, async (usuario) => {
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
          return;
        }

        await AsyncStorage.removeItem('user_session');
        setVerificandoSesion(false);
      } catch {
        setVerificandoSesion(false);
      }
    });

    return () => desuscribir();
  }, [router]);

  const marcarBienvenidaVista = async () => {
    try {
      await AsyncStorage.setItem('bienvenida_vista', 'true');
    } catch {
      // Fallback silencioso
    }
  };

  const manejarComenzarAhora = async () => {
    await marcarBienvenidaVista();
    router.push('/(auth)/login');
  };

  const manejarExplorarComoInvitado = async () => {
    await marcarBienvenidaVista();
    router.replace('/(tabs)');
  };

  const manejarSaltar = async () => {
    await marcarBienvenidaVista();
    router.push('/(auth)/login');
  };

  if (verificandoSesion) {
    return (
      <View style={estilos.contenedorCarga}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <WelcomeScreenView
      alComenzarAhora={manejarComenzarAhora}
      alExplorarComoInvitado={manejarExplorarComoInvitado}
      alSaltar={manejarSaltar}
    />
  );
}

const estilos = StyleSheet.create({
  contenedorCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
  },
});
