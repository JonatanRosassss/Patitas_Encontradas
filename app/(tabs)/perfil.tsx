import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Image, Alert, ScrollView, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Colors, Spacing, Typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Usuario } from '../../types/User';
import { Pet } from '../../types/Pet';
import { useAuth } from '@/services/AuthContext';
import { listarAlertasPorUsuario, eliminarAlertaMascota } from '@/services/mascotasService';

export default function PerfilScreen() {
  const { usuario, cerrarSesion: cerrarSesionAuth } = useAuth();
  const [fotoPerfil, setFotoPerfil] = useState<string>('https://via.placeholder.com/150');
  const [mostrarDatos, setMostrarDatos] = useState(false);
  const [misPublicaciones, setMisPublicaciones] = useState<Pet[]>([]);
  const [cargandoPublicaciones, setCargandoPublicaciones] = useState<boolean>(true);

  // Cargar publicaciones reales del usuario desde Firestore
  const cargarMisPublicaciones = async () => {
    if (!usuario?.uid) {
      setCargandoPublicaciones(false);
      return;
    }
    try {
      setCargandoPublicaciones(true);
      const publicaciones = await listarAlertasPorUsuario(usuario.uid);
      setMisPublicaciones(publicaciones);
    } catch (error) {
      console.error('Error al cargar mis publicaciones:', error);
    } finally {
      setCargandoPublicaciones(false);
    }
  };

  useEffect(() => {
    cargarMisPublicaciones();
  }, [usuario]);

  // Manejo de eliminación de publicaciones
  const confirmarEliminacion = (idAlerta: string, nombreMascota?: string) => {
    Alert.alert(
      'Eliminar publicación',
      `¿Estás seguro de que querés eliminar la publicación de "${nombreMascota || 'Mascota'}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarAlertaMascota(idAlerta);
              Alert.alert('Éxito', 'La publicación fue eliminada correctamente.');
              cargarMisPublicaciones(); // Recargar la lista
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la publicación.');
            }
          },
        },
      ]
    );
  };

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

  const manejarCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await cerrarSesionAuth();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const formatearEtiqueta = (clave: string) => {
    const texto = clave.replace(/([A-Z])/g, ' $1');
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const datosUsuario: Partial<Usuario> = {
    nombre: usuario?.displayName || 'Usuario Patitas',
    email: usuario?.email || 'Sin correo registrado',
    fechaCreacion: usuario?.metadata.creationTime || 'No especificada',
  };

  return (
    <>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabecera / Perfil */}
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: usuario?.photoURL || fotoPerfil }}
            style={styles.avatar}
          />
          <Text style={styles.nombreUsuario}>{usuario?.displayName || 'Usuario Patitas'}</Text>
          <Button
            title="Cambiar Foto de perfil"
            onPress={seleccionarFoto}
          />
        </View>

        {/* Sección: Mis Publicaciones */}
        <View style={styles.seccionContenedor}>
          <Text style={styles.tituloSeccion}>MIS PUBLICACIONES</Text>

          {cargandoPublicaciones ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 12 }} />
          ) : misPublicaciones.length === 0 ? (
            <Text style={styles.textoVacio}>Aún no has creado publicaciones.</Text>
          ) : (
            misPublicaciones.map((pet) => (
              <View key={pet.id} style={styles.tarjetaMascota}>
                <Image
                  source={{
                    uri: pet.fotos && pet.fotos.length > 0 ? pet.fotos[0] : 'https://via.placeholder.com/80',
                  }}
                  style={styles.imagenMascota}
                />
                <View style={styles.infoMascota}>
                  <Text style={styles.nombreMascota}>{pet.nombre || 'Sin Nombre'}</Text>
                  <Text style={styles.estadoMascota}>Estado: {pet.estado}</Text>
                  <Text style={styles.descripcionMascota} numberOfLines={1}>
                    {pet.descripcion || 'Sin descripción'}
                  </Text>
                </View>

                {/* Botón de Eliminar Publicación */}
                <Pressable
                  style={styles.botonEliminar}
                  onPress={() => confirmarEliminacion(pet.id, pet.nombre)}
                >
                  <Text style={styles.textoBotonEliminar}>Eliminar</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        {/* Acciones del Perfil */}
        <View style={styles.actionsSection}>
          <Pressable style={styles.boton} onPress={() => router.push('/ajustes')}>
            <Text style={styles.botontext}>AJUSTES</Text>
          </Pressable>

          <Button
            title="Mis Datos"
            variant="outline"
            onPress={() => setMostrarDatos(true)}
          />
          <Button
            title="Cerrar sesión"
            onPress={manejarCerrarSesion}
          />
        </View>
      </ScrollView>

      {/* Modal con los datos del usuario */}
      <Modal visible={mostrarDatos} transparent={true} animationType="fade" onRequestClose={() => setMostrarDatos(false)}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>MIS DATOS</Text>

            <View style={styles.datosContainer}>
              {Object.entries(datosUsuario).map(([clave, valor]) => (
                <View key={clave} style={styles.datoItem}>
                  <Text style={styles.datoLabel}>{formatearEtiqueta(clave)}:</Text>
                  <Text style={styles.datoValor}>
                    {valor !== undefined && valor !== null ? String(valor) : 'No especificado'}
                  </Text>
                </View>
              ))}
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
    padding: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.borderLight,
  },
  nombreUsuario: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  seccionContenedor: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  tituloSeccion: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    marginBottom: Spacing.base,
  },
  textoVacio: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  tarjetaMascota: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imagenMascota: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  infoMascota: {
    flex: 1,
  },
  nombreMascota: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },
  estadoMascota: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.primary,
  },
  descripcionMascota: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },
  botonEliminar: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  textoBotonEliminar: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
  },
  actionsSection: {
    alignItems: 'stretch',
    width: '100%',
    gap: Spacing.two,
    marginTop: Spacing.base,
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
  datoItem: {
    marginBottom: 8,
  },
});
