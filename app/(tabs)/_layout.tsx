import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="publicar-alerta"
        options={{
          title: 'Publicar',
          href: null, // Oculto de la barra inferior si navegas con el botón
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
      <Tabs.Screen
        name="reporte_error"
        options={{
          title: 'Reporte',
        }}
      />
    </Tabs>
  );
}