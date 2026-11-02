import React, { useState, useEffect } from 'react';
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
  const [mensajeToast, setMensajeToast] = useState('');
  const [imagenValida, setImagenValida] = useState(true);
  const [guardada, setGuardada] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setImagenValida(true);
  }, [imagen]);

  // Consultar si la publicación está guardada
  useEffect(() => {
    let montado = true;

    async function verificarGuardado() {
      if (!id) return;

      try {
        const guardadas = await obtenerIdsPublicacionesGuardadas();
        if (montado) {
          setGuardada(guardadas.includes(id));
        }
      } catch {
        // Si no está autenticado o falla la consulta, no marcamos como guardada
      }
    }

    verificarGuardado();

    return () => {
      montado = false;
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

  const esArchivoLocalEnWeb =
    Platform.OS === 'web' && typeof imagen === 'string' && imagen.startsWith('file://');

  const uriImagenFinal =
    imagenValida && imagen && !esArchivoLocalEnWeb
      ? imagen
      : fallbackImage;

  return (
    <View style={styles.petCard}>
      {mostrarToast && (
        <View style={[styles.toast, { pointerEvents: 'none' }]}>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.toastText}>
            {mensajeToast || 'Publicación guardada'}
          </Text>
        </View>
      )}

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
            testID="pet-card-image"
            accessibilityRole="image"
            source={{ uri: uriImagenFinal }}
            style={styles.petImage}
            resizeMode="cover"
            onError={() => setImagenValida(false)}
          />
        </View>

        {/* Información principal */}
        <View style={styles.petInfo}>
          <View style={styles.petTopRow}>
            <View style={styles.badgesGroup}>
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
                  numberOfLines={1}
                >
                  {isPerdido ? 'Perdido' : 'Encontrado'}
                </Text>
              </View>

              {recompensa ? (
                <View style={styles.recompensaBadge}>
                  <Ionicons name="gift-outline" size={11} color={Colors.text} />
                  <Text style={styles.recompensaText} numberOfLines={1}>
                    Recompensa
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text
            style={styles.petName}
            numberOfLines={1}
          >
            {nombre}
          </Text>

          <View style={styles.tagRow}>
            <Ionicons
              name={
                tipo.toUpperCase() === 'GATO'
                  ? 'logo-octocat'
                  : 'paw'
              }
              size={13}
              color={Colors.primary}
            />
            <Text style={styles.infoText}>
              {tipo.toUpperCase()}
            </Text>
          </View>

          {ubicacion ? (
            <View style={styles.metaRow}>
              <Ionicons
                name="location-outline"
                size={13}
                color={Colors.textSecondary}
              />
              <Text
                style={styles.metaText}
                numberOfLines={1}
              >
                {ubicacion}
              </Text>
            </View>
          ) : null}

          {tiempo ? (
            <View style={styles.metaRow}>
              <Ionicons
                name="time-outline"
                size={13}
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

      {/* Botón guardar independiente de la tarjeta */}
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
          size={18}
          color={guardada ? '#F28C28' : Colors.white}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  petCard: {
    width: '100%',
    backgroundColor: Colors.card,
    flexDirection: 'row',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm + Spacing.xs,
    minHeight: 120,
    alignItems: 'center',
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

  petContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },

  petCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  imageContainer: {
    width: 95,
    height: 95,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.accent,
    marginRight: Spacing.md,
  },

  petImage: {
    width: '100%',
    height: '100%',
  },

  petInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: Spacing.xs,
  },

  petTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.half,
  },
  badgesGroup: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
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

  saveButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
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
  },

  metaText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    flex: 1,
  },

  metaMutedText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textMuted,
    flex: 1,
  },

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
