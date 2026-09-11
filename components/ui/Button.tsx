import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography } from '../../constants/theme';

export type ButtonColor = 'orange' | 'white' | 'bWhite' | 'lightOrange';
export type TextColor = 'orange' | 'white' | 'bWhite' | 'lightOrange' | 'black';

export interface ButtonProps {
  label?: string;
  title?: string;
  onClick?: () => void;
  onPress?: () => void;
  type?: 'button' | 'submit' | 'reset';
  color?: ButtonColor;
  colorText?: TextColor;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  title,
  onClick,
  onPress,
  color,
  colorText,
  variant,
  disabled = false,
  loading = false,
}) => {
  const handler = onPress || onClick;
  const textLabel = label || title || '';

  // Determinar variante o color segun props pasadas
  let effectiveColor: ButtonColor = color || (variant === 'outline' ? 'bWhite' : 'orange');
  let effectiveColorText: TextColor =
    colorText || (effectiveColor === 'orange' ? 'white' : effectiveColor === 'bWhite' ? 'orange' : 'black');

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handler}
      disabled={disabled || loading}
      style={[
        styles.button,
        buttonVariantStyles[effectiveColor] || buttonVariantStyles.orange,
        disabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={effectiveColorText === 'white' ? '#FFFFFF' : Colors.primary} />
      ) : (
        <Text style={[styles.buttonText, textVariantStyles[effectiveColorText] || styles.defaultText]}>
          {textLabel}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const buttonVariantStyles: Record<ButtonColor, ViewStyle> = {
  orange: {
    backgroundColor: Colors.primary,
  },
  lightOrange: {
    backgroundColor: Colors.secondary,
  },
  white: {
    backgroundColor: Colors.white,
  },
  bWhite: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
};

const textVariantStyles: Record<TextColor, TextStyle> = {
  orange: {
    color: Colors.primary,
  },
  lightOrange: {
    color: Colors.secondary,
  },
  white: {
    color: Colors.white,
  },
  bWhite: {
    color: Colors.white,
  },
  black: {
    color: Colors.black,
  },
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
  },
  defaultText: {
    color: Colors.text,
  },
});
