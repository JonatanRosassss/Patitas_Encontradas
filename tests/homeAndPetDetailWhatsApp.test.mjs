import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

// ============================================================================
// 1. WHATSAPP UTILITY CONTRACT & ALGORITHM TESTS
// ============================================================================

test('whatsapp: contract and phone sanitization algorithms for wa.me', () => {
  const whatsappPath = path.join(projectRoot, 'utils', 'whatsapp.ts');
  assert.ok(fs.existsSync(whatsappPath), 'utils/whatsapp.ts must exist');

  const content = fs.readFileSync(whatsappPath, 'utf8');

  // Verify exports
  assert.ok(
    content.includes('export function formatearTelefonoParaWhatsApp'),
    'utils/whatsapp.ts must export formatearTelefonoParaWhatsApp'
  );
  assert.ok(
    content.includes('export function generarMensajeContactoMascota'),
    'utils/whatsapp.ts must export generarMensajeContactoMascota'
  );
  assert.ok(
    content.includes('export async function contactarPorWhatsApp'),
    'utils/whatsapp.ts must export contactarPorWhatsApp'
  );
  assert.ok(
    content.includes('https://wa.me/'),
    'utils/whatsapp.ts must construct wa.me universal URLs'
  );

  // Zero console.log
  assert.ok(
    !content.includes('console.log'),
    'utils/whatsapp.ts must NOT contain console.log'
  );

  // Test the sanitization algorithm directly
  function formatearTelefonoParaWhatsApp(telefono) {
    let numeros = telefono.replace(/\D/g, '');
    if (!numeros) return '';
    if (numeros.startsWith('0')) numeros = numeros.substring(1);
    if (numeros.startsWith('1115') && numeros.length === 10) numeros = '11' + numeros.substring(4);
    if (numeros.startsWith('549')) return numeros;
    if (numeros.startsWith('54') && !numeros.startsWith('549')) return '549' + numeros.substring(2);
    if (numeros.length === 10) return `549${numeros}`;
    if (numeros.length >= 8 && numeros.length <= 11) return `549${numeros}`;
    return numeros;
  }

  assert.equal(formatearTelefonoParaWhatsApp('11 2233-4455'), '5491122334455');
  assert.equal(formatearTelefonoParaWhatsApp('011 2233 4455'), '5491122334455');
  assert.equal(formatearTelefonoParaWhatsApp('1115223344'), '54911223344');
  assert.equal(formatearTelefonoParaWhatsApp('+54 9 11 2233-4455'), '5491122334455');
  assert.equal(formatearTelefonoParaWhatsApp('+54 11 2233-4455'), '5491122334455');
  assert.equal(formatearTelefonoParaWhatsApp(''), '');
});

// ============================================================================
// 2. MASCOTAS SERVICE ENHANCEMENTS
// ============================================================================

test('service: mascotasService exports obtenerAlertaConUsuarioPorId and formatearTiempoRelativo', () => {
  const servicePath = path.join(projectRoot, 'services', 'mascotasService.ts');
  assert.ok(fs.existsSync(servicePath), 'services/mascotasService.ts must exist');

  const content = fs.readFileSync(servicePath, 'utf8');

  assert.ok(
    content.includes('export async function obtenerAlertaConUsuarioPorId'),
    'mascotasService must export obtenerAlertaConUsuarioPorId'
  );
  assert.ok(
    content.includes('export function formatearTiempoRelativo'),
    'mascotasService must export formatearTiempoRelativo'
  );
  assert.ok(
    content.includes('obtenerAlertaPorId(idAlerta)'),
    'obtenerAlertaConUsuarioPorId must invoke obtenerAlertaPorId'
  );
  assert.ok(
    !content.includes('console.log'),
    'services/mascotasService.ts must NOT contain console.log'
  );
});

// ============================================================================
// 3. HOME SCREEN DATABASE & NAVIGATION ARCHITECTURE
// ============================================================================

test('home screen: connects to Firestore and routes to pet detail screen', () => {
  const homePath = path.join(projectRoot, 'app', '(tabs)', 'index.tsx');
  assert.ok(fs.existsSync(homePath), 'app/(tabs)/index.tsx must exist');

  const content = fs.readFileSync(homePath, 'utf8');

  // Firestore DB integration
  assert.ok(
    content.includes('listarTodasLasAlertas()'),
    'Home must invoke listarTodasLasAlertas() from Firestore'
  );

  // RefreshControl
  assert.ok(
    content.includes('RefreshControl'),
    'Home must implement pull-to-refresh'
  );

  // Detail Navigation
  assert.ok(
    content.includes('/detalle/'),
    'Home must route to /detalle/[id] on pet selection'
  );

  // Cleanliness: zero console.log
  assert.ok(
    !content.includes('console.log'),
    'index.tsx must NOT contain console.log'
  );
});

// ============================================================================
// 4. PET DETAIL & WHATSAPP REDIRECTION SCREEN ARCHITECTURE
// ============================================================================

test('detail screen: app/detalle/[id].tsx connects to Firestore and redirects to WhatsApp', () => {
  const detailPath = path.join(projectRoot, 'app', 'detalle', '[id].tsx');
  assert.ok(fs.existsSync(detailPath), 'app/detalle/[id].tsx must exist');

  const content = fs.readFileSync(detailPath, 'utf8');

  // Fetch from DB
  assert.ok(
    content.includes('obtenerAlertaConUsuarioPorId') || content.includes('obtenerAlertaPorId'),
    'Detail screen must fetch pet data from mascotasService'
  );

  // WhatsApp Redirection
  assert.ok(
    content.includes('contactarPorWhatsApp') || content.includes('Linking.openURL'),
    'Detail screen must implement WhatsApp redirection'
  );

  // Must handle loading and error states
  assert.ok(
    content.includes('ActivityIndicator'),
    'Detail screen must implement loading indicator'
  );
  assert.ok(
    content.includes('ExpoLinking.createURL'),
    'Detail sharing must include an app link for the alert'
  );
  assert.ok(
    content.includes('`/mapa?alertaId=') &&
      content.includes('Ver en el mapa de la app') &&
      !content.includes('openstreetmap.org'),
    'Detail sharing must link to the in-app map without an external map link'
  );
  assert.ok(
    content.includes('isValidCoordinate'),
    'Detail sharing must only include the map link when alert coordinates are valid'
  );

  // Design Tokens: uses Colors and Typography from theme
  assert.ok(
    content.includes('Colors.') && content.includes('Typography.'),
    'Detail screen must use design system tokens'
  );

  // Cleanliness: zero console.log
  assert.ok(
    !content.includes('console.log'),
    'app/detalle/[id].tsx must NOT contain console.log'
  );
});

test('map screen: deep link selects the alert after map points finish loading', () => {
  const mapStatePath = path.join(projectRoot, 'hooks', 'useMapState.ts');
  assert.ok(fs.existsSync(mapStatePath), 'hooks/useMapState.ts must exist');

  const content = fs.readFileSync(mapStatePath, 'utf8');
  assert.ok(
    content.includes('useLocalSearchParams') && content.includes('alertaId'),
    'Map screen must read the alert ID from the deep link'
  );
  assert.ok(
    content.includes('puntosCargados') &&
      content.includes('filteredPets.find((pet) => pet.id === alertaId)'),
    'Map screen must wait for loaded points and find the requested alert'
  );
  assert.ok(
    content.includes('setSelectedPet(alerta)'),
    'Map screen must select the requested alert marker'
  );
});
