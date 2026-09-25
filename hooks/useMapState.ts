import { useState, useMemo, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { Coordinates, MapFilterIndex, MapPet } from '../types/map';
import { MASCOTAS_MOCK } from '../data/mapMockData';
import { isValidCoordinate } from '../utils/geoValidation';
import { MapContainerRef } from '../components/map/MapContainer';

export interface UseMapStateReturn {
  filtro: MapFilterIndex;
  setFiltro: (filtro: MapFilterIndex) => void;
  selectedPet: MapPet | null;
  setSelectedPet: (pet: MapPet | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userLocation: Coordinates | null;
  isLocating: boolean;
  filteredPets: MapPet[];
  handleLocate: () => Promise<void>;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  mapContainerRef: React.RefObject<MapContainerRef>;
}

export function useMapState(initialPets: MapPet[] = MASCOTAS_MOCK): UseMapStateReturn {
  const [filtro, setFiltro] = useState<MapFilterIndex>(0);
  const [selectedPet, setSelectedPet] = useState<MapPet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const mapContainerRef = useRef<MapContainerRef>(null);

  const filteredPets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return initialPets.filter((pet) => {
      // Must have valid coordinates
      if (!pet.coordenadas || !isValidCoordinate(pet.coordenadas.latitude, pet.coordenadas.longitude)) {
        return false;
      }

      // Filter by category
      if (filtro !== 0 && pet.estado !== filtro) {
        return false;
      }

      // Filter by search query
      if (query.length > 0) {
        const matchesName = pet.nombre.toLowerCase().includes(query);
        const matchesLocation = pet.ubicacion.toLowerCase().includes(query);
        const matchesDescription = pet.descripcion.toLowerCase().includes(query);
        if (!matchesName && !matchesLocation && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  }, [initialPets, filtro, searchQuery]);

  const handleLocate = useCallback(async () => {
    if (isLocating) return;
    setIsLocating(true);

    try {
      const isServiceEnabled = await Location.hasServicesEnabledAsync();
      if (!isServiceEnabled) {
        Alert.alert(
          'Ubicación Desactivada',
          'Los servicios de ubicación están desactivados en tu dispositivo. Por favor activalos para centrar el mapa.'
        );
        setIsLocating(false);
        return;
      }

      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      let finalStatus = status;

      if (status !== 'granted') {
        if (!canAskAgain) {
          Alert.alert(
            'Permiso Denegado',
            'El acceso a la ubicación fue rechazado permanentemente. Podés habilitarlo desde los ajustes de la app.'
          );
          setIsLocating(false);
          return;
        }

        const requested = await Location.requestForegroundPermissionsAsync();
        finalStatus = requested.status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permiso de Ubicación',
          'Se necesita acceso a la ubicación para situarte en el mapa.'
        );
        setIsLocating(false);
        return;
      }

      // Fast balanced accuracy fetch
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      if (isValidCoordinate(latitude, longitude)) {
        const coords: Coordinates = { latitude, longitude };
        setUserLocation(coords);
        mapContainerRef.current?.centerTo(latitude, longitude, 15);
      } else {
        Alert.alert('Error', 'Las coordenadas de ubicación recibidas no son válidas.');
      }
    } catch {
      // Fallback to last known location
      try {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (
          lastKnown &&
          isValidCoordinate(lastKnown.coords.latitude, lastKnown.coords.longitude)
        ) {
          const coords: Coordinates = {
            latitude: lastKnown.coords.latitude,
            longitude: lastKnown.coords.longitude,
          };
          setUserLocation(coords);
          mapContainerRef.current?.centerTo(coords.latitude, coords.longitude, 15);
          return;
        }
      } catch {
        // Ignored
      }
      Alert.alert(
        'Ubicación',
        'No se pudo determinar tu posición actual. Verificá la señal de GPS.'
      );
    } finally {
      setIsLocating(false);
    }
  }, [isLocating]);

  const handleZoomIn = useCallback(() => {
    mapContainerRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapContainerRef.current?.zoomOut();
  }, []);

  return {
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
  };
}
