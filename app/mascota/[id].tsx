import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  Linking, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface Mascota {
  id?: string;
  nombre: string;
  tipo: string;
  estado: 'Perdido' | 'Encontrado' | 'Visto';
  imagenUrl?: string;
  ubicacion?: string;
  descripcion?: string;
  telefonoContacto: string;
}

export default function DetalleMascotaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const obtenerMascota = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'mascotas', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMascota({ id: docSnap.id, ...docSnap.data() } as Mascota);
        } else {
          Alert.alert('Aviso', 'No se encontró la publicación especificada.');
        }
      } catch (error) {
        console.error('Error al consultar Firestore:', error);
        Alert.alert('Error', 'Ocurrió un error al cargar la información.');
      } finally {
        setCargando(false);
      }
    };

    obtenerMascota();
  }, [id]);

  const abrirWhatsApp = async () => {
    if (!mascota?.telefonoContacto) {
      Alert.alert('Sin contacto', 'Esta publicación no cuenta con un número de teléfono registrado.');
      return;
    }

    const numeroLimpio = mascota.telefonoContacto.replace(/[^0-9]/g, '');
    const mensaje = encodeURIComponent(
      `¡Hola! Vi tu publicación de ${mascota.nombre || 'la mascota'} en Patitas Encontradas.`
    );
    const url = `[suspicious link removed]{numeroLimpio}?text=${mensaje}`;

    try {
      const sePuedeAbrir = await Linking.canOpenURL(url);
      if (sePuedeAbrir) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se pudo abrir la aplicación de WhatsApp.');
      }
    } catch (error) {
      console.error('Error abriendo WhatsApp:', error);
      Alert.alert('Error', 'Ocurrió un problema al intentar redireccionar.');
    }
  };

  if (cargando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text style={styles.cargandoTexto}>Cargando datos de la mascota...</Text>
      </View>
    );
  }

  if (!mascota) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTexto}>La mascota no está disponible.</Text>
        <TouchableOpacity style={styles.btnVolver} onPress={() => router.back()}>
          <Text style={styles.btnVolverTexto}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {mascota.imagenUrl ? (
        <Image source={{ uri: mascota.imagenUrl }} style={styles.imagen} />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.imagenPlaceholderTexto}>Sin Imagen</Text>
        </View>
      )}

      <View style={styles.contenido}>
        <View style={styles.headerRow}>
          <Text style={styles.nombre}>{mascota.nombre || 'Mascota sin nombre'}</Text>
          <View
            style={[
              styles.badge,
              mascota.estado === 'Perdido' ? styles.badgePerdido : styles.badgeEncontrado,
            ]}
          >
            <Text style={styles.badgeTexto}>{mascota.estado}</Text>
          </View>
        </View>

        <Text style={styles.tipo}>{mascota.tipo || 'Mascota'}</Text>

        {mascota.ubicacion && (
          <View style={styles.bloqueInfo}>
            <Text style={styles.label}>📍 Ubicación:</Text>
            <Text style={styles.valor}>{mascota.ubicacion}</Text>
          </View>
        )}

        {mascota.descripcion && (
          <View style={styles.bloqueInfo}>
            <Text style={styles.label}>📝 Descripción / Señas particulares:</Text>
            <Text style={styles.valor}>{mascota.descripcion}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btnWhatsapp} onPress={abrirWhatsApp} activeOpacity={0.85}>
          <Text style={styles.btnWhatsappTexto}>💬 Contactar por WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  cargandoTexto: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorTexto: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  imagen: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imagenPlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagenPlaceholderTexto: {
    color: '#888',
    fontSize: 18,
  },
  contenido: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5A3A1F',
    flex: 1,
  },
  tipo: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
    fontSize: 12,
  },
  bloqueInfo: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5A3A1F',
    marginBottom: 4,
  },
  valor: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  btnWhatsapp: {
    backgroundColor: '#25D366',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  btnWhatsappTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnVolver: {
    backgroundColor: '#FF8A00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnVolverTexto: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
