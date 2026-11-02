import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../constants/theme';

export default function TabLayout() {
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
         height: Platform.select({ ios: 90, web: 72, default: 72 }),
paddingBottom: Platform.select({ ios: 28, web: 8, default: 8 }),
paddingTop: 8,
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
    tabBarLabel: () => null,
    tabBarIcon: ({ focused }) => (
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: Colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: -20,
          borderWidth: focused ? 3 : 0,
          borderColor: '#FFFFFF',
          elevation: 5,
          shadowColor: '#000000',
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Ionicons
          name="add"
          size={30}
          color="#FFFFFF"
        />
      </View>
    ),
  }}
/>
      {/* 4. PUBLICACIONES GUARDADAS */}
<Tabs.Screen
  name="guardados"
  options={{
    title: 'Guardados',
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons
        name={focused ? 'bookmark' : 'bookmark-outline'}
        size={size || 22}
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