import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Share,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ExpoLinking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radius, DetailMetrics } from '@/constants/theme';
import { obtenerAlertaConUsuarioPorId, formatearTiempoRelativo } from '@/services/mascotasService';
import { contactarPorWhatsApp, generarMensajeContactoMascota } from '@/utils/whatsapp';
import {
  formatearRecompensa,
  resolverUbicacionAlerta,
  obtenerPresentacionEstado,
  obtenerFotosValidas,
} from '@/utils/detalleMascota';
import {
  PetHeroCarousel,
  PetInfoHeader,
  PetLocationSection,
  PetAuthorCard,
  PetContactBar,
} from '@/components/detalle';
import type { PetConUsuario } from '@/types/Pet';
import { isValidCoordinate } from '@/utils/geoValidation';

export default function DetalleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [alerta, setAlerta] = useState<PetConUsuario | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [contactando, setContactando] = useState<boolean>(false);
  const [alturaBarraContacto, setAlturaBarraContacto] = useState<number>(100);

  // Carga reactiva del detalle y autor desde Firestore
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

  const handleCompartir = async () => {
    if (!alerta) return;
    try {
      const nombreMascota = alerta.nombre || 'esta mascota';
      const estadoTexto =
        alerta.estado === 'ENCONTRADO' ? 'Mascota encontrada' : 'Mascota perdida';
      const ubicacionResuelta = resolverUbicacionAlerta(alerta);
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
          ` Ubicación: ${ubicacionResuelta.direccion}`,
          ...(enlaceMapa ? [` Ver en el mapa de la app patitas encontradas: ${enlaceMapa}`] : []),
          ` Ver publicación en la app: ${publicacionUrl}`,
          '¡Ayudanos a encontrarla!',
        ].join('\n'),
      });
    } catch {
      // Cancelación de share silenciosa
    }
  };

  // Redirección contextualizada a WhatsApp
  const handleContactarWhatsApp = async () => {
    if (!alerta) return;

    const telefono = alerta.contacto || alerta.usuario?.telefono;
    const ubicacionResuelta = resolverUbicacionAlerta(alerta);

    const mensaje = generarMensajeContactoMascota({
      nombreMascota: alerta.nombre,
      estado: alerta.estado,
      ubicacion: ubicacionResuelta.direccion,
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
        <Ionicons
          name="alert-circle-outline"
          size={DetailMetrics.errorIconSize}
          color={Colors.error}
        />
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

  // 3. ESTADO DE ÉXITO: FICHA DETALLADA PROFESIONAL
  const fotos = obtenerFotosValidas(alerta.fotos, true);
  const ubicacionResuelta = resolverUbicacionAlerta(alerta);
  const presentacionEstado = obtenerPresentacionEstado(alerta.estado);
  const tiempoRelativo = formatearTiempoRelativo(alerta.fechaReporte);
  const recompensaFormateada = formatearRecompensa(alerta.recompensa);
  const telefonoDisponible = Boolean(alerta.contacto || alerta.usuario?.telefono);

  // Alto del hero proporcional al dispositivo acotado por min/max
  const alturaHero = Math.min(
    Math.max(height * DetailMetrics.heroHeightRatio, DetailMetrics.heroMinHeight),
    DetailMetrics.heroMaxHeight
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CARRUSEL HERO A SANGRE CON FLECHAS, VOLVER, ESTADO Y COMPARTIR */}
        <PetHeroCarousel
          fotos={fotos}
          nombre={alerta.nombre || 'Mascota'}
          estado={alerta.estado}
          alturaHero={alturaHero}
          insetSuperior={insets.top}
          onVolver={handleVolver}
          onCompartir={handleCompartir}
        />

        {/* CONTENIDO PRINCIPAL EN TARJETA EDITORIAL */}
        <View style={styles.cuerpoPrincipal}>
          {/* CABECERA CON NOMBRE, RECOMPENSA Y ESPECIE */}
          <PetInfoHeader
            nombre={alerta.nombre || 'Mascota sin nombre'}
            especie={alerta.especie}
            tiempoRelativo={tiempoRelativo}
            recompensa={recompensaFormateada}
          />

          {/* DESCRIPCIÓN Y SEÑAS PARTICULARES */}
          <View style={styles.seccionDescripcion}>
            <Text style={styles.textoDescripcion}>
              {alerta.descripcion || 'Sin señas particulares ni descripción provista por el autor.'}
            </Text>
          </View>

          {/* SECCIÓN DE ÚLTIMA VEZ VISTO CON MAPA LEAFLET */}
          <PetLocationSection
            ubicacion={ubicacionResuelta}
            tiempoRelativo={tiempoRelativo}
            colorPin={presentacionEstado.color}
            onAbrirMapa={() => router.push('/(tabs)/mapa')}
          />

          {/* TARJETA DEL AUTOR / VECINO */}
          <PetAuthorCard
            nombre={alerta.usuario?.nombre || 'Vecino de Pilar'}
            avatarUrl={alerta.usuario?.avatarUrl}
            telefonoDisponible={telefonoDisponible}
          />
        </View>

        {/* ESPACIADOR INFERIOR EXACTO PARA LA BARRA STICKY DE CONTACTO */}
        <View style={{ height: alturaBarraContacto + Spacing.base }} />
      </ScrollView>

      {/* BARRA INFERIOR STICKY: CONTACTAR POR WHATSAPP CON ELEVACIÓN SEGURA */}
      <PetContactBar
        telefonoDisponible={telefonoDisponible}
        contactando={contactando}
        insetInferior={insets.bottom}
        onContactar={handleContactarWhatsApp}
        onCambioAltura={setAlturaBarraContacto}
      />
    </View>
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
    maxWidth: DetailMetrics.errorTextMaxWidth,
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
  scrollContent: {
    paddingBottom: Spacing.four,
  },
  cuerpoPrincipal: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.base,
    gap: Spacing.xl,
  },
  seccionDescripcion: {
    paddingTop: Spacing.xs,
  },
  textoDescripcion: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    lineHeight: Typography.lineHeights.md,
  },
});
