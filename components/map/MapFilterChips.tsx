import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Radius } from '../../theme/tokens';
import { MapFilterIndex } from '../../types/map';

export interface MapFilterChipsProps {
  filters: readonly string[];
  selectedFilterIndex: MapFilterIndex;
  onSelectFilter: (index: MapFilterIndex) => void;
}

export function MapFilterChips({
  filters,
  selectedFilterIndex,
  onSelectFilter,
}: MapFilterChipsProps) {
  return (
    <View style={styles.container}>
      {filters.map((name, index) => {
        const isSelected = selectedFilterIndex === index;
        const filterIdx = index as MapFilterIndex;

        return (
          <Pressable
            key={name}
            onPress={() => onSelectFilter(filterIdx)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={[
              styles.chip,
              { flex: index === 0 ? 1.25 : 1 },
              isSelected ? styles.chipActive : styles.chipInactive,
            ]}
          >
            {index > 0 && (
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isSelected
                      ? Colors.white
                      : index === 1
                      ? Colors.primary
                      : Colors.secondary,
                  },
                ]}
              />
            )}
            <Text
              style={[
                styles.label,
                isSelected ? styles.labelActive : styles.labelInactive,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.two,
    height: 36,
    gap: Spacing.one + Spacing.half, // ~6-7
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.lg,
    gap: Spacing.one,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipInactive: {
    backgroundColor: Colors.secondary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  label: {
    flexShrink: 1,
    fontSize: Typography.sizes.xs,
  },
  labelActive: {
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.white,
  },
  labelInactive: {
    fontFamily: Typography.fonts.bodySemiBold,
    color: Colors.text,
  },
});
