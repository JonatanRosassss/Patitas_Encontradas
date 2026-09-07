import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

interface HomeScreenProps {}

export default function HomeScreen({}: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Patitas Encontradas</Text>
      <Text style={styles.subtitulo}>Feed de Mascotas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 20,
  },
  titulo: {
    fontSize: Typography.sizes.xxl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },
});
