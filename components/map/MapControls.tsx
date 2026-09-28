import React from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../constants/theme';
import { Radius } from '../../theme/tokens';

export interface MapControlsProps {
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut?: () => void;
  isLocating?: boolean;
}

export function MapControls({
  onLocate,
  onZoomIn,
  onZoomOut,
  isLocating = false,
}: MapControlsProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <Pressable
        onPress={onLocate}
        disabled={isLocating}
        accessibilityRole="button"
        accessibilityLabel="Centrar en mi ubicación actual"
        style={[styles.button, styles.locateButton]}
      >
        {isLocating ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={24}
            color={Colors.white}
          />
        )}
      </Pressable>

      <Pressable
        onPress={onZoomIn}
        accessibilityRole="button"
        accessibilityLabel="Acercar mapa"
        style={[styles.button, styles.zoomButton]}
      >
        <Ionicons name="add" size={26} color={Colors.primary} />
      </Pressable>

      {onZoomOut && (
        <Pressable
          onPress={onZoomOut}
          accessibilityRole="button"
          accessibilityLabel="Alejar mapa"
          style={[styles.button, styles.zoomButton]}
        >
          <Ionicons name="remove" size={26} color={Colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    gap: Spacing.two,
    zIndex: 10,
  },
  button: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locateButton: {
    backgroundColor: Colors.primary,
  },
  zoomButton: {
    backgroundColor: Colors.card,
  },
});
