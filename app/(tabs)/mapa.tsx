
import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Typography, Spacing } from '../../constants/theme';
import { Radius } from '../../theme/tokens';
import { MAP_FILTERS } from '../../data/mapMockData';
import { useMapState } from '../../hooks/useMapState';
import { MapContainer } from '../../components/map/MapContainer';
import { MapSearchBar } from '../../components/map/MapSearchBar';
import { MapFilterChips } from '../../components/map/MapFilterChips';
import { MapControls } from '../../components/map/MapControls';
import { MapPetCard } from '../../components/map/MapPetCard';

import { useAuth } from '../../services/AuthContext';
import { obtenerAlertaPorId } from '../../services/mascotasService';
import { crearNotificacion } from '../../services/notificaciones';

type AvisoPantalla = {
  tipo: 'exito' | 'error' | 'info';
  mensaje: string;
};

export default function MapaScreen() {
  const { usuario } = useAuth();

  const [enviandoAvistamiento, setEnviandoAvistamiento] =
    useState(false);
  const [avisoPantalla, setAvisoPantalla] =
    useState<AvisoPantalla | null>(null);

  const {
    filtro,
    setFiltro,
    selectedPet,
    setSelectedPet,
    searchQuery,
    setSearchQuery,
    userLocation,
    isLocating,
    filteredPets,
    handleLocate,
    handleZoomIn,
    handleZoomOut,
    mapContainerRef,
  } = useMapState();

  const mostrarAviso = (
    tipo: AvisoPantalla['tipo'],
    mensaje: string
  ) => {
    setAvisoPantalla({ tipo, mensaje });

    // Alert.alert funciona en dispositivos nativos.
    // En web mostramos el mensaje dentro de la pantalla.
    if (Platform.OS !== 'web') {
      Alert.alert(
        tipo === 'exito'
          ? '¡Aviso enviado!'
          : tipo === 'error'
            ? 'No se pudo enviar'
            : 'Atención',
        mensaje
      );
    }
  };

  /**
   * Avisa al dueño de la publicación que alguien vio a su mascota.
   */
  const handleReportSeen = async (idAlerta: string) => {
    if (enviandoAvistamiento) return;

    setAvisoPantalla(null);

    if (!usuario?.uid) {
      mostrarAviso(
        'info',
        'Necesitás iniciar sesión para avisarle al dueño de la mascota.'
      );
      return;
    }

    if (!idAlerta) {
      mostrarAviso(
        'error',
        'No pudimos identificar la publicación seleccionada.'
      );
      return;
    }

    try {
      setEnviandoAvistamiento(true);

      console.log(
        '[Avistamiento] Buscando publicación:',
        idAlerta
      );

      const alerta = await obtenerAlertaPorId(idAlerta);

      if (!alerta) {
        mostrarAviso(
          'error',
          'No encontramos esta publicación en Firebase. Puede que el marcador corresponda a datos de prueba.'
        );
        return;
      }

      // Verificamos que la publicación tenga un usuario creador.
      if (!alerta.creadoPor || alerta.creadoPor === 'anonimo') {
        mostrarAviso(
          'error',
          'La publicación no tiene un dueño asociado, por lo que no podemos enviarle la notificación.'
        );
        return;
      }

      // No permitir que una persona se notifique a sí misma.
      if (alerta.creadoPor === usuario.uid) {
        mostrarAviso(
          'info',
          'Esta es tu publicación. No necesitás enviarte un aviso a vos mismo.'
        );
        return;
      }

      await crearNotificacion({
        destinatarioId: alerta.creadoPor,
        tipo: 'avistamiento',
        titulo: '¡Alguien vio a tu mascota!',
        mensaje: `Una persona de la comunidad indicó que vio a ${
          alerta.nombre || 'tu mascota'
        }. Ingresá a Patitas Encontradas para revisar tu publicación.`,
        publicacionId: idAlerta,
      });

      console.log(
        '[Avistamiento] Notificación creada para:',
        alerta.creadoPor
      );

      mostrarAviso(
        'exito',
        'Le avisamos al dueño de la publicación que viste a esta mascota.'
      );
    } catch (error) {
      console.error(
        '[Avistamiento] Error al enviar la notificación:',
        error
      );

      mostrarAviso(
        'error',
        'No se pudo enviar el aviso. Revisá la conexión y los permisos de Firestore.'
      );
    } finally {
      setEnviandoAvistamiento(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.card}
      />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Mapa Comunitario 🗺️
            </Text>

            <Text style={styles.subtitle}>
              Radar de alertas y campañas en Pilar
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>En Vivo</Text>
          </View>
        </View>

        <MapSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <MapFilterChips
          filters={MAP_FILTERS}
          selectedFilterIndex={filtro}
          onSelectFilter={setFiltro}
        />
      </View>

      <View style={styles.mapWrapper}>
        <MapContainer
          ref={mapContainerRef}
          pets={filteredPets}
          selectedPet={selectedPet}
          onSelectPet={setSelectedPet}
          userLocation={userLocation}
        />

        <MapControls
          onLocate={handleLocate}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isLocating={isLocating}
        />

        {selectedPet && (
          <MapPetCard
            pet={selectedPet}
            onClose={() => setSelectedPet(null)}
            onReportSeen={handleReportSeen}
          />
        )}

        {avisoPantalla && (
          <View
            accessibilityRole="alert"
            style={[
              styles.aviso,
              avisoPantalla.tipo === 'exito'
                ? styles.avisoExito
                : avisoPantalla.tipo === 'error'
                  ? styles.avisoError
                  : styles.avisoInfo,
            ]}
          >
            <Text style={styles.avisoTitulo}>
              {avisoPantalla.tipo === 'exito'
                ? '¡Listo!'
                : avisoPantalla.tipo === 'error'
                  ? 'No se pudo completar'
                  : 'Atención'}
            </Text>

            <Text style={styles.avisoTexto}>
              {avisoPantalla.mensaje}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.card,
  },

  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    zIndex: 10,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontFamily: Typography.fonts.titleBold,
    fontSize: Typography.sizes.xxl,
    color: Colors.text,
    lineHeight: Typography.lineHeights.xxl,
  },

  subtitle: {
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.half,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accent,
    gap: Spacing.half,
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  liveText: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.xs,
    color: Colors.text,
  },

  mapWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.backgroundLight,
  },

  aviso: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    bottom: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    zIndex: 100,
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
    }),
  },

  avisoExito: {
    backgroundColor: '#E8F7ED',
    borderColor: '#71C58A',
  },

  avisoError: {
    backgroundColor: '#FFF0EE',
    borderColor: '#E58A7F',
  },

  avisoInfo: {
    backgroundColor: Colors.card,
    borderColor: Colors.secondary,
  },

  avisoTitulo: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    marginBottom: Spacing.half,
  },

  avisoTexto: {
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
    color: Colors.text,
  },
});
