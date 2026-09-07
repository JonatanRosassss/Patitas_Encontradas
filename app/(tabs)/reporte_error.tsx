import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

interface ReporteErrorScreenProps {}

export default function ReporteErrorScreen({}: ReporteErrorScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Reporte de Error</Text>
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
    color: Colors.error,
  },
});
