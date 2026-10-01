/**
 * Validates that latitude and longitude are valid finite numbers within geographical bounds.
 * Prevents Leaflet runtime NaN / null crashes.
 */
export function isValidCoordinate(lat: unknown, lng: unknown): boolean {
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
