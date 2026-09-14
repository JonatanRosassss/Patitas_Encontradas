import { StyleSheet, Pressable, View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useState } from 'react';
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
    imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500', // URL actualizada
  },
  {
    id: '3',
    tipo: 'LORO',
    estado: 'PERDIDO',
    nombre: 'GERARDO',
    descripcion: 'Morado cuando come mucho maiz, verde cuando come mucho pasto.',
    imagen: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500', // URL actualizada
  },
  ];


export default function HomeScreen() {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  function publicarMascota() {
    console.log('Mascota publicada');
  }

  const mascotasFiltradas = MASCOTAS.filter((item) => {
  const coincideEstado =
    estadoSeleccionado === 'Todos' ||
    item.estado === estadoSeleccionado;

  return coincideEstado;
  });

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

          <Pressable style={styles.filterButton}
            onPress={() => setMostrarFiltros(!mostrarFiltros)}>
            <Text style={styles.filterButtonText}>...</Text>
          </Pressable>
          {mostrarFiltros && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>FILTROS</Text>

            <View style={styles.filterOptions}>

              <Pressable
                style={styles.filterOption}
                onPress={() => setEstadoSeleccionado('Todos')}>
                <Text>Todos</Text>
              </Pressable>

              <Pressable
                style={styles.filterOption}
                onPress={() => setEstadoSeleccionado('PERDIDO')}>
                <Text>Perdido</Text>
              </Pressable>

              <Pressable
                style={styles.filterOption}
                onPress={() => setEstadoSeleccionado('ENCONTRADO')}>
                <Text>Encontrado</Text>
              </Pressable>

            </View>
          </View>
          )}

          <FlatList
            data={mascotasFiltradas}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <PetCard 
              tipo={item.tipo}
              estado={item.estado}
              nombre={item.nombre}
              //descripcion={item.descripcion}
              imagen={item.imagen}
               />
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

  filterButton: {
  width: 50,
  height: 40,
  borderRadius: 10,
  backgroundColor: '#EEEEEE',
  alignItems: 'center',
  justifyContent: 'center',
  },

filterButtonText: {
  fontSize: 20,
  fontWeight: 'bold',
  },

  filterPanel: {
  padding: 16,
  backgroundColor: '#EEEEEE',
  borderRadius: 10,
},

filterTitle: {
  fontSize: 16,
  fontWeight: 'bold',
},

filterSubtitle: {
  fontSize: 14,
  fontWeight: 'bold',
  marginTop: 10,
  },

  filterOptions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
  },

  filterOption: {
  paddingHorizontal: 12,
  paddingVertical: 8,
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#DDDDDD',
  alignItems: 'center',
  justifyContent: 'center',
  },

prueba: {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  backgroundColor: '#FF8A00',
  padding: 10,
}
});
