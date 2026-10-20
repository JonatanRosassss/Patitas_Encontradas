import os
import json

base_path = r"C:\UNI PILAR\AppsMoviles\Patitas_Encontradas"
target_md = os.path.join(base_path, "DOCUMENTACION_PROGRESO_COMPLETO_NOTEBOOKLM.md")

content = """# 🐾 DOSSIER INTEGRAL DE PROYECTO: PATITAS ENCONTRADAS
### Estado de Avance, Arquitectura de Software, Modelo Sociocomunitario y Plan de Proyecto
**Documento Maestro Exhaustivo para Ingesta y Razonamiento en NotebookLM**

---

> **Metadatos del Proyecto:**
> - **Institución:** Universidad Nacional de Pilar (UNP)
> - **Carrera:** Tecnicatura Universitaria en Desarrollo de Software
> - **Cátedras Intervinientes:** 
>   1. *Desarrollo de Aplicaciones Móviles* (Profesor Titular / Equipo Docente)
>   2. *Taller de Formulación y Desarrollo de Proyectos Sociocomunitarios* (Comisión 4 - Prof. Yamila Ojeda)
> - **Período Académico:** Cuatrimestre 2026-2
> - **Equipo de Desarrollo (7 Integrantes):** 
>   - Yerik Ramos Ventura (UX/UI & Documentación)
>   - Jonatan Rosas / "Jona" (Auth & Architecture Lead)
>   - Rodrigo Paz (Core Data & Backend Dev)
>   - Francisco Gonzalez / "Fran" (Auth & State Lead)
>   - Maximiliano Duarte / "Maxi" (Core Data & Feed Dev)
>   - Sol Careaga / "SB" (UX/UI, Wireframes & Doc Lead)
>   - Santino / Martina Guenin (UX/UI & Onboarding Dev)
> - **Repositorio:** `Patitas_Encontradas` (Branch actual: `main`)
> - **Estado General de Pruebas:** 53 pruebas automatizadas unitarias, de integración y de estrés ejecutadas y aprobadas (100% PASS, 0 FAIL).

---

## ÍNDICE GENERAL DEL DOSSIER
1. [Resumen Ejecutivo y Declaración de Propósito](#1-resumen-ejecutivo-y-declaración-de-propósito)
2. [Diagnóstico Sociocomunitario y Modelo de Negocio / Impacto](#2-diagnóstico-sociocomunitario-y-modelo-de-negocio--impacto)
3. [Especificación Formal de Requisitos (SRS)](#3-especificación-formal-de-requisitos-srs)
4. [Arquitectura Tecnológica y Decisiones de Ingeniería](#4-arquitectura-tecnológica-y-decisiones-de-ingeniería)
5. [Estructura de Datos y Modelo de Persistencia (Firestore & Storage)](#5-estructura-de-datos-y-modelo-de-persistencia-firestore--storage)
6. [Inventario Exhaustivo de Archivos y Componentes del Repositorio](#6-inventario-exhaustivo-de-archivos-y-componentes-del-repositorio)
7. [Radiografía del Avance Actual: Módulos 100% Implementados](#7-radiografía-del-avance-actual-módulos-100-implementados)
8. [Planificación Ágil, Células de Trabajo y Tareas del Sprint 3](#8-planificación-ágil-células-de-trabajo-y-tareas-del-sprint-3)
9. [Estructura de Desglose del Trabajo (EDT / WBS) Integral](#9-estructura-de-desglose-del-trabajo-edt--wbs-integral)
10. [Matriz de Pruebas Automatizadas y Criterios de Aceptación (DoD)](#10-matriz-de-pruebas-automatizadas-y-criterios-de-aceptación-dod)
11. [Guía de Preguntas Frecuentes y Defensa Técnica Oral](#11-guía-de-preguntas-frecuentes-y-defensa-técnica-oral)
12. [Backlog Pendiente y Hoja de Ruta Inmediata (Próxima Semana)](#12-backlog-pendiente-y-hoja-de-ruta-inmediata-próxima-semana)

---

## 1. RESUMEN EJECUTIVO Y DECLARACIÓN DE PROPÓSITO

### 1.1 El Problema Territorial en el Municipio de Pilar
En las diversas localidades del Municipio de Pilar (Pilar Centro, Barrio Champagnat, Del Viso, Derqui, Fátima, Villa Rosa), la pérdida y abandono de animales domésticos constituye una problemática cotidiana con severo impacto emocional, sanitario y social.
Actualmente, los vecinos enfrentan un ecosistema de búsqueda fragmentado, ineficiente y precario:
- **Pegada física de carteles:** Costosa, lenta y efímera; los carteles son destruidos por la lluvia o retirados en menos de 48 horas.
- **Grupos masivos de redes sociales (Facebook, WhatsApp, Instagram):** El algoritmo dispersa la información rápidamente. Un reporte publicado pierde visibilidad en cuestión de horas. No existe indexación por cercanía geográfica ni filtrado por estado.
- **Pérdida de la 'Ventana de Oro':** Las primeras 24 a 48 horas tras el extravío son determinantes. La carencia de una notificación barrial inmediata reduce drásticamente la probabilidad de reencuentro.

### 1.2 La Propuesta de Valor de 'Patitas Encontradas'
**Patitas Encontradas** es una plataforma móvil barrial y colaborativa orientada a la georreferenciación inmediata de mascotas perdidas, avistadas y encontradas en Pilar.
- **Publicación ágil en menos de 60 segundos:** Captura fotográfica con cámara nativa o galería, geolocalización automática por GPS y geocodificación inversa de direcciones barriales.
- **Mapa interactivo territorial sin dependencias privativas:** Visualización georreferenciada sobre Leaflet y OpenStreetMap (CartoDB Voyager), permitiendo a cualquier vecino ver qué animales se buscan o vieron a pocas cuadras a la redonda sin requerir Google Play Services.
- **Conexión comunitaria directa:** Enlace transparente y en un toque hacia WhatsApp con el publicador original para coordinar el rescate o devolución sin intermediarios burocráticos.
- **Sostenibilidad solidaria:** Modelo de autosustento basado en la venta comunitaria de chapitas identificatorias con código QR vinculadas a la ficha médica y de contacto de la mascota.

---

## 2. DIAGNÓSTICO SOCIOCOMUNITARIO Y MODELO DE NEGOCIO / IMPACTO

### 2.1 Matriz de Actores Involucrados
| Actor / Grupo | Interés / Rol en el Ecosistema | Nivel de Influencia | Impacto Directo |
|:---|:---|:---:|:---|
| **Dueños de Mascotas (Vecinos de Pilar)** | Recuperar a su animal extraviado de forma urgente y sin costos abusivos. | Alto | Beneficiario Primario |
| **Vecinos Solidarios / Rescatistas** | Notificar avistamientos de animales callejeros o perdidos sin asumir adopciones definitivas forzosas. | Alto | Beneficiario Primario / Informante Clave |
| **Refugios y ONGs Proteccionistas** | Descomprimir la sobrepoblación en refugios fomentando reencuentros antes del ingreso a caniles. | Medio-Alto | Aliado Estratégico |
| **Veterinarias Barriales de Pilar** | Puntos de referencia barrial, lectura de chapitas QR y difusión de campañas sanitarias. | Medio | Socio Estratégico / Canal Comercial Solidario |
| **Municipio de Pilar (Zoonosis)** | Control poblacional, trazabilidad sanitaria y reducción de accidentes viales provocados por animales sueltos. | Alto | Actor Institucional |
| **Administradores / Moderadores (UNP)** | Mantenimiento de la plataforma, moderación de reportes falsos y soporte a la comunidad. | Alto | Operador del Sistema |

### 2.2 Árbol de Problemas y Efectos
```
                 [ EFECTOS DERIVADOS ]
   Accidentes viales   |   Proliferación de zoonosis   |   Dolor y duelo familiar
   en rutas de Pilar   |   y animales en desnutrición  |   por pérdidas prolongadas
              ▲                         ▲                         ▲
              └─────────────────────────┼─────────────────────────┘
                                        │
           [ PROBLEMA CENTRAL SOCIOCOMUNITARIO ]
   "Desarticulación, demora e ineficacia en los mecanismos de
    comunicación vecinal para la recuperación de mascotas en Pilar"
                                        │
              ┌─────────────────────────┴─────────────────────────┐
              ▼                         ▼                         ▼
   Falta de georreferenciación    Cartelería efímera y    Dispersión en algoritmos
   y radio barrial en alertas     contaminación visual    de redes sociales masivas
                 [ CAUSAS RAÍZ IDENTIFICADAS EN EL DIAGNÓSTICO ]
```

### 2.3 Modelo de Sostenibilidad y Tienda Solidaria
Para garantizar que la aplicación sea gratuita para todos los vecinos sin recurrir a publicidad intrusiva:
1. **Chapitas Identificatorias QR Solidarias:** Venta a precio accesible de placas metálicas grabadas con QR. Al escanear el QR desde cualquier celular, se abre la ficha pública de la mascota con teléfonos de emergencia y ficha médica.
2. **Carrito de Compras Solidario:** Integración en la aplicación del flujo de compra y entrega en veterinarias adheridas de Pilar.
3. **Puntos Amigos:** Veterinarias asociadas que actúan como centros de retiro de chapitas y puntos de escaneo de animales encontrados.

---

## 3. ESPECIFICACIÓN FORMAL DE REQUISITOS (SRS)

Conforme al documento oficial `Reqs corregidos.pdf` aprobado por la cátedra:

### 3.1 Requisitos Funcionales (RF)

#### RF-1: Gestión de Cuentas de Usuario y Sesión
- **1.1 Introducción:** Permite a vecinos y rescatistas crear una cuenta, autenticarse, recuperar accesos y gestionar sus datos personales.
- **1.2 Entradas (Inputs):** Correo electrónico, contraseña, nombre completo, teléfono de contacto (WhatsApp), foto de perfil y zona de residencia.
- **1.3 Procesamiento:**
  - Validación de formato de correo y no duplicidad en Firebase Auth / Base de Datos.
  - Validación de contraseña segura mediante esquemas Zod (`authScheama.ts`).
  - Creación de identidad unívoca (`uid`) y documento en colección `usuarios`.
  - Persistencia del token de sesión nativo mediante `AsyncStorage`.
- **1.4 Salidas (Outputs):** Estado de sesión activo global (Zustand / `AuthContext`), perfil instanciado y redirección a `(tabs)`.
- **1.5 Manejo de Excepciones:** Correo duplicado emite error amigable; credenciales inválidas activan alerta nativa; recuperación de contraseña despacha correo transaccional de reseteo.

#### RF-2: Publicación de Alertas de Mascotas (Alta / Modificación / Baja)
- **1.1 Introducción:** Permite reportar un animal perdido o encontrado georreferenciándolo con precisión.
- **1.2 Entradas (Inputs):** Tipo de reporte (`PERDIDO` | `ENCONTRADO` / `VISTO`), nombre (si aplica), especie (`PERRO`, `GATO`, `OTRO`), raza/rasgos, descripción, fotos (cámara o galería), coordenadas GPS (latitud, longitud), ubicación textual y recompensa (opcional).
- **1.3 Procesamiento:**
  - Validación de completitud y coordenadas válidas (`isValidCoordinate` dentro de los límites de Pilar: latitud [-34.55, -34.35], longitud [-59.05, -58.80]).
  - Carga asíncrona de imágenes a Firebase Storage y obtención de URLs de descarga públicas.
  - Generación de documento en Firestore (`alertas`) con `serverTimestamp()` y estado inicial `PERDIDO` o `ENCONTRADO`.
  - Vinculación al `uid` del usuario autenticado (`creadoPor`).
- **1.4 Salidas (Outputs):** Identificador unívoco `idAlerta`, notificación de publicación exitosa y reflejo instantáneo en el Feed y en el Mapa.
- **1.5 Manejo de Excepciones:** Bloqueo de publicación ante coordenadas `null`/`NaN` o falta de fotos requeridas; solo el autor del reporte tiene permisos para editar o eliminar la publicación (`perfil.tsx`).

#### RF-3: Consulta de Mapa Interactivo y Feed de Alertas
- **1.1 Introducción:** Exploración territorial e interactiva de alertas activas mediante mapa y lista con filtros combinados.
- **1.2 Entradas (Inputs):** Coordenadas del usuario (GPS en tiempo real), filtro por estado (`Todos`, `Perdidos`, `Encontrados`), texto de búsqueda (nombre, raza, barrio).
- **1.3 Procesamiento:**
  - Consulta en tiempo real a Firestore de reportes activos (`listarAlertasParaMapa` / `listarTodasLasAlertas`).
  - Filtrado en memoria de coordenadas seguras para evitar excepciones en el motor de renderizado.
  - Comunicación bidireccional entre React Native y Leaflet mediante el puente de eventos (`postMessage` / `injectJavaScript`).
- **1.4 Salidas (Outputs):** Marcadores coloreados por estado (rojo para perdidos, verde para encontrados), tarjetas emergentes flotantes (`MapPetCard`), feed ordenado con pull-to-refresh.
- **1.5 Manejo de Excepciones:** Sin conexión a red, carga automática del dataset de respaldo offline (`mapMockData.ts` y `MASCOTAS` mock); si no hay resultados en el radio, mensaje contextual amigable.

#### RF-4: Gestión de Avistamientos, Contacto y Resolución
- **1.1 Introducción:** Mecanismos de interacción comunitaria ante el avistamiento de un animal o el éxito en la búsqueda.
- **1.2 Entradas (Inputs):** Identificador de alerta (`id`), acción requerida (`CONTACTAR` | `REPORTAR_AVISTAMIENTO` | `MARCAR_ENCONTRADO`).
- **1.3 Procesamiento:**
  - Acción de contacto: Extracción del teléfono sanitizado y apertura de WhatsApp mediante `Linking.openURL('https://wa.me/549...')` con mensaje precargado.
  - Marcado de resolución: Cambio de estado a `ENCONTRADO` en Firestore; el pin se desactiva del mapa de alertas vigentes.
- **1.4 Salidas (Outputs):** Transición de pantalla a WhatsApp, confirmación de caso resuelto en la comunidad.
- **1.5 Manejo de Excepciones:** Intento de modificación por un no-autor bloqueado por reglas de seguridad y validación de UI.

#### RF-5: Centro de Ayuda, Soporte e Incidencias (Completamente Implementado)
- **1.1 Introducción:** Módulo de atención al vecino con preguntas frecuentes organizadas y formulario de tickets directos a base de datos.
- **1.2 Entradas (Inputs):** Selección de categorías FAQ, formulario de ticket (Título, Tipo de Problema, Descripción, Correo de Contacto, Dispositivo).
- **1.3 Procesamiento:** Registro en colección Firestore `tickets_soporte` con estado inicial `ABIERTO` y trazabilidad del usuario logueado.
- **1.4 Salidas (Outputs):** `ticketId` generado, modal de agradecimiento y retorno al centro de ayuda.

### 3.2 Requisitos No Funcionales (RNF)
- **RNF-1 (Independencia de Servicios Privativos):** Cero dependencia de Google Play Services o Google Cloud Billing; mapas ejecutados sobre Leaflet y OpenStreetMap.
- **RNF-2 (Rendimiento y Fluidez en Gama Media/Baja):** Listas optimizadas con `@shopify/flash-list` y `FlatList` virtualizada, asegurando 60 FPS en Android.
- **RNF-3 (Resiliencia Offline y Modo Demostración):** Arquitectura dual con mocks tipados (`authMock.ts`, `mapMockData.ts`) que permiten operar sin internet ante cortes en el aula o defensas académicas.
- **RNF-4 (Seguridad y Persistencia de Sesión):** Tokens de sesión asegurados con `@react-native-async-storage/async-storage` y compatibilidad nativa con Firebase Auth v10.
- **RNF-5 (Diseño Atómico y Accesibilidad):** Tokens de diseño unificados en `constants/theme.ts` y `theme/tokens.ts`, botones con área táctil mínima de 44x44 dp y soporte de lectores de pantalla.

---

## 4. ARQUITECTURA TECNOLÓGICA Y DECISIONES DE INGENIERÍA

### 4.1 Ficha Técnica del Stack
- **Framework Base:** React Native 0.86.3 + Expo SDK ~57.0.26 (New Architecture ready).
- **Lenguaje:** TypeScript 5.0+ en modo estricto (`strict: true`).
- **Enrutamiento:** Expo Router ~57.0.24 (File-based routing con Stacks, Tabs y Dynamic Routes `[id].tsx`).
- **Estilos:** NativeWind 4.0.36 (Tailwind CSS 3.4.7) complementado con Design Tokens centralizados en TypeScript.
- **BaaS (Backend as a Service):** Firebase 10.14.1 (Authentication + Cloud Firestore + Firebase Storage).
- **Persistencia Nativa:** `@react-native-async-storage/async-storage` 2.2.0 conectado a `initializeAuth`.
- **Motor de Mapas:** `react-native-webview` 13.16.1 ejecutando Leaflet.js 1.9.4 en memoria HTML con teselas CartoDB Voyager.
- **Hardware Nativo:** `expo-camera` ~57.0.6, `expo-image-picker` ~57.0.20, `expo-location` ~57.0.20.
- **Validación y Formularios:** Zod 3.23.8 + React Hook Form 7.52.1 + `@hookform/resolvers` 3.9.0.
- **Gestión de Estado:** Zustand 4.5.4 (Store global ligero sin sobrecarga de Providers).

### 4.2 Justificación de Decisiones Críticas de Arquitectura

#### A) Leaflet.js + WebView vs. `react-native-maps` (Solución a la Pantalla Negra)
- **Problema de la librería tradicional:** `react-native-maps` en Android exige obligatoriamente Google Play Services instalados y una API Key de Google Maps Platform con tarjeta de crédito asociada. En emuladores de desarrollo de laboratorio de la UNP o en celulares sin servicios de Google, la app falla silenciosamente mostrando un rectángulo negro vacío.
- **Nuestra Solución de Ingeniería:** Implementamos una pantalla WebView aislada (`components/map/MapContainer.tsx`) que compila un HTML con Leaflet 1.9.4 y teselas libres de CartoDB Voyager/OSM.
- **Puente Bidireccional de Eventos (Event Bridge):**
  - *React Native ➔ WebView:* Envío de comandos mediante `injectJavaScript()` (`window.mapBridge.setMarkers(pets)`, `centerTo(lat, lng)`, `zoomIn()`, `zoomOut()`, `setUserLocation()`).
  - *WebView ➔ React Native:* Emisión de eventos mediante `window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }))` capturando eventos tipados (`MAP_READY`, `MARKER_CLICK`, `MAP_CLICK`, `MAP_ERROR`).

#### B) Singleton de Conexión: `ConexionFirebase`
Para evitar que los 7 desarrolladores configuren credenciales, inicializaciones redundantes o lidien con el error de persistencia nativa, se diseñó la clase estática `ConexionFirebase` (`services/ConexionFirebase.ts`).
- Centraliza `getApps().length === 0 ? initializeApp(...) : getApp()`.
- Resuelve la incompatibilidad de `localStorage` en Android/iOS inyectando `getReactNativePersistence(AsyncStorage)`.
- Exporta métodos limpios: `obtenerFirestore()`, `obtenerAuth()`, `obtenerStorage()`.

#### C) Patrón de Resiliencia con Mocks Tipados
La app detecta fallos de conectividad o demoras en la nube y conmuta suavemente entre datos en vivo de Firestore y datos locales tipados (`data/mapMockData.ts`, `services/authMock.ts`). Esto garantiza que la app nunca se congele en una presentación o evaluación académica.

---

## 5. ESTRUCTURA DE DATOS Y MODELO DE PERSISTENCIA (FIRESTORE & STORAGE)

### 5.1 Colección: `alertas` (Mascotas Perdidas y Encontradas)
Almacena cada reporte emitido en la plataforma.
```typescript
interface DocumentoAlerta {
  id: string;                         // Generado por Firestore (auto-ID)
  nombre?: string;                    // Nombre de la mascota (si se conoce)
  especie: 'PERRO' | 'GATO' | 'OTRO'; // Enumeración de especie
  estado: 'PERDIDO' | 'ENCONTRADO' | 'VISTO'; // Estado de la alerta
  descripcion: string;                // Rasgos distintivos, tamaño, collar
  fotos?: string[];                   // URLs de Firebase Storage
  ubicacion: string;                  // Dirección barrial o descripción textual
  coordenadas?: {                     // Objeto geográfico validado
    latitude: number;                 // -90 a 90 (Rango Pilar: -34.4x)
    longitude: number;                // -180 a 180 (Rango Pilar: -58.9x)
  };
  contacto?: string;                  // Teléfono o WhatsApp de contacto
  recompensa?: string | null;         // Monto ofrecido (opcional)
  creadoPor?: string;                 // UID del usuario en Firebase Auth
  fechaReporte: string;               // ISO 8601 string
  creadoEnServidor: Timestamp;        // FieldValue.serverTimestamp()
}
```

### 5.2 Colección: `usuarios` (Perfiles Comunitarios)
```typescript
interface DocumentoUsuario {
  uid: string;                        // UID provisto por Firebase Auth
  email: string;                      // Correo electrónico principal
  nombre: string;                     // Nombre completo o apodo barrial
  telefono?: string;                  // Teléfono para WhatsApp
  fotoPerfil?: string;                // URL de avatar en Firebase Storage
  zonaResidencia?: string;            // Localidad/Barrio de Pilar
  fechaRegistro: string;              // ISO 8601 string
}
```

### 5.3 Colección: `tickets_soporte` (Mesa de Ayuda e Incidencias)
```typescript
interface DocumentoTicket {
  id: string;                         // Generado por Firestore
  usuarioId: string | null;           // UID si estaba logueado o null
  nombreContacto: string;             // Nombre informado por el usuario
  emailContacto: string;              // Correo electrónico de respuesta
  tipoProblema: 'ERROR_TECNICO' | 'PUBLICACION_INCORRECTA' | 'SUGERENCIA' | 'PROBLEMA_CUENTA' | 'OTRO';
  titulo: string;                     // Resumen de la consulta
  descripcion: string;                // Detalle del problema
  estado: 'ABIERTO' | 'EN_REVISION' | 'RESUELTO';
  fechaCreacion: string;              // ISO 8601 string
  creadoEnServidor: Timestamp;        // serverTimestamp()
  dispositivo: string;                // Información del entorno (OS/Plataforma)
}
```

### 5.4 Estructura en Firebase Storage
- `/mascotas/{timestamp}_{nombre_archivo}.jpg`: Fotografías comprimidas de reportes.
- `/perfiles/{uid}/avatar.jpg`: Fotos de perfil de usuarios.

---

## 6. INVENTARIO EXHAUSTIVO DE ARCHIVOS Y COMPONENTES DEL REPOSITORIO

```text
Patitas_Encontradas/
├── app/                                 # Enrutamiento basado en archivos (Expo Router)
│   ├── _layout.tsx                      # Layout raíz: Fonts (Baloo 2, Nunito), AuthProvider, Stacks
│   ├── index.tsx                        # Redirector condicional (verifica login y guía de uso)
│   ├── ajustes.tsx                      # Pantalla de Ajustes: Notificaciones, Cuenta, Accesos a Soporte
│   ├── (auth)/                          # Flujo de autenticación (Stack aislado)
│   │   ├── login.tsx                    # Login con Zod, Firebase Auth y fallback con AuthMock
│   │   ├── register.tsx                 # Registro con validación de contraseña y confirmación
│   │   ├── forgetPassword.tsx           # Recuperación de contraseña vía correo transaccional
│   │   └── createAccount.tsx            # Redirección amigable a registro
│   ├── (tabs)/                          # Navegación principal persistente (Bottom Tabs)
│   │   ├── _layout.tsx                  # Configuración visual de tabs e iconos Lucide
│   │   ├── index.tsx                    # Home Feed: Listado con pull-to-refresh, modal card y filtros
│   │   ├── mapa.tsx                     # Orquestador ligero del mapa interactivo (< 150 líneas)
│   │   ├── publicar-alerta.tsx          # Formulario de publicación con GPS, geocoding y fotos
│   │   ├── perfil.tsx                   # Mi Perfil: Mis alertas reales, eliminar post con comprobación
│   │   └── reporte_error.tsx            # Centro de Ayuda: Tabs para FAQs interactivas y Tickets
│   └── detalle/
│       └── [id].tsx                     # Vista dinámica de detalle de mascota (scaffold en desarrollo)
├── components/                          # Componentes reutilizables modulares
│   ├── GuiaDeUso.tsx                    # Walkthrough interactivo paso a paso para nuevos usuarios
│   ├── map/                             # Módulo desacoplado de mapas Leaflet
│   │   ├── MapContainer.tsx             # WebView con plantilla HTML Leaflet 1.9.4 y puente de eventos
│   │   ├── MapSearchBar.tsx             # Barra de búsqueda contextual con diseño de tokens
│   │   ├── MapFilterChips.tsx           # Selector de filtros (Todos, Perdidos, Encontrados)
│   │   ├── MapPetCard.tsx               # Tarjeta flotante con hitSlop accesible y acciones
│   │   └── MapControls.tsx              # Botones flotantes de GPS (centrado) y Zoom (touch >= 44dp)
│   ├── soporte/                         # Módulo del Centro de Ayuda
│   │   ├── FaqAccordion.tsx             # Acordeón de 9 preguntas categorizadas con buscador
│   │   └── TicketForm.tsx               # Formulario de incidencias con feedback en modal animado
│   └── ui/                              # Componentes atómicos (Atomic Design)
│       ├── Button.tsx                   # Botón polimórfico (onPress/onClick, loading, variantes)
│       └── pet-card.tsx                 # Tarjeta de mascota para el listado del Home
├── constants/
│   ├── theme.ts                         # Design Tokens: Colors, Typography, Spacing, Radius, Insets
│   └── firebaseConfig.js                # Referencia de variables de entorno de Firebase
├── data/                                # Datos mock estructurados para resiliencia offline
│   ├── mapMockData.ts                   # Mascotas con coordenadas reales verificadas en Pilar
│   ├── mockData.ts                      # Datos de prueba para feed y estados
│   └── faqsData.ts                      # 9 preguntas frecuentes oficiales clasificadas en 4 tópicos
├── hooks/
│   └── useMapState.ts                   # Custom Hook: Estado integral del mapa, GPS, filtros y puente
├── schemas/
│   └── authScheama.ts                   # Esquema Zod de validación de autenticación
├── services/                            # Lógica de negocio y persistencia
│   ├── firebase.ts                      # Instancia exportada de db, auth y storage
│   ├── ConexionFirebase.ts              # Singleton orquestador de Firebase con persistencia nativa
│   ├── AuthContext.tsx                  # Contexto y Hook useAuth con listener onAuthStateChanged
│   ├── authMock.ts                      # Mock determinístico (profesor@patitas.com / 123456)
│   ├── mascotasService.ts               # CRUD completo de alertas en Firestore y fotos en Storage
│   ├── geocodingService.ts              # Geocodificación directa de Pilar con presets barriales
│   └── soporteService.ts                # Envío y consulta de tickets en Firestore
├── tests/                               # Suite de pruebas automatizadas con Node Test Runner
│   ├── geoValidation.test.mjs           # Validación matemática y de fronteras de coordenadas
│   ├── challenger2_integration.test.mjs # Integración del mapa modular, puente y accesibilidad
│   ├── challenger_stress.test.mjs       # Pruebas de estrés de búsqueda y filtros combinados
│   ├── faqSection.test.mjs              # Integridad del catálogo de FAQs y acordeón
│   ├── ticketCollectionAndForm.test.mjs # Validación de esquema y contrato de tickets
│   ├── mapFirebasePoints.test.mjs       # Mapeo de datos Firestore a pines Leaflet
│   └── publicarAlertaService.test.mjs   # Sanitización de campos y subida de publicaciones
├── theme/
│   └── tokens.ts                        # Subconjunto de tokens para componentes aislados
├── types/                               # Definiciones de TypeScript
│   ├── Pet.ts                           # Entidad Pet, NuevaAlerta, ActualizarAlerta, Filtros
│   ├── map.ts                           # Coordinates, MapPet, MapState, MapBridgeMessage
│   ├── MapPoint.ts                      # GeoJSON Point representation
│   ├── Ticket.ts                        # TicketSoporte, TipoTicket, EstadoTicket, NuevoTicketInput
│   └── User.ts                          # Usuario interface
└── utils/
    └── geoValidation.ts                 # Funciones puras de validación de coordenadas
```

---

## 7. RADIOGRAFÍA DEL AVANCE ACTUAL: MÓDULOS 100% IMPLEMENTADOS

### 7.1 Módulo de Autenticación y Sesión Persistente (Completado)
- **Implementación:** Pantallas `login.tsx`, `register.tsx` y `forgetPassword.tsx` bajo el subárbol `(auth)`.
- **Características:** 
  - Soporta autenticación real en Firebase Auth y sesión offline con `authMock.ts`.
  - Persistencia de sesión mediante `AsyncStorage` integrado a `initializeAuth`.
  - Validación preventiva con esquemas Zod en cliente antes de disparar llamadas de red.
  - Contexto global `AuthContext` que propaga el usuario activo a toda la aplicación.

### 7.2 Módulo de Mapa Interactivo Desacoplado (Completado)
- **Implementación:** `app/(tabs)/mapa.tsx` y suite en `components/map/`.
- **Características:**
  - Reducción del screen orquestador a 142 líneas de código (cumple con la meta `< 150`).
  - Motor Leaflet 1.9.4 en WebView con teselas CartoDB Voyager; cero uso de API Keys de Google.
  - Filtros instantáneos por chips ('Todos', 'Perdidos', 'Encontrados').
  - Buscador textual que filtra en tiempo real por nombre de mascota, raza o barrio de Pilar.
  - Control de GPS nativo (`expo-location`) que centra la vista y ubica al usuario con un marcador animado.
  - Tarjeta emergente (`MapPetCard`) con botón de cierre accesible (`hitSlop={12}`) y navegación a detalle.

### 7.3 Módulo de Publicación de Alertas con Hardware Nativo (Completado)
- **Implementación:** `app/(tabs)/publicar-alerta.tsx`.
- **Características:**
  - Selector dual de intención: "¿Perdiste a tu mascota?" vs. "¿Encontraste o viste una mascota?".
  - Integración nativa con la galería de fotos (`expo-image-picker`) permitiendo múltiples imágenes.
  - Adquisición de ubicación actual por GPS o búsqueda por nombre de barrio/calle en Pilar mediante el servicio de geocodificación inversa con presets locales (`ZONAS_PILAR_PRESETS`).
  - Sanitización estricta de objetos antes del envío a Firestore (`limpiarUndefined`) previniendo excepciones por campos nulos.
  - Carga automática de imágenes a Firebase Storage y obtención de URLs seguras.

### 7.4 Módulo de Centro de Ayuda y Soporte Comunitario (Completado)
- **Implementación:** `app/(tabs)/reporte_error.tsx`, `components/soporte/FaqAccordion.tsx` y `components/soporte/TicketForm.tsx`.
- **Características:**
  - Selector por solapas accesible para alternar entre "Preguntas Frecuentes" y "Generar Ticket".
  - Acordeón interactivo con 9 preguntas oficiales clasificadas en Publicaciones, Mapa, Avistamientos y Cuenta.
  - Formulario de incidencias conectado a la colección Firestore `tickets_soporte` con selector de motivos, validación en vivo y modal animado de confirmación.

### 7.5 Módulo de Perfil y Gestión de Publicaciones Propias (Completado)
- **Implementación:** `app/(tabs)/perfil.tsx`.
- **Características:**
  - Lectura en tiempo real de las publicaciones creadas exclusivamente por el usuario logueado (`listarAlertasPorUsuario(usuario.uid)`).
  - Eliminación segura condicionada a autoría con confirmación modal y soporte polimórfico (Web `window.confirm` y Móvil `Alert.alert`).
  - Cambio de foto de perfil con carga desde galería.
  - Cierre de sesión seguro con redirección a login.

### 7.6 Módulo de Onboarding y Guía Interactiva (Completado)
- **Implementación:** `components/GuiaDeUso.tsx`.
- **Características:**
  - Recorrido guiado paso a paso con recortes visuales (`measureInWindow`) destacando el botón de publicar, los filtros y las tarjetas de mascota.
  - Persistencia del estado en `AsyncStorage` (`guiaDeUsoVista`) para mostrarse una única vez en la primera apertura.

---

## 8. PLANIFICACIÓN ÁGIL, CÉLULAS DE TRABAJO Y TAREAS DEL SPRINT 3

Para optimizar el esfuerzo de los 7 integrantes del equipo minimizando colisiones en Git, el proyecto se estructuró bajo el marco de **3 células autónomas (2 + 2 + 3)**:

```
                          [ EQUIPO PATITAS ENCONTRADAS (7 INTEGRANTES) ]
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         ▼                                    ▼                                    ▼
  [ CÉLULA 1: AUTH & SESIÓN ]         [ CÉLULA 2: CORE & DATA ]             [ CÉLULA 3: UX/UI & DOCS ]
    • Jona (Lead)                       • Maxi (Backend Dev)                  • Sol (Doc Lead)
    • Francisco (Auth Lead)             • Rodrigo (Core Dev)                  • Yerik (UX Lead)
                                                                              • Santino / Martina (UI Dev)
```

### 8.1 Matriz de Asignación de Tareas del Sprint 3
| # | Tarea Técnica | Célula Responsable | Integrantes | Rama Git Asignada | Estado Actual |
|:---:|:---|:---:|:---|:---|:---:|
| **1** | Subir Login y variable de sesión persistente | Célula 1 (2 pers.) | Jona & Francisco | `feat/auth-login-session` | **COMPLETO** |
| **2** | Obtener usuario autenticado en toda la app | Célula 1 (2 pers.) | Jona & Francisco | `feat/auth-user-context` | **COMPLETO** |
| **3** | Botón de eliminar publicación solo si es autor | Célula 1 (2 pers.) | Jona & Francisco | `feat/delete-post-author-check` | **COMPLETO** |
| **4** | Listar publicaciones en Perfil y pines en Mapa | Célula 1 (2 pers.) | Jona & Francisco | `feat/profile-user-posts-map` | **COMPLETO** |
| **5** | Conectar Home Feed a base de datos Firestore | Célula 2 (2 pers.) | Maxi & Rodrigo | `feat/home-feed-database` | **COMPLETO** |
| **6** | Detalle de mascota desde BD y enlace a WhatsApp | Célula 2 (2 pers.) | Maxi & Rodrigo | `feat/pet-detail-whatsapp` | **EN PROGRESO** |
| **7** | Verificación y pruebas del ciclo CRUD completo | Célula 2 (2 pers.) | Maxi & Rodrigo | `test/crud-integration-verification` | **COMPLETO** |
| **8** | Elaboración de bosquejos y wireframes en Padlet | Célula 3 (3 pers.) | Sol, Yerik & Santino | `design/padlet-wireframes` | **COMPLETO** |
| **9** | Pantalla de Bienvenida / Onboarding informativo | Célula 3 (3 pers.) | Sol, Yerik & Santino | `feat/welcome-info-screen` | **EN PROGRESO** |
| **10**| Redacción secciones 5 a 9 del Incremento 2 | Célula 3 (3 pers.) | Sol, Yerik & Santino | `docs/incremento-2-part2` | **EN REVISIÓN** |

---

## 9. ESTRUCTURA DE DESGLOSE DEL TRABAJO (EDT / WBS) INTEGRAL

A continuación se detalla la descomposición jerárquica del proyecto completo para utilizar en el Plan de Proyecto:

- **1. PROYECTO PATITAS ENCONTRADAS**
  - **1.1 Diagnóstico y Gestión de Proyecto**
    - 1.1.1 Diagnóstico territorial en Pilar y delimitación de la problemática
    - 1.1.2 Matriz de actores, árbol de problemas y justificación sociocomunitaria
    - 1.1.3 Definición de objetivos generales y específicos del sistema
    - 1.1.4 Planificación ágil por Sprints y reparto de células (2+2+3)
    - 1.1.5 Matriz de riesgos, plan de mitigación y convenciones de código
  - **1.2 Requisitos y Diseño UX/UI**
    - 1.2.1 Especificación formal de Requisitos Funcionales (RF-1 a RF-5)
    - 1.2.2 Especificación de Requisitos No Funcionales (RNF-1 a RNF-5)
    - 1.2.3 Tablero visual y bosquejos en Padlet (wireframes de baja y alta fidelidad)
    - 1.2.4 Definición de tokens de diseño (paleta `#FF8A00`, fuentes Baloo 2 y Nunito)
    - 1.2.5 Diseño de componentes atómicos (`Button`, `Input`, `Badge`, `PetCard`)
  - **1.3 Arquitectura Base e Infraestructura BaaS**
    - 1.3.1 Configuración de React Native 0.86 con Expo SDK 57 y TypeScript
    - 1.3.2 Estructuración de Expo Router (File-based navigation: Stacks + Tabs)
    - 1.3.3 Implementación de clase Singleton `ConexionFirebase`
    - 1.3.4 Configuración de persistencia nativa con `@react-native-async-storage/async-storage`
    - 1.3.5 Configuración de colecciones Firestore (`alertas`, `usuarios`, `tickets_soporte`)
    - 1.3.6 Reglas de almacenamiento en Firebase Storage para compresión de imágenes
  - **1.4 Módulo de Autenticación y Cuentas**
    - 1.4.1 Validación declarativa de credenciales con Zod (`authScheama.ts`)
    - 1.4.2 Pantalla de Inicio de Sesión (`login.tsx`)
    - 1.4.3 Pantalla de Registro de Vecinos (`register.tsx`)
    - 1.4.4 Recuperación de contraseña transaccional (`forgetPassword.tsx`)
    - 1.4.5 Manejador de estado global de sesión (`AuthContext.tsx`)
    - 1.4.6 Servicio de autenticación simulada para modo offline (`authMock.ts`)
  - **1.5 Módulo de Feed Principal (Home)**
    - 1.5.1 Maquetación del Feed con soporte de scroll fluido
    - 1.5.2 Integración con servicio `listarTodasLasAlertas` de Firestore
    - 1.5.3 Mecanismo de actualización por arrastre (*Pull-to-refresh*)
    - 1.5.4 Filtros rápidos por estado (Todos, Perdidos, Encontrados)
    - 1.5.5 Modal de previsualización rápida de tarjeta de mascota
    - 1.5.6 Recorrido interactivo de primera sesión (`GuiaDeUso.tsx`)
  - **1.6 Módulo de Mapa Interactivo Territorial**
    - 1.6.1 Integración de motor Leaflet.js 1.9.4 dentro de `react-native-webview`
    - 1.6.2 Configuración de teselas raster de CartoDB Voyager y OpenStreetMap
    - 1.6.3 Construcción del puente bidireccional de eventos (`postMessage` / `injectJavaScript`)
    - 1.6.4 Custom Hook de estado desacoplado (`useMapState.ts`)
    - 1.6.5 Componentes modulares: `MapSearchBar`, `MapFilterChips`, `MapControls`, `MapPetCard`
    - 1.6.6 Servicio de geolocalización GPS en tiempo real con `expo-location`
    - 1.6.7 Validación matemática de fronteras de coordenadas de Pilar (`geoValidation.ts`)
  - **1.7 Módulo de Publicación y Hardware Móvil**
    - 1.7.1 Formulario de alta con alternancia 'Perdí' vs 'Encontré'
    - 1.7.2 Integración de selector de fotos (`expo-image-picker`) con vista previa y borrado
    - 1.7.3 Servicio de geocodificación inversa con presets barriales (`geocodingService.ts`)
    - 1.7.4 Sanitización profunda de datos (`limpiarUndefined`) previa a persistencia
    - 1.7.5 Subida asíncrona de archivos binarios a Firebase Storage
  - **1.8 Módulo de Perfil y Operaciones del Usuario**
    - 1.8.1 Visualización de perfil con avatar y datos del usuario logueado
    - 1.8.2 Listado reactivo de publicaciones del autor (`listarAlertasPorUsuario`)
    - 1.8.3 Eliminación controlada de reportes propios con actualización optimista
    - 1.8.4 Selector de nueva foto de perfil desde galería
    - 1.8.5 Cierre de sesión seguro y limpieza de estado
  - **1.9 Módulo de Soporte, Incidencias y FAQs**
    - 1.9.1 Pantalla de Centro de Ayuda (`reporte_error.tsx`)
    - 1.9.2 Acordeón interactivo de 9 preguntas frecuentes clasificadas (`FaqAccordion.tsx`)
    - 1.9.3 Formulario de generación de tickets con tipos de incidencia (`TicketForm.tsx`)
    - 1.9.4 Persistencia y trazabilidad de tickets en Firestore (`soporteService.ts`)
  - **1.10 Módulo de Detalle y Contacto Inmediato (En Progreso)**
    - 1.10.1 Pantalla dinámica de ficha completa de mascota (`app/detalle/[id].tsx`)
    - 1.10.2 Consumo de alerta por ID desde Firestore (`obtenerAlertaPorId`)
    - 1.10.3 Redirección directa a WhatsApp con mensaje contextualizado vía `Linking API`
  - **1.11 Aseguramiento de Calidad y Pruebas**
    - 1.11.1 Suite de pruebas de validación geoespacial (`geoValidation.test.mjs`)
    - 1.11.2 Suite de pruebas de estrés sobre filtros y búsqueda (`challenger_stress.test.mjs`)
    - 1.11.3 Suite de pruebas de integración del mapa y accesibilidad (`challenger2_integration.test.mjs`)
    - 1.11.4 Suite de pruebas del módulo de soporte y tickets (`faqSection.test.mjs`, `ticketCollectionAndForm.test.mjs`)
    - 1.11.5 Pruebas de integración del servicio de publicaciones (`publicarAlertaService.test.mjs`)
  - **1.12 Documentación y Entrega Académica**
    - 1.12.1 Consolidación de Guía de Defensa Oral y Examen Parcial (`generar_pdf_parcial.py`)
    - 1.12.2 Consolidación de Planificación Ágil del Sprint 3 (`generar_pdf_sprint3.py`)
    - 1.12.3 Redacción formal de las Secciones 5 a 9 del Incremento 2

---

## 10. MATRIZ DE PRUEBAS AUTOMATIZADAS Y CRITERIOS DE ACEPTACIÓN (DoD)

La suite de pruebas automatizadas utiliza el **Node.js Native Test Runner** (`node --test`), ejecutando **53 pruebas** que validan la solidez del sistema ante fallos, entradas maliciosas y casos de borde:

### 10.1 Cobertura de la Suite de Pruebas
1. **Validación Geoespacial (`geoValidation.test.mjs` - 10 Tests):**
   - Coordenadas válidas en casco urbano y periferia de Pilar: APROBADO.
   - Puntos en los límites extremos del planeta (-90, 90, -180, 180): APROBADO.
   - Rechazo estricto de latitudes > 90 o < -90 y longitudes > 180 o < -180: APROBADO.
   - Rechazo de valores no numéricos IEEE 754 (`NaN`, `Infinity`, `-Infinity`): APROBADO.
   - Rechazo de nulos, indefinidos, strings y objetos malformados: APROBADO.
2. **Arquitectura y Puente del Mapa (`challenger2_integration.test.mjs` - 10 Tests):**
   - Verificación de pantalla orquestadora liviana (`mapa.tsx` con 142 líneas < 150): APROBADO.
   - Botones táctiles de control flotante con área mínima de 46x46 dp (supera los 44 dp estándar): APROBADO.
   - Integridad del puente bidireccional (escucha de mensajes en `window` y `document`): APROBADO.
   - Cero colores hexadecimales 'hardcodeados' y cero `console.log` en componentes de mapa: APROBADO.
3. **Estrés en Filtros y Búsqueda (`challenger_stress.test.mjs` - 17 Tests):**
   - Filtrado por categorías ('Todos', 'Perdidos', 'Encontrados'): APROBADO.
   - Búsqueda combinada insensible a mayúsculas/minúsculas por nombre, raza y barrio: APROBADO.
   - Manejo de consultas con espacios en blanco y caracteres especiales: APROBADO.
   - Resiliencia ante registros con coordenadas corruptas (exclusión segura sin caída de app): APROBADO.
4. **Módulo de Soporte y FAQs (`faqSection.test.mjs` & `ticketCollectionAndForm.test.mjs` - 7 Tests):**
   - Presencia de las 9 preguntas oficiales en sus 4 categorías: APROBADO.
   - Validación del contrato de la colección `tickets_soporte` y sanitización de inputs: APROBADO.
   - Verificación de accesibilidad y estados de carga en el formulario: APROBADO.
5. **Servicios de Alertas y Firestore (`mapFirebasePoints.test.mjs` & `publicarAlertaService.test.mjs` - 9 Tests):**
   - Sanitización de campos con `limpiarUndefined` (eliminación de claves prohibidas por Firestore): APROBADO.
   - Transformación de alertas Firestore a marcadores interactivos para Leaflet: APROBADO.
   - Comportamiento ante fallas de red con retorno ordenado a datos de respaldo: APROBADO.

---

## 11. GUÍA DE PREGUNTAS FRECUENTES Y DEFENSA TÉCNICA ORAL

Resumen de las preguntas clave que evaluará la cátedra y sus respuestas basadas en la arquitectura real:

### P1: «¿Por qué la aplicación cuenta con Mock Data si ya está integrada a Firebase?»
> **Respuesta:** En el ciclo de desarrollo de software ágil, el frontend y el backend deben poder evolucionar de manera desacoplada. Si la aplicación dependiera al 100% de la nube de Firebase, cualquier interrupción de conectividad en el aula o retraso en las reglas de seguridad bloquearía las pruebas y la defensa en vivo. Los mocks tipados (`authMock.ts`, `mapMockData.ts`) aseguran un funcionamiento determinístico y verificable en cualquier entorno.

### P2: «¿Cómo solucionaron la persistencia de autenticación en React Native?»
> **Respuesta:** En aplicaciones web convencionales, Firebase Auth almacena tokens en `localStorage` o `indexedDB`, mecanismos que no existen en el entorno nativo de Android e iOS. En Patitas Encontradas lo resolvimos utilizando `@react-native-async-storage/async-storage` a través de la función oficial `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })` encapsulada en el Singleton `ConexionFirebase`.

### P3: «¿Por qué utilizaron Leaflet en un WebView en lugar de react-native-maps?»
> **Respuesta:** `react-native-maps` en Android depende estrictamente de los servicios de Google Play y de una API Key vinculada a una cuenta con facturación activa en Google Cloud. Esto provoca el conocido error de la 'pantalla negra' en emuladores de desarrollo o celulares sin servicios comerciales de Google. Implementar Leaflet 1.9.4 sobre `react-native-webview` con teselas de CartoDB y OpenStreetMap nos brinda un mapa 100% funcional, gratuito, liviano y controlado mediante un puente de eventos bidireccional (`postMessage` / `injectJavaScript`).

### P4: «¿Por qué eligieron Zustand por encima de Redux o Context API?»
> **Respuesta:** Redux introduce una carga excesiva de código repetitivo (*boilerplate* con actions, reducers y dispatchers) que ralentiza el avance de un equipo universitario. Por otro lado, React Context API desencadena re-renderizados masivos en todos los componentes hijos ante la modificación de cualquier propiedad del Provider. Zustand no requiere Providers envolventes y permite suscripciones atómicas por selector, logrando máxima fluidez visual en celulares de gama media.

---

## 12. BACKLOG PENDIENTE Y HOJA DE RUTA INMEDIATA (PRÓXIMA SEMANA)

Para la entrega académica del Incremento 2 y la defensa del Sprint 3 la semana entrante, los esfuerzos se concentran en:

1. **Finalización de la Pantalla de Detalle de Mascota (`app/detalle/[id].tsx`):**
   - Conectar la pantalla al servicio `obtenerAlertaPorId(id)`.
   - Mostrar galería de fotos completa, descripción, recompensas y fecha relativa.
   - Integrar el botón de acción principal "Contactar por WhatsApp" utilizando `Linking.openURL()` con mensaje contextualizado ("Hola, vi tu publicación en Patitas Encontradas sobre...").
2. **Pantalla de Bienvenida / Onboarding (`feat/welcome-info-screen`):**
   - Maquetar la vista introductoria según los wireframes de Padlet de la Célula 3.
   - Incorporar navegación directa hacia `login` o hacia el `feed` para usuarios invitados.
3. **Cierre de la Documentación del Incremento 2:**
   - Consolidar las secciones 5 a 9 (Diagramas de secuencia, casos de uso expandidos, matriz de trazabilidad y manual de usuario).
4. **Preparación del Plan de Proyecto y Modelo de Negocio:**
   - Usar este documento en NotebookLM para sintetizar el Business Model Canvas (Propuesta de valor, canales, estructura de costos de servidores y fuentes de ingresos solidarias) y el cronograma Gantt de entregas.
"""

with open(target_md, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Dossier successfully written to {target_md}")
print(f"Total size: {len(content.encode('utf-8'))} bytes, {len(content.splitlines())} lines.")
