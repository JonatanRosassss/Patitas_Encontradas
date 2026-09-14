import { StyleSheet, View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportarErrorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Descripción</Text>

          <TextInput
            style={styles.textArea}
            placeholder="Contanos qué ocurrió..."
            placeholderTextColor="#999"
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
    backgroundColor: '#F2F2F2',
  },

  header: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5A3A1F',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 16,
    color: '#777',
  },

  form: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },

  label: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5A3A1F',
    marginTop: 15,
    marginBottom: 8,
  },

  options: {
    flexDirection: 'row',
    gap: 10,
  },

  option: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFC28A',
    backgroundColor: '#FFE7D2',
    alignItems: 'center',
  },

  optionText: {
    color: '#5A3A1F',
    fontWeight: 'bold',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
  },

  textArea: {
    height: 130,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#FF8A00',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});