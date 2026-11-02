import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, DetailMetrics, Radius } from '@/constants/theme';
import type { PetFloatingButtonProps } from '@/types/Detalle';

export function PetFloatingButton({
  icono,
  onPress,
  accessibilityLabel,
  tamano = DetailMetrics.floatingButtonSize,
  tamanoIcono = DetailMetrics.floatingIconSize,
  style,
}: PetFloatingButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.boton,
        {
          width: tamano,
          height: tamano,
          borderRadius: Radius.full,
          backgroundColor: pressed
            ? Colors.detailOverlayButtonPressed
            : Colors.detailOverlayButton,
        },
        style,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
    >
      <Ionicons name={icono} size={tamanoIcono} color={Colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(90, 58, 31, 0.18)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 5,
        elevation: 4,
      },
    }),
  },
});
