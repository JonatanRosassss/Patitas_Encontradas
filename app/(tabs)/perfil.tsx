import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';

//importamos el modulo nativo de expo para poder seleccionar imagenes de la galeria del dispositivo
import * as ImagePicker from 'expo-image-picker';

//1. Estado local para almacenar la URI (ruta local) de la foto seleccionada.
//usamos una imagen generica por defecto hasta que el usuario seleccione alguna.

export default function PerfilScreen() {
const [FotoPerfil, setFotoPerfil] = useState<string>( 'https://via.placeholder.com/150' );

//2. Funcion para pedirle permiso al celular para acceder a la galeria de fotos y seleccionar una imagen.
const seleccionarFoto = async () => {
  //pedimos permiso para acceder a la galeria de fotos del dispositivo
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

  //si el usuario deniega el permiso, mostramos una alerta y detenemos la funcion.
  if (!permiso.granted) {
    Alert.alert('Permiso denegado', 'No se puede acceder a la galería de fotos.');
    return;
  }

  //abrimos la galeria nativa del dispositivo para que el usuario seleccione una imagen. 
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'], //solo permitimos seleccionar imagenes
    allowsEditing: true, // habilita el recorte de la imagen seleccionada
    aspect: [1, 1], // mantiene la relacion de aspecto cuadrada.
    quality: 0.8, // reducimos la calidad de la imagen para que pese menos.
  });

  //si el usuario elige una foto y no cancelo la ventana:
  //guardamos el estado temporal de la URI de la foto seleccionada en el estado local.
  if (!resultado.canceled) {
    const uriSeleccionada = resultado.assets[0].uri;
    setFotoPerfil(uriSeleccionada);
    Alert.alert('Foto seleccionada', 'Se ha seleccionado una nueva foto de perfil.');
  }

};

  return (
      <ScrollView style={styles.scrollView}>
        {/* Sección principal del Avatar */}
        <View style={styles.avatarSection}>
          {/* Renderizado de la imagen con bordes redondeados */}
          <Image
            source={{ uri: FotoPerfil }}
            style={styles.avatar}
          />
          {/* Botón tactil para cambiar la foto */}
          <TouchableOpacity
            onPress={seleccionarFoto}
            style={styles.changePhotoButton}
            >
            <Text style={styles.changePhotoButtonText}>Cambiar Foto de perfil</Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 16,
    backgroundColor: '#E5E7EB',
  },
  changePhotoButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    elevation: 3,
  },
  changePhotoButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

//se reemplazo classname por style y se agregaron estilos para que la imagen tenga bordes redondeados y el boton tenga un fondo azul con texto blanco.
//lo uso momentaneamente para probar la funcionalidad de seleccion de imagenes desde la galeria del dispositivo.
