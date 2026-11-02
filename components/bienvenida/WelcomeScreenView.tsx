import React, { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, MaxContentWidth, Radius, Spacing, Typography } from '@/constants/theme';
import { WELCOME_PILLARS } from '@/data/welcomeData';
import type { WelcomePillarId } from '@/types/Welcome';
import WelcomeHeroStage from './WelcomeHeroStage';
import WelcomeFeaturePills from './WelcomeFeaturePills';

export interface WelcomeScreenViewProps {
  alComenzarAhora: () => void;
  alExplorarComoInvitado: () => void;
  alSaltar: () => void;
}

export default function WelcomeScreenView({
  alComenzarAhora,
  alExplorarComoInvitado,
  alSaltar,
}: WelcomeScreenViewProps) {
  const [pilarActivoId, setPilarActivoId] = useState<WelcomePillarId>('mapa');
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const margenInferiorSeguro = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? Spacing.base : Spacing.sm
  );
  const altoDisponible = Math.max(height - insets.top - margenInferiorSeguro, 520);
  const esCompacto = altoDisponible < 740 || width < 380;

  const tamanoMaximoEstimado = Math.round(
    Math.min(
      Math.max(altoDisponible * 0.34, 175),
      width - Spacing.xl,
      esCompacto ? 235 : 275
    )
  );

  const pilarActivo =
    WELCOME_PILLARS.find((item) => item.id === pilarActivoId) ?? WELCOME_PILLARS[0];

  return (
    <SafeAreaView style={styles.areaSegura} edges={['top', 'bottom', 'left', 'right']}>
      <View
        style={[
          styles.contenedorPantalla,
          esCompacto && styles.contenedorPantallaCompacto,
          { paddingBottom: margenInferiorSeguro },
        ]}
      >
        <View style={styles.contenedorPrincipal}>
          {/* Encabezado Superior: Saltar + Identidad de Marca unificada con Login */}
          <View style={styles.bloqueEncabezado}>
            <View style={styles.barraSuperior}>
              <View style={styles.espaciadorIzquierdo} />
              <Pressable
                onPress={alSaltar}
                hitSlop={Spacing.md}
                accessibilityRole="button"
                accessibilityLabel="Saltar introducción"
                style={({ pressed }) => [
                  styles.botonSaltar,
                  pressed && styles.botonPresionadoSuave,
                ]}
              >
                <Text maxFontSizeMultiplier={1.1} style={styles.textoSaltar}>
                  Saltar
                </Text>
              </Pressable>
            </View>

            <View style={[styles.marcaContenedor, esCompacto && styles.marcaContenedorCompacto]}>
              <View
                style={[styles.emblemaEnvoltura, esCompacto && styles.emblemaEnvolturaCompacto]}
              >
                <Image
                  source={require('../../assets/welcome_dog_badge.png')}
                  style={styles.emblemaImagen}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.marcaTextosColumna}>
                <Text maxFontSizeMultiplier={1.1} style={styles.marcaTituloOscuro}>
                  PATITAS
                </Text>
                <Text maxFontSizeMultiplier={1.1} style={styles.marcaTituloAcento}>
                  ENCONTRADAS
                </Text>
              </View>
            </View>
          </View>

          {/* Escenario Hero 3D Flexible: se adapta automáticamente al alto disponible */}
          <WelcomeHeroStage
            pilarActivo={pilarActivo}
            alSeleccionarPilar={setPilarActivoId}
            tamanoMaximoEstimado={tamanoMaximoEstimado}
            esCompacto={esCompacto}
          />

          {/* Bloque Inferior Fijo: Editorial + Píldoras + Botones siempre visibles */}
          <View style={styles.bloqueInferior}>
            <View style={styles.bloqueEditorial}>
              <Text
                maxFontSizeMultiplier={1.1}
                style={[
                  styles.titularPrincipal,
                  esCompacto && styles.titularPrincipalCompacto,
                ]}
              >
                {pilarActivo.tituloPrefijo}
                <Text style={styles.titularDestacado}>{pilarActivo.tituloDestacado}</Text>
              </Text>

              <Text
                maxFontSizeMultiplier={1.1}
                style={[
                  styles.descripcionResumen,
                  esCompacto && styles.descripcionResumenCompacta,
                ]}
              >
                {pilarActivo.descripcion}
              </Text>
            </View>

            <WelcomeFeaturePills
              pilarActivoId={pilarActivoId}
              alSeleccionarPilar={setPilarActivoId}
              esCompacto={esCompacto}
            />

            <View
              style={[
                styles.contenedorAcciones,
                esCompacto && styles.contenedorAccionesCompacto,
              ]}
            >
              <Pressable
                onPress={alComenzarAhora}
                accessibilityRole="button"
                accessibilityLabel="Comenzar ahora"
                style={({ pressed }) => [
                  styles.botonPrimario,
                  esCompacto && styles.botonPrimarioCompacto,
                  pressed && styles.botonPrimarioPresionado,
                ]}
              >
                <Text maxFontSizeMultiplier={1.1} style={styles.textoBotonPrimario}>
                  Comenzar ahora
                </Text>
              </Pressable>

              <Pressable
                onPress={alExplorarComoInvitado}
                hitSlop={Spacing.sm}
                accessibilityRole="button"
                accessibilityLabel="Explorar como invitado"
                style={({ pressed }) => [
                  styles.botonInvitado,
                  esCompacto && styles.botonInvitadoCompacto,
                  pressed && styles.botonPresionadoSuave,
                ]}
              >
                <Text maxFontSizeMultiplier={1.1} style={styles.textoBotonInvitado}>
                  Explorar como invitado
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  contenedorPantalla: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
  },
  contenedorPantallaCompacto: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.half,
  },
  contenedorPrincipal: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bloqueEncabezado: {
    width: '100%',
    alignItems: 'center',
  },
  barraSuperior: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 26,
  },
  espaciadorIzquierdo: {
    width: 48,
  },
  botonSaltar: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.sm,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoSaltar: {
    fontFamily: Typography.fonts.bodySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  marcaContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm + Spacing.half,
  },
  marcaContenedorCompacto: {
    gap: Spacing.sm,
  },
  emblemaEnvoltura: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.card,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  emblemaEnvolturaCompacto: {
    width: 38,
    height: 38,
  },
  emblemaImagen: {
    width: '100%',
    height: '100%',
  },
  marcaTextosColumna: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  marcaTituloOscuro: {
    fontFamily: Typography.fonts.titleBold,
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.xs + 4,
    color: Colors.black,
    letterSpacing: 0.5,
  },
  marcaTituloAcento: {
    fontFamily: Typography.fonts.titleBold,
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.lineHeights.xs + 4,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  bloqueInferior: {
    width: '100%',
    alignItems: 'center',
  },
  bloqueEditorial: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  titularPrincipal: {
    fontFamily: Typography.fonts.titleBold,
    fontSize: Typography.sizes.xxxl,
    lineHeight: Typography.lineHeights.xxl + 2,
    color: Colors.text,
    textAlign: 'center',
  },
  titularPrincipalCompacto: {
    fontSize: Typography.sizes.xxl,
    lineHeight: Typography.lineHeights.xl + 2,
  },
  titularDestacado: {
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
  },
  descripcionResumen: {
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: MaxContentWidth / 2,
  },
  descripcionResumenCompacta: {
    fontSize: Typography.sizes.xs + 1,
    lineHeight: Typography.lineHeights.xs + 2,
    marginTop: Spacing.half,
  },
  contenedorAcciones: {
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  contenedorAccionesCompacto: {
    marginTop: Spacing.sm,
  },
  botonPrimario: {
    width: '100%',
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  botonPrimarioCompacto: {
    height: 46,
  },
  botonPrimarioPresionado: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  textoBotonPrimario: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.md,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  botonInvitado: {
    marginTop: Spacing.xs + Spacing.half,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    minHeight: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonInvitadoCompacto: {
    marginTop: Spacing.one,
    paddingVertical: Spacing.one,
    minHeight: 28,
  },
  textoBotonInvitado: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  botonPresionadoSuave: {
    opacity: 0.65,
  },
});
