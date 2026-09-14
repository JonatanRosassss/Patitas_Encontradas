import { Image, StyleSheet, Text, View } from 'react-native';


export function PetCard({ tipo, estado, nombre, imagen }: { tipo: string; estado: string; nombre: string; imagen: string }) {
  return (
    <View style={styles.petCard}>
      <Image source={{ uri: imagen }} style={styles.petImage} />

      <View style={styles.petInfo}>
        <View style={styles.petStatusRow}>
          <Text>{tipo}</Text>
        </View>

        <Text>{estado}</Text>
        <Text>{nombre}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  petCard: {
  width: '100%',
  height: 150,
  backgroundColor: '#ddd',
  flexDirection: 'row',
  },

  petImage: {
  width: 100,
  height: 100,
  backgroundColor: '#fff',
  margin: 10,
  borderRadius: 8,
  },

  petInfo: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  },
  petStatusRow: {
  flexDirection: 'row',
  },

});
