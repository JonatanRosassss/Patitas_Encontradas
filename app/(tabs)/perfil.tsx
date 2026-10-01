import { router } from 'expo-router'; // importamos router para poder navegar entre pantallas
import React, { useState } from 'react';
import { View, Image, Alert, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Colors, Spacing } from '../../constants/theme';
import { Button } from '../../components/ui/Button';

export default function PerfilScreen() {
  const [fotoPerfil, setFotoPerfil] = useState<string>('https://via.placeholder.com/150');

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
      const uriSeleccionada = resultado.assets[0].uri; // obtenemos la uri de la foto seleccionada
      setFotoPerfil(uriSeleccionada);
      Alert.alert('Foto seleccionada', 'Se ha seleccionado una nueva foto de perfil.');
      //usamos alert.alert para mostrar la ventana emergente de confirmacion.
    }
  };

  // funcion para cerrar sesion con una alerta de confirmacion.
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
            // mandamos al usuario al login y reemplazamos la ruta
            // usamos replace para que no pueda volver a la pantalla de perfil con el boton de atras
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
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

      <View style={styles.actionsSection}>
        {/* agregamos un boton para cerrar sesion */}
        <Button
          title="Cerrar sesión"
          onPress={cerrarSesion}
        />
      </View>
    </ScrollView>
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
    alignItems: 'center',
    width: '100%',
  },
});
// usamos spacing para los margenes y paddings, tambien colors de themes.ts
// para que siga el mismo estilo que el resto de la app.
// agregamos un scrollview para que la pantalla sea scrollable.
// y el boton de cerrar sesion quede en la parte inferior de la pantalla.
// usamos router.replace para que el usuario no pueda volver a la pantalla de perfil despues de cerrar sesion.
