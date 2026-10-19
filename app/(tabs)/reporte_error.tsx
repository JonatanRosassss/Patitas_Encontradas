import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, Radius, BottomTabInset } from '@/constants/theme';
import { FaqAccordion } from '@/components/soporte/FaqAccordion';
import { TicketForm } from '@/components/soporte/TicketForm';

type TabSoporte = 'FAQS' | 'TICKET';

function normalizarTab(paramTab?: string | string[]): TabSoporte {
  const valor = Array.isArray(paramTab) ? paramTab[0] : paramTab;
  return valor?.toUpperCase() === 'TICKET' ? 'TICKET' : 'FAQS';
}

export default function SoporteScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [tabActiva, setTabActiva] = useState<TabSoporte>(() => normalizarTab(tab));

  useEffect(() => {
    if (tab) setTabActiva(normalizarTab(tab));
  }, [tab]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Superior con Selector de Pestañas */}
          <View style={styles.header}>
            <Text style={styles.title}>Centro de Ayuda</Text>
            <Text style={styles.subtitle}>
              Soporte oficial y preguntas frecuentes de Patitas Encontradas
            </Text>

            <View style={styles.tabsContainer} accessibilityRole="tablist">
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: tabActiva === 'FAQS' }}
                accessibilityLabel="Pestaña Preguntas Frecuentes"
                style={[styles.tabBoton, tabActiva === 'FAQS' && styles.tabBotonActivo]}
                onPress={() => setTabActiva('FAQS')}
              >
                <Text style={[styles.tabTexto, tabActiva === 'FAQS' && styles.tabTextoActivo]}>
                  Preguntas Frecuentes
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: tabActiva === 'TICKET' }}
                accessibilityLabel="Pestaña Generar Ticket"
                style={[styles.tabBoton, tabActiva === 'TICKET' && styles.tabBotonActivo]}
                onPress={() => setTabActiva('TICKET')}
              >
                <Text style={[styles.tabTexto, tabActiva === 'TICKET' && styles.tabTextoActivo]}>
                  Generar Ticket
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Renderizado de Módulos Desacoplados */}
          {tabActiva === 'FAQS' ? (
            <FaqAccordion onContactPress={() => setTabActiva('TICKET')} />
          ) : (
            <TicketForm onSuccess={() => setTabActiva('FAQS')} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: Spacing.half },
    shadowOpacity: 0.05,
    shadowRadius: Radius.xs,
    elevation: Spacing.half,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: Typography.sizes.xxl,
    fontFamily: Typography.fonts.titleBold,
    lineHeight: Typography.lineHeights.xxl,
    color: Colors.text,
  },
  subtitle: {
    marginTop: Spacing.half,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fonts.bodyRegular,
    lineHeight: Typography.lineHeights.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.three,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: Radius.md,
    padding: Spacing.half,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBoton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  tabBotonActivo: {
    backgroundColor: Colors.primary,
  },
  tabTexto: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fonts.bodyBold,
    lineHeight: Typography.lineHeights.xs,
    color: Colors.textSecondary,
  },
  tabTextoActivo: {
    color: Colors.white,
  },
});