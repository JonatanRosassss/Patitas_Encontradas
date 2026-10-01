// services/mascotasService.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ConexionFirebase } from '@/services/ConexionFirebase';
import type { NuevaAlertaMascota } from '@/types/Pet';

const db = ConexionFirebase.obtenerFirestore();
const storage = ConexionFirebase.obtenerStorage();
const auth = ConexionFirebase.obtenerAuth();

/**
 * Sube una imagen local a Firebase Storage y retorna su URL pública
 */
export async function subirImagenMascota(uriLocal: string): Promise<string> {
    const respuesta = await fetch(uriLocal);
    const blob = await respuesta.blob();
    const nombreArchivo = `mascotas/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const referencia = ref(storage, nombreArchivo);

    await uploadBytes(referencia, blob);
    return await getDownloadURL(referencia);
}


export async function crearAlertaMascota(datos: Omit<NuevaAlertaMascota, 'fotos' | 'fechaReporte' | 'creadoPor'>, fotosLocales: string[]): Promise<string> {
    const usuario = auth.currentUser;

    const urlsFotos = await Promise.all(
        fotosLocales.map((uri) => subirImagenMascota(uri))
    );

    const payload = {
        ...datos,
        fotos: urlsFotos,
        creadoPor: usuario?.uid ?? 'anonimo',
        fechaReporte: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'alertas'), payload);
    return docRef.id;
}