import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

test('map points: useMapState integrates listarAlertasParaMapa from mascotasService', () => {
  const hookPath = path.join(projectRoot, 'hooks', 'useMapState.ts');
  assert.ok(fs.existsSync(hookPath), 'hooks/useMapState.ts must exist');

  const content = fs.readFileSync(hookPath, 'utf8');

  // Must import listarAlertasParaMapa
  assert.ok(
    content.includes('listarAlertasParaMapa'),
    'useMapState.ts must import and use listarAlertasParaMapa'
  );

  // Must call listarAlertasParaMapa
  assert.ok(
    content.includes('await listarAlertasParaMapa()'),
    'useMapState.ts must invoke listarAlertasParaMapa()'
  );

  // Must have zero console.log
  assert.ok(
    !content.includes('console.log'),
    'useMapState.ts must NOT contain console.log'
  );
});

test('service: listarAlertasParaMapa maps Firestore alertas to valid MapPet points', () => {
  const servicePath = path.join(projectRoot, 'services', 'mascotasService.ts');
  assert.ok(fs.existsSync(servicePath), 'services/mascotasService.ts must exist');

  const content = fs.readFileSync(servicePath, 'utf8');

  assert.ok(
    content.includes('export async function listarAlertasParaMapa'),
    'mascotasService.ts must export listarAlertasParaMapa'
  );
  assert.ok(
    content.includes("pet.estado === 'ENCONTRADO' ? 2 : 1"),
    'Must map business state to map PetState (1=Perdido, 2=Encontrado)'
  );
});
