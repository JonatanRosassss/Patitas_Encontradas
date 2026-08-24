# Convenciones del Equipo - Patitas Encontradas

Documento de estándares de código y buenas prácticas acordadas para el proyecto.

## 📌 Reglas Generales

1. **PascalCase para componentes**
   - Todos los componentes de React Native / Expo deben nombrarse usando PascalCase.
   - *Ejemplo:* `Boton.tsx`, `Badge.tsx`, `Input.tsx`, `TarjetaMascota.tsx`, `HomeScreen.tsx`.

2. **camelCase para funciones y variables**
   - Nombres de funciones, hooks, métodos, variables y constantes locales deben utilizar camelCase.
   - *Ejemplo:* `obtenerMascotas`, `handlePress`, `colorPrincipal`, `estaCargando`.

3. **Un componente por archivo**
   - Cada archivo `.tsx` dentro de `components/` o `app/` debe definir y exportar un único componente principal.

4. **Props siempre tipadas con interfaces**
   - Todo componente debe definir una `interface` de TypeScript para sus props.
   - *Ejemplo:* `interface BotonProps { ... }`.

5. **Estilos al final del archivo**
   - Los estilos de cada componente (`StyleSheet.create({ ... })`) deben ubicarse al final del archivo.

6. **Sin magic numbers ni hardcoded strings**
   - Utilizar las constantes de espaciado, colores y tamaños definidas en `constants/theme.ts`.
   - Evitar números y textos fijos sin declarar.

7. **Sin console.log en Pull Requests**
   - Limpiar cualquier `console.log` o mensaje de depuración temporal antes de enviar o fusionar un Pull Request.

---

## 🎨 Paleta de Colores & Tipografía (`constants/theme.ts`)

- **Naranja Principal:** `#FF8A00`
- **Naranja Claro (Secundario):** `#FFC28A`
- **Durazno Claro (Acento):** `#FFE7D2`
- **Marrón (Texto):** `#5A3A1F`
- **Gris Claro (Fondos):** `#F2F2F2`
- **Blanco (Fondo Principal):** `#FFFFFF`

### Tipografía
- **Títulos / Logo:** Baloo 2
- **Textos:** Nunito
