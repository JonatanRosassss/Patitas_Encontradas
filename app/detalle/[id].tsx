import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Share,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ExpoLinking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { obtenerAlertaConUsuarioPorId, formatearTiempoRelativo } from '@/services/mascotasService';
import { contactarPorWhatsApp, generarMensajeContactoMascota } from '@/utils/whatsapp';
import type { PetConUsuario } from '@/types/Pet';
import { isValidCoordinate } from '@/utils/geoValidation';

export default function DetalleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();

  const [alerta, setAlerta] = useState<PetConUsuario | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [indiceFotoActiva, setIndiceFotoActiva] = useState<number>(0);
  const [contactando, setContactando] = useState<boolean>(false);

  // Carga de la alerta y datos del usuario creador desde Firestore
  const cargarDetalle = useCallback(async () => {
    if (!id) {
      setCargando(false);
      setErrorCarga('No se especificó un identificador de alerta válido.');
      return;
    }

    try {
      setCargando(true);
      setErrorCarga(null);
      const resultado = await obtenerAlertaConUsuarioPorId(id);
      if (!resultado) {
        setErrorCarga('La publicación solicitada no existe o fue dada de baja.');
      } else {
        setAlerta(resultado);
      }
    } catch {
      setErrorCarga('Ocurrió un error al cargar la información. Verificá tu conexión a internet.');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarDetalle();
  }, [cargarDetalle]);

  const handleVolver = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // Compartir publicación de forma nativa
  const handleCompartir = async () => {
    if (!alerta) return;
    try {
      const nombreMascota = alerta.nombre || 'esta mascota';
      const estadoTexto =
        alerta.estado === 'ENCONTRADO' ? 'Mascota encontrada' : 'Mascota perdida';
      const ubicacionTexto =
        typeof alerta.ubicacion === 'string'
          ? alerta.ubicacion
          : alerta.ubicacion.direccion || 'Ubicación no especificada';
      const coordenadas = alerta.coordenadas;
      const enlaceMapa =
        coordenadas &&
        isValidCoordinate(coordenadas.latitude, coordenadas.longitude)
          ? ExpoLinking.createURL(`/mapa?alertaId=${encodeURIComponent(alerta.id)}`)
          : null;
      const publicacionUrl = ExpoLinking.createURL(`/detalle/${encodeURIComponent(alerta.id)}`);

      await Share.share({
        title: `Patitas Encontradas: ${nombreMascota}`,
        message: [
          '🐾 ¡Ayudemos a la comunidad de pilar! ALERTA DE BUSQUEDA:',
          `${estadoTexto}: ${nombreMascota}`,
          ` Ubicación: ${ubicacionTexto}`,
          ...(enlaceMapa ? [` Ver en el mapa de la app patitas encontradas: ${enlaceMapa}`] : []),
          ` Ver publicación en la app: ${publicacionUrl}`,
          '¡Ayudanos a encontrarla!',
        ].join('\n'),
      });
    } catch {
      // Ignorar cancelaciones del usuario
    }
  };

  // Contactar al publicador vía WhatsApp
  const handleContactarWhatsApp = async () => {
    if (!alerta) return;

    // Prioridad de teléfono: pet.contacto > usuario creador telefono
    const telefono = alerta.contacto || alerta.usuario?.telefono;
    const ubicacionTexto =
      typeof alerta.ubicacion === 'string'
        ? alerta.ubicacion
        : (alerta.ubicacion as any)?.direccion || '';

    const mensaje = generarMensajeContactoMascota({
      nombreMascota: alerta.nombre,
      estado: alerta.estado,
      ubicacion: ubicacionTexto,
      idAlerta: alerta.id,
    });

    try {
      setContactando(true);
      await contactarPorWhatsApp({ telefono, mensaje });
    } finally {
      setContactando(false);
    }
  };

  // 1. ESTADO DE CARGA
  if (cargando) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando información de la mascota...</Text>
      </SafeAreaView>
    );
  }

  // 2. ESTADO DE ERROR O NO ENCONTRADO
  if (errorCarga || !alerta) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
        <Text style={styles.errorTitle}>Publicación no disponible</Text>
        <Text style={styles.errorDescription}>
          {errorCarga || 'No se encontró la publicación de la mascota solicitada.'}
        </Text>
        <View style={styles.errorActions}>
          <Pressable style={styles.secondaryActionButton} onPress={handleVolver}>
            <Text style={styles.secondaryActionButtonText}>Volver al Inicio</Text>
          </Pressable>
          <Pressable style={styles.primaryActionButton} onPress={cargarDetalle}>
            <Text style={styles.primaryActionButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // 3. ESTADO DE ÉXITO: FICHA COMPLETA
  const isPerdido = alerta.estado?.toUpperCase() === 'PERDIDO';
  const fotos = Array.isArray(alerta.fotos) && alerta.fotos.length > 0
    ? alerta.fotos
    : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'];

  const ubicacionTexto =
    typeof alerta.ubicacion === 'string'
      ? alerta.ubicacion
      : (alerta.ubicacion as any)?.direccion || 'Ubicación no especificada';

  const telefonoDisponible = Boolean(alerta.contacto || alerta.usuario?.telefono);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <View style={styles.topBar}>
        <Pressable
          style={styles.iconButton}
          onPress={handleVolver}
          accessibilityRole="button"
          accessibilityLabel="Volver a la pantalla anterior"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          Ficha de Mascota
        </Text>

        <Pressable
          style={styles.iconButton}
          onPress={handleCompartir}
          accessibilityRole="button"
          accessibilityLabel="Compartir alerta con la comunidad"
          hitSlop={8}
        >
          <Ionicons name="share-social-outline" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* GALERÍA / CARRUSEL DE FOTOS */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const indice = Math.round(offsetX / (width - Spacing.four * 2));
              setIndiceFotoActiva(indice);
            }}
            scrollEventThrottle={16}
          >
            {fotos.map((uri, index) => (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={[styles.galleryImage, { width: width - Spacing.four * 2 }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* INDICADOR DE FOTOS (PAGINADOR) */}
          {fotos.length > 1 && (
            <View style={styles.paginationDots}>
              {fotos.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[
                    styles.dot,
                    indiceFotoActiva === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* BADGE FLOTANTE DE ESTADO SOBRE LA FOTO */}
          <View
            style={[
              styles.floatingStatusBadge,
              {
                backgroundColor: isPerdido
                  ? Colors.statusPerdidoBg
                  : Colors.statusEncontradoBg,
              },
            ]}
          >
            <Text
              style={[
                styles.floatingStatusText,
                {
                  color: isPerdido
                    ? Colors.statusPerdido
                    : Colors.statusEncontradoText,
                },
              ]}
            >
              {isPerdido ? '🚨 ALERTA: PERDIDO' : '🐾 MASCOTA ENCONTRADA'}
            </Text>
          </View>
        </View>

        {/* DETALLES PRINCIPALES */}
        <View style={styles.cardSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.petName}>
                {alerta.nombre || 'Mascota sin nombre'}
              </Text>
              <Text style={styles.timeText}>
                {formatearTiempoRelativo(alerta.fechaReporte)}
              </Text>
            </View>

            {alerta.recompensa ? (
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardLabel}>RECOMPENSA</Text>
                <Text style={styles.rewardAmount}>{alerta.recompensa}</Text>
              </View>
            ) : null}
          </View>

          {/* CHIPS DE ESPECIE Y ESTADO */}
          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Ionicons
                name={alerta.especie === 'GATO' ? 'logo-octocat' : 'paw'}
                size={16}
                color={Colors.primary}
              />
              <Text style={styles.chipText}>{alerta.especie}</Text>
            </View>

            <View style={styles.chip}>
              <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.chipText}>
                {new Date(alerta.fechaReporte || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* UBICACIÓN */}
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Visto por última vez en:</Text>
              <Text style={styles.locationValue}>{ubicacionTexto}</Text>
            </View>
          </View>

          {/* DESCRIPCIÓN */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Descripción y Señas Particulares</Text>
            <Text style={styles.descriptionText}>
              {alerta.descripcion || 'Sin información detallada provista por el autor.'}
            </Text>
          </View>
        </View>

        {/* TARJETA DEL VECINO / AUTOR DE LA PUBLICACIÓN */}
        <View style={styles.authorCard}>
          <View style={styles.authorAvatar}>
            {alerta.usuario?.avatarUrl ? (
              <Image source={{ uri: alerta.usuario.avatarUrl }} style={styles.authorImage} />
            ) : (
              <Ionicons name="person" size={24} color={Colors.primary} />
            )}
          </View>

          <View style={styles.authorInfo}>
            <Text style={styles.authorLabel}>Publicado por</Text>
            <Text style={styles.authorName}>
              {alerta.usuario?.nombre || 'Vecino de la comunidad'}
            </Text>
            <Text style={styles.authorSubtitle}>
              {telefonoDisponible ? '✅ Contacto por WhatsApp disponible' : '⚠️ Sin teléfono directo'}
            </Text>
          </View>
        </View>

        {/* ESPACIADOR INFERIOR PARA BOTONES STICKY */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BARRA INFERIOR DE ACCIÓN: CONTACTAR POR WHATSAPP */}
      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [
            styles.whatsappButton,
            pressed && styles.whatsappButtonPressed,
            contactando && styles.buttonDisabled,
          ]}
          onPress={handleContactarWhatsApp}
          disabled={contactando}
          accessibilityRole="button"
          accessibilityLabel="Contactar a quien publicó por WhatsApp"
        >
          {contactando ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="logo-whatsapp" size={24} color={Colors.white} />
              <Text style={styles.whatsappButtonText}>
                {telefonoDisponible ? 'CONTACTAR POR WHATSAPP' : 'CONTACTAR AL VECINO'}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    backgroundColor: Colors.backgroundLight,
    gap: Spacing.base,
  },
  loadingText: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textSecondary,
  },
  errorTitle: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  errorActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.base,
  },
  primaryActionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
  },
  primaryActionButtonText: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
  secondaryActionButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
  },
  secondaryActionButtonText: {
    color: Colors.text,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  topBarTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.base,
  },
  galleryContainer: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.accent,
    position: 'relative',
    height: 280,
  },
  galleryImage: {
    height: 280,
  },
  paginationDots: {
    position: 'absolute',
    bottom: Spacing.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: Spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: Colors.white,
    width: 14,
  },
  floatingStatusBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  floatingStatusText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    letterSpacing: 0.5,
  },
  cardSection: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.base,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  petName: {
    fontSize: Typography.sizes.xxxl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  timeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  rewardContainer: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 10,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  rewardAmount: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundLight,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
  },
  locationValue: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    marginTop: Spacing.half,
  },
  descriptionContainer: {
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },
  descriptionText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeights.md,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  authorImage: {
    width: '100%',
    height: '100%',
  },
  authorInfo: {
    flex: 1,
  },
  authorLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },
  authorName: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  authorSubtitle: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.primary,
    marginTop: Spacing.half,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Platform.select({
      web: {
        boxShadow: '0px -2px 8px rgba(90, 58, 31, 0.1)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
      },
    }),
  },
  whatsappButton: {
    backgroundColor: '#25D366', // Color oficial de WhatsApp para máxima accesibilidad y reconocimiento
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    borderRadius: Radius.md,
    minHeight: 52,
  },
  whatsappButtonPressed: {
    opacity: 0.88,
  },
  whatsappButtonText: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.md,
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
