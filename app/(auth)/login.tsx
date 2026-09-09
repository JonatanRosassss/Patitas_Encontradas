import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  Platform,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
} from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useFonts, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_700Bold, Nunito_300Light } from '@expo-google-fonts/nunito';
import { Button } from '../../components/ui/Button';
import { loginSchema } from '@/schemas/authScheama';

interface LoginScreenProps {}

export default function LoginScreen({ }: LoginScreenProps) {
  const [fontsLoaded] = useFonts({
    Baloo2_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_300Light,
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
    const resultado = loginSchema.safeParse({ email, contrasenia });
    if (!resultado.success) {
      //no paso
      return;
    }
    //paso
  };

  const handleCreateAccount = () => {
    // Lógica para ir a crear cuenta / registro
  };
  const handleContinueGoogle = () => {

  };
  const handleForgetPassword = () => {

  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contenedorTitulo}>

        <Text style={styles.tituloNegro}>
          PATITAS
          <Text style={styles.titulo}> ENCONTRADAS</Text>
        </Text>
        <Text style={styles.textoAbajo}> Ayudanos a que vuelvan a casa</Text>
        <Image
          source={require('assets/logo_patitas_crop.png')}
          style={styles.logo}
          resizeMode='contain'
        />
      </View>

      <View style={styles.contenedorInicio}>
        <Text style={styles.textoIniciarSesion}>Iniciar Sesion</Text>
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

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={Colors.textMuted}
        value={contrasenia}
        onChangeText={setContrasenia}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text
        style={styles.linkTexto}
        onPress={handleForgetPassword}
      >
        Olvidaste tu contrasenia?
      </Text>

      <Button
        label="Ingresar"
        onClick={handleLogin}
        color="orange"
        colorText="white"
      />

      <Button
        label="Crear cuenta"
        onClick={handleCreateAccount}
        color="bWhite"
        colorText="black"
      />

      <Button
        label="Continuar con Google"
        onClick={handleContinueGoogle}
        color="white"
        colorText="black"

      />

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
    fontFamily: Typography.fonts.titleMedium,
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
    marginTop: 5,
    opacity: 0.3,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyLight,
    marginBottom: 20,
  },
  linkTexto: {

    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    marginTop: 5,
    marginLeft: 10,

    fontFamily: Typography.fonts.bodyRegular,
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
  contenedorTitulo: {
    alignSelf: 'stretch',
    marginTop: 120,
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 250,
    alignSelf: 'center'
  },
});
