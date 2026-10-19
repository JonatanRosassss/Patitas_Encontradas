
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { Colors, Typography } from '@/constants/theme';

export interface RectanguloGuia {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GuiaDeUsoProps {
  visible: boolean;
  pasoActual: number;
  targetRect: RectanguloGuia | null;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

const pasos = [
  {
    titulo: 'Publicar una mascota',
    descripcion:
      'Tocá este botón para comenzar a publicar una mascota perdida o encontrada. Completá sus datos para ayudar a que pueda ser identificada.',
    consejo: 'Agregá una foto y una descripción clara.',
  },
  {
    titulo: 'Filtrar publicaciones',
    descripcion:
      'Usá los filtros para distinguir entre mascotas perdidas y encontradas, y encontrar más fácilmente la publicación que buscás.',
    consejo: 'Podés volver a seleccionar Todos para verlas juntas.',
  },
  {
    titulo: 'Consultar una mascota',
    descripcion:
      'Tocá una tarjeta para ver más información sobre la mascota, como su nombre, estado y descripción.',
    consejo: 'Revisá los datos antes de contactar a quien publicó.',
  },
];

export default function GuiaDeUso({
  visible,
  pasoActual,
  targetRect,
  onNext,
  onPrevious,
  onClose,
}: GuiaDeUsoProps) {
  const { width, height } = useWindowDimensions();

  if (!visible) {
    return null;
  }

  const indice = Math.max(0, Math.min(pasoActual, pasos.length - 1));
  const paso = pasos[indice];
  const esPrimero = indice === 0;
  const esUltimo = indice === pasos.length - 1;

  const margen = 6;

const x = targetRect
  ? Math.max(0, targetRect.x - margen)
  : 0;

const y = targetRect
  ? Math.max(0, targetRect.y - margen)
  : 0;

const ancho = targetRect
  ? Math.min(targetRect.width + margen * 2, width - x)
  : 0;

const alto = targetRect
  ? targetRect.height + margen * 2
  : 0;

  const altoTarjeta = 230;
  const tarjetaArriba =
    !targetRect || targetRect.y > height * 0.52;

  const topTarjeta = tarjetaArriba
    ? Math.max(20, y - altoTarjeta - 12)
    : Math.min(
        height - altoTarjeta - 20,
        y + alto + 12,
      );

  return (
    <View
       style={styles.overlay}
  accessibilityViewIsModal
  pointerEvents="box-none"
    >
      <Svg
        width={width}
        height={height}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      >
        <Path
          d={
            targetRect
              ? `M 0 0 H ${width} V ${height} H 0 Z
                 M ${x} ${y}
                 H ${x + ancho}
                 V ${y + alto}
                 H ${x}
                 Z`
              : `M 0 0 H ${width} V ${height} H 0 Z`
          }
          fill="rgba(32, 25, 20, 0.70)"
          fillRule="evenodd"
        />

        {targetRect && (
          <Rect
            x={x}
            y={y}
            width={ancho}
            height={alto}
            rx={12}
            ry={12}
            fill="none"
            stroke={Colors.primary}
            strokeWidth={3}
          />
        )}
      </Svg>

      <View
        style={[
          styles.tarjeta,
          {
            top: topTarjeta,
            left: 20,
            right: 20,
          },
        ]}
      >
        <View style={styles.encabezado}>
          <View style={styles.etiqueta}>
            <Text style={styles.textoEtiqueta}>
              GUÍA DE USO
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cerrar guía"
            hitSlop={10}
          >
            <Text style={styles.cerrar}>✕</Text>
          </Pressable>
        </View>

        <Text style={styles.progreso}>
          PASO {indice + 1} DE {pasos.length}
        </Text>

        <Text style={styles.titulo}>
          {paso.titulo}
        </Text>

        <Text style={styles.descripcion}>
          {paso.descripcion}
        </Text>

        <View style={styles.consejo}>
          <Text style={styles.textoConsejo}>
            💡 {paso.consejo}
          </Text>
        </View>

        <View style={styles.botones}>
          {!esPrimero ? (
            <Pressable
              style={styles.botonAnterior}
              onPress={onPrevious}
              accessibilityRole="button"
            >
              <Text style={styles.textoAnterior}>
                Anterior
              </Text>
            </Pressable>
          ) : (
            <View style={styles.espacio} />
          )}

          <Pressable
            style={styles.botonSiguiente}
            onPress={esUltimo ? onClose : onNext}
            accessibilityRole="button"
          >
            <Text style={styles.textoSiguiente}>
              {esUltimo ? 'Finalizar' : 'Continuar →'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  tarjeta: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 12,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  etiqueta: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  textoEtiqueta: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cerrar: {
    color: Colors.textSecondary,
    fontSize: 21,
    paddingHorizontal: 4,
  },
  progreso: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
  },
  titulo: {
    color: Colors.text,
    fontFamily: Typography.fonts.titleBold,
    fontSize: 21,
    marginBottom: 8,
  },
  descripcion: {
    color: Colors.textSecondary,
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  consejo: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 9,
    padding: 10,
    marginTop: 12,
  },
  textoConsejo: {
    color: Colors.text,
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: 12,
    lineHeight: 17,
  },
  botones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
  },
  espacio: {
    flex: 1,
  },
  botonAnterior: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textoAnterior: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  botonSiguiente: {
    flex: 1.4,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  textoSiguiente: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 13,
  },
});
