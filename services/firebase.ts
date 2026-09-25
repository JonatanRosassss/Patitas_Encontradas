/**
 * Puente central de Firebase para la aplicación.
 * Expone la clase orquestadora ConexionFirebase (Singleton) y los accesos directos
 * a Auth, Firestore y Storage para que el equipo conecte sus componentes.
 */
import {
  ConexionFirebase,
  obtenerConexion,
  obtenerFirestore,
  obtenerAuth,
  obtenerStorage,
} from './ConexionFirebase';

// Instancias del SDK
const conexion = ConexionFirebase.obtenerInstancia();
const auth = conexion.autenticacion;
const db = conexion.firestore;
const storage = conexion.almacenamiento;

export {
  // Clase Singleton y helpers
  ConexionFirebase,
  conexion,
  obtenerConexion,
  obtenerFirestore,
  obtenerAuth,
  obtenerStorage,

  // Instancias directas
  auth,
  db,
  storage,
};

export default ConexionFirebase;
