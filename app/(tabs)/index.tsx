import { StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { PetCard } from '@/components/pet-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';



export default function HomeScreen() {


  function publicarMascota() {
  console.log('Mascota publicada');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="small" style={styles.title}>
            HOLA, USUARIO
          </ThemedText>

          <ThemedText type="small" style={styles.subtitle}>
            Perdiste a tu mascota?
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <Pressable
            style={styles.publishButton}
            onPress={publicarMascota}>
            <ThemedText>PUBLICAR MASCOTA</ThemedText>
          </Pressable>

          <PetCard tipo="PERRO" estado="PERDIDO" nombre="Sebastian" />
          <PetCard tipo="GATO" estado="ENCONTRADO" nombre="Michi" />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
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
    paddingHorizontal: Spacing.four,
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },

  title: {
    alignItems: 'flex-start',
    textAlign: 'left',
  },

  subtitle: {
  textAlign: 'left',
  },

  publishButton: {
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
    gap: Spacing.two,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },

});