import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  const esOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        estilos.boton,
        esOutline ? estilos.botonOutline : estilos.botonPrimario,
        disabled && estilos.botonDeshabilitado,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={esOutline ? (Colors.primary || '#EE6C4D') : '#FFFFFF'} />
      ) : (
        <Text style={[estilos.texto, esOutline ? estilos.textoOutline : estilos.textoPrimario]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  boton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  botonPrimario: {
    backgroundColor: Colors.primary || '#EE6C4D',
  },
  botonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary || '#EE6C4D',
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  texto: {
    fontSize: 16,
    fontWeight: '700',
  },
  textoPrimario: {
    color: '#FFFFFF', // Texto blanco bien visible
  },
  textoOutline: {
    color: Colors.primary || '#EE6C4D', // Texto naranja bien visible
  },
});