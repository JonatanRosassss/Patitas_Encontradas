import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyB_G3XR7fIyypuE9eGZCZAQ9q5doqQ2qNU',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'patitas-encontradas-2026.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'patitas-encontradas-2026',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'patitas-encontradas-2026.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '633513717477',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:633513717477:web:d883f628d134d25b3fae0c',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Puntos de prueba hardcodeados con coordenadas válidas de Pilar
const PUNTOS_PRUEBA_FIREBASE = [
  {
    nombre: 'Firulais Test Live',
    especie: 'PERRO',
    estado: 'PERDIDO',
    descripcion: 'Punto de prueba temporal georreferenciado en Pilar',
    ubicacion: 'Barrio Champagnat, Pilar',
    contacto: '11-5555-1234',
    coordenadas: {
      latitude: -34.4586,
      longitude: -58.9142,
    },
    fechaReporte: new Date().toISOString(),
    esPruebaAutomatizada: true,
  },
  {
    nombre: 'Michi Test Live',
    especie: 'GATO',
    estado: 'ENCONTRADO',
    descripcion: 'Punto de prueba temporal de avistamiento en el centro',
    ubicacion: 'Plaza 12 de Octubre, Pilar',
    contacto: '11-5555-5678',
    coordenadas: {
      latitude: -34.4620,
      longitude: -58.9210,
    },
    fechaReporte: new Date().toISOString(),
    esPruebaAutomatizada: true,
  },
];

test('firebase live: insertar puntos de prueba en Firestore, verificar lectura y eliminarlos de la BD', async () => {
  const idsGenerados = [];

  console.log('\n===============================================================');
  console.log('🧪 PRUEBA EN VIVO: Firestore Alertas & Puntos para Mapa');
  console.log('Proyecto Firebase:', firebaseConfig.projectId);
  console.log('===============================================================\n');

  try {
    // 1. Inserción de puntos de prueba en la colección 'alertas'
    console.log('[PASO 1] Insertando 2 puntos de prueba en la colección "alertas"...');
    const coleccionAlertas = collection(db, 'alertas');

    for (const punto of PUNTOS_PRUEBA_FIREBASE) {
      const docRef = await addDoc(coleccionAlertas, punto);
      idsGenerados.push(docRef.id);
      console.log(`  -> Punto guardado con éxito. ID: ${docRef.id}`);
      console.log(`     Mascota: "${punto.nombre}" | GPS: [Lat: ${punto.coordenadas.latitude}, Lng: ${punto.coordenadas.longitude}]`);
    }

    assert.equal(idsGenerados.length, 2, 'Deben haberse generado exactamente 2 IDs en Firestore');
    console.log('  [OK] Inserción completada en Firebase.');

    // 2. Consulta de los puntos desde Firestore
    console.log('\n[PASO 2] Consultando los puntos directamente desde Firestore...');
    const snapshot = await getDocs(coleccionAlertas);

    const puntosEncontrados = snapshot.docs
      .filter((d) => idsGenerados.includes(d.id))
      .map((d) => ({ id: d.id, ...d.data() }));

    assert.equal(
      puntosEncontrados.length,
      2,
      `Se esperaba leer los 2 puntos recién creados, se encontraron: ${puntosEncontrados.length}`
    );

    // 3. Validación de las coordenadas y mapeo a pines del Mapa
    console.log('\n[PASO 3] Validando coordenadas y adaptación a pines de Leaflet...');
    for (const punto of puntosEncontrados) {
      const datosOriginales = PUNTOS_PRUEBA_FIREBASE.find((p) => p.nombre === punto.nombre);
      assert.ok(datosOriginales, `Punto ${punto.nombre} no coincide`);

      assert.equal(typeof punto.coordenadas?.latitude, 'number', 'Latitud debe ser numérico');
      assert.equal(typeof punto.coordenadas?.longitude, 'number', 'Longitud debe ser numérico');
      assert.equal(punto.coordenadas.latitude, datosOriginales.coordenadas.latitude);
      assert.equal(punto.coordenadas.longitude, datosOriginales.coordenadas.longitude);

      const petState = punto.estado === 'ENCONTRADO' ? 2 : 1;
      console.log(`  [OK] Pin validado: "${punto.nombre}" -> Coordenadas: (${punto.coordenadas.latitude}, ${punto.coordenadas.longitude}) | Estado Pin: ${petState}`);
    }

    console.log('  [OK] Todos los puntos fueron verificados correctamente desde Firestore.');
  } catch (error) {
    if (error?.code === 'permission-denied' || error?.message?.includes('permission-denied')) {
      console.warn('\n⚠️ [AVISO DE REGLAS DE FIREBASE]');
      console.warn('Firestore rechazó la operación con "permission-denied".');
      console.warn('Esto indica que en tu consola de Firebase (Firestore Database -> Pestaña Reglas),');
      console.warn('las reglas actuales están en modo bloqueo (allow read, write: if false;).');
      console.warn('Para habilitar el acceso, publicá estas reglas en tu consola de Firebase:');
      console.warn('---------------------------------------------------------');
      console.warn('rules_version = "2";');
      console.warn('service cloud.firestore {');
      console.warn('  match /databases/{database}/documents {');
      console.warn('    match /alertas/{document=**} { allow read, write: if true; }');
      console.warn('    match /tickets_soporte/{document=**} { allow read, write: if true; }');
      console.warn('  }');
      console.warn('}');
      console.warn('---------------------------------------------------------\n');
      throw error;
    }
    throw error;
  } finally {
    // 4. Limpieza garantizada en la BD
    if (idsGenerados.length > 0) {
      console.log('\n[PASO 4] Limpieza: Eliminando documentos de prueba de Firestore...');
      for (const id of idsGenerados) {
        const docRef = doc(db, 'alertas', id);
        await deleteDoc(docRef);
        console.log(`  -> Documento eliminado: ${id}`);

        const docSnap = await getDoc(docRef);
        assert.equal(docSnap.exists(), false, `El documento ${id} no debe existir tras borrarse`);
      }
      console.log('  [OK] Base de datos limpia: todos los puntos de prueba fueron eliminados de Firestore exitosamente.\n');
    }
  }
});
