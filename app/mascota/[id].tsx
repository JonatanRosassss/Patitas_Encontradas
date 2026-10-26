import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface AlertaDetalle {
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
  descripcion?: string;
  telefonoContacto?: string;
  telefono?: string;
}

export default function DetalleMascotaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [mascota, setMascota] = useState<AlertaDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);

  // READ (Detalle)
  useEffect(() => {
    if (!id) return;

    const cargarAlerta = async () => {
      try {
        const docRef = doc(db, 'alertas', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMascota({ id: docSnap.id, ...docSnap.data() } as AlertaDetalle);
        } else {
          if (Platform.OS === 'web') {
            window.alert('La publicación no existe o fue eliminada.');
          } else {
            Alert.alert('No encontrada', 'La publicación no existe o fue eliminada.');
          }
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error al cargar detalle:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarAlerta();
  }, [id]);

  // UPDATE (Cambiar estado: Perdido <-> Encontrado)
  const handleCambiarEstado = async () => {
    if (!id || !mascota) return;
    setProcesando(true);
    try {
      const nuevoEstado = mascota.estado === 'ENCONTRADO' ? 'PERDIDO' : 'ENCONTRADO';
      const docRef = doc(db, 'alertas', id as string);
      await updateDoc(docRef, { estado: nuevoEstado });
      setMascota({ ...mascota, estado: nuevoEstado });

      if (Platform.OS === 'web') {
        window.alert(`Estado actualizado a "${nuevoEstado}".`);
      } else {
        Alert.alert('Éxito', `Estado actualizado a "${nuevoEstado}".`);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      if (Platform.OS === 'web') {
        window.alert('No se pudo actualizar el estado.');
      } else {
        Alert.alert('Error', 'No se pudo actualizar el estado de la publicación.');
      }
    } finally {
      setProcesando(false);
    }
  };

  // DELETE (Eliminar publicación)
  const ejecutarBorrado = async () => {
    if (!id) return;
    setProcesando(true);
    try {
      const docRef = doc(db, 'alertas', id as string);
      await deleteDoc(docRef);

      if (Platform.OS === 'web') {
        window.alert('Publicación eliminada correctamente.');
      } else {
        Alert.alert('Eliminado', 'La alerta fue eliminada correctamente.');
      }

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error al eliminar:', error);
      if (Platform.OS === 'web') {
        window.alert('No se pudo eliminar la alerta.');
      } else {
        Alert.alert('Error', 'No se pudo eliminar la alerta.');
      }
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminar = () => {
    if (Platform.OS === 'web') {
      const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta publicación?');
      if (confirmar) {
        ejecutarBorrado();
      }
    } else {
      Alert.alert(
        'Eliminar publicación',
        '¿Estás seguro de que deseas eliminar esta alerta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: ejecutarBorrado,
          },
        ]
      );
    }
  };

  // CONTACTO WHATSAPP
  const handleContactar = () => {
    const telefono = mascota?.telefonoContacto || mascota?.telefono;
    if (!telefono) {
      if (Platform.OS === 'web') {
        window.alert('Esta alerta no tiene un teléfono asociado.');
      } else {
        Alert.alert('Sin contacto', 'Esta alerta no tiene un teléfono asociado.');
      }
      return;
    }
    const mensaje = `Hola! Te contacto desde Patitas Encontradas por la publicación de ${mascota?.nombre || 'la mascota'}.`;
    const url = `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(`[suspicious link removed]{telefono}?text=${encodeURIComponent(mensaje)}`);
        }
      })
      .catch(() => {
        if (Platform.OS === 'web') {
          window.alert('No se pudo abrir WhatsApp.');
        } else {
          Alert.alert('Error', 'No se pudo abrir WhatsApp.');
        }
      });
  };

  if (cargando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8A00" />
      </View>
    );
  }

  if (!mascota) return null;

  const imagen =
    mascota.fotoUrl ||
    mascota.imagenUrl ||
    mascota.fotoUri ||
    mascota.foto ||
    mascota.imagen;

  const esPerdido = (mascota.estado || '').toLowerCase().includes('perd');

  return (
    <ScrollView style={styles.container}>
      {imagen ? (
        <Image source={{ uri: imagen }} style={styles.imagen} />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.placeholderTexto}>Sin Foto</Text>
        </View>
      )}

      <View style={styles.contenido}>
        <View style={styles.headerFila}>
          <Text style={styles.nombre}>{mascota.nombre || 'Mascota'}</Text>
          <View style={[styles.badge, esPerdido ? styles.badgePerdido : styles.badgeEncontrado]}>
            <Text style={styles.badgeTexto}>{mascota.estado || 'Alerta'}</Text>
          </View>
        </View>

        <Text style={styles.especie}>{mascota.especie || 'Mascota'}</Text>

        {(mascota.ubicacion || mascota.direccionAproximada) && (
          <Text style={styles.ubicacion}>
            📍 {mascota.ubicacion || mascota.direccionAproximada}
          </Text>
        )}

        {mascota.descripcion ? (
          <View style={styles.seccionDesc}>
            <Text style={styles.tituloDesc}>Descripción:</Text>
            <Text style={styles.textoDesc}>{mascota.descripcion}</Text>
          </View>
        ) : null}

        {/* CONTACTAR WHATSAPP */}
        <TouchableOpacity style={styles.btnWhatsapp} onPress={handleContactar} activeOpacity={0.8}>
          <Text style={styles.btnTextoBlanco}>💬 Contactar por WhatsApp</Text>
        </TouchableOpacity>

        {/* ACCIONES CRUD: UPDATE Y DELETE */}
        <View style={styles.crudAcciones}>
          <TouchableOpacity
            style={styles.btnSecundario}
            onPress={handleCambiarEstado}
            disabled={procesando}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTextoSecundario}>
              {mascota.estado === 'ENCONTRADO' ? 'Marcar como Perdido' : 'Marcar como Encontrado'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnEliminar}
            onPress={handleEliminar}
            disabled={procesando}
            activeOpacity={0.8}
          >
            <Text style={styles.btnTextoEliminar}>🗑️ Eliminar publicación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagen: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  imagenPlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTexto: {
    color: '#888',
    fontSize: 16,
  },
  contenido: {
    padding: 20,
  },
  headerFila: {
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
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
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
    fontSize: 12,
  },
  especie: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
  },
  ubicacion: {
    fontSize: 15,
    color: '#444',
    marginTop: 10,
  },
  seccionDesc: {
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  tituloDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  textoDesc: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  btnWhatsapp: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 25,
  },
  btnTextoBlanco: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  crudAcciones: {
    marginTop: 15,
    gap: 10,
  },
  btnSecundario: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FF8A00',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnTextoSecundario: {
    color: '#FF8A00',
    fontWeight: '600',
    fontSize: 14,
  },
  btnEliminar: {
    backgroundColor: '#FDECEA',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnTextoEliminar: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 14,
  },
});
