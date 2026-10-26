
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../../services/firebase";

export async function crearColeccionAlertas(): Promise<void> {
  const usuario = auth.currentUser;

  if (!usuario) {
    throw new Error("Tenés que iniciar sesión primero.");
  }

  const referencia = doc(collection(db, "alertas"), "documento_inicial");
  const existente = await getDoc(referencia);

  if (existente.exists()) {
    console.log("La colección alertas ya tiene el documento inicial.");
    return;
  }

  await setDoc(referencia, {
    nombre: "Mascota de prueba",
    especie: "PERRO",
    estado: "PERDIDO",
    descripcion: "Documento inicial de configuración",
    ubicacion: "Pilar, Buenos Aires",
    creadoPor: usuario.uid,
    fotos: [],
    coordenadas: null,
    contacto: null,
    recompensa: "",
    fechaReporte: serverTimestamp(),
    creadoEn: serverTimestamp(),
  });

  console.log("Colección alertas creada correctamente.");
}
