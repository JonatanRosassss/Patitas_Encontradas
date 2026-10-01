import test from 'node:test';
import assert from 'node:assert/strict';

// Logic under test (matches utils/geoValidation.ts)
function isValidCoordinate(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Number.isNaN(lat) || Number.isNaN(lng)) {
    return false;
  }
  if (lat < -90 || lat > 90) {
    return false;
  }
  if (lng < -180 || lng > 180) {
    return false;
  }
  return true;
}

// Filtering algorithm from hooks/useMapState.ts
function filterPets(pets, filtro, searchQuery) {
  const query = searchQuery.trim().toLowerCase();

  return pets.filter((pet) => {
    if (!pet.coordenadas || !isValidCoordinate(pet.coordenadas.latitude, pet.coordenadas.longitude)) {
      return false;
    }

    if (filtro !== 0 && pet.estado !== filtro) {
      return false;
    }

    if (query.length > 0) {
      const matchesName = (pet.nombre || '').toLowerCase().includes(query);
      const matchesLocation = (pet.ubicacion || '').toLowerCase().includes(query);
      const matchesDescription = (pet.descripcion || '').toLowerCase().includes(query);
      if (!matchesName && !matchesLocation && !matchesDescription) {
        return false;
      }
    }

    return true;
  });
}

const MOCK_PETS = [
  {
    id: 'milo',
    nombre: 'Milo',
    estado: 1, // Perdido
    descripcion: 'Caniche Toy · Macho',
    ubicacion: 'Barrio Champagnat, Pilar',
    coordenadas: { latitude: -34.4497, longitude: -58.9194 },
  },
  {
    id: 'luna',
    nombre: 'Luna',
    estado: 2, // Encontrado
    descripcion: 'Mestiza · Hembra',
    ubicacion: 'Plaza 12 de Octubre, Pilar',
    coordenadas: { latitude: -34.4587, longitude: -58.9142 },
  },
];

// ==========================================
// 1. COORDINATE STRESS TESTS (Edge Cases)
// ==========================================

test('stress: exact boundaries of Earth coordinate system are valid', () => {
  assert.equal(isValidCoordinate(90, 180), true);
  assert.equal(isValidCoordinate(90, -180), true);
  assert.equal(isValidCoordinate(-90, 180), true);
  assert.equal(isValidCoordinate(-90, -180), true);
  assert.equal(isValidCoordinate(0, 0), true);
  assert.equal(isValidCoordinate(-0, +0), true);
});

test('stress: epsilon breaches of coordinate boundaries are rejected', () => {
  assert.equal(isValidCoordinate(90.0000000000001, 0), false);
  assert.equal(isValidCoordinate(-90.0000000000001, 0), false);
  assert.equal(isValidCoordinate(0, 180.0000000000001), false);
  assert.equal(isValidCoordinate(0, -180.0000000000001), false);
  assert.equal(isValidCoordinate(90.00001, 180), false);
  assert.equal(isValidCoordinate(-90, -180.00001), false);
});

test('stress: extreme numeric overshoots', () => {
  assert.equal(isValidCoordinate(91, 0), false);
  assert.equal(isValidCoordinate(-91, 0), false);
  assert.equal(isValidCoordinate(0, 181), false);
  assert.equal(isValidCoordinate(0, -181), false);
  assert.equal(isValidCoordinate(1000, -1000), false);
  assert.equal(isValidCoordinate(Number.MAX_VALUE, 0), false);
  assert.equal(isValidCoordinate(-Number.MAX_VALUE, 0), false);
  assert.equal(isValidCoordinate(0, Number.MAX_VALUE), false);
  assert.equal(isValidCoordinate(0, -Number.MAX_VALUE), false);
  assert.equal(isValidCoordinate(Number.MAX_SAFE_INTEGER, 0), false);
});

test('stress: IEEE 754 non-finite values (NaN, Infinity, -Infinity)', () => {
  assert.equal(isValidCoordinate(NaN, 0), false);
  assert.equal(isValidCoordinate(0, NaN), false);
  assert.equal(isValidCoordinate(NaN, NaN), false);
  assert.equal(isValidCoordinate(Infinity, 0), false);
  assert.equal(isValidCoordinate(-Infinity, 0), false);
  assert.equal(isValidCoordinate(0, Infinity), false);
  assert.equal(isValidCoordinate(0, -Infinity), false);
  assert.equal(isValidCoordinate(Infinity, Infinity), false);
  assert.equal(isValidCoordinate(-Infinity, -Infinity), false);
  assert.equal(isValidCoordinate(NaN, Infinity), false);
});

test('stress: null, undefined, void, and missing parameters', () => {
  assert.equal(isValidCoordinate(null, 0), false);
  assert.equal(isValidCoordinate(0, null), false);
  assert.equal(isValidCoordinate(null, null), false);
  assert.equal(isValidCoordinate(undefined, 0), false);
  assert.equal(isValidCoordinate(0, undefined), false);
  assert.equal(isValidCoordinate(undefined, undefined), false);
  assert.equal(isValidCoordinate(), false);
  assert.equal(isValidCoordinate(0), false);
});

test('stress: string inputs (including numeric strings and malicious payloads)', () => {
  assert.equal(isValidCoordinate("0", "0"), false);
  assert.equal(isValidCoordinate("-34.4586", "-58.9142"), false);
  assert.equal(isValidCoordinate("NaN", 0), false);
  assert.equal(isValidCoordinate("<script>alert(1)</script>", 0), false);
  assert.equal(isValidCoordinate("", ""), false);
  assert.equal(isValidCoordinate(" ", " "), false);
});

test('stress: complex objects, arrays, functions, and booleans', () => {
  assert.equal(isValidCoordinate({}, {}), false);
  assert.equal(isValidCoordinate([], []), false);
  assert.equal(isValidCoordinate([1], [2]), false);
  assert.equal(isValidCoordinate(true, false), false);
  assert.equal(isValidCoordinate(false, 0), false);
  assert.equal(isValidCoordinate(() => 0, 0), false);
  assert.equal(isValidCoordinate(Symbol('lat'), 0), false);
});

test('stress: small valid floating point numbers near zero', () => {
  assert.equal(isValidCoordinate(0.0000001, 0.0000001), true);
  assert.equal(isValidCoordinate(-0.0000001, -0.0000001), true);
  assert.equal(isValidCoordinate(Number.MIN_VALUE, Number.MIN_VALUE), true);
});

// ==========================================
// 2. FILTERING LOGIC EMPIRICAL VERIFICATION
// ==========================================

test('filter: estado 0 (Todos) returns all pets with valid coordinates', () => {
  const result = filterPets(MOCK_PETS, 0, '');
  assert.equal(result.length, 2);
  assert.deepEqual(result.map(p => p.id), ['milo', 'luna']);
});

test('filter: estado 1 (Perdidos) returns only Milo', () => {
  const result = filterPets(MOCK_PETS, 1, '');
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'milo');
  assert.equal(result[0].estado, 1);
});

test('filter: estado 2 (Encontrados) returns only Luna', () => {
  const result = filterPets(MOCK_PETS, 2, '');
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'luna');
  assert.equal(result[0].estado, 2);
});

test('filter: nonexistent filter index returns empty array', () => {
  const result = filterPets(MOCK_PETS, 99, '');
  assert.equal(result.length, 0);
});

// ==========================================
// 3. TEXT SEARCH VERIFICATION
// ==========================================

test('search: match by pet name (case-insensitive)', () => {
  assert.equal(filterPets(MOCK_PETS, 0, 'milo').length, 1);
  assert.equal(filterPets(MOCK_PETS, 0, 'MILO')[0].id, 'milo');
  assert.equal(filterPets(MOCK_PETS, 0, 'Luna').length, 1);
  assert.equal(filterPets(MOCK_PETS, 0, 'LUNA')[0].id, 'luna');
  assert.equal(filterPets(MOCK_PETS, 0, 'lu')[0].id, 'luna');
});

test('search: match by pet description/breed', () => {
  const caniche = filterPets(MOCK_PETS, 0, 'caniche');
  assert.equal(caniche.length, 1);
  assert.equal(caniche[0].id, 'milo');

  const mestiza = filterPets(MOCK_PETS, 0, 'mestiza');
  assert.equal(mestiza.length, 1);
  assert.equal(mestiza[0].id, 'luna');

  const macho = filterPets(MOCK_PETS, 0, 'macho');
  assert.equal(macho.length, 1);
  assert.equal(macho[0].id, 'milo');
});

test('search: match by location / neighborhood', () => {
  const champagnat = filterPets(MOCK_PETS, 0, 'Champagnat');
  assert.equal(champagnat.length, 1);
  assert.equal(champagnat[0].id, 'milo');

  const plaza = filterPets(MOCK_PETS, 0, 'Plaza 12 de Octubre');
  assert.equal(plaza.length, 1);
  assert.equal(plaza[0].id, 'luna');

  const pilar = filterPets(MOCK_PETS, 0, 'Pilar');
  assert.equal(pilar.length, 2); // Both are in Pilar
});

test('search: query trimming and whitespace handling', () => {
  assert.equal(filterPets(MOCK_PETS, 0, '  milo  ').length, 1);
  assert.equal(filterPets(MOCK_PETS, 0, '   ').length, 2); // all returned if query empty after trim
});

test('search: non-matching query returns empty array', () => {
  assert.equal(filterPets(MOCK_PETS, 0, 'dálmata').length, 0);
  assert.equal(filterPets(MOCK_PETS, 0, 'Morón').length, 0);
});

test('filter + search: combined compound criteria', () => {
  // Pilar with filter 1 (Perdidos) -> Only Milo
  const lostInPilar = filterPets(MOCK_PETS, 1, 'Pilar');
  assert.equal(lostInPilar.length, 1);
  assert.equal(lostInPilar[0].id, 'milo');

  // Pilar with filter 2 (Encontrados) -> Only Luna
  const foundInPilar = filterPets(MOCK_PETS, 2, 'Pilar');
  assert.equal(foundInPilar.length, 1);
  assert.equal(foundInPilar[0].id, 'luna');

  // Milo with filter 2 (Encontrados) -> Empty (Milo is Perdido)
  const miloFound = filterPets(MOCK_PETS, 2, 'Milo');
  assert.equal(miloFound.length, 0);

  // Luna with filter 1 (Perdidos) -> Empty (Luna is Encontrada)
  const lunaLost = filterPets(MOCK_PETS, 1, 'Luna');
  assert.equal(lunaLost.length, 0);
});

// ==========================================
// 4. RESILIENCE AGAINST CORRUPTED PET DATA
// ==========================================

test('resilience: pets with missing or corrupt coordinates are excluded', () => {
  const corruptPets = [
    ...MOCK_PETS,
    { id: 'bad1', nombre: 'Bad1', estado: 1, coordenadas: null, ubicacion: 'Pilar', descripcion: 'test' },
    { id: 'bad2', nombre: 'Bad2', estado: 1, coordenadas: undefined, ubicacion: 'Pilar', descripcion: 'test' },
    { id: 'bad3', nombre: 'Bad3', estado: 1, coordenadas: { latitude: NaN, longitude: -58.9 }, ubicacion: 'Pilar', descripcion: 'test' },
    { id: 'bad4', nombre: 'Bad4', estado: 1, coordenadas: { latitude: -34.4, longitude: Infinity }, ubicacion: 'Pilar', descripcion: 'test' },
    { id: 'bad5', nombre: 'Bad5', estado: 1, coordenadas: { latitude: 95.0, longitude: -58.9 }, ubicacion: 'Pilar', descripcion: 'test' },
    { id: 'bad6', nombre: 'Bad6', estado: 1, coordenadas: { latitude: -34.4, longitude: "invalid" }, ubicacion: 'Pilar', descripcion: 'test' },
  ];

  const result = filterPets(corruptPets, 0, '');
  assert.equal(result.length, 2);
  assert.deepEqual(result.map(p => p.id), ['milo', 'luna']);
});
