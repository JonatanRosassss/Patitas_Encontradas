import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Image, Alert, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Colors, Spacing, Typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';

export default function PerfilScreen() {
  const [fotoPerfil, setFotoPerfil] = useState<string>('https://via.placeholder.com/150');
  const [mostrarDatos, setMostrarDatos] = useState(false);

  const seleccionarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'No se puede acceder a la galería de fotos.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      const uriSeleccionada = resultado.assets[0].uri;
      setFotoPerfil(uriSeleccionada);
      Alert.alert('Foto seleccionada', 'Se ha seleccionado una nueva foto de perfil.');
    }
  };

  const cerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: fotoPerfil }}
            style={styles.avatar}
          />
          <Button
            title="Cambiar Foto de perfil"
            onPress={seleccionarFoto}
          />
        </View>

        <Pressable style={styles.boton} onPress={() => router.push('/ajustes')}>
          <Text style={styles.botontext}>AJUSTES</Text>
        </Pressable>

        <View style={styles.actionsSection}>
          <Button
            title="Mis Datos"
            variant="outline"
            onPress={() => setMostrarDatos(true)}
          />
          <Button
            title="Cerrar sesión"
            onPress={cerrarSesion}
          />
        </View>
      </ScrollView>

      {/* Modal con los datos del usuario */}
      <Modal visible={mostrarDatos} transparent={true} animationType="fade" onRequestClose={() => setMostrarDatos(false)}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>MIS DATOS</Text>

            <View style={styles.datosContainer}>
              <Text style={styles.datoLabel}>Nombre:</Text>
              <Text style={styles.datoValor}>Usuario Patitas</Text>

              <Text style={styles.datoLabel}>Email:</Text>
              <Text style={styles.datoValor}>usuario@email.com</Text>
            </View>

            <Pressable
              style={styles.botonCerrar}
              onPress={() => setMostrarDatos(false)}
            >
              <Text style={styles.botonCerrarTexto}>CERRAR</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between', 
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: Spacing.base,
    backgroundColor: Colors.borderLight,
  },
  actionsSection: {
    alignItems: 'stretch',
    width: '100%',
    gap: Spacing.two,
  },
  boton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  botontext: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
  },
  modalFondo: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContenido: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    marginBottom: 16,
  },
  datosContainer: {
    width: '100%',
    marginBottom: 12,
  },
  datoLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  datoValor: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  botonCerrar: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  botonCerrarTexto: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
  },
});

