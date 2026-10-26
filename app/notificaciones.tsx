
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, CheckCheck } from "lucide-react-native";

import { useAuth } from "../services/AuthContext";
import {
  escucharNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
  type Notificacion,
} from "../services/notificaciones";
import {
  Colors,
  Typography,
  Spacing,
  Radius,
} from "../constants/theme";

export default function NotificacionesScreen() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [items, setItems] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario?.uid) {
      setItems([]);
      setCargando(false);
      return;
    }

    setCargando(true);

    const cancelar = escucharNotificaciones(
      usuario.uid,
      (notificaciones) => {
        setItems(notificaciones);
        setCargando(false);
      },
      (error) => {
        console.error(
          "Error al escuchar notificaciones:",
          error
        );

        setCargando(false);

        Alert.alert(
          "Error",
          "No se pudieron cargar las notificaciones. Revisá tu conexión."
        );
      }
    );

    return cancelar;
  }, [usuario?.uid]);

  const pendientes = items.filter(
    (item) => !item.leida
  ).length;

  async function leerUna(item: Notificacion) {
    if (item.leida) return;

    try {
      await marcarComoLeida(item.id);
    } catch (error) {
      console.error(
        "Error al marcar notificación como leída:",
        error
      );

      Alert.alert(
        "Error",
        "No se pudo marcar la notificación como leída."
      );
    }
  }

  async function leerTodas() {
    if (!usuario?.uid || pendientes === 0) return;

    try {
      await marcarTodasComoLeidas(usuario.uid);
    } catch (error) {
      console.error(
        "Error al marcar todas como leídas:",
        error
      );

      Alert.alert(
        "Error",
        "No se pudieron marcar todas las notificaciones como leídas."
      );
    }
  }

  function iconoTipo(tipo: Notificacion["tipo"]) {
    switch (tipo) {
      case "cerca":
        return "📍";

      case "avistamiento":
        return "🐾";

      case "estado":
        return "🔔";

      default:
        return "📣";
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Volver"
        >
          <ArrowLeft
            color={Colors.text}
            size={24}
          />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Notificaciones
          </Text>

          <Text style={styles.subtitle}>
            {pendientes === 0
              ? "Estás al día"
              : `${pendientes} sin leer`}
          </Text>
        </View>

        <Bell
          color={Colors.primary}
          size={26}
        />
      </View>

      {pendientes > 0 && (
        <Pressable
          style={styles.readAll}
          onPress={leerTodas}
        >
          <CheckCheck
            color={Colors.primary}
            size={18}
          />

          <Text style={styles.readAllText}>
            Marcar todas como leídas
          </Text>
        </Pressable>
      )}

      {cargando ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.loadingText}>
            Cargando notificaciones...
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Bell
                color={Colors.textMuted}
                size={42}
              />

              <Text style={styles.emptyTitle}>
                Todavía no tenés notificaciones
              </Text>

              <Text style={styles.emptyText}>
                Acá vas a encontrar las novedades de tus mascotas,
                incluidos los avisos de personas que las hayan visto.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => leerUna(item)}
              style={[
                styles.card,
                !item.leida && styles.unreadCard,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${item.titulo}. ${item.mensaje}`}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                  {iconoTipo(item.tipo)}
                </Text>
              </View>

              <View style={styles.content}>
                <Text style={styles.cardTitle}>
                  {item.titulo}
                </Text>

                <Text style={styles.message}>
                  {item.mensaje}
                </Text>

                {!item.leida && (
                  <Text style={styles.unreadLabel}>
                    NUEVA
                  </Text>
                )}

                {item.tipo === "avistamiento" && (
                  <Text style={styles.avistamientoLabel}>
                    Aviso de avistamiento
                  </Text>
                )}
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.three,
    paddingTop: 56,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },

  backButton: {
    padding: Spacing.one,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: Colors.text,
    fontFamily: Typography.fonts.titleBold,
    fontSize: Typography.sizes.xxl,
  },

  subtitle: {
    color: Colors.textSecondary,
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.sm,
  },

  readAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    alignSelf: "flex-end",
    paddingVertical: Spacing.two,
  },

  readAllText: {
    color: Colors.primary,
    fontFamily: Typography.fonts.bodyBold,
  },

  list: {
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    flexGrow: 1,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  unreadCard: {
    backgroundColor: Colors.accent,
    borderColor: Colors.secondary,
  },

  iconContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
  },

  icon: {
    fontSize: 22,
  },

  content: {
    flex: 1,
    gap: Spacing.one,
  },

  cardTitle: {
    color: Colors.text,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.md,
  },

  message: {
    color: Colors.textSecondary,
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
  },

  unreadLabel: {
    color: Colors.primary,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.one,
  },

  avistamientoLabel: {
    color: Colors.primary,
    fontFamily: Typography.fonts.bodyBold,
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.one,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },

  loadingText: {
    color: Colors.textSecondary,
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.sm,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: 100,
  },

  emptyTitle: {
    color: Colors.text,
    fontFamily: Typography.fonts.titleSemiBold,
    fontSize: Typography.sizes.lg,
    textAlign: "center",
  },

  emptyText: {
    color: Colors.textSecondary,
    fontFamily: Typography.fonts.bodyRegular,
    fontSize: Typography.sizes.md,
    textAlign: "center",
    lineHeight: 22,
  },
});
