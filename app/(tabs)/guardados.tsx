import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  obtenerPublicacionesGuardadas,
  quitarPublicacionGuardada,
  listarAlertasPorUsuario,
} from '@/services/mascotasService';
import { useAuth } from '@/services/AuthContext';
import { useAlertasStore } from '@/store/useAlertasStore';
import { obtenerImagenPrincipal, obtenerPresentacionEstado } from '@/utils/detalleMascota';
import type { Pet } from '@/types/Pet';
import { Colors, Radius, Spacing, TabBarMetrics, Typography } from '@/constants/theme';

type TabGuardados = 'GUARDADAS' | 'PUBLICACIONES';

export default function GuardadosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario, cargando: cargandoAuth } = useAuth();
  const quitarGuardadoLocal = useAlertasStore((state) => state.quitarGuardadoLocal);

  const [tabActiva, setTabActiva] = useState<TabGuardados>('GUARDADAS');
  const [guardadas, setGuardadas] = useState<Pet[]>([]);
  const [misPublicaciones, setMisPublicaciones] = useState<Pet[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [refrescando, setRefrescando] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [desguardandoId, setDesguardandoId] = useState<string | null>(null);

  const bottomInset = Math.max(insets.bottom, TabBarMetrics.minBottomPadding);

  const cargarDatos = useCallback(
    async (esRefresco = false) => {
      if (!usuario?.uid) {
        setGuardadas([]);
        setMisPublicaciones([]);
        setCargando(false);
        setRefrescando(false);
        return;
      }

      try {
        if (esRefresco) {
          setRefrescando(true);
        } else {
          setCargando(true);
        }
        setError('');

        const [itemsGuardados, itemsPublicados] = await Promise.all([
          obtenerPublicacionesGuardadas(usuario.uid).catch(() => []),
          listarAlertasPorUsuario(usuario.uid).catch(() => []),
        ]);

        setGuardadas(itemsGuardados);
        setMisPublicaciones(itemsPublicados);
        useAlertasStore.setState({
          idsGuardadas: itemsGuardados.map((item) => item.id),
          guardadasCargadas: true,
        });
      } catch {
        setError('No se pudieron sincronizar las publicaciones. Verificá tu conexión.');
      } finally {
        setCargando(false);
        setRefrescando(false);
      }
    },
    [usuario?.uid]
  );

  useFocusEffect(
    useCallback(() => {
      void cargarDatos();
    }, [cargarDatos])
  );

  const eliminarGuardado = async (id: string) => {
    if (!usuario?.uid || desguardandoId) return;

    try {
      setDesguardandoId(id);
      await quitarPublicacionGuardada(id, usuario.uid);
      quitarGuardadoLocal(id);
      setGuardadas((actuales) => actuales.filter((pet) => pet.id !== id));
      setError('');
    } catch {
      setError('No se pudo quitar la publicación de tus guardados.');
    } finally {
      setDesguardandoId(null);
    }
  };

  const listaActual = tabActiva === 'GUARDADAS' ? guardadas : misPublicaciones;

  // Estado: Pantalla de usuario no autenticado (Invitado)
  if (!cargandoAuth && !usuario) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: bottomInset + Spacing.xl,
          },
        ]}
      >
        <View style={styles.encabezado}>
          <Text style={styles.titulo}>Mis publicaciones</Text>
          <Text style={styles.subtitulo}>Guardadas y alertas de tu cuenta</Text>
        </View>

        <View style={styles.vacioContenedor}>
          <View style={styles.iconoVacioCirculo}>
            <Ionicons name="bookmark-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.vacioTitulo}>Iniciá sesión para ver tus guardados</Text>
          <Text style={styles.vacioDescripcion}>
            Podrás acceder a tus publicaciones marcadas como favoritas y gestionar los reportes que hayas creado.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.botonCta, pressed && styles.botonCtaPresionado]}
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="button"
            accessibilityLabel="Iniciar sesión"
          >
            <Ionicons name="log-in-outline" size={20} color={Colors.white} />
            <Text style={styles.botonCtaTexto}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Estado: Cargando inicial
  if (cargando && !refrescando) {
    return (
      <View
        style={[
          styles.container,
          styles.centrado,
          {
            paddingTop: insets.top,
            paddingBottom: bottomInset,
          },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.textoCargando}>Cargando tus publicaciones...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top + Spacing.sm, Spacing.base),
        },
      ]}
    >
      {/* Encabezado */}
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Publicaciones</Text>
        <Text style={styles.subtitulo}>Tus alertas guardadas y creadas en un solo lugar</Text>

        {/* Selector de pestañas: Guardadas vs Mis Publicaciones */}
        <View style={styles.selectorContenedor}>
          <Pressable
            style={[styles.tabBoton, tabActiva === 'GUARDADAS' && styles.tabBotonActivo]}
            onPress={() => setTabActiva('GUARDADAS')}
            accessibilityRole="button"
            accessibilityLabel="Ver publicaciones guardadas"
          >
            <Ionicons
              name={tabActiva === 'GUARDADAS' ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={tabActiva === 'GUARDADAS' ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.tabBotonTexto,
                tabActiva === 'GUARDADAS' && styles.tabBotonTextoActivo,
              ]}
            >
              Guardadas ({guardadas.length})
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabBoton, tabActiva === 'PUBLICACIONES' && styles.tabBotonActivo]}
            onPress={() => setTabActiva('PUBLICACIONES')}
            accessibilityRole="button"
            accessibilityLabel="Ver mis alertas creadas"
          >
            <Ionicons
              name={tabActiva === 'PUBLICACIONES' ? 'paw' : 'paw-outline'}
              size={18}
              color={tabActiva === 'PUBLICACIONES' ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.tabBotonTexto,
                tabActiva === 'PUBLICACIONES' && styles.tabBotonTextoActivo,
              ]}
            >
              Mis Alertas ({misPublicaciones.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Alerta de error si ocurrió */}
      {error !== '' && (
        <View style={styles.bannerError}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.error} />
          <Text style={styles.textoError}>{error}</Text>
          <Pressable onPress={() => cargarDatos()} hitSlop={8}>
            <Text style={styles.reintentarTexto}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      {/* Lista de publicaciones */}
      <FlatList
        data={listaActual}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.lista,
          {
            paddingBottom: bottomInset + Spacing.xxl,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={() => cargarDatos(true)}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.vacioContenedor}>
            <View style={styles.iconoVacioCirculo}>
              <Ionicons
                name={tabActiva === 'GUARDADAS' ? 'bookmark-outline' : 'paw-outline'}
                size={48}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.vacioTitulo}>
              {tabActiva === 'GUARDADAS'
                ? 'Todavía no tenés publicaciones guardadas'
                : 'Aún no creaste alertas'}
            </Text>
            <Text style={styles.vacioDescripcion}>
              {tabActiva === 'GUARDADAS'
                ? 'Tocá el icono de marcador en cualquier alerta del inicio o del mapa para tenerla a mano.'
                : 'Publicá una alerta comunitaria si perdiste o encontraste una mascota en tu zona.'}
            </Text>

            <Pressable
              style={({ pressed }) => [styles.botonCta, pressed && styles.botonCtaPresionado]}
              onPress={() =>
                router.push(tabActiva === 'GUARDADAS' ? '/(tabs)' : '/(tabs)/publicar-alerta')
              }
              accessibilityRole="button"
              accessibilityLabel={
                tabActiva === 'GUARDADAS' ? 'Explorar alertas' : 'Crear alerta comunitaria'
              }
            >
              <Ionicons
                name={tabActiva === 'GUARDADAS' ? 'search-outline' : 'add-circle-outline'}
                size={20}
                color={Colors.white}
              />
              <Text style={styles.botonCtaTexto}>
                {tabActiva === 'GUARDADAS' ? 'Explorar publicaciones' : 'Publicar una alerta'}
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const imagen = obtenerImagenPrincipal(item.fotos);
          const ubicacionTexto =
            typeof item.ubicacion === 'string'
              ? item.ubicacion
              : item.ubicacion?.direccion || 'Ubicación de referencia';
          const presentacion = obtenerPresentacionEstado(item.estado);

          return (
            <Pressable
              style={({ pressed }) => [styles.tarjeta, pressed && styles.tarjetaPresionada]}
              onPress={() => router.push(`/detalle/${encodeURIComponent(item.id)}`)}
              accessibilityRole="button"
              accessibilityLabel={`Ficha de ${item.nombre || 'Mascota'}, estado ${item.estado}`}
            >
              <Image source={{ uri: imagen }} style={styles.imagen} resizeMode="cover" />

              <View style={styles.informacion}>
                <View style={styles.filaSuperior}>
                  <View
                    style={[
                      styles.badgeEstado,
                      { backgroundColor: Colors.accent },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeEstadoTexto,
                        { color: presentacion.color || Colors.primary },
                      ]}
                    >
                      {presentacion.etiqueta.toUpperCase()}
                    </Text>
                  </View>

                  {item.recompensa ? (
                    <View style={styles.badgeRecompensa}>
                      <Ionicons name="gift-outline" size={11} color={Colors.detailReward} />
                      <Text style={styles.badgeRecompensaTexto}>Recompensa</Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.nombre} numberOfLines={1}>
                  {item.nombre || 'Mascota sin nombre'}
                </Text>

                <View style={styles.filaMeta}>
                  <Ionicons
                    name={item.especie === 'GATO' ? 'logo-octocat' : 'paw'}
                    size={14}
                    color={Colors.primary}
                  />
                  <Text style={styles.detalleTexto}>
                    {item.especie || 'Mascota'}
                  </Text>
                </View>

                <View style={styles.filaMeta}>
                  <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.ubicacionTexto} numberOfLines={1}>
                    {ubicacionTexto}
                  </Text>
                </View>
              </View>

              {tabActiva === 'GUARDADAS' ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.botonAccion,
                    pressed && styles.botonAccionPresionado,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    eliminarGuardado(item.id);
                  }}
                  disabled={desguardandoId === item.id}
                  accessibilityRole="button"
                  accessibilityLabel="Quitar de guardados"
                  hitSlop={8}
                >
                  {desguardandoId === item.id ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <Ionicons name="bookmark" size={22} color={Colors.primary} />
                  )}
                </Pressable>
              ) : (
                <View style={styles.botonAccion}>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                </View>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  encabezado: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  titulo: {
    fontSize: Typography.sizes.xxl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  subtitulo: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  selectorContenedor: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    padding: Spacing.xs,
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  tabBoton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    gap: Spacing.xs,
  },
  tabBotonActivo: {
    backgroundColor: Colors.white,
    ...Platform.select({
      web: { boxShadow: '0px 2px 6px rgba(90, 58, 31, 0.08)' },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  tabBotonTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },
  tabBotonTextoActivo: {
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.primary,
  },
  bannerError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.profileLogoutBg,
    borderWidth: 1,
    borderColor: Colors.profileLogoutBorder,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    gap: Spacing.xs,
  },
  textoError: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.error,
  },
  reintentarTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  lista: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    flexGrow: 1,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(90, 58, 31, 0.06)' },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  tarjetaPresionada: {
    opacity: 0.92,
  },
  imagen: {
    width: 90,
    height: 90,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
  },
  informacion: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.xs,
    justifyContent: 'center',
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
    flexWrap: 'wrap',
  },
  badgeEstado: {
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeEstadoTexto: {
    fontSize: 10,
    fontFamily: Typography.fonts.bodyBold,
  },
  badgeRecompensa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.detailRewardBg,
    borderWidth: 1,
    borderColor: Colors.detailRewardBorder,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    gap: 3,
  },
  badgeRecompensaTexto: {
    fontSize: 10,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.detailReward,
  },
  nombre: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    marginBottom: 2,
  },
  filaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  detalleTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },
  ubicacionTexto: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textMuted,
  },
  botonAccion: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  botonAccionPresionado: {
    opacity: 0.6,
  },
  centrado: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCargando: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  vacioContenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    minHeight: 380,
  },
  iconoVacioCirculo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  vacioTitulo: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  vacioDescripcion: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  botonCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    gap: Spacing.xs,
    ...Platform.select({
      web: { boxShadow: '0px 4px 12px rgba(255, 138, 0, 0.28)' },
      default: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  botonCtaPresionado: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  botonCtaTexto: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
});
