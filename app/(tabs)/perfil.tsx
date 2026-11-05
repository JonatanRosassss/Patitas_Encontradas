import React, { useState, useEffect, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
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
import { Ionicons } from '@expo/vector-icons';

import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { Usuario } from '../../types/User';
import { Pet } from '../../types/Pet';
import { useAuth } from '@/services/AuthContext';
import {
  listarAlertasPorUsuario,
  eliminarAlertaMascota,
  marcarMascotaComoEncontrada,
} from '@/services/mascotasService';
import { useAlertasStore } from '@/store/useAlertasStore';
import { obtenerImagenPrincipal, obtenerEtiquetaEspecie } from '@/utils/detalleMascota';

export default function PerfilScreen() {
  const {
    usuario,
    perfilUsuario,
    cerrarSesion: cerrarSesionAuth,
    actualizarFotoPerfil,
    actualizarDatosPerfil,
  } = useAuth();
  const eliminarAlertaLocal = useAlertasStore((state) => state.eliminarAlertaLocal);
  const actualizarEstadoLocal = useAlertasStore((state) => state.actualizarEstadoLocal);

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
  const cargarMisPublicaciones = useCallback(async () => {
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
  }, [usuario?.uid]);

  useFocusEffect(
    useCallback(() => {
      void cargarMisPublicaciones();
    }, [cargarMisPublicaciones])
  );

  // Manejo de eliminación de publicaciones con soporte completo para Web y Native
  const confirmarEliminacion = (idAlerta: string, nombreMascota?: string) => {
    const nombre = nombreMascota || 'Mascota';
    const mensaje = `¿Estás seguro de que querés eliminar la publicación de "${nombre}"?`;

    const ejecutarEliminacion = async () => {
      try {
        await eliminarAlertaMascota(idAlerta);
        eliminarAlertaLocal(idAlerta);
        setMisPublicaciones((prev) => prev.filter((p) => p.id !== idAlerta));
        if (Platform.OS === 'web') {
          window.alert('La publicación fue eliminada correctamente.');
        } else {
          Alert.alert('Éxito', 'La publicación fue eliminada correctamente.');
        }
        await cargarMisPublicaciones();
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
        void ejecutarEliminacion();
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
          onPress: () => void ejecutarEliminacion(),
        },
      ]
    );
  };

  const confirmarMascotaEncontrada = (idAlerta: string, nombre?: string) => {
    const mensaje = `¿Confirmás que ${
      nombre || 'esta mascota'
    } fue encontrada? Se actualizará la publicación.`;

    const ejecutar = async () => {
      try {
        await marcarMascotaComoEncontrada(idAlerta);
        actualizarEstadoLocal(idAlerta, 'ENCONTRADO');

        if (Platform.OS === 'web') {
          window.alert('¡Publicación actualizada! La mascota figura como encontrada.');
        } else {
          Alert.alert(
            '¡Mascota encontrada!',
            'La publicación fue actualizada correctamente.'
          );
        }

        await cargarMisPublicaciones();
      } catch (error: unknown) {
        const msg =
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar la publicación.';

        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Error', msg);
        }
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(mensaje)) {
        void ejecutar();
      }
      return;
    }

    Alert.alert('Marcar como encontrada', mensaje, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => void ejecutar(),
      },
    ]);
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
    const ejecutarCierre = async () => {
      await cerrarSesionAuth();
      router.replace('/(auth)/login');
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
          onPress: ejecutarCierre,
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
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera / Perfil VIP */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContenedorWrapper}>
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

            {/* Badge circular para cambiar foto (Standard Luxury Pattern) */}
            <Pressable
              style={({ pressed }) => [
                styles.cameraBadgeButton,
                pressed && styles.cameraBadgeButtonPressed,
              ]}
              onPress={seleccionarFoto}
              disabled={guardandoFoto}
              accessibilityRole="button"
              accessibilityLabel="Cambiar foto de perfil"
              hitSlop={8}
            >
              <Ionicons name="camera" size={17} color={Colors.white} />
            </Pressable>
          </View>

          <Text style={styles.nombreUsuario}>{nombreMostrado}</Text>
          <Text style={styles.emailUsuario}>{datosUsuario.email}</Text>

          <View style={styles.badgeComunidad}>
            <Ionicons name="shield-checkmark" size={13} color={Colors.profileBadgeVerifiedText} />
            <Text style={styles.textoBadgeComunidad}>Vecino verificado de Pilar</Text>
          </View>
        </View>

        {/* Sección: Mis Publicaciones */}
        <View style={styles.seccionContenedor}>
          <View style={styles.seccionHeaderFila}>
            <Text style={styles.tituloSeccion}>MIS PUBLICACIONES</Text>
            {misPublicaciones.length > 0 && (
              <View style={styles.contadorBadge}>
                <Text style={styles.contadorBadgeTexto}>{misPublicaciones.length}</Text>
              </View>
            )}
          </View>

          {cargandoPublicaciones ? (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.spinner} />
          ) : misPublicaciones.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="paw-outline" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Aún no creaste publicaciones</Text>
              <Text style={styles.emptyDescription}>
                Cuando reportes una mascota perdida o encontrada en Pilar, podrás gestionarla acá.
              </Text>
              <Pressable
                style={styles.emptyActionButton}
                onPress={() => router.push('/(tabs)/publicar-alerta')}
              >
                <Ionicons name="add-circle-outline" size={18} color={Colors.white} />
                <Text style={styles.emptyActionButtonText}>Reportar Mascota</Text>
              </Pressable>
            </View>
          ) : (
            misPublicaciones.map((pet) => {
              const estaEncontrada = pet.estado === 'ENCONTRADO';
              return (
                <View key={pet.id} style={styles.tarjetaMascota}>
                  {/* Fila Principal: Foto + Información + Badge de Estado */}
                  <View style={styles.tarjetaHeaderFila}>
                    <Image
                      source={{
                        uri: obtenerImagenPrincipal(pet.fotos),
                      }}
                      style={styles.imagenMascota}
                    />

                    <View style={styles.infoMascota}>
                      <View style={styles.nombreYEstadoFila}>
                        <Text style={styles.nombreMascota} numberOfLines={1}>
                          {pet.nombre || 'Mascota sin nombre'}
                        </Text>
                        <View
                          style={[
                            styles.badgeEstadoPublicacion,
                            estaEncontrada
                              ? styles.badgeEstadoEncontrado
                              : styles.badgeEstadoPerdido,
                          ]}
                        >
                          <View
                            style={[
                              styles.dotEstadoPublicacion,
                              estaEncontrada
                                ? styles.dotEstadoEncontrado
                                : styles.dotEstadoPerdido,
                            ]}
                          />
                          <Text
                            style={[
                              styles.textoEstadoPublicacion,
                              estaEncontrada
                                ? styles.textoEstadoEncontrado
                                : styles.textoEstadoPerdido,
                            ]}
                          >
                            {pet.estado}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.especieRazaMascota} numberOfLines={1}>
                        {obtenerEtiquetaEspecie(pet.especie)}
                      </Text>

                      {pet.descripcion ? (
                        <Text style={styles.descripcionMascota} numberOfLines={1}>
                          {pet.descripcion}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Fila de Acciones: Perfectamente simétrica, con igual altura y alineación */}
                  <View style={styles.tarjetaAccionesFila}>
                    {!estaEncontrada && (
                      <Pressable
                        style={({ pressed }) => [
                          styles.botonAccionMascota,
                          styles.botonEncontrada,
                          pressed && styles.botonAccionPressed,
                        ]}
                        onPress={() => confirmarMascotaEncontrada(pet.id, pet.nombre)}
                        accessibilityRole="button"
                        accessibilityLabel={`Marcar ${pet.nombre || 'mascota'} como encontrada`}
                      >
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={15}
                          color={Colors.profileFoundBtnText}
                        />
                        <Text style={styles.textoBotonEncontrada}>
                          Marcar como encontrada
                        </Text>
                      </Pressable>
                    )}

                    <Pressable
                      style={({ pressed }) => [
                        styles.botonAccionMascota,
                        styles.botonEliminar,
                        pressed && styles.botonAccionPressed,
                      ]}
                      onPress={() => confirmarEliminacion(pet.id, pet.nombre)}
                      accessibilityRole="button"
                      accessibilityLabel={`Eliminar publicación de ${pet.nombre || 'mascota'}`}
                    >
                      <Ionicons name="trash-outline" size={15} color={Colors.error} />
                      <Text style={styles.textoBotonEliminar}>Eliminar</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Sección: Mi Cuenta y Ajustes (Grouped List Style) */}
        <View style={styles.seccionContenedor}>
          <Text style={styles.tituloSeccion}>MI CUENTA Y AJUSTES</Text>

          <View style={styles.tarjetaAgrupada}>
            {/* Opción 1: Mis Datos Personales */}
            <Pressable
              style={({ pressed }) => [
                styles.itemOpcion,
                pressed && styles.itemOpcionPressed,
              ]}
              onPress={() => {
                setEditandoDatos(false);
                setMostrarDatos(true);
              }}
              accessibilityRole="button"
              accessibilityLabel="Abrir mis datos personales"
            >
              <View style={styles.iconoOpcionContenedor}>
                <Ionicons name="person-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoOpcion}>
                <Text style={styles.tituloOpcion}>Mis Datos Personales</Text>
                <Text style={styles.subtituloOpcion}>Nombre, teléfono y correo registrado</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </Pressable>

            <View style={styles.separadorItem} />

            {/* Opción 2: Configuración y Seguridad */}
            <Pressable
              style={({ pressed }) => [
                styles.itemOpcion,
                pressed && styles.itemOpcionPressed,
              ]}
              onPress={() => router.push('/ajustes')}
              accessibilityRole="button"
              accessibilityLabel="Ir a configuración y seguridad"
            >
              <View style={styles.iconoOpcionContenedor}>
                <Ionicons name="settings-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoOpcion}>
                <Text style={styles.tituloOpcion}>Configuración y Seguridad</Text>
                <Text style={styles.subtituloOpcion}>Contraseña y alertas de notificaciones</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </Pressable>

            <View style={styles.separadorItem} />

            {/* Opción 3: Centro de Ayuda y Soporte */}
            <Pressable
              style={({ pressed }) => [
                styles.itemOpcion,
                pressed && styles.itemOpcionPressed,
              ]}
              onPress={() => router.push('/reporte_error?tab=FAQS')}
              accessibilityRole="button"
              accessibilityLabel="Ir al centro de ayuda y soporte"
            >
              <View style={styles.iconoOpcionContenedor}>
                <Ionicons name="help-buoy-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoOpcion}>
                <Text style={styles.tituloOpcion}>Centro de Ayuda</Text>
                <Text style={styles.subtituloOpcion}>Preguntas frecuentes y soporte técnico</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </Pressable>
          </View>

          {/* Botón Cerrar Sesión Refinado (Secondary Destructive Action) */}
          <Pressable
            style={({ pressed }) => [
              styles.botonCerrarSesion,
              pressed && styles.botonCerrarSesionPressed,
            ]}
            onPress={manejarCerrarSesion}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión de la cuenta"
          >
            <Ionicons name="log-out-outline" size={19} color={Colors.profileLogoutText} />
            <Text style={styles.textoCerrarSesion}>Cerrar sesión</Text>
          </Pressable>
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
            <View style={styles.modalHeaderFila}>
              <Text style={styles.modalTitulo}>Mis Datos</Text>
              <Pressable
                style={styles.modalCerrarIcono}
                onPress={() => setMostrarDatos(false)}
                hitSlop={8}
              >
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>

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
                    style={[styles.botonModalBase, styles.botonSecundarioModal]}
                    onPress={() => setEditandoDatos(false)}
                    disabled={guardandoDatos}
                  >
                    <Text style={styles.botonSecundarioTexto}>Cancelar</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.botonModalBase, styles.botonPrimarioModal]}
                    onPress={manejarGuardarDatosPerfil}
                    disabled={guardandoDatos}
                  >
                    {guardandoDatos ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={styles.botonPrimarioTexto}>Guardar</Text>
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
                    style={[styles.botonModalBase, styles.botonPrimarioModal]}
                    onPress={() => setEditandoDatos(true)}
                  >
                    <Ionicons name="create-outline" size={16} color={Colors.white} />
                    <Text style={styles.botonPrimarioTexto}>Editar Datos</Text>
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
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl + Spacing.base,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  avatarContenedorWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatarContenedor: {
    width: 104,
    height: 104,
    borderRadius: 52,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Colors.borderLight,
    borderWidth: 3,
    borderColor: Colors.profileAvatarBorder,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 14px rgba(90, 58, 31, 0.12)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
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
  cameraBadgeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.profileCameraBadge,
    borderWidth: 2.5,
    borderColor: Colors.profileCameraBadgeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 6px rgba(90, 58, 31, 0.20)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.20,
        shadowRadius: 3,
        elevation: 5,
      },
    }),
  },
  cameraBadgeButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  nombreUsuario: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  emailUsuario: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  badgeComunidad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.profileBadgeVerifiedBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  textoBadgeComunidad: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.profileBadgeVerifiedText,
  },
  seccionContenedor: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  seccionHeaderFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  tituloSeccion: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
  },
  contadorBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  contadorBadgeTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.primary,
  },
  spinner: {
    marginVertical: Spacing.lg,
  },
  emptyContainer: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.xs,
    maxWidth: 280,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  emptyActionButtonText: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
  tarjetaMascota: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(90, 58, 31, 0.06)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
      },
    }),
  },
  tarjetaHeaderFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  imagenMascota: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
    backgroundColor: Colors.borderLight,
  },
  infoMascota: {
    flex: 1,
    gap: 2,
  },
  nombreYEstadoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  nombreMascota: {
    flex: 1,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  badgeEstadoPublicacion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeEstadoEncontrado: {
    backgroundColor: Colors.statusAdopcionBg,
  },
  badgeEstadoPerdido: {
    backgroundColor: Colors.statusPerdidoBg,
  },
  dotEstadoPublicacion: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotEstadoEncontrado: {
    backgroundColor: Colors.statusAdopcion,
  },
  dotEstadoPerdido: {
    backgroundColor: Colors.statusPerdido,
  },
  textoEstadoPublicacion: {
    fontSize: 10,
    fontFamily: Typography.fonts.bodyBold,
    letterSpacing: 0.4,
  },
  textoEstadoEncontrado: {
    color: Colors.statusAdopcion,
  },
  textoEstadoPerdido: {
    color: Colors.statusPerdido,
  },
  especieRazaMascota: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textSecondary,
  },
  descripcionMascota: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  tarjetaAccionesFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
  },
  botonAccionMascota: {
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  botonAccionPressed: {
    opacity: 0.75,
  },
  botonEncontrada: {
    backgroundColor: Colors.profileFoundBtnBg,
    borderWidth: 1,
    borderColor: Colors.profileFoundBtnBorder,
  },
  textoBotonEncontrada: {
    color: Colors.profileFoundBtnText,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
  },
  botonEliminar: {
    backgroundColor: Colors.profileDeleteBtnBg,
    borderWidth: 1,
    borderColor: Colors.profileDeleteBtnBorder,
  },
  textoBotonEliminar: {
    color: Colors.error,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
  },
  tarjetaAgrupada: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(90, 58, 31, 0.05)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
      },
    }),
  },
  itemOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.card,
  },
  itemOpcionPressed: {
    backgroundColor: Colors.backgroundLight,
  },
  iconoOpcionContenedor: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Colors.profileOptionIconBg,
    borderWidth: 1,
    borderColor: Colors.profileOptionIconBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoOpcion: {
    flex: 1,
  },
  tituloOpcion: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },
  subtituloOpcion: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  separadorItem: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: Spacing.base + 38 + Spacing.md,
  },
  botonCerrarSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.profileLogoutBg,
    borderWidth: 1,
    borderColor: Colors.profileLogoutBorder,
    borderRadius: Radius.md,
    height: 48,
    marginTop: Spacing.base,
  },
  botonCerrarSesionPressed: {
    opacity: 0.8,
  },
  textoCerrarSesion: {
    color: Colors.profileLogoutText,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
  modalFondo: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.base,
  },
  modalContenido: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  modalHeaderFila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  modalTitulo: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  modalCerrarIcono: {
    padding: Spacing.xs,
  },
  datosContainer: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  datoItem: {
    marginBottom: Spacing.sm,
  },
  datoLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
  },
  datoValor: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    marginTop: 2,
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
    marginBottom: Spacing.sm,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  filaBotonesModal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.base,
    width: '100%',
  },
  botonModalBase: {
    height: 42,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  botonPrimarioModal: {
    backgroundColor: Colors.primary,
    flex: 1,
  },
  botonSecundarioModal: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  botonPrimarioTexto: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
  botonSecundarioTexto: {
    color: Colors.textSecondary,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
});
