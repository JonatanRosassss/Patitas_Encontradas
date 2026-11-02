
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  Colors,
  Typography,
  Spacing,
  Radius,
} from '@/constants/theme';

import {
  guardarPublicacion,
  quitarPublicacionGuardada,
  obtenerIdsPublicacionesGuardadas,
} from '@/services/mascotasService';

export interface PetCardProps {
  id?: string;
  tipo: string;
  estado: string;
  nombre: string;
  imagen: string;
  ubicacion?: string;
  tiempo?: string;
  recompensa?: string | null;
  onPress?: () => void;
}

export function PetCard({
  id,
  tipo,
  estado,
  nombre,
  imagen,
  ubicacion,
  tiempo,
  recompensa,
  onPress,
}: PetCardProps) {
  const [mostrarToast, setMostrarToast] = useState(false);
  const [imagenValida, setImagenValida] = useState(true);
  const [guardada, setGuardada] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  // Consultar si la publicación está guardada
  useEffect(() => {
    let activo = true;

    const cargarEstadoGuardado = async () => {
      if (!id) return;

      try {
        const idsGuardados = await obtenerIdsPublicacionesGuardadas();

        if (activo) {
          setGuardada(idsGuardados.includes(id));
        }
      } catch {
        // El usuario puede no haber iniciado sesión.
      }
    };

    cargarEstadoGuardado();

    return () => {
      activo = false;
    };
  }, [id]);

  const isPerdido = estado.toUpperCase() === 'PERDIDO';

  // Mostrar notificación temporal
  const mostrarMensaje = (mensaje: string, duracion = 2500) => {
    setMensajeToast(mensaje);
    setMostrarToast(true);

    setTimeout(() => {
      setMostrarToast(false);
    }, duracion);
  };

  // Guardar o quitar publicación
  const manejarGuardado = async () => {
    if (!id || guardando) return;

    try {
      setGuardando(true);

      if (guardada) {
        await quitarPublicacionGuardada(id);
        setGuardada(false);
        mostrarMensaje('Publicación eliminada de tus guardados');
      } else {
        await guardarPublicacion(id);
        setGuardada(true);
        mostrarMensaje('¡Publicación guardada correctamente!');
      }
    } catch (error) {
      mostrarMensaje(
        error instanceof Error
          ? error.message
          : 'No se pudo completar la operación',
        3000
      );
    } finally {
      setGuardando(false);
    }
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500';

  return (
    <View style={styles.petCard}>

      {/* Notificación */}
      {mostrarToast && (
        <View style={styles.toast} pointerEvents="none">
          <Ionicons
            name="checkmark-circle"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.toastText}>
            {mensajeToast}
          </Text>
        </View>
      )}

      {/* Contenido principal de la tarjeta */}
      <Pressable
        style={({ pressed }) => [
          styles.petContent,
          pressed && styles.petCardPressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ficha de ${nombre}, ${estado}`}
      >

        {/* Imagen de la mascota */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: imagenValida && imagen
                ? imagen
                : fallbackImage,
            }}
            style={styles.petImage}
            resizeMode="cover"
            onError={() => setImagenValida(false)}
          />
        </View>

        {/* Información principal */}
        <View style={styles.petInfo}>

          {/* Estado y recompensa */}
          <View style={styles.petTopRow}>
            <View
              style={[
                styles.petStatus,
                {
                  backgroundColor: isPerdido
                    ? Colors.statusPerdidoBg
                    : Colors.statusEncontradoBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.petStatusText,
                  {
                    color: isPerdido
                      ? Colors.statusPerdido
                      : Colors.statusEncontradoText,
                  },
                ]}
              >
                {isPerdido ? 'Perdido' : 'Encontrado'}
              </Text>
            </View>

            {recompensa ? (
              <View style={styles.recompensaBadge}>
                <Text style={styles.recompensaText}>
                  Recompensa
                </Text>
              </View>
            ) : null}
          </View>

          {/* Nombre */}
          <Text
            style={styles.petName}
            numberOfLines={1}
          >
            {nombre}
          </Text>

          {/* Tipo de mascota */}
          <View style={styles.tagRow}>
            <Ionicons
              name={
                tipo.toUpperCase() === 'GATO'
                  ? 'logo-octocat'
                  : 'paw'
              }
              size={15}
              color={Colors.primary}
            />
            <Text style={styles.infoText}>
              {tipo.toUpperCase()}
            </Text>
          </View>

          {/* Ubicación */}
          {ubicacion ? (
            <View style={styles.metaRow}>
              <Ionicons
                name="location-outline"
                size={15}
                color={Colors.textSecondary}
              />
              <Text
                style={styles.metaText}
                numberOfLines={2}
              >
                {ubicacion}
              </Text>
            </View>
          ) : null}

          {/* Tiempo */}
          {tiempo ? (
            <View style={styles.metaRow}>
              <Ionicons
                name="time-outline"
                size={15}
                color={Colors.textMuted}
              />
              <Text
                style={styles.metaMutedText}
                numberOfLines={1}
              >
                {tiempo}
              </Text>
            </View>
          ) : null}

        </View>
      </Pressable>

      {/* Botón guardar independiente */}
      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          guardada && styles.saveButtonGuardado,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={manejarGuardado}
        disabled={guardando}
        accessibilityRole="button"
        accessibilityLabel={
          guardada
            ? 'Quitar de guardados'
            : 'Guardar publicación'
        }
        hitSlop={8}
      >
        <Ionicons
          name={guardada ? 'bookmark' : 'bookmark-outline'}
          size={19}
          color={guardada ? '#F28C28' : Colors.white}
        />
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({

  // Tarjeta completa
  petCard: {
    width: '100%',
    minWidth: 0,
    minHeight: 120,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm + Spacing.xs,
    position: 'relative',

    ...Platform.select({
      web: {
        boxShadow: '0px 2px 6px rgba(90, 58, 31, 0.08)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },

  // Contenedor de imagen e información
  petContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  petCardPressed: {
    opacity: 0.92,
  },

  // Imagen
  imageContainer: {
    width: 95,
    height: 95,
    flexShrink: 0,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.accent,
    marginRight: Spacing.md,
  },

  petImage: {
    width: '100%',
    height: '100%',
  },

  // Información
  petInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: Spacing.xs,
  },

  petTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.half,
  },

  petStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },

  petStatusText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
  },

  recompensaBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },

  recompensaText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },

  petName: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    lineHeight: Typography.lineHeights.lg,
  },

  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },

  infoText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.primary,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minWidth: 0,
  },

  metaText: {
    flex: 1,
    minWidth: 0,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },

  metaMutedText: {
    flex: 1,
    minWidth: 0,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textMuted,
  },

  // Botón guardar
  saveButton: {
    width: 36,
    height: 36,
    flexShrink: 0,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
    zIndex: 2,
  },

  saveButtonGuardado: {
    backgroundColor: '#FFF0DF',
    borderWidth: 1,
    borderColor: '#F28C28',
  },

  saveButtonPressed: {
    opacity: 0.75,
  },

  // Toast
  toast: {
    position: 'absolute',
    top: Spacing.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.overlay,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    zIndex: 20,
  },

  toastText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
  },

});
