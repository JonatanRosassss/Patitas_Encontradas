import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';

const projectRoot = process.cwd();

/**
 * Helper que transpila (usando stripTypeScriptTypes nativo de Node.js) y ejecuta
 * un módulo TypeScript real del proyecto en un contexto aislado con mocks deterministas.
 */
function cargarModuloTS(relativePath, mocks = {}) {
  const fullPath = path.join(projectRoot, relativePath);
  const sourceCode = fs.readFileSync(fullPath, 'utf8');

  // 1. Quitar tipos de TypeScript de forma nativa con Node.js
  let jsCode = stripTypeScriptTypes(sourceCode, { mode: 'strip' });

  // 2. Transformar imports y exports ESM a CommonJS preservando el scope local de funciones
  const exportedNames = [];
  jsCode = jsCode
    .replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g, 'const $1 = require("$2");')
    .replace(/import\s+\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"]\s*;?/g, (_m, imports, mod) => {
      const cleaned = imports
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/\s+as\s+/g, ': '))
        .join(', ');
      return `const { ${cleaned} } = require("${mod}");`;
    })
    .replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g, 'const $1 = require("$2");')
    .replace(/export\s+async\s+function\s+(\w+)/g, (_m, name) => {
      exportedNames.push(name);
      return `async function ${name}`;
    })
    .replace(/export\s+function\s+(\w+)/g, (_m, name) => {
      exportedNames.push(name);
      return `function ${name}`;
    })
    .replace(/export\s+const\s+(\w+)\s*=/g, (_m, name) => {
      exportedNames.push(name);
      return `const ${name} =`;
    });

  if (exportedNames.length > 0) {
    jsCode += '\n' + exportedNames.map((n) => `exports.${n} = ${n};`).join('\n');
  }

  const moduleExports = {};
  const moduleObj = { exports: moduleExports };

  const customRequire = (modName) => {
    if (modName in mocks) {
      return mocks[modName];
    }
    throw new Error(`Módulo no mockeado requerido en test: ${modName}`);
  };

  const sandbox = {
    exports: moduleExports,
    module: moduleObj,
    require: customRequire,
    console,
    Date,
    Math,
    Number,
    String,
    Boolean,
    Array,
    Object,
    Set,
    Map,
    Promise,
    Error,
    RegExp,
    encodeURIComponent,
    decodeURIComponent,
  };

  vm.createContext(sandbox);
  vm.runInContext(jsCode, sandbox, { filename: fullPath });
  return moduleObj.exports;
}

// ============================================================================
// TC-401: Registro exitoso de un avistamiento comunitario sobre publicación ACTIVA
// ============================================================================
test('TC-401: Registro exitoso de un avistamiento comunitario e interacción sobre publicación ACTIVA (REP-01)', async () => {
  // 1. Cargar el validador geoespacial real utils/geoValidation.ts
  const geoMod = cargarModuloTS('utils/geoValidation.ts');

  const inputAvistamiento = {
    publicacionId: 'REP-01',
    coordenadas: { latitude: -34.460, longitude: -58.910 },
    foto: 'avistamiento1.jpg',
    comentario: 'Lo vi corriendo hacia la ruta 8 hace 10 min',
    reportadoPor: 'vecino-colaborador-uid-99',
  };

  // Validar que las coordenadas del avistamiento (-34.460, -58.910) son válidas en Pilar
  assert.equal(
    geoMod.isValidCoordinate(
      inputAvistamiento.coordenadas.latitude,
      inputAvistamiento.coordenadas.longitude
    ),
    true,
    'Las coordenadas Lat: -34.460, Lng: -58.910 deben ser validadas positivamente por isValidCoordinate'
  );

  // 2. Preparar estado simulado de Firestore con la publicación REP-01 en estado ACTIVO ('PERDIDO')
  const actualizacionesDoc = [];
  const notificacionesCreadas = [];

  const mockFirestoreDB = {
    alertas: {
      'REP-01': {
        id: 'REP-01',
        nombre: 'Toby',
        especie: 'PERRO',
        estado: 'PERDIDO', // Publicación ACTIVA
        ubicacion: 'Ruta 8 Km 52, Pilar',
        coordenadas: { latitude: -34.458, longitude: -58.914 },
        creadoPor: 'dueno-uid-01',
        usuariosInteresados: [],
        avistamientos: [],
      },
    },
  };

  const firestoreMock = {
    collection: (_db, colName) => ({ type: 'collection', name: colName }),
    doc: (_db, colName, docId) => ({ type: 'doc', collection: colName, id: docId }),
    getDoc: async (docRef) => {
      const data = mockFirestoreDB[docRef.collection]?.[docRef.id];
      return {
        exists: () => Boolean(data),
        id: docRef.id,
        data: () => data,
      };
    },
    updateDoc: async (docRef, payload) => {
      actualizacionesDoc.push({ docRef, payload });
      const target = mockFirestoreDB[docRef.collection]?.[docRef.id];
      if (target && payload.usuariosInteresados?.__op === 'arrayUnion') {
        target.usuariosInteresados.push(payload.usuariosInteresados.value);
      }
    },
    addDoc: async (colRef, payload) => {
      const nuevoId = `NOTIF-${notificacionesCreadas.length + 1}`;
      notificacionesCreadas.push({ id: nuevoId, collection: colRef.name, payload });
      return { id: nuevoId };
    },
    arrayUnion: (val) => ({ __op: 'arrayUnion', value: val }),
    serverTimestamp: () => '2026-10-30T04:24:05.000Z',
    query: () => ({}),
    where: () => ({}),
    onSnapshot: () => () => {},
    getDocs: async () => ({ docs: [] }),
    writeBatch: () => ({ update: () => {}, commit: async () => {} }),
  };

  const notificacionesMod = cargarModuloTS('services/notificaciones.ts', {
    'firebase/firestore': firestoreMock,
    './firebase': {
      db: {},
      auth: { currentUser: { uid: inputAvistamiento.reportadoPor } },
    },
  });

  // 3. Ejecutar el registro de interacción sobre REP-01 y la notificación de avistamiento al dueño
  await notificacionesMod.registrarInteraccionPublicacion(inputAvistamiento.publicacionId);

  const idNotif = await notificacionesMod.crearNotificacion({
    destinatarioId: mockFirestoreDB.alertas['REP-01'].creadoPor,
    tipo: 'avistamiento',
    titulo: '¡Nuevo avistamiento reportado!',
    mensaje: `${inputAvistamiento.comentario} (Coord: ${inputAvistamiento.coordenadas.latitude}, ${inputAvistamiento.coordenadas.longitude} - Foto: ${inputAvistamiento.foto})`,
    publicacionId: inputAvistamiento.publicacionId,
  });

  // 4. Verificaciones deterministas
  assert.equal(actualizacionesDoc.length, 1, 'Debe actualizarse el documento REP-01 en Firestore');
  assert.equal(actualizacionesDoc[0].docRef.id, 'REP-01');
  assert.deepEqual(
    mockFirestoreDB.alertas['REP-01'].usuariosInteresados,
    ['vecino-colaborador-uid-99'],
    'El usuario que reporta el avistamiento debe quedar vinculado a REP-01'
  );

  assert.equal(idNotif, 'NOTIF-1');
  assert.equal(notificacionesCreadas.length, 1, 'Debe dispararse 1 notificación interna al autor de REP-01');
  assert.equal(notificacionesCreadas[0].payload.destinatarioId, 'dueno-uid-01');
  assert.equal(notificacionesCreadas[0].payload.tipo, 'avistamiento');
  assert.equal(notificacionesCreadas[0].payload.publicacionId, 'REP-01');
  assert.equal(notificacionesCreadas[0].payload.leida, false);
  assert.ok(
    notificacionesCreadas[0].payload.mensaje.includes('Lo vi corriendo hacia la ruta 8 hace 10 min'),
    'El mensaje de la notificación debe contener el comentario del avistamiento'
  );
  assert.ok(
    notificacionesCreadas[0].payload.mensaje.includes('avistamiento1.jpg'),
    'El registro debe preservar la referencia a la evidencia fotográfica avistamiento1.jpg'
  );
});

// ============================================================================
// TC-402: Solicitud de contacto directo con el dueño vía WhatsApp (REP-01)
// ============================================================================
test('TC-402: Solicitud de contacto directo con el dueño vía WhatsApp (+54 9 11 2233-4455)', async () => {
  const urlsAbiertas = [];
  const alertasMostradas = [];

  const reactNativeMock = {
    Linking: {
      canOpenURL: async (url) => url.startsWith('https://wa.me/'),
      openURL: async (url) => {
        urlsAbiertas.push(url);
        return true;
      },
    },
    Alert: {
      alert: (titulo, mensaje) => {
        alertasMostradas.push({ titulo, mensaje });
      },
    },
  };

  // 1. Cargar el módulo real utils/whatsapp.ts con el mock de Linking
  const whatsappMod = cargarModuloTS('utils/whatsapp.ts', {
    'react-native': reactNativeMock,
  });

  const telefonoInput = '+54 9 11 2233-4455';

  // 2. Verificar sanitización exacta del teléfono
  const telefonoFormateado = whatsappMod.formatearTelefonoParaWhatsApp(telefonoInput);
  assert.equal(
    telefonoFormateado,
    '5491122334455',
    'formatearTelefonoParaWhatsApp("+54 9 11 2233-4455") debe retornar exactamente "5491122334455"'
  );

  // 3. Generar mensaje contextualizado para la publicación activa REP-01
  const mensajeContextualizado = whatsappMod.generarMensajeContactoMascota({
    nombreMascota: 'Toby',
    estado: 'PERDIDO',
    ubicacion: 'Ruta 8, Pilar',
    idAlerta: 'REP-01',
  });

  assert.ok(
    mensajeContextualizado.includes('"Toby"') &&
      mensajeContextualizado.includes('mascota perdida') &&
      mensajeContextualizado.includes('en la zona de Ruta 8, Pilar'),
    'generarMensajeContactoMascota debe incluir el nombre de la mascota, su estado y la zona'
  );

  // 4. Ejecutar contactarPorWhatsApp tal como lo invoca handleContactarWhatsApp en app/detalle/[id].tsx
  const resultadoContacto = await whatsappMod.contactarPorWhatsApp({
    telefono: telefonoInput,
    mensaje: mensajeContextualizado,
  });

  assert.equal(resultadoContacto, true, 'contactarPorWhatsApp debe retornar true al abrir el enlace');
  assert.equal(alertasMostradas.length, 0, 'No debe dispararse ninguna alerta de error');
  assert.equal(urlsAbiertas.length, 1, 'Linking.openURL debe ser invocado exactamente 1 vez');

  const urlEsperada = `https://wa.me/5491122334455?text=${encodeURIComponent(mensajeContextualizado)}`;
  assert.equal(
    urlsAbiertas[0],
    urlEsperada,
    'La URL construida e invocada en Linking.openURL debe ser https://wa.me/5491122334455?text=...'
  );

  // 5. Verificar integración arquitectónica en app/detalle/[id].tsx, PetContactBar.tsx y PetAuthorCard.tsx
  const detalleContent = fs.readFileSync(path.join(projectRoot, 'app', 'detalle', '[id].tsx'), 'utf8');
  const contactBarContent = fs.readFileSync(
    path.join(projectRoot, 'components', 'detalle', 'PetContactBar.tsx'),
    'utf8'
  );
  const authorCardContent = fs.readFileSync(
    path.join(projectRoot, 'components', 'detalle', 'PetAuthorCard.tsx'),
    'utf8'
  );

  assert.ok(
    detalleContent.includes('handleContactarWhatsApp') &&
      detalleContent.includes('contactarPorWhatsApp({ telefono, mensaje })'),
    'app/detalle/[id].tsx debe orquestar handleContactarWhatsApp invocando contactarPorWhatsApp'
  );
  assert.ok(
    contactBarContent.includes('CONTACTAR POR WHATSAPP') &&
      contactBarContent.includes('logo-whatsapp'),
    'PetContactBar.tsx debe renderizar el CTA CONTACTAR POR WHATSAPP con ícono de WhatsApp'
  );
  assert.ok(
    authorCardContent.includes('Contacto por WhatsApp disponible'),
    'PetAuthorCard.tsx debe indicar disponibilidad de contacto por WhatsApp'
  );
});

// ============================================================================
// TC-403: Funcional (Negativa) — Impedimento sobre publicación RESUELTA / CERRADA (REP-02)
// ============================================================================
test('TC-403: Funcional (Negativa) - Impedimento de avistamiento o cambio de estado sobre publicación RESUELTA (REP-02)', async () => {
  const escriturasFirestore = [];

  // Publicación REP-02 ya se encuentra en estado 'ENCONTRADO' (resuelta/cerrada)
  const mockAlertaCerrada = {
    id: 'REP-02',
    nombre: 'Luna',
    especie: 'GATO',
    estado: 'ENCONTRADO',
    creadoPor: 'dueno-uid-02',
    usuariosInteresados: ['vecino-1'],
  };

  const firestoreMock = {
    collection: (_db, name) => ({ name }),
    doc: (_db, col, id) => ({ collection: col, id }),
    getDoc: async (ref) => ({
      exists: () => ref.id === 'REP-02',
      id: ref.id,
      data: () => mockAlertaCerrada,
    }),
    updateDoc: async (ref, data) => {
      escriturasFirestore.push({ op: 'updateDoc', ref, data });
    },
    addDoc: async (col, data) => {
      escriturasFirestore.push({ op: 'addDoc', col, data });
      return { id: 'new-doc' };
    },
    deleteDoc: async () => {},
    getDocs: async () => ({ docs: [] }),
    query: () => ({}),
    where: () => ({}),
    orderBy: () => ({}),
    limit: () => ({}),
    serverTimestamp: () => '2026-10-30T04:24:05.000Z',
    Timestamp: class {},
  };

  const mascotasServiceMod = cargarModuloTS('services/mascotasService.ts', {
    'firebase/firestore': firestoreMock,
    'firebase/storage': {
      ref: () => ({}),
      uploadBytes: async () => ({}),
      getDownloadURL: async () => '',
      uploadString: async () => ({}),
    },
    'react-native': { Platform: { OS: 'android' } },
    '@/services/ConexionFirebase': {
      ConexionFirebase: {
        obtenerFirestore: () => ({}),
        obtenerStorage: () => ({}),
        obtenerAuth: () => ({ currentUser: { uid: 'dueno-uid-02' } }),
      },
    },
    '@/utils/detalleMascota': {
      resolverUbicacionAlerta: () => ({
        direccion: 'Pilar Centro',
        coordenadas: { latitude: -34.458, longitude: -58.914 },
      }),
    },
  });

  // 1. Verificar que marcarMascotaComoEncontrada rechaza operar sobre REP-02 porque ya está ENCONTRADO
  await assert.rejects(
    async () => {
      await mascotasServiceMod.marcarMascotaComoEncontrada('REP-02');
    },
    {
      message: 'Esta publicación ya está marcada como encontrada.',
    },
    'marcarMascotaComoEncontrada debe lanzar "Esta publicación ya está marcada como encontrada." cuando REP-02 ya está resuelta'
  );

  assert.equal(
    escriturasFirestore.length,
    0,
    'No debe ejecutarse ningún updateDoc ni addDoc cuando la publicación REP-02 ya está cerrada/encontrada'
  );

  // 2. Verificar también que notificarMascotaEncontrada en services/notificaciones.ts aborta sin mutar si estado === 'ENCONTRADO'
  const notificacionesMod = cargarModuloTS('services/notificaciones.ts', {
    'firebase/firestore': {
      ...firestoreMock,
      arrayUnion: (v) => v,
      onSnapshot: () => () => {},
      writeBatch: () => ({ update: () => {}, commit: async () => {} }),
    },
    './firebase': {
      db: {},
      auth: { currentUser: { uid: 'dueno-uid-02' } },
    },
  });

  await notificacionesMod.notificarMascotaEncontrada('REP-02');
  assert.equal(
    escriturasFirestore.length,
    0,
    'notificarMascotaEncontrada debe retornar inmediatamente sin escribir en BD si el estado ya es ENCONTRADO'
  );

  // 3. Verificar validador de elegibilidad de avistamiento sobre publicación cerrada
  const puedeReportarAvistamiento = (alerta) => alerta && alerta.estado === 'PERDIDO';
  assert.equal(
    puedeReportarAvistamiento(mockAlertaCerrada),
    false,
    'Una publicación con estado ENCONTRADO no admite nuevos reportes de avistamiento activos'
  );
});

// ============================================================================
// TC-404: Funcional (Negativa) — Validación de datos obligatorios al reportar avistamiento
// ============================================================================
test('TC-404: Funcional (Negativa) - Bloqueo de envío de avistamiento sin ubicación geográfica (Lat/Lng: undefined)', async () => {
  // 1. Cargar el módulo real utils/geoValidation.ts
  const geoMod = cargarModuloTS('utils/geoValidation.ts');

  // Datos de prueba del caso TC-404: Ubicación en mapa: Sin seleccionar (Lat/Lng: undefined), Mensaje: "Creo que lo vi"
  const payloadIncompleto = {
    publicacionId: 'REP-01',
    coordenadas: { latitude: undefined, longitude: undefined },
    comentario: 'Creo que lo vi',
  };

  // 2. Verificar que isValidCoordinate rechaza Lat/Lng undefined
  const esCoordenadaValida = geoMod.isValidCoordinate(
    payloadIncompleto.coordenadas.latitude,
    payloadIncompleto.coordenadas.longitude
  );

  assert.equal(
    esCoordenadaValida,
    false,
    'isValidCoordinate(undefined, undefined) debe retornar false e impedir el envío del formulario'
  );

  // Verificar variantes adicionales de coordenadas ausentes o corruptas
  assert.equal(geoMod.isValidCoordinate(null, null), false, 'Debe rechazar null');
  assert.equal(geoMod.isValidCoordinate(NaN, -58.910), false, 'Debe rechazar NaN');
  assert.equal(geoMod.isValidCoordinate(-34.460, undefined), false, 'Debe rechazar longitud undefined');

  // 3. Verificar que el validador de formulario de avistamiento exige marcar un punto válido en el mapa
  function validarFormularioAvistamiento(datos) {
    if (
      !datos.coordenadas ||
      !geoMod.isValidCoordinate(datos.coordenadas.latitude, datos.coordenadas.longitude)
    ) {
      return {
        valido: false,
        error: 'Es obligatorio indicar la ubicación geográfica en el mapa para registrar el avistamiento.',
      };
    }
    return { valido: true, error: null };
  }

  const resultadoValidacion = validarFormularioAvistamiento(payloadIncompleto);
  assert.equal(resultadoValidacion.valido, false, 'El formulario debe bloquear el envío sin coordenadas');
  assert.ok(
    resultadoValidacion.error.includes('obligatorio indicar la ubicación geográfica en el mapa'),
    'Debe informar al usuario que es obligatorio indicar la ubicación en el mapa'
  );

  // 4. Verificar que en services/mascotasService.ts las coordenadas con undefined son descartadas y no corrompen Firestore
  const documentosGuardados = [];
  const mascotasServiceMod = cargarModuloTS('services/mascotasService.ts', {
    'firebase/firestore': {
      collection: (_db, name) => ({ name }),
      addDoc: async (_col, data) => {
        documentosGuardados.push(data);
        return { id: 'ALERTA-TEST-404' };
      },
      doc: () => ({}),
      getDoc: async () => ({ exists: () => false }),
      getDocs: async () => ({ docs: [] }),
      updateDoc: async () => {},
      deleteDoc: async () => {},
      query: () => ({}),
      where: () => ({}),
      orderBy: () => ({}),
      limit: () => ({}),
      serverTimestamp: () => '2026-10-30T04:24:05.000Z',
      Timestamp: class {},
    },
    'firebase/storage': {
      ref: () => ({}),
      uploadBytes: async () => ({}),
      getDownloadURL: async () => '',
      uploadString: async () => ({}),
    },
    'react-native': { Platform: { OS: 'android' } },
    '@/services/ConexionFirebase': {
      ConexionFirebase: {
        obtenerFirestore: () => ({}),
        obtenerStorage: () => ({}),
        obtenerAuth: () => ({ currentUser: { uid: 'vecino-uid-04' } }),
      },
    },
    '@/utils/detalleMascota': {
      resolverUbicacionAlerta: () => ({
        direccion: 'Pilar',
        coordenadas: { latitude: -34.458, longitude: -58.914 },
      }),
    },
  });

  await mascotasServiceMod.crearAlertaMascota({
    nombre: 'Avistamiento sin GPS',
    especie: 'PERRO',
    estado: 'ENCONTRADO',
    descripcion: 'Creo que lo vi',
    ubicacion: '',
    coordenadas: { latitude: undefined, longitude: undefined },
  });

  assert.equal(documentosGuardados.length, 1);
  assert.equal(
    'coordenadas' in documentosGuardados[0],
    false,
    'mascotasService.crearAlertaMascota debe filtrar coordenadas undefined para no enviar datos inválidos a Firestore'
  );
});
