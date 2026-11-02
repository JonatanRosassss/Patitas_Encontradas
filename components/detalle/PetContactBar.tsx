import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radius, DetailMetrics } from '@/constants/theme';
import type { PetContactBarProps } from '@/types/Detalle';

export function PetContactBar({
  telefonoDisponible,
  contactando,
  insetInferior,
  onContactar,
  onCambioAltura,
}: PetContactBarProps) {
  const bottomPadding = Math.max(insetInferior, Spacing.base);

  const handleLayout = (e: LayoutChangeEvent) => {
    const altura = e.nativeEvent.layout.height;
    if (altura > 0) {
      onCambioAltura(altura);
    }
  };

  return (
    <View
      style={[
        styles.barraFlotante,
        {
          paddingBottom: bottomPadding,
        },
      ]}
      onLayout={handleLayout}
    >
      <Pressable
        style={({ pressed }) => [
          styles.boton,
          pressed && styles.botonPressed,
          contactando && styles.botonDeshabilitado,
        ]}
        onPress={onContactar}
        disabled={contactando}
        accessibilityRole="button"
        accessibilityLabel="Contactar a quien publicó por WhatsApp"
      >
        {contactando ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <>
            <Ionicons name="logo-whatsapp" size={DetailMetrics.iconLg} color={Colors.white} />
            <Text style={styles.textoBoton}>
              {telefonoDisponible ? 'CONTACTAR POR WHATSAPP' : 'CONTACTAR AL VECINO'}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  barraFlotante: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    zIndex: 100,
    ...Platform.select({
      web: {
        boxShadow: '0px -3px 12px rgba(90, 58, 31, 0.10)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 12,
      },
    }),
  },
  boton: {
    backgroundColor: Colors.detailWhatsapp,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: DetailMetrics.contactButtonHeight,
    borderRadius: Radius.full,
  },
  botonPressed: {
    backgroundColor: Colors.detailWhatsappPressed,
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  botonDeshabilitado: {
    opacity: 0.65,
  },
  textoBoton: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.md,
    letterSpacing: 0.5,
  },
});
