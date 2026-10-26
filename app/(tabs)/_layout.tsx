import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, TabBarMetrics } from '../../constants/theme';

export default function TabLayout() {
  // Expo 57 dibuja edge-to-edge en Android: la barra de 3 botones / gestos se superpone
  // a la app. Sumamos el inset inferior real para que la tab bar quede SIEMPRE por encima.
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, TabBarMetrics.minBottomPadding);

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
          height: TabBarMetrics.contentHeight + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: TabBarMetrics.paddingTop,
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="publicar-alerta"
        options={{
          title: 'Publicar',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size + 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
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