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
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { Button } from '../../components/ui/Button';

export default function PantallaRegistro() {
  const enrutador = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');

  const [verContrasenia, setVerContrasenia] = useState(false);
  const [verConfirmarContrasenia, setVerConfirmarContrasenia] = useState(false);

  const manejarRegistro = () => {
    if (!nombre.trim() || !correo.trim() || !telefono.trim() || !contrasenia.trim()) {
      Alert.alert('Atención', 'Por favor completá todos los campos requeridos.');
      return;
    }

    if (contrasenia !== confirmarContrasenia) {
      Alert.alert('Atención', 'Las contraseñas no coinciden.');
      return;
    }

    Alert.alert(
      '¡Cuenta creada!',
      `Registro simulado exitoso para ${nombre.trim()}.\nYa podés iniciar sesión.`,
      [
        {
          text: 'Ir a Iniciar Sesión',
          onPress: () => enrutador.push('/(auth)/login'),
        },
      ]
    );
  };

  const manejarRegistroSocial = (proveedor: string) => {
    Alert.alert(
      `Registro con ${proveedor} (Simulación)`,
      `Cuenta creada e inicio de sesión exitoso mediante ${proveedor}.`,
      [
        {
          text: 'Continuar',
          onPress: () => enrutador.replace('/'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={estilos.contenedor}
    >
      <ScrollView contentContainerStyle={estilos.scrollContenido} keyboardShouldPersistTaps="handled">
        <View style={estilos.contenido}>
          <Text style={estilos.titulo}>Crear Cuenta</Text>
          <Text style={estilos.subtitulo}>
            Sumate a la comunidad para ayudar a que más mascotas vuelvan a casa.
          </Text>

          {/* Campo: Nombre completo */}
          <Text style={estilos.etiqueta}>Nombre completo</Text>
          <TextInput
            style={estilos.campoTexto}
            placeholder="Ej. Juan Pérez"
            placeholderTextColor={Colors.textMuted}
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />

          {/* Campo: Correo electrónico */}
          <Text style={estilos.etiqueta}>Correo electrónico</Text>
          <TextInput
            style={estilos.campoTexto}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={Colors.textMuted}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo: Teléfono */}
          <Text style={estilos.etiqueta}>Teléfono de contacto</Text>
          <TextInput
            style={estilos.campoTexto}
            placeholder="Ej. 11 1234-5678"
            placeholderTextColor={Colors.textMuted}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          {/* Campo: Contraseña */}
          <Text style={estilos.etiqueta}>Contraseña</Text>
          <View style={estilos.contenedorInputPassword}>
            <TextInput
              style={estilos.campoTextoPassword}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={Colors.textMuted}
              value={contrasenia}
              onChangeText={setContrasenia}
              secureTextEntry={!verContrasenia}
            />
            <TouchableOpacity
              style={estilos.botonOjo}
              onPress={() => setVerContrasenia(!verContrasenia)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={verContrasenia ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Campo: Confirmar Contraseña */}
          <Text style={estilos.etiqueta}>Confirmar contraseña</Text>
          <View style={estilos.contenedorInputPassword}>
            <TextInput
              style={estilos.campoTextoPassword}
              placeholder="Repetir contraseña"
              placeholderTextColor={Colors.textMuted}
              value={confirmarContrasenia}
              onChangeText={setConfirmarContrasenia}
              secureTextEntry={!verConfirmarContrasenia}
            />
            <TouchableOpacity
              style={estilos.botonOjo}
              onPress={() => setVerConfirmarContrasenia(!verConfirmarContrasenia)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={verConfirmarContrasenia ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <View style={estilos.espacioBoton} />
          <Button title="Registrarme" onPress={manejarRegistro} />

          {/* Divisor social */}
          <View style={estilos.contenedorDivisor}>
            <View style={estilos.lineaDivisora} />
            <Text style={estilos.textoDivisor}>o registrarse con</Text>
            <View style={estilos.lineaDivisora} />
          </View>

          {/* Botones Sociales */}
          <View style={estilos.filaBotonesSociales}>
            <TouchableOpacity
              style={estilos.botonSocial}
              onPress={() => manejarRegistroSocial('Google')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={24} color={Colors.google} />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botonSocial}
              onPress={() => manejarRegistroSocial('Apple')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={24} color={Colors.black} />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botonSocial}
              onPress={() => manejarRegistroSocial('Facebook')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={24} color={Colors.facebook} />
            </TouchableOpacity>
          </View>

          <Text style={estilos.enlaceVolver} onPress={() => enrutador.push('/(auth)/login')}>
            ¿Ya tenés una cuenta? Iniciar sesión
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollContenido: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.four,
  },
  contenido: {
    paddingHorizontal: Spacing.two,
  },
  titulo: {
    fontSize: Typography.sizes.xxxl,
    lineHeight: Typography.lineHeights.xxxl,
    textAlign: 'center',
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    marginBottom: Spacing.two,
  },
  subtitulo: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyLight,
    color: Colors.textSecondary,
    marginBottom: Spacing.four,
  },
  etiqueta: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
    marginBottom: Spacing.two,
    marginTop: Spacing.two,
  },
  campoTexto: {
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.three,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  contenedorInputPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  campoTextoPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: Spacing.three,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  botonOjo: {
    paddingHorizontal: Spacing.three,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  espacioBoton: {
    height: Spacing.three,
  },
  contenedorDivisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.three,
  },
  lineaDivisora: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  textoDivisor: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontFamily: Typography.fonts.bodyRegular,
  },
  filaBotonesSociales: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  botonSocial: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  enlaceVolver: {
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyRegular,
    marginTop: Spacing.four,
    color: Colors.primary,
  },
});