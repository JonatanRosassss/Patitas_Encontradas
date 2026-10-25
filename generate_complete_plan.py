import os

target_path = r"C:\UNI PILAR\AppsMoviles\Patitas_Encontradas\PLAN_DE_PROYECTO_Y_GESTION_COMPLETA_PATITAS_ENCONTRADAS.md"

content = r"""# 📋 PLAN DE PROYECTO, GESTIÓN Y CONTROL OPERATIVO
## Proyecto: Patitas Encontradas — Aplicación Móvil Sociocomunitaria
### Documento Maestro de Ingeniería de Software y Gestión Ágil para Entrega y Defensa Académica

---

> **FICHA TÉCNICA Y DATOS ESPECÍFICOS DE LA ENTREGA:**
> - **Institución Universitaria:** Universidad Nacional de Pilar (UNP)
> - **Carrera:** Tecnicatura Universitaria en Desarrollo de Software
> - **Cátedra Principal:** Desarrollo de Aplicaciones Móviles
> - **Cátedra de Articulación:** Taller de Formulación y Desarrollo de Proyectos Sociocomunitarios (Comisión 4)
> - **Docentes Evaluadores:** Equipo Docente de Desarrollo Móvil & Prof. Yamila Ojeda
> - **Período Lectivo:** Cuatrimestre 2026-2
> - **Fecha de Entrega y Defensa:** Semana 14 / Próxima Semana (Noviembre 2026)
> - **Equipo de Proyecto (7 Integrantes):**
>   1. **Jonatan Rosas ("Jona")** — *Tech Lead & Arquitectura / Célula 1*
>   2. **Francisco González ("Fran")** — *Auth & State Lead / Célula 1*
>   3. **Maximiliano Duarte ("Maxi")** — *Backend & Core Data Dev / Célula 2*
>   4. **Rodrigo Paz** — *Core Data & Feed Dev / Célula 2*
>   5. **Sol Careaga ("SB")** — *UX/UI Lead & Documentación / Célula 3*
>   6. **Yerik Ramos Ventura** — *UX Researcher & QA / Célula 3*
>   7. **Santino / Martina Guenin** — *UI & Onboarding Dev / Célula 3*

---

## ÍNDICE DEL DOCUMENTO
1. [Integración e Inicio del Proyecto (Project Charter y Alcance)](#1-integración-e-inicio-del-proyecto)
2. [Gestión del Alcance y Diccionario de la EDT (WBS Dictionary)](#2-gestión-del-alcance-y-diccionario-de-la-edt)
3. [Gestión del Tiempo y Cronograma (PERT, CPM, Gantt y Calendario Real)](#3-gestión-del-tiempo-y-cronograma)
4. [Gestión de Recursos y Matriz RACI / RAM](#4-gestión-de-recursos-y-matriz-raci--ram)
5. [Gestión de Calidad, Testware y Evaluación ISO/IEC 25010](#5-gestión-de-calidad-testware-e-isoiec-25010)
6. [Gestión de Riesgos, Matriz PxI y Control de Salud (Semáforos)](#6-gestión-de-riesgos-y-control-de-salud)
7. [Gestión de Costos, Presupuesto y Línea Base Financiera](#7-gestión-de-costos-y-presupuesto)
8. [Gestión de Comunicaciones y Registro de Stakeholders](#8-gestión-de-comunicaciones-y-stakeholders)
9. [Gestión de Adquisiciones y Compras](#9-gestión-de-adquisiciones)

---

## 1. INTEGRACIÓN E INICIO DEL PROYECTO

### 1.1 Acta de Constitución del Proyecto (Project Charter)
- **Nombre Oficial:** Patitas Encontradas — Red Comunitaria de Mascotas en Pilar.
- **Justificación del Proyecto:** En el Partido de Pilar, el extravío de mascotas provoca angustia familiar, problemas de salud pública (zoonosis) y sobrecarga en refugios. La dependencia actual de carteles en postes (destruidos por lluvia) o publicaciones efímeras en redes sociales desperdicia la *ventana de oro* (primeras 48 hs). Se requiere una solución georreferenciada, gratuita, que funcione sin servicios privativos de Google y enlace al rescatista directamente con el dueño por WhatsApp.
- **Objetivo General (SMART):** Desarrollar, testear y poner en fase beta una aplicación móvil multiplataforma (Android/iOS/Web) en React Native con Expo y Firebase para el Municipio de Pilar antes del cierre del ciclo lectivo 2026-2, garantizando publicación en menos de 60 segundos y visualización de alertas barriales en mapa interactivo.
- **Patrocinadores y Docentes:** Cátedra de Desarrollo de Aplicaciones Móviles (UNP) y Cátedra de Proyectos Sociocomunitarios (Comisión 4 - Prof. Yamila Ojeda).
- **Presupuesto Estimado:** $3.150.000 ARS (equivalente a horas académicas de desarrollo, hosting e infraestructura básica).
- **Criterios de Éxito del Proyecto:**
  1. 100% de los requisitos funcionales (RF-1 al RF-5) implementados y testeados.
  2. Batería de 53 pruebas automatizadas pasando en verde (cero errores de compilación TypeScript).
  3. Mapa interactivo operativo con Leaflet en WebView sin costo de licencias ni pantallas negras en Android.

### 1.2 Enunciado del Alcance (Scope Statement)
- **Límites e Inclusiones (Dentro del Alcance):**
  - Autenticación segura de usuarios (Firebase Auth + AsyncStorage) con opción de sesión simulada para testing offline.
  - CRUD de publicaciones de mascotas perdidas y encontradas con fotos, datos morfológicos y recompensa.
  - Geolocalización de alertas con coordenadas GPS y geocodificación inversa con presets barriales de Pilar.
  - Visualización en Mapa Interactivo Leaflet / OpenStreetMap con filtros por estado y buscador en tiempo real.
  - Redirección nativa a WhatsApp mediante Linking API para contacto instantáneo.
  - Módulo de Soporte Comunitario con 9 FAQs categorizadas y sistema de tickets en Cloud Firestore.
  - Gestión de publicaciones propias en perfil con comprobación de autoría para borrado seguro.
- **Exclusiones Explícitas (Fuera del Alcance v1):**
  - Pasarela de pagos integrada en la aplicación (la compra de chapitas QR solidarias se coordina en veterinarias aliadas).
  - Chat en tiempo real propio dentro de la app (se delega a WhatsApp para evitar costos de servidores WebSocket).
  - Geocercas push en segundo plano con la app cerrada (para no drenar batería en celulares de gama media).
- **Supuestos:**
  - Los usuarios disponen de conexión a internet móvil (3G/4G/Wi-Fi) o utilizan el modo offline con mocks en demostraciones.
  - Los dispositivos móviles ejecutan Android 8.0+ o iOS 13+.
- **Restricciones:**
  - Plazo perentorio de entrega fijado por el calendario académico de la UNP.
  - Cero presupuesto para licencias de Google Maps Platform (obligatoriedad de usar soluciones de código abierto como Leaflet y CartoDB Voyager).

---

## 2. GESTIÓN DEL ALCANCE Y DICCIONARIO DE LA EDT

### 2.1 Estructura de Desglose del Trabajo (Árbol EDT / WBS)
```
1. PATITAS ENCONTRADAS
 ├── 1.1 Gestión y Diagnóstico Sociocomunitario
 │    ├── 1.1.1 Diagnóstico de campo y árbol de problemas en Pilar
 │    ├── 1.1.2 Project Charter y Enunciado del Alcance
 │    └── 1.1.3 Plan de Proyecto y Planificación de Sprints (2+2+3)
 ├── 1.2 Diseño UX/UI y Prototipado
 │    ├── 1.2.1 Especificación de Requisitos (RF y RNF)
 │    ├── 1.2.2 Wireframes y flujos de usuario en Padlet
 │    └── 1.2.3 Sistema de Diseño y Tokens (constants/theme.ts)
 ├── 1.3 Arquitectura Base y Servicios BaaS
 │    ├── 1.3.1 Setup Expo SDK 57 con TypeScript y Expo Router
 │    ├── 1.3.2 Singleton de conexión ConexionFirebase y persistencia nativa
 │    └── 1.3.3 Estructuración de colecciones Firestore y reglas Storage
 ├── 1.4 Módulo de Autenticación y Perfil (Célula 1)
 │    ├── 1.4.1 Validación con esquemas Zod (authScheama.ts)
 │    ├── 1.4.2 Pantallas Login, Registro y Recuperación de clave
 │    ├── 1.4.3 Contexto global de sesión (AuthContext.tsx) y AuthMock
 │    └── 1.4.4 Gestión de publicaciones del autor y borrado en Perfil
 ├── 1.5 Módulo de Feed y Detalle de Mascota (Célula 2)
 │    ├── 1.5.1 Feed Home con pull-to-refresh y fallback resiliente
 │    ├── 1.5.2 Filtros por estado y modal rápido de visualización
 │    ├── 1.5.3 Ficha completa de mascota dinámica (app/detalle/[id].tsx)
 │    └── 1.5.4 Redirección contextual a WhatsApp (Linking API)
 ├── 1.6 Módulo de Mapa Territorial Desacoplado (Célula 1 & Arquitectura)
 │    ├── 1.6.1 WebView Leaflet 1.9.4 + CartoDB Voyager (sin Google Key)
 │    ├── 1.6.2 Puente de eventos bidireccional (postMessage / injectJS)
 │    ├── 1.6.3 Custom Hook useMapState y validación geoValidation.ts
 │    └── 1.6.4 Controles táctiles accesibles y tarjeta flotante MapPetCard
 ├── 1.7 Módulo de Publicación y Hardware (Célula 2)
 │    ├── 1.7.1 Formulario dual ('Perdí' vs 'Encontré')
 │    ├── 1.7.2 Integración nativa de cámara y galería (expo-image-picker)
 │    ├── 1.7.3 Geocodificación inversa con presets de Pilar (geocodingService.ts)
 │    └── 1.7.4 Sanitización profunda (limpiarUndefined) y alta en Firestore
 ├── 1.8 Módulo de Soporte, Onboarding y Ajustes (Célula 3)
 │    ├── 1.8.1 Guía interactiva de uso para primer ingreso (GuiaDeUso.tsx)
 │    ├── 1.8.2 Centro de Ayuda con acordeón de 9 FAQs (FaqAccordion.tsx)
 │    ├── 1.8.3 Formulario de tickets y reporte de errores a base de datos
 │    └── 1.8.4 Pantalla de Ajustes y accesos rápidos
 └── 1.9 Calidad, Testware y Cierre Académico
      ├── 1.9.1 Suite de 53 pruebas automatizadas (Node Test Runner)
      ├── 1.9.2 Matriz de Trazabilidad de Requisitos (RTM)
      ├── 1.9.3 Evaluación de Atributos de Calidad ISO/IEC 25010
      └── 1.9.4 Guía de defensa oral y consolidación de documentación
```

---

### 2.2 Fichas Descriptivas del Diccionario de la EDT (WBS Dictionary)

#### Ficha EDT: 1.4 Módulo de Autenticación y Perfil
- **Código EDT:** `1.4`
- **Nombre:** Módulo de Autenticación, Gestión de Sesión y Perfil Comunitario.
- **Responsable:** Célula 1 (Jonatan Rosas & Francisco González).
- **Descripción:** Implementación del flujo integral de identidad de usuarios, inicio de sesión seguro, registro, recuperación de contraseña y visualización del historial propio con control de autoría.
- **Entradas (Inputs):** Credenciales de usuario, esquemas de Zod, configuración de Firebase Auth, almacenamiento nativo AsyncStorage.
- **Salidas (Outputs):** Tokens de sesión persistidos, pantalla `login.tsx`, `register.tsx`, `perfil.tsx`, `AuthContext.tsx` y `authMock.ts`.
- **Criterios de Aceptación (DoD):**
  - Validación preventiva de inputs en cliente antes de consultar la red.
  - La sesión se mantiene activa al reiniciar la aplicación en emulador o dispositivo físico.
  - En la pantalla de Perfil solo se listan las alertas creadas por el usuario autenticado.
  - El botón de eliminar publicación solo es visible y ejecutable si `alerta.creadoPor === usuario.uid`.

#### Ficha EDT: 1.5 Módulo de Feed y Detalle de Mascota
- **Código EDT:** `1.5`
- **Nombre:** Feed Principal de Alertas y Ficha Detallada con Enlace a WhatsApp.
- **Responsable:** Célula 2 (Maximiliano Duarte & Rodrigo Paz).
- **Descripción:** Construcción de la interfaz de exploración principal con scroll fluido, filtros por estado, actualización por arrastre (*pull-to-refresh*) y pantalla de detalle con contacto directo al rescatista o dueño.
- **Entradas:** Colección `alertas` de Firestore, componentes atómicos `PetCard`, `MASCOTAS` mock de respaldo.
- **Salidas:** `app/(tabs)/index.tsx`, `app/detalle/[id].tsx`, servicio `listarTodasLasAlertas()`.
- **Criterios de Aceptación (DoD):**
  - El feed carga datos reales de Firestore en menos de 2 segundos en redes 4G promedio.
  - Si no hay conexión, muestra los datos simulados de respaldo sin emitir pantalla blanca de error.
  - Al presionar "Contactar por WhatsApp", abre la app nativa de WhatsApp precargando el número y un mensaje con el nombre y referencia de la mascota.

#### Ficha EDT: 1.6 Módulo de Mapa Territorial Desacoplado
- **Código EDT:** `1.6`
- **Nombre:** Motor Geoespacial Interactivo Leaflet en WebView.
- **Responsable:** Célula 1 & Arquitectura (Jona Rosas & Francisco González).
- **Descripción:** Visualizador de mapa raster liviano e interactivo basado en Leaflet 1.9.4 sobre WebView, con puente de comunicación de eventos con React Native, filtros y centrado GPS.
- **Entradas:** `react-native-webview`, coordenadas validadas de Pilar, marcadores de alertas de Firestore.
- **Salidas:** `components/map/MapContainer.tsx`, `hooks/useMapState.ts`, `utils/geoValidation.ts`, `app/(tabs)/mapa.tsx`.
- **Criterios de Aceptación (DoD):**
  - Cero dependencias de Google Maps API Key y Google Play Services.
  - El archivo contenedor `mapa.tsx` debe tener menos de 150 líneas de código.
  - Todos los botones flotantes de control deben cumplir con un área táctil mínima de 44x44 dp.
  - Validación estricta que descarte coordenadas corruptas (`NaN`, `Infinity`, fuera de rango) sin romper el renderizado.

#### Ficha EDT: 1.7 Módulo de Publicación y Hardware Móvil
- **Código EDT:** `1.7`
- **Nombre:** Formulario de Publicación con Cámara, GPS y Geocodificación Inversa.
- **Responsable:** Célula 2 (Maximiliano Duarte & Rodrigo Paz).
- **Descripción:** Pantalla de reporte ágil para mascotas perdidas y encontradas con selección múltiple de fotografías, captura de ubicación por GPS y selector de barrios de Pilar.
- **Entradas:** APIs nativas `expo-image-picker`, `expo-location`, presets barriales de Pilar.
- **Salidas:** `app/(tabs)/publicar-alerta.tsx`, servicio `crearAlertaMascota()`, almacenamiento en Firebase Storage.
- **Criterios de Aceptación (DoD):**
  - Solicita permisos de cámara y ubicación de manera explicativa y amigable.
  - Sanitiza el objeto enviado a Firestore (`limpiarUndefined`) previniendo excepciones por campos vacíos.
  - Comprime las imágenes seleccionadas y devuelve URLs públicas accesibles desde el feed.

#### Ficha EDT: 1.8 Módulo de Soporte Comunitario, Onboarding y Ajustes
- **Código EDT:** `1.8`
- **Nombre:** Centro de Ayuda con FAQs, Mesa de Tickets y Tutorial Interactivo.
- **Responsable:** Célula 3 (Sol Careaga, Yerik Ramos Ventura & Santino Guenin).
- **Descripción:** Módulo de atención al vecino para resolver dudas sobre el funcionamiento de la app, enviar reportes de incidentes a Firestore y guiar al usuario nuevo en su primera interacción.
- **Entradas:** Dataset `faqsData.ts`, colección Firestore `tickets_soporte`, tokens de diseño.
- **Salidas:** `app/(tabs)/reporte_error.tsx`, `components/soporte/FaqAccordion.tsx`, `components/soporte/TicketForm.tsx`, `components/GuiaDeUso.tsx`.
- **Criterios de Aceptación (DoD):**
  - El acordeón incluye exactamente las 9 preguntas frecuentes divididas en 4 categorías temáticas.
  - El formulario de tickets valida obligatoriedad de título, descripción y email antes de enviar a Firestore.
  - La guía de uso solo se muestra una vez por dispositivo mediante persistencia de bandera en AsyncStorage.

---

## 3. GESTIÓN DEL TIEMPO Y CRONOGRAMA

### 3.1 Lista de Actividades del Proyecto e Identificadores Únicos
| ID | Actividad / Paquete de Trabajo | Célula / Responsable | Predecesoras | Hito Asociado |
|:---:|:---|:---:|:---:|:---|
| **ACT-01** | Diagnóstico territorial en Pilar y Relevamiento | Célula 3 | Ninguna | H1: Diagnóstico Aprobado |
| **ACT-02** | Especificación de Requisitos y Project Charter | Célula 3 & Lead | ACT-01 | H2: Alcance Congelado |
| **ACT-03** | Configuración de Repositorio, Expo SDK 57 y Tokens | Lead (Jona) | ACT-02 | H3: Base Técnica Lista |
| **ACT-04** | Singleton Firebase, AsyncStorage y Colecciones | Célula 1 & 2 | ACT-03 | H3: Base Técnica Lista |
| **ACT-05** | Módulo de Autenticación, Zod y AuthContext | Célula 1 | ACT-04 | H4: Sprint 1 Terminado |
| **ACT-06** | Wireframes y bosquejos en Padlet | Célula 3 | ACT-02 | H4: Sprint 1 Terminado |
| **ACT-07** | Feed Home y Servicio de Lectura de Alertas | Célula 2 | ACT-05, ACT-06 | H5: Sprint 2 Terminado |
| **ACT-08** | Motor Leaflet en WebView y Puente Bidireccional | Célula 1 | ACT-04 | H5: Sprint 2 Terminado |
| **ACT-09** | Hook useMapState, Controles y GPS en Mapa | Célula 1 | ACT-08 | H5: Sprint 2 Terminado |
| **ACT-10** | Pantalla Publicar Alerta con Cámara y Geocoding | Célula 2 | ACT-05, ACT-09 | H6: Sprint 3 Terminado |
| **ACT-11** | Gestión de Publicaciones del Autor en Perfil | Célula 1 | ACT-05, ACT-10 | H6: Sprint 3 Terminado |
| **ACT-12** | Centro de Ayuda (FAQs) y Tickets de Soporte | Célula 3 | ACT-04 | H6: Sprint 3 Terminado |
| **ACT-13** | Ficha Detallada de Mascota y Redirección WhatsApp | Célula 2 | ACT-07, ACT-10 | H7: Core CRUD Completo |
| **ACT-14** | Guía de Uso Onboarding y Pantalla de Ajustes | Célula 3 | ACT-07 | H7: Core CRUD Completo |
| **ACT-15** | Batería de Pruebas Automatizadas (53 tests) y QA | Todos (QA) | ACT-11, ACT-13, ACT-14 | H8: Entrega Académica Final |

---

### 3.2 Estimación de Duraciones (Técnica PERT - Distribución Beta)
Para contemplar un caso realista con fallas técnicas, conflictos de Git y demoras en pruebas, se aplicó la fórmula PERT Beta:
$$\mu = \frac{a + 4m + b}{6} \quad ; \quad \sigma = \frac{b - a}{6} \quad ; \quad \sigma^2 = \left(\frac{b - a}{6}\right)^2$$
*(Donde $a$ = Tiempo Optimista, $m$ = Tiempo Más Probable, $b$ = Tiempo Pesimista, expresados en días hábiles)*:

| ID | Actividad | $a$ (Opt.) | $m$ (Prob.) | $b$ (Pes.) | Duración Esperada ($\mu$) | Desvío ($\sigma$) | Varianza ($\sigma^2$) |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **ACT-01** | Diagnóstico territorial en Pilar | 3 | 5 | 8 | **5.17 d** (5 d) | 0.83 | 0.69 |
| **ACT-02** | Especificación de Requisitos y Charter | 2 | 4 | 7 | **4.17 d** (4 d) | 0.83 | 0.69 |
| **ACT-03** | Configuración Expo SDK 57 y Tokens | 2 | 3 | 5 | **3.17 d** (3 d) | 0.50 | 0.25 |
| **ACT-04** | Singleton Firebase y Colecciones | 2 | 4 | 7 | **4.17 d** (4 d) | 0.83 | 0.69 |
| **ACT-05** | Autenticación, Zod y AuthContext | 4 | 6 | 10 | **6.33 d** (6 d) | 1.00 | 1.00 |
| **ACT-06** | Wireframes y bosquejos en Padlet | 2 | 3 | 5 | **3.17 d** (3 d) | 0.50 | 0.25 |
| **ACT-07** | Feed Home y Servicio de Lectura | 3 | 5 | 9 | **5.33 d** (5 d) | 1.00 | 1.00 |
| **ACT-08** | Motor Leaflet en WebView y Puente | 4 | 6 | 11 | **6.50 d** (7 d) | 1.17 | 1.36 |
| **ACT-09** | Hook useMapState y GPS en Mapa | 3 | 5 | 8 | **5.17 d** (5 d) | 0.83 | 0.69 |
| **ACT-10** | Publicar Alerta con Cámara y GPS | 4 | 7 | 12 | **7.33 d** (7 d) | 1.33 | 1.78 |
| **ACT-11** | Gestión de Publicaciones en Perfil | 3 | 4 | 7 | **4.33 d** (4 d) | 0.67 | 0.44 |
| **ACT-12** | Centro de Ayuda (FAQs) y Tickets | 2 | 4 | 6 | **4.00 d** (4 d) | 0.67 | 0.44 |
| **ACT-13** | Ficha Mascota y WhatsApp Linking | 3 | 5 | 9 | **5.33 d** (5 d) | 1.00 | 1.00 |
| **ACT-14** | Guía de Uso y Pantalla de Ajustes | 2 | 3 | 6 | **3.33 d** (3 d) | 0.67 | 0.44 |
| **ACT-15** | Batería de 53 Tests y QA Final | 3 | 5 | 8 | **5.17 d** (5 d) | 0.83 | 0.69 |

---

### 3.3 Secuenciamiento, Diagrama de Red y Análisis de Camino Crítico (CPM)
Calculado mediante pasada hacia adelante (*Early Start / Early Finish*) y pasada hacia atrás (*Late Start / Late Finish*):

| ID | Actividad | Dur. | ES | EF | LS | LF | Holgura Total ($HT$) | ¿En Camino Crítico? |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **ACT-01** | Diagnóstico territorial en Pilar | 5 | 0 | 5 | 0 | 5 | **0** | **SÍ (Crítica)** |
| **ACT-02** | Requisitos y Project Charter | 4 | 5 | 9 | 5 | 9 | **0** | **SÍ (Crítica)** |
| **ACT-03** | Setup Expo SDK 57 y Tokens | 3 | 9 | 12 | 9 | 12 | **0** | **SÍ (Crítica)** |
| **ACT-04** | Singleton Firebase y Storage | 4 | 12 | 16 | 12 | 16 | **0** | **SÍ (Crítica)** |
| **ACT-05** | Autenticación y AuthContext | 6 | 16 | 22 | 16 | 22 | **0** | **SÍ (Crítica)** |
| **ACT-06** | Wireframes en Padlet | 3 | 9 | 12 | 19 | 22 | **10** | No |
| **ACT-07** | Feed Home y Lectura Firestore | 5 | 22 | 27 | 34 | 39 | **12** | No |
| **ACT-08** | Motor Leaflet en WebView | 7 | 16 | 23 | 17 | 24 | **1** | No |
| **ACT-09** | Hook useMapState y GPS Mapa | 5 | 23 | 28 | 24 | 29 | **1** | No |
| **ACT-10** | Publicar Alerta con Cámara/GPS | 7 | 28 | 35 | 29 | 36 | **1** | No |
| **ACT-11** | Gestión Publicaciones en Perfil| 4 | 35 | 39 | 40 | 44 | **5** | No |
| **ACT-12** | Centro de Ayuda FAQs y Tickets | 4 | 16 | 20 | 40 | 44 | **24** | No |
| **ACT-13** | Ficha Mascota y WhatsApp | 5 | 35 | 40 | 39 | 44 | **4** | No |
| **ACT-14** | Guía de Uso y Ajustes | 3 | 27 | 30 | 41 | 44 | **14** | No |
| **ACT-15** | Batería 53 Tests y QA Final | 5 | 40 | 45 | 40 | 45 | **0** | **SÍ (Crítica)** |

- **Ruta Crítica Conductora:** `ACT-01` ➔ `ACT-02` ➔ `ACT-03` ➔ `ACT-04` ➔ `ACT-05` ➔ `ACT-08` ➔ `ACT-09` ➔ `ACT-10` ➔ `ACT-13` ➔ `ACT-15`.
- **Duración Total del Proyecto:** **45 a 50 días hábiles de ingeniería** (distribuidos en 14 semanas lectivas).

```mermaid
flowchart LR
    classDef crit fill:#ffcdd2,stroke:#b71c1c,stroke-width:2px,color:#b71c1c,font-weight:bold;
    classDef normal fill:#e1f5fe,stroke:#0288d1,stroke-width:1.5px,color:#01579b;

    A01["ACT-01: Diagnóstico (5d)"]:::crit --> A02["ACT-02: Requisitos (4d)"]:::crit
    A02 --> A03["ACT-03: Setup Expo (3d)"]:::crit
    A02 --> A06["ACT-06: Padlet (3d)"]:::normal
    A03 --> A04["ACT-04: Firebase Singleton (4d)"]:::crit
    A04 --> A05["ACT-05: Auth & Zod (6d)"]:::crit
    A04 --> A08["ACT-08: Leaflet WebView (7d)"]:::crit
    A04 --> A12["ACT-12: FAQs & Tickets (4d)"]:::normal
    A08 --> A09["ACT-09: useMapState & GPS (5d)"]:::crit
    A05 --> A07["ACT-07: Feed Home (5d)"]:::normal
    A06 --> A07
    A09 --> A10["ACT-10: Publicar Alerta (7d)"]:::crit
    A05 --> A10
    A10 --> A11["ACT-11: Perfil & Borrado (4d)"]:::normal
    A07 --> A13["ACT-13: Detalle & WhatsApp (5d)"]:::crit
    A10 --> A13
    A07 --> A14["ACT-14: Guía de Uso (3d)"]:::normal
    A11 --> A15["ACT-15: 53 Tests & QA (5d)"]:::crit
    A13 --> A15
    A14 --> A15
    A12 --> A15
```

---

### 3.4 Ajuste al Calendario Real del Cuatrimestre 2026-2 (UNP)
Mapeo de las semanas lectivas sobre el calendario académico oficial:
- **Semanas 1 y 2 (11/08 al 22/08):** Inicio, diagnóstico territorial, formación de células y Project Charter.
- **Semanas 3 y 4 (25/08 al 05/09):** Requisitos corregidos, arquitectura Expo SDK 57 y Singleton Firebase.
- **Semanas 5 y 6 (08/09 al 19/09):** Módulo de Autenticación con Zod, persistencia AsyncStorage y wireframes en Padlet.
- **Semanas 7 y 8 (22/09 al 03/10):** Motor de mapas Leaflet en WebView, eliminación de API Keys de Google y Feed Home.
- **Semanas 9 y 10 (06/10 al 17/10):** Formulario Publicar Alerta con cámara nativa, presets de Pilar y soporte de FAQs.
- **Semanas 11 y 12 (20/10 al 31/10):** Gestión de publicaciones propias en perfil, tickets a Firestore y suite de 53 tests.
- **Semanas 13 y 14 (03/11 al 14/11 - ACTUAL):** Ficha dinámica de detalle con WhatsApp, consolidación de la defensa oral y entrega de documentación.

---

## 4. GESTIÓN DE RECURSOS Y MATRIZ RACI / RAM

### 4.1 Organización del Equipo por Células Autónomas (2 + 2 + 3)
- **Célula 1 (Auth, State & Arquitectura):** Jonatan Rosas (Jona) & Francisco González (Fran).
- **Célula 2 (Core Feed, Persistencia & Hardware):** Maximiliano Duarte (Maxi) & Rodrigo Paz.
- **Célula 3 (UX/UI, Onboarding & Documentación):** Sol Careaga (SB), Yerik Ramos Ventura & Santino / Martina Guenin.

### 4.2 Matriz RACI / RAM Formal
> **Convenciones:** 
> - **R (Responsible):** Quien ejecuta la tarea técnica.
> - **A (Accountable):** Quien aprueba y rinde cuentas de la calidad técnica (solo uno por actividad).
> - **C (Consulted):** Quien aporta información clave o valida interfaz.
> - **I (Informed):** Quien recibe notificación del avance sin intervenir directamente.

| Paquete de Trabajo / Actividad | Jona (Lead) | Fran (Auth) | Maxi (Core) | Rodrigo (Feed) | Sol (UX/Doc) | Yerik (QA) | Santino (UI) |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1.1 Diagnóstico sociocomunitario y Charter** | C | I | I | I | **A** | **R** | C |
| **1.2 Requisitos y Wireframes en Padlet** | C | I | C | I | **A** | C | **R** |
| **1.3 Arquitectura Expo y Singleton Firebase** | **A** | **R** | C | C | I | I | I |
| **1.4.1 Login, Registro y Esquemas Zod** | C | **A / R** | I | I | C | I | I |
| **1.4.2 AuthContext y Persistencia AsyncStorage** | **A** | **R** | I | I | I | C | I |
| **1.4.3 Perfil y Eliminación de Publicaciones** | C | **A / R** | C | I | I | I | I |
| **1.5.1 Feed Home y Pull-to-refresh** | I | I | C | **A / R** | C | I | I |
| **1.5.2 Ficha Detalle y WhatsApp Linking** | I | I | **A / R** | **R** | C | I | I |
| **1.6.1 Motor Leaflet WebView y Puente JS** | **A / R** | **R** | I | I | I | C | I |
| **1.6.2 Controles Táctiles y Accesibilidad Mapa** | C | **A** | I | I | C | C | **R** |
| **1.7.1 Publicar Alerta (Cámara + Galería)** | I | I | **A / R** | **R** | I | I | I |
| **1.7.2 Geocodificación Inversa (Pilar Presets)** | C | I | **A** | **R** | I | I | I |
| **1.8.1 Guía Interactiva Onboarding (GuiaDeUso)** | I | I | I | I | C | I | **A / R** |
| **1.8.2 Centro de Ayuda FAQs y Tickets** | I | I | C | I | **A** | **R** | C |
| **1.9.1 Ejecución Batería 53 Tests Automatizados** | **A** | C | C | C | I | **R** | I |
| **1.9.2 Consolidación Dossier y Defensa Oral** | C | C | C | C | **A** | **R** | C |

---

## 5. GESTIÓN DE CALIDAD, TESTWARE E ISO/IEC 25010

### 5.1 Matriz de Trazabilidad de Requisitos (RTM)
| Requisito | Caso de Prueba | Tipo de Prueba | Archivo de Prueba | Estado |
|:---|:---|:---:|:---|:---:|
| **RF-1: Login / Sesión** | `CP-AUTH-01`: Login con credenciales válidas y persistencia | Integración | `services/authMock.ts` | **PASS** |
| **RF-1: Login / Zod** | `CP-AUTH-02`: Rechazo de email inválido o clave corta | Unitaria | `schemas/authScheama.ts` | **PASS** |
| **RF-2: Publicar Alerta** | `CP-PUB-01`: Sanitización profunda con `limpiarUndefined` | Unitaria | `tests/publicarAlertaService.test.mjs` | **PASS** |
| **RF-2: Geocodificación** | `CP-PUB-02`: Conversión de dirección de Pilar a lat/lng | Integración | `tests/publicarAlertaService.test.mjs` | **PASS** |
| **RF-3: Mapa Leaflet** | `CP-MAP-01`: Carga de WebView sin Google Play Services | E2E Bridge | `tests/challenger2_integration.test.mjs` | **PASS** |
| **RF-3: Coordenadas** | `CP-MAP-02`: Validación matemática de límites de Pilar | Estrés / Borde | `tests/geoValidation.test.mjs` | **PASS** |
| **RF-3: Filtros Mapa** | `CP-MAP-03`: Filtrado por 'Perdidos', 'Encontrados' y texto | Estrés / Lógica | `tests/challenger_stress.test.mjs` | **PASS** |
| **RF-4: Borrado Autor** | `CP-PERF-01`: Restricción de borrado solo al creador | Unitaria / UI | `tests/publicarAlertaService.test.mjs` | **PASS** |
| **RF-5: FAQs Soporte** | `CP-SOP-01`: Integridad de 9 FAQs en 4 categorías | Datos / UI | `tests/faqSection.test.mjs` | **PASS** |
| **RF-5: Tickets Firestore**| `CP-SOP-02`: Alta de ticket con validación y timestamp | Integración | `tests/ticketCollectionAndForm.test.mjs`| **PASS** |
| **RNF-5: Accesibilidad** | `CP-ACC-01`: Botones de control con tamaño >= 44x44 dp | Inspección DOM | `tests/challenger2_integration.test.mjs` | **PASS** |

---

### 5.2 Evaluación de Atributos de Calidad bajo ISO/IEC 25010
1. **Adecuación Funcional:**
   - *Completitud:* Cubre los 5 requisitos funcionales acordados en el ciclo de vida de la mascota.
   - *Corrección:* Los 53 tests automáticos validan que las coordenadas y estados se procesan con exactitud matemática.
2. **Eficiencia de Desempeño:**
   - *Comportamiento temporal:* El feed virtualizado con `FlatList` y el mapa Leaflet responden en menos de 100 ms ante interacciones táctiles en dispositivos Android de gama media.
   - *Uso de recursos:* La app consume menos de 120 MB de memoria RAM al no cargar capas nativas pesadas de Google Play Services.
3. **Compatibilidad:**
   - *Coexistencia:* Diseñada sobre Expo SDK 57 con soporte simultáneo para Android, iOS y entorno Web sin bifurcaciones de código.
4. **Usabilidad:**
   - *Protección contra errores:* Validación preventiva con Zod y confirmación modal en acciones destructivas (borrado de publicaciones).
   - *Estética y Accesibilidad:* Botones táctiles superiores a 44 dp y contraste visual certificado bajo el sistema de tokens (`constants/theme.ts`).
5. **Fiabilidad:**
   - *Tolerancia a fallos:* Ante caída de conexión a internet o fallas de red, la app conmuta automáticamente a los datasets de respaldo (`mapMockData.ts` y `MASCOTAS` mock) sin emitir pantallas negras ni bloqueos de pantalla.
6. **Seguridad:**
   - *Confidencialidad:* Almacenamiento seguro de tokens con `AsyncStorage` nativo y aislamiento de variables de entorno mediante `EXPO_PUBLIC_`.
7. **Mantenibilidad:**
   - *Modularidad:* Separación estricta entre capa visual (UI), hooks de control (`useMapState`) y servicios de datos (`mascotasService`).
8. **Portabilidad:**
   - *Adaptabilidad:* Capacidad probada de exportación mediante `npx expo export` sin dependencias binarias nativas no gestionadas.

---

## 6. GESTIÓN DE RIESGOS Y CONTROL DE SALUD (SEMÁFOROS)

### 6.1 Matriz de Evaluación Cuantitativa de Riesgos (Probabilidad $\times$ Impacto)
*Escala: Probabilidad (1 a 5) $\times$ Impacto (1 a 5) = Nivel de Exposición (1 a 25)*:

| ID | Riesgo Identificado | Causa Raíz | Prob. (P) | Imp. (I) | Score ($P \times I$) | Nivel de Riesgo | Estrategia de Mitigación / Contingencia |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---|
| **R-01** | Pantalla negra en Google Maps | Falta de API Key con facturación o Play Services | 5 | 5 | **25** | **CRÍTICO** | **Mitigado:** Sustitución total por Leaflet 1.9.4 en WebView con OpenStreetMap. |
| **R-02** | Pérdida de sesión al reiniciar la app | `localStorage` no existe en entorno móvil nativo | 4 | 5 | **20** | **ALTO** | **Mitigado:** Implementación de persistencia con `AsyncStorage` en `ConexionFirebase`. |
| **R-03** | Rechazo de datos en Firestore por campos undefined | Valores opcionales de geolocalización o recompensa | 4 | 4 | **16** | **ALTO** | **Mitigado:** Creación de helper `limpiarUndefined()` ejecutado previo a cada escritura. |
| **R-04** | Bloqueo en defensa oral por falta de Wi-Fi | Inestabilidad de internet en aulas universitarias | 4 | 4 | **16** | **ALTO** | **Mitigado:** Dataset mock desacoplado (`authMock.ts`, `mapMockData.ts`) con conmutación automática. |
| **R-05** | Colisiones en Git entre 7 desarrolladores | Trabajo simultáneo sobre pantallas monolíticas | 3 | 4 | **12** | **MEDIO** | **Mitigado:** División en 3 células (2+2+3) con ramas por feature y modularización de pantallas a < 150 líneas. |
| **R-06** | Coordenadas erróneas fuera de Pilar | Fallo de antena GPS o datos malformados | 3 | 3 | **9** | **MEDIO** | **Mitigado:** Módulo `geoValidation.ts` con fronteras matemáticas fijas de Pilar. |
| **R-07** | Agotamiento de cuota gratuita en Firebase | Carga masiva de fotos sin compresión | 2 | 4 | **8** | **BAJO** | **Mitigado:** Redimensionamiento y calidad 0.7 en `expo-image-picker`. |

---

### 6.2 Reglas Operativas de Semáforo para el Avance del Proyecto
- 🟢 **VERDE (Normal / En Tiempo):**
  - Todas las tareas del Sprint avanzan conforme al cronograma PERT.
  - La suite de 53 tests se ejecuta con 0 fallos.
  - Células sincronizadas en la Daily sin bloqueos mayores a 24 horas.
- 🟡 **AMARILLO (Precaución / Desvío Moderado):**
  - Retraso de 2 a 3 días hábiles en una tarea del camino crítico (ej: integración de WhatsApp en `app/detalle/[id].tsx`).
  - Fallo en 1 a 3 tests automatizados tras un Pull Request.
  - *Acción correctiva:* Reasignación temporal del desarrollador de apoyo de la Célula 3 para destrabar el backend.
- 🔴 **ROJO (Alerta Crítica / Bloqueo Severo):**
  - Caída de la base de datos Firestore o incompatibilidad de librerías nativas que impida compilar con Expo.
  - Retraso mayor a 4 días que comprometa la fecha de entrega académica.
  - *Acción de contingencia:* Activación inmediata del modo Mock Offline y presentación congelada en la versión estable previa.

---

## 7. GESTIÓN DE COSTOS Y PRESUPUESTO

### 7.1 Estimación de Costos Directos e Indirectos (Línea Base en ARS)
Calculado para un proyecto universitario profesional de 14 semanas con 7 integrantes:

| Rubro / Concepto | Unidad de Medida | Cantidad | Tarifa Unitaria (ARS) | Costo Subtotal (ARS) |
|:---|:---|:---:|:---:|:---:|
| **Horas de Desarrollo - Célula 1 (Auth & Map)** | Horas técnicas | 140 h | $12.000 / h | $1.680.000 |
| **Horas de Desarrollo - Célula 2 (Core & Data)** | Horas técnicas | 140 h | $12.000 / h | $1.680.000 |
| **Horas de Diseño & Docs - Célula 3 (UX/UI)** | Horas de diseño | 120 h | $10.000 / h | $1.200.000 |
| **Cuenta Google Play Developer (Publicación)** | Tarifa única | 1 ($25 USD) | $32.500 | $32.500 |
| **Infraestructura Firebase (Plan Spark/Blaze)** | Mensual | 3 meses | $0 (Capa gratuita) | $0 |
| **Servidor de Teselas Leaflet (OpenStreetMap)** | Open Source | Ilimitado | $0 (Libre) | $0 |
| **Lote Inicial de 100 Chapitas QR Solidarias** | Insumo físico | 100 unid. | $2.500 / unid. | $250.000 |
| **Subtotal Costos Operativos y de Ingeniería:** | | | | **$4.842.500** |
| **Reserva de Contingencia para Riesgos (10%):** | | | | **$484.250** |
| **PRESUPUESTO TOTAL LÍNEA BASE:** | | | | **$5.326.750 ARS** |

*(Nota académica: En el contexto universitario los costos de mano de obra representan el valor hora de mercado computado para justificar la viabilidad económica y el esfuerzo invertido por los 7 estudiantes).*

---

## 8. GESTIÓN DE COMUNICACIONES Y REGISTRO DE STAKEHOLDERS

### 8.1 Registro de Interesados (Stakeholder Register)
| Interesado / Grupo | Rol en el Proyecto | Nivel de Poder | Nivel de Interés | Estrategia de Gestión |
|:---|:---|:---:|:---:|:---|
| **Equipo Docente (Desarrollo Móvil)** | Evaluador académico técnico | **Alto** | **Alto** | *Gestionar de cerca:* Demostración de código limpio, 53 tests y arquitectura sin Google Keys. |
| **Prof. Yamila Ojeda (Sociocomunitario)** | Evaluadora de impacto territorial | **Alto** | **Alto** | *Gestionar de cerca:* Demostración de valor barrial en Pilar y venta de chapitas solidarias. |
| **Vecinos de Pilar (Usuarios Finales)** | Beneficiarios primarios | **Bajo** | **Alto** | *Mantener informados:* Interfaces claras, onboarding amigable y comunicación por WhatsApp. |
| **Veterinarias Adheridas de Pilar** | Puntos de venta y escaneo QR | **Medio** | **Medio** | *Mantener satisfechos:* Facilitar la lectura de QR y difusión institucional. |
| **Equipo de Desarrollo (7 Integrantes)** | Ejecutores de la ingeniería | **Alto** | **Alto** | *Trabajo colaborativo diario:* Comunicación constante por Discord y WhatsApp. |

---

### 8.2 Matriz del Plan de Comunicaciones
| Evento / Reunión | Frecuencia | Canal / Medio | Emisor | Receptores | Entregable / Evidencia |
|:---|:---|:---|:---|:---|:---|
| **Daily Standup Ágil** | Diaria (15 min) | Discord / WhatsApp | Cada Célula | Todo el equipo | Actualización de tablero Trello/Padlet |
| **Sprint Planning & Review** | Quincenal | Google Meet | Tech Lead | Equipo de 7 miembros | Backlog refinado y Sprint Goal |
| **Sincronización de Ramas Git** | Previa a cada PR | GitHub PRs | Desarrollador | Lead / Revisor | Revisión de código sin `console.log` |
| **Informe de Avance Semanal** | Semanal | Campus Virtual UNP | Lead & Doc Lead | Docentes de Cátedra | Documento Markdown / PDF exportado |
| **Minuta de Retrospectiva** | Fin de Sprint | Google Docs | Sol Careaga | Equipo de 7 miembros | Registro de lecciones aprendidas |

---

## 9. GESTIÓN DE ADQUISICIONES Y COMPRAS

El proyecto fue concebido bajo el principio de **cero dependencia financiera obligatoria** para garantizar su viabilidad en el ámbito universitario:

1. **Servicios Cloud y Plataforma:**
   - *Firebase Authentication, Firestore y Storage:* Operan bajo el plan gratuito **Spark**. No requieren tarjeta de crédito ni representan costos mensuales para el volumen inicial de Pilar (< 50.000 lecturas/día).
   - *CartoDB Voyager / OpenStreetMap:* Servicio de mapas raster de uso público y libre. Costo: **$0**.
2. **Cuentas de Distribución y Stores:**
   - *Google Play Store Console Account:* Pago único de **$25 USD** (aprox. $32.500 ARS) requerido para la publicación final del archivo `.aab` (Android App Bundle).
   - *Expo Application Services (EAS Build):* Plan gratuito para compilación en la nube de instalables `.apk` de prueba. Costo: **$0**.
3. **Hardware y Entorno de Pruebas:**
   - Equipos propios de los integrantes (computadoras con Android Studio para emulación y celulares físicos Android/iOS para pruebas reales de cámara y GPS en la calle).
4. **Adquisiciones del Modelo Sociocomunitario:**
   - Proveedor de corte y grabado láser en Pilar para las primeras 100 chapitas metálicas con código QR (Costo estimado: $2.500 ARS por unidad; precio solidario sugerido a la venta comunitaria: $5.000 ARS, generando un margen de reinversión para sostener el proyecto).

---

### CONCLUSIÓN PARA NOTEBOOKLM
Este documento sintetiza la **totalidad de los artefactos de ingeniería de software y gestión ágil** del proyecto *Patitas Encontradas*. Al ser ingresado en NotebookLM, la herramienta contará con el contexto formal, matemático y técnico para responder sin ambigüedades sobre la planificación, la EDT, el cronograma PERT/CPM, la matriz RACI, la calidad ISO 25010 y el presupuesto operativo del equipo.
"""

with open(target_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"File successfully created: {target_path}")
print(f"Total lines: {len(content.splitlines())}, Size: {len(content.encode('utf-8'))} bytes")
