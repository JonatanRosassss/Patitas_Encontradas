import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { WELCOME_CALLOUT_BADGES } from '@/data/welcomeData';
import type { CalloutPosition, WelcomePillarId, WelcomePillarItem } from '@/types/Welcome';

export interface WelcomeHeroStageProps {
  pilarActivo: WelcomePillarItem;
  alSeleccionarPilar: (id: WelcomePillarId) => void;
  tamanoMaximoEstimado: number;
  esCompacto: boolean;
}

export default function WelcomeHeroStage({
  pilarActivo,
  alSeleccionarPilar,
  tamanoMaximoEstimado,
  esCompacto,
}: WelcomeHeroStageProps) {
  const pulsoAnim = useRef(new Animated.Value(0)).current;
  const flotacionAnim = useRef(new Animated.Value(0)).current;
  const [altoMedido, setAltoMedido] = useState<number>(tamanoMaximoEstimado);

  useEffect(() => {
    const loopPulso = Animated.loop(
      Animated.sequence([
        Animated.timing(pulsoAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pulsoAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    );

    const loopFlotacion = Animated.loop(
      Animated.sequence([
        Animated.timing(flotacionAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(flotacionAnim, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    loopPulso.start();
    loopFlotacion.start();

    return () => {
      loopPulso.stop();
      loopFlotacion.stop();
    };
  }, [flotacionAnim, pulsoAnim]);

  const manejarLayout = (evento: LayoutChangeEvent) => {
    const { height, width } = evento.nativeEvent.layout;
    if (height > 0 && width > 0) {
      setAltoMedido(Math.min(height, width * 0.86));
    }
  };

  const desplazamientoVertical = flotacionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  const escalaPulso = pulsoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const obtenerEstiloPosicionCallout = (posicion: CalloutPosition): ViewStyle => {
    if (posicion === 'topLeft') {
      return styles.calloutTopLeft;
    }
    if (posicion === 'topRight') {
      return styles.calloutTopRight;
    }
    return styles.calloutBottomRight;
  };

  const tamanoEfectivo = Math.max(Math.min(altoMedido, tamanoMaximoEstimado), 160);
  const diametroAuraExterior = Math.round(tamanoEfectivo * 0.92);
  const diametroAuraInterior = Math.round(tamanoEfectivo * 0.68);
  const tamanoIlustracion = Math.round(tamanoEfectivo * 0.98);

  return (
    <View style={styles.escenarioContenedor} onLayout={manejarLayout}>
      {/* Aura cálida radial de fondo unificada con Colors.secondary y Colors.primary */}
      <View
        style={[
          styles.auraExterior,
          { width: diametroAuraExterior, height: diametroAuraExterior },
        ]}
      />
      <View
        style={[
          styles.auraInterior,
          { width: diametroAuraInterior, height: diametroAuraInterior },
        ]}
      />

      {/* Ilustración 3D central de las mascotas sobre el mapa barrial */}
      <Animated.View
        style={[
          styles.ilustracionEnvoltura,
          {
            width: tamanoIlustracion,
            height: tamanoIlustracion,
            transform: [{ translateY: desplazamientoVertical }],
          },
        ]}
      >
        <Image
          source={require('../../assets/welcome_hero_3d.png')}
          style={styles.ilustracionHero}
          resizeMode="contain"
        />

        {/* Etiqueta flotante de estado PERDIDO justo sobre el pin izquierdo */}
        <Animated.View
          style={[
            styles.badgeEstadoMapa,
            styles.badgePerdidoPosicion,
            { transform: [{ scale: escalaPulso }] },
          ]}
        >
          <Text maxFontSizeMultiplier={1.05} style={styles.textoBadgeEstado}>
            {pilarActivo.badgeperdidoTexto}
          </Text>
        </Animated.View>

        {/* Etiqueta flotante de estado ENCONTRADO justo sobre el pin derecho */}
        <View style={[styles.badgeEstadoMapa, styles.badgeEncontradoPosicion]}>
          <Text maxFontSizeMultiplier={1.05} style={styles.textoBadgeEstado}>
            {pilarActivo.badgeEncontradoTexto}
          </Text>
        </View>
      </Animated.View>

      {/* Tarjetas flotantes inclinadas (Callouts interactivos responsivos) */}
      {WELCOME_CALLOUT_BADGES.map((callout) => {
        const esActivo = callout.pilarAsociado === pilarActivo.id;
        return (
          <Pressable
            key={callout.id}
            onPress={() => alSeleccionarPilar(callout.pilarAsociado)}
            accessibilityRole="button"
            accessibilityLabel={callout.texto.replace('\n', ' ')}
            style={[
              styles.tarjetaCallout,
              esCompacto && styles.tarjetaCalloutCompacta,
              obtenerEstiloPosicionCallout(callout.posicion),
              esActivo && styles.tarjetaCalloutActiva,
              {
                transform: [
                  { rotate: `${callout.rotacionGrados}deg` },
                  { scale: esActivo ? 1.03 : 1 },
                ],
              },
            ]}
          >
            <Text
              maxFontSizeMultiplier={1.05}
              style={[
                styles.textoCallout,
                esCompacto && styles.textoCalloutCompacto,
                esActivo && styles.textoCalloutActivo,
              ]}
            >
              {callout.texto} <Text style={styles.emojiCallout}>{callout.emoji}</Text>
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  escenarioContenedor: {
    flex: 1,
    width: '100%',
    minHeight: 165,
    maxHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  auraExterior: {
    position: 'absolute',
    borderRadius: Radius.full,
    backgroundColor: Colors.welcomeGlowOuter,
  },
  auraInterior: {
    position: 'absolute',
    borderRadius: Radius.full,
    backgroundColor: Colors.welcomeGlowInner,
  },
  ilustracionEnvoltura: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ilustracionHero: {
    width: '100%',
    height: '100%',
  },
  badgeEstadoMapa: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.half,
    borderRadius: Radius.full,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 4,
  },
  badgePerdidoPosicion: {
    top: '50%',
    left: '14%',
    backgroundColor: Colors.statusPerdido,
  },
  badgeEncontradoPosicion: {
    top: '45%',
    right: '5%',
    backgroundColor: Colors.statusAdopcion,
  },
  textoBadgeEstado: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 0.4,
  },
  tarjetaCallout: {
    position: 'absolute',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm + Spacing.half,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tarjetaCalloutCompacta: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.half + 1,
  },
  tarjetaCalloutActiva: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accent,
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  calloutTopLeft: {
    top: '10%',
    left: 2,
  },
  calloutTopRight: {
    top: '6%',
    right: 2,
  },
  calloutBottomRight: {
    bottom: '2%',
    right: 4,
  },
  textoCallout: {
    fontFamily: Typography.fonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  textoCalloutCompacto: {
    fontSize: 10,
    lineHeight: 13,
  },
  textoCalloutActivo: {
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },
  emojiCallout: {
    fontSize: 10,
  },
});
