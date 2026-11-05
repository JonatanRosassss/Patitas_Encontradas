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
  Alert,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { useFonts, Baloo2_700Bold, Baloo2_500Medium, Baloo2_400Regular } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_700Bold, Nunito_300Light } from '@expo-google-fonts/nunito';
import { Button } from '../../components/ui/Button';
import { loginSchema, resetPasswordSchema } from '@/schemas/authSchema';
import { useAuth } from '@/services/AuthContext';

interface ForgetPasswordProps {}

export default function ForgetPassword({ }: ForgetPasswordProps) {
  const { enviarCorreoRestablecimiento } = useAuth();
  const [fontsLoaded] = useFonts({
    Baloo2_700Bold,
    Baloo2_400Regular,
    Baloo2_500Medium,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_300Light,
  });

  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const alertar = (titulo: string, mensaje: string, alAceptar?: () => void) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n${mensaje}`);
      alAceptar?.();
    } else {
      Alert.alert(titulo, mensaje, alAceptar ? [{ text: 'OK', onPress: alAceptar }] : undefined);
    }
  };

  const handleValidation = async () => {
    // Validación con schema de correo (compatible con loginSchema.shape.email y resetPasswordSchema)
    const validacionPreliminar = loginSchema.safeParse({ email, contrasenia: 'validacion_temporal' });
    const resultado = resetPasswordSchema.safeParse({ email });
    if (!resultado.success || !validacionPreliminar.success) {
      const mensajeError =
        resultado.error?.errors[0]?.message || 'Ingresá un correo electrónico válido.';
      alertar('Atención', mensajeError);
      return;
    }

    try {
      setEnviando(true);
      await enviarCorreoRestablecimiento(email.trim());
      alertar(
        'Correo enviado',
        'Te enviamos un enlace a tu correo electrónico para restablecer tu contraseña.',
        () => router.back()
      );
    } catch (error: unknown) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudo enviar el correo de recuperación.';
      alertar('Atención', mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        style={{ alignSelf: 'flex-start', paddingVertical: Spacing.two }}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Volver al inicio de sesión"
      >
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.contenedorTitulo}>
        <Image
          source={require('@/assets/logo_patitas_crop.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.tituloNegro}>
          PATITAS
          <Text style={styles.titulo}> ENCONTRADAS</Text>
        </Text>
        <Text style={styles.textoAbajo}> Ayudanos a que vuelvan a casa</Text>
      </View>

      <View style={styles.contenedorInicio}>
        <Text style={styles.textoSemiTitulo}>¿Olvidaste tu Contraseña?</Text>
        <Text style={styles.textoAbajo}>
          Ingresá tu correo electrónico y te enviaremos un enlace de recuperación
        </Text>
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

      {enviando ? (
        <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: Spacing.three }} />
      ) : (
        <Button
          label="Enviar codigo de verificacion"
          onClick={handleValidation}
          color="orange"
          colorText="white"
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    backgroundColor: Colors.backgroundLight,
  },
  contenedorInicio: {
    paddingHorizontal: Spacing.four,
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
    marginBottom: Spacing.five,
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
    marginTop: Spacing.one,
    opacity: 0.3,
    textAlign: 'center',
    fontFamily: Typography.fonts.bodyLight,
    marginBottom: Spacing.four,
  },
  linkTexto: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    marginTop: Spacing.one,
    marginLeft: Spacing.two,
    fontFamily: Typography.fonts.bodyRegular,
    marginBottom: Spacing.four,
  },
  textoCorreo: {
    fontSize: Typography.sizes.sm,
    lineHeight: Typography.lineHeights.sm,
    marginTop: Spacing.one,
    opacity: 0.9,
    textAlign: 'left',
    fontFamily: Typography.fonts.titleRegular,
    marginBottom: Spacing.two,
    color: Colors.text,
  },
  input: {
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
  },
  contenedorTitulo: {
    alignSelf: 'stretch',
    marginTop: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  logo: {
    width: 180,
    height: 250,
    alignSelf: 'center',
  },
});