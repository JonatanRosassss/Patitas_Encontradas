import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useAuth } from '@/services/AuthContext';
import { enviarTicketSoporte } from '@/services/soporteService';
import type { TipoTicket } from '@/types/Ticket';

export interface TicketFormProps {
  onSuccess?: () => void;
}

interface OpcionProblema {
  label: string;
  value: TipoTicket;
  icon: keyof typeof Ionicons.glyphMap;
}

const OPCIONES_PROBLEMA: OpcionProblema[] = [
  { label: 'Error Técnico en la App', value: 'ERROR_TECNICO', icon: 'bug-outline' },
  { label: 'Problema con Mapa o GPS', value: 'PROBLEMA_MAPA', icon: 'map-outline' },
  { label: 'Reporte Falso o Inapropiado', value: 'REPORTE_FALSO', icon: 'alert-circle-outline' },
  { label: 'Consulta General', value: 'CONSULTA_GENERAL', icon: 'help-circle-outline' },
  { label: 'Otro Inconveniente', value: 'OTRO', icon: 'ellipsis-horizontal-circle-outline' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TicketForm({ onSuccess }: TicketFormProps) {
  const { usuario } = useAuth();

  const [tipoProblema, setTipoProblema] = useState<TipoTicket>('ERROR_TECNICO');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Estados de interacción para validación en caliente
  const [tocado, setTocado] = useState({
    nombre: false,
    email: false,
    titulo: false,
    descripcion: false,
  });

  // Estado del aviso modal de ticket generado
  const [modalVisible, setModalVisible] = useState(false);
  const [ticketGeneradoId, setTicketGeneradoId] = useState('');

  useEffect(() => {
    if (usuario) {
      if (usuario.email) setEmail(usuario.email);
      if (usuario.displayName) setNombre(usuario.displayName);
    }
  }, [usuario]);

  // Validación en caliente por campo
  const errorNombre = !nombre.trim()
    ? 'El nombre de contacto es obligatorio.'
    : nombre.trim().length < 2
    ? 'El nombre debe tener al menos 2 caracteres.'
    : null;

  const errorEmail = !email.trim()
    ? 'El correo de contacto es obligatorio.'
    : !EMAIL_REGEX.test(email.trim())
    ? 'Ingresá un correo electrónico válido.'
    : null;

  const errorTitulo = !titulo.trim()
    ? 'El título o asunto es obligatorio.'
    : titulo.trim().length < 5
    ? 'El título debe tener al menos 5 caracteres.'
    : null;

  const errorDescripcion = !descripcion.trim()
    ? 'La descripción del problema es obligatoria.'
    : descripcion.trim().length < 15
    ? 'Explicá lo sucedido con más detalle (mínimo 15 caracteres).'
    : null;

  const formularioEsValido = !errorNombre && !errorEmail && !errorTitulo && !errorDescripcion;

  const marcarTocado = (campo: keyof typeof tocado) => {
    setTocado((prev) => ({ ...prev, [campo]: true }));
  };

  const manejarEnvio = async () => {
    // Forzar marcado de todos los campos para mostrar errores si intentan enviar incompleto
    setTocado({
      nombre: true,
      email: true,
      titulo: true,
      descripcion: true,
    });

    if (!formularioEsValido) {
      Alert.alert('Datos incompletos', 'Por favor revisá los campos señalados en rojo antes de continuar.');
      return;
    }

    try {
      setEnviando(true);
      const ticketId = await enviarTicketSoporte({
        usuarioId: usuario?.uid ?? null,
        nombreContacto: nombre.trim() || (usuario?.displayName ?? 'Vecino anónimo'),
        emailContacto: email.trim(),
        tipoProblema,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        dispositivo: `${Platform.OS} (Expo/React Native)`,
      });

      // Abrir aviso modal con el código generado por Firestore
      setTicketGeneradoId(ticketId);
      setModalVisible(true);
    } catch (error: unknown) {
      const mensaje = error instanceof Error
        ? error.message
        : 'Ocurrió un error inesperado al registrar el ticket en Firestore.';
      Alert.alert('Error de conexión', mensaje);
    } finally {
      setEnviando(false);
    }
  };

  const cerrarModalYReiniciar = () => {
    setModalVisible(false);
    setTicketGeneradoId('');
    setTitulo('');
    setDescripcion('');
    setTocado({
      nombre: false,
      email: false,
      titulo: false,
      descripcion: false,
    });
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.tituloForm}>Generar Ticket de Soporte</Text>
      <Text style={styles.subtituloForm}>
        Contanos tu problema o sugerencia. Se registrará en Firestore para brindarte respuesta.
      </Text>

      {/* Selector de Motivo (TipoTicket) */}
      <Text style={styles.label}>Motivo del reporte</Text>
      <View style={styles.opcionesGrid}>
        {OPCIONES_PROBLEMA.map((opcion) => {
          const seleccionada = tipoProblema === opcion.value;
          return (
            <Pressable
              key={opcion.value}
              accessibilityRole="button"
              accessibilityLabel={`Motivo: ${opcion.label}`}
              accessibilityState={{ selected: seleccionada }}
              onPress={() => setTipoProblema(opcion.value)}
              style={({ pressed }) => [
                styles.opcionBoton,
                seleccionada && styles.opcionBotonActivo,
                pressed && styles.opcionBotonPressed,
              ]}
            >
              <Ionicons
                name={opcion.icon}
                size={Typography.sizes.sm}
                color={seleccionada ? Colors.text : Colors.textSecondary}
                style={styles.opcionIcono}
              />
              <Text style={[styles.opcionTexto, seleccionada && styles.opcionTextoActivo]}>
                {opcion.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Nombre con Validación en Caliente */}
      <View style={styles.campoContainer}>
        <Text style={styles.label}>Tu nombre</Text>
        <TextInput
          style={[
            styles.input,
            tocado.nombre && errorNombre ? styles.inputError : null,
            tocado.nombre && !errorNombre ? styles.inputValido : null,
          ]}
          placeholder="Ej: Juan Pérez"
          placeholderTextColor={Colors.textMuted}
          value={nombre}
          onChangeText={(texto) => {
            setNombre(texto);
            if (!tocado.nombre) marcarTocado('nombre');
          }}
          onBlur={() => marcarTocado('nombre')}
          editable={!enviando}
        />
        {tocado.nombre && errorNombre ? (
          <View style={styles.errorFila}>
            <Ionicons name="alert-circle-outline" size={Typography.sizes.xs} color={Colors.error} />
            <Text style={styles.errorTexto}>{errorNombre}</Text>
          </View>
        ) : null}
      </View>

      {/* Email de contacto con Validación en Caliente */}
      <View style={styles.campoContainer}>
        <Text style={styles.label}>Correo de contacto</Text>
        <TextInput
          style={[
            styles.input,
            tocado.email && errorEmail ? styles.inputError : null,
            tocado.email && !errorEmail ? styles.inputValido : null,
          ]}
          placeholder="tu-correo@ejemplo.com"
          placeholderTextColor={Colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(texto) => {
            setEmail(texto);
            if (!tocado.email) marcarTocado('email');
          }}
          onBlur={() => marcarTocado('email')}
          editable={!enviando}
        />
        {tocado.email && errorEmail ? (
          <View style={styles.errorFila}>
            <Ionicons name="alert-circle-outline" size={Typography.sizes.xs} color={Colors.error} />
            <Text style={styles.errorTexto}>{errorEmail}</Text>
          </View>
        ) : null}
      </View>

      {/* Título o Asunto con Validación en Caliente */}
      <View style={styles.campoContainer}>
        <View style={styles.labelFila}>
          <Text style={styles.label}>Título o Asunto</Text>
          <Text style={styles.contadorTexto}>{titulo.trim().length}/5 mín.</Text>
        </View>
        <TextInput
          style={[
            styles.input,
            tocado.titulo && errorTitulo ? styles.inputError : null,
            tocado.titulo && !errorTitulo ? styles.inputValido : null,
          ]}
          placeholder="Ej: No se cargan las fotos de avistamientos"
          placeholderTextColor={Colors.textMuted}
          value={titulo}
          onChangeText={(texto) => {
            setTitulo(texto);
            if (!tocado.titulo) marcarTocado('titulo');
          }}
          onBlur={() => marcarTocado('titulo')}
          editable={!enviando}
        />
        {tocado.titulo && errorTitulo ? (
          <View style={styles.errorFila}>
            <Ionicons name="alert-circle-outline" size={Typography.sizes.xs} color={Colors.error} />
            <Text style={styles.errorTexto}>{errorTitulo}</Text>
          </View>
        ) : null}
      </View>

      {/* Descripción Detallada con Validación en Caliente */}
      <View style={styles.campoContainer}>
        <View style={styles.labelFila}>
          <Text style={styles.label}>Descripción detallada</Text>
          <Text style={styles.contadorTexto}>{descripcion.trim().length}/15 mín.</Text>
        </View>
        <TextInput
          style={[
            styles.textArea,
            tocado.descripcion && errorDescripcion ? styles.inputError : null,
            tocado.descripcion && !errorDescripcion ? styles.inputValido : null,
          ]}
          placeholder="Explicá lo sucedido con el mayor detalle posible..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          value={descripcion}
          onChangeText={(texto) => {
            setDescripcion(texto);
            if (!tocado.descripcion) marcarTocado('descripcion');
          }}
          onBlur={() => marcarTocado('descripcion')}
          editable={!enviando}
        />
        {tocado.descripcion && errorDescripcion ? (
          <View style={styles.errorFila}>
            <Ionicons name="alert-circle-outline" size={Typography.sizes.xs} color={Colors.error} />
            <Text style={styles.errorTexto}>{errorDescripcion}</Text>
          </View>
        ) : null}
      </View>

      {/* Botón de Enviar con Indicador de Carga */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Enviar Ticket a Soporte"
        style={({ pressed }) => [
          styles.botonEnviar,
          enviando && styles.botonDeshabilitado,
          pressed && !enviando && styles.botonEnviarPressed,
        ]}
        onPress={manejarEnvio}
        disabled={enviando}
      >
        {enviando ? (
          <View style={styles.cargandoFila}>
            <ActivityIndicator color={Colors.white} size="small" />
            <Text style={styles.botonEnviarTexto}>Registrando en Firestore...</Text>
          </View>
        ) : (
          <View style={styles.cargandoFila}>
            <Ionicons name="send-outline" size={Typography.sizes.md} color={Colors.white} />
            <Text style={styles.botonEnviarTexto}>Enviar Ticket a Soporte</Text>
          </View>
        )}
      </Pressable>

      {/* Aviso Modal con el Código del Ticket Generado */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cerrarModalYReiniciar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconoContenedor}>
              <Ionicons name="checkmark-circle" size={Spacing.six} color={Colors.success} />
            </View>

            <Text style={styles.modalTitulo}>¡Ticket Enviado con Éxito!</Text>
            <Text style={styles.modalDescripcion}>
              Tu reporte fue registrado en la base de datos de soporte de Patitas Encontradas.
            </Text>

            {/* Código generado destacado */}
            <View style={styles.modalCodigoBox}>
              <Text style={styles.modalCodigoLabel}>CÓDIGO DE SEGUIMIENTO</Text>
              <Text style={styles.modalCodigoValor}>
                {ticketGeneradoId ? `#TKT-${ticketGeneradoId.toUpperCase().slice(0, 8)}` : ''}
              </Text>
              <Text style={styles.modalCodigoSub}>ID Firestore: {ticketGeneradoId}</Text>
            </View>

            <Text style={styles.modalNota}>
              El equipo de moderación revisará tu solicitud y te contactará a través de tu correo electrónico registrado.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar confirmación de ticket"
              style={({ pressed }) => [
                styles.modalBoton,
                pressed && styles.modalBotonPressed,
              ]}
              onPress={cerrarModalYReiniciar}
            >
              <Text style={styles.modalBotonTexto}>Entendido</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: Radius.xs,
    elevation: 2,
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.five,
  },
  tituloForm: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  subtituloForm: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
    lineHeight: Typography.lineHeights.sm,
  },
  campoContainer: {
    marginBottom: Spacing.two,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.one,
  },
  labelFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  contadorTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textMuted,
  },
  opcionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  opcionBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
  },
  opcionBotonActivo: {
    borderColor: Colors.primary,
    backgroundColor: Colors.accent,
  },
  opcionBotonPressed: {
    opacity: 0.8,
  },
  opcionIcono: {
    marginRight: Spacing.one,
  },
  opcionTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
  },
  opcionTextoActivo: {
    color: Colors.text,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.backgroundLight,
  },
  inputValido: {
    borderColor: Colors.success,
  },
  textArea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.three,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    backgroundColor: Colors.card,
    textAlignVertical: 'top',
  },
  errorFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.one,
    gap: Spacing.one,
  },
  errorTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.error,
  },
  botonEnviar: {
    backgroundColor: Colors.primary,
    minHeight: 48,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.three,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Radius.xs,
    elevation: 2,
  },
  botonEnviarPressed: {
    opacity: 0.85,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  cargandoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  botonEnviarTexto: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: Radius.md,
    elevation: 5,
  },
  modalIconoContenedor: {
    marginBottom: Spacing.two,
  },
  modalTitulo: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  modalDescripcion: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.sm,
    marginBottom: Spacing.three,
  },
  modalCodigoBox: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    padding: Spacing.three,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginBottom: Spacing.three,
  },
  modalCodigoLabel: {
    fontSize: Typography.sizes.xs - 2,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.half,
  },
  modalCodigoValor: {
    fontSize: Typography.sizes.xxl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
    letterSpacing: 1.5,
  },
  modalCodigoSub: {
    fontSize: Typography.sizes.xs - 2,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textMuted,
    marginTop: Spacing.one,
  },
  modalNota: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.xs,
    marginBottom: Spacing.four,
  },
  modalBoton: {
    width: '100%',
    minHeight: 44,
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.two + Spacing.half,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBotonPressed: {
    opacity: 0.85,
  },
  modalBotonTexto: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
});
