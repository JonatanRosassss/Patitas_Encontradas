import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { Coordinates, MapFilterIndex, MapPet } from '../types/map';
import { MASCOTAS_MOCK } from '../data/mapMockData';

import { isValidCoordinate } from '../utils/geoValidation';
import { MapContainerRef } from '../components/map/MapContainer';
import { listarAlertasParaMapa } from '../services/mascotasService';

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
  cargandoPuntos: boolean;
  puntosCargados: boolean;
  recargarPuntos: () => Promise<void>;
}

export function useMapState(initialPets: MapPet[] = MASCOTAS_MOCK): UseMapStateReturn {
  const {
    alertaId: alertaIdParam,
    lat: latParam,
    lng: lngParam,
    zoom: zoomParam,
  } = useLocalSearchParams<{
    alertaId?: string | string[];
    lat?: string | string[];
    lng?: string | string[];
    zoom?: string | string[];
  }>();
  const alertaId = Array.isArray(alertaIdParam) ? alertaIdParam[0] : alertaIdParam;
  const latParamVal = Array.isArray(latParam) ? latParam[0] : latParam;
  const lngParamVal = Array.isArray(lngParam) ? lngParam[0] : lngParam;
  const zoomParamVal = Array.isArray(zoomParam) ? zoomParam[0] : zoomParam;

  const alertaProcesada = useRef<string | null>(null);
  const [pets, setPets] = useState<MapPet[]>(initialPets);
  const [cargandoPuntos, setCargandoPuntos] = useState(false);
  const [puntosCargados, setPuntosCargados] = useState(false);
  const [filtro, setFiltro] = useState<MapFilterIndex>(0);
  const [selectedPet, setSelectedPet] = useState<MapPet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const mapContainerRef = useRef<MapContainerRef>(null);

  const recargarPuntos = useCallback(async () => {
    try {
      setCargandoPuntos(true);
      const alertasFirebase = await listarAlertasParaMapa();
      if (alertasFirebase && alertasFirebase.length > 0) {
        setPets(alertasFirebase);
      } else {
        // Fallback a los puntos iniciales si no hay alertas en Firestore
        setPets(initialPets);
      }
    } catch {
      // Manejo resiliente offline o restricciones temporales de Firestore
      setPets(initialPets);
    } finally {
      setCargandoPuntos(false);
      setPuntosCargados(true);
    }
  }, [initialPets]);

  useEffect(() => {
    recargarPuntos();
  }, [recargarPuntos]);

  const filteredPets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return pets.filter((pet) => {
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
        const matchesName = (pet.nombre || '').toLowerCase().includes(query);
        const matchesLocation = (pet.ubicacion || '').toLowerCase().includes(query);
        const matchesDescription = (pet.descripcion || '').toLowerCase().includes(query);
        if (!matchesName && !matchesLocation && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  }, [pets, filtro, searchQuery]);

  // Centrar y hacer zoom in animado cuando vienen coordenadas explícitas por navegación
  useEffect(() => {
    if (latParamVal && lngParamVal) {
      const latNum = parseFloat(latParamVal);
      const lngNum = parseFloat(lngParamVal);
      const zoomNum = zoomParamVal ? parseInt(zoomParamVal, 10) : 16;
      if (isValidCoordinate(latNum, lngNum)) {
        const timer = setTimeout(() => {
          mapContainerRef.current?.centerTo(latNum, lngNum, zoomNum);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [latParamVal, lngParamVal, zoomParamVal]);

  useEffect(() => {
    if (!alertaId) return;
    alertaProcesada.current = null;
    setFiltro(0);
    setSearchQuery('');
    setSelectedPet(null);
  }, [alertaId]);

  useEffect(() => {
    if (
      !alertaId ||
      !puntosCargados ||
      cargandoPuntos ||
      filtro !== 0 ||
      searchQuery !== '' ||
      alertaProcesada.current === alertaId
    ) {
      return;
    }

    alertaProcesada.current = alertaId;
    const alerta = filteredPets.find((pet) => pet.id === alertaId);
    if (!alerta) {
      // Si la alerta no está en el listado filtrado pero vinieron coordenadas por query param,
      // no mostramos error porque el mapa ya voló y se centró en la zona.
      if (!latParamVal || !lngParamVal) {
        Alert.alert(
          'Alerta no disponible en el mapa',
          'No se encontró una ubicación válida para esta mascota.'
        );
      }
      return;
    }

    setSelectedPet(alerta);
    mapContainerRef.current?.centerTo(
      alerta.coordenadas.latitude,
      alerta.coordenadas.longitude,
      16
    );
  }, [
    alertaId,
    cargandoPuntos,
    filtro,
    filteredPets,
    latParamVal,
    lngParamVal,
    puntosCargados,
    searchQuery,
  ]);

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
    cargandoPuntos,
    puntosCargados,
    recargarPuntos,
  };
}
