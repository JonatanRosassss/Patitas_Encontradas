import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { WELCOME_PILLARS } from '@/data/welcomeData';
import type { WelcomePillarId } from '@/types/Welcome';

export interface WelcomeFeaturePillsProps {
  pilarActivoId: WelcomePillarId;
  alSeleccionarPilar: (id: WelcomePillarId) => void;
  esCompacto: boolean;
}

export default function WelcomeFeaturePills({
  pilarActivoId,
  alSeleccionarPilar,
  esCompacto,
}: WelcomeFeaturePillsProps) {
  return (
    <View style={[styles.contenedorSeccion, esCompacto && styles.contenedorSeccionCompacto]}>
      {/* Fila responsiva de 3 píldoras que nunca se desborda en pantallas de 320-360dp */}
      <View style={styles.filaPildoras}>
        {WELCOME_PILLARS.map((pilar) => {
          const esActivo = pilar.id === pilarActivoId;
          return (
            <Pressable
              key={pilar.id}
              onPress={() => alSeleccionarPilar(pilar.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: esActivo }}
              accessibilityLabel={`${pilar.etiqueta}`}
              style={({ pressed }) => [
                styles.pildora,
                esCompacto && styles.pildoraCompacta,
                esActivo && styles.pildoraActiva,
                pressed && styles.pildoraPresionada,
              ]}
            >
              <Text maxFontSizeMultiplier={1} style={styles.emojiPildora}>
                {pilar.emoji}
              </Text>
              <Text
                style={[
                  styles.textoPildora,
                  esCompacto && styles.textoPildoraCompacto,
                  esActivo && styles.textoPildoraActiva,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                maxFontSizeMultiplier={1.05}
              >
                {pilar.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Indicadores de paginación unificados con Colors.primary y Colors.secondary */}
      <View style={[styles.filaPaginacion, esCompacto && styles.filaPaginacionCompacta]}>
        {WELCOME_PILLARS.map((pilar) => {
          const esActivo = pilar.id === pilarActivoId;
          return (
            <Pressable
              key={`dot-${pilar.id}`}
              onPress={() => alSeleccionarPilar(pilar.id)}
              hitSlop={Spacing.sm}
              accessibilityRole="button"
              accessibilityLabel={`Ver resumen de ${pilar.etiqueta}`}
              style={[
                styles.puntoPaginacion,
                esActivo ? styles.puntoPaginacionActivo : styles.puntoPaginacionInactivo,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorSeccion: {
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  contenedorSeccionCompacto: {
    marginTop: Spacing.xs,
  },
  filaPildoras: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: Spacing.xs + Spacing.half,
  },
  pildora: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.xs + Spacing.half,
    paddingVertical: Spacing.xs + Spacing.half,
    borderRadius: Radius.full,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    gap: Spacing.one,
  },
  pildoraCompacta: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs + 1,
  },
  pildoraActiva: {
    backgroundColor: Colors.accent,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
  pildoraPresionada: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  emojiPildora: {
    fontSize: 11,
  },
  textoPildora: {
    flexShrink: 1,
    fontFamily: Typography.fonts.bodySemiBold,
    fontSize: 11,
    color: Colors.text,
    textAlign: 'center',
  },
  textoPildoraCompacto: {
    fontSize: 10.5,
  },
  textoPildoraActiva: {
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },
  filaPaginacion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  filaPaginacionCompacta: {
    marginTop: Spacing.sm,
  },
  puntoPaginacion: {
    height: Spacing.sm - 1,
    borderRadius: Radius.full,
  },
  puntoPaginacionActivo: {
    width: Spacing.xl + Spacing.xs,
    backgroundColor: Colors.primary,
  },
  puntoPaginacionInactivo: {
    width: Spacing.sm - 1,
    backgroundColor: Colors.secondary,
  },
});
