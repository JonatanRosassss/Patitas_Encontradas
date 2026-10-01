import React, {useState} from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { router } from 'expo-router';

interface PerfilScreenProps {}

export default function PerfilScreen({}: PerfilScreenProps) {
  const [mostrarDatos, setMostrarDatos] = useState(false); //para que sepa detectar si se toco el boton

      return (
    <>
      <View style={styles.container}>
        <Text style={styles.titulo}>Mi Perfil</Text>

        {/* boton para usar el modal, cuando click cambia el usestate a true*/ }
        <Pressable style={styles.boton} onPress={() => setMostrarDatos(true)}>
          <Text style={styles.botontext}>MIS DATOS</Text>
        </Pressable>

        <Pressable style={styles.boton} onPress={() => router.push('/ajustes')}>
          <Text style={styles.botontext}>AJUSTES</Text>
        </Pressable>
      </View>

        {/*modal, la pantallita que aparece al click en mis datos*/}
        <Modal visible={mostrarDatos} transparent={true} animationType="fade">
          {/*aqui le decimos: lo que mostrara, que atras de la cajita sea transparente y que al aparecer la cajita lo haga con la animacion fade */}
        <View style={styles.modalFondo}> 
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>MIS DATOS</Text>

            <Text>Nombre: nombre usuario</Text>
            <Text>Email: usuario@email.com</Text>

            <Pressable
              style={styles.botonCerrar}
              onPress={() => setMostrarDatos(false)}
            >
            {/* este pressable nos sirve para cerrar el modal, sin esto estariamos atrapados al abrir el modal */}
              <Text style={styles.botonCerrarTexto}>CERRAR</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 20,
  },
  titulo: {
    fontSize: Typography.sizes.xxl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
  },
  //estilos del boton
  boton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 130,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.borderFocus,
    borderColor: Colors.black,
  },
  botontext: {
    fontSize: Typography.sizes.sm,
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
  },

  //estilos del modal, la pantallita que aparece al apretar el boton mis datos
  modalFondo: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContenido: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fonts.titleBold,
    color: Colors.primary,
    marginBottom: 16,
  },
  botonCerrar: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  botonCerrarTexto: {
    color: Colors.white,
    fontFamily: Typography.fonts.bodyBold,
  },
});
