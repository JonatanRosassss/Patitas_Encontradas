import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

interface CambiarContraseniaModalProps {
  visible: boolean;
  alCerrar?: () => void;
  onClose?: () => void; // Acepta ambas opciones por compatibilidad
}


export function CambiarContraseniaModal({
  visible,
  alCerrar,
  onClose,
}: CambiarContraseniaModalProps) {
  const [contraseniaActual, setContraseniaActual] = useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const limpiarFormulario = () => {
    setContraseniaActual('');
    setNuevaContrasenia('');
    setConfirmarContrasenia('');
    setErrorMsg('');
  };

  const manejarCerrar = () => {
    limpiarFormulario();
    
    // Ejecuta alCerrar u onClose de forma segura sin romper si alguna no está definida
    if (typeof alCerrar === 'function') {
      alCerrar();
    } else if (typeof onClose === 'function') {
      onClose();
    }
  };

  const manejarCambiarContrasenia = async () => {
    setErrorMsg('');

    if (!contraseniaActual || !nuevaContrasenia || !confirmarContrasenia) {
      setErrorMsg('Por favor, completá todos los campos.');
      return;
    }

    if (nuevaContrasenia.length < 6) {
      setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (nuevaContrasenia !== confirmarContrasenia) {
      setErrorMsg('Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      setCargando(true);
      const auth = getAuth();
      const usuario = auth.currentUser;

      if (!usuario || !usuario.email) {
        setErrorMsg('No se encontró una sesión activa de usuario.');
        return;
      }

      // Reautenticación por seguridad antes de cambiar contraseña
      const credencial = EmailAuthProvider.credential(usuario.email, contraseniaActual);
      await reauthenticateWithCredential(usuario, credencial);

      // Actualización de la contraseña en Firebase Auth
      await updatePassword(usuario, nuevaContrasenia);

      Alert.alert('¡Éxito!', 'Tu contraseña fue actualizada correctamente.');
      manejarCerrar();
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMsg('La contraseña actual es incorrecta.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMsg('La nueva contraseña es demasiado débil.');
      } else {
        setErrorMsg('Ocurrió un error al intentar cambiar la contraseña.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={manejarCerrar}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.titulo}>Cambiar Contraseña</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña actual</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={contraseniaActual}
              onChangeText={setContraseniaActual}
              placeholder="Ingresá tu contraseña actual"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={nuevaContrasenia}
              onChangeText={setNuevaContrasenia}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar nueva contraseña</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmarContrasenia}
              onChangeText={setConfirmarContrasenia}
              placeholder="Repetí la nueva contraseña"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.botonesRow}>
            <TouchableOpacity
              style={[styles.boton, styles.botonCancelar]}
              onPress={manejarCerrar}
              disabled={cargando}
            >
              <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.boton, styles.botonGuardar]}
              onPress={manejarCambiarContrasenia}
              disabled={cargando}
            >
              {cargando ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.textoBotonGuardar}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  botonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  boton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCancelar: {
    backgroundColor: '#E5E7EB',
  },
  botonGuardar: {
    backgroundColor: '#2563EB',
  },
  textoBotonCancelar: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  textoBotonGuardar: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CambiarContraseniaModal;

