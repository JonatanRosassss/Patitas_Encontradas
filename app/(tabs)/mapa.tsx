import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Radius } from '../../theme/tokens';
import { MAP_FILTERS } from '../../data/mapMockData';
import { useMapState } from '../../hooks/useMapState';
import { MapContainer } from '../../components/map/MapContainer';
import { MapSearchBar } from '../../components/map/MapSearchBar';
import { MapFilterChips } from '../../components/map/MapFilterChips';
import { MapControls } from '../../components/map/MapControls';
import { MapPetCard } from '../../components/map/MapPetCard';

export default function MapaScreen() {
  const {
    filtro,
    setFiltro,
    selectedPet,
    setSelectedPet,
    searchQuery,
    setSearchQuery,
    userLocation,
    isLocating,
    filteredPets,
    handleLocate,
    handleZoomIn,
    handleZoomOut,
    mapContainerRef,
  } = useMapState();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.card} />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
              Mapa Comunitario 🗺️
            </Text>
            <Text style={styles.subtitle}>Radar de alertas y campañas en Pilar</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>En Vivo</Text>
          </View>
        </View>

        <MapSearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <MapFilterChips
          filters={MAP_FILTERS}
          selectedFilterIndex={filtro}
          onSelectFilter={setFiltro}
        />
      </View>

      <View style={styles.mapWrapper}>
        <MapContainer
          ref={mapContainerRef}
          pets={filteredPets}
          selectedPet={selectedPet}
          onSelectPet={setSelectedPet}
          userLocation={userLocation}
        />

        <MapControls
          onLocate={handleLocate}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isLocating={isLocating}
        />

        {selectedPet && (
          <MapPetCard pet={selectedPet} onClose={() => setSelectedPet(null)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    zIndex: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.fonts.titleBold,
    fontSize: Typography.sizes.xxl,
    color: Colors.text,
    lineHeight: Typography.lineHeights.xxl,
  },
  subtitle: {
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.half,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.lg,
    backgroundColor: Colors.accent,
    gap: Spacing.half,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  liveText: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.xs,
    color: Colors.text,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.backgroundLight,
  },
});
