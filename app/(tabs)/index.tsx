import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  FlatList,
  Modal,
  Image,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { PetCard } from '@/components/ui/pet-card';
import { MaxContentWidth, Colors, Typography, Spacing, Radius } from '@/constants/theme';
import GuiaDeUso, { type RectanguloGuia } from '@/components/GuiaDeUso';
import { listarTodasLasAlertas, formatearTiempoRelativo } from '@/services/mascotasService';
import { obtenerImagenPrincipal } from '@/utils/detalleMascota';
import { useAuth } from '@/services/AuthContext';
import type { Pet } from '@/types/Pet';

export default function HomeScreen() {
  const { usuario, perfilUsuario } = useAuth();
  const [mascotas, setMascotas] = useState<Pet[]>([]);
  const [cargandoMascotas, setCargandoMascotas] = useState<boolean>(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>('Todos');
  const [mostrarFiltros, setMostrarFiltros] = useState<boolean>(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Pet | null>(null);
  const [mostrarGuia, setMostrarGuia] = useState<boolean>(false);
  const [pasoGuia, setPasoGuia] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<RectanguloGuia | null>(null);

  const publicarRef = useRef<View>(null);
  const filtrosRef = useRef<View>(null);
  const mascotaRef = useRef<View>(null);

  // Verificación de la guía de primera sesión
  useEffect(() => {
    async function verificarGuia() {
      try {
        const guiaVista = await AsyncStorage.getItem('guiaDeUsoVista');
        if (guiaVista !== 'true') {
          setMostrarGuia(true);
        }
      } catch {
        // Fallback silencioso en producción
      }
    }

    verificarGuia();
  }, []);

  // Medición de elementos para el spotlight de la guía
  useEffect(() => {
    if (!mostrarGuia) {
      setTargetRect(null);
      return;
    }

    const referencias = [publicarRef, filtrosRef, mascotaRef];
    const referencia = referencias[pasoGuia]?.current;

    if (!referencia) {
      setTargetRect(null);
      return;
    }

    const frame = requestAnimationFrame(() => {
      referencia.measureInWindow((x, y, width, height) => {
        setTargetRect({ x, y, width, height });
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [mostrarGuia, pasoGuia]);

  async function cerrarGuia() {
    setMostrarGuia(false);
    try {
      await AsyncStorage.setItem('guiaDeUsoVista', 'true');
    } catch {
      // Fallback silencioso
    }
  }

  // Carga reactiva de alertas desde Firestore
  const cargarAlertasFirestore = useCallback(async () => {
    try {
      setCargandoMascotas(true);
      setErrorCarga(null);
      const alertas = await listarTodasLasAlertas();
      setMascotas(alertas || []);
    } catch {
      setErrorCarga('No se pudieron sincronizar las publicaciones. Verificá tu conexión a internet.');
    } finally {
      setCargandoMascotas(false);
    }
  }, []);

  useEffect(() => {
    cargarAlertasFirestore();
  }, [cargarAlertasFirestore]);

  useFocusEffect(
    useCallback(() => {
      cargarAlertasFirestore();
    }, [cargarAlertasFirestore])
  );

  function publicarMascota() {
    router.push('/publicar-alerta');
  }

  function irAlDetalle(idMascota: string) {
    if (mascotaSeleccionada) {
      setMascotaSeleccionada(null);
    }
    router.push(`/detalle/${idMascota}` as any);
  }

  // Filtro por estado
  const mascotasFiltradas = mascotas.filter((item) => {
    if (estadoSeleccionado === 'Todos') return true;
    return item.estado?.toUpperCase() === estadoSeleccionado.toUpperCase();
  });

  // Saludo personalizado con el nombre real del perfil (Firestore / Auth) o 'VECINO'
  const nombreVecino =
    perfilUsuario?.nombre?.split(' ')[0] ||
    usuario?.displayName?.split(' ')[0] ||
    usuario?.email?.split('@')[0] ||
    'VECINO';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* HERO SECTION CON SALUDO, NOTIFICACIONES Y GUÍA */}
        <View style={styles.heroSection}>
          <View style={styles.saludoContainer}>
            <Text style={styles.title}>HOLA, {nombreVecino.toUpperCase()}</Text>
            <Text style={styles.subtitle}>¿Perdiste o encontraste una mascota en Pilar?</Text>
          </View>

          <View style={styles.heroActionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.botonNotificaciones,
                pressed && styles.botonNotificacionesPressed,
              ]}
              onPress={() => router.push('/notificaciones')}
              accessibilityRole="button"
              accessibilityLabel="Ver notificaciones comunitarias"
            >
              <Ionicons name="notifications-outline" size={17} color={Colors.text} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.botonGuia, pressed && styles.botonGuiaPressed]}
              onPress={() => setMostrarGuia(true)}
              accessibilityRole="button"
              accessibilityLabel="Ver guía de uso interactiva"
            >
              <Ionicons name="book-outline" size={15} color={Colors.primary} />
              <Text style={styles.textoBotonGuia}>GUÍA</Text>
            </Pressable>
          </View>
        </View>

        {/* ACCIONES PRINCIPALES: PUBLICAR Y FILTROS */}
        <View style={styles.actionBar}>
          <Pressable
            ref={publicarRef}
            style={({ pressed }) => [styles.publishButton, pressed && styles.publishButtonPressed]}
            onPress={publicarMascota}
            accessibilityRole="button"
            accessibilityLabel="Publicar mascota perdida o encontrada"
          >
            <Ionicons name="add-circle-outline" size={20} color={Colors.white} />
            <Text style={styles.publishButtonText}>PUBLICAR MASCOTA</Text>
          </Pressable>

          <Pressable
            ref={filtrosRef}
            style={({ pressed }) => [
              styles.filterButton,
              mostrarFiltros && styles.filterButtonActive,
              pressed && styles.filterButtonPressed,
            ]}
            onPress={() => setMostrarFiltros(!mostrarFiltros)}
            accessibilityRole="button"
            accessibilityLabel="Abrir filtros de estado"
          >
            <Ionicons
              name={mostrarFiltros ? 'options' : 'options-outline'}
              size={20}
              color={mostrarFiltros ? Colors.white : Colors.primary}
            />
          </Pressable>
        </View>

        {/* PANEL DESPLEGABLE DE FILTROS */}
        {mostrarFiltros && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>FILTRAR POR ESTADO</Text>
            <View style={styles.filterOptions}>
              {(['Todos', 'PERDIDO', 'ENCONTRADO'] as const).map((est) => {
                const isActive = estadoSeleccionado === est;
                return (
                  <Pressable
                    key={est}
                    style={[styles.filterOption, isActive && styles.filterOptionActive]}
                    onPress={() => setEstadoSeleccionado(est)}
                  >
                    <Text
                      style={[styles.filterOptionText, isActive && styles.filterOptionTextActive]}
                    >
                      {est === 'Todos' ? 'Todos' : est === 'PERDIDO' ? 'Perdidos' : 'Encontrados'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* MENSAJE DE ERROR CON REINTENTO */}
        {errorCarga && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color={Colors.error} />
            <Text style={styles.errorText}>{errorCarga}</Text>
            <Pressable style={styles.retryButton} onPress={cargarAlertasFirestore}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {/* FEED DE ALERTAS DESDE BASE DE DATOS */}
        {cargandoMascotas && mascotas.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Sincronizando alertas comunitarias...</Text>
          </View>
        ) : (
          <FlatList
            style={styles.petList}
            contentContainerStyle={
              mascotasFiltradas.length === 0 ? styles.emptyListContent : styles.petListContent
            }
            data={mascotasFiltradas}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={cargandoMascotas}
                onRefresh={cargarAlertasFirestore}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
            ListEmptyComponent={
              !cargandoMascotas ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="paw-outline" size={54} color={Colors.textMuted} />
                  <Text style={styles.emptyTitle}>No hay alertas registradas</Text>
                  <Text style={styles.emptySubtitle}>
                    {estadoSeleccionado === 'Todos'
                      ? 'Aún no se han publicado alertas en la base de datos de Pilar.'
                      : `No se encontraron mascotas en estado "${estadoSeleccionado.toLowerCase()}".`}
                  </Text>
                  <Pressable style={styles.emptyButton} onPress={publicarMascota}>
                    <Text style={styles.emptyButtonText}>Publicar la primera alerta</Text>
                  </Pressable>
                </View>
              ) : null
            }
            renderItem={({ item, index }) => {
              const ubicacionTexto =
                typeof item.ubicacion === 'string'
                  ? item.ubicacion
                  : item.ubicacion?.direccion || 'Ubicación no especificada';
              const imagenPrincipal = obtenerImagenPrincipal(item.fotos);

              return (
                <View
                  ref={index === 0 ? mascotaRef : undefined}
                  collapsable={false}
                >
                  <PetCard
                    id={item.id}
                    onPress={() => irAlDetalle(item.id)}
                    tipo={item.especie || 'OTRO'}
                    estado={item.estado || 'PERDIDO'}
                    nombre={item.nombre || 'Mascota sin nombre'}
                    imagen={imagenPrincipal}
                    ubicacion={ubicacionTexto}
                    tiempo={formatearTiempoRelativo(item.fechaReporte)}
                    recompensa={item.recompensa}
                  />
                </View>
              );
            }}
          />
        )}

        {/* MODAL DE PREVISUALIZACIÓN RÁPIDA */}
        <Modal
          visible={mascotaSeleccionada !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMascotaSeleccionada(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {mascotaSeleccionada && (
                <>
                  <Image
                    source={{
                      uri: obtenerImagenPrincipal(mascotaSeleccionada.fotos),
                    }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.modalTitle}>
                    {mascotaSeleccionada.nombre || 'Mascota'}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {mascotaSeleccionada.especie} · {mascotaSeleccionada.estado}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {mascotaSeleccionada.descripcion || 'Sin descripción adicional.'}
                  </Text>

                  <View style={styles.modalButtonsRow}>
                    <Pressable
                      style={styles.detailButton}
                      onPress={() => irAlDetalle(mascotaSeleccionada.id)}
                    >
                      <Ionicons name="information-circle-outline" size={18} color={Colors.white} />
                      <Text style={styles.detailButtonText}>Ver Ficha Completa</Text>
                    </Pressable>

                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setMascotaSeleccionada(null)}
                    >
                      <Text style={styles.closeButtonText}>Cerrar</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      {/* GUÍA DE USO INTERACTIVA */}
      <GuiaDeUso
        visible={mostrarGuia}
        pasoActual={pasoGuia}
        targetRect={targetRect}
        onNext={() => setPasoGuia((actual) => Math.min(actual + 1, 2))}
        onPrevious={() => setPasoGuia((actual) => Math.max(actual - 1, 0))}
        onClose={cerrarGuia}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'stretch',
    gap: Spacing.md,
    paddingBottom: Spacing.half,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  saludoContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'left',
    marginTop: Spacing.half,
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  botonNotificaciones: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonNotificacionesPressed: {
    backgroundColor: Colors.accent,
    opacity: 0.85,
  },
  botonGuia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
    height: 44,
  },
  botonGuiaPressed: {
    opacity: 0.8,
    backgroundColor: Colors.accent,
  },
  textoBotonGuia: {
    color: Colors.primary,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
  },
  actionBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  publishButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(255, 138, 0, 0.25)',
      },
      default: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  publishButtonPressed: {
    opacity: 0.85,
  },
  publishButtonText: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
    letterSpacing: 0.5,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonPressed: {
    opacity: 0.8,
  },
  filterPanel: {
    padding: Spacing.base,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  filterTitle: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.backgroundLight,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.text,
  },
  filterOptionTextActive: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    gap: Spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.error,
  },
  retryButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.half,
    backgroundColor: Colors.accent,
    borderRadius: Radius.xs,
  },
  retryButtonText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.five,
    gap: Spacing.base,
  },
  loadingText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textSecondary,
  },
  petList: {
    flex: 1,
  },
  petListContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    alignItems: 'center',
  },
  modalImage: {
    width: 140,
    height: 140,
    borderRadius: Radius.md,
    marginBottom: Spacing.base,
    backgroundColor: Colors.accent,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    marginBottom: Spacing.half,
  },
  modalSubtitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  modalDescription: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    marginTop: Spacing.sm,
  },
  detailButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
  },
  detailButtonText: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
  closeButton: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: Colors.textSecondary,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
});