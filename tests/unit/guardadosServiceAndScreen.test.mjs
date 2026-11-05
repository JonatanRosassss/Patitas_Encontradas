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

test('zustand: store global useAlertasStore sincroniza alertas y guardados entre pantallas', async () => {
  const storePath = path.resolve('store/useAlertasStore.ts');
  const typesPath = path.resolve('types/AlertasStore.ts');
  const petCardPath = path.resolve('components/ui/pet-card.tsx');
  const indexPath = path.resolve('app/(tabs)/index.tsx');
  const guardadosPath = path.resolve('app/(tabs)/guardados.tsx');
  const perfilPath = path.resolve('app/(tabs)/perfil.tsx');
  const mapHookPath = path.resolve('hooks/useMapState.ts');

  assert.ok(fs.existsSync(storePath), 'store/useAlertasStore.ts debe existir');
  assert.ok(fs.existsSync(typesPath), 'types/AlertasStore.ts debe existir');

  const storeCode = fs.readFileSync(storePath, 'utf8');
  const petCardCode = fs.readFileSync(petCardPath, 'utf8');
  const indexCode = fs.readFileSync(indexPath, 'utf8');
  const guardadosCode = fs.readFileSync(guardadosPath, 'utf8');
  const perfilCode = fs.readFileSync(perfilPath, 'utf8');
  const mapHookCode = fs.readFileSync(mapHookPath, 'utf8');

  assert.ok(
    storeCode.includes("from 'zustand'"),
    'useAlertasStore debe utilizar la librería zustand'
  );
  assert.ok(
    storeCode.includes('sincronizarIdsGuardadas') &&
      storeCode.includes('alternarGuardadoStore') &&
      storeCode.includes('quitarGuardadoLocal') &&
      storeCode.includes('actualizarEstadoLocal') &&
      storeCode.includes('eliminarAlertaLocal'),
    'useAlertasStore debe exponer las acciones reactivas de alertas y guardados'
  );
  assert.ok(
    petCardCode.includes('useAlertasStore'),
    'PetCard debe consumir useAlertasStore para evitar consultas N+1 por tarjeta'
  );
  assert.ok(
    indexCode.includes('useAlertasStore') &&
      guardadosCode.includes('useAlertasStore') &&
      perfilCode.includes('useAlertasStore') &&
      mapHookCode.includes('useAlertasStore'),
    'Home, Guardados, Perfil y Mapa deben estar suscritos a useAlertasStore'
  );
});

