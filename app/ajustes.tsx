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
import { useAlertasStore } from '@/store/useAlertasStore';

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
      } catch {
        // Fallback silencioso a notificaciones activas por defecto
      }
    }
    void cargarPreferencia();
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
    } catch {
      // Revertir estado visual si falla la actualización
      setNotificaciones(!valor);
    }
  };

  const manejarCerrarSesion = () => {
    const ejecutarCierre = async () => {
      try {
        useAlertasStore.getState().limpiarStore();
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
    padding: Spacing.md,
  },
  botonVolver: {
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  textoBotonVolver: {
    fontSize: Typography.sizes.md,
    color: Colors.primary,
    fontFamily: Typography.fonts.bodySemiBold,
  },
  seccionTitulo: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  opcionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.base,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  opcionBoton: {
    backgroundColor: Colors.card,
    padding: Spacing.base,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  opcionTexto: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  botonCerrar: {
    backgroundColor: Colors.error,
    padding: Spacing.base,
    borderRadius: Radius.md,
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
  textoCerrar: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
  },
});
