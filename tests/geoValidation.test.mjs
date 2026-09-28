import test from 'node:test';
import assert from 'node:assert/strict';

// Test the geo validation logic directly
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

const PILAR_DEFAULT_CENTER = {
  latitude: -34.4586,
  longitude: -58.9142,
  zoom: 14,
};

const MASCOTAS_MOCK = [
  {
    id: 'milo',
    nombre: 'Milo',
    estado: 1,
    coordenadas: { latitude: -34.4497, longitude: -58.9194 },
  },
  {
    id: 'luna',
    nombre: 'Luna',
    estado: 2,
    coordenadas: { latitude: -34.4587, longitude: -58.9142 },
  },
];

test('test_valid_coordinates_within_pilar_returns_true', () => {
  assert.equal(isValidCoordinate(-34.4586, -58.9142), true);
  assert.equal(isValidCoordinate(-34.4497, -58.9194), true);
  assert.equal(isValidCoordinate(-34.4587, -58.9142), true);
});

test('test_valid_extreme_boundary_coordinates_returns_true', () => {
  assert.equal(isValidCoordinate(-90, -180), true);
  assert.equal(isValidCoordinate(90, 180), true);
  assert.equal(isValidCoordinate(0, 0), true);
});

test('test_latitude_out_of_bounds_returns_false', () => {
  assert.equal(isValidCoordinate(-90.001, 0), false);
  assert.equal(isValidCoordinate(90.001, 0), false);
  assert.equal(isValidCoordinate(999, -58.91), false);
});

test('test_longitude_out_of_bounds_returns_false', () => {
  assert.equal(isValidCoordinate(0, -180.001), false);
  assert.equal(isValidCoordinate(0, 180.001), false);
  assert.equal(isValidCoordinate(-34.45, 200), false);
});

test('test_nan_coordinates_returns_false', () => {
  assert.equal(isValidCoordinate(NaN, -58.91), false);
  assert.equal(isValidCoordinate(-34.45, NaN), false);
  assert.equal(isValidCoordinate(NaN, NaN), false);
});

test('test_null_or_undefined_coordinates_returns_false', () => {
  assert.equal(isValidCoordinate(null, -58.91), false);
  assert.equal(isValidCoordinate(-34.45, undefined), false);
  assert.equal(isValidCoordinate(null, null), false);
  assert.equal(isValidCoordinate(undefined, undefined), false);
});

test('test_string_coordinates_returns_false', () => {
  assert.equal(isValidCoordinate("-34.45", -58.91), false);
  assert.equal(isValidCoordinate(-34.45, "-58.91"), false);
});

test('test_infinite_coordinates_returns_false', () => {
  assert.equal(isValidCoordinate(Infinity, 0), false);
  assert.equal(isValidCoordinate(0, -Infinity), false);
});

test('test_pilar_default_center_is_valid', () => {
  assert.equal(
    isValidCoordinate(PILAR_DEFAULT_CENTER.latitude, PILAR_DEFAULT_CENTER.longitude),
    true
  );
});

test('test_mock_pets_have_valid_coordinates', () => {
  for (const pet of MASCOTAS_MOCK) {
    assert.equal(
      isValidCoordinate(pet.coordenadas.latitude, pet.coordenadas.longitude),
      true,
      `Pet ${pet.nombre} (${pet.id}) must have valid coordinates`
    );
  }
});
