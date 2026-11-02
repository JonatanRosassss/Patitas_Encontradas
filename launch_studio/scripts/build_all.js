#!/usr/bin/env node
/**
 * Build Script: Deterministic Compilation for Patitas Encontradas Launch Studio
 * Compiles both Version A (Typography) and Version B (Voiceover) to launch_studio/out/
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'out');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('================================================================');
console.log('  PATITAS ENCONTRADAS — REMOTION DETERMINISTIC RENDER PIPELINE  ');
console.log('================================================================');
console.log(`Working directory: ${rootDir}`);
console.log(`Output directory:  ${outDir}\n`);

const compositions = [
  {
    id: 'PatitasLaunchTypography',
    output: path.join(outDir, 'patitas_launch_typography.mp4'),
    label: 'Versión A (Música + SFX + Tipografía Cinética)',
  },
  {
    id: 'PatitasLaunchVoiceover',
    output: path.join(outDir, 'patitas_launch_voiceover.mp4'),
    label: 'Versión B (Música + SFX + Locución Institucional)',
  },
];

let hasErrors = false;

for (const comp of compositions) {
  console.log(`\n>>> RENDERIZANDO: ${comp.label}`);
  console.log(`    Composición ID: ${comp.id}`);
  console.log(`    Destino:        ${comp.output}`);

  const startTime = Date.now();
  const cmd = `npx remotion render src/index.ts ${comp.id} "${comp.output}"`;

  try {
    execSync(cmd, {
      cwd: rootDir,
      stdio: 'inherit',
    });
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[PASS] Completado en ${elapsed}s: ${comp.output}`);
  } catch (err) {
    console.error(`[FAIL] Error renderizando ${comp.id}:`, err.message);
    hasErrors = true;
    break;
  }
}

if (hasErrors) {
  console.error('\n[ERROR] El pipeline de compilación finalizó con errores.');
  process.exit(1);
} else {
  console.log('\n================================================================');
  console.log('  ¡COMPILACIÓN DE AMBAS VERSIONES FINALIZADA CON ÉXITO!        ');
  console.log('================================================================');
}
