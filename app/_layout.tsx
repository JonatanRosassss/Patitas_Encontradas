import { Stack } from 'expo-router';
import { useFonts, Baloo2_700Bold, Baloo2_600SemiBold, Baloo2_500Medium, Baloo2_400Regular } from '@expo-google-fonts/baloo-2';
import { Nunito_700Bold, Nunito_600SemiBold, Nunito_400Regular, Nunito_300Light } from '@expo-google-fonts/nunito';

import { Colors, Typography } from '../constants/theme';

export default function RootLayout() {
  useFonts({
    Baloo2_700Bold,
    Baloo2_600SemiBold,
    Baloo2_500Medium,
    Baloo2_400Regular,
    Nunito_700Bold,
    Nunito_600SemiBold,
    Nunito_400Regular,
    Nunito_300Light,
  });

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="(auth)/login"
    >
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="detalle/[id]"
        options={{
          headerShown: true,
          title: 'Detalle',
          headerTintColor: Colors.primary,
          headerStyle: { backgroundColor: Colors.card },
          headerTitleStyle: { fontFamily: Typography.fonts.titleBold, color: Colors.text },
        }}
      />
    </Stack>
  );
}
