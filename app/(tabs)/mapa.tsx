import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FilterType = 'todos' | 'perdidos' | 'vistos' | 'campanias';

interface MapPoint {
  id: string;
  tipo: 'perdido' | 'visto' | 'campania';
  titulo: string;
  subtitulo: string;
  direccion: string;
  tiempo: string;
  foto: string;
  coordenadasX: number;
  coordenadasY: number;
}

const MAP_POINTS: MapPoint[] = [
  {
    id: '1',
    tipo: 'perdido',
    titulo: 'Rocky',
    subtitulo: 'Labrador Retriever • Macho',
    direccion: 'Av. Tratado del Pilar & Chubut',
    tiempo: '🔴 Perdido hace 5 horas',
    foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
    coordenadasX: 52,
    coordenadasY: 46,
  },
  {
    id: '2',
    tipo: 'visto',
    titulo: 'Luna',
    subtitulo: 'Mestiza atigrada (pretal azul)',
    direccion: 'Plaza 12 de Octubre, Pilar Centro',
    tiempo: '🟢 Vista ayer por la tarde',
    foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    coordenadasX: 36,
    coordenadasY: 26,
  },
  {
    id: '3',
    tipo: 'campania',
    titulo: 'Vacunación Zoonosis',
    subtitulo: 'Atención clínica y antirrábica',
    direccion: 'Plaza 12 de Octubre (Calle Rivadavia)',
    tiempo: '📅 Sábado de 10:00 a 16:00 hs',
    foto: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    coordenadasX: 74,
    coordenadasY: 32,
  },
];

export default function MapaScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('todos');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(MAP_POINTS[0]);

  const filteredPoints = MAP_POINTS.filter((p) => {
    if (selectedFilter === 'perdidos') return p.tipo === 'perdido';
    if (selectedFilter === 'vistos') return p.tipo === 'visto';
    if (selectedFilter === 'campanias') return p.tipo === 'campania';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Superior según Bosquejo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MAPA</Text>

        {/* Filtros de Opciones: Perdidos | Vistos | Campañas */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'perdidos' && styles.filterChipActive]}
            onPress={() => setSelectedFilter(selectedFilter === 'perdidos' ? 'todos' : 'perdidos')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'perdidos' && styles.filterChipTextActive]}>
              Perdidos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'vistos' && styles.filterChipActive]}
            onPress={() => setSelectedFilter(selectedFilter === 'vistos' ? 'todos' : 'vistos')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'vistos' && styles.filterChipTextActive]}>
              Vistos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'campanias' && styles.filterChipActive]}
            onPress={() => setSelectedFilter(selectedFilter === 'campanias' ? 'todos' : 'campanias')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, selectedFilter === 'campanias' && styles.filterChipTextActive]}>
              Campañas
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Canvas del Mapa con los Puntos */}
      <View style={styles.mapCanvas}>
        {/* Grilla visual de calles y áreas verdes */}
        <View style={styles.parkBox}>
          <Text style={styles.parkLabel}>🌳 Plaza 12 de Octubre</Text>
        </View>
        <View style={styles.roadHorizontal}>
          <Text style={styles.roadLabel}>Ruta Prov. 8 (Tratado del Pilar)</Text>
        </View>
        <View style={styles.roadVertical} />

        {/* Marcadores / Pines de Mascotas */}
        {filteredPoints.map((point) => {
          const isSelected = selectedPoint?.id === point.id;
          const isPerdido = point.tipo === 'perdido';
          const isVisto = point.tipo === 'visto';

          return (
            <TouchableOpacity
              key={point.id}
              style={[
                styles.pinWrapper,
                {
                  left: `${point.coordenadasX}%`,
                  top: `${point.coordenadasY}%`,
                  zIndex: isSelected ? 99 : 10,
                },
              ]}
              onPress={() => setSelectedPoint(point)}
              activeOpacity={0.85}
            >
              {isSelected && <View style={styles.pulseRing} />}
              <View
                style={[
                  styles.pinCircle,
                  isPerdido
                    ? styles.pinRed
                    : isVisto
                    ? styles.pinGreen
                    : styles.pinBlue,
                ]}
              >
                <Ionicons
                  name={isPerdido ? 'paw' : isVisto ? 'checkmark' : 'medkit'}
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.pinBubble}>
                <Text style={styles.pinBubbleText} numberOfLines={1}>
                  {point.titulo}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Tarjeta Inferior de Información al Clickear un Punto (según bosquejo) */}
        {selectedPoint && (
          <View style={styles.bottomCardContainer}>
            {/* Lado Izquierdo: Foto [f], Ubicación y Cuándo se perdió */}
            <View style={styles.bottomCardLeft}>
              <View style={styles.thumbWrapper}>
                <Image source={{ uri: selectedPoint.foto }} style={styles.thumbImage} />
                <View style={styles.tagF}>
                  <Text style={styles.tagFText}>f</Text>
                </View>
              </View>
              <View style={styles.bottomInfoCol}>
                <Text style={styles.bottomPetTitle} numberOfLines={1}>
                  {selectedPoint.titulo}
                </Text>
                <Text style={styles.bottomLocation} numberOfLines={2}>
                  📍 {selectedPoint.direccion}
                </Text>
                <Text style={styles.bottomTime}>{selectedPoint.tiempo}</Text>
              </View>
            </View>

            {/* Lado Derecho: Botón Grande "Ver Pedido" */}
            <TouchableOpacity
              style={styles.btnVerPedido}
              onPress={() => router.push(`/detalle/${selectedPoint.id}` as any)}
              activeOpacity={0.88}
            >
              <Text style={styles.btnVerPedidoText}>VER PEDIDO</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E8EEEC',
    position: 'relative',
    overflow: 'hidden',
  },
  parkBox: {
    position: 'absolute',
    left: '25%',
    top: '18%',
    width: 140,
    height: 110,
    borderRadius: 18,
    backgroundColor: '#CDE7D5',
    padding: 8,
  },
  parkLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '48%',
    height: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  roadLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 32,
    backgroundColor: '#FFFFFF',
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  pulseRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(240, 90, 62, 0.25)',
    top: -6,
  },
  pinCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  pinRed: {
    backgroundColor: Colors.danger,
  },
  pinGreen: {
    backgroundColor: Colors.success,
  },
  pinBlue: {
    backgroundColor: Colors.secondary,
  },
  pinBubble: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 90,
  },
  pinBubbleText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  thumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: Radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tagF: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: 'rgba(32, 58, 77, 0.85)',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagFText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  bottomInfoCol: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  bottomPetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.secondary,
  },
  bottomLocation: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  bottomTime: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  btnVerPedido: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    height: 52,
    borderRadius: Radius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnVerPedidoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
