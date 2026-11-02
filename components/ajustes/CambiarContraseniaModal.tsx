import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/services/AuthContext';
import { CambiarContraseniaModalProps } from '@/types/Auth';

export const CambiarContraseniaModal: React.FC<CambiarContraseniaModalProps> = ({
  visible,
  alCerrar,
  emailUsuario,
}) => {
  const { cambiarContrasenia, enviarCorreoRestablecimiento } = useAuth();

  const [contraseniaActual, setContraseniaActual] = useState<string>('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState<string>('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState<string>('');

  const [verActual, setVerActual] = useState<boolean>(false);
  const [verNueva, setVerNueva] = useState<boolean>(false);
  const [verConfirmar, setVerConfirmar] = useState<boolean>(false);

  const [guardando, setGuardando] = useState<boolean>(false);
  const [enviandoRecuperacion, setEnviandoRecuperacion] = useState<boolean>(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const notificar = (titulo: string, mensaje: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const limpiarFormulario = () => {
    setContraseniaActual('');
    setNuevaContrasenia('');
    setConfirmarContrasenia('');
    setVerActual(false);
    setVerNueva(false);
    setVerConfirmar(false);
    setMensajeError(null);
  };

  const manejarCerrar = () => {
    if (guardando || enviandoRecuperacion) {
      return;
    }
    limpiarFormulario();
    alCerrar();
  };

  const manejarCambiarContrasenia = async () => {
    setMensajeError(null);

    // Validaciones previas
    if (!contraseniaActual.trim()) {
      setMensajeError('Ingres├í tu contrase├▒a actual.');
      return;
    }

    if (!nuevaContrasenia.trim()) {
      setMensajeError('Ingres├í la nueva contrase├▒a.');
      return;
    }

    if (nuevaContrasenia.length < 6) {
      setMensajeError('La nueva contrase├▒a debe tener al menos 6 caracteres.');
      return;
    }

    if (nuevaContrasenia === contraseniaActual) {
      setMensajeError('La nueva contrase├▒a debe ser distinta a la actual.');
      return;
    }

    if (nuevaContrasenia !== confirmarContrasenia) {
      setMensajeError('Las contrase├▒as no coinciden. Verificalas.');
      return;
    }

    try {
      setGuardando(true);
      await cambiarContrasenia(contraseniaActual, nuevaContrasenia);
      notificar(
        '┬íContrase├▒a actualizada!',
        'Tu contrase├▒a ha sido modificada con ├⌐xito. Usala en tu pr├│ximo inicio de sesi├│n.'
      );
      limpiarFormulario();
      alCerrar();
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar la contrase├▒a. Reintent├í en unos momentos.';
      setMensajeError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const manejarEnviarRecuperacion = () => {
    const emailDestino = emailUsuario || '';
    const mensajeConfirmacion = emailDestino
      ? `┬┐Deseas enviar un correo a ${emailDestino} con las instrucciones para restablecer tu contrase├▒a?`
      : '┬┐Deseas enviar un correo con las instrucciones para restablecer tu contrase├▒a?';

    const ejecutarEnvio = async () => {
      try {
        setEnviandoRecuperacion(true);
        await enviarCorreoRestablecimiento(emailDestino);
        notificar(
          'Correo enviado',
          `Revis├í tu casilla ${emailDestino ? `(${emailDestino})` : ''} para restablecer tu contrase├▒a.`
        );
      } catch (error: unknown) {
        const mensaje =
          error instanceof Error
            ? error.message
            : 'No se pudo enviar el correo de restablecimiento.';
        notificar('Error', mensaje);
      } finally {
        setEnviandoRecuperacion(false);
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(mensajeConfirmacion)) {
        void ejecutarEnvio();
      }
      return;
    }

    Alert.alert('Restablecer contrase├▒a', mensajeConfirmacion, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Enviar correo', onPress: () => void ejecutarEnvio() },
    ]);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={manejarCerrar}
    >
      <View style={styles.modalFondo}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.tecladoContenedor}
        >
          <View style={styles.modalContenido}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContenido}
            >
              {/* Encabezado */}
              <View style={styles.iconoEncabezado}>
                <Ionicons name="lock-closed" size={28} color={Colors.primary} />
              </View>

              <Text style={styles.modalTitulo}>CAMBIAR CONTRASE├æA</Text>
              <Text style={styles.modalSubtitulo}>
                Ingres├í tu contrase├▒a actual y la nueva que quieras utilizar en tu cuenta.
              </Text>

              {/* Mensaje de error inline */}
              {mensajeError && (
                <View style={styles.cajaError}>
                  <Ionicons name="alert-circle" size={18} color={Colors.error} />
                  <Text style={styles.textoError}>{mensajeError}</Text>
                </View>
              )}

              {/* Campo: Contrase├▒a Actual */}
              <Text style={styles.datoLabel}>Contrase├▒a actual</Text>
              <View style={styles.inputContenedor}>
                <TextInput
                  style={styles.input}
                  value={contraseniaActual}
                  onChangeText={(val) => {
                    setContraseniaActual(val);
                    if (mensajeError) setMensajeError(null);
                  }}
                  placeholder="Tu contrase├▒a actual"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!verActual}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.botonOjo}
                  onPress={() => setVerActual((prev) => !prev)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={verActual ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </Pressable>
              </View>

              {/* Opci├│n de recuperaci├│n si olvid├│ su contrase├▒a actual */}
              <Pressable
                style={styles.botonOlvido}
                onPress={manejarEnviarRecuperacion}
                disabled={enviandoRecuperacion || guardando}
              >
                {enviandoRecuperacion ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={styles.textoBotonOlvido}>
                    ┬┐Olvidaste tu contrase├▒a actual? Enviar correo
                  </Text>
                )}
              </Pressable>

              {/* Campo: Nueva Contrase├▒a */}
              <Text style={styles.datoLabel}>Nueva contrase├▒a</Text>
              <View style={styles.inputContenedor}>
                <TextInput
                  style={styles.input}
                  value={nuevaContrasenia}
                  onChangeText={(val) => {
                    setNuevaContrasenia(val);
                    if (mensajeError) setMensajeError(null);
                  }}
                  placeholder="M├¡nimo 6 caracteres"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!verNueva}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.botonOjo}
                  onPress={() => setVerNueva((prev) => !prev)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={verNueva ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </Pressable>
              </View>

              {/* Campo: Confirmar Nueva Contrase├▒a */}
              <Text style={styles.datoLabel}>Confirmar nueva contrase├▒a</Text>
              <View style={styles.inputContenedor}>
                <TextInput
                  style={styles.input}
                  value={confirmarContrasenia}
                  onChangeText={(val) => {
                    setConfirmarContrasenia(val);
                    if (mensajeError) setMensajeError(null);
                  }}
                  placeholder="Repet├¡ la nueva contrase├▒a"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!verConfirmar}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.botonOjo}
                  onPress={() => setVerConfirmar((prev) => !prev)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={verConfirmar ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </Pressable>
              </View>

              {/* Botones de acci├│n */}
              <View style={styles.filaBotonesModal}>
                <Pressable
                  style={[styles.botonAccion, styles.botonCancelar]}
                  onPress={manejarCerrar}
                  disabled={guardando || enviandoRecuperacion}
                >
                  <Text style={styles.textoBotonCancelar}>CANCELAR</Text>
                </Pressable>

                <Pressable
                  style={[styles.botonAccion, styles.botonGuardar]}
                  onPress={manejarCambiarContrasenia}
                  disabled={guardando || enviandoRecuperacion}
                >
                  {guardando ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={styles.textoBotonGuardar}>GUARDAR</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalFondo: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.base,
  },
  tecladoContenedor: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  modalContenido: {
    width: '100%',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    maxHeight: '90%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  scrollContenido: {
    paddingBottom: Spacing.sm,
  },
  iconoEncabezado: {
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.tintPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalTitulo: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalSubtitulo: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.sm,
  },
  cajaError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.statusPerdidoBg,
    borderColor: Colors.error,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: Spacing.base,
    gap: Spacing.xs,
  },
  textoError: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.error,
  },
  datoLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  inputContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  botonOjo: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonOlvido: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: Spacing.half,
  },
  textoBotonOlvido: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  filaBotonesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  botonAccion: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCancelar: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textoBotonCancelar: {
    color: Colors.textSecondary,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
  botonGuardar: {
    backgroundColor: Colors.primary,
  },
  textoBotonGuardar: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
});
