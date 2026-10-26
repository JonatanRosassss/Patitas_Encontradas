import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF8A00',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* 1. INICIO (HOME) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size || 22} color={color} />
          ),
        }}
      />

      {/* 2. MAPA */}
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size || 22} color={color} />
          ),
        }}
      />

      {/* 3. BOTÓN DESTACADO AL MEDIO: PUBLICAR / REPORTAR */}
      <Tabs.Screen
        name="publicar"
        options={{
          title: 'Reportar',
          tabBarIcon: ({ focused }) => (
            <View style={styles.botonCrearContenedor}>
              <View style={[styles.botonCrearCirculo, focused && styles.botonCrearActivo]}>
                <Ionicons name="add" size={30} color="#FFFFFF" />
              </View>
            </View>
          ),
          tabBarLabel: () => null, // Oculta el texto para que resalte el círculo
        }}
      />

      {/* 4. PERFIL / AJUSTES */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size || 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  botonCrearContenedor: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonCrearCirculo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FF8A00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 5,
  },
  botonCrearActivo: {
    backgroundColor: '#E07800',
    transform: [{ scale: 1.05 }],
  },
});
