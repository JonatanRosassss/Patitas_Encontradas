import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Radius } from '../../theme/tokens';
import { MapPet } from '../../types/map';

export interface MapPetCardProps {
  pet: MapPet;
  onClose: () => void;
  onViewDetail?: (id: string) => void;
  onReportSeen?: (id: string) => void;
}

export function MapPetCard({
  pet,
  onClose,
  onViewDetail,
  onReportSeen,
}: MapPetCardProps) {
  const router = useRouter();

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(pet.id);
    } else {
      router.push(`/detalle/${pet.id}` as any);
    }
  };

  const handleReportSeen = () => {
    if (onReportSeen) {
      onReportSeen(pet.id);
    } else {
      Alert.alert(
        'Aviso Comunitario',
        `Registramos tu aviso sobre ${pet.nombre}. La comunidad y sus dueños te lo agradecen.`
      );
    }
  };

  const isPerdido = pet.estado === 1;

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Cerrar ficha de mascota"
        style={styles.closeButton}
        hitSlop={8}
      >
        <Ionicons name="close" size={22} color={Colors.text} />
      </Pressable>

      <View style={styles.headerRow}>
        <Image source={pet.foto} style={styles.photo} resizeMode="cover" />
        <View style={styles.detailsContainer}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isPerdido
                    ? Colors.statusPerdidoBg
                    : Colors.statusEncontradoBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: isPerdido
                      ? Colors.statusPerdido
                      : Colors.statusEncontradoText,
                  },
                ]}
              >
                {isPerdido ? 'Alerta de Búsqueda' : 'Mascota Encontrada'}
              </Text>
            </View>
            {pet.recompensa && (
              <View style={[styles.badge, styles.rewardBadge]}>
                <Text style={styles.rewardText}>Recompensa: {pet.recompensa}</Text>
              </View>
            )}
          </View>

          <Text
            style={styles.petName}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {pet.nombre}
          </Text>
          <Text style={styles.petDescription} numberOfLines={1}>
            {pet.descripcion}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="location" size={17} color={Colors.primary} />
        <Text style={styles.metaText} numberOfLines={1}>
          {pet.ubicacion}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={17} color={Colors.textSecondary} />
        <Text style={styles.metaText} numberOfLines={1}>
          {pet.tiempo}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={handleViewDetail}
          accessibilityRole="button"
          accessibilityLabel="Ver ficha completa de la mascota"
          style={[styles.actionButton, styles.primaryButton]}
        >
          <Text style={styles.primaryButtonText}>Ver Ficha Completa</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.white} />
        </Pressable>

        <Pressable
          onPress={handleReportSeen}
          accessibilityRole="button"
          accessibilityLabel="Avisar que vi a esta mascota"
          style={[styles.actionButton, styles.secondaryButton]}
        >
          <Ionicons name="eye-outline" size={16} color={Colors.text} />
          <Text style={styles.secondaryButtonText}>Avisar que lo vi</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    bottom: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    backgroundColor: Colors.card,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    zIndex: 20,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    padding: Spacing.one,
    zIndex: 25,
  },
  headerRow: {
    flexDirection: 'row',
    paddingRight: Spacing.four,
  },
  photo: {
    width: 68,
    height: 68,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: Spacing.two,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.half + Spacing.one,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.xs,
  },
  rewardBadge: {
    backgroundColor: Colors.secondary,
  },
  rewardText: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.xs,
    color: Colors.text,
  },
  petName: {
    fontFamily: Typography.fonts.titleBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text,
    marginTop: Spacing.half,
    lineHeight: Typography.lineHeights.lg,
  },
  petDescription: {
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
    gap: Spacing.one,
  },
  metaText: {
    flex: 1,
    fontFamily: Typography.fonts.bodySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: Spacing.two + Spacing.one,
    gap: Spacing.two,
  },
  actionButton: {
    flex: 1,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    gap: Spacing.one,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.xs,
    color: Colors.white,
  },
  secondaryButton: {
    backgroundColor: Colors.background,
  },
  secondaryButtonText: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.xs,
    color: Colors.text,
  },
});
