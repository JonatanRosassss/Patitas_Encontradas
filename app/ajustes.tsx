import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Typography, Radius } from '../constants/theme';
import { useAuth } from '@/services/AuthContext';
import { CambiarContraseniaModal } from '@/components/ajustes/CambiarContraseniaModal';

export default function AjustesScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const [notificaciones, setNotificaciones] = useState<boolean>(true);
  const [mostrarModalContrasenia, setMostrarModalContrasenia] = useState<boolean>(false);

  const manejarCerrarSesion = () => {
    const ejecutarCierre = async () => {
      try {
        await cerrarSesion();
        router.replace('/(auth)/login');
      } catch {
        router.replace('/(auth)/login');
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('¿Estás seguro de que querés cerrar sesión?')) {
        void ejecutarCierre();
      }
      return;
    }

    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => void ejecutarCierre(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        {/* Botón de Atrás / Volver */}
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.textoBotonVolver}>← Volver</Text>
        </Pressable>

        <Text style={styles.seccionTitulo}>Notificaciones</Text>
        <View style={styles.opcionRow}>
          <Text style={styles.opcionTexto}>Recibir alertas de mascotas</Text>
          <Switch 
            value={notificaciones} 
            onValueChange={setNotificaciones} 
            trackColor={{ true: Colors.primary }}
          />
        </View>

        <Text style={styles.seccionTitulo}>Cuenta</Text>
        <Pressable 
          style={styles.opcionBoton} 
          onPress={() => setMostrarModalContrasenia(true)}
        >
          <Text style={styles.opcionTexto}>Cambiar contraseña</Text>
        </Pressable>

        <Text style={styles.seccionTitulo}>Soporte</Text>
        <Pressable 
          style={styles.opcionBoton} 
          onPress={() => router.push('/reporte_error?tab=FAQS')}
        >
          <Text style={styles.opcionTexto}>Centro de Ayuda y Preguntas Frecuentes</Text>
        </Pressable>
        <Pressable 
          style={styles.opcionBoton} 
          onPress={() => router.push('/reporte_error?tab=TICKET')}
        >
          <Text style={styles.opcionTexto}>Generar Ticket de Soporte / Error</Text>
        </Pressable>

        {/* Cierre de sesión persistente */}
        <Pressable style={styles.opcionBoton} onPress={manejarCerrarSesion}>
          <Text style={[styles.opcionTexto, { color: Colors.error }]}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>

      {/* Modal interactivo de cambio de contraseña */}
      <CambiarContraseniaModal
        visible={mostrarModalContrasenia}
        alCerrar={() => setMostrarModalContrasenia(false)}
        emailUsuario={usuario?.email}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.lg,
  },
  botonVolver: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textoBotonVolver: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.primary,
  },
  seccionTitulo: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  opcionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  opcionBoton: {
    backgroundColor: Colors.white,
    padding: Spacing.base,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  opcionTexto: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },
});