import { StyleSheet, Pressable, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PetCard } from '@/components/ui/pet-card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

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
            Perdiste a tu mascota?
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <Pressable
            style={styles.publishButtonText}
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
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    gap: 16,
    paddingBottom: BottomTabInset + 16,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 24,
    gap: 16,
  },

  title: {
    alignItems: 'flex-start',
    textAlign: 'left',
  },

  subtitle: {
  textAlign: 'left',
  },

  publishButtonText: {
  paddingHorizontal: 20,
  paddingVertical: 10,
  backgroundColor: '#ff8c00',
  alignItems: 'center',
  borderRadius: 10,
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
  stepContainer: {
    gap: 8,
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 24,
  },

});