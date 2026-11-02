import React, { useMemo } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';

import { Colors, Radius, DetailMetrics } from '@/constants/theme';
import type { PetLocationMapProps } from '@/types/Detalle';

function generarHtmlMapa(lat: number, lng: number, zoom: number, colorPin: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #map {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: ${Colors.backgroundLight};
    }
    .pin-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }
    .pin-body {
      width: 28px;
      height: 28px;
      border-radius: 50% 50% 50% 0;
      background-color: ${colorPin};
      transform: rotate(-45deg);
      border: 3px solid ${Colors.white};
      box-shadow: 0 4px 10px rgba(90, 58, 31, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pin-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: ${Colors.white};
      transform: rotate(45deg);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    try {
      var map = L.map('map', {
        center: [${lat}, ${lng}],
        zoom: ${zoom},
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      var pinIcon = L.divIcon({
        className: 'pin-wrapper',
        html: '<div class="pin-body"><div class="pin-dot"></div></div>',
        iconSize: [36, 36],
        iconAnchor: [18, 32]
      });

      L.marker([${lat}, ${lng}], { icon: pinIcon }).addTo(map);
    } catch (e) {
      // Ignorar errores de Leaflet en carga sin conexión
    }
  </script>
</body>
</html>`;
}

export function PetLocationMap({
  coordenadas,
  esAproximada,
  colorPin,
  onPress,
}: PetLocationMapProps) {
  const zoom = esAproximada ? DetailMetrics.mapZoomApprox : DetailMetrics.mapZoomExact;

  const html = useMemo(
    () => generarHtmlMapa(coordenadas.latitude, coordenadas.longitude, zoom, colorPin),
    [coordenadas.latitude, coordenadas.longitude, zoom, colorPin]
  );

  return (
    <Pressable
      style={styles.contenedor}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Ver ubicación completa en el mapa"
      disabled={!onPress}
    >
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={html}
          title="Ubicación de la mascota en Pilar"
          style={{
            width: '100%',
            height: DetailMetrics.mapHeight,
            border: 'none',
            borderRadius: Radius.lg,
            pointerEvents: onPress ? 'none' : 'auto',
          }}
        />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          scrollEnabled={false}
          pointerEvents={onPress ? 'none' : 'auto'}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: '100%',
    height: DetailMetrics.mapHeight,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.accent,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
