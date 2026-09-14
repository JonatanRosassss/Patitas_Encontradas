import { StyleSheet, Pressable, View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PetCard } from '@/components/ui/pet-card';
import { BottomTabInset, MaxContentWidth, Colors, Typography } from '@/constants/theme';

const MASCOTAS = [
  {
    id: '1',
    tipo: 'PERRO',
    estado: 'PERDIDO',
    nombre: 'Sebastian',
    descripcion: 'Macho, mediano, collar azul.',
    imagen: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
  },
  {
    id: '2',
    tipo: 'GATO',
    estado: 'ENCONTRADO',
    nombre: 'Michi',
    descripcion: 'Gata mestiza, pelaje tricolor.',
    imagen: 'https://images.unsplash.com/photo-1601758123927-1c2a0f3b8e5d?w=500',
  },
  {
    id: '3',
    tipo: 'LORO',
    estado: 'PERDIDO',
    nombre: 'GERARDO',
    descripcion: 'Morado cuando come mucho maiz, verde cuando come mucho pasto.',
    imagen: 'https://images.unsplash.com/photo-1601758123927-1c2a0f3b8e5d?w=500',
  },
];


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

          <FlatList
            data={MASCOTAS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PetCard tipo={item.tipo} estado={item.estado} nombre={item.nombre} imagen={item.imagen} />
            )}
          />

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
    color: Colors?.textSecondary ?? '#ffffff',
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
  code: {
    textTransform: 'uppercase',
  },
});
