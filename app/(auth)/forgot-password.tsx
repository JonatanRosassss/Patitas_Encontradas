import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  Platform,
  StyleSheet,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';

export default function PantallaRecuperarContrasenia() {
  const enrutador = useRouter();
  const [correo, setCorreo] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarRestablecerClave = () => {
    if (!correo.trim()) {
      Alert.alert('Atención', 'Por favor, ingresá tu correo electrónico.');
      return;
    }

    setCargando(true);

    // Simulación de envío de correo para el Sprint 1
    setTimeout(() => {
      setCargando(false);
      Alert.alert(
        'Correo enviado (Simulación)',
        `Se enviaron las instrucciones para restablecer la contraseña a: ${correo.trim()}`,
        [
          {
            text: 'Entendido',
            onPress: () => enrutador.push('/(auth)/login'),
          },
        ]
      );
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={estilos.contenedor}
    >
      <ScrollView contentContainerStyle={estilos.scrollContenido} keyboardShouldPersistTaps="handled">
        <View style={estilos.contenido}>
          <Text style={estilos.titulo}>Recuperar Contraseña</Text>
          <Text style={estilos.subtitulo}>
            Ingresá tu correo electrónico y te enviaremos las instrucciones para restablecer tu cuenta.
          </Text>

          {/* Campo: Correo electrónico */}
          <Text style={estilos.etiqueta}>Correo electrónico</Text>
          <TextInput
            style={estilos.campoTexto}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#7D8597"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={estilos.espacioBoton} />
          <Button
            title={cargando ? 'Enviando...' : 'Enviar correo'}
            onPress={manejarRestablecerClave}
            disabled={cargando}
            loading={cargando}
          />

          <Text style={estilos.enlaceVolver} onPress={() => enrutador.push('/(auth)/login')}>
            Volver a Iniciar Sesión
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.backgroundLight || '#F8F9FA',
  },
  scrollContenido: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  contenido: {
    paddingHorizontal: 10,
  },
  titulo: {
    fontSize: Typography.sizes.xxxl || 28,
    lineHeight: Typography.lineHeights.xxxl || 34,
    textAlign: 'center',
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary || '#EE6C4D',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: Typography.sizes.sm || 14,
    lineHeight: Typography.lineHeights.sm || 20,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyLight,
    color: Colors.text || '#2B2D42',
    opacity: 0.7,
    marginBottom: 24,
  },
  etiqueta: {
    fontSize: Typography.sizes.sm || 14,
    fontFamily: Typography.fonts.bodyBold || 'System',
    color: Colors.text || '#2B2D42',
    marginBottom: 6,
    marginTop: 8,
    fontWeight: '600',
  },
  campoTexto: {
    height: 50,
    backgroundColor: Colors.white || '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border || '#E0E0E0',
    paddingHorizontal: 14,
    fontSize: Typography.sizes.md || 15,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text || '#2B2D42',
  },
  espacioBoton: {
    height: 16,
  },
  enlaceVolver: {
    fontSize: Typography.sizes.sm || 14,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyRegular,
    marginTop: 20,
    color: Colors.primary || '#EE6C4D',
  },
});