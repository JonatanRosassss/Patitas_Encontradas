import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../constants/firebaseConfig';
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
import { Colors, Typography } from '../../constants/theme';
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

 const manejarRegistro = async () => {
  if (
    !nombre.trim() ||
    !correo.trim() ||
    !telefono.trim() ||
    !contrasenia.trim() ||
    !confirmarContrasenia.trim()
  ) {
    Alert.alert(
      'Atención',
      'Por favor completá todos los campos requeridos.'
    );
    return;
  }

  if (contrasenia !== confirmarContrasenia) {
    Alert.alert(
      'Atención',
      'Las contraseñas no coinciden.'
    );
    return;
  }

  if (contrasenia.length < 6) {
    Alert.alert(
      'Atención',
      'La contraseña debe tener al menos 6 caracteres.'
    );
    return;
  }

  try {
    // 1. Crear usuario en Firebase Authentication
    const resultado = await createUserWithEmailAndPassword(
      auth,
      correo.trim(),
      contrasenia
    );

    const usuario = resultado.user;

    // 2. Guardar información adicional en Firestore
    await setDoc(doc(db, 'usuarios', usuario.uid), {
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      uid: usuario.uid,
      fechaRegistro: new Date(),
    });

    // 3. Mostrar confirmación
    Alert.alert(
      '¡Cuenta creada!',
      `Bienvenida/o ${nombre.trim()}. Ya podés iniciar sesión.`,
      [
        {
          text: 'Ir a Iniciar Sesión',
          onPress: () => enrutador.replace('/(auth)/login'),
        },
      ]
    );

  } catch (error: any) {

    console.error('Error al registrar usuario:', error);

    if (error.code === 'auth/email-already-in-use') {
      Alert.alert(
        'Correo registrado',
        'Ya existe una cuenta registrada con este correo electrónico.'
      );
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert(
        'Correo inválido',
        'Ingresá una dirección de correo electrónico válida.'
      );
    } else if (error.code === 'auth/weak-password') {
      Alert.alert(
        'Contraseña débil',
        'La contraseña debe tener al menos 6 caracteres.'
      );
    } else {
      Alert.alert(
        'Error',
        'No se pudo crear la cuenta. Intentá nuevamente.'
      );
    }
  }
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
            placeholderTextColor="#7D8597"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
          />

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

          {/* Campo: Teléfono */}
          <Text style={estilos.etiqueta}>Teléfono de contacto</Text>
          <TextInput
            style={estilos.campoTexto}
            placeholder="Ej. 11 1234-5678"
            placeholderTextColor="#7D8597"
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
              placeholderTextColor="#7D8597"
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
                color="#7D8597"
              />
            </TouchableOpacity>
          </View>

          {/* Campo: Confirmar Contraseña */}
          <Text style={estilos.etiqueta}>Confirmar contraseña</Text>
          <View style={estilos.contenedorInputPassword}>
            <TextInput
              style={estilos.campoTextoPassword}
              placeholder="Repetir contraseña"
              placeholderTextColor="#7D8597"
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
                color="#7D8597"
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
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botonSocial}
              onPress={() => manejarRegistroSocial('Apple')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={24} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botonSocial}
              onPress={() => manejarRegistroSocial('Facebook')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
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
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: Typography.sizes.sm || 14,
    lineHeight: Typography.lineHeights.sm || 20,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyLight,
    color: Colors.text || '#2B2D42',
    opacity: 0.7,
    marginBottom: 20,
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
  contenedorInputPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white || '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border || '#E0E0E0',
  },
  campoTextoPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 14,
    fontSize: Typography.sizes.md || 15,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text || '#2B2D42',
  },
  botonOjo: {
    paddingHorizontal: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  espacioBoton: {
    height: 16,
  },
  contenedorDivisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  lineaDivisora: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border || '#E0E0E0',
  },
  textoDivisor: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#7D8597',
    fontFamily: Typography.fonts.bodyRegular,
  },
  filaBotonesSociales: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  botonSocial: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.white || '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border || '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  enlaceVolver: {
    fontSize: Typography.sizes.sm || 14,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyRegular,
    marginTop: 20,
    color: Colors.primary || '#EE6C4D',
  },
});