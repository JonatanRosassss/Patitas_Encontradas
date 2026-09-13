import { Image, StyleSheet, Text, View, Pressable } from 'react-native';


export function PetCard({ tipo, estado, nombre, imagen }: { tipo: string; estado: string; nombre: string; imagen: string }) {
  return (
    <View style={styles.petCard}>
      <Image source={{ uri: imagen }} style={styles.petImage} />

      <View style={styles.petInfo}>

        <View style={styles.petTopRow}>
          <View style={styles.petStatus}>
            <Text>{estado}</Text>
          </View>

          <Pressable style={styles.saveButton}>
            <Text>G</Text>
          </Pressable>
        </View>


        <Pressable style={styles.infoButton}>
          <Text>{tipo} | informacion de la mascota logica</Text>
        </Pressable>

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
  borderRadius: 12,
  },

  petInfo: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  },

  petTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  },

  petStatus: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 5,
  backgroundColor: '#FF8A00',
  },

  saveButton: {
  width: 40,
  height: 40,
  borderRadius: 10,
  backgroundColor: '#FF8A00',
  alignItems: 'center',
  justifyContent: 'center',
  },

  infoButton: {
  width: 150,
  height: 50,
  borderRadius: 10,
  backgroundColor: '#FFF',
  alignItems: 'center',
  justifyContent: 'center',
  },
});
