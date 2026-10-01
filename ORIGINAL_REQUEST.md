# Original User Request

## 2026-09-17T06:46:39Z

Requested team: Equipo completo (Arquitecto, Implementador, Revisor Adversarial y Verificador QA)

Refactorizar y desacoplar arquitecturalmente la pantalla de Mapa en la app móvil Patitas Encontradas, solucionando el problema de la pantalla negra mediante la integración de un mapa interactivo libre basado en OpenStreetMap/Leaflet (sin Google API Key ni Google Play Services), extrayendo componentes modulares y cubriendo casos borde.

Working directory: c:/UNI PILAR/AppsMoviles/Patitas_Encontradas
Integrity mode: development

## Requirements

### R1. Motor de Mapa Libre y Visible (Sin Google API Key)
Implementar una solución de visualización de mapa desacoplada que no dependa de Google Play Services ni de credenciales de Google Cloud, resolviendo de forma permanente el fondo negro en Android:
- Integrar `react-native-webview` con un visor Leaflet.js / OpenStreetMap optimizado para mobile (o componente equivalente libre de API keys).
- El mapa debe renderizar fluidamente las calles de Pilar, soportar centrado en coordenadas, controles de zoom (+/-) y eventos bidireccionales con React Native (comunicación mediante `postMessage` o callbacks nativos para selección de pines y actualización de vista).

### R2. Desacoplamiento Arquitectural y Modularización
Descomponer el archivo monolítico `app/(tabs)/mapa.tsx` en unidades desacopladas y de responsabilidad única:
- **Hook de Estado (`hooks/useMapState.ts`)**: Encapsular la lógica de filtrado ('Todos', 'Perdidos', 'Encontrados'), selección de mascota activa, estado de localización GPS y búsqueda por texto.
- **Componentes Modulares (`components/map/`)**:
  - `MapSearchBar.tsx`: Campo de búsqueda de barrios/calles desacoplado.
  - `MapFilterChips.tsx`: Selector de categorías de filtro.
  - `MapPetCard.tsx`: Tarjeta flotante de detalle de mascota seleccionada con botón de ficha completa y reporte.
  - `MapControls.tsx`: Botones flotantes de localización GPS y zoom.
  - `MapContainer.tsx`: Contenedor aislado del mapa con manejo de estado de carga.

### R3. Adherencia a Convenciones y Design Tokens
Cumplir estrictamente las normas definidas en `CONVENCIONES.md`:
- Reemplazar todos los colores hardcodeados (`#FF8A00`, `#5A3A1F`, `#FFE7D2`, etc.) y tamaños mágicos por los tokens de diseño centralizados en `constants/theme.ts` y `theme/tokens.ts`.
- Tipar todas las props con `interface` TypeScript explícitas.
- Un componente por archivo en PascalCase y estilos al final (`StyleSheet.create`).
- Cero `console.log` en los archivos entregados.

### R4. Robustez ante Casos Borde y Fallos
Prever y resolver escenarios de error típicos en entornos móviles:
- **Permisos de GPS**: Manejo de permisos denegados o desactivados en el dispositivo con alertas amigables no bloqueantes.
- **Validación de Coordenadas**: Comprobación estricta de `latitude` y `longitude` antes de enviar al mapa (evitar valores `null`, `undefined` o `NaN`).
- **Estado de Carga / Offline**: Mostrar indicador de carga visual mientras el mapa inicializa y fallback elegante si falla la conexión a internet.

## Acceptance Criteria

### Compilación y Tipado
- [ ] `npx tsc --noEmit` compila con 0 errores de TypeScript en todo el proyecto.
- [ ] `npx expo export -p android` genera el bundle de Android exitosamente sin errores de empaquetado de Metro ni módulos faltantes.

### Funcionalidad Visual y de Usuario
- [ ] Al acceder a la pestaña Mapa en Android, el fondo muestra las calles a color de forma visible e interactiva (sin pantalla negra).
- [ ] Los marcadores de Milo y Luna se visualizan en sus respectivas coordenadas en Pilar y responden al toque abriendo la tarjeta de detalle inferior.
- [ ] Los filtros ('Todos los Puntos', 'Perdidos', 'Encontrados') filtran correctamente los marcadores mostrados en el mapa.
- [ ] La tarjeta inferior permite cerrarse con el botón 'X' y deseleccionar la mascota.
- [ ] La barra de navegación inferior de pestañas de Expo Router se mantiene limpia, sin duplicación de barras internas.

### Calidad de Código
- [ ] La pantalla `app/(tabs)/mapa.tsx` actúa como contenedor orquestador ligero (menos de 150 líneas), delegando la presentación a los componentes en `components/map/`.
- [ ] Ningún componente contiene colores hexadecimales hardcodeados que pertenezcan a la paleta del tema.
