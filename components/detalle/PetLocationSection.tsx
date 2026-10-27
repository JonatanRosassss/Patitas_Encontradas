import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { PetLocationMap } from './PetLocationMap';
import type { PetLocationSectionProps } from '@/types/Detalle';

export function PetLocationSection({
  ubicacion,
  tiempoRelativo,
  colorPin,
  onAbrirMapa,
}: PetLocationSectionProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Última vez visto</Text>

      {/* METADATOS DE UBICACIÓN CLICKEABLES */}
      <Pressable
        style={({ pressed }) => [
          styles.filaMetadatos,
          pressed && styles.filaMetadatosPressed,
        ]}
        onPress={onAbrirMapa}
        accessibilityRole="button"
        accessibilityLabel={`Abrir mapa en ${ubicacion.direccion}`}
      >
        <Ionicons name="location" size={18} color={Colors.primary} />
        <Text style={styles.textoMetadatos} numberOfLines={2}>
          {ubicacion.direccion}
          {tiempoRelativo ? ` - ${tiempoRelativo}` : ''}
        </Text>
        <View style={styles.badgeVerMapa}>
          <Text style={styles.badgeVerMapaTexto}>Ver en mapa</Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
        </View>
      </Pressable>

      {/* AVISO DISCRETO SI ES ZONA APROXIMADA */}
      {ubicacion.esAproximada && (
        <View style={styles.chipAproximado}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.textoAproximado}>
            Ubicación aproximada en base a la zona de Pilar
          </Text>
        </View>
      )}

      {/* MAPA EMBEBIDO */}
      <PetLocationMap
        coordenadas={ubicacion.coordenadas}
        esAproximada={ubicacion.esAproximada}
        colorPin={colorPin}
        onPress={onAbrirMapa}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: Spacing.sm,
  },
  titulo: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  filaMetadatos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  filaMetadatosPressed: {
    opacity: 0.7,
  },
  badgeVerMapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeVerMapaTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.primary,
  },
  textoMetadatos: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeights.sm,
  },
  chipAproximado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  textoAproximado: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textSecondary,
  },
});
