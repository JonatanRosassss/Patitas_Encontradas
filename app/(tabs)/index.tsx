import { useState } from 'react';
import { StyleSheet, Pressable, View, Text, FlatList, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PetCard } from '@/components/ui/pet-card';
import {MaxContentWidth, Colors, Typography} from '@/constants/theme';

const MASCOTAS = [
  {
    id: '1',
    tipo: 'PERRO',
    estado: 'PERDIDO',
    nombre: 'Sebastian',
    descripcion: 'Macho, mediano, collar azul.',
    imagen:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
  },
  {
    id: '2',
    tipo: 'GATO',
    estado: 'ENCONTRADO',
    nombre: 'Michi',
    descripcion: 'Gata mestiza, pelaje tricolor.',
    imagen:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500',
  },
  {
    id: '3',
    tipo: 'LORO',
    estado: 'PERDIDO',
    nombre: 'GERARDO',
    descripcion:
      'Morado cuando come mucho maiz, verde cuando come mucho pasto.',
    imagen:
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500',
  },
];

type Mascota = {
  id: string;
  tipo: string;
  estado: string;
  nombre: string;
  descripcion: string;
  imagen: string;
};

export default function HomeScreen() {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);

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
            onPress={publicarMascota}
          >
            <Text style={styles.publishButtonText}>
              PUBLICAR MASCOTA
            </Text>
          </Pressable>

          <Pressable
            style={styles.filterButton}
            onPress={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Text style={styles.filterButtonText}>
              ...
            </Text>
          </Pressable>

          {mostrarFiltros && (
            <View style={styles.filterPanel}>

              <Text style={styles.filterTitle}>
                FILTRAR POR
              </Text>

              <Text style={styles.filterSubtitle}>
                ESTADO
              </Text>

              <View style={styles.filterOptions}>

                <Pressable
                  style={[styles.filterOption,estadoSeleccionado === 'Todos' && styles.filterOptionActive]}
                  onPress={() => setEstadoSeleccionado('Todos')}
                >
                  <Text style={estadoSeleccionado === 'Todos' ? styles.filterOptionTextActive : styles.filterOptionText}>
                    Todos
                  </Text>
                </Pressable>


                <Pressable
                  style={[styles.filterOption,estadoSeleccionado === 'PERDIDO' && styles.filterOptionActive]}
                  onPress={() => setEstadoSeleccionado('PERDIDO')}
                >

                  <Text style={estadoSeleccionado === 'PERDIDO' ? styles.filterOptionTextActive : styles.filterOptionText}>
                    Perdido
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.filterOption, estadoSeleccionado === 'ENCONTRADO' && styles.filterOptionActive]}
                  onPress={() => setEstadoSeleccionado('ENCONTRADO')}
                >
                  <Text style={estadoSeleccionado === 'ENCONTRADO' ? styles.filterOptionTextActive : styles.filterOptionText}>
                    Encontrado
                  </Text>
                </Pressable>

              </View>
            </View>
          )}

          <FlatList style={styles.petList}
            data={mascotasFiltradas}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
              <View style={{height: 10}} />
            )}
            renderItem={({ item }) => (
              <PetCard onPress={() => setMascotaSeleccionada(item)}
                tipo={item.tipo}
                estado={item.estado}
                nombre={item.nombre}
                imagen={item.imagen}
              />
            )}
          />

        </View>

        <Modal
          visible={mascotaSeleccionada !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMascotaSeleccionada(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {mascotaSeleccionada && (
                <>
                  <Image
                    source={{ uri: mascotaSeleccionada.imagen }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.modalTitle}>{mascotaSeleccionada.nombre}</Text>
                  <Text style={styles.modalSubtitle}>
                    {mascotaSeleccionada.tipo} - {mascotaSeleccionada.estado}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {mascotaSeleccionada.descripcion}
                  </Text>

                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setMascotaSeleccionada(null)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
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
    gap: 1,
    paddingBottom: -50,
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
    flex: 1,
    gap: 1,
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
    flexDirection: 'row',
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

  petList: {
  flex: 1,
  marginTop: 16,
},

  filterOptionText: {
    color: '#000000',
},

  filterOptionActive: {
    backgroundColor: Colors?.primary ?? '#ff8c00',
    borderColor: Colors?.primary ?? '#ff8c00',
},

  filterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
},

//modal styles

/* ESTILOS DEL MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
},
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
},
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
},
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
},
  modalSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
},
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
},
  closeButton: {
    backgroundColor: Colors?.primary ?? '#FF8C00',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
},
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
},
});

