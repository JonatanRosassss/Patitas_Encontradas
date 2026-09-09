import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PetCard } from '@/components/ui/pet-card';
import { BottomTabInset, MaxContentWidth, Colors, Typography } from '@/constants/theme';

export default function HomeScreen() {
  function publicarMascota() {
    console.log('Mascota publicada');
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>
            HOLA, USUARIO
          </Text>
          <Text style={styles.subtitle}>
            ¿Perdiste a tu mascota?
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <Pressable
            style={styles.publishButton}
            onPress={publicarMascota}>
            <Text style={styles.publishButtonText}>PUBLICAR MASCOTA</Text>
          </Pressable>

          <PetCard tipo="PERRO" estado="PERDIDO" nombre="Sebastian" />
          <PetCard tipo="GATO" estado="ENCONTRADO" nombre="Michi" />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.backgroundLight ?? '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'stretch',
    gap: 16,
    paddingBottom: BottomTabInset + 16,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  heroSection: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  title: {
    fontSize: Typography?.sizes?.xxl ?? 24,
    fontFamily: Typography?.fonts?.titleBold,
    color: Colors?.primary ?? '#000000',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: Typography?.sizes?.md ?? 16,
    fontFamily: Typography?.fonts?.bodyRegular,
    color: Colors?.textSecondary ?? '#666666',
    textAlign: 'left',
  },
  stepContainer: {
    gap: 12,
    alignSelf: 'stretch',
    paddingVertical: 16,
  },
  publishButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors?.primary ?? '#ff8c00',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Typography?.sizes?.sm ?? 14,
  },
  petCard: {
    width: '100%',
    height: 150,
    backgroundColor: '#ddd',
    flexDirection: 'row',
    borderRadius: 5,
  },
  petImage: {
    width: 100,
    height: 100,
    backgroundColor: '#999',
    borderRadius: 5,
  },
  petInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  code: {
    textTransform: 'uppercase',
  },
});
