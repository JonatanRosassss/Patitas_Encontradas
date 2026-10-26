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




