import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Radius } from '../../theme/tokens';

export interface MapSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}

export function MapSearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar por barrio, calle o campaña...',
  onFilterPress,
}: MapSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color={Colors.text} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          style={styles.actionButton}
        >
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </Pressable>
      ) : onFilterPress ? (
        <Pressable
          onPress={onFilterPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Opciones de filtro"
          style={styles.actionButton}
        >
          <Ionicons name="options-outline" size={20} color={Colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.two,
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    paddingVertical: 0,
  },
  actionButton: {
    padding: Spacing.half,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
