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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { EspecieMascota, type NuevaAlertaMascota } from '@/types/Pet';
import { Coordinates } from '@/types/map';
import { isValidCoordinate } from '@/utils/geoValidation';
import { crearAlertaMascota } from '@/services/mascotasService';
import {
  geocodificarDireccion,
  ZONAS_PILAR_PRESETS,
  type GeocodingResult,
} from '@/services/geocodingService';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

export default function PublicarAlertaScreen() {
  const router = useRouter();

  // Estados del formulario
  const [tipoAlerta, setTipoAlerta] = useState<'perdi' | 'encontre'>('perdi');
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState<EspecieMascota>('PERRO');
  const [raza, setRaza] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [recompensa, setRecompensa] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Estados para fotos, geocodificación y carga
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [coordenadas, setCoordenadas] = useState<Coordinates | null>(null);
  const [obteniendoGPS, setObteniendoGPS] = useState(false);
  const [buscandoDireccion, setBuscandoDireccion] = useState(false);
  const [sugerencias, setSugerencias] = useState<GeocodingResult[]>([]);
  const [guardando, setGuardando] = useState(false);

  // Navegación segura hacia atrás
  const handleVolver = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // Función para seleccionar fotos desde la galería
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
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const uris = resultado.assets.map((asset) => asset.uri);
      setImagenes((prev) => [...prev, ...uris]);
    }
  };

  // Función para quitar una foto de la lista previa
  const handleQuitarFoto = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  // Función para buscar y geocodificar la dirección escrita a coordenadas
  const handleBuscarDireccion = async () => {
    if (!ubicacion.trim()) {
      Alert.alert(
        'Ingresá una dirección',
        'Escribí una calle, esquina, plaza o barrio de Pilar para buscar sus coordenadas.'
      );
      return;
    }

    try {
      setBuscandoDireccion(true);
      const resultados = await geocodificarDireccion(ubicacion);

      if (resultados.length === 0) {
        Alert.alert(
          'Dirección no localizada',
          'No pudimos encontrar coordenadas exactas para ese texto. Podés seleccionar una de las zonas frecuentes de Pilar o ajustar la dirección.'
        );
        return;
      }

      if (resultados.length === 1) {
        const unico = resultados[0];
        setCoordenadas(unico.coordenadas);
        setUbicacion(unico.direccion);
        setSugerencias([]);
        Alert.alert(
          'Coordenadas Encontradas',
          `Ubicación fijada con éxito:\nLat: ${unico.coordenadas.latitude.toFixed(4)}, Lng: ${unico.coordenadas.longitude.toFixed(4)}`
        );
      } else {
        setSugerencias(resultados);
      }
    } catch {
      Alert.alert('Error', 'Hubo un inconveniente al consultar el servicio de mapa.');
    } finally {
      setBuscandoDireccion(false);
    }
  };

  // Seleccionar una sugerencia devuelta por el geocodificador
  const handleSeleccionarSugerencia = (sug: GeocodingResult) => {
    setUbicacion(sug.direccion);
    setCoordenadas(sug.coordenadas);
    setSugerencias([]);
  };

  // Seleccionar una zona predefinida de Pilar con 1 clic
  const handleSeleccionarPreset = (preset: typeof ZONAS_PILAR_PRESETS[0]) => {
    setUbicacion(preset.nombre);
    setCoordenadas(preset.coordenadas);
    setSugerencias([]);
  };

  // Función para obtener coordenadas GPS actuales con expo-location
  const handleObtenerUbicacionGPS = async () => {
    try {
      setObteniendoGPS(true);

      const isServiceEnabled = await Location.hasServicesEnabledAsync();
      if (!isServiceEnabled) {
        Alert.alert(
          'Ubicación Desactivada',
          'Los servicios de localización GPS están desactivados en tu dispositivo. Por favor activalos para fijar el punto exacto.'
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso Denegado',
          'No se pudo acceder al GPS. Podés buscar la dirección manualmente con el botón "Buscar coordenadas".'
        );
        return;
      }

      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = posicion.coords;

      if (isValidCoordinate(latitude, longitude)) {
        setCoordenadas({ latitude, longitude });
        if (!ubicacion.trim()) {
          setUbicacion('Ubicación fijada por GPS actual');
        }
        setSugerencias([]);
        Alert.alert(
          'GPS Detectado',
          'Tus coordenadas se registraron con éxito para situar a la mascota en el mapa comunitario.'
        );
      } else {
        Alert.alert('Coordenadas no válidas', 'Las coordenadas recibidas están fuera de los límites admitidos.');
      }
    } catch {
      Alert.alert(
        'Ubicación',
        'No se pudo determinar tu posición GPS actual. Podés buscar la dirección manualmente con el botón "Buscar coordenadas".'
      );
    } finally {
      setObteniendoGPS(false);
    }
  };

  // Función para guardar y publicar la alerta con validaciones estrictas (Sprint 5)
  const handlePublicar = async () => {
    // Helper para mostrar alertas compatibles tanto en Web como en Móvil
    const alertar = (titulo: string, mensaje: string) => {
      if (Platform.OS === 'web') {
        window.alert(`${titulo}: ${mensaje}`);
      } else {
        Alert.alert(titulo, mensaje);
      }
    };

    // 1. Validar nombre / referencia
    if (!nombre || !nombre.trim()) {
      alertar('Campo requerido', 'Por favor ingresá el nombre o referencia de la mascota.');
      return;
    }
    if (nombre.trim().length < 2) {
      alertar('Nombre inválido', 'El nombre o referencia debe tener al menos 2 caracteres.');
      return;
    }

    // 2. Validar ubicación
    if (!ubicacion || !ubicacion.trim()) {
      alertar('Campo requerido', 'Por favor indicá la zona, barrio o calle aproximada.');
      return;
    }
    if (ubicacion.trim().length < 4) {
      alertar('Ubicación poco clara', 'Por favor ingresá una ubicación más descriptiva (mínimo 4 caracteres).');
      return;
    }

    // 3. Validar teléfono de contacto (si tenés la variable 'telefono' o similar)
    // Sanea quitando espacios, guiones o letras
    const telLimpio = (typeof telefono !== 'undefined' && telefono) ? telefono.replace(/\D/g, '') : '';
    if (typeof telefono !== 'undefined') {
      if (!telefono.trim()) {
        alertar('Teléfono requerido', 'Ingresá un número de contacto para que puedan comunicarse.');
        return;
      }
      if (telLimpio.length < 8) {
        alertar('Teléfono inválido', 'El número de teléfono debe tener al menos 8 dígitos.');
        return;
      }
    }

    // 4. Validar descripción (si escribió algo, que tenga sentido)
    if (typeof descripcion !== 'undefined' && descripcion && descripcion.trim().length > 0 && descripcion.trim().length < 5) {
      alertar('Descripción muy corta', 'Si agregás una descripción, por favor detallá un poco más (mínimo 5 caracteres).');
      return;
    }

    setGuardando(true);

    try {

      // 1. Construir payload tipado omitiendo propiedades con valor undefined
      const payload: Omit<NuevaAlertaMascota, 'fotos' | 'fechaReporte' | 'creadoPor'> = {
        nombre: nombre.trim(),
        especie,
        estado: tipoAlerta === 'perdi' ? 'PERDIDO' : 'ENCONTRADO',
        descripcion: (descripcion.trim() + (raza.trim() ? ` · Raza: ${raza.trim()}` : '')).trim(),
        ubicacion: ubicacion.trim(),
        ...(recompensa.trim() ? { recompensa: recompensa.trim() } : { recompensa: null }),
        ...(coordenadas && isValidCoordinate(coordenadas.latitude, coordenadas.longitude)
          ? { coordenadas }
          : {}),
      };

      // 2. Invocar servicio centralizado de alertas (guarda en colección canónica 'alertas' y sube fotos)
      await crearAlertaMascota(payload, imagenes);

      Alert.alert('¡Alerta Publicada!', 'Tu publicación se ha registrado con éxito en Patitas Encontradas.', [
        { text: 'OK', onPress: handleVolver },
      ]);
    } catch (error: unknown) {
      const mensajeError = error instanceof Error ? error.message : 'Ocurrió un error inesperado al guardar la alerta.';
      Alert.alert('Error al publicar', mensajeError);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* BOTÓN VOLVER */}
        <TouchableOpacity style={styles.backButton} onPress={handleVolver}>
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

        {/* SELECTOR DE ESPECIE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Especie</Text>
          <View style={styles.especieSelector}>
            {(['PERRO', 'GATO', 'OTRO'] as const).map((esp) => (
              <Pressable
                key={esp}
                style={[
                  styles.especieButton,
                  especie === esp && styles.especieButtonActive,
                ]}
                onPress={() => setEspecie(esp)}
              >
                <Text
                  style={[
                    styles.especieText,
                    especie === esp && styles.especieTextActive,
                  ]}
                >
                  {esp === 'PERRO' ? '🐶 Perro' : esp === 'GATO' ? '🐱 Gato' : '🐾 Otro'}
                </Text>
              </Pressable>
            ))}
          </View>
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

        {/* SECCIÓN DE UBICACIÓN CON BÚSQUEDA / PARSEO Y PRESETS */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Rivadavia y Bolivar, o Barrio Champagnat"
            placeholderTextColor={Colors.textMuted}
            value={ubicacion}
            onChangeText={(txt) => {
              setUbicacion(txt);
              if (sugerencias.length > 0) setSugerencias([]);
            }}
          />

          {/* Botones de acción: Geocodificar texto y GPS */}
          <View style={styles.geoBotonesContainer}>
            <TouchableOpacity
              style={[styles.geoBuscarButton, buscandoDireccion && styles.buttonDisabled]}
              onPress={handleBuscarDireccion}
              disabled={buscandoDireccion}
            >
              {buscandoDireccion ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.geoBuscarButtonText}>🔍 Buscar coordenadas</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gpsButton, obteniendoGPS && styles.buttonDisabled]}
              onPress={handleObtenerUbicacionGPS}
              disabled={obteniendoGPS}
            >
              {obteniendoGPS ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={styles.gpsButtonText}>📍 Usar mi GPS</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Lista de sugerencias si Nominatim devuelve múltiples opciones */}
          {sugerencias.length > 0 && (
            <View style={styles.sugerenciasContainer}>
              <Text style={styles.sugerenciasTitulo}>Elegí la coincidencia más exacta:</Text>
              {sugerencias.map((sug, idx) => (
                <TouchableOpacity
                  key={`sug-${idx}`}
                  style={styles.sugerenciaItem}
                  onPress={() => handleSeleccionarSugerencia(sug)}
                >
                  <Text style={styles.sugerenciaTexto} numberOfLines={2}>
                    📍 {sug.direccion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Zonas populares de Pilar para fijación rápida */}
          <View style={styles.presetsWrapper}>
            <Text style={styles.presetsTitulo}>Zonas frecuentes de Pilar:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
              {ZONAS_PILAR_PRESETS.map((p) => {
                const isSelected =
                  coordenadas?.latitude === p.coordenadas.latitude &&
                  coordenadas?.longitude === p.coordenadas.longitude;
                return (
                  <TouchableOpacity
                    key={p.nombre}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                    onPress={() => handleSeleccionarPreset(p)}
                  >
                    <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                      {p.etiqueta}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Badge de coordenadas confirmadas */}
          {coordenadas && (
            <View style={styles.gpsBadge}>
              <Text style={styles.gpsBadgeText}>
                ✅ Ubicación fijada: {coordenadas.latitude.toFixed(4)}, {coordenadas.longitude.toFixed(4)}
              </Text>
              <TouchableOpacity
                onPress={() => setCoordenadas(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.gpsClearText}>✕ Quitar</Text>
              </TouchableOpacity>
            </View>
          )}
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
            <ActivityIndicator color={Colors.white} />
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
    backgroundColor: Colors.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.five,
  },
  backButton: {
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    marginBottom: Spacing.base,
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
    backgroundColor: Colors.card,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleText: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  inputGroup: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  especieSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  especieButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  especieButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.primary,
  },
  especieText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textSecondary,
  },
  especieTextActive: {
    color: Colors.primary,
    fontFamily: Typography.fonts.bodyBold,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  textArea: {
    height: 100,
  },
  geoBotonesContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  geoBuscarButton: {
    flex: 1.3,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geoBuscarButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
  },
  gpsButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gpsButtonText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.primary,
  },
  sugerenciasContainer: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sugerenciasTitulo: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sugerenciaItem: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  sugerenciaTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },
  presetsWrapper: {
    marginTop: Spacing.sm,
  },
  presetsTitulo: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  presetsScroll: {
    flexDirection: 'row',
  },
  presetChip: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginRight: Spacing.xs,
  },
  presetChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.primary,
  },
  presetChipText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  presetChipTextActive: {
    color: Colors.primary,
    fontFamily: Typography.fonts.bodyBold,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.statusAdopcionBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
  },
  gpsBadgeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.statusAdopcion,
    flex: 1,
  },
  gpsClearText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.error,
    marginLeft: Spacing.sm,
  },
  previewContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
  },
  imageCard: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  previewImage: {
    width: 75,
    height: 75,
    borderRadius: Radius.sm,
  },
  deleteBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.error,
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
  },
  uploadButton: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.base,
    backgroundColor: Colors.backgroundLight,
  },
  uploadButtonText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(90, 58, 31, 0.1)',
      },
      default: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
    letterSpacing: 0.5,
  },
});