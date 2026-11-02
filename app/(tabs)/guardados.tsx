
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import {
  obtenerIdsPublicacionesGuardadas,
  listarTodasLasAlertas,
  quitarPublicacionGuardada,
} from '@/services/mascotasService';

import type { Pet } from '@/types/Pet';
import { Colors } from '@/constants/theme';

export default function GuardadosScreen() {
  const [publicaciones, setPublicaciones] = useState<Pet[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarGuardados = useCallback(async () => {
    try {
      setCargando(true);
      setError('');

      const ids = await obtenerIdsPublicacionesGuardadas();

      if (ids.length === 0) {
        setPublicaciones([]);
        return;
      }

      const todas = await listarTodasLasAlertas();

      const guardadas = todas.filter((pet) => ids.includes(pet.id));

      setPublicaciones(guardadas);
    } catch (err) {
      console.error('Error al cargar guardados:', err);
      setError('No se pudieron cargar tus publicaciones guardadas.');
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarGuardados();
    }, [cargarGuardados])
  );

const eliminarGuardado = async (id: string) => {
  try {
    await quitarPublicacionGuardada(id);

    setPublicaciones((actuales) =>
      actuales.filter((pet) => pet.id !== id)
    );

    setError('');
  } catch (err) {
    console.error('Error al quitar publicación:', err);
    setError('No se pudo quitar la publicación de tus guardados.');
  }
};

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.textoSecundario}>Cargando tus guardados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Mis guardados</Text>
        <Text style={styles.subtitulo}>
          Publicaciones que querés tener a mano
        </Text>
      </View>

      {error !== '' && (
        <Text style={styles.error}>{error}</Text>
      )}

      <FlatList
        data={publicaciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Ionicons
              name="bookmark-outline"
              size={58}
              color={Colors.primary}
            />
            <Text style={styles.vacioTitulo}>
              Todavía no tenés publicaciones guardadas
            </Text>
            <Text style={styles.textoSecundario}>
              Tocá el marcador de una publicación para guardarla.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const imagen =
            item.fotos?.[0] ||
            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500';

          const ubicacion =
            typeof item.ubicacion === 'string'
              ? item.ubicacion
              : item.ubicacion?.direccion || 'Ubicación no especificada';

          return (
            <View style={styles.tarjeta}>
              <Image
                source={{ uri: imagen }}
                style={styles.imagen}
              />

              <View style={styles.informacion}>
                <Text style={styles.nombre}>
                  {item.nombre || 'Mascota sin nombre'}
                </Text>

                <Text style={styles.detalle}>
                  {item.especie} · {item.estado}
                </Text>

                <Text style={styles.ubicacion} numberOfLines={2}>
                  {ubicacion}
                </Text>
              </View>

              <Pressable
                style={styles.botonEliminar}
                onPress={() => eliminarGuardado(item.id)}
                accessibilityRole="button"
                accessibilityLabel="Quitar de guardados"
              >
                <Ionicons
                  name="bookmark"
                  size={23}
                  color={Colors.primary}
                />
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 24,
  },
  encabezado: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#292929',
  },
  subtitulo: {
    fontSize: 14,
    color: '#777777',
    marginTop: 5,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 25,
    flexGrow: 1,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  imagen: {
    width: 85,
    height: 85,
    borderRadius: 11,
    backgroundColor: '#EEEEEE',
  },
  informacion: {
    flex: 1,
    marginHorizontal: 12,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#292929',
  },
  detalle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 5,
  },
  ubicacion: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
  },
  botonEliminar: {
    padding: 9,
  },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  textoSecundario: {
    color: '#777777',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  vacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    minHeight: 350,
  },
  vacioTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginTop: 18,
  },
  error: {
    color: '#C62828',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
});
