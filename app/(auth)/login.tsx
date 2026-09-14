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
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { useFonts, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_700Bold, Nunito_300Light } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { loginSchema } from '@/schemas/authScheama';
import { router } from 'expo-router';
import { simularInicioSesion } from '../../services/authMock';

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
  const [verContrasenia, setVerContrasenia] = useState(false);

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleLogin = () => {
    const resultado = loginSchema.safeParse({
      email,
      contrasenia,
      constrasenia: contrasenia,
    });

    if (!resultado.success) {
      const errorMsg = resultado.error.errors[0]?.message || 'Por favor revisa los campos ingresados.';
      Alert.alert('Atención', errorMsg);
      return;
    }

    const usuario = simularInicioSesion(email, contrasenia);
    if (usuario) {
      Alert.alert('¡Bienvenido!', `Inicio de sesión exitoso como ${usuario.nombre}.`, [
        {
          text: 'Continuar',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } else {
      Alert.alert(
        'Acceso denegado',
        'Correo o contraseña incorrectos.\n\nDatos de prueba:\nprofesor@patitas.com / 123456'
      );
    }
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/register');
  };

  const handleForgetPassword = () => {
    router.push('/(auth)/forgetPassword');
  };

  const handleSocialLogin = (proveedor: 'Google' | 'Apple' | 'Facebook') => {
    Alert.alert(
      `Acceso con ${proveedor}`,
      `Inicio de sesión exitoso utilizando tu cuenta de ${proveedor}.`,
      [
        {
          text: 'Continuar',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  const handleContinueGoogle = () => {
    handleSocialLogin('Google');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContenido}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contenedorTitulo}>
          <Text style={styles.tituloNegro}>
            PATITAS
            <Text style={styles.titulo}> ENCONTRADAS</Text>
          </Text>
          <Text style={styles.textoAbajo}>Ayudanos a que vuelvan a casa</Text>
          <Image
            source={require('../../assets/logo_patitas_crop.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contenedorInicio}>
          <Text style={styles.textoIniciarSesion}>Iniciar Sesion</Text>
          <Text style={styles.textoAbajo}>Bienvenido de vuelta</Text>

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

          <View style={styles.contenedorInputPassword}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Contraseña"
              placeholderTextColor={Colors.textMuted}
              value={contrasenia}
              onChangeText={setContrasenia}
              secureTextEntry={!verContrasenia}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.botonOjo}
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

          <Text style={styles.linkTexto} onPress={handleForgetPassword}>
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

          {/* Divisor social */}
          <View style={styles.contenedorDivisor}>
            <View style={styles.lineaDivisora} />
            <Text style={styles.textoDivisor}>o continuar con</Text>
            <View style={styles.lineaDivisora} />
          </View>

          {/* Botones de Login Social */}
          <View style={styles.filaBotonesSociales}>
            <TouchableOpacity
              style={styles.botonSocial}
              onPress={handleContinueGoogle}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={24} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonSocial}
              onPress={() => handleSocialLogin('Apple')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={24} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonSocial}
              onPress={() => handleSocialLogin('Facebook')}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollContenido: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  contenedorInicio: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
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
    opacity: 0.5,
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
    color: Colors.primary,
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
  contenedorInputPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  inputPassword: {
    flex: 1,
    height: 52,
    paddingHorizontal: 14,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  botonOjo: {
    paddingHorizontal: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedorTitulo: {
    alignSelf: 'stretch',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 200,
    alignSelf: 'center',
  },
  contenedorDivisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  lineaDivisora: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  textoDivisor: {
    marginHorizontal: 12,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontFamily: Typography.fonts.bodyRegular,
  },
  filaBotonesSociales: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 10,
  },
  botonSocial: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
