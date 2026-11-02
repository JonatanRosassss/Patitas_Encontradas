# DIRECTIVAS DE ARQUITECTURA Y ORQUESTACIÓN MULTI-AGENTE
# Proyecto: Patitas Encontradas (Mobile App - Expo / React Native / Firestore)

> **ESTE ARCHIVO ES LA FUENTE DE LA VERDAD TÉCNICA (SINGLE SOURCE OF TRUTH).**
> Cualquier agente de IA en este o en futuros chats DEBE leer este archivo y regirse estrictamente por sus directivas para mantener coherencia técnica absoluta.

---

## 1. Arquetipo y Estándar de Trabajo
- **Rol:** Principal Mobile Architect (15+ años de experiencia) & Multi-Agent Orchestrator.
- **Mentalidad:** Cero tolerancia a regresiones, arquitectura limpia (Clean Architecture), desacoplamiento estricto, resiliencia offline-first y diseño guiado por tokens.
- **Protocolo Multi-Agente:** Antes de escribir código, descomponer en contratos (`types/`), lógica de datos (`services/`), presentación modular (`components/`) y vista orquestadora (`app/`).

---

## 2. Pila Tecnológica y Reglas de Infraestructura
- **Framework:** Expo 57 / React Native 0.86 / Expo Router (file-based routing).
- **Lenguaje:** TypeScript estricto. Toda prop de componente y modelo de datos debe tener su `interface` explícita en `types/`. Prohibido el uso de `any`.
- **Base de Datos & Auth:** Firebase Auth + Cloud Firestore + Firebase Storage.
  - **REGLA DE ORO:** NUNCA instanciar Firebase directamente en componentes UI. Utilizar siempre el Singleton orquestador:
    ```typescript
    import { ConexionFirebase } from '@/services/ConexionFirebase';
    const db = ConexionFirebase.obtenerFirestore();
    const auth = ConexionFirebase.obtenerAuth();
    ```
- **Mapa:** Leaflet.js 1.9.4 sobre `react-native-webview` (OpenStreetMap / CartoDB Voyager). Cero dependencias de Google Maps API Key o Google Play Services.
- **Design System:** 100% de cumplimiento con `constants/theme.ts`.
  - Colores: `Colors.primary`, `Colors.secondary`, `Colors.text`, `Colors.card`, `Colors.backgroundLight`, etc.
  - Tipografías: `Typography.fonts.titleBold` (Baloo 2), `Typography.fonts.bodyRegular` (Nunito).
  - Espaciados y Radios: `Spacing.*`, `Radius.*`.
  - CERO colores hexadecimales hardcodeados o números mágicos.

---

## 3. Convenciones de Código (`CONVENCIONES.md`)
1. **PascalCase** para componentes (`Boton.tsx`, `TicketForm.tsx`, `FaqAccordion.tsx`).
2. **camelCase** para funciones, hooks, variables y colecciones de Firestore.
3. **Un componente por archivo.**
4. **Props siempre tipadas** con `interface`.
5. **Estilos al final del archivo** con `StyleSheet.create({ ... })`.
6. **Sin magic numbers ni hardcoded strings** de diseño.
7. **CERO `console.log`** en código final / producción.

---

## 4. Mapa de Requerimientos Funcionales y Colecciones de Firestore

| Requerimiento | Descripción | Colección Firestore | Servicio Responsable |
|---|---|---|---|
| **RF#1** | Gestionar cuenta de usuario (Auth, Perfil, WhatsApp, Zona) | `usuarios` | `services/AuthContext.tsx` |
| **RF#2** | Publicar reporte de mascota (Perdido / Encontrado, GPS, Fotos, Recompensa) | `alertas` | `services/mascotasService.ts` |
| **RF#3** | Consultar mapa interactivo y feed de alertas georreferenciadas | `alertas` | `hooks/useMapState.ts`, `services/mascotasService.ts` |
| **RF#4** | Gestionar avistamientos, contacto WhatsApp y marcar como resuelto | `alertas` | `services/mascotasService.ts` |
| **RF#5 (Soporte)** | Centro de soporte, preguntas frecuentes y tickets de incidentes | `tickets_soporte` | `services/soporteService.ts` |

---

## 5. Esquema de la Colección `tickets_soporte` (Firestore)
```typescript
interface TicketSoporte {
  id: string;                         // Generado por Firestore (docRef.id)
  usuarioId: string | null;           // UID de Firebase Auth o null si anónimo
  emailContacto: string;              // Email para responder al vecino
  nombreContacto: string;             // Nombre del vecino solicitante
  tipoProblema: TipoTicket;           // 'ERROR_TECNICO' | 'PROBLEMA_MAPA' | 'REPORTE_FALSO' | 'CONSULTA_GENERAL' | 'OTRO'
  titulo: string;                     // Resumen conciso
  descripcion: string;                // Explicación detallada
  estado: EstadoTicket;               // 'ABIERTO' | 'EN_REVISION' | 'RESUELTO' (default: 'ABIERTO')
  fechaCreacion: string;              // ISO 8601 string
  dispositivo?: string;               // Plataforma OS (Android / iOS / Web)
}
```

---

## 6. Estado del Backlog (Sprint Activo)
- [x] **Tarea 1: VISTA DE SOPORTE** -> Implementada en `app/(tabs)/reporte_error.tsx` como Centro de Ayuda integral con selector dinámico de pestañas (FAQs / Generar Ticket).
- [x] **Tarea 2: HACER PREGUNTAS FRECUENTES (FAQ)** -> Implementado en `components/soporte/FaqAccordion.tsx` con dataset `data/faqsData.ts` categorizado y mapeado a los RF#1 a RF#4.
- [x] **Tarea 3: CREAR COLECCIÓN PARA TICKETS Y ENVIARLOS** -> Implementada la colección `tickets_soporte` en Firestore a través de `services/soporteService.ts`, tipos en `types/Ticket.ts` y formulario en `components/soporte/TicketForm.tsx`.
- [x] **Tarea 4: REALIZAR EL HOME MEDIANTE LA CONEXIÓN A BD** -> Conexión reactiva a Firestore en `app/(tabs)/index.tsx` vía `listarTodasLasAlertas()`, pull-to-refresh, empty states, saludo dinámico al vecino autenticado y tarjetas `PetCard` integradas con el Design System.
- [x] **Tarea 5: MOSTRAR DETALLE DE LA MASCOTA MEDIANTE BD Y REDIRIGIR A WPP** -> Pantalla completa `app/detalle/[id].tsx` con enriquecimiento de datos de autor vía `obtenerAlertaConUsuarioPorId()`, carrusel de fotos, recompensas, señas particulares y redirección universal a WhatsApp contextualizado vía `utils/whatsapp.ts`.

---

## 7. Protocolo de Verificación Obligatorio
Antes de dar cualquier entrega por finalizada:
1. `npx tsc --noEmit` debe retornar 0 errores.
2. Comprobar que no hayan quedado llamadas a `console.log`.
3. Validar estados: Carga (`ActivityIndicator`), Error (`Alert` claro), Éxito (`Feedback al usuario`).
4. **Registrar obligatoriamente el progreso y justificaciones en la Sección 8 (Bitácora de Modificaciones).**

---

## 8. Protocolo Obligatorio de Trazabilidad, Bitácora y Justificación de Modificaciones (Audit Trail & ADR)

> **REGLA INQUEBRANTABLE:** Todo agente de IA que intervenga en el proyecto TIENE LA OBLIGACIÓN de documentar en este apartado cada progreso realizado tras una petición del usuario.
> Si la intervención modifica, reemplaza o elimina código, componentes o arquitecturas preexistentes (o ya documentadas), DEBE registrar obligatoriamente la justificación técnica de por qué se hizo de esa manera diferente.

### 8.1. Reglas de Documentación para el Agente
1. **Documentación por Intervención:** Cada requerimiento ejecutado debe dejar su entrada correspondiente en la bitácora antes de concluir la respuesta al usuario.
2. **Justificación Obligatoria de Modificaciones (Principio ADR):**
   - Si se altera algo que ya estaba funcionando o documentado, responder explícitamente:
     - **¿Qué existía previamente?** (archivo, componente, función o flujo).
     - **¿Por qué se cambió o eliminó?** (causa raíz: bug, obsolescencia, conflicto de dependencias, inconsistencia de tipos, mejora de rendimiento o cambio de requerimiento).
     - **¿Por qué la nueva solución es superior?** (beneficios, desacoplamiento, prevención de regresiones).
3. **Cero Cambios Silenciosos:** Queda estrictamente prohibido refactorizar o borrar código sin explicar la razón en la bitácora.

### 8.2. Plantilla Estándar de Registro
```markdown
### [YYYY-MM-DD] - <Título del Requerimiento / Solicitud>
- **Solicitud del Usuario:** <Resumen del pedido recibido>
- **Tipo de Cambio:** `NUEVA_FUNCIONALIDAD` | `REFACTORIZACIÓN` | `CORRECCIÓN_BUG` | `ELIMINACIÓN_CÓDIGO` | `OPTIMIZACIÓN` | `CONFIGURACIÓN`
- **Archivos Involucrados:**
  - `<ruta/al/archivo>`: <Creado | Modificado | Eliminado>
- **Progreso Realizado:**
  - <Detalle de las acciones ejecutadas y código añadido/actualizado>
- **Justificación de Modificaciones sobre Código Previo (Obligatorio si se alteró algo preexistente):**
  - **Estado anterior:** <Qué había y cómo funcionaba>
  - **Motivo del cambio:** <Por qué no se mantuvo la solución previa>
  - **Nueva estrategia aplicada:** <Por qué esta alternativa es óptima, segura y profesional>
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | Pruebas de integración.
```

---

### 8.3. Bitácora Histórica de Cambios y Decisiones Técnicas (Registro Vivo)

#### [2026-10-20] - Inicialización del Protocolo de Trazabilidad y Bitácora de Agentes
- **Solicitud del Usuario:** Agregar en `AGENTS.md` un apartado obligatorio para que la IA documente cada progreso al modificar cosas, y si modifica algo ya existente o documentado, justifique por qué lo hizo de manera diferente.
- **Tipo de Cambio:** `CONFIGURACIÓN` / `DIRECTIVA_ARQUITECTURA`
- **Archivos Involucrados:**
  - `AGENTS.md`: Modificado (adición de directiva #8 y actualización del paso 4 en el protocolo de verificación #7).
- **Progreso Realizado:**
  - Se formalizó la Sección 8 en las directivas de arquitectura con mandato estricto de auditoría y trazabilidad.
  - Se estableció el estándar ADR (Architecture Decision Record) para justificar reemplazos o eliminaciones de código previo.
  - Se vinculó el paso de documentación en el protocolo de verificación obligatorio final.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** `AGENTS.md` contaba con directivas de arquitectura y backlog (Secciones 1 a 7), pero no obligaba a los agentes a registrar sistemáticamente el progreso ni a justificar por qué cambiaban código preexistente en cada interacción.
  - **Motivo del cambio:** Evitar regresiones invisibles, refactorizaciones silenciosas y pérdida de contexto entre diferentes agentes o sesiones de chat.
  - **Nueva estrategia aplicada:** Centralizar el registro directamente en `AGENTS.md`, ya que este archivo es la Fuente de la Verdad inyectada automáticamente en el contexto de todo agente del proyecto, garantizando observabilidad permanente y trazabilidad completa.
- **Resultado de Verificación:** Verificado y formateado acorde a los estándares de Markdown y directivas del proyecto.

#### [2026-10-20] - Desarrollo de Pantalla de Bienvenida Interactiva con Mini-Resumen Barrial
- **Solicitud del Usuario:** Desarrollar una pantalla de bienvenida profesional y atractiva que contenga un mini-resumen de la aplicación basada en el bosquejo de referencia provisto, aplicando criterios de arquitectura senior (`mobile-veteran-architect`), diseño visual de alto impacto (`frontend-design`) y verificación con capturas reales (`webapp-testing`).
- **Tipo de Cambio:** `NUEVA_FUNCIONALIDAD` | `REFACTORIZACIÓN`
- **Archivos Involucrados:**
  - `types/Welcome.ts`: Creado (contratos TypeScript estrictos para pilares de resumen y callouts flotantes).
  - `data/welcomeData.ts`: Creado (dataset tipado para los 3 pilares: `Mapa en vivo`, `Reporte rápido` y `Comunidad`, más callouts barriales).
  - `constants/theme.ts`: Modificado (adición de tokens semánticos `Colors.welcome*` para mantener cero colores hardcodeados).
  - `assets/welcome_hero_3d.png`: Creado (ilustración isométrica 3D de alta resolución integrada al fondo `#FAF6F0`).
  - `assets/welcome_dog_badge.png`: Creado (emblema 3D para el encabezado de marca).
  - `components/bienvenida/WelcomeHeroStage.tsx`: Creado (escenario interactivo con animación suave de levitación, pulso de radar y tarjetas inclinadas).
  - `components/bienvenida/WelcomeFeaturePills.tsx`: Creado (fila horizontal de píldoras interactivas y paginación dinámica).
  - `components/bienvenida/WelcomeScreenView.tsx`: Creado (vista modular de bienvenida con jerarquía editorial y CTAs).
  - `app/bienvenida.tsx`: Creado (ruta dedicada de bienvenida).
  - `app/index.tsx`: Modificado (presentación de la pantalla de bienvenida para usuarios no autenticados y eliminación de `console.error`).
  - `app/_layout.tsx`: Modificado (registro de la pantalla `bienvenida` en el Stack principal).
- **Progreso Realizado:**
  - Se diseñó y construyó la experiencia de bienvenida completa respetando 100% los tokens de `constants/theme.ts` y las convenciones de código (`CONVENCIONES.md`).
  - Se implementó interactividad en las 3 píldoras (`📍 Mapa en vivo`, `🚨 Reporte rápido`, `🤝 Comunidad`), tarjetas flotantes y puntos de paginación para explorar el mini-resumen de la app sin salir de la portada.
  - Se conectaron los flujos de navegación hacia `/(auth)/login` (`Comenzar ahora` y `Saltar`) y acceso directo a `/(tabs)` (`Explorar como invitado`).
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** `app/index.tsx` actuaba únicamente como un redireccionador silencioso con un `ActivityIndicator` que enviaba forzosamente a `/(auth)/login` cuando no existía sesión activa (e incluía un `console.error`), impidiendo mostrar una portada de bienvenida o explorar como invitado.
  - **Motivo del cambio:** El usuario solicitó una pantalla de bienvenida con mini-resumen y opción de explorar como invitado o comenzar sesión, además de cumplir la regla de cero `console.*` en producción.
  - **Nueva estrategia aplicada:** Si `onAuthStateChanged` detecta sesión activa, redirige directamente a `/(tabs)`. Si el vecino aún no inició sesión, renderiza `WelcomeScreenView` permitiendo conocer los 3 pilares de la red barrial, iniciar sesión (`Comenzar ahora`) o navegar el mapa inmediatamente (`Explorar como invitado`).
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | Capturas móviles verificadas con Playwright en `390x844` (`welcome_v2_mapa.png`, `welcome_v2_reporte.png`, `welcome_v2_comunidad.png`).

#### [2026-10-20] - Refactorización de Escalado Responsivo en Android y Unificación Cromática con Login
- **Solicitud del Usuario:** Corregir el escalado responsivo en dispositivos móviles reales (donde las 3 píldoras se desbordaban horizontalmente y el botón inferior `Explorar como invitado` quedaba cortado por la barra de navegación de Android) y unificar el 100% de la paleta de colores con la pantalla de Login (`app/(auth)/login.tsx`).
- **Tipo de Cambio:** `REFACTORIZACIÓN` | `CORRECCIÓN_BUG` | `OPTIMIZACIÓN`
- **Archivos Involucrados:**
  - `constants/theme.ts`: Modificado (unificación de tokens de bienvenida con `Colors.primary` `#FF8A00`, `Colors.text` `#5A3A1F`, `Colors.backgroundLight` `#FAF8F5`, `Colors.accent` `#FFE7D2` y `Colors.secondary` `#FFC28A`).
  - `assets/welcome_hero_3d.png`: Modificado (integración de bordes difuminados al color exacto `Colors.backgroundLight` `#FAF8F5`).
  - `components/bienvenida/WelcomeHeroStage.tsx`: Modificado (implementación de contenedor `flex: 1` con medición real `onLayout` y escalado proporcional del escenario 3D).
  - `components/bienvenida/WelcomeFeaturePills.tsx`: Modificado (distribución `flex: 1` con `minWidth: 0`, `adjustsFontSizeToFit` y `maxFontSizeMultiplier={1.05}` para evitar desbordes en pantallas de `320-360dp`).
  - `components/bienvenida/WelcomeScreenView.tsx`: Modificado (distribución flexible sin recorte inferior usando `useWindowDimensions`, `useSafeAreaInsets` y colores unificados con `login.tsx`).
  - `app/index.tsx`: Modificado (uso de `Colors.backgroundLight`).
- **Progreso Realizado:**
  - Se reemplazó el alto fijo de `326dp` en `WelcomeHeroStage` por un layout elástico (`flex: 1` + `onLayout`) que cede prioridad al bloque inferior de acciones, garantizando que `Comenzar ahora` y `Explorar como invitado` jamás queden ocultos tras la barra de sistema de Android.
  - Se aplicó `flex: 1` y control de escala tipográfica a las tres píldoras (`Mapa en vivo`, `Reporte rápido`, `Comunidad`) para que entren holgadamente en `360dp` de ancho incluso con tamaño de fuente del sistema aumentado.
  - Se sincronizó toda la paleta cromática con `app/(auth)/login.tsx` (`PATITAS` en `Colors.black`, `ENCONTRADAS` y CTA en `Colors.primary` `#FF8A00`, titulares en `Colors.text` `#5A3A1F`, subtítulos en `Colors.textSecondary` `#8D735C` y fondo `Colors.backgroundLight` `#FAF8F5`).
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** `WelcomeHeroStage` tenía dimensiones fijas (`height: 326`) y `WelcomeFeaturePills` usaba `paddingHorizontal` fijo sin `flex: 1`, además de utilizar un tono coral `#EB6434` y texto `#1C2230` distintos del naranja `#FF8A00` y marrón `#5A3A1F` del Login.
  - **Motivo del cambio:** En dispositivos Android de `360dp` de ancho y área vertical útil reducida por la barra de navegación de 3 botones, el alto acumulado superaba la pantalla y cortaba el botón secundario, mientras que los colores diferían al pasar al Login.
  - **Nueva estrategia aplicada:** Arquitectura responsiva basada en Flexbox + `onLayout` + `useWindowDimensions` y adherencia estricta a los tokens principales de `constants/theme.ts`.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | Capturas comparativas verificadas en viewport compacto Android `360x690` (`welcome_v3_android_compact.png`, `welcome_v3_comunidad_compact.png`, `welcome_v3_login_unity.png`).

#### [2026-10-20] - Corrección de Persistencia de Foto de Perfil y Nombre de Usuario (RF#1)
- **Solicitud del Usuario:** Solucionar el error donde al asignar una foto de perfil al usuario no se guardaba de forma persistente y, a pesar de iniciar sesión, seguía apareciendo el nombre genérico `"Usuario Patitas"`.
- **Tipo de Cambio:** `CORRECCIÓN_BUG` | `REFACTORIZACIÓN`
- **Archivos Involucrados:**
  - `services/AuthContext.tsx`: Modificado (sincronización integral del perfil desde la colección `usuarios` de Firestore, Firebase Auth `updateProfile`, Firebase Storage y caché local en `AsyncStorage`, exponiendo `perfilUsuario`, `actualizarFotoPerfil` y `actualizarDatosPerfil`).
  - `app/(auth)/register.tsx`: Modificado (asignación inmediata de `displayName` mediante `updateProfile` al crear la cuenta, persistencia en `AsyncStorage` y escritura con `{ merge: true }` en Firestore `usuarios`).
  - `app/(tabs)/perfil.tsx`: Modificado (consumo de `perfilUsuario` y `actualizarFotoPerfil` desde `useAuth()`, indicador de carga al guardar la foto y edición de nombre/teléfono desde el modal `Mis Datos`).
  - `app/(tabs)/index.tsx`: Modificado (uso prioritario de `perfilUsuario?.nombre` para el saludo dinámico en el Home).
- **Progreso Realizado:**
  - Se implementó en `services/AuthContext.tsx` la lectura automática del documento `usuarios/{uid}` en Firestore al iniciar sesión, reparando automáticamente `displayName` en Firebase Auth si estaba vacío y derivando un nombre legible desde el correo si la cuenta era previa.
  - Se implementó `actualizarFotoPerfil` en `services/AuthContext.tsx`, que sube la imagen a Firebase Storage (con fallback resiliente a Data URL base64), actualiza el campo `avatarUrl` en Firestore `usuarios/{uid}`, sincroniza `photoURL` en Firebase Auth y guarda en `AsyncStorage`.
  - Se conectó `app/(tabs)/perfil.tsx` para persistir realmente la foto seleccionada y permitir editar nombre y teléfono desde el modal `Mis Datos`.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** En `app/(auth)/register.tsx` se guardaba el nombre únicamente en Firestore (`usuarios/{uid}`) sin llamar a `updateProfile(usuario, { displayName })`, mientras que `app/(tabs)/perfil.tsx` leía únicamente `usuario?.displayName || 'Usuario Patitas'` ignorando Firestore. Además, `seleccionarFoto` en `perfil.tsx` solo hacía `setFotoPerfil(uriSeleccionada)` en un `useState` local volátil sin guardar nada en Firestore, Storage ni `AsyncStorage`.
  - **Motivo del cambio:** El nombre registrado en Firestore nunca se reflejaba en la pantalla de Perfil (mostrando siempre `"Usuario Patitas"`) y la foto de perfil se perdía al recargar o cambiar de pantalla.
  - **Nueva estrategia aplicada:** Centralizar la sincronización y persistencia multicapa (Firestore `usuarios` + Firebase Auth + Storage + `AsyncStorage`) dentro de `services/AuthContext.tsx`, cumpliendo el mapa de arquitectura del RF#1.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | Suite de pruebas `npm test` (57/57 PASS).

#### [2026-10-20] - Elevación de Barra de Navegación Android y Rediseño Integral de la Ficha de Mascota
- **Solicitud del Usuario:**
  1. Solucionar el error de diseño donde la barra inferior de navegación por botones (tabs) no se veía / quedaba tapada por la barra del sistema de Android.
  2. Rediseñar y perfeccionar la ficha de la mascota (`app/detalle/[id].tsx`), corrigiendo el aspecto tosco y pequeño, inspirándose en la captura de referencia de iPhone (foto hero a sangre en carrusel con flechas y paginador, botón de volver flotante superior izquierdo, píldora de estado flotante inferior izquierda, botón de compartir en lugar de la 'G' de Google en la esquina inferior derecha de la foto, título grande con recompensa destacada al lado, mapa grande de ubicación Leaflet sin Google API key, tarjeta de autor y botón WhatsApp ancho estilo píldora elevado por encima de los botones de Android).
  3. Verificar mediante capturas reales sin mal escalado de componentes.
- **Tipo de Cambio:** `REFACTORIZACIÓN` | `CORRECCIÓN_BUG` | `OPTIMIZACIÓN` | `NUEVA_FUNCIONALIDAD`
- **Archivos Involucrados:**
  - `constants/theme.ts`: Modificado (adición de tokens de métricas `TabBarMetrics`, `DetailMetrics` y paleta de colores semántica `Colors.detail*`).
  - `app/(tabs)/_layout.tsx`: Modificado (elevación de la barra de pestañas consumiendo `useSafeAreaInsets().bottom` y `TabBarMetrics` para evitar superposición con los 3 botones de navegación de Android en edge-to-edge).
  - `app/(tabs)/index.tsx`: Modificado (ajuste de `SafeAreaView` a `edges={['top', 'left', 'right']}` para no duplicar padding, ampliación de botones de cabecera a 44dp táctiles y eliminación de casts `as any`).
  - `components/ui/pet-card.tsx`: Modificado (reorganización flexible de badges en fila con wrap para evitar choque con el botón de guardado, y remoción de `accessibilityRole="button"` redundante en el contenedor para eliminar el error HTML de buttons anidados en web).
  - `app/_layout.tsx`: Modificado (desactivación de `headerShown: false` en la ruta `detalle/[id]` para eliminar el doble encabezado redundante).
  - `types/Detalle.ts`: Creado (contratos e interfaces TypeScript estrictas para todos los componentes de la ficha de mascota).
  - `utils/detalleMascota.ts`: Creado (utilidades puras para formateo monetario con separador de miles es-AR, resolución geoespacial con tolerancia a MapPoint, y normalización de estados y especies).
  - `components/detalle/PetFloatingButton.tsx`: Creado (botón circular translúcido 44x44dp con microinteracción táctil y sombra suave).
  - `components/detalle/PetHeroCarousel.tsx`: Creado (carrusel hero a sangre con flechas laterales, paginador de dots, botón flotante de volver, badge de estado y botón circular de compartir reemplazando el icono G).
  - `components/detalle/PetInfoHeader.tsx`: Creado (cabecera con nombre en tamaño display Baloo 2, badge de recompensa destacado en tono coral y subtítulo con especie y tiempo).
  - `components/detalle/PetLocationMap.tsx`: Creado (mapa interactivo/estático Leaflet 1.9.4 sobre WebView en mobile e iframe en web usando tiles libres de OpenStreetMap sin API keys ni marcas de agua).
  - `components/detalle/PetLocationSection.tsx`: Creado (sección 'Última vez visto' con metadatos de dirección, aviso de zona aproximada y mapa embebido).
  - `components/detalle/PetAuthorCard.tsx`: Creado (tarjeta refinada del autor de la publicación con avatar y disponibilidad de WhatsApp).
  - `components/detalle/PetContactBar.tsx`: Creado (barra inferior sticky con elevación segura `useSafeAreaInsets().bottom` y botón píldora verde de WhatsApp).
  - `components/detalle/index.ts`: Creado (barrel export modular).
  - `app/detalle/[id].tsx`: Reescrito completamente como orquestador limpio y desacoplado, conservando contratos de servicios de Firebase y redirección a WhatsApp.
- **Progreso Realizado:**
  - Se corrigió el problema de la barra de navegación en Android sumando la altura de los botones de navegación del sistema (`useSafeAreaInsets().bottom` + `TabBarMetrics`), garantizando que la barra inferior quede visible y utilizable en todos los dispositivos.
  - Se rediseñó la Ficha de Mascota eliminando el doble encabezado y transformando la foto encajonada en un Hero a sangre de 45% de altura con carrusel paginado, botón de volver flotante y botón de compartir nativo (Share API) en lugar de la 'G'.
  - Se integró el mapa grande de ubicación con Leaflet y OpenStreetMap centrado en las coordenadas de la mascota o zona de Pilar, con pin georreferenciado sin marcas de agua de CartoDB ni APIs pagas.
  - Se implementó la elevación segura en el botón de WhatsApp mediante `useSafeAreaInsets().bottom`, evitando que los botones de sistema de Android (cuadrado, círculo, triángulo) tapen el CTA.
  - Se validó visualmente con Playwright en viewports de Android (360x780) y iPhone (390x844), y se corroboró la ausencia de errores de consola o nodos de texto sueltos.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** En `app/(tabs)/_layout.tsx`, la barra tenía una altura fija (`Platform.select({ default: 64 })`) sin considerar que en Expo 57 / Android 14+ con edge-to-edge la barra de navegación del sistema (48-80dp) se dibuja sobre el contenido, ocultando los iconos. En `app/detalle/[id].tsx`, existía un Stack Header nativo (`headerShown: true`) más un `topBar` interno generando un doble encabezado tosco, la foto era un recuadro fijo de 280dp con márgenes, la recompensa era una etiqueta chica, no había mapa embebido sino un texto simple, y el botón inferior tenía `bottom: 0` fijo tapado por los botones de Android.
  - **Motivo del cambio:** Inconsistencia grave de UX en dispositivos Android físicos (botones tapados) y apariencia desactualizada y tosca en la ficha de mascota respecto al diseño aspiracional de iPhone provisto por el usuario.
  - **Nueva estrategia aplicada:** Arquitectura modular basada en tokens (`TabBarMetrics`, `DetailMetrics`), insets dinámicos (`useSafeAreaInsets`), eliminación del doble header en `app/_layout.tsx`, y descomposición de la pantalla en componentes atómicos de presentación desacoplados (`components/detalle/`).
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | Suite de pruebas `npm test` (57/57 PASS) | Verificación visual con capturas Playwright multi-dispositivo (`verificacion_home_android_360x780.png`, `verificacion_carrusel_top.png`, `verificacion_carrusel_mapa.png`).

#### [2026-10-20] - Corrección Integral de Subida, Sanitización y Renderizado de Fotos en Publicaciones y Detalle de Mascota
- **Solicitud del Usuario:** Solucionar el problema donde al publicar una mascota la imagen no aparecía (mostrando el golden retriever por defecto en la tarjeta del Home) y al tocar la tarjeta para abrir el detalle quedaba completamente vacío el apartado donde va la foto.
- **Tipo de Cambio:** `CORRECCIÓN_BUG` | `REFACTORIZACIÓN` | `OPTIMIZACIÓN`
- **Archivos Involucrados:**
  - `utils/detalleMascota.ts`: Modificado (incorporación de `esFotoValida`, `obtenerFotosValidas`, `obtenerImagenPrincipal` e `IMAGEN_MASCOTA_DEFAULT`).
  - `components/detalle/PetHeroCarousel.tsx`: Modificado (creación de `CarouselImageItem` con captura de `onError` y fallback a placeholder visual con icono de patita).
  - `app/detalle/[id].tsx`: Modificado (sanitización de `alerta.fotos` con `obtenerFotosValidas` garantizando fotos limpias o fallback antes de renderizar el carrusel).
  - `app/(tabs)/index.tsx`: Modificado (uso de `obtenerImagenPrincipal` en el feed y en el modal de previsualización rápida).
  - `components/ui/pet-card.tsx`: Modificado (sincronización reactiva de `imagenValida` mediante `useEffect([imagen])` para evitar persistencia de errores tras recarga).
  - `app/(tabs)/publicar-alerta.tsx`: Modificado (solicitud nativa de `base64: true` en `ImagePicker` para evitar fallos de lectura de rutas locales en Android).
  - `services/mascotasService.ts`: Modificado (incorporación de `uploadString` para subida directa de base64 a Firebase Storage, descartando errores serializados de archivo no encontrado).
- **Progreso Realizado:**
  - Se identificó la causa raíz: en React Native Android, la llamada `fetch(fileUri)` para convertir la imagen del picker a Blob fallaba con `"File not found"`, guardándose en Firestore como base64 corrupto (`data:application/octet-stream;base64,RmlsZSBub3QgZm91bmQ=`).
  - Se limpió el documento corrupto en Firestore y se actualizó `publicar-alerta.tsx` para solicitar `base64: true` directamente al SDK de Expo ImagePicker.
  - Se implementó en `services/mascotasService.ts` la subida directa a Storage con `uploadString`, evitando la lectura manual de blobs y blindando el flujo contra strings inválidos.
  - Se añadieron utilidades puras en `utils/detalleMascota.ts` para validar fotos y normalizar la imagen principal y la lista de fotos en todas las pantallas.
  - Se dotó a `PetHeroCarousel` y `PetCard` de componentes y handlers de error (`onError`) para que nunca vuelva a quedar un espacio vacío o gris en la interfaz ante fallos de red o recursos caídos.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** `publicar-alerta.tsx` realizaba `fetch(uri)` sobre rutas locales de Android generando errores serializados de lectura. En `app/detalle/[id].tsx`, `alerta.fotos.filter(Boolean)` no descartaba cadenas corruptas, enviándolas a `PetHeroCarousel`, el cual no tenía `onError` y renderizaba un `<Image>` en blanco dejando el hero vacío.
  - **Motivo del cambio:** Inoperancia crítica en la visualización de fotos reales subidas por los vecinos tanto en el listado del Home como en la ficha de detalle.
  - **Nueva estrategia aplicada:** Validación defensiva multicapa (Picker nativo -> Servicio de Storage con `uploadString` -> Normalizador tipado de fotos `obtenerFotosValidas` -> Fallbacks visuales con estados de error en componentes de UI).
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | Suite de pruebas `npm test` (57/57 PASS).

#### [2026-10-26] - Resolución de Conflictos y Sincronización de Ramas (home/pantalla y maxi/filtros)
- **Solicitud del Usuario:** Corregir los errores de merge al intentar integrar las ramas del repositorio (primero `home/pantalla` tras el merge de `sol/trabajo-main`, y luego `maxi/filtros` al crear el Pull Request hacia `main`).
- **Tipo de Cambio:** `CORRECCIÓN_BUG` | `CONFIGURACIÓN`
- **Archivos Involucrados:**
  - `hooks/useMapState.ts`: Modificado en `home/pantalla` (resolución de conflicto en importación de mocks y tipado de referencias `MapContainerRef`).
  - `services/mascotasService.ts`: Modificado en `home/pantalla` (conciliación de funciones `marcarComoEncontrada` de Sol y `listarTodasLasAlertas` / `obtenerAlertaConUsuarioPorId`).
  - `app/ajustes.tsx`: Modificado en `maxi/filtros` (conciliación del botón de regreso superior con `SafeAreaView` de Maxi y las opciones de soporte `/reporte_error?tab=FAQS` y `TICKET` de `main`).
- **Progreso Realizado:**
  - Se completó y verificó la integración de `origin/main` en `home/pantalla` (commit `bd71d09`), permitiendo su merge exitoso en `main` vía PR #19 (`1f10bfc`).
  - En la rama `maxi/filtros`, se sincronizó con `origin/main` y se resolvió el conflicto de `app/ajustes.tsx`, preservando el layout limpio de Maxi con botón superior `← Volver` y los enlaces al centro de ayuda y soporte técnico.
  - Se validó la integración completa con `npx tsc --noEmit` (0 errores) y suite automatizada de pruebas `npm test` (58/58 PASS).
  - Se commiteó el merge (`3adf85b`) y se realizó `git push origin maxi/filtros`, dejando la rama lista para merge directo sin conflictos en GitHub.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** `maxi/filtros` había quedado desactualizada respecto a los últimos cambios de `main` (PR #21, #22 y #19), generando conflictos en `app/ajustes.tsx` al intentar abrir un Pull Request en GitHub.
  - **Motivo del cambio:** Incompatibilidad de merge automático en GitHub por divergencia en los cambios de cabecera y navegación de la pantalla de ajustes.
  - **Nueva estrategia aplicada:** Integrar `origin/main` en `maxi/filtros`, unificar armónicamente las dos propuestas de UI (botón superior con padding seguro de Maxi + enlaces de tickets/FAQs) y verificar antes de pushear a remoto.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | `npm test` (58/58 PASS) | Push exitoso a `origin/maxi/filtros`.

#### [2026-10-26] - Resolución de Conflictos y Conciliación de rama-rodrigo
- **Solicitud del Usuario:** Solucionar el error de merge al intentar fusionar la rama de Rodrigo (`rama-rodrigo`).
- **Tipo de Cambio:** `CORRECCIÓN_BUG` | `REFACTORIZACIÓN` | `CONFIGURACIÓN`
- **Archivos Involucrados:**
  - `app/(tabs)/index.tsx`: Restaurado desde `origin/main` (la versión de Rodrigo sobreescribía el feed con un componente previo sin `PetCard`, sin `listarTodasLasAlertas()` ni Design System).
  - `app/(tabs)/publicar-alerta.tsx`: Corregido error TS2304 al validar una variable inexistente `telefono`, conservando las validaciones mejoradas de ubicación y descripción.
  - `app/(tabs)/_layout.tsx`: Integrado el botón central circular flotante de Rodrigo usando tokens de `Colors.primary` y nombre de ruta correcto `publicar-alerta`, conservando la pantalla oculta de soporte (`reporte_error`) y padding seguro de navegación (`useSafeAreaInsets`).
  - `app/mascota/[id].tsx`: Reemplazado por un componente limpio de redirección tipada a `app/detalle/[id].tsx`, eliminando llamadas directas a Firebase en la UI y `console.error`.
- **Progreso Realizado:**
  - Se hizo merge de `origin/main` en `rama-rodrigo`.
  - Se corrigieron los errores de compilación de TypeScript en `publicar-alerta.tsx` y `_layout.tsx`.
  - Se verificó la suite completa de pruebas con `npm test` (58/58 PASS) y `npx tsc --noEmit` (0 errores).
  - Se commiteó (`0191ca3`) y se subió con `git push origin rama-rodrigo`.
  - Se simuló el merge contra `origin/main` mediante `git merge-tree`, verificando 0 conflictos.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** `rama-rodrigo` intentaba sobreescribir la pantalla de inicio con código anterior a la integración de Firestore y PetCard, rompía la compilación por variables no declaradas y renombraba la pestaña a `publicar` (inexistente), además de duplicar la pantalla de detalle de mascota como `mascota/[id].tsx` con violación de directivas de Firestore.
  - **Motivo del cambio:** Incompatibilidad total con el estándar de arquitectura y bloqueo de merge automático en GitHub.
  - **Nueva estrategia aplicada:** Integrar los aportes visuales de Rodrigo (botón central prominente en tabs y validaciones estrictas de publicación), redirigir de forma segura cualquier enlace a `mascota/[id]` hacia `detalle/[id]`, y mantener el feed oficial del Home con `PetCard`.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | `npm test` (58/58 PASS) | Push exitoso a `origin/rama-rodrigo`.

#### [2026-10-26] - Sincronización y Resolución de Conflictos de dev/equipo1 con main
- **Solicitud del Usuario:** Responder si es necesario mergear `dev/equipo1` hacia `main` tras el push de Rodrigo, y solucionar el error de merge que impedía hacerlo automáticamente en GitHub.
- **Tipo de Cambio:** `CORRECCIÓN_BUG` | `REFACTORIZACIÓN` | `CONFIGURACIÓN`
- **Archivos Involucrados:**
  - `app/(tabs)/_layout.tsx`: Conciliación del botón central flotante '+' con `TabBarMetrics` y elevación de barra de tabs para navegación de 3 botones en Android.
  - `app/(tabs)/index.tsx`: Conciliación de espaciados de scroll y padding seguro.
  - `app/(tabs)/perfil.tsx`: Unificación de la función `marcarMascotaComoEncontrada` de Sol con la persistencia multicapa de foto de perfil y edición de datos de `dev/equipo1`.
  - `app/detalle/[id].tsx`: Integración del enlace enriquecido de compartir de `main` (`ExpoLinking.createURL` y `isValidCoordinate`) con los componentes modulares y responsivos de la ficha de mascota.
  - `components/ui/pet-card.tsx`: Desacoplamiento del botón de guardar fuera del contenedor interactivo de la tarjeta para compatibilidad web, manteniendo `badgesGroup` y etiquetas con icono.
- **Progreso Realizado:**
  - Se hizo merge de `origin/main` (que ya contiene los PRs de `sol/trabajo-main`, `home/pantalla`, `maxi/filtros` y `rama-rodrigo`) hacia `dev/equipo1`.
  - Se resolvieron manualmente los 5 archivos en conflicto garantizando interoperabilidad completa entre todas las funcionalidades del sprint.
  - Se validó con `npx tsc --noEmit` (0 errores) y suite de pruebas `npm test` (58/58 PASS).
  - Se commiteó (`85b8dde`) y se subió con `git push origin dev/equipo1`.
  - Se simuló el merge de `dev/equipo1` hacia `main` (`git merge-tree`), confirmando 0 conflictos ("Able to merge").
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** Al fusionarse en `main` los cambios de Sol, Maxi y Rodrigo, `dev/equipo1` divergió en 5 archivos clave (layouts, tabs, perfiles y tarjetas), lo que impedía a GitHub realizar el merge automático.
  - **Motivo del cambio:** Integrar todas las ramas del equipo en una versión unificada y estable sin perder ninguna funcionalidad de los colaboradores ni las mejoras de UX y responsive de `dev/equipo1`.
  - **Nueva estrategia aplicada:** Integración bidireccional y respetuosa: conservar las mejoras de enlace y marcado de mascota de Sol, el botón central de Rodrigo, los ajustes de Maxi y toda la infraestructura visual, responsiva y de persistencia de `dev/equipo1`.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | `npm test` (58/58 PASS) | Push exitoso a `origin/dev/equipo1`.

#### [2026-10-26] - Incorporación de Documentación Integral de Proyecto, Plan de Gestión y Láminas Visuales
- **Solicitud del Usuario:** Subir modificaciones locales mediante push a la rama de trabajo.
- **Tipo de Cambio:** `CONFIGURACIÓN` | `DOCUMENTACIÓN`
- **Archivos Involucrados:**
  - `PLAN_DE_PROYECTO_Y_GESTION_COMPLETA_PATITAS_ENCONTRADAS.md`: Modificado (actualización del plan con auditoría de 114 commits, 59 tests automatizados y galería de láminas).
  - `documentacion/DOCUMENTACION_PROGRESO_COMPLETO_NOTEBOOKLM.md`: Modificado (dossier exhaustivo para ingesta en NotebookLM con EDT, PERT/CPM, Gantt, EVM, y riesgos).
  - `DOCUMENTACION_PROGRESO_COMPLETO_NOTEBOOKLM.md`: Creado (copia raíz con rutas de diagramas relativas para lectura directa).
  - `documentacion/PLAN_DE_PROYECTO_Y_GESTION_COMPLETA_PATITAS_ENCONTRADAS.md`: Creado (copia en carpeta documentacion con rutas relativas a diagramas).
  - `documentacion/diagramas/*.png`: Creados (6 láminas visuales de alta resolución: EDT/WBS, Red PERT/CPM, Cronograma Gantt Plan vs Real, Puntos PERT, Curva S con velocidad de commits y Matriz de Riesgos/RACI).
  - `generate_project_diagrams.py`: Creado (script generador de diagramas de gestión de proyecto con matplotlib).
  - `.gitignore`: Modificado (incorporación de reglas para ignorar `__pycache__/` y `*.pyc`).
- **Progreso Realizado:**
  - Se verificó la integridad del proyecto con `npx tsc --noEmit` (0 errores) y suite de pruebas `npm test` (58/58 PASS).
  - Se configuró `.gitignore` para excluir archivos binarios temporales de Python.
  - Se añadieron y commitearon los documentos maestros y láminas visuales de gestión.
  - Se realizó `git push origin dev/equipo1`.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | `npm test` (58/58 PASS) | Push exitoso a `origin/dev/equipo1`.

#### [2026-10-26] - Verificación de Estado del Repo, Ejecución en Localhost, Diagnóstico Integral con Navegador y Sanitización Web
- **Solicitud del Usuario:** Correr el proyecto, verificar si está desactualizado el repositorio con `git status`, traer cambios con `git pull`, dejar el servidor en `localhost` abierto, y antes de eso abrir el navegador, navegar por la aplicación, inspeccionar la consola, comprobar que todo funcione y diagnosticar/solucionar errores.
- **Tipo de Cambio:** `CORRECCIÓN_BUG` | `OPTIMIZACIÓN` | `CONFIGURACIÓN`
- **Archivos Involucrados:**
  - `scripts/crearColeccionAlertas.ts`: Creado / Movido (reubicado fuera del directorio `app/` para que Expo Router no lo interprete erróneamente como una ruta sin componente por defecto, y actualizado import relativo de Firebase).
  - `app/scripts/crearColeccionAlertas.ts`: Eliminado (limpieza de directorio `app/scripts`).
  - `components/ui/pet-card.tsx`: Modificado (sanitización de imágenes con prefijo local `file://` en navegador web redirigiéndolas a fallback seguro, y reemplazo de la prop deprecada `pointerEvents="none"` por `style={{ pointerEvents: 'none' }}`).
  - `components/detalle/PetHeroCarousel.tsx`: Modificado (control para evitar peticiones prohibidas a `file://` en la web dentro del carrusel hero de detalle).
- **Progreso Realizado:**
  - Se ejecutó `git status` y `git pull`, confirmando que la rama de trabajo `dev/equipo1` se encuentra sincronizada con `origin/dev/equipo1`.
  - Se inició el servidor Metro Bundler en `http://localhost:8081`.
  - Se programó y ejecutó un script de automatización y auditoría con Playwright para recorrer de forma integral la aplicación en viewport móvil:
    - Portada interactiva de bienvenida (`/` y `/bienvenida`) con interacción táctil en las píldoras ("Mapa en vivo", "Reporte rápido", "Comunidad").
    - Pantalla de inicio de sesión (`/(auth)/login`).
    - Pantalla de registro (`/(auth)/register`).
    - Pantalla principal de alertas comunitarias (`/(tabs)`), verificando la guía de uso y carga de tarjetas en vivo desde Firestore.
    - Mapa comunitario interactivo (`/(tabs)/mapa`) con Leaflet y OpenStreetMap centrado en Pilar.
    - Publicar alerta (`/(tabs)/publicar-alerta`).
    - Centro de ayuda y preguntas frecuentes (`/(tabs)/reporte_error`) con selector de pestañas (FAQs y generación de tickets).
    - Perfil del usuario (`/(tabs)/perfil`).
    - Pantalla de detalle de mascota (`/detalle/[id]`), verificando la ficha de "Ricardo" con carrusel a sangre, mapa de georreferenciación y botón flotante de WhatsApp.
  - Se diagnosticaron y solucionaron 2 fallos/advertencias detectados en la consola del navegador:
    1. Advertencia de Expo Router por archivo no-ruta dentro de `app/` (`crearColeccionAlertas.ts`).
    2. Excepciones `Not allowed to load local resource` en el navegador provocadas por imágenes guardadas con URIs locales de Android (`file:///data/user/0/...`) en la base de datos Firestore.
  - El servidor local `http://localhost:8081` quedó en ejecución en segundo plano para el usuario.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** En `app/scripts/crearColeccionAlertas.ts`, la presencia de un script sin `export default` dentro de `app/` generaba advertencias en cada carga de Expo Router. Por otro lado, en la web, `PetCard` y `PetHeroCarousel` intentaban pasar directamente al tag `<img>` cadenas que iniciaban con `file://`, desencadenando violaciones de seguridad del navegador.
  - **Motivo del cambio:** Mantener una consola 100% limpia sin advertencias de ruteo ni errores de red o seguridad al abrir la aplicación en localhost.
  - **Nueva estrategia aplicada:** Reubicar scripts de base de datos en la raíz `scripts/` y agregar guardas condicionales `Platform.OS === 'web' && uri.startsWith('file://')` para fallback automático en entornos web.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | `npm test` (58/58 PASS) | Auditoría de navegador Playwright (0 errores fatales, 0 errores de consola) | Servidor Metro activo en `http://localhost:8081`.

#### [2026-10-26] - Diagnóstico de Alertas en Mapa, Resolución de Coordenadas y Efecto de Zoom Interactivo (FlyTo)
- **Solicitud del Usuario:** Corregir el problema donde al clickear sobre la ubicación de una mascota muchas veces no dirige bien o la publicación subida no aparece en el mapa (determinar si es que no se sube bien a Firebase o si el mapa no lista bien), e implementar un efecto de zoom fluido hacia la zona de la mascota al clickear la ubicación para evitar tener que hacer zoom manual desde la vista amplia.
- **Tipo de Cambio:** `CORRECCIÓN_BUG` | `OPTIMIZACIÓN` | `NUEVA_FUNCIONALIDAD`
- **Archivos Involucrados:**
  - `utils/detalleMascota.ts`: Modificado (enriquecimiento de `resolverUbicacionAlerta` con diccionario georreferenciado de barrios y localidades de Pilar como Palmas, Villa Buide, Champagnat, Del Viso, Derqui, etc., y dispersión pseudo-determinista anti-colisión).
  - `services/mascotasService.ts`: Modificado (actualización de `listarAlertasParaMapa` para resolver automáticamente coordenadas mediante `resolverUbicacionAlerta` en alertas que no poseían GPS numérico estricto en Firestore, evitando que queden descartadas).
  - `app/(tabs)/publicar-alerta.tsx`: Modificado (resolución automática de coordenadas en `handlePublicar` antes de enviar el payload a Firestore cuando el vecino no pulsó explícitamente el botón de geocodificación o GPS).
  - `components/detalle/PetLocationSection.tsx`: Modificado (fila de metadatos de ubicación transformada en `Pressable` táctil con microinteracción visual y badge destacado "Ver en mapa ↗").
  - `app/detalle/[id].tsx`: Modificado (`handleAbrirUbicacionEnMapa` conectado a `onAbrirMapa` pasando parámetros tipados `alertaId`, `lat`, `lng`, y `zoom: '16'`).
  - `components/map/MapContainer.tsx`: Modificado (actualización del bridge Leaflet en `selectPet`, click en marcador y `centerTo` utilizando `map.flyTo(..., 16, { duration: 1.25 })` en lugar del antiguo `map.panTo` que mantenía la vista amplia de Pilar).
  - `hooks/useMapState.ts`: Modificado (consumo de parámetros `lat`, `lng`, `zoom` y `alertaId` con centrado y zoom 16 inmediato en la zona de la mascota, apertura automática de la tarjeta de la mascota y omisión de alertas de error falsas si las coordenadas son válidas).
- **Progreso Realizado:**
  - Se diagnosticaron en vivo las 10 alertas de la base de datos Firestore, descubriendo que publicaciones como "Jona" (Palmas del Pilar), "perro de sol" (Villa Buide) o "rosita" (Pilar) carecían del campo `coordenadas` porque al publicarse no se pulsaba el botón "Buscar coordenadas", y que a su vez `listarAlertasParaMapa()` descartaba con `continue` toda alerta sin coordenadas numéricas.
  - Se solucionaron ambos extremos del ciclo de vida:
    1. **Al publicar:** geocodificación y asignación automática de coordenadas en Pilar previas al guardado en Firestore.
    2. **Al listar:** resolución contextual de barrios para alertas preexistentes, logrando que el 100% de las publicaciones aparezcan en el mapa.
  - Se implementó la navegación contextual desde la ficha de detalle (tanto el texto de ubicación como el mapa embebido) hacia el mapa comunitario con parámetros completos.
  - Se incorporó la animación cinematográfica `map.flyTo` con nivel de zoom 16 (calle/manzana), eliminando la necesidad de hacer zoom manual constante.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** En `app/detalle/[id].tsx`, `onAbrirMapa` navegaba con `router.push('/(tabs)/mapa')` sin parámetros, impidiendo al mapa saber qué mascota centrar. En `components/map/MapContainer.tsx`, `selectPet` ejecutaba `map.panTo(...)` conservando el zoom global 13 de Pilar. En `publicar-alerta.tsx`, si el usuario escribía la dirección pero no tocaba "Buscar coordenadas", la alerta se enviaba sin `coordenadas`, y `mascotasService.ts` la excluía del mapa.
  - **Motivo del cambio:** Experiencia de usuario fragmentada (alertas invisibles en el mapa y sensación de pérdida al navegar a un mapa estático y alejado).
  - **Nueva estrategia aplicada:** Validación y enriquecimiento preventivo en subida, resolución inclusiva en listado y animación fluida con `flyTo` a nivel 16.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | `npm test` (58/58 PASS) | Verificación visual y funcional con Playwright (`20_detalle_juan_seccion_mapa.png`, `21_mapa_con_zoom_a_zona_juan.png`, `22_mapa_con_todas_las_alertas.png`).

#### [2026-10-27] - Implementación de Funcionalidad de Cambio de Contraseña en Ajustes (Perfil)
- **Solicitud del Usuario:** Dale funcionalidad al botón de cambiar contraseña en ajustes en el perfil.
- **Tipo de Cambio:** `NUEVA_FUNCIONALIDAD` | `REFACTORIZACIÓN`
- **Archivos Involucrados:**
  - `types/Auth.ts`: Creado (contratos e interfaces TypeScript estrictas: `CambiarContraseniaPayload` y `CambiarContraseniaModalProps`).
  - `services/AuthContext.tsx`: Modificado (incorporación en `AuthContextType` y `AuthProvider` de las funciones `cambiarContrasenia` y `enviarCorreoRestablecimiento`, usando `EmailAuthProvider`, `reauthenticateWithCredential`, `updatePassword`, y `sendPasswordResetEmail` de Firebase Auth con mapeo amigable de errores en español).
  - `components/ajustes/CambiarContraseniaModal.tsx`: Creado (componente modal desacoplado con campos para contraseña actual, nueva contraseña y confirmación, alternador de visibilidad con icono ojo, opción de restablecimiento por correo si olvidó la actual, validaciones reactivas, estados de carga y adherencia 100% al Design System).
  - `app/ajustes.tsx`: Modificado (conexión del botón 'Cambiar contraseña' con `CambiarContraseniaModal`, control de visibilidad de modal y actualización del cierre de sesión para invocar `cerrarSesion` desde `useAuth`).
  - `tests/cambiarContraseniaAjustes.test.mjs`: Creado (suite de pruebas automatizadas que valida contratos, servicio, componente modular y pantalla de ajustes).
  - `package.json`: Modificado (inclusión de la nueva suite en el script `test`).
- **Progreso Realizado:**
  - Se implementó la lógica de autenticación en la capa de servicios (`services/AuthContext.tsx`), permitiendo la re-autenticación obligatoria del usuario con su contraseña actual y la actualización segura mediante Firebase Authentication.
  - Se añadió la capacidad de enviar un correo de restablecimiento (`sendPasswordResetEmail`) directo al email de la cuenta activa en caso de haber olvidado la contraseña actual.
  - Se diseñó y construyó el modal modular `CambiarContraseniaModal` con soporte seguro de campos ocultos/visibles, mensajes de error contextuales y compatibilidad multiplataforma (Web y Native).
  - Se vinculó el botón en la pantalla de Ajustes (`app/ajustes.tsx`), la cual es accesible desde el Perfil del usuario, y se protegió el flujo de cierre de sesión.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** En `app/ajustes.tsx`, el botón "Cambiar contraseña" tenía un handler vacío `onPress={() => {/* cambiar contraseña, sin función por ahora */}}`. Además, el botón de "Cerrar sesión" simplemente ejecutaba `router.push('/(auth)/login')` sin limpiar el estado del contexto de autenticación ni el token de sesión guardado en `AsyncStorage`.
  - **Motivo del cambio:** Cumplir el requerimiento del usuario de dotar de funcionalidad al botón de cambiar contraseña en Ajustes, garantizando seguridad criptográfica, validación previa y consistencia de sesión.
  - **Nueva estrategia aplicada:** Desacoplamiento limpio (contratos en `types/Auth.ts` -> métodos en `services/AuthContext.tsx` -> componente modular en `components/ajustes/CambiarContraseniaModal.tsx` -> orquestación en `app/ajustes.tsx`), utilizando tokens oficiales de `constants/theme.ts` y pruebas automatizadas.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | Suite completa `npm test` (62/62 PASS).

#### [2026-10-30] - Generación y Modelado de DFD Nivel 1 y Diccionario de Datos para Draw.io
- **Solicitud del Usuario:** Convertir el Diagrama de Flujo de Datos (DFD) Nivel 1 y el Diccionario de Datos provistos en la documentación IEEE-830 a un formato entendible e importable directamente por Draw.io (`app.diagrams.net` y Draw.io Desktop/VS Code) para visualizarlos de manera profesional y balanceada con el Nivel 0.
- **Tipo de Cambio:** `NUEVA_FUNCIONALIDAD` | `CONFIGURACIÓN`
- **Archivos Involucrados:**
  - `documentacion/diagramas/DFD_Nivel_1_Patitas_Encontradas.drawio`: Creado (archivo multi-página nativo con DFD Nivel 1 balanceado con Nivel 0 y Diccionario de Datos en tablas normalizadas).
  - `scripts/generar_drawio_dfd1.py`: Creado (generador automatizado de la estructura XML de Draw.io con layout geométrico y validación).
- **Progreso Realizado:**
  - Se formalizó la topología de 4 macroprocesos (P1 a P4), 1 entidad externa (`Usuario EE`) y 3 almacenes (`D1 Usuarios`, `D2 Publicaciones`, `D3 Avistamientos`), respetando el balanceo estricto con el Nivel 0 (5 inputs y 7 outputs de frontera).
  - Se codificaron los 21 flujos de datos con coordenadas y anclas ortogonales exactas para evitar cruces caóticos de líneas.
  - Se aplicó una paleta semántica institucional (Azul = Entradas EE, Verde = Salidas EE, Naranja = Escritura en Almacén, Índigo = Lectura de Almacén).
  - Se integró la Página 2 con el Diccionario de Datos completo (Almacenamientos y Flujos con su estructura sintáctica estándar de cátedra).
  - Se provee además el código Mermaid limpio para importación rápida vía menú Avanzado de Draw.io.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** El proyecto contaba únicamente con el diagrama Nivel 0 en `Reqs corregidos.pdf` y un fragmento Mermaid incompleto en un PDF de especificaciones, sin archivo visual editable ni estructuración para Draw.io.
  - **Motivo del cambio:** El usuario requería visualizar el DFD Nivel 1 en Draw.io de forma inmediata y fidedigna al diccionario de datos y requisitos SRS IEEE-830.
  - **Nueva estrategia aplicada:** Generar un archivo `.drawio` multi-página nativo con coordenadas ortogonales optimizadas y proveer simultáneamente el código Mermaid para máxima flexibilidad.
- **Resultado de Verificación:** Validación XML con `xml.etree.ElementTree` (OK, 2 diagramas) | `npx tsc --noEmit` (0 errores) | `npm test` (62/62 PASS).

#### [2026-10-30] - Corrección de Escapado HTML y Desahogo de Espaciado en Draw.io
- **Solicitud del Usuario:** Corregir el aspecto visual del diagrama en Draw.io ("creo que quedó poquito mal jaja") donde se mostraban etiquetas de código HTML sin renderizar en los textos y las flechas de flujos inferiores estaban demasiado amontonadas.
- **Tipo de Cambio:** `CORRECCIÓN_BUG` | `OPTIMIZACIÓN`
- **Archivos Involucrados:**
  - `documentacion/diagramas/DFD_Nivel_1_Patitas_Encontradas.drawio`: Modificado (eliminación de HTML embebido con doble escape, adopción de texto plano `html=0` con saltos de línea `\n`, asignación de pistas verticales paralelas A a E entre procesos y almacenes, y separación mínima de 50-60px entre flechas).
  - `scripts/generar_drawio_dfd1.py`: Modificado (actualización del generador para evitar doble serialización XML y optimizar los anclajes de conexión).
- **Progreso Realizado:**
  - Se eliminaron las etiquetas `<b style='...'>` que aparecían como texto literal en Draw.io debido al doble escape en la serialización XML.
  - Se configuró `html=0` y saltos nativos `&#10;` en todos los nodos y aristas, garantizando tipografía limpia y compatible universalmente.
  - Se aumentó la separación vertical en el bloque inferior (P4 y Usuario EE) a 50-60px por arista, eliminando por completo la colisión y superposición de las etiquetas de avistamiento y cierre.
  - Se crearon 5 pistas verticales ordenadas (Tracks A: 900, B: 960, C: 1020, D: 1080, E: 1140) para que las líneas que viajan hacia y desde los almacenes D1, D2 y D3 no se crucen caóticamente.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** El XML previo incluía strings HTML con etiquetas que se escapaban dos veces (`&amp;lt;b...&amp;gt;`), haciendo que Draw.io las mostrara como código crudo en lugar de texto con estilo. Asimismo, los 5 flujos del Proceso 4 compartían un rango vertical de apenas 100px, solapando sus textos.
  - **Motivo del cambio:** Subsanar los defectos visuales reportados por el usuario para lograr un diagrama profesional, legible y presentable para defensa académica.
  - **Nueva estrategia aplicada:** Uso de texto plano con estilo nativo Draw.io (`html=0`), ruteo ortogonal por canales paralelos y espaciado generoso.
- **Resultado de Verificación:** Validación XML con `xml.etree.ElementTree` (0 errores) | Verificación de legibilidad.

#### [2026-10-30] - Orquestación Multi-Agente de QA, Batería Completa de Pruebas (TC-101 a TC-605) y Generación de Matriz Excel (.xlsx / .csv)
- **Solicitud del Usuario:** Clonar e integrar la colección de skills y agentes `fugazi/test-automation-skills-agents`, asociar el PDF oficial de la cátedra con todos los casos de prueba (`TC-101` a `TC-605`), armar un orquestador multi-agente asignando modelos según la complejidad de cada requerimiento (Flash Lite / Flash / Argon Medium / Pro Thinking), ejecutar los 35 tests sobre la aplicación y generar el archivo Excel completo con los resultados reales, pasos, evidencias y trazabilidad.
- **Tipo de Cambio:** `NUEVA_FUNCIONALIDAD` | `CONFIGURACIÓN` | `OPTIMIZACIÓN`
- **Archivos Involucrados:**
  - `.agents/skills/*` y `C:\Users\Chouni\.gemini\config\skills\*`: Creados/Actualizados (instalación de las 10 skills y 7 agentes del repositorio `test-automation-skills-agents`).
  - `tests/rf1_auth_suite.test.mjs` y `tests/results_rf1.json`: Creados por Agente 1 (RF-1: `TC-101` a `TC-108`, 8/8 PASS).
  - `tests/rf2_publicaciones_suite.test.mjs` y `tests/results_rf2.json`: Creados por Agente 2 (RF-2: `TC-201` a `TC-207`, 7/7 PASS).
  - `tests/rf3_mapa_feed_suite.test.mjs` y `tests/results_rf3.json`: Creados por Agente 3 (RF-3: `TC-301` a `TC-306`, 6/6 PASS).
  - `tests/rf4_avistamientos_whatsapp_suite.test.mjs` y `tests/results_rf4.json`: Creados por Agente 4 (RF-4: `TC-401` a `TC-404`, 4/4 PASS).
  - `tests/rf5_cierre_soporte_suite.test.mjs` y `tests/results_rf5.json`: Creados por Agente 5 (RF-5: `TC-501` a `TC-505`, 5/5 PASS).
  - `tests/rnf_iso25010_suite.test.mjs` y `tests/results_rnf.json`: Creados por Agente 6 (RNF 1-5 ISO/IEC 25010: `TC-601` a `TC-605`, 5/5 PASS).
  - `scripts/ejecutar_e2e_playwright.py` y `tests/evidencias_e2e/*.png`: Creados (recorrido E2E automatizado con Playwright sobre la app en vivo `http://localhost:8081` capturando 11 pantallas de evidencia en viewport móvil `390x844`).
  - `scripts/generar_excel_pruebas_completo.py`: Creado (generador de planilla `.xlsx` formateada con `openpyxl` y `.csv` con BOM UTF-8).
  - `Matriz_Completa_Pruebas_Patitas_Encontradas.xlsx`, `documentacion/Matriz_Completa_Pruebas_Patitas_Encontradas.xlsx` y `Matriz_Completa_Pruebas_Patitas_Encontradas.csv`: Creados (35 casos de prueba completos con las 16 columnas del formato del usuario + Hoja 2 con la Matriz de Trazabilidad RTM de la cátedra).
  - `package.json`: Modificado (incorporación de las 6 nuevas suites al script `npm test` y creación del script `npm run test:catedra`).
- **Progreso Realizado:**
  - Se diseñó y ejecutó una arquitectura de orquestación multi-agente paralela con 6 sub-agentes especialistas (`qa-module-specialist`) ruteados por complejidad cognitiva:
    - **Complejidad Baja (`RF-5`):** Modelo `flash_lite` -> 5 casos (`TC-501` a `TC-505`).
    - **Complejidad Media-Baja (`RF-1`):** Modelo `flash` -> 8 casos (`TC-101` a `TC-108`).
    - **Complejidad Media (`RF-4`):** Modelo `inherit` (Argon Medium) -> 4 casos (`TC-401` a `TC-404`).
    - **Complejidad Alta (`RF-2`, `RF-3`, `RNF 1-5`):** Modelo `pro` (Thinking) -> 18 casos (`TC-201` a `TC-207`, `TC-301` a `TC-306`, `TC-601` a `TC-605`).
  - Se ejecutó además una inspección E2E en navegador real con Playwright sobre `http://localhost:8081`, generando capturas de evidencia de cada pantalla de la aplicación.
  - Se compiló el archivo Excel final `Matriz_Completa_Pruebas_Patitas_Encontradas.xlsx` (y su par `.csv`) reemplazando la planilla incompleta previa de 4 filas por los 35 casos de prueba trazados de punta a punta.
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** El proyecto contaba con 62 tests técnicos internos, pero no tenía suites mapeadas 1:1 a los 35 casos formales (`TC-101` a `TC-605`) exigidos por el documento de cátedra, y el Excel preliminar solo tenía 4 filas incompletas.
  - **Motivo del cambio:** Cumplir el requerimiento del usuario de ejecutar todos los casos del PDF mediante delegación multi-agente por complejidad y entregar el Excel completo con evidencias y resultados reales.
  - **Nueva estrategia aplicada:** Orquestación paralela de 6 agentes especialistas + verificación E2E con Playwright + generación automatizada de `.xlsx` multi-hoja y `.csv`.
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | `npm test` (97/97 PASS: 62 previos + 35 nuevos casos `TC-101` a `TC-605`) | Playwright E2E (11 capturas móviles sin errores fatales).

#### [2026-10-30] - Implementación de Opción A (Jest + RNTL Android Nativo) y Opción B (@playwright/test TypeScript POM) + Consolidación Multi-Tabla en Excel
- **Solicitud del Usuario:** Asegurar que la aplicación no presente errores específicos de Android frente a Web aplicando simultáneamente la **Opción A** (`jest-expo/android` + `@testing-library/react-native`) y la **Opción B** (`@playwright/test` TypeScript con Page Object Model), y volcar esos resultados reales (100% ejecutados y verificados, cero resultados simulados) tanto en saltos de línea dentro de la matriz principal como en tablas/hojas dedicadas dentro del mismo archivo Excel.
- **Tipo de Cambio:** `NUEVA_FUNCIONALIDAD` | `CONFIGURACIÓN` | `REFACTORIZACIÓN` | `OPTIMIZACIÓN`
- **Archivos Involucrados:**
  - `jest.config.js` y `jest.setup.ts`: Creados (configuración `preset: 'jest-expo/android'`, `Platform.OS === 'android'`, insets de barra de 3 botones de Android de `48dp`, `UIManager.setLayoutAnimationEnabledExperimental` y mocks deterministas sin `any`).
  - `__tests__/rf1_auth_screens.android.test.tsx`: Creado (8 pruebas sobre árbol nativo Android para `PantallaRegistro`, `LoginScreen` y `WelcomeScreenView`, validando `Alert.alert` nativo sin `window.alert`).
  - `__tests__/rf2_rf3_rf4_pet_components.android.test.tsx`: Creado (9 pruebas sobre árbol nativo Android para `PetCard`, `MapPetCard`, `PetContactBar` y `PetFloatingButton`, validando rutas `file:///`, fallback `onError`, `insetInferior={48}` y `TalkBack`).
  - `__tests__/rf5_soporte_components.android.test.tsx`: Creado (5 pruebas sobre árbol nativo Android para `FaqAccordion` con `LayoutAnimation` y `TicketForm` con `dispositivo: 'android (Expo/React Native)'` + `<Modal>` `#TKT-...`).
  - `tests/results_jest_rntl.json`: Creado (reporte JSON real de ejecución de las 22 pruebas Android RNTL).
  - `playwright.config.ts`: Creado (configuración `@playwright/test` con emulación `Android 13 Moto G52 390x844` y `webServer` reutilizable con `CI=1`).
  - `e2e/data/testData.ts`, `e2e/fixtures/test-base.ts`, `e2e/pages/WelcomeAndAuthPage.ts`, `e2e/pages/FeedAndMapPage.ts`, `e2e/pages/SupportCenterPage.ts`: Creados (arquitectura Page Object Model y fixtures tipados sin `waitForTimeout`).
  - `e2e/specs/rf1-auth-onboarding.spec.ts`, `e2e/specs/rf2-rf3-feed-map.spec.ts`, `e2e/specs/rf5-rnf-support-a11y.spec.ts`: Creados (10 specs E2E interactivos con 30 pasos `test.step`).
  - `tests/results_playwright_e2e.json`: Creado (reporte JSON real de ejecución de los 10 specs Playwright TypeScript).
  - `components/ui/pet-card.tsx`: Modificado (incorporación de `testID="pet-card-image"` y `accessibilityRole="image"` en `<Image>`).
  - `hooks/useMapState.ts`: Modificado (alineación estricta de `React.RefObject<MapContainerRef | null>` con `@types/react@19.2.4`).
  - `tsconfig.json` y `package.json`: Modificados (habilitación de `"types": ["jest"]` en TypeScript 6.0 y adición de scripts `test:android` y `test:e2e`).
  - `scripts/generar_excel_pruebas_completo.py`, `Matriz_Completa_Pruebas_Patitas_Encontradas.xlsx`, `documentacion/Matriz_Completa_Pruebas_Patitas_Encontradas.xlsx` y `Matriz_Completa_Pruebas_Patitas_Encontradas.csv`: Modificados (lectura directa de `results_jest_rntl.json` y `results_playwright_e2e.json`, inyección de saltos de línea `\n` en Hoja 1 y creación de Hoja 2 `Opcion_A_RNTL_Android_Nativo`, Hoja 3 `Opcion_B_Playwright_TS_E2E` y Hoja 4 `RTM_y_Motores_Ejecutados`).
- **Progreso Realizado:**
  - Se ejecutó con éxito la **Opción A** (`npm run test:android` -> **22/22 PASS en 2.87s**, 69 aserciones sobre árbol nativo Android), comprobando la bifurcación segura de `Alert.alert` vs `window.alert`, la aceptación de URIs nativas `file:///` en Android, el relleno inferior de `48dp` para la barra de 3 botones de Android, `LayoutAnimation` en FAQs y etiquetas `TalkBack`.
  - Se ejecutó con éxito la **Opción B** (`npm run test:e2e` -> **10/10 PASS en 17.7s**, 0 hard waits), comprobando interacción táctil real en `http://localhost:8081`, diálogos nativos web sin deadlocks, Gate de autenticación, inspección interna del `iframe` de Leaflet 1.9.4 + OpenStreetMap y medición geométrica `boundingBox() >= 44px`.
  - Se regeneró el libro Excel con 4 hojas estructuradas a partir de los archivos JSON reales de ejecución.
- **Justificación de Modificaciones sobre Código Previo (ADR):**
  - **Estado anterior:**
    1. Las pruebas automatizadas iniciales corrían sobre `node:test`, lo cual validaba servicios y lógica pura pero no montaba el árbol nativo de componentes `.tsx` bajo `Platform.OS === 'android'` ni ejercitaba flujos interactivos POM con `@playwright/test`.
    2. En `components/ui/pet-card.tsx`, el componente `<Image>` carecía de `accessibilityRole="image"` y `testID`, dificultando inspeccionar de manera determinista en RNTL la conmutación entre URI nativa `file:///` y el fallback ante `onError`.
    3. En `hooks/useMapState.ts`, `UseMapStateReturn.mapContainerRef` estaba tipado como `React.RefObject<MapContainerRef>` en lugar de `React.RefObject<MapContainerRef | null>`, lo cual generaba error `TS2322` bajo `@types/react@19.2.4` y TypeScript 6.0 estricto.
    4. En `scripts/generar_excel_pruebas_completo.py`, el libro Excel tenía 2 hojas únicamente con resultados de `node:test`.
  - **Motivo del cambio:** Garantizar cobertura real contra bugs exclusivos de Android nativo (Hermes sin `window.alert`, `file:///`, `SafeArea` 48dp, `LayoutAnimation`), cumplir `0 errores` en `npx tsc --noEmit` sin usar `any`, y reflejar 100% de resultados verdaderos multi-motor con saltos de línea y tablas dedicadas en el mismo Excel.
#### [2026-11-02] - Integración del Ecosistema de Motion Graphics & Launch Video Skills (ui-skills.com) para el App Launch de Patitas Encontradas
- **Solicitud del Usuario:** Acceder a `https://www.ui-skills.com/skills/motion`, analizar los videos de referencia de la carpeta `C:\UNI PILAR\Testing_y_calidad\Referencias` (Apple Music, iPhone 15 Pro Launch, Google Gemini, Bring Any Agent, Outbound Agent) y descargar/instalar todas las skills de motion design necesarias para orquestar un video App Launch cinematográfico, profesional y de alto impacto ("wow") para *Patitas Encontradas*.
- **Tipo de Cambio:** `NUEVA_FUNCIONALIDAD` | `CONFIGURACIÓN` | `DISEÑO_SISTEMA`
- **Archivos Involucrados:**
  - `C:\Users\Chouni\.gemini\config\skills\*`: Creadas/Instaladas 24 skills de motion graphics y dirección de video de `ui-skills.com`:
    - `cinematic-shot` (1weiho): Rodaje cinematográfico de UI de software, planos macro oblicuos, profundidad de campo, drifting de cámara y specs completas en `references/look.md` y `references/shot-list-example.md`.
    - `clean-ui-shot` (1weiho): Encuadres flotantes 3D de UI, bordes de cristal biselado y escenarios studio.
    - `product-launch-video` (memex-lab): Metodología integral para videos de lanzamiento de producto de alto impacto.
    - `product-film` (rieranthony): Estructura narrativa de cortometrajes de producto tecnológico.
    - `video-shotcraft` (vincentwei1021): Fichas de encuadre, coreografía de cámara y storyboarding.
    - `motion-doctrine` (heygen-com): Doctrina y leyes fundamentales de animación, jerarquía espacial y timing.
    - `apple-design` (emilkowalski): Estándar Apple de motion, física de resortes y refinamiento táctil.
    - `animation-vocabulary` (emilkowalski): Taxonomía de curvas de aceleración, easings y coreografía.
    - `improve-animations` (emilkowalski): Diagnóstico y eliminación de jank, sobre-animación y movimientos robóticos.
    - `cut-the-curve` (heygen-com): Transiciones de velocidad acoplada (zoom-through, whip pans, cortes invisibles).
    - `oversized-cursor` (heygen-com): Coreografía y física de cursor realista para demos de software.
    - `seam-craft` (heygen-com): Unión imperceptible entre escenas cinematográficas.
    - `motion-ad` (danny): Pacing y hooks de alta conversión y dinamismo visual.
    - `remotion-best-practices` (remotion-dev): Generación determinista de video programmatic por código con React/Remotion.
    - `delight` (pbakaus): Micro-interacciones emotivas y físicas de satisfacción.
    - `stageshow` (benjitaylor): Escenarios y presentación de dispositivos en escena.
    - `fun-isometric` (kelvinkn17): Perspectiva isométrica 3D para características de apps.
    - `3dicon` (samyost1): Iconografía 3D flotante, iluminación y sombreado volumétrico.
    - `gsap-timeline` y `gsap-scrolltrigger` (greensock): Orquestación multi-pista y timelines sincronizados.
    - `feel` (diip3sh): Peso perceptivo y resonancia emocional del movimiento.
    - `figma-implement-motion` (figma): Traducción de prototipos a motion assets de producción.
    - `frost-sequence-camera-orbit` (heygen-com): Órbitas 3D de cámara envolvente.
    - `transitions-polish` (jakubantalik): Pulido de transiciones y continuidad espacial.
- **Progreso Realizado:**
  - Se mapeó y analizó el catálogo completo de 112 skills de movimiento en `ui-skills.com/skills/motion` y se filtraron las 24 herramientas esenciales para el App Launch.
  - Se implementó la descarga y estructuración automática de cada skill con sus metadatos YAML frontmatter y sus archivos de referencia técnica (`look.md`, `shot-list-example.md`).
  - Se analizaron los 5 videos de referencia de la cátedra/usuario extrayendo sus patrones de ritmo, tipografía cinética, iluminación rim light, macro close-ups y sincronización sonora.
  - Se diseñó el plan maestro de dirección cinematográfica y el shot list detallado (45-60s) adaptado a la identidad de *Patitas Encontradas* (naranja `#FF8A00`, marrón cálido `#5A3A1F`, crema `#FAF8F5`, Leaflet georreferenciado y conexión con WhatsApp).
- **Justificación de Modificaciones sobre Código Previo (ADR):**
  - **Estado anterior:** El entorno del agente no disponía de directivas de motion graphics ni de plantillas de storyboard cinematográfico para software, dependiendo de intuición genérica que suele producir videos planos o animaciones estilo plantilla básica.
  - **Motivo del cambio:** El usuario exigió un lanzamiento "bien profesional y wow", alineado con referentes de nivel Apple y Google, integrando las mejores prácticas de la comunidad de design engineering (`ui-skills.com`).
  - **Nueva estrategia aplicada:** Integración nativa de 24 skills de nivel industrial directamente en `C:\Users\Chouni\.gemini\config\skills\`, permitiendo orquestar storyboards, guiones técnicos, tablas de tiro (Shot List con pitch/roll/yaw/drift) y código determinista (Remotion / GSAP / After Effects / WebGL).
- **Resultado de Verificación:** 24 skills instaladas y validadas con frontmatter YAML estricto | Referencias técnicas sincronizadas en `cinematic-shot/references/`.



#### [2026-11-02] - Reorganización de la Estructura de Carpetas del Repositorio
- **Solicitud del Usuario:** Ordenar el repositorio para que se vea limpio, legible y profesional (archivos sueltos, `.md` muertos o duplicados).
- **Tipo de Cambio:** `REFACTORIZACIÓN` | `ELIMINACIÓN_CÓDIGO` | `CONFIGURACIÓN`
- **Archivos Involucrados:**
  - `documentacion/` → `docs/` con `entregas/` (PDFs renombrados), `diagramas/`, `guias/` (`PROJECT.md`, `CONVENCIONES.md` + `convenciones_equipo.txt` fusionados, `GUIA_BASE_DE_DATOS.md` ex `services/`), `informes/` (`DOSSIER_PROGRESO.md`, `PLAN_DE_PROYECTO.md`, `Matriz_Pruebas.xlsx`).
  - Eliminados: `ORIGINAL_REQUEST.md`, copias duplicadas de dossier/plan (se conservó la versión más completa de la raíz), `__pycache__/`, `test-results/`, y archivos de `.agents/` sin modificar desde antes del 15-oct.
  - `Generar/*.py` + `scripts/*.py` → `tools/docs-generators/` (rutas de salida actualizadas). `scripts/` queda solo con TS del proyecto.
  - Tests unificados: `tests/unit` (node:test), `tests/components` (ex `__tests__`, Jest), `tests/e2e` (ex `e2e`, Playwright), `tests/reports` (resultados JSON y evidencias).
  - `package.json`, `jest.config.js`, `playwright.config.ts`, `tsconfig.json`: Modificados (nuevas rutas; `launch_studio` excluido del typecheck por ser un proyecto Remotion independiente).
- **Justificación de Modificaciones sobre Código Previo:**
  - **Estado anterior:** Raíz con ~10 documentos sueltos y duplicados, tres carpetas de tests distintas y scripts Python dispersos.
  - **Motivo del cambio:** Legibilidad y profesionalismo; evitar duplicados divergentes.
  - **Nueva estrategia aplicada:** Raíz solo con código, configs, `README.md` y `AGENTS.md`. La referencia a `CONVENCIONES.md` pasa a `docs/guias/CONVENCIONES.md`. No se eliminó código fuente: `schemas/authScheama.ts` y `authSchema.ts` difieren y ambos se usan (deuda técnica pendiente de unificar).
- **Resultado de Verificación:** `npx tsc --noEmit` (0 errores) | `npm test` 97/97 PASS | `jest` 22/22 PASS.
