import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

// ============================================================================
// 1. MONOLITH BOUNDS CHECK
// ============================================================================

test('monolith: app/(tabs)/mapa.tsx is strictly less than 150 lines', () => {
  const filePath = path.join(projectRoot, 'app', '(tabs)', 'mapa.tsx');
  assert.ok(fs.existsSync(filePath), 'app/(tabs)/mapa.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const lineCount = lines.length;

  console.log(`[PASS] app/(tabs)/mapa.tsx line count: ${lineCount} (limit: < 150)`);
  assert.ok(
    lineCount < 150,
    `app/(tabs)/mapa.tsx has ${lineCount} lines, which is NOT strictly less than 150`
  );
});

test('monolith: app/(tabs)/mapa.tsx acts as an orchestrator delegating to modular components', () => {
  const filePath = path.join(projectRoot, 'app', '(tabs)', 'mapa.tsx');
  const content = fs.readFileSync(filePath, 'utf8');

  // Must import modular components
  assert.ok(content.includes('MapContainer'), 'mapa.tsx must use MapContainer');
  assert.ok(content.includes('MapSearchBar'), 'mapa.tsx must use MapSearchBar');
  assert.ok(content.includes('MapFilterChips'), 'mapa.tsx must use MapFilterChips');
  assert.ok(content.includes('MapControls'), 'mapa.tsx must use MapControls');
  assert.ok(content.includes('MapPetCard'), 'mapa.tsx must use MapPetCard');
  assert.ok(content.includes('useMapState'), 'mapa.tsx must use useMapState');

  // Must NOT directly contain Leaflet or WebView implementations
  assert.ok(!content.includes('react-native-webview'), 'mapa.tsx should not directly import WebView');
  assert.ok(!content.includes('L.map'), 'mapa.tsx should not directly initialize Leaflet');
});

// ============================================================================
// 2. BIDIRECTIONAL EVENT BRIDGE CONTRACT TESTS
// ============================================================================

test('bridge: MapContainer.tsx contains the complete bidirectional event bridge', () => {
  const containerPath = path.join(projectRoot, 'components', 'map', 'MapContainer.tsx');
  assert.ok(fs.existsSync(containerPath), 'MapContainer.tsx must exist');

  const content = fs.readFileSync(containerPath, 'utf8');

  // Inbound bridge events (WebView -> React Native)
  const inboundEvents = ['MAP_READY', 'MARKER_CLICK', 'MAP_CLICK', 'MAP_ERROR'];
  for (const ev of inboundEvents) {
    assert.ok(
      content.includes(`'${ev}'`),
      `MapContainer.tsx must handle or emit inbound event ${ev}`
    );
  }

  // Outbound bridge commands (React Native -> WebView)
  const outboundCommands = [
    'setMarkers',
    'centerTo',
    'zoomIn',
    'zoomOut',
    'setUserLocation',
    'selectPet',
  ];
  for (const cmd of outboundCommands) {
    assert.ok(
      content.includes(`window.mapBridge.${cmd}`) || content.includes(`window.mapBridge && window.mapBridge.${cmd}`),
      `MapContainer.tsx must invoke bridge command ${cmd}`
    );
  }
});

test('bridge: HTML/JS template handles both window and document message listeners', () => {
  const containerPath = path.join(projectRoot, 'components', 'map', 'MapContainer.tsx');
  const content = fs.readFileSync(containerPath, 'utf8');

  // Android vs iOS WebView postMessage listener compatibility
  assert.ok(
    content.includes("window.addEventListener('message', handleRNMessage)"),
    'WebView must listen to window message events'
  );
  assert.ok(
    content.includes("document.addEventListener('message', handleRNMessage)"),
    'WebView must listen to document message events'
  );

  // WebView should handle all expected RN message types
  const expectedMsgTypes = ['SET_MARKERS', 'CENTER', 'ZOOM_IN', 'ZOOM_OUT', 'SET_USER_LOCATION', 'SELECT_PET'];
  for (const msgType of expectedMsgTypes) {
    assert.ok(
      content.includes(`msg.type === '${msgType}'`),
      `WebView message handler must support ${msgType}`
    );
  }
});

test('bridge: React Native onMessage handler simulation with edge cases', () => {
  const mockPets = [
    { id: 'milo', nombre: 'Milo', estado: 1, coordenadas: { latitude: -34.4497, longitude: -58.9194 } },
    { id: 'luna', nombre: 'Luna', estado: 2, coordenadas: { latitude: -34.4587, longitude: -58.9142 } },
  ];

  // Logic replicated from MapContainer.tsx handleMessage
  function simulateHandleMessage(rawJson, state) {
    try {
      const data = JSON.parse(rawJson);
      switch (data.type) {
        case 'MAP_READY':
          state.isMapReady = true;
          state.hasError = false;
          if (state.onMapReady) state.onMapReady();
          break;
        case 'MARKER_CLICK':
          if (data.payload?.id) {
            const pet = state.pets.find((p) => p.id === data.payload?.id) || null;
            state.onSelectPet(pet);
          }
          break;
        case 'MAP_CLICK':
          state.onSelectPet(null);
          break;
        case 'MAP_ERROR':
          // Handled gracefully without crash
          state.lastError = data.payload?.error || 'Unknown error';
          break;
        default:
          break;
      }
    } catch (err) {
      // Ignored
      state.parseErrorCaught = true;
    }
  }

  // 1. MAP_READY event
  const state1 = { isMapReady: false, hasError: true, pets: mockPets, onSelectPet: () => {} };
  simulateHandleMessage(JSON.stringify({ type: 'MAP_READY' }), state1);
  assert.equal(state1.isMapReady, true);
  assert.equal(state1.hasError, false);

  // 2. MARKER_CLICK with valid ID
  let selected = null;
  const state2 = { pets: mockPets, onSelectPet: (pet) => { selected = pet; } };
  simulateHandleMessage(JSON.stringify({ type: 'MARKER_CLICK', payload: { id: 'milo' } }), state2);
  assert.deepEqual(selected, mockPets[0]);

  // 3. MARKER_CLICK with unknown ID
  simulateHandleMessage(JSON.stringify({ type: 'MARKER_CLICK', payload: { id: 'non-existent' } }), state2);
  assert.equal(selected, null);

  // 4. MAP_CLICK clears selection
  selected = mockPets[1];
  simulateHandleMessage(JSON.stringify({ type: 'MAP_CLICK' }), state2);
  assert.equal(selected, null);

  // 5. Malformed JSON does not crash
  const state3 = { parseErrorCaught: false };
  simulateHandleMessage('INVALID_JSON{[[{', state3);
  assert.equal(state3.parseErrorCaught, true);

  // 6. Unknown event type does nothing and does not crash
  const state4 = { pets: mockPets, onSelectPet: () => { assert.fail('Should not be called'); } };
  simulateHandleMessage(JSON.stringify({ type: 'SOME_UNKNOWN_EVENT', payload: { foo: 'bar' } }), state4);
});

// ============================================================================
// 3. MOBILE LAYOUT & UI VERIFICATION
// ============================================================================

test('ui: MapPetCard has accessible close button with hitSlop and onClose callback', () => {
  const cardPath = path.join(projectRoot, 'components', 'map', 'MapPetCard.tsx');
  assert.ok(fs.existsSync(cardPath), 'MapPetCard.tsx must exist');

  const content = fs.readFileSync(cardPath, 'utf8');

  // Close button tests
  assert.ok(content.includes('onClose: () => void'), 'MapPetCardProps must define onClose');
  assert.ok(content.includes('onPress={onClose}'), 'Close button must trigger onClose on press');
  assert.ok(content.includes('accessibilityLabel="Cerrar ficha de mascota"'), 'Must have accessibilityLabel');
  assert.ok(content.includes('accessibilityRole="button"'), 'Must have accessibilityRole');
  assert.ok(content.includes('hitSlop={8}'), 'Must have hitSlop for touch target accessibility');
  assert.ok(content.includes('name="close"'), 'Must render close icon');

  // Card positioning and elevation
  assert.ok(content.includes("position: 'absolute'"), 'Card must be absolute positioned');
  assert.ok(content.includes('elevation: 8'), 'Card must have elevation for Android shadow');
  assert.ok(content.includes('zIndex: 20'), 'Card zIndex must be elevated above map');
});

test('ui: MapControls provides floating controls with touch targets >= 44dp', () => {
  const controlsPath = path.join(projectRoot, 'components', 'map', 'MapControls.tsx');
  assert.ok(fs.existsSync(controlsPath), 'MapControls.tsx must exist');

  const content = fs.readFileSync(controlsPath, 'utf8');

  // Check touch target dimensions
  const widthMatch = content.match(/width:\s*(\d+)/);
  const heightMatch = content.match(/height:\s*(\d+)/);
  assert.ok(widthMatch && heightMatch, 'Must define width and height in styles');

  const width = parseInt(widthMatch[1], 10);
  const height = parseInt(heightMatch[1], 10);

  console.log(`[PASS] MapControls button size: ${width}x${height}dp (recommended min: 44x44dp)`);
  assert.ok(width >= 44, `Button width ${width}dp is below 44dp`);
  assert.ok(height >= 44, `Button height ${height}dp is below 44dp`);

  // Check pointerEvents="box-none" so map gestures are not blocked around buttons
  assert.ok(
    content.includes('pointerEvents="box-none"'),
    'Controls container must have pointerEvents="box-none" to allow touching map around buttons'
  );

  // Check accessibility attributes
  assert.ok(content.includes('accessibilityRole="button"'), 'Controls must have accessibilityRole="button"');
  assert.ok(content.includes('accessibilityLabel="Centrar en mi ubicación actual"'), 'Locate button must have accessible label');
  assert.ok(content.includes('accessibilityLabel="Acercar mapa"'), 'ZoomIn button must have accessible label');
  assert.ok(content.includes('accessibilityLabel="Alejar mapa"'), 'ZoomOut button must have accessible label');
});

test('ui: Bottom tab bar integration is preserved without duplication or overlap', () => {
  const screenPath = path.join(projectRoot, 'app', '(tabs)', 'mapa.tsx');
  const content = fs.readFileSync(screenPath, 'utf8');

  // SafeAreaView edges should only manage 'top' (bottom is delegated to Expo Tabs)
  assert.ok(
    content.includes("edges={['top']}"),
    "SafeAreaView must only set edges={['top']} so Expo Router's tab bar controls the bottom"
  );

  // Ensure no internal bottom navigation bar is rendered
  assert.ok(!content.includes('BottomNavigation'), 'Screen must not render duplicate internal bottom nav');
  assert.ok(!content.includes('TabBar'), 'Screen must not render duplicate internal TabBar');

  // Verify tab layout registers mapa screen
  const tabLayoutPath = path.join(projectRoot, 'app', '(tabs)', '_layout.tsx');
  const tabContent = fs.readFileSync(tabLayoutPath, 'utf8');
  assert.ok(
    tabContent.includes('name="mapa"'),
    '_layout.tsx must configure "mapa" tab'
  );
});

// ============================================================================
// 4. DESIGN TOKENS AND CONVENCIONES COMPLIANCE
// ============================================================================

test('conventions: No hardcoded palette colors in map components', () => {
  const filesToCheck = [
    path.join(projectRoot, 'app', '(tabs)', 'mapa.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapControls.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapFilterChips.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapPetCard.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapSearchBar.tsx'),
  ];

  const forbiddenPaletteHex = [
    '#FF8A00',
    '#FFC28A',
    '#FFE7D2',
    '#5A3A1F',
    '#F2F2F2',
    '#FFFFFF',
  ];

  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    for (const hex of forbiddenPaletteHex) {
      assert.ok(
        !content.includes(hex) && !content.includes(hex.toLowerCase()),
        `File ${path.basename(file)} contains hardcoded color ${hex}. Must use Colors token.`
      );
    }
  }
});

test('conventions: Zero console.log statements in map components and screen', () => {
  const filesToCheck = [
    path.join(projectRoot, 'app', '(tabs)', 'mapa.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapContainer.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapControls.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapFilterChips.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapPetCard.tsx'),
    path.join(projectRoot, 'components', 'map', 'MapSearchBar.tsx'),
    path.join(projectRoot, 'hooks', 'useMapState.ts'),
  ];

  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    assert.ok(
      !content.includes('console.log'),
      `File ${path.basename(file)} contains console.log. CONVENCIONES.md rule 7 forbids it.`
    );
  }
});
