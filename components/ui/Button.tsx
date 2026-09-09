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
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography } from '../../constants/theme';
export type ButtonColor = 'orange' | 'white' | 'bWhite' | 'lightOrange' ;
export type TextColor = 'orange' | 'white' | 'bWhite' | 'lightOrange' | 'black';

interface ButtonProps {
  label: string,
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  color?: ButtonColor;
  colorText?: TextColor,
  disabled?: false,

}


export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  color = 'orange',
  disabled = false,
  colorText = 'black',


}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onClick}
      disabled={disabled}

      style={
        [
          styles.button,
          buttonVariantStyles[color],

        ]
      }

    >
      <Text style={[styles.ButtonText, textVariantStyles[colorText]]}>
        {label}
      </Text>

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
    borderColor: '#272424',
    borderWidth: 1,
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
    color: Colors.white
  },
  bWhite: {
    color: Colors.white,

  },
  black: {
    color: Colors.black,
  }
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
    },
  ButtonText: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
   },

});
