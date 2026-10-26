import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Usuario } from '../../types/User';
import { Pet } from '../../types/Pet';
import { useAuth } from '@/services/AuthContext';
import { listarAlertasPorUsuario, eliminarAlertaMascota } from '@/services/mascotasService';
import { obtenerImagenPrincipal } from '@/utils/detalleMascota';

export default function PerfilScreen() {
  const {
    usuario,
    perfilUsuario,
    cerrarSesion: cerrarSesionAuth,
    actualizarFotoPerfil,
    actualizarDatosPerfil,
  } = useAuth();

  const [fotoLocalTemporal, setFotoLocalTemporal] = useState<string | null>(null);
  const [guardandoFoto, setGuardandoFoto] = useState<boolean>(false);
  const [mostrarDatos, setMostrarDatos] = useState<boolean>(false);
  const [editandoDatos, setEditandoDatos] = useState<boolean>(false);
  const [nombreEditable, setNombreEditable] = useState<string>('');
  const [telefonoEditable, setTelefonoEditable] = useState<string>('');
  const [guardandoDatos, setGuardandoDatos] = useState<boolean>(false);

  const [misPublicaciones, setMisPublicaciones] = useState<Pet[]>([]);
  const [cargandoPublicaciones, setCargandoPublicaciones] = useState<boolean>(true);

  const notificar = (titulo: string, mensaje: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  // Sincronizar campos editables cuando cambia el perfil cargado
  useEffect(() => {
    const nombreBase =
      perfilUsuario?.nombre ||
      usuario?.displayName ||
      (usuario?.email ? usuario.email.split('@')[0] : '');
    setNombreEditable(nombreBase);
    setTelefonoEditable(perfilUsuario?.telefono ?? '');
  }, [perfilUsuario, usuario]);

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
    } catch {
      setMisPublicaciones([]);
    } finally {
      setCargandoPublicaciones(false);
    }
  };

  useEffect(() => {
    cargarMisPublicaciones();
  }, [usuario]);

  // Manejo de eliminación de publicaciones con soporte completo para Web y Native
  const confirmarEliminacion = (idAlerta: string, nombreMascota?: string) => {
    const nombre = nombreMascota || 'Mascota';
    const mensaje = `¿Estás seguro de que querés eliminar la publicación de "${nombre}"?`;

    const ejecutarEliminacion = async () => {
      try {
        await eliminarAlertaMascota(idAlerta);
        setMisPublicaciones((prev) => prev.filter((p) => p.id !== idAlerta));
        if (Platform.OS === 'web') {
          window.alert('La publicación fue eliminada correctamente.');
        } else {
          Alert.alert('Éxito', 'La publicación fue eliminada correctamente.');
        }
        cargarMisPublicaciones();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'No se pudo eliminar la publicación.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Error', msg);
        }
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(mensaje)) {
        ejecutarEliminacion();
      }
      return;
    }

    Alert.alert(
      'Eliminar publicación',
      mensaje,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: ejecutarEliminacion,
        },
      ]
    );
  };

  const seleccionarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permiso.granted) {
      notificar('Permiso denegado', 'No se puede acceder a la galería de fotos.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.35,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const activo = resultado.assets[0];
      setFotoLocalTemporal(activo.uri);
      setGuardandoFoto(true);

      try {
        const urlPersistida = await actualizarFotoPerfil(activo.uri, activo.base64);
        setFotoLocalTemporal(urlPersistida);
        notificar('Foto actualizada', 'Tu foto de perfil se ha guardado correctamente.');
      } catch {
        notificar('Atención', 'La foto se aplicó localmente, pero hubo una demora al sincronizar.');
      } finally {
        setGuardandoFoto(false);
      }
    }
  };

  const manejarGuardarDatosPerfil = async () => {
    if (!nombreEditable.trim()) {
      notificar('Atención', 'El nombre no puede quedar vacío.');
      return;
    }
    try {
      setGuardandoDatos(true);
      await actualizarDatosPerfil({
        nombre: nombreEditable.trim(),
        telefono: telefonoEditable.trim(),
      });
      setEditandoDatos(false);
      notificar('Perfil actualizado', 'Tus datos personales fueron guardados.');
    } catch {
      notificar('Error', 'No se pudieron actualizar los datos.');
    } finally {
      setGuardandoDatos(false);
    }
  };

  const manejarCerrarSesion = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Estás seguro de que querés cerrar sesión?')) {
        cerrarSesionAuth().then(() => router.replace('/(auth)/login'));
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

  const nombreMostrado =
    perfilUsuario?.nombre ||
    usuario?.displayName ||
    (usuario?.email ? usuario.email.split('@')[0] : 'Vecino Patitas');

  const uriAvatarActual =
    fotoLocalTemporal || perfilUsuario?.avatarUrl || usuario?.photoURL || null;

  const datosUsuario: Partial<Usuario> = {
    nombre: nombreMostrado,
    email: perfilUsuario?.email || usuario?.email || 'Sin correo registrado',
    ...(perfilUsuario?.telefono ? { telefono: perfilUsuario.telefono } : {}),
    fechaCreacion:
      perfilUsuario?.fechaCreacion || usuario?.metadata.creationTime || 'No especificada',
  };

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabecera / Perfil */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContenedor}>
            <Image
              source={
                uriAvatarActual
                  ? { uri: uriAvatarActual }
                  : require('../../assets/welcome_dog_badge.png')
              }
              style={styles.avatar}
            />
            {guardandoFoto && (
              <View style={styles.avatarCargandoOverlay}>
                <ActivityIndicator size="small" color={Colors.white} />
              </View>
            )}
          </View>

          <Text style={styles.nombreUsuario}>{nombreMostrado}</Text>

          <Button
            title={guardandoFoto ? 'Guardando foto...' : 'Cambiar Foto de perfil'}
            onPress={seleccionarFoto}
            loading={guardandoFoto}
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
                    uri: obtenerImagenPrincipal(pet.fotos),
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
            onPress={() => {
              setEditandoDatos(false);
              setMostrarDatos(true);
            }}
          />
          <Button
            title="Cerrar sesión"
            onPress={manejarCerrarSesion}
          />
        </View>
      </ScrollView>

      {/* Modal con los datos del usuario (lectura y edición) */}
      <Modal
        visible={mostrarDatos}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMostrarDatos(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>MIS DATOS</Text>

            {editandoDatos ? (
              <View style={styles.datosContainer}>
                <Text style={styles.datoLabel}>Nombre:</Text>
                <TextInput
                  style={styles.inputEdicion}
                  value={nombreEditable}
                  onChangeText={setNombreEditable}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={Colors.textMuted}
                />

                <Text style={styles.datoLabel}>Teléfono:</Text>
                <TextInput
                  style={styles.inputEdicion}
                  value={telefonoEditable}
                  onChangeText={setTelefonoEditable}
                  placeholder="Ej. 11 1234-5678"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="phone-pad"
                />

                <View style={styles.filaBotonesModal}>
                  <Pressable
                    style={[styles.botonCerrar, styles.botonSecundarioModal]}
                    onPress={() => setEditandoDatos(false)}
                    disabled={guardandoDatos}
                  >
                    <Text style={styles.botonSecundarioTexto}>CANCELAR</Text>
                  </Pressable>

                  <Pressable
                    style={styles.botonCerrar}
                    onPress={manejarGuardarDatosPerfil}
                    disabled={guardandoDatos}
                  >
                    {guardandoDatos ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={styles.botonCerrarTexto}>GUARDAR</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
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

                <View style={styles.filaBotonesModal}>
                  <Pressable
                    style={[styles.botonCerrar, styles.botonSecundarioModal]}
                    onPress={() => setEditandoDatos(true)}
                  >
                    <Text style={styles.botonSecundarioTexto}>EDITAR</Text>
                  </Pressable>

                  <Pressable
                    style={styles.botonCerrar}
                    onPress={() => setMostrarDatos(false)}
                  >
                    <Text style={styles.botonCerrarTexto}>CERRAR</Text>
                  </Pressable>
                </View>
              </>
            )}
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
  avatarContenedor: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: Spacing.sm,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Colors.borderLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarCargandoOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowColor: Colors.shadow,
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
    backgroundColor: Colors.error,
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
  datoItem: {
    marginBottom: 4,
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
  inputEdicion: {
    width: '100%',
    height: 44,
    backgroundColor: Colors.backgroundLight,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  filaBotonesModal: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: 16,
    width: '100%',
  },
  botonCerrar: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonSecundarioModal: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  botonCerrarTexto: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
  },
  botonSecundarioTexto: {
    color: Colors.primary,
    fontFamily: Typography.fonts.bodyBold,
  },
});
