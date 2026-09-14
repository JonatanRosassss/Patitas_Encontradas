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
import { useFonts, Baloo2_700Bold, Baloo2_500Medium, Baloo2_400Regular } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_700Bold, Nunito_300Light } from '@expo-google-fonts/nunito';
import { Button } from '../../components/ui/Button';
import { loginSchema } from '@/schemas/authScheama';
import { router } from 'expo-router';

interface ForgetPasswordProps {}

export default function ForgetPassword({ }: ForgetPasswordProps) {
  const [fontsLoaded] = useFonts({
    Baloo2_700Bold,
    Baloo2_400Regular,
    Baloo2_500Medium,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_300Light,
  });

  const [email, setEmail] = useState('');

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleValidation = () => {
    const resultado = loginSchema.safeParse({ email});
    if (!resultado.success) {
      //no paso
      return;
    }
    //paso
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contenedorTitulo}>
         <Image
          source={require('assets/logo_patitas_crop.png')}
          style={styles.logo}
          resizeMode='contain'
        />

        <Text style={styles.tituloNegro}>
          PATITAS
          <Text style={styles.titulo}> ENCONTRADAS</Text>
        </Text>
        <Text style={styles.textoAbajo}> Ayudanos a que vuelvan a casa</Text>
      </View>

      <View style={styles.contenedorInicio}>
        <Text style={styles.textoSemiTitulo}>Olvidaste tu Contrasenia?</Text>
        <Text style={styles.textoAbajo}> Ingresa tu correo electronico y se te enviara un codigo de recuperacion</Text>
       </View>
      <Text style={styles.textoCorreo}> CORREO: </Text>
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

      <Button
        label="Enviar codigo de verificacion"
        onClick={handleValidation}
        color="orange"
        colorText="white"
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
  textoSemiTitulo: {
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
  textoCorreo: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    marginTop: 5,
    opacity: 0.9,
    textAlign: 'left',
    fontFamily: Typography.fonts.titleRegular,
    marginBottom: 20,
    color: Colors.text

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
