# Project: Patitas Encontradas - Decoupled Leaflet Map Screen & Architecture Refactor

## Architecture
- **Engine**: Replaced `react-native-maps` with `react-native-webview` running an in-memory Leaflet.js 1.9.4 + CartoDB Voyager / OpenStreetMap raster tile viewer. Zero reliance on Google Play Services or Google Cloud API Keys.
- **State Management**: Extracted monolithic state into `hooks/useMapState.ts` (GPS permissions, filtering, search, selection, coordinate validation, error states).
- **Presentation**: Decomposed `app/(tabs)/mapa.tsx` into 5 modular components under `components/map/`:
  - `MapContainer.tsx`: Isolated Leaflet/OSM WebView with loader and bidirectional bridge.
  - `MapSearchBar.tsx`: Search input with design tokens.
  - `MapFilterChips.tsx`: Category filter chips ('Todos los Puntos', 'Perdidos', 'Encontrados').
  - `MapControls.tsx`: Floating GPS and zoom controls.
  - `MapPetCard.tsx`: Floating card for selected pet with close button and navigation.
- **Container**: `app/(tabs)/mapa.tsx` reduced to a light orchestrator container (< 150 lines).
- **Data & Types**: Centralized types in `types/map.ts` and mock data in `data/mapMockData.ts`.
- **Validation**: Geo validation in `utils/geoValidation.ts` to prevent Leaflet NaN/null errors.
- **Design System**: 100% adherence to `constants/theme.ts`, `theme/tokens.ts`, and `CONVENCIONES.md`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Leaflet/OSM WebView Engine | Render Pilar streets via Leaflet 1.9.4 and CartoDB Voyager tiles in react-native-webview with no Google API key or Play Services | M1 | Survey / R1 |
| 2 | Bidirectional Event Bridge | `window.ReactNativeWebView.postMessage` for MAP_READY, MARKER_CLICK, MAP_CLICK, MAP_ERROR and `injectJavaScript` for setMarkers, centerTo, zoomIn, zoomOut, setUserLocation | M1 | Survey / R1 |
| 3 | Map State Hook (`useMapState`) | Custom hook managing filter, search query, selected pet, user GPS location, locating status, and filtered pets | M2 | Survey / R2 |
| 4 | Map Modular Components | Create `MapSearchBar.tsx`, `MapFilterChips.tsx`, `MapPetCard.tsx`, `MapControls.tsx`, `MapContainer.tsx` in `components/map/` | M2 | Survey / R2 |
| 5 | Light Container Screen | Refactor `app/(tabs)/mapa.tsx` to < 150 lines, removing duplicate fonts and redundant SafeAreaProvider | M2 | Survey / R2 |
| 6 | Design Tokens & Conventions | Replace all 8 hardcoded colors and shadows with `Colors.*`, `Typography.*`, `Spacing.*`, `Radius.*` from `constants/theme.ts` and `theme/tokens.ts`, with 0 `console.log` | M3 | Survey / R3 |
| 7 | GPS & Coordinate Robustness | Validate coordinates with `isValidCoordinate`, handle denied/disabled GPS with non-blocking alerts and fallback in `expo-location` | M3 | Survey / R4 |
| 8 | Loading & Offline State | Show `ActivityIndicator` on load and friendly offline/error fallback on tile/network failure | M3 | Survey / R4 |
| 9 | Quality Verification | `npx tsc --noEmit` passes with 0 errors and `npx expo export -p android` bundles successfully | M4 | Survey / Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Dependencies & Leaflet Engine | Install `react-native-webview`, create `types/map.ts`, `data/mapMockData.ts`, `utils/geoValidation.ts`, and `components/map/MapContainer.tsx` with Leaflet HTML template | none | DONE |
| 2 | State Hook & Modular Components | Create `hooks/useMapState.ts`, `MapSearchBar.tsx`, `MapFilterChips.tsx`, `MapPetCard.tsx`, `MapControls.tsx`, and refactor `app/(tabs)/mapa.tsx` | M1 | DONE |
| 3 | Token Hardening & Clean Up | Ensure zero hardcoded hex colors, zero console.log, remove redundant root `Mapa.tsx`, verify edge cases | M2 | DONE |
| 4 | Verification & Audit | Run `npx tsc --noEmit`, `npx expo export -p android`, review and adversarial verification, forensic audit | M3 | DONE |

## Interface Contracts
### `hooks/useMapState` ↔ `app/(tabs)/mapa.tsx`
- Returns: `{ filtro, setFiltro, selectedPet, setSelectedPet, searchQuery, setSearchQuery, userLocation, isLocating, isMapReady, setIsMapReady, filteredPets, handleLocate, handleZoomIn, handleZoomOut, mapContainerRef }`
- Inputs: Initial pets list from `data/mapMockData.ts`.

### `components/map/MapContainer` ↔ Leaflet WebView
- `MapContainerProps`: `{ pets: MapPet[]; selectedPet: MapPet | null; onSelectPet: (p: MapPet | null) => void; userLocation: Coordinates | null; isLocating: boolean; onLocate: () => void; onZoomIn: () => void; isMapReady: boolean; onMapReady: () => void; }`
- Bridge messages:
  - WebView -> RN: `{ type: 'MAP_READY' }`, `{ type: 'MARKER_CLICK', payload: { id: string } }`, `{ type: 'MAP_CLICK' }`, `{ type: 'MAP_ERROR', payload: { error: string } }`
  - RN -> WebView: `window.mapBridge.setMarkers(pets)`, `window.mapBridge.centerTo(lat, lng, zoom)`, `window.mapBridge.zoomIn()`, `window.mapBridge.zoomOut()`, `window.mapBridge.setUserLocation(lat, lng)`, `window.mapBridge.selectPet(id)`.

### `components/map/MapPetCard`
- `MapPetCardProps`: `{ pet: MapPet; onClose: () => void; onViewDetail?: (id: string) => void; onReportSeen?: (id: string) => void; }`

### `components/map/MapFilterChips`
- `MapFilterChipsProps`: `{ selectedFilter: number; onSelectFilter: (index: number) => void; }`

### `components/map/MapSearchBar`
- `MapSearchBarProps`: `{ value: string; onChangeText: (text: string) => void; onFilterPress?: () => void; }`

### `components/map/MapControls`
- `MapControlsProps`: `{ onLocate: () => void; onZoomIn: () => void; isLocating?: boolean; }`

## Code Layout
```
types/
└── map.ts

data/
└── mapMockData.ts

utils/
└── geoValidation.ts

hooks/
└── useMapState.ts

components/map/
├── MapContainer.tsx
├── MapSearchBar.tsx
├── MapFilterChips.tsx
├── MapPetCard.tsx
└── MapControls.tsx

app/(tabs)/
└── mapa.tsx
```
