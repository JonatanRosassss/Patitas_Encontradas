import React from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, BottomTabInset } from '../../constants/theme';

export default function ReportarErrorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Reportar un error</Text>

          <Text style={styles.subtitle}>
            Ayudanos a mejorar Patitas Encontradas
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Tipo de problema</Text>

          <View style={styles.options}>
            <Pressable style={styles.option}>
              <Text style={styles.optionText}>
                Error técnico
              </Text>
            </Pressable>

            <Pressable style={styles.option}>
              <Text style={styles.optionText}>
                Otro problema
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Título</Text>

          <TextInput
            style={styles.input}
            placeholder="Ej: No puedo publicar una mascota"
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>Descripción</Text>

          <TextInput
            style={styles.textArea}
            placeholder="Contanos qué ocurrió..."
            placeholderTextColor={Colors.textMuted}
            multiline
          />

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>
              Enviar reporte
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    backgroundColor: Colors.card,
    padding: Spacing.four,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: Typography.sizes.xxxl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.text,
  },
  subtitle: {
    marginTop: Spacing.one,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.textSecondary,
  },
  form: {
    backgroundColor: Colors.card,
    margin: Spacing.four,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
    color: Colors.text,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  options: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  option: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  optionText: {
    color: Colors.text,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  textArea: {
    height: 130,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.three,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyRegular,
    color: Colors.text,
    backgroundColor: Colors.card,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.three,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.four,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.sizes.md,
    fontFamily: Typography.fonts.bodyBold,
  },
});