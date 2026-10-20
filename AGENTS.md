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
