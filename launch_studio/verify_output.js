#!/usr/bin/env node
/**
 * Objective Verification Script: ffprobe inspection for acceptance criteria
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targets = [
  'out/patitas_launch_typography.mp4',
  'out/patitas_launch_voiceover.mp4',
];

console.log('================================================================');
console.log('  VERIFICACIÓN OBJETIVA DE ENTREGABLES AUDIOVISUALES (FFPROBE)  ');
console.log('================================================================');

let allPassed = true;

for (const relPath of targets) {
  const fullPath = path.resolve(__dirname, relPath);
  console.log(`\nInspeccionando: ${relPath}`);

  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Archivo no encontrado: ${fullPath}`);
    allPassed = false;
    continue;
  }

  try {
    // 1. Validar Video Stream
    const videoCmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration,codec_name -of json "${fullPath}"`;
    const videoData = JSON.parse(execSync(videoCmd).toString());
    const videoInfo = videoData.streams && videoData.streams[0];

    if (!videoInfo) {
      console.error(`[FAIL] No se encontró stream de video en ${relPath}`);
      allPassed = false;
      continue;
    }

    // 2. Validar Audio Stream
    const audioCmd = `ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate,channels,codec_name -of json "${fullPath}"`;
    const audioData = JSON.parse(execSync(audioCmd).toString());
    const audioInfo = audioData.streams && audioData.streams[0];

    if (!audioInfo) {
      console.error(`[FAIL] No se encontró stream de audio en ${relPath}`);
      allPassed = false;
      continue;
    }

    const duration = parseFloat(videoInfo.duration);
    const isWidthOk = videoInfo.width === 1920;
    const isHeightOk = videoInfo.height === 1080;
    const isFpsOk = videoInfo.r_frame_rate === '60/1';
    const isDurationOk = duration >= 60.0 && duration <= 75.0;
    const isSampleRateOk = parseInt(audioInfo.sample_rate, 10) === 48000;
    const isStereoOk = parseInt(audioInfo.channels, 10) === 2;

    console.log(`  - Resolución: ${videoInfo.width}x${videoInfo.height} (Esperado: 1920x1080) -> ${isWidthOk && isHeightOk ? 'PASS' : 'FAIL'}`);
    console.log(`  - FPS: ${videoInfo.r_frame_rate} (Esperado: 60/1) -> ${isFpsOk ? 'PASS' : 'FAIL'}`);
    console.log(`  - Duración: ${duration.toFixed(2)}s (Rango permitido: 60s - 75s) -> ${isDurationOk ? 'PASS' : 'FAIL'}`);
    console.log(`  - Audio Sample Rate: ${audioInfo.sample_rate} Hz (Esperado: 48000) -> ${isSampleRateOk ? 'PASS' : 'FAIL'}`);
    console.log(`  - Canales de Audio: ${audioInfo.channels} (Esperado: 2 - Stereo) -> ${isStereoOk ? 'PASS' : 'FAIL'}`);

    if (!isWidthOk || !isHeightOk || !isFpsOk || !isDurationOk || !isSampleRateOk || !isStereoOk) {
      allPassed = false;
    }
  } catch (err) {
    console.error(`[FAIL] Error ejecutando ffprobe sobre ${relPath}:`, err.message);
    allPassed = false;
  }
}

if (!allPassed) {
  console.error('\n[RESULTADO] Verificación fallida. Uno o más criterios no se cumplieron.');
  process.exit(1);
} else {
  console.log('\n================================================================');
  console.log('  ¡TODOS LOS CRITERIOS TÉCNICOS CUMPLIDOS AL 100%!              ');
  console.log('================================================================');
}
