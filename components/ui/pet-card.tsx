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

  useEffect(() => {
    setImagenValida(true);
  }, [imagen]);

  const isPerdido = estado.toUpperCase() === 'PERDIDO';

  const guardarPublicacion = () => {
    setMostrarToast(true);

    setTimeout(() => {
      setMostrarToast(false);
    }, 2000);
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500';

  return (
    <View style={styles.petCard}>
      {mostrarToast && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>
            Publicación guardada
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
          pressed && styles.saveButtonPressed,
        ]}
        onPress={guardarPublicacion}
        accessibilityRole="button"
        accessibilityLabel="Guardar publicación"
        hitSlop={8}
      >
        <Ionicons
          name="bookmark-outline"
          size={16}
          color={Colors.white}
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
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
    zIndex: 2,
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
