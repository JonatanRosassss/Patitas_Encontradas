import { StyleSheet, Text, View } from 'react-native';


export function PetCard({ tipo, estado, nombre }: { tipo: string; estado: string; nombre: string }) {
  return (
    <View style={styles.petCard}>
      <View style={styles.petImage} />

      <View style={styles.petInfo}>
        <Text>{tipo}</Text>
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
  backgroundColor: '#999',
  },

  petInfo: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  },

});
