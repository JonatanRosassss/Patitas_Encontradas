import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface AlertaMascota {
  id: string;
  nombre?: string;
  especie?: string;
  estado?: string;
  tipoAlerta?: string;
  fotoUrl?: string;
  imagenUrl?: string;
  fotoUri?: string;
  foto?: string;
  imagen?: string;
  ubicacion?: string;
  direccionAproximada?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [mascotas, setMascotas] = useState<AlertaMascota[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'alertas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista: AlertaMascota[] = [];
      snapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() } as AlertaMascota);
      });
      setMascotas(lista);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: AlertaMascota }) => {
    const imagen =
      item.fotoUrl ||
      item.imagenUrl ||
      item.fotoUri ||
      item.foto ||
      item.imagen;

    const nombre = item.nombre || 'Mascota reportada';
    const especie = item.especie || 'Mascota';
    const estado = item.estado || item.tipoAlerta || 'Alerta';
    const ubicacion = item.ubicacion || item.direccionAproximada;
    const esPerdido = estado.toLowerCase().includes('perd');

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => router.push(`/mascota/${item.id}`)}
      >
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.cardImagen} />
        ) : (
          <View style={styles.cardImagenPlaceholder}>
            <Text style={styles.placeholderTexto}>Sin Foto</Text>
          </View>
        )}

        <View style={styles.cardContenido}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardNombre}>{nombre}</Text>
            <View style={[styles.badge, esPerdido ? styles.badgePerdido : styles.badgeEncontrado]}>
              <Text style={styles.badgeTexto}>{estado}</Text>
            </View>
          </View>

          <Text style={styles.cardTipo}>{especie}</Text>

          {ubicacion && <Text style={styles.cardUbicacion}>📍 {ubicacion}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (cargando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8A00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloHeader}>🐾 Patitas Encontradas</Text>
        <Text style={styles.subtituloHeader}>Alertas comunitarias en Pilar</Text>
      </View>

      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tituloHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF8A00',
  },
  subtituloHeader: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImagen: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardImagenPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTexto: {
    color: '#888',
    fontSize: 16,
  },
  cardContenido: {
    padding: 15,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A3A1F',
    flex: 1,
  },
  cardTipo: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
    marginBottom: 8,
  },
  cardUbicacion: {
    fontSize: 14,
    color: '#444',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgePerdido: {
    backgroundColor: '#FF3B30',
  },
  badgeEncontrado: {
    backgroundColor: '#34C759',
  },
  badgeTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
});
