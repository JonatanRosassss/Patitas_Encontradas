import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet,
  Pressable,
  View,
  Text,
  FlatList,
  Modal,
  Image,Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { PetCard } from '@/components/ui/pet-card';
import { BottomTabInset, MaxContentWidth, Colors, Typography } from '@/constants/theme';
//import GuiaDeUso from '@/components/GuiaDeUso';
import GuiaDeUso, {
  type RectanguloGuia,
} from '@/components/GuiaDeUso';


import { crearColeccionAlertas } from "../scripts/crearColeccionAlertas";
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
  const [mostrarGuia, setMostrarGuia] = useState(false);

  const [pasoGuia, setPasoGuia] = useState(0);

const [targetRect, setTargetRect] =
  useState<RectanguloGuia | null>(null);

const publicarRef = useRef<View>(null);
const filtrosRef = useRef<View>(null);
const mascotaRef = useRef<View>(null);



useEffect(() => {
  async function verificarGuia() {
    try {
      const guiaVista = await AsyncStorage.getItem('guiaDeUsoVista');

      if (guiaVista !== 'true') {
        setMostrarGuia(true);
      }
    } catch (error) {
      console.error('Error al verificar la guía:', error);
    }
  }

  verificarGuia();
}, []);

useEffect(() => {
  if (!mostrarGuia) {
    setTargetRect(null);
    return;
  }

  const referencias = [
    publicarRef,
    filtrosRef,
    mascotaRef,
  ];

  const referencia = referencias[pasoGuia]?.current;

  if (!referencia) {
    setTargetRect(null);
    return;
  }

  const frame = requestAnimationFrame(() => {
    referencia.measureInWindow((x, y, width, height) => {
      setTargetRect({
        x,
        y,
        width,
        height,
      });
    });
  });

  return () => cancelAnimationFrame(frame);
}, [mostrarGuia, pasoGuia]);

async function cerrarGuia() {
  setMostrarGuia(false);

  try {
    await AsyncStorage.setItem('guiaDeUsoVista', 'true');
  } catch (error) {
    console.error('Error al guardar el estado de la guía:', error);
  }
}

  function publicarMascota() {
    router.push('/publicar-alerta');
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

  <Pressable
    style={styles.botonGuia}
    onPress={() => setMostrarGuia(true)}
  >
    <Text style={styles.textoBotonGuia}>
      📖 GUÍA DE USO
    </Text>
  </Pressable>
</View>

        <View style={styles.stepContainer}>

       <Pressable
  ref={publicarRef}
  style={styles.publishButton}
  onPress={publicarMascota}
>
  <Text style={styles.publishButtonText}>
    PUBLICAR MASCOTA
  </Text>
</Pressable>

     <Pressable
  ref={filtrosRef}
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
  <View
    ref={
      item.id === mascotasFiltradas[0]?.id
        ? mascotaRef
        : undefined
    }
    collapsable={false}
  >
    <PetCard
      onPress={() => setMascotaSeleccionada(item)}
      tipo={item.tipo}
      estado={item.estado}
      nombre={item.nombre}
      imagen={item.imagen}
    />
  </View>
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
      
<GuiaDeUso
  visible={mostrarGuia}
  pasoActual={pasoGuia}
  targetRect={targetRect}
  onNext={() => {
    setPasoGuia((actual) => Math.min(actual + 1, 2));
  }}
  onPrevious={() => {
    setPasoGuia((actual) => Math.max(actual - 1, 0));
  }}
  onClose={cerrarGuia}
/>

<Pressable
  style={styles.botonNotificaciones}
  onPress={() => router.push("/notificaciones")}
>
  <Text style={styles.textoBotonNotificaciones}>
    🔔 NOTIFICACIONES
  </Text>
</Pressable>


<Pressable
  onPress={async () => {
    try {
      await crearColeccionAlertas();
      Alert.alert("Correcto", "Colección alertas inicializada.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo inicializar alertas.");
    }
  }}
>
  <Text>Inicializar colección alertas</Text>
</Pressable>
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
    gap: 12,
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
  // modal styles
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

  botonGuia: {
  alignSelf: 'flex-start',
  marginTop: 8,
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: Colors?.primary ?? '#39805B',
  backgroundColor: '#FFFFFF',
},

textoBotonGuia: {
  color: Colors?.primary ?? '#39805B',
  fontSize: 13,
  fontWeight: '700',
},

botonNotificaciones: {
  backgroundColor: "#FFE7D2",
  borderWidth: 1,
  borderColor: "#FFC28A",
  borderRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 16,
  alignSelf: "flex-start",
  marginTop: 8,
},
textoBotonNotificaciones: {
  color: "#5A3A1F",
  fontWeight: "700",
  fontSize: 14,
},
});

