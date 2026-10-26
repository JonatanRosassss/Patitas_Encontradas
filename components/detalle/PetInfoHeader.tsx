import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { capitalizar, obtenerEtiquetaEspecie } from '@/utils/detalleMascota';
import type { PetInfoHeaderProps } from '@/types/Detalle';

export function PetInfoHeader({
  nombre,
  especie,
  tiempoRelativo,
  recompensa,
}: PetInfoHeaderProps) {
  const nombreMostrado = capitalizar(nombre || 'Mascota sin nombre');
  const especieTexto = obtenerEtiquetaEspecie(especie);

  return (
    <View style={styles.contenedor}>
      {/* FILA DE NOMBRE Y RECOMPENSA */}
      <View style={styles.filaTitulo}>
        <Text style={styles.nombre} numberOfLines={1}>
          {nombreMostrado}
        </Text>

        {recompensa && (
          <View style={styles.recompensaBadge}>
            <Text style={styles.recompensaPrefijo}>Recompensa: </Text>
            <Text style={styles.recompensaMonto}>{recompensa}</Text>
          </View>
        )}
      </View>

      {/* SUBTÍTULO: ESPECIE */}
      <View style={styles.filaSubtitulo}>
        <Text style={styles.especie}>{especieTexto}</Text>
        {tiempoRelativo ? (
          <>
            <Text style={styles.separador}>·</Text>
            <Text style={styles.tiempo}>{tiempoRelativo}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: Spacing.xs,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  nombre: {
    flex: 1,
    fontSize: Typography.sizes.display,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    lineHeight: Typography.lineHeights.display,
  },
  recompensaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.detailRewardBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.detailRewardBorder,
  },
  recompensaPrefijo: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.detailReward,
  },
  recompensaMonto: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.detailReward,
  },
  filaSubtitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  especie: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textSecondary,
  },
  separador: {
    fontSize: Typography.sizes.md,
    color: Colors.textMuted,
  },
  tiempo: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textMuted,
  },
});
