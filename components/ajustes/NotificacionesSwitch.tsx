import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { registrarPushToken } from '../../services/notificaciones';

interface Props {
  usuarioId: string;
}

export default function NotificacionesSwitch({ usuarioId }: Props) {
  const [activadas, setActivadas] = useState(true);

  useEffect(() => {
    async function cargarPreferencia() {
      if (!usuarioId) return;
      const docRef = doc(db, 'usuarios', usuarioId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const datos = docSnap.data();
        setActivadas(datos.notificacionesActivas ?? true);
      }
    }
    cargarPreferencia();
  }, [usuarioId]);

  const cambiarEstado = async (valor: boolean) => {
    setActivadas(valor);

    try {
      if (valor) {
        const token = await registrarPushToken(usuarioId);
        await updateDoc(doc(db, 'usuarios', usuarioId), {
          notificacionesActivas: true,
          pushToken: token,
        });
      } else {
        await updateDoc(doc(db, 'usuarios', usuarioId), {
          notificacionesActivas: false,
          pushToken: null,
        });
      }
    } catch (error) {
      console.error('Error al cambiar notificaciones:', error);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.texto}>Notificaciones Push</Text>
      <Switch
        value={activadas}
        onValueChange={cambiarEstado}
        trackColor={{ false: '#E5E5EA', true: '#FF8A00' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  texto: {
    fontSize: 16,
    color: '#1C1C1E',
  },
});
