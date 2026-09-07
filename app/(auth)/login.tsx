import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useFonts, Baloo2_700Bold , Baloo2_500Medium} from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_700Bold,Nunito_300Light } from '@expo-google-fonts/nunito';

interface LoginScreenProps {}

export default function LoginScreen({}: LoginScreenProps) {
  const [fontsLoaded] = useFonts({
    Baloo2_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleLogin = () => {
    // Lógica de autenticación
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contenedorTitulo}>
      <Text style={styles.tituloNegro}>PATITAS
        <Text style={styles.titulo}> ENCONTRADAS</Text>

      </Text>
      <Text style={styles.textoAbajo}> Ayudanos a que vuelvan a casa</Text>

      </View>
      <View style={styles.contenedorInicio}>
        <Text style={styles.textoIniciarSesion}>Iniciar Sesion
        </Text>
        <Text style={styles.textoAbajo}> Bienvenido de vuelta</Text>

      </View>
      <TextInput
        style={styles.input}
        placeholder="Mail"
        placeholderTextColor={Colors.textMuted}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setEmail}
      />

      {/* Input de Contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={Colors.textMuted}
        value={contrasenia}
        onChangeText={setContrasenia}
        // C. ¿Qué booleano oculta los caracteres de la contraseña?
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.boton}
        activeOpacity={0.8}
        onPress={handleLogin}
      >
        <Text style={styles.textoBoton}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botonCrearCuenta}
        activeOpacity={0.6}
      >
        <Text style={styles.textoBotonCrearCuenta}>Crear cuenta</Text>


      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.backgroundLight,
  },
  contenedorInicio: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  textoIniciarSesion: {
    fontSize: Typography.sizes.xxxl,
    lineHeight: Typography.lineHeights.xxxl,
    textAlign: 'center',
    fontFamily: Typography.fonts.titleMedium
  },
  titulo: {
    fontSize: Typography.sizes.display,
    lineHeight: Typography.lineHeights.display,
    marginBottom: 40,
    textAlign: 'center',
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
  },
  tituloNegro: {
    fontSize: Typography.sizes.display,
    lineHeight: Typography.lineHeights.display,
     textAlign: 'center',
    fontFamily: Typography.fonts.titleBold,
    color: Colors.black,


  },
  textoAbajo: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    marginTop:5,
    opacity: 0.3,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyLight,
    marginBottom: 20,
  },
  input: {
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  boton: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  botonCrearCuenta: {
    height: 52,
    backgroundColor: Colors.card,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  textoBoton: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.white,
  },
  textoBotonCrearCuenta: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.black,

  },
  contenedorTitulo: {
    alignSelf: 'stretch',
    marginTop: 100,
    marginBottom:160,
    paddingHorizontal: 20,

  }
});
