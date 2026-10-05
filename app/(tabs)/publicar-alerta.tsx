import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { EspecieMascota, type Pet } from '@/types/Pet';
import { obtenerConexion } from '@/services/ConexionFirebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Colors, Typography, Spacing, Radius } from '@/theme/tokens';

export default function PublicarAlertaScreen() {
  const router = useRouter();

  // Estados del formulario
  const [tipoAlerta, setTipoAlerta] = useState<'perdi' | 'encontre'>('perdi');
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Estados para fotos y carga
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);

  const crearMascota = async (mascota: Pet) => {
    const db = obtenerConexion();
    const coleccionMasc = collection(db.firestore, 'Mascota');
    const docMasc = await addDoc(coleccionMasc, mascota);
    mascota.id = docMasc.id;
    return docMasc.id;
  };

  // Función para seleccionar fotos
  const handleSeleccionarFotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu galería para subir las fotos de la mascota.'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!resultado.canceled) {
      const uris = resultado.assets.map((asset) => asset.uri);
      setImagenes((prev) => [...prev, ...uris]);
    }
  };

  // Función para quitar una foto
  const handleQuitarFoto = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  // Función para guardar / publicar
  const handlePublicar = async () => {
    if (!nombre.trim() || !ubicacion.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa al menos el nombre y la ubicación.');
      return;
    }

    setGuardando(true);

    const mascota: Pet = {
      id: '',
      nombre: nombre,
      especie: especie as EspecieMascota,
      estado: tipoAlerta === 'perdi' ? 'PERDIDO' : 'ENCONTRADO',
      descripcion: descripcion,
      fotos: imagenes,
      ubicacion: ubicacion,
      coordenadas: undefined,
      contacto: undefined,
      creadoPor: undefined,
      fechaReporte: Timestamp.now().toString(),
      recompensa: recompensa,
    };
    setTimeout(() => {
      crearMascota(mascota);
      setGuardando(false);
      Alert.alert('¡Alerta Publicada!', 'Tu publicación se ha registrado con éxito.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* BOTÓN VOLVER */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        {/* TÍTULO */}
        <Text style={styles.title}>Publicar Alerta</Text>

        {/* SELECTOR PERDÍ / ENCONTRÉ */}
        <View style={styles.toggleContainer}>
          <Pressable
            style={[
              styles.toggleButton,
              tipoAlerta === 'perdi' && styles.toggleButtonActive,
            ]}
            onPress={() => setTipoAlerta('perdi')}
          >
            <Text
              style={[
                styles.toggleText,
                tipoAlerta === 'perdi' && styles.toggleTextActive,
              ]}
            >
              Perdí
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.toggleButton,
              tipoAlerta === 'encontre' && styles.toggleButtonActive,
            ]}
            onPress={() => setTipoAlerta('encontre')}
          >
            <Text
              style={[
                styles.toggleText,
                tipoAlerta === 'encontre' && styles.toggleTextActive,
              ]}
            >
              Encontré
            </Text>
          </Pressable>
        </View>

        {/* FORMULARIO DE CAMPOS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la mascota *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Firulais"
            placeholderTextColor={Colors.textMuted}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Especie</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Perro / Gato / Otro"
            placeholderTextColor={Colors.textMuted}
            value={especie}
            onChangeText={setEspecie}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Raza</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Labrador / Mestizo"
            placeholderTextColor={Colors.textMuted}
            value={raza}
            onChangeText={setRaza}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Av. San Martín y Calle 4"
            placeholderTextColor={Colors.textMuted}
            value={ubicacion}
            onChangeText={setUbicacion}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recompensa (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: $5000 / No especificada"
            placeholderTextColor={Colors.textMuted}
            value={recompensa}
            onChangeText={setRecompensa}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Señas particulares, color de collar, etc."
            placeholderTextColor={Colors.textMuted}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* PREVISUALIZACIÓN DE FOTOS */}
        {imagenes.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewContainer}>
            {imagenes.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.imageCard}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.deleteBadge} onPress={() => handleQuitarFoto(index)}>
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* BOTÓN ADJUNTAR FOTOS */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleSeleccionarFotos}>
          <Text style={styles.uploadButtonText}>
            {imagenes.length > 0 ? 'AGREGAR MÁS FOTOS' : 'SUBIR FOTOS'}
          </Text>
        </TouchableOpacity>

        {/* BOTÓN PRINCIPAL */}
        <TouchableOpacity
          style={[styles.submitButton, guardando && styles.submitButtonDisabled]}
          onPress={handlePublicar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color={Colors.surface} />
          ) : (
            <Text style={styles.submitButtonText}>GUARDAR Y PUBLICAR</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  backButton: {
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: Typography.button.fontSize,
    color: Colors.text,
    fontWeight: Typography.button.fontWeight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors?.text ?? '#5A3A1F',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  toggleTextActive: {
    color: Colors.surface,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors?.text ?? '#5A3A1F',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors?.border ?? '#E8DFD8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors?.text ?? '#5A3A1F',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
  },
  previewContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageCard: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
  deleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.danger,
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: Colors.surface,
    fontSize: Typography.caption.fontSize,
    fontWeight: 'bold',
  },
  uploadButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.base,
    backgroundColor: Colors.background,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.sm,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.surface,
    fontSize: Typography.button.fontSize,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});