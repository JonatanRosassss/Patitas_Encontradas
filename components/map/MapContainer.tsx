import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Radius } from '../../theme/tokens';
import { Coordinates, MapPet, MapBridgeEvent } from '../../types/map';
import { PILAR_DEFAULT_CENTER } from '../../data/mapMockData';

export interface MapContainerRef {
  centerTo: (lat: number, lng: number, zoom?: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export interface MapContainerProps {
  pets: MapPet[];
  selectedPet: MapPet | null;
  onSelectPet: (pet: MapPet | null) => void;
  userLocation?: Coordinates | null;
  onMapReady?: () => void;
  style?: StyleProp<ViewStyle>;
}

const buildLeafletHtml = (): string => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>Mapa Patitas</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
    html, body, #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: ${Colors.backgroundLight};
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nunito", sans-serif;
      overflow: hidden;
      touch-action: pan-x pan-y;
      user-select: none;
    }
    .custom-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .custom-marker:active {
      transform: scale(0.94);
    }
    .marker-pin {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 3px solid ${Colors.white};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(90, 58, 31, 0.3);
    }
    .pin-perdido {
      background-color: ${Colors.primary};
    }
    .pin-encontrado {
      background-color: ${Colors.secondary};
    }
    .marker-label {
      margin-top: 3px;
      background-color: ${Colors.card};
      color: ${Colors.text};
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(90, 58, 31, 0.2);
      white-space: nowrap;
      border: 1px solid ${Colors.border};
      letter-spacing: 0.2px;
    }
    .marker-selected {
      transform: scale(1.18);
      z-index: 1000 !important;
    }
    .marker-selected .marker-pin {
      border-color: ${Colors.text};
      box-shadow: 0 6px 14px rgba(90, 58, 31, 0.45);
    }
    .user-marker {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: ${Colors.info};
      border: 3px solid ${Colors.white};
      box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.6); }
      70% { box-shadow: 0 0 0 16px rgba(33, 150, 243, 0); }
      100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
    }
    .leaflet-control-attribution {
      font-size: 8px !important;
      background: rgba(255, 255, 255, 0.7) !important;
      padding: 0 4px !important;
      border-radius: 4px;
      margin: 4px !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = null;
    var markersLayer = null;
    var userMarker = null;
    var selectedMarkerId = null;
    var markersMap = new Map();

    function postToRN(type, payload) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload || {} }));
      }
    }

    function initMap() {
      try {
        map = L.map('map', {
          center: [${PILAR_DEFAULT_CENTER.latitude}, ${PILAR_DEFAULT_CENTER.longitude}],
          zoom: ${PILAR_DEFAULT_CENTER.zoom},
          zoomControl: false,
          attributionControl: true
        });

        var tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
          subdomains: 'abcd'
        }).addTo(map);

        tileLayer.on('tileerror', function() {
          postToRN('MAP_ERROR', { error: 'Error cargando teselas de mapa' });
        });

        markersLayer = L.layerGroup().addTo(map);

        map.on('click', function(e) {
          if (e.originalEvent && e.originalEvent._customMarkerClick) return;
          selectedMarkerId = null;
          updateMarkerSelection();
          postToRN('MAP_CLICK');
        });

        map.whenReady(function() {
          postToRN('MAP_READY');
        });
      } catch (err) {
        postToRN('MAP_ERROR', { error: err.message });
      }
    }

    function createMarkerHtml(pet, isSelected) {
      var isPerdido = pet.estado === 1;
      var pinClass = isPerdido ? 'pin-perdido' : 'pin-encontrado';
      var pawSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><ellipse cx="12" cy="16" rx="4.2" ry="3.5"/><circle cx="7" cy="9.5" r="2.3"/><circle cx="17" cy="9.5" r="2.3"/><circle cx="10.5" cy="5.8" r="2.1"/><circle cx="13.5" cy="5.8" r="2.1"/></svg>';
      var checkSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      var iconSvg = isPerdido ? pawSvg : checkSvg;

      return '<div class="custom-marker ' + (isSelected ? 'marker-selected' : '') + '">' +
        '<div class="marker-pin ' + pinClass + '">' + iconSvg + '</div>' +
        '<div class="marker-label">' + pet.nombre + '</div>' +
      '</div>';
    }

    function updateMarkerSelection() {
      markersMap.forEach(function(entry, id) {
        var isSelected = (id === selectedMarkerId);
        var newHtml = createMarkerHtml(entry.pet, isSelected);
        entry.marker.setIcon(L.divIcon({
          className: '',
          html: newHtml,
          iconSize: [60, 72],
          iconAnchor: [30, 68]
        }));
      });
    }

    window.mapBridge = {
      setMarkers: function(pets) {
        if (!markersLayer) return;
        markersLayer.clearLayers();
        markersMap.clear();

        pets.forEach(function(pet) {
          if (!pet.coordenadas || typeof pet.coordenadas.latitude !== 'number' || typeof pet.coordenadas.longitude !== 'number') return;
          var isSelected = (pet.id === selectedMarkerId);
          var icon = L.divIcon({
            className: '',
            html: createMarkerHtml(pet, isSelected),
            iconSize: [60, 72],
            iconAnchor: [30, 68]
          });

          var marker = L.marker([pet.coordenadas.latitude, pet.coordenadas.longitude], { icon: icon });
          marker.on('click', function(e) {
            if (e.originalEvent) {
              e.originalEvent._customMarkerClick = true;
            }
            selectedMarkerId = pet.id;
            updateMarkerSelection();
            postToRN('MARKER_CLICK', { id: pet.id });
          });
          marker.addTo(markersLayer);
          markersMap.set(pet.id, { marker: marker, pet: pet });
        });
      },

      centerTo: function(lat, lng, zoom) {
        if (!map) return;
        map.flyTo([lat, lng], zoom || 15, { duration: 0.75 });
      },

      zoomIn: function() {
        if (map) map.zoomIn();
      },

      zoomOut: function() {
        if (map) map.zoomOut();
      },

      setUserLocation: function(lat, lng) {
        if (!map) return;
        if (userMarker) {
          userMarker.setLatLng([lat, lng]);
        } else {
          var userIcon = L.divIcon({
            className: '',
            html: '<div class="user-marker"></div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });
          userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 2000 }).addTo(map);
        }
      },

      selectPet: function(id) {
        selectedMarkerId = id;
        updateMarkerSelection();
        if (id && markersMap.has(id) && map) {
          var entry = markersMap.get(id);
          map.panTo([entry.pet.coordenadas.latitude, entry.pet.coordenadas.longitude]);
        }
      }
    };

    function handleRNMessage(event) {
      try {
        var msg = JSON.parse(event.data);
        if (msg.type === 'SET_MARKERS') window.mapBridge.setMarkers(msg.payload);
        if (msg.type === 'CENTER') window.mapBridge.centerTo(msg.payload.lat, msg.payload.lng, msg.payload.zoom);
        if (msg.type === 'ZOOM_IN') window.mapBridge.zoomIn();
        if (msg.type === 'ZOOM_OUT') window.mapBridge.zoomOut();
        if (msg.type === 'SET_USER_LOCATION') window.mapBridge.setUserLocation(msg.payload.lat, msg.payload.lng);
        if (msg.type === 'SELECT_PET') window.mapBridge.selectPet(msg.payload.id);
      } catch (e) {
        // Ignored in production
      }
    }

    window.addEventListener('message', handleRNMessage);
    document.addEventListener('message', handleRNMessage);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMap);
    } else {
      initMap();
    }
  </script>
</body>
</html>
`;

export const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(
  function MapContainer(
    {
      pets,
      selectedPet,
      onSelectPet,
      userLocation,
      onMapReady,
      style,
    },
    ref
  ) {
    const webViewRef = useRef<WebView>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [hasError, setHasError] = useState(false);

    const runInWebView = useCallback((code: string) => {
      webViewRef.current?.injectJavaScript(`${code}; true;`);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        centerTo: (lat: number, lng: number, zoom = 15) => {
          runInWebView(
            `window.mapBridge && window.mapBridge.centerTo(${lat}, ${lng}, ${zoom})`
          );
        },
        zoomIn: () => {
          runInWebView(`window.mapBridge && window.mapBridge.zoomIn()`);
        },
        zoomOut: () => {
          runInWebView(`window.mapBridge && window.mapBridge.zoomOut()`);
        },
      }),
      [runInWebView]
    );

    // Sync markers when pets array changes or map becomes ready
    useEffect(() => {
      if (isMapReady) {
        runInWebView(
          `window.mapBridge && window.mapBridge.setMarkers(${JSON.stringify(
            pets
          )})`
        );
      }
    }, [pets, isMapReady, runInWebView]);

    // Sync user location marker
    useEffect(() => {
      if (isMapReady && userLocation) {
        runInWebView(
          `window.mapBridge && window.mapBridge.setUserLocation(${userLocation.latitude}, ${userLocation.longitude})`
        );
      }
    }, [userLocation, isMapReady, runInWebView]);

    // Sync selected pet
    useEffect(() => {
      if (isMapReady) {
        const petId = selectedPet ? `'${selectedPet.id}'` : 'null';
        runInWebView(`window.mapBridge && window.mapBridge.selectPet(${petId})`);
      }
    }, [selectedPet, isMapReady, runInWebView]);

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const data: MapBridgeEvent = JSON.parse(event.nativeEvent.data);
        switch (data.type) {
          case 'MAP_READY':
            setIsMapReady(true);
            setHasError(false);
            if (onMapReady) {
              onMapReady();
            }
            break;
          case 'MARKER_CLICK':
            if (data.payload?.id) {
              const pet = pets.find((p) => p.id === data.payload?.id) || null;
              onSelectPet(pet);
            }
            break;
          case 'MAP_CLICK':
            onSelectPet(null);
            break;
          case 'MAP_ERROR':
            // Non-fatal error report from Leaflet tile/script
            break;
          default:
            break;
        }
      } catch {
        // Ignored
      }
    };

    const handleReload = () => {
      setHasError(false);
      setIsMapReady(false);
      webViewRef.current?.reload();
    };

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={webViewRef}
          source={{ html: buildLeafletHtml() }}
          style={styles.webView}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={false}
          scalesPageToFit={true}
          scrollEnabled={false}
          overScrollMode="never"
          bounces={false}
          onMessage={handleMessage}
          onError={() => setHasError(true)}
          onHttpError={() => setHasError(true)}
        />

        {!isMapReady && !hasError && (
          <View style={styles.loadingOverlay} pointerEvents="auto">
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Cargando mapa interactivo...</Text>
          </View>
        )}

        {hasError && (
          <View style={styles.errorOverlay} pointerEvents="auto">
            <Text style={styles.errorTitle}>No se pudo cargar el mapa</Text>
            <Text style={styles.errorDescription}>
              Comprobá tu conexión a internet e intentá nuevamente.
            </Text>
            <Pressable
              onPress={handleReload}
              accessibilityRole="button"
              accessibilityLabel="Reintentar carga del mapa"
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  loadingText: {
    marginTop: Spacing.two,
    fontFamily: Typography.fonts.bodySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    zIndex: 16,
  },
  errorTitle: {
    fontFamily: Typography.fonts.titleBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  errorDescription: {
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  retryButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  retryButtonText: {
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
    color: Colors.white,
  },
});
