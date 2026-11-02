import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { Colors, Spacing, Typography, Radius } from '../constants/theme';
import { useAuth } from '@/services/AuthContext';
import { db } from '@/services/firebase';
import { registrarPushToken } from '@/services/notificaciones';
import { CambiarContraseniaModal } from '@/components/ajustes/CambiarContraseniaModal';

export default function AjustesScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const [notificaciones, setNotificaciones] = useState<boolean>(true);
  const [mostrarModalContrasenia, setMostrarModalContrasenia] = useState<boolean>(false);

  // 1. Cargar preferencia de notificaciones del usuario desde Firestore
  useEffect(() => {
    async function cargarPreferencia() {
      if (!usuario?.uid) return;
      try {
        const docRef = doc(db, 'usuarios', usuario.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const datos = docSnap.data();
          setNotificaciones(datos.notificacionesActivas ?? true);
        }
      } catch (error) {
        console.error('Error al cargar preferencias:', error);
      }
    }
    cargarPreferencia();
  }, [usuario?.uid]);

  // 2. Manejar el cambio del Switch de notificaciones
  const cambiarNotificaciones = async (valor: boolean) => {
    setNotificaciones(valor);
    if (!usuario?.uid) return;

    try {
      if (valor) {
        // Activar: Obtener token y guardar en Firestore
        const token = await registrarPushToken(usuario.uid);
        await updateDoc(doc(db, 'usuarios', usuario.uid), {
          notificacionesActivas: true,
          pushToken: token,
        });
      } else {
        // Desactivar: Limpiar token en Firestore
        await updateDoc(doc(db, 'usuarios', usuario.uid), {
          notificacionesActivas: false,
          pushToken: null,
        });
      }
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
    }
  };

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
            onValueChange={cambiarNotificaciones} 
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
          <Text style={styles.opcionTexto}>Soporte y ayuda</Text>
        </Pressable>

        {/* Botón para Cerrar Sesión */}
        <Pressable style={styles.botonCerrar} onPress={manejarCerrarSesion}>
          <Text style={styles.textoCerrar}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>

      {/* Modal para cambiar contraseña */}
      <CambiarContraseniaModal 
        visible={mostrarModalContrasenia}
        onClose={() => setMostrarModalContrasenia(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
    padding: Spacing.md || 16,
  },
  botonVolver: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  textoBotonVolver: {
    fontSize: 16,
    color: Colors.primary || '#FF8A00',
    fontWeight: '600',
  },
  seccionTitulo: {
    fontSize: Typography.subtitle?.fontSize || 14,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  opcionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: Radius.md || 10,
  },
  opcionBoton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: Radius.md || 10,
    marginBottom: 8,
  },
  opcionTexto: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  botonCerrar: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: Radius.md || 10,
    marginTop: 32,
    alignItems: 'center',
  },
  textoCerrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
