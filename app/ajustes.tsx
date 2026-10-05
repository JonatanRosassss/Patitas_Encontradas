import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { Colors, Typography } from '../constants/theme';
import { router } from 'expo-router';

export default function AjustesScreen() {
  const [notificaciones, setNotificaciones] = useState(true);

  return (
    <ScrollView style={styles.container}>
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
        onPress={() => router.push('/reporte_error')}
      >
        <Text style={styles.opcionTexto}>Help / Ayuda</Text>
      </Pressable>

      {/* Redirección a login */}
      <Pressable style={styles.opcionBoton} onPress={() => router.push('/(auth)/login')}>
        <Text style={[styles.opcionTexto, { color: 'red' }]}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 20,
  },
  seccionTitulo: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    marginTop: 20,
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