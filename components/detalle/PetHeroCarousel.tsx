import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, Radius, DetailMetrics } from '@/constants/theme';
import { PetFloatingButton } from './PetFloatingButton';
import { obtenerPresentacionEstado } from '@/utils/detalleMascota';
import type { PetHeroCarouselProps } from '@/types/Detalle';

interface CarouselImageItemProps {
  uri: string;
  width: number;
  height: number;
}

function CarouselImageItem({ uri, width, height }: CarouselImageItemProps) {
  const [errorCarga, setErrorCarga] = useState(false);

  if (errorCarga) {
    return (
      <View style={[styles.placeholder, { width, height }]}>
        <View style={styles.placeholderCirculo}>
          <Ionicons
            name="paw"
            size={DetailMetrics.placeholderIconSize}
            color={Colors.primary}
          />
        </View>
        <Text style={styles.placeholderTexto}>No se pudo cargar la foto</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.foto, { width, height }]}
      resizeMode="cover"
      onError={() => setErrorCarga(true)}
    />
  );
}

export function PetHeroCarousel({
  fotos,
  nombre,
  estado,
  alturaHero,
  insetSuperior,
  onVolver,
  onCompartir,
}: PetHeroCarouselProps) {
  const { width } = useWindowDimensions();
  const [indiceActivo, setIndiceActivo] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  const listaFotos = fotos.length > 0 ? fotos : [];
  const totalFotos = listaFotos.length;
  const presentacion = obtenerPresentacionEstado(estado);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      if (width > 0) {
        const nuevoIndice = Math.round(offsetX / width);
        if (nuevoIndice >= 0 && nuevoIndice < totalFotos && nuevoIndice !== indiceActivo) {
          setIndiceActivo(nuevoIndice);
        }
      }
    },
    [width, totalFotos, indiceActivo]
  );

  const irAFoto = (nuevoIndice: number) => {
    if (nuevoIndice >= 0 && nuevoIndice < totalFotos) {
      flatListRef.current?.scrollToIndex({
        index: nuevoIndice,
        animated: true,
      });
      setIndiceActivo(nuevoIndice);
    }
  };

  const topOffset = Math.max(insetSuperior + Spacing.sm, Spacing.base);

  return (
    <View style={[styles.contenedor, { height: alturaHero }]}>
      {totalFotos > 0 ? (
        <FlatList
          ref={flatListRef}
          data={listaFotos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          keyExtractor={(item, index) => `${item}-${index}`}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <CarouselImageItem
              uri={item}
              width={width}
              height={alturaHero}
            />
          )}
        />
      ) : (
        <View style={[styles.placeholder, { height: alturaHero }]}>
          <View style={styles.placeholderCirculo}>
            <Ionicons
              name="paw"
              size={DetailMetrics.placeholderIconSize}
              color={Colors.primary}
            />
          </View>
          <Text style={styles.placeholderTexto}>Sin fotos disponibles</Text>
        </View>
      )}

      {/* BOTÓN VOLVER (SUPERIOR IZQUIERDA) */}
      <View style={[styles.botonVolverContenedor, { top: topOffset }]}>
        <PetFloatingButton
          icono="arrow-back"
          onPress={onVolver}
          accessibilityLabel="Volver a la pantalla anterior"
        />
      </View>

      {/* FLECHAS DE NAVEGACIÓN LATERALES (SOLO SI HAY > 1 FOTO) */}
      {totalFotos > 1 && (
        <>
          {indiceActivo > 0 && (
            <View style={styles.flechaIzquierda}>
              <PetFloatingButton
                icono="chevron-back"
                tamano={DetailMetrics.arrowButtonSize}
                tamanoIcono={DetailMetrics.arrowIconSize}
                onPress={() => irAFoto(indiceActivo - 1)}
                accessibilityLabel="Foto anterior"
              />
            </View>
          )}

          {indiceActivo < totalFotos - 1 && (
            <View style={styles.flechaDerecha}>
              <PetFloatingButton
                icono="chevron-forward"
                tamano={DetailMetrics.arrowButtonSize}
                tamanoIcono={DetailMetrics.arrowIconSize}
                onPress={() => irAFoto(indiceActivo + 1)}
                accessibilityLabel="Foto siguiente"
              />
            </View>
          )}

          {/* INDICADORES (DOTS) EN EL CENTRO INFERIOR */}
          <View style={styles.dotsContenedor}>
            {listaFotos.map((_, i) => (
              <View
                key={`dot-${i}`}
                style={[
                  styles.dot,
                  indiceActivo === i ? styles.dotActivo : styles.dotInactivo,
                ]}
              />
            ))}
          </View>
        </>
      )}

      {/* BADGE DE ESTADO FLOTANTE (INFERIOR IZQUIERDA) */}
      <View style={styles.badgeEstado}>
        <View
          style={[
            styles.dotEstado,
            { backgroundColor: presentacion.color },
          ]}
        />
        <Text
          style={[
            styles.textoEstado,
            { color: presentacion.color },
          ]}
        >
          {presentacion.etiqueta}
        </Text>
      </View>

      {/* BOTÓN DE COMPARTIR (INFERIOR DERECHA - REEMPLAZA LA G DE GOOGLE) */}
      <View style={styles.botonCompartirContenedor}>
        <PetFloatingButton
          icono="share-social-outline"
          onPress={onCompartir}
          accessibilityLabel={`Compartir publicación de ${nombre}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    backgroundColor: Colors.detailHeroPlaceholder,
    position: 'relative',
    borderBottomLeftRadius: DetailMetrics.heroBottomRadius,
    borderBottomRightRadius: DetailMetrics.heroBottomRadius,
    overflow: 'hidden',
  },
  foto: {
    backgroundColor: Colors.detailHeroPlaceholder,
  },
  placeholder: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.detailHeroPlaceholder,
    gap: Spacing.sm,
  },
  placeholderCirculo: {
    width: DetailMetrics.placeholderIconCircle,
    height: DetailMetrics.placeholderIconCircle,
    borderRadius: Radius.full,
    backgroundColor: Colors.detailHeroPlaceholderIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderTexto: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textSecondary,
  },
  botonVolverContenedor: {
    position: 'absolute',
    left: Spacing.base,
    zIndex: 10,
  },
  flechaIzquierda: {
    position: 'absolute',
    left: Spacing.base,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
  },
  flechaDerecha: {
    position: 'absolute',
    right: Spacing.base,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 10,
  },
  dotsContenedor: {
    position: 'absolute',
    bottom: Spacing.base,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.detailDotsTrack,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    zIndex: 9,
  },
  dot: {
    height: DetailMetrics.dotSize,
    borderRadius: Radius.full,
  },
  dotInactivo: {
    width: DetailMetrics.dotSize,
    backgroundColor: Colors.detailDotInactive,
  },
  dotActivo: {
    width: DetailMetrics.dotActiveWidth,
    backgroundColor: Colors.detailDotActive,
  },
  badgeEstado: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.detailOverlayChip,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    zIndex: 10,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 6px rgba(90, 58, 31, 0.15)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  dotEstado: {
    width: DetailMetrics.statusDotSize,
    height: DetailMetrics.statusDotSize,
    borderRadius: Radius.full,
  },
  textoEstado: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    letterSpacing: 0.6,
  },
  botonCompartirContenedor: {
    position: 'absolute',
    bottom: Spacing.base,
    right: Spacing.base,
    zIndex: 10,
  },
});
