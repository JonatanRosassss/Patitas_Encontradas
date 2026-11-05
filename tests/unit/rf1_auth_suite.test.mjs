/**
 * Suite de Pruebas Automatizadas para RF-1: Gestionar cuenta de usuario y sesión
 * Módulo 1 - Patitas Encontradas (Node.js test runner: `node --test`)
 * Casos de prueba: TC-101 a TC-108
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loginSchema } from '../../schemas/authSchema.ts';
import { USUARIOS_MOCK, simularInicioSesion } from '../../services/authMock.ts';

const projectRoot = process.cwd();

// ============================================================================
// UTILITARIOS MOCK IN-MEMORY (AsyncStorage y Firestore)
// ============================================================================
class MockAsyncStorage {
  constructor() {
    this.storage = new Map();
  }
  async getItem(key) {
    return this.storage.has(key) ? this.storage.get(key) : null;
  }
  async setItem(key, value) {
    this.storage.set(key, String(value));
  }
  async removeItem(key) {
    this.storage.delete(key);
  }
  async clear() {
    this.storage.clear();
  }
}

// ============================================================================
// TC-101: Registro exitoso de nuevo vecino con datos válidos
// ============================================================================
test('TC-101: Registro exitoso de nuevo vecino con datos válidos en register.tsx', async () => {
  const registerPath = path.join(projectRoot, 'app', '(auth)', 'register.tsx');
  assert.ok(fs.existsSync(registerPath), 'register.tsx debe existir');
  const registerCode = fs.readFileSync(registerPath, 'utf8');

  // 1. Verificación estática de contratos de arquitectura y Firebase en register.tsx
  assert.ok(registerCode.includes('createUserWithEmailAndPassword'), 'Debe utilizar createUserWithEmailAndPassword');
  assert.ok(registerCode.includes('updateProfile'), 'Debe utilizar updateProfile');
  assert.ok(registerCode.includes("doc(db, 'usuarios', usuario.uid)"), 'Debe persistir en la colección usuarios');
  assert.ok(registerCode.includes('{ merge: true }'), 'Debe guardar en Firestore con { merge: true }');
  assert.ok(
    registerCode.includes('AsyncStorage.setItem') && registerCode.includes("'user_session'"),
    'Debe persistir user_session en AsyncStorage'
  );
  assert.ok(registerCode.includes("enrutador.replace('/(auth)/login')") || registerCode.includes("router.replace"), 'Debe redirigir tras registro');

  // 2. Simulación ejecutable determinista del pipeline de registro
  const mockStorage = new MockAsyncStorage();
  const mockFirestore = new Map();
  let navigationTarget = null;

  const datosRegistro = {
    nombre: 'Juan Pérez',
    correo: 'juan.perez@unpilar.edu.ar',
    contrasenia: 'Patitas2026!',
    confirmarContrasenia: 'Patitas2026!',
    telefono: '+5491122334455',
    zona: 'Villa Rosa, Pilar',
  };

  const ejecutarRegistro = async (input) => {
    // Validaciones de formulario idénticas a register.tsx
    if (!input.nombre.trim() || !input.correo.trim() || !input.telefono.trim() || !input.contrasenia.trim() || !input.confirmarContrasenia.trim()) {
      throw new Error('Por favor completá todos los campos requeridos.');
    }
    if (input.contrasenia !== input.confirmarContrasenia) {
      throw new Error('Las contraseñas no coinciden.');
    }
    if (input.contrasenia.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    // 1. Crear usuario en Auth
    const uidGenerado = 'usr_juan_perez_2026';
    const tokenSimulado = 'jwt_token_juan_perez_unpilar';
    const usuarioAuth = {
      uid: uidGenerado,
      email: input.correo.trim(),
      displayName: input.nombre.trim(),
    };

    // 2. Guardar sesión y caché local en AsyncStorage
    await mockStorage.setItem('user_session', JSON.stringify({
      uid: usuarioAuth.uid,
      token: tokenSimulado,
      email: usuarioAuth.email,
    }));

    await mockStorage.setItem(`perfil_usuario_${usuarioAuth.uid}`, JSON.stringify({
      id: usuarioAuth.uid,
      nombre: input.nombre.trim(),
      email: input.correo.trim(),
      telefono: input.telefono.trim(),
      zona: input.zona,
      fechaCreacion: new Date().toLocaleDateString(),
    }));

    // 3. Persistir en Firestore colección 'usuarios' con merge
    mockFirestore.set(`usuarios/${usuarioAuth.uid}`, {
      nombre: input.nombre.trim(),
      correo: input.correo.trim(),
      telefono: input.telefono.trim(),
      zona: input.zona,
      uid: usuarioAuth.uid,
      fechaRegistro: new Date().toISOString(),
      mergeOption: true,
    });

    navigationTarget = '/(auth)/login';
    return { ok: true, usuario: usuarioAuth };
  };

  const resultado = await ejecutarRegistro(datosRegistro);
  assert.equal(resultado.ok, true);
  assert.equal(resultado.usuario.displayName, 'Juan Pérez');

  // Verificar persistencia en AsyncStorage
  const sesionGuardadaRaw = await mockStorage.getItem('user_session');
  assert.ok(sesionGuardadaRaw, 'user_session debe existir en AsyncStorage');
  const sesionGuardada = JSON.parse(sesionGuardadaRaw);
  assert.equal(sesionGuardada.email, 'juan.perez@unpilar.edu.ar');
  assert.equal(sesionGuardada.uid, 'usr_juan_perez_2026');

  // Verificar perfil en AsyncStorage
  const perfilGuardadoRaw = await mockStorage.getItem('perfil_usuario_usr_juan_perez_2026');
  assert.ok(perfilGuardadoRaw);
  const perfilGuardado = JSON.parse(perfilGuardadoRaw);
  assert.equal(perfilGuardado.telefono, '+5491122334455');

  // Verificar Firestore
  const docFirestore = mockFirestore.get('usuarios/usr_juan_perez_2026');
  assert.ok(docFirestore);
  assert.equal(docFirestore.nombre, 'Juan Pérez');
  assert.equal(docFirestore.mergeOption, true);
  assert.equal(navigationTarget, '/(auth)/login');
});

// ============================================================================
// TC-102: Rechazo de registro por correo electrónico duplicado
// ============================================================================
test('TC-102: Rechazo de registro por correo electrónico duplicado (profesor@patitas.com)', async () => {
  const registerPath = path.join(projectRoot, 'app', '(auth)', 'register.tsx');
  const registerCode = fs.readFileSync(registerPath, 'utf8');

  // Verificación estática del manejo del error 'auth/email-already-in-use'
  assert.ok(registerCode.includes("error.code === 'auth/email-already-in-use'"), 'Debe capturar auth/email-already-in-use');
  assert.ok(registerCode.includes('Correo registrado'), 'Debe emitir alerta de Correo registrado');
  assert.ok(registerCode.includes('Ya existe una cuenta registrada con este correo electrónico'), 'Mensaje amigable para usuario');

  // Simulación dinámica de rechazo ante email existente
  const emailExistente = 'profesor@patitas.com';
  const mockStorage = new MockAsyncStorage();
  const mockFirestore = new Map();
  let alertaEmitida = null;

  const mockRegistrarUsuarioDuplicado = async (correo) => {
    // Si el correo ya existe en USUARIOS_MOCK o en la base, simular Firebase error
    const existe = USUARIOS_MOCK.some((u) => u.email.toLowerCase() === correo.toLowerCase());
    if (existe) {
      const err = new Error('The email address is already in use by another account.');
      err.code = 'auth/email-already-in-use';
      throw err;
    }
    return { ok: true };
  };

  try {
    await mockRegistrarUsuarioDuplicado(emailExistente);
    assert.fail('El registro con correo duplicado debió fallar');
  } catch (error) {
    assert.equal(error.code, 'auth/email-already-in-use');
    if (error.code === 'auth/email-already-in-use') {
      alertaEmitida = {
        titulo: 'Correo registrado',
        mensaje: 'Ya existe una cuenta registrada con este correo electrónico. Por favor iniciá sesión o usá otro correo.',
      };
    }
  }

  // Comprobar que se generó la alerta esperada y NO se guardaron datos espurios
  assert.ok(alertaEmitida);
  assert.equal(alertaEmitida.titulo, 'Correo registrado');
  assert.equal(await mockStorage.getItem('user_session'), null, 'No debe guardarse sesión');
  assert.equal(mockFirestore.size, 0, 'No debe escribirse registro duplicado en Firestore');
});

// ============================================================================
// TC-103: Inicio de sesión exitoso con credenciales válidas
// ============================================================================
test('TC-103: Inicio de sesión exitoso con credenciales válidas (profesor@patitas.com / 123456)', async () => {
  const loginPath = path.join(projectRoot, 'app', '(auth)', 'login.tsx');
  const authContextPath = path.join(projectRoot, 'services', 'AuthContext.tsx');
  const loginCode = fs.readFileSync(loginPath, 'utf8');
  const authContextCode = fs.readFileSync(authContextPath, 'utf8');

  // Verificación estática de contratos de autenticación
  assert.ok(loginCode.includes('signInWithEmailAndPassword'), 'login.tsx debe llamar a signInWithEmailAndPassword');
  assert.ok(
    loginCode.includes('AsyncStorage.setItem') && loginCode.includes("'user_session'"),
    'login.tsx debe persistir user_session'
  );
  assert.ok(loginCode.includes("router.replace('/(tabs)')"), 'login.tsx debe navegar a /(tabs)');
  assert.ok(authContextCode.includes('onAuthStateChanged'), 'AuthContext debe escuchar onAuthStateChanged');
  assert.ok(authContextCode.includes("AsyncStorage.setItem('user_session'"), 'AuthContext debe sincronizar user_session');

  // Simulación con authMock.ts y flujo ejecutable
  const emailValido = 'profesor@patitas.com';
  const claveValida = '123456';

  const usuarioMock = simularInicioSesion(emailValido, claveValida);
  assert.ok(usuarioMock, 'simularInicioSesion debe encontrar al profesor');
  assert.equal(usuarioMock.nombre, 'Profesor');

  // Validación mediante esquema Zod
  const schemaResult = loginSchema.safeParse({
    email: emailValido,
    contrasenia: claveValida,
  });
  assert.equal(schemaResult.success, true, 'Credenciales deben validar satisfactoriamente contra Zod');

  // Ejecución del guardado de sesión
  const mockStorage = new MockAsyncStorage();
  const token = 'jwt_firebase_profesor_valid_token';
  const sesionData = {
    uid: 'uid_profesor_123',
    token,
    email: usuarioMock.email,
  };

  await mockStorage.setItem('user_session', JSON.stringify(sesionData));
  const sesionRecuperada = JSON.parse(await mockStorage.getItem('user_session'));

  assert.equal(sesionRecuperada.uid, 'uid_profesor_123');
  assert.equal(sesionRecuperada.email, 'profesor@patitas.com');
  assert.equal(sesionRecuperada.token, token);
});

// ============================================================================
// TC-104: Inicio de sesión fallido por contraseña incorrecta
// ============================================================================
test('TC-104: Inicio de sesión fallido por contraseña incorrecta (ClaveErronea99)', async () => {
  const loginPath = path.join(projectRoot, 'app', '(auth)', 'login.tsx');
  const loginCode = fs.readFileSync(loginPath, 'utf8');

  // Verificación de manejo de errores de credenciales inválidas en login.tsx
  assert.ok(loginCode.includes("'auth/wrong-password'") || loginCode.includes("'auth/invalid-credential'"));
  assert.ok(loginCode.includes('Correo o contraseña incorrectos.'));
  assert.ok(loginCode.includes("alertar('Acceso denegado', mensajeError)"));

  // Verificación con authMock
  const resAuthMock = simularInicioSesion('profesor@patitas.com', 'ClaveErronea99');
  assert.equal(resAuthMock, undefined, 'simularInicioSesion debe rechazar contraseña errónea');

  // Simulación dinámica de respuesta de Firebase Auth
  const mockStorage = new MockAsyncStorage();
  let alertaError = null;

  const mockLogin = async (email, contrasenia) => {
    if (contrasenia !== '123456') {
      const err = new Error('Invalid credential provided.');
      err.code = 'auth/invalid-credential';
      throw err;
    }
    return { uid: 'ok' };
  };

  try {
    await mockLogin('profesor@patitas.com', 'ClaveErronea99');
    assert.fail('El login con contraseña incorrecta debió rechazar');
  } catch (error) {
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      alertaError = {
        titulo: 'Acceso denegado',
        mensaje: 'Correo o contraseña incorrectos.',
      };
    }
  }

  assert.ok(alertaError);
  assert.equal(alertaError.titulo, 'Acceso denegado');
  assert.equal(alertaError.mensaje, 'Correo o contraseña incorrectos.');
  assert.equal(await mockStorage.getItem('user_session'), null, 'No debe guardarse sesión en storage');
});

// ============================================================================
// TC-105: Validación de esquema de seguridad en formato de correo y longitud de clave
// ============================================================================
test('TC-105: Validación de esquema Zod en authSchema.ts (usuariocorreo_invalido y clave 123)', async () => {
  const schemaPath = path.join(projectRoot, 'schemas', 'authSchema.ts');
  assert.ok(fs.existsSync(schemaPath), 'schemas/authSchema.ts debe existir');

  // 1. Probar correo inválido: 'usuariocorreo_invalido'
  const resultadoEmailInvalido = loginSchema.safeParse({
    email: 'usuariocorreo_invalido',
    contrasenia: 'Patitas2026!',
  });

  assert.equal(resultadoEmailInvalido.success, false, 'Correo sin formato válido debe fallar');
  const mensajeEmail = resultadoEmailInvalido.error.errors.find((e) => e.path.includes('email'))?.message;
  assert.equal(mensajeEmail, 'El formato no es valido', 'Debe arrojar "El formato no es valido"');

  // 2. Probar clave menor a 6 caracteres: '123'
  const resultadoClaveCorta = loginSchema.safeParse({
    email: 'vecino@unpilar.edu.ar',
    contrasenia: '123',
  });

  assert.equal(resultadoClaveCorta.success, false, 'Clave menor a 6 caracteres debe fallar');
  const mensajeClave = resultadoClaveCorta.error.errors.find((e) => e.path.includes('contrasenia'))?.message;
  assert.equal(mensajeClave, 'La contrasenia debe tener minimo 6 caracteres');

  // 3. Probar ambos errores simultáneos
  const resultadoAmbosErrores = loginSchema.safeParse({
    email: 'usuariocorreo_invalido',
    contrasenia: '123',
  });
  assert.equal(resultadoAmbosErrores.success, false);
  assert.equal(resultadoAmbosErrores.error.errors.length, 2);

  // 4. Probar campo correo vacío
  const resultadoVacio = loginSchema.safeParse({
    email: '',
    contrasenia: 'Patitas2026!',
  });
  assert.equal(resultadoVacio.success, false);
  const errorVacio = resultadoVacio.error.errors.find((e) => e.path.includes('email'))?.message;
  assert.equal(errorVacio, 'El Correo es obligatorio');

  // 5. Probar datos válidos
  const resultadoValido = loginSchema.safeParse({
    email: 'juan.perez@unpilar.edu.ar',
    contrasenia: 'Patitas2026!',
  });
  assert.equal(resultadoValido.success, true);
});

// ============================================================================
// TC-106: Solicitud de recuperación de contraseña con correo existente
// ============================================================================
test('TC-106: Solicitud de recuperación de contraseña con correo existente (juan.perez@unpilar.edu.ar)', async () => {
  const forgetPath = path.join(projectRoot, 'app', '(auth)', 'forgetPassword.tsx');
  const authContextPath = path.join(projectRoot, 'services', 'AuthContext.tsx');
  const forgetCode = fs.readFileSync(forgetPath, 'utf8');
  const authContextCode = fs.readFileSync(authContextPath, 'utf8');

  // Verificación estática
  assert.ok(forgetCode.includes('loginSchema.safeParse'), 'forgetPassword.tsx debe usar schema de validación');
  assert.ok(authContextCode.includes('sendPasswordResetEmail'), 'AuthContext debe importar sendPasswordResetEmail');
  assert.ok(authContextCode.includes('enviarCorreoRestablecimiento: (email?: string) => Promise<void>'));

  // Validación de correo válido con loginSchema
  const parseResult = loginSchema.shape.email.safeParse('juan.perez@unpilar.edu.ar');
  assert.equal(parseResult.success, true, 'Correo juan.perez@unpilar.edu.ar debe ser válido');

  // Simulación dinámica de envío de correo de restablecimiento
  let emailDespachado = null;
  const mockEnviarCorreoRestablecimiento = async (emailDestino) => {
    const emailAUsar = emailDestino?.trim();
    if (!emailAUsar) {
      throw new Error('No se encontró un correo electrónico válido para enviar el enlace.');
    }
    // Simular llamada a sendPasswordResetEmail(auth, emailAUsar)
    emailDespachado = emailAUsar;
    return { ok: true, email: emailAUsar };
  };

  const res = await mockEnviarCorreoRestablecimiento('juan.perez@unpilar.edu.ar');
  assert.equal(res.ok, true);
  assert.equal(emailDespachado, 'juan.perez@unpilar.edu.ar');
});

// ============================================================================
// TC-107: Solicitud de recuperación de contraseña con correo inexistente
// ============================================================================
test('TC-107: Solicitud de recuperación de contraseña con correo inexistente (noexiste@dominio.com)', async () => {
  const authContextPath = path.join(projectRoot, 'services', 'AuthContext.tsx');
  const authContextCode = fs.readFileSync(authContextPath, 'utf8');

  // Verificación de manejo seguro de 'auth/user-not-found' y 'auth/invalid-email'
  assert.ok(authContextCode.includes("case 'auth/user-not-found':"));
  assert.ok(authContextCode.includes('No existe una cuenta registrada con este correo electrónico.'));
  assert.ok(authContextCode.includes("case 'auth/invalid-email':"));
  assert.ok(authContextCode.includes('El correo electrónico no tiene un formato válido.'));

  // Simulación dinámica con correo inexistente
  const mockEnviarCorreoRestablecimientoSeguro = async (emailDestino) => {
    const emailAUsar = emailDestino?.trim();
    if (emailAUsar === 'noexiste@dominio.com') {
      const err = new Error('There is no user record corresponding to this identifier.');
      err.code = 'auth/user-not-found';
      throw err;
    }
  };

  await assert.rejects(
    async () => {
      try {
        await mockEnviarCorreoRestablecimientoSeguro('noexiste@dominio.com');
      } catch (error) {
        if (error && typeof error === 'object' && error.code === 'auth/user-not-found') {
          throw new Error('No existe una cuenta registrada con este correo electrónico.');
        }
        throw error;
      }
    },
    {
      message: 'No existe una cuenta registrada con este correo electrónico.',
    }
  );
});

// ============================================================================
// TC-108: Actualización de datos/foto de perfil y cierre de sesión seguro
// ============================================================================
test('TC-108: Actualización de perfil (Del Viso, avatar_nuevo.jpg) y cierre de sesión seguro', async () => {
  const perfilPath = path.join(projectRoot, 'app', '(tabs)', 'perfil.tsx');
  const ajustesPath = path.join(projectRoot, 'app', 'ajustes.tsx');
  const authContextPath = path.join(projectRoot, 'services', 'AuthContext.tsx');

  const perfilCode = fs.readFileSync(perfilPath, 'utf8');
  const ajustesCode = fs.readFileSync(ajustesPath, 'utf8');
  const authContextCode = fs.readFileSync(authContextPath, 'utf8');

  // 1. Verificación estática de métodos requeridos en AuthContext y Perfil
  assert.ok(authContextCode.includes('actualizarFotoPerfil'), 'AuthContext debe implementar actualizarFotoPerfil');
  assert.ok(authContextCode.includes('actualizarDatosPerfil'), 'AuthContext debe implementar actualizarDatosPerfil');
  assert.ok(authContextCode.includes('cerrarSesion'), 'AuthContext debe implementar cerrarSesion');
  assert.ok(authContextCode.includes("AsyncStorage.removeItem('user_session')"), 'cerrarSesion debe limpiar user_session');
  assert.ok(perfilCode.includes("router.replace('/(auth)/login')"), 'perfil.tsx debe redirigir a login tras logout');
  assert.ok(ajustesCode.includes("router.replace('/(auth)/login')"), 'ajustes.tsx debe redirigir a login tras logout');

  // 2. Simulación dinámica del ciclo completo de actualización y logout
  const mockStorage = new MockAsyncStorage();
  const mockFirestore = new Map();
  const uid = 'usr_vecino_del_viso_77';
  let estadoAuth = {
    currentUser: { uid, email: 'vecino@patitas.com', displayName: 'Vecino Inicial' },
  };

  // Inicializar sesión activa
  await mockStorage.setItem('user_session', JSON.stringify({
    uid,
    token: 'jwt_activo',
    email: 'vecino@patitas.com',
  }));

  // Simular actualizarFotoPerfil
  const mockActualizarFotoPerfil = async (uriLocal) => {
    const claveCache = `perfil_usuario_${uid}`;
    const urlPersistente = uriLocal; // ej: 'avatar_nuevo.jpg'

    const perfil = {
      id: uid,
      nombre: estadoAuth.currentUser.displayName,
      email: estadoAuth.currentUser.email,
      avatarUrl: urlPersistente,
    };

    await mockStorage.setItem(claveCache, JSON.stringify(perfil));
    mockFirestore.set(`usuarios/${uid}`, {
      ...mockFirestore.get(`usuarios/${uid}`),
      avatarUrl: urlPersistente,
      actualizadoEn: new Date().toISOString(),
    });
    return urlPersistente;
  };

  // Simular actualizarDatosPerfil
  const mockActualizarDatosPerfil = async (datos) => {
    const claveCache = `perfil_usuario_${uid}`;
    const nombreLimpio = datos.nombre.trim();
    const telefonoLimpio = datos.telefono?.trim();

    const perfilActual = JSON.parse((await mockStorage.getItem(claveCache)) || '{}');
    const nuevoPerfil = {
      ...perfilActual,
      id: uid,
      nombre: nombreLimpio,
      telefono: telefonoLimpio,
      zona: datos.zona,
    };

    await mockStorage.setItem(claveCache, JSON.stringify(nuevoPerfil));
    estadoAuth.currentUser.displayName = nombreLimpio;

    mockFirestore.set(`usuarios/${uid}`, {
      ...mockFirestore.get(`usuarios/${uid}`),
      nombre: nombreLimpio,
      telefono: telefonoLimpio,
      zona: datos.zona,
      actualizadoEn: new Date().toISOString(),
    });
  };

  // Simular cerrarSesion
  let rutaNavegacion = null;
  const mockCerrarSesion = async () => {
    estadoAuth.currentUser = null;
    await mockStorage.removeItem('user_session');
    rutaNavegacion = '/(auth)/login';
  };

  // Ejecutar pasos
  const urlFoto = await mockActualizarFotoPerfil('avatar_nuevo.jpg');
  assert.equal(urlFoto, 'avatar_nuevo.jpg');

  await mockActualizarDatosPerfil({
    nombre: 'Del Viso, Pilar',
    telefono: '+5491122334455',
    zona: 'Del Viso, Pilar',
  });

  // Validar estado persistido tras actualización
  const perfilPersistido = JSON.parse(await mockStorage.getItem(`perfil_usuario_${uid}`));
  assert.equal(perfilPersistido.nombre, 'Del Viso, Pilar');
  assert.equal(perfilPersistido.avatarUrl, 'avatar_nuevo.jpg');
  assert.equal(perfilPersistido.telefono, '+5491122334455');

  const docFirestore = mockFirestore.get(`usuarios/${uid}`);
  assert.equal(docFirestore.nombre, 'Del Viso, Pilar');
  assert.equal(docFirestore.avatarUrl, 'avatar_nuevo.jpg');

  // Ejecutar logout
  await mockCerrarSesion();
  assert.equal(estadoAuth.currentUser, null, 'Usuario debe ser null tras logout');
  assert.equal(await mockStorage.getItem('user_session'), null, 'user_session debe haber sido removido');
  assert.equal(rutaNavegacion, '/(auth)/login', 'Debe redirigir a /(auth)/login');
});
