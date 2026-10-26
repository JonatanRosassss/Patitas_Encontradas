import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radius, DetailMetrics } from '@/constants/theme';
import type { PetAuthorCardProps } from '@/types/Detalle';

export function PetAuthorCard({
  nombre,
  avatarUrl,
  telefonoDisponible,
}: PetAuthorCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={DetailMetrics.iconLg} color={Colors.primary} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Publicado por</Text>
        <Text style={styles.nombre} numberOfLines={1}>
          {nombre}
        </Text>
        <Text style={styles.subtitulo}>
          {telefonoDisponible
            ? 'Contacto por WhatsApp disponible'
            : 'Sin número directo'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  avatarContainer: {
    width: DetailMetrics.avatarSize,
    height: DetailMetrics.avatarSize,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },
  nombre: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  subtitulo: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textMuted,
    marginTop: Spacing.half,
  },
});
