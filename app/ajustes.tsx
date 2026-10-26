import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography } from '../constants/theme';
import { router } from 'expo-router';

export default function AjustesScreen() {
  const [notificaciones, setNotificaciones] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        {/* Botón de Atrás / Volver */}
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.textoBotonVolver}>←</Text>
        </Pressable>

        <Text style={styles.seccionTitulo}>Notificaciones</Text>
        <View style={styles.opcionRow}>
          <Text style={styles.opcionTexto}>Recibir alertas de mascotas</Text>
          {/* Switch sin lógica adicional por ahora */}
          <Switch 
            value={notificaciones} 
            onValueChange={setNotificaciones} 
            trackColor={{ true: Colors.primary }}
          />
        </View>

        <Text style={styles.seccionTitulo}>Cuenta</Text>
        <Pressable style={styles.opcionBoton} onPress={() => {/* cambiar contraseña, sin función por ahora */}}>
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

        {/* Redirección a login */}
        <Pressable style={styles.opcionBoton} onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.opcionTexto, { color: Colors.error }]}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
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
    paddingHorizontal: 20,
  },
  botonVolver: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 15, // Ajustado con margen más holgado
    marginBottom: 10,
    shadowColor: '#000',
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
    marginTop: 15,
    marginBottom: 10,
  },
  opcionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  opcionBoton: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  opcionTexto: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
  },
});