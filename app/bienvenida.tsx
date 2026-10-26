import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreenView from '@/components/bienvenida/WelcomeScreenView';

export default function BienvenidaScreen() {
  const router = useRouter();

  const marcarBienvenidaVista = async () => {
    try {
      await AsyncStorage.setItem('bienvenida_vista', 'true');
    } catch {
      // Fallback silencioso en almacenamiento local
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

  return (
    <WelcomeScreenView
      alComenzarAhora={manejarComenzarAhora}
      alExplorarComoInvitado={manejarExplorarComoInvitado}
      alSaltar={manejarSaltar}
    />
  );
}
