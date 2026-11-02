import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

// ============================================================================
// 1. CONTRATOS (types/Auth.ts)
// ============================================================================
test('contratos: types/Auth.ts define interfaces para el cambio de contraseña y su modal', () => {
  const filePath = path.join(projectRoot, 'types', 'Auth.ts');
  assert.ok(fs.existsSync(filePath), 'types/Auth.ts debe existir');

  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('export interface CambiarContraseniaPayload'), 'Debe exportar CambiarContraseniaPayload');
  assert.ok(content.includes('contraseniaActual: string'), 'Debe incluir contraseniaActual');
  assert.ok(content.includes('nuevaContrasenia: string'), 'Debe incluir nuevaContrasenia');
  assert.ok(content.includes('confirmarContrasenia: string'), 'Debe incluir confirmarContrasenia');

  assert.ok(content.includes('export interface CambiarContraseniaModalProps'), 'Debe exportar CambiarContraseniaModalProps');
  assert.ok(content.includes('visible: boolean'), 'Debe incluir prop visible');
  assert.ok(content.includes('alCerrar: () => void'), 'Debe incluir callback alCerrar');
  assert.ok(content.includes('emailUsuario?: string | null'), 'Debe incluir emailUsuario opcional');
});

// ============================================================================
// 2. CAPA DE SERVICIO (services/AuthContext.tsx)
// ============================================================================
test('servicio: AuthContext expone cambiarContrasenia y enviarCorreoRestablecimiento con Firebase Auth', () => {
  const filePath = path.join(projectRoot, 'services', 'AuthContext.tsx');
  assert.ok(fs.existsSync(filePath), 'services/AuthContext.tsx debe existir');

  const content = fs.readFileSync(filePath, 'utf8');

  // Métodos de Firebase Auth
  assert.ok(content.includes('EmailAuthProvider'), 'Debe importar EmailAuthProvider');
  assert.ok(content.includes('reauthenticateWithCredential'), 'Debe importar reauthenticateWithCredential');
  assert.ok(content.includes('updatePassword'), 'Debe importar updatePassword');
  assert.ok(content.includes('sendPasswordResetEmail'), 'Debe importar sendPasswordResetEmail');

  // Tipado en AuthContextType
  assert.ok(
    content.includes('cambiarContrasenia: (contraseniaActual: string, nuevaContrasenia: string) => Promise<void>'),
    'AuthContextType debe tipar cambiarContrasenia'
  );
  assert.ok(
    content.includes('enviarCorreoRestablecimiento: (email?: string) => Promise<void>'),
    'AuthContextType debe tipar enviarCorreoRestablecimiento'
  );

  // Implementación
  assert.ok(content.includes('const cambiarContrasenia = async'), 'Debe implementar la función cambiarContrasenia');
  assert.ok(content.includes('const enviarCorreoRestablecimiento = async'), 'Debe implementar enviarCorreoRestablecimiento');
  assert.ok(content.includes('EmailAuthProvider.credential'), 'Debe re-autenticar con credencial de email');
  assert.ok(content.includes('updatePassword(usuarioActual, nuevaContrasenia)'), 'Debe actualizar contraseña con updatePassword');
});

// ============================================================================
// 3. COMPONENTE MODULAR (components/ajustes/CambiarContraseniaModal.tsx)
// ============================================================================
test('componente: CambiarContraseniaModal implementa formulario seguro, visibilidad y validación', () => {
  const filePath = path.join(projectRoot, 'components', 'ajustes', 'CambiarContraseniaModal.tsx');
  assert.ok(fs.existsSync(filePath), 'CambiarContraseniaModal.tsx debe existir');

  const content = fs.readFileSync(filePath, 'utf8');

  // Integración con useAuth
  assert.ok(content.includes('useAuth'), 'Debe consumir useAuth');
  assert.ok(content.includes('cambiarContrasenia'), 'Debe usar cambiarContrasenia');
  assert.ok(content.includes('enviarCorreoRestablecimiento'), 'Debe usar enviarCorreoRestablecimiento');

  // Validaciones clave
  assert.ok(content.includes('nuevaContrasenia.length < 6'), 'Debe validar longitud mínima de 6 caracteres');
  assert.ok(content.includes('nuevaContrasenia === contraseniaActual'), 'Debe evitar usar la misma contraseña actual');
  assert.ok(content.includes('nuevaContrasenia !== confirmarContrasenia'), 'Debe validar coincidencia de contraseñas');

  // Accesibilidad y visibilidad
  assert.ok(content.includes('secureTextEntry'), 'Debe soportar secureTextEntry');
  assert.ok(content.includes('eye-outline') && content.includes('eye-off-outline'), 'Debe alternar iconos de visibilidad');
  assert.ok(content.includes('ActivityIndicator'), 'Debe mostrar indicador de carga');

  // Cero console.log
  assert.ok(!content.includes('console.log'), 'No debe contener console.log');
});

// ============================================================================
// 4. VISTA ORQUESTADORA (app/ajustes.tsx)
// ============================================================================
test('pantalla: app/ajustes.tsx conecta el botón con CambiarContraseniaModal y maneja logout', () => {
  const filePath = path.join(projectRoot, 'app', 'ajustes.tsx');
  assert.ok(fs.existsSync(filePath), 'app/ajustes.tsx debe existir');

  const content = fs.readFileSync(filePath, 'utf8');

  // Conexión del modal
  assert.ok(content.includes('CambiarContraseniaModal'), 'Debe importar y renderizar CambiarContraseniaModal');
  assert.ok(content.includes('setMostrarModalContrasenia(true)'), 'El botón debe abrir el modal al presionarlo');
  assert.ok(content.includes('emailUsuario={usuario?.email}'), 'Debe pasar el email del usuario logueado al modal');

  // Cierre de sesión seguro
  assert.ok(content.includes('cerrarSesion'), 'Debe usar cerrarSesion desde useAuth');

  // Cero console.log
  assert.ok(!content.includes('console.log'), 'No debe contener console.log');
});

// ============================================================================
// 5. DESACOPLAMIENTO DE NOTIFICACIONES PUSH (services/notificaciones.ts & pushNotificationsAdapter.ts)
// ============================================================================
test('arquitectura: services/notificaciones.ts está desacoplado de módulos nativos en el arranque y delega en pushNotificationsAdapter.ts', () => {
  const notifPath = path.join(projectRoot, 'services', 'notificaciones.ts');
  const adapterPath = path.join(projectRoot, 'services', 'pushNotificationsAdapter.ts');

  assert.ok(fs.existsSync(notifPath), 'services/notificaciones.ts debe existir');
  assert.ok(fs.existsSync(adapterPath), 'services/pushNotificationsAdapter.ts debe existir');

  const notifContent = fs.readFileSync(notifPath, 'utf8');
  const adapterContent = fs.readFileSync(adapterPath, 'utf8');

  // Prohibido importar el barril completo expo-notifications o expo-device en top-level de notificaciones.ts
  assert.ok(
    !notifContent.includes('from "expo-notifications"') && !notifContent.includes("from 'expo-notifications'"),
    'services/notificaciones.ts no debe importar el barril expo-notifications en top-level (evita fallo ExpoTopicSubscriptionModule)'
  );
  assert.ok(
    !notifContent.includes('from "expo-device"') && !notifContent.includes("from 'expo-device'"),
    'services/notificaciones.ts no debe importar expo-device en top-level'
  );
  assert.ok(
    notifContent.includes('obtenerExpoPushTokenSeguro'),
    'services/notificaciones.ts debe delegar en obtenerExpoPushTokenSeguro'
  );

  // El adaptador debe validar módulos nativos de forma segura y no tener console.log
  assert.ok(
    adapterContent.includes('soportaPushNativoEnDispositivo'),
    'pushNotificationsAdapter.ts debe exportar soportaPushNativoEnDispositivo'
  );
  assert.ok(
    adapterContent.includes('ExpoNotificationPermissionsModule') && adapterContent.includes('ExpoPushTokenManager'),
    'pushNotificationsAdapter.ts debe verificar disponibilidad de módulos nativos antes de requerirlos'
  );
  assert.ok(!adapterContent.includes('console.log'), 'pushNotificationsAdapter.ts no debe contener console.log');
});

