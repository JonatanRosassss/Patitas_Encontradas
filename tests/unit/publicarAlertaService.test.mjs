import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

// ============================================================================
// 1. RECURSIVE UNDEFINED SANITIZATION & COORDINATE SAFETY IN MASCOTAS SERVICE
// ============================================================================

test('mascotasService: limpiarUndefined logic strips undefined and corrupt coordinates safely', () => {
  const servicePath = path.join(projectRoot, 'services', 'mascotasService.ts');
  assert.ok(fs.existsSync(servicePath), 'services/mascotasService.ts must exist');

  const content = fs.readFileSync(servicePath, 'utf8');

  // Must export crearAlertaMascota
  assert.ok(
    content.includes('export async function crearAlertaMascota'),
    'Must export crearAlertaMascota'
  );

  // Must target the canonical 'alertas' collection
  assert.ok(
    content.includes("const COLECCION_ALERTAS = 'alertas';") || content.includes("'alertas'"),
    "Must target 'alertas' collection"
  );

  const inicioCrearAlerta = content.indexOf('export async function crearAlertaMascota');
  const finCrearAlerta = content.indexOf('export async function modificarAlertaMascota', inicioCrearAlerta);
  const crearAlerta = content.slice(inicioCrearAlerta, finCrearAlerta);
  assert.match(
    crearAlerta,
    /const usuario = auth\.currentUser;\s*if \(!usuario\)\s*\{\s*throw new Error/
  );
  assert.ok(
    crearAlerta.includes('creadoPor: usuario.uid'),
    'Published alerts must always belong to the authenticated user'
  );
  assert.ok(
    !crearAlerta.includes("'anonimo'"),
    'Unauthenticated users must not be able to create alerts'
  );

  // Must NOT target obsolete 'Mascota' collection
  assert.ok(
    !content.includes("'Mascota'"),
    "Must NOT target obsolete 'Mascota' collection"
  );

  // Must contain recursive undefined cleaning
  assert.ok(
    content.includes('limpiarUndefined') && content.includes('typeof value === \'object\''),
    'limpiarUndefined must support recursive deep cleaning of nested objects'
  );

  // Must sanitize coordinates to avoid non-numeric/undefined coordinates reaching Firestore
  assert.ok(
    content.includes('typeof coordenadasValidas.latitude !== \'number\'') ||
    content.includes('!Number.isFinite'),
    'crearAlertaMascota must validate numerical and finite coordinates'
  );

  // Zero console.log
  assert.ok(
    !content.includes('console.log'),
    'services/mascotasService.ts must NOT contain console.log'
  );
});

// ============================================================================
// 2. PUBLICAR-ALERTA SCREEN ARCHITECTURE & GEOCODING INTEGRATION
// ============================================================================

test('publicar-alerta screen: adheres to clean architecture, delegates to service, and avoids undefined fields', () => {
  const screenPath = path.join(projectRoot, 'app', '(tabs)', 'publicar-alerta.tsx');
  assert.ok(fs.existsSync(screenPath), 'app/(tabs)/publicar-alerta.tsx must exist');

  const content = fs.readFileSync(screenPath, 'utf8');

  // Must NOT do direct raw Firestore calls in UI
  assert.ok(
    !content.includes("from 'firebase/firestore'"),
    'Must NOT import from firebase/firestore in UI component'
  );
  assert.ok(
    !content.includes('addDoc('),
    'Must NOT call addDoc directly in UI component'
  );
  assert.ok(
    !content.includes("collection(db.firestore, 'Mascota')"),
    'Must NOT directly instantiate Mascota collection in UI'
  );

  // Must delegate to crearAlertaMascota service
  assert.ok(
    content.includes("import { crearAlertaMascota } from '@/services/mascotasService';") ||
    content.includes('crearAlertaMascota'),
    'Must import and use crearAlertaMascota from service layer'
  );
  assert.ok(
    content.includes('await crearAlertaMascota('),
    'Must invoke crearAlertaMascota with await'
  );
  assert.ok(
    content.includes('if (!usuario)') && content.includes("router.replace('/(auth)/login')"),
    'Unauthenticated visitors must be redirected to login instead of seeing the publication form'
  );

  // Must NOT have unawaited setTimeout wrapping Firestore write
  assert.ok(
    !content.includes('setTimeout(() => {'),
    'Must NOT wrap Firestore write in unawaited setTimeout'
  );

  // Must NOT assign coordenadas: undefined, contacto: undefined, creadoPor: undefined
  assert.ok(
    !content.includes('coordenadas: undefined'),
    'Must NOT explicitly assign coordenadas: undefined'
  );
  assert.ok(
    !content.includes('contacto: undefined'),
    'Must NOT explicitly assign contacto: undefined'
  );
  assert.ok(
    !content.includes('creadoPor: undefined'),
    'Must NOT explicitly assign creadoPor: undefined'
  );

  // Must have geocoding and presets integration
  assert.ok(
    content.includes('geocodificarDireccion') && content.includes('ZONAS_PILAR_PRESETS'),
    'Must integrate geocodificarDireccion and ZONAS_PILAR_PRESETS'
  );

  // Must have ActivityIndicator loading state during submission
  assert.ok(
    content.includes('ActivityIndicator'),
    'Must include ActivityIndicator during publication'
  );

  // Zero any
  const anyMatches = content.match(/:\s*any\b/g) || [];
  assert.equal(
    anyMatches.length,
    0,
    `Found "any" types in publicar-alerta.tsx: ${anyMatches.length}`
  );

  // Zero console.log
  assert.ok(
    !content.includes('console.log'),
    'publicar-alerta.tsx must NOT contain console.log'
  );

  // Zero hardcoded hex colors
  const hexMatches = content.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  assert.equal(
    hexMatches.length,
    0,
    `Found hardcoded hex colors in publicar-alerta.tsx: ${hexMatches.join(', ')}`
  );
});

// ============================================================================
// 3. GEOCODING SERVICE & PILAR PRESETS CHECK
// ============================================================================

test('geocodingService: defines presets and exports geocodificarDireccion', () => {
  const filePath = path.join(projectRoot, 'services', 'geocodingService.ts');
  assert.ok(fs.existsSync(filePath), 'services/geocodingService.ts must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  assert.ok(
    content.includes('export const ZONAS_PILAR_PRESETS'),
    'Must export ZONAS_PILAR_PRESETS'
  );
  assert.ok(
    content.includes('export async function geocodificarDireccion'),
    'Must export geocodificarDireccion'
  );

  // Check known landmark coordinates
  assert.ok(content.includes('-34.4587'), 'Must include Plaza 12 de Octubre latitude');
  assert.ok(content.includes('-58.9142'), 'Must include Plaza 12 de Octubre longitude');
  assert.ok(content.includes('-34.4497'), 'Must include Barrio Champagnat latitude');
});

// ============================================================================
// 4. PERFIL SCREEN DELETION WITH WEB COMPATIBILITY
// ============================================================================

test('perfil screen: deletion works on both web and native', () => {
  const filePath = path.join(projectRoot, 'app', '(tabs)', 'perfil.tsx');
  assert.ok(fs.existsSync(filePath), 'app/(tabs)/perfil.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // Must handle web confirmation
  assert.ok(
    content.includes("Platform.OS === 'web'") && content.includes('window.confirm'),
    'Must handle window.confirm on Platform.OS === web'
  );

  // Must call eliminarAlertaMascota
  assert.ok(
    content.includes('await eliminarAlertaMascota('),
    'Must invoke eliminarAlertaMascota'
  );
});

// ============================================================================
// 5. HOME SCREEN FIREBASE FEED INTEGRATION
// ============================================================================

test('home screen: loads live alerts from Firestore with pull-to-refresh', () => {
  const filePath = path.join(projectRoot, 'app', '(tabs)', 'index.tsx');
  assert.ok(fs.existsSync(filePath), 'app/(tabs)/index.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // Must import and invoke listarTodasLasAlertas
  assert.ok(
    content.includes("from '@/services/mascotasService'"),
    'Must import from mascotasService'
  );
  assert.ok(
    content.includes('await listarTodasLasAlertas()'),
    'Must fetch live alerts using listarTodasLasAlertas()'
  );

  // Must have refreshControl
  assert.ok(
    content.includes('refreshControl=') && content.includes('RefreshControl'),
    'FlatList must include RefreshControl'
  );

  // Zero console.log
  assert.ok(
    !content.includes('console.log'),
    'index.tsx must NOT contain console.log'
  );
});
