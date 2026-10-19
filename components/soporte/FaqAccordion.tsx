import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { PREGUNTAS_FRECUENTES } from '@/data/faqsData';
import type { CategoriaFaq } from '@/types/Ticket';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface FaqAccordionProps {
  onContactPress?: () => void;
}

interface CategoriaChipItem {
  label: string;
  value: CategoriaFaq | 'TODAS';
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIAS: CategoriaChipItem[] = [
  { label: 'Todas', value: 'TODAS', icon: 'apps-outline' },
  { label: 'Publicaciones', value: 'PUBLICACIONES', icon: 'paw-outline' },
  { label: 'Mapa', value: 'MAPA', icon: 'map-outline' },
  { label: 'Avistamientos', value: 'AVISTAMIENTOS', icon: 'eye-outline' },
  { label: 'Cuenta', value: 'CUENTA', icon: 'person-outline' },
];

export function FaqAccordion({ onContactPress }: FaqAccordionProps) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<CategoriaFaq | 'TODAS'>('TODAS');
  const [preguntaAbiertaId, setPreguntaAbiertaId] = useState<string | null>(null);

  const cambiarCategoria = (cat: CategoriaFaq | 'TODAS') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCategoriaSeleccionada(cat);
    setPreguntaAbiertaId(null);
  };

  const togglePregunta = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPreguntaAbiertaId((prev) => (prev === id ? null : id));
  };

  const preguntasFiltradas = categoriaSeleccionada === 'TODAS'
    ? PREGUNTAS_FRECUENTES
    : PREGUNTAS_FRECUENTES.filter((item) => item.categoria === categoriaSeleccionada);

  const obtenerConteo = (cat: CategoriaFaq | 'TODAS'): number => {
    if (cat === 'TODAS') return PREGUNTAS_FRECUENTES.length;
    return PREGUNTAS_FRECUENTES.filter((item) => item.categoria === cat).length;
  };

  const obtenerIconoCategoria = (cat: CategoriaFaq): keyof typeof Ionicons.glyphMap => {
    switch (cat) {
      case 'PUBLICACIONES':
        return 'paw-outline';
      case 'MAPA':
        return 'map-outline';
      case 'AVISTAMIENTOS':
        return 'eye-outline';
      case 'CUENTA':
        return 'person-outline';
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.tituloSeccion}>Preguntas Frecuentes</Text>
      <Text style={styles.subtituloSeccion}>
        Encontrá respuestas rápidas sobre el funcionamiento de la app y la búsqueda comunitaria en Pilar.
      </Text>

      {/* Selector de Categorías (Chips con Feedback Visual) */}
      <View style={styles.chipsContainer}>
        {CATEGORIAS.map((cat) => {
          const estaActivo = categoriaSeleccionada === cat.value;
          const conteo = obtenerConteo(cat.value);

          return (
            <Pressable
              key={cat.value}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por categoría ${cat.label}, ${conteo} preguntas disponibles`}
              accessibilityState={{ selected: estaActivo }}
              onPress={() => cambiarCategoria(cat.value)}
              style={({ pressed }) => [
                styles.chip,
                estaActivo && styles.chipActivo,
                pressed && styles.chipPressed,
              ]}
            >
              <Ionicons
                name={cat.icon}
                size={Typography.sizes.sm}
                color={estaActivo ? Colors.white : Colors.textSecondary}
                style={styles.chipIcono}
              />
              <Text style={[styles.chipTexto, estaActivo && styles.chipTextoActivo]}>
                {cat.label}
              </Text>
              <View style={[styles.badgeConteo, estaActivo && styles.badgeConteoActivo]}>
                <Text style={[styles.textoBadgeConteo, estaActivo && styles.textoBadgeConteoActivo]}>
                  {conteo}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Lista de Preguntas Desplegables con Feedback Visual */}
      <View style={styles.listaFaq}>
        {preguntasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={Spacing.five} color={Colors.textMuted} />
            <Text style={styles.emptyTexto}>No hay preguntas disponibles en esta categoría.</Text>
          </View>
        ) : (
          preguntasFiltradas.map((item) => {
            const estaAbierta = preguntaAbiertaId === item.id;
            const iconoCat = obtenerIconoCategoria(item.categoria);

            return (
              <View
                key={item.id}
                style={[
                  styles.cardFaq,
                  estaAbierta && styles.cardFaqAbierta,
                ]}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Pregunta: ${item.pregunta}. ${estaAbierta ? 'Toca para colapsar' : 'Toca para expandir respuesta'}`}
                  accessibilityState={{ expanded: estaAbierta }}
                  onPress={() => togglePregunta(item.id)}
                  android_ripple={{ color: Colors.tintPrimary }}
                  style={({ pressed }) => [
                    styles.headerPregunta,
                    pressed && styles.headerPreguntaPressed,
                    estaAbierta && styles.headerPreguntaAbierto,
                  ]}
                >
                  <View style={styles.headerContenido}>
                    {/* Badge de Categoría dentro del ítem */}
                    <View style={styles.categoriaTag}>
                      <Ionicons
                        name={iconoCat}
                        size={Typography.sizes.xs}
                        color={Colors.primary}
                        style={styles.categoriaTagIcono}
                      />
                      <Text style={styles.categoriaTagTexto}>{item.categoria}</Text>
                    </View>

                    <Text style={[styles.textoPregunta, estaAbierta && styles.textoPreguntaAbierta]}>
                      {item.pregunta}
                    </Text>
                  </View>

                  {/* Indicador visual desplegable */}
                  <View style={[styles.circuloToggle, estaAbierta && styles.circuloToggleActivo]}>
                    <Ionicons
                      name={estaAbierta ? 'chevron-up' : 'chevron-down'}
                      size={Typography.sizes.md}
                      color={estaAbierta ? Colors.white : Colors.primary}
                    />
                  </View>
                </Pressable>

                {/* Contenido Desplegable */}
                {estaAbierta && (
                  <View style={styles.cuerpoRespuesta}>
                    <Text style={styles.textoRespuesta}>{item.respuesta}</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* Card de pie: ¿No encontraste tu respuesta? */}
      {onContactPress && (
        <View style={styles.cardAyudaExtra}>
          <View style={styles.cardAyudaHeader}>
            <View style={styles.cardAyudaIconoWrapper}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={Typography.sizes.xl}
                color={Colors.primary}
              />
            </View>
            <View style={styles.cardAyudaTextos}>
              <Text style={styles.textoAyudaExtraTitulo}>¿No encontraste lo que buscabas?</Text>
              <Text style={styles.textoAyudaExtraDesc}>
                Podés redactar un ticket de soporte para que el equipo de moderación revise tu caso particular.
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Redactar un Ticket de Soporte"
            style={({ pressed }) => [
              styles.botonEnviarTicketAccion,
              pressed && styles.botonEnviarTicketPressed,
            ]}
            onPress={onContactPress}
          >
            <Ionicons name="create-outline" size={Typography.sizes.md} color={Colors.white} />
            <Text style={styles.botonEnviarTicketTexto}>Redactar un Ticket de Soporte</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },
  tituloSeccion: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    marginBottom: Spacing.one,
  },
  subtituloSeccion: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    marginBottom: Spacing.four,
    lineHeight: Typography.lineHeights.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: Spacing.one + Spacing.half,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActivo: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipIcono: {
    marginRight: Spacing.one,
  },
  chipTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
    marginRight: Spacing.one,
  },
  chipTextoActivo: {
    color: Colors.white,
  },
  badgeConteo: {
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.one + Spacing.half,
    paddingVertical: Spacing.half,
    borderRadius: Radius.full,
  },
  badgeConteoActivo: {
    backgroundColor: Colors.white,
  },
  textoBadgeConteo: {
    fontSize: Typography.sizes.xs - 2,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
  },
  textoBadgeConteoActivo: {
    color: Colors.primary,
  },
  listaFaq: {
    gap: Spacing.three,
  },
  emptyContainer: {
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.two,
  },
  emptyTexto: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  cardFaq: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: Radius.xs,
    elevation: 1,
  },
  cardFaqAbierta: {
    borderColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: Radius.sm,
    elevation: 2,
  },
  headerPregunta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
    padding: Spacing.three,
  },
  headerPreguntaPressed: {
    backgroundColor: Colors.borderLight,
  },
  headerPreguntaAbierto: {
    backgroundColor: Colors.tintPrimary,
  },
  headerContenido: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  categoriaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.xs,
    marginBottom: Spacing.one,
  },
  categoriaTagIcono: {
    marginRight: Spacing.half,
  },
  categoriaTagTexto: {
    fontSize: Typography.sizes.xs - 2,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  textoPregunta: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
    lineHeight: Typography.lineHeights.sm,
  },
  textoPreguntaAbierta: {
    color: Colors.text,
  },
  circuloToggle: {
    width: Spacing.four + Spacing.two,
    height: Spacing.four + Spacing.two,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloToggleActivo: {
    backgroundColor: Colors.primary,
  },
  cuerpoRespuesta: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.three,
    backgroundColor: Colors.card,
  },
  textoRespuesta: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeights.md,
  },
  cardAyudaExtra: {
    marginTop: Spacing.five,
    backgroundColor: Colors.accent,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  cardAyudaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  cardAyudaIconoWrapper: {
    width: Spacing.five,
    height: Spacing.five,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAyudaTextos: {
    flex: 1,
  },
  textoAyudaExtraTitulo: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    marginBottom: Spacing.half,
  },
  textoAyudaExtraDesc: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    lineHeight: Typography.lineHeights.xs,
  },
  botonEnviarTicketAccion: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    minHeight: 44,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  botonEnviarTicketPressed: {
    opacity: 0.85,
  },
  botonEnviarTicketTexto: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
});
