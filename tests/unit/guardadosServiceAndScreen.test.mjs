import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('guardados: contratos y lógica de negocio en mascotasService', async () => {
  const servicePath = path.resolve('services/mascotasService.ts');
  const serviceCode = fs.readFileSync(servicePath, 'utf8');

  // 1. Validar que mascotasService exporte las funciones necesarias para guardados
  assert.ok(
    serviceCode.includes('export async function guardarPublicacion'),
    'mascotasService debe exportar guardarPublicacion'
  );
  assert.ok(
    serviceCode.includes('export async function quitarPublicacionGuardada'),
    'mascotasService debe exportar quitarPublicacionGuardada'
  );
  assert.ok(
    serviceCode.includes('export async function obtenerIdsPublicacionesGuardadas'),
    'mascotasService debe exportar obtenerIdsPublicacionesGuardadas'
  );
  assert.ok(
    serviceCode.includes('export async function obtenerPublicacionesGuardadas'),
    'mascotasService debe exportar obtenerPublicacionesGuardadas'
  );

  // 2. Validar que las funciones acepten el parámetro opcional idUsuario para desacoplamiento y testing
  assert.ok(
    serviceCode.includes('idUsuario?: string'),
    'Las funciones de guardado deben admitir idUsuario opcional'
  );
});

test('guardados: verificación de la pantalla app/(tabs)/guardados.tsx', async () => {
  const screenPath = path.resolve('app/(tabs)/guardados.tsx');
  const screenCode = fs.readFileSync(screenPath, 'utf8');

  // 1. Debe integrar useAuth para sincronización reactiva con Firebase Auth
  assert.ok(
    screenCode.includes('useAuth'),
    'GuardadosScreen debe consumir useAuth para sincronización reactiva'
  );

  // 2. Debe implementar selector dual de pestañas (Guardadas vs Mis Publicaciones/Alertas)
  assert.ok(
    screenCode.includes('TabGuardados'),
    'Debe definir el tipo TabGuardados'
  );
  assert.ok(
    screenCode.includes('tabActiva'),
    'Debe manejar el estado tabActiva'
  );
  assert.ok(
    screenCode.includes('listarAlertasPorUsuario'),
    'Debe consumir listarAlertasPorUsuario para mostrar las publicaciones creadas por el usuario'
  );

  // 3. Navegación hacia detalle de mascota
  assert.ok(
    screenCode.includes('/detalle/'),
    'Las tarjetas deben permitir navegación directa a /detalle/[id]'
  );

  // 4. Insets seguros y Design System
  assert.ok(
    screenCode.includes('useSafeAreaInsets'),
    'Debe usar useSafeAreaInsets para proteger contra la barra de botones de Android'
  );
  assert.ok(
    screenCode.includes('TabBarMetrics'),
    'Debe incorporar TabBarMetrics para espaciado consistente'
  );

  // 5. Cero console.log
  assert.ok(
    !screenCode.includes('console.log') && !screenCode.includes('console.error'),
    'GuardadosScreen no debe contener llamadas a console.log o console.error'
  );
});
