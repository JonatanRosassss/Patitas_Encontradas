import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.select({
    ios: 28,
    web: 8,
    default: Math.max(8, insets.bottom),
  });
  const tabHeight = Platform.select({
    ios: 88,
    web: 64,
    default: 60 + (insets.bottom > 0 ? insets.bottom : 8),
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBackground,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          ...Platform.select({
            web: { boxShadow: '0px -2px 10px rgba(90, 58, 31, 0.06)' },
            default: {
              shadowColor: Colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 12,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: Typography.sizes.xs,
          fontFamily: Typography.fonts.bodyBold,
        },
      }}
    >
      {/* 1. INICIO (HOME) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      {/* 2. MAPA */}
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      {/* 3. BOTÓN DESTACADO AL MEDIO: PUBLICAR / REPORTAR */}
      <Tabs.Screen
        name="publicar-alerta"
        options={{
          title: 'Reportar',
          tabBarIcon: ({ focused }) => (
            <View style={styles.botonCrearContenedor}>
              <View style={[styles.botonCrearCirculo, focused && styles.botonCrearActivo]}>
                <Ionicons name="add" size={30} color={Colors.white} />
              </View>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />

      {/* 4. PERFIL / AJUSTES */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      {/* Soporte queda oculto de la barra inferior (href: null), accesible únicamente desde Ajustes en Perfil */}
      <Tabs.Screen
        name="reporte_error"
        options={{
          title: 'Soporte',
          href: null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  botonCrearContenedor: {
    top: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonCrearCirculo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  botonCrearActivo: {
    backgroundColor: Colors.primary,
    opacity: 0.9,
    transform: [{ scale: 1.05 }],
  },
});

