import { Image, StyleSheet, Text, View, Pressable } from 'react-native';

import { Colors } from '@/constants/theme';
import { useState } from 'react';

export function PetCard({ tipo, estado, nombre, imagen, onPress }: { tipo: string; estado: string; nombre: string; imagen: string; onPress: () => void }) {

  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const guardarPublicacion = () => {
    setMostrarMensaje(true);
    setTimeout(() => {
      setMostrarMensaje(false);
    }, 2000);
  };

  
  return (
    <Pressable style={styles.petCard} onPress={onPress}>

      {mostrarMensaje && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Publicación guardada</Text>
        </View>
      )}
      <Image source={{ uri: imagen }} style={styles.petImage} />

      <View style={styles.petInfo}>

        <View style={styles.petTopRow}>

          
          <View style={[styles.petStatus, { backgroundColor: estado === 'ENCONTRADO' ? '#a2e6b3' : '#eda8a5' }]}>
            <Text style={styles.petStatusText}>{estado}</Text>
          </View>

          <Pressable style={styles.saveButton} onPress={e => {e.stopPropagation(); guardarPublicacion();}}>
            <Text>G</Text>
          </Pressable>
        </View>


        <View style={styles.infoButton}>
          <Text style={styles.infoText}>{tipo} | informacion de la mascota</Text>
        </View>

        <Text style={styles.petName}>{nombre}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  petCard: {
  width: '100%',
  height: 150,
  backgroundColor: '#FFFFFF',
  flexDirection: 'row',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#DDDDDD',
  padding: 10,
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
  justifyContent: 'flex-start',
  alignItems: 'center',
},

  petTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
},

  petStatus: {
  paddingHorizontal: 5,
  paddingVertical: 5,
  borderRadius: 5,
  backgroundColor: '#FF8A00',
},

  saveButton: {
  width: 34,
  height: 34,
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

  infoText: {
  fontSize: 16,
},

  petStatusText: {
  fontSize: 16,
},

  petName: {
  fontSize: 18,
  fontWeight: 'bold',
},

  toast: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
},

  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
},

});
