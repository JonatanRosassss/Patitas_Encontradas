# 🐾 Patitas Encontradas — ¡Ayudemos a que vuelvan a casa! ❤️

![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_51-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/NativeWind-Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-Auth_&_Firestore-FFCA28?style=for-the-badge&logo=firebase)

> **Trabajo Integrador Cátedra Desarrollo Móvil**  
> **Tecnicatura Universitaria en Desarrollo de Software — Universidad Nacional de Pilar (UNP)**  
> 🗓 **Cuatrimestre:** 2026-2  

---

## 📱 ¿Qué es Patitas Encontradas?

¡Buenas! Bienvenidos al repositorio oficial de **Patitas Encontradas**. 

Esta aplicación nace para solucionar un problema super común que vemos todos los días en nuestros barrios: **cuando a alguien se le pierde un perro o un gato, la desesperación lleva a salir corriendo a pegar carteles en los postes o publicar en grupos masivos de Facebook y WhatsApp.** ¿El resultado? Los carteles se vuelan con la lluvia y las publicaciones se pierden en el feed en cuestión de minutos. Las primeras horas son la *ventana de oro* y se pierden por falta de una herramienta directa.

**Patitas Encontradas** viene a cambiar eso. Es una plataforma barrial y comunitaria geolocalizada donde podés:
1. Publicar la búsqueda de tu mascota perdida en menos de un minuto con foto y ubicación exacta.
2. Alertar a los vecinos cercanos para que estén atentos.
3. Si alguien en la calle ve a un animal con cara de perdido, puede sacar una foto, clavar el pin en el mapa y avisarle de toque al dueño vía WhatsApp o mediante un reporte de avistamiento.
4. Contar con una **Tienda Solidaria** e-commerce donde se pueden comprar chapitas QR inteligentes, collares y accesorios, ayudando a financiar la red y manteniendo la app autosustentable.

---

## ✨ Funcionalidades Principales

* 🔐 **Autenticación Real de Usuarios:** Registro, login y sesión persistente con **Firebase Auth** (rutas protegidas con Expo Router).
* 🚨 **CRUD Completo de Búsquedas:** Crear, consultar, editar datos/señas particulares y dar de baja o marcar como "Encontrado" los reportes.
* 📸 **Integración de Cámara Nativa:** Captura inmediata de foto con la cámara del celular o selección desde la galería (`expo-image-picker`) subiendo directo a **Firebase Storage**.
* 📍 **Geolocalización GPS:** Obtención de coordenadas en tiempo real (`expo-location`) para ubicar exactamente dónde se perdió la mascota o dónde fue vista.
* ⚡ **Feed Fluido de Alta Performance:** Renderizado de publicaciones con `@shopify/flash-list` para soportar cientos de avisos sin tirones visuales.
* 💬 **Contacto Rápido e Inmediato:** Botón de contacto directo por WhatsApp al dueño sin vueltas ni configuraciones raras.

---

## 🛠️ Stack Tecnológico

* **Framework Mobile:** React Native + Expo (TypeScript).
* **Navegación:** Expo Router (basado en archivos en la carpeta `app/`).
* **Estilos & UI:** NativeWind (Tailwind CSS) + Design Tokens personalizados en `constants/theme.ts`.
* **Backend as a Service (BaaS):** Firebase Authentication, Cloud Firestore (NoSQL DB) y Firebase Storage.
* **Gestión de Estado Global:** Zustand (para el carrito de compras y estado de sesión).
* **Formularios y Validaciones:** React Hook Form + Zod.
* **Componentes de Lista:** `@shopify/flash-list`.

---

## 📦 Instalación y Comandos de Setup

Si te acabás de clonar el repo o querés armar el proyecto desde cero, acá tenés **todos los comandos que tenés que ejecutar en la terminal**.

### 1. Clonar el repositorio e instalar dependencias base
```bash
git clone https://github.com/tu-usuario/patitas-encontradas.git
cd patitas-encontradas
npm install
```

### 2. Comandos de instalación de dependencias clave (Por si creás un proyecto nuevo)

```bash
# --- 1. Framework & Navegación Expo Router ---
npx create-expo-app patas-encontradas --template blank-typescript
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# --- 2. Estilos con NativeWind (Tailwind CSS) ---
npm install nativewind
npm install --save-dev tailwindcss
npx expo install react-native-reanimated

# --- 3. Firebase SDK & Storage ---
npm install firebase
npx expo install @react-native-async-storage/async-storage

# --- 4. Hardware Nativo (Cámara & GPS) ---
npx expo install expo-image-picker expo-location expo-camera

# --- 5. Estado Global & Listas Fluidas ---
npm install zustand
npm install @shopify/flash-list

# --- 6. Formularios & Validaciones con Zod ---
npm install react-hook-form zod @hookform/resolvers

# --- 7. Íconos Lucide & SVG ---
npx expo install lucide-react-native react-native-svg
```

---

## 🔑 Configuración de Variables de Entorno (`.env`)

Creá un archivo `.env` en la raíz del proyecto (usá `.env.example` como guía) y agregá las credenciales de tu proyecto de Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

---

## 📁 Estructura del Proyecto

El proyecto sigue la arquitectura recomendada por Expo Router y Atomic Design:

```text
patitas-encontradas/
 ├── app/                         # Rutas de la app (Expo Router)
 │   ├── (auth)/                  # Grupo de autenticación
 │   │   ├── login.tsx            # Pantalla de Iniciar Sesión
 │   │   └── register.tsx         # Pantalla de Registro
 │   ├── (tabs)/                  # Navegación principal por pestañas
 │   │   ├── index.tsx            # Home / Feed de Mascotas y Tienda
 │   │   ├── nuevo.tsx            # Formulario de Publicación (Cámara + GPS)
 │   │   ├── carrito.tsx          # Carrito de Compras Solidario
 │   │   └── perfil.tsx           # Mi Perfil y Gestión de Búsquedas
 │   ├── mascota/
 │   │   └── [id].tsx             # Detalle de Mascota / Avistamientos
 │   └── _layout.tsx              # Layout Raíz + Auth Guard (Firebase)
 ├── components/                  # Componentes reutilizables
 │   ├── ui/                      # Átomos (BotonPrimario, InputField, Badge)
 │   └── TarjetaMascota.tsx       # Card de lista de mascota
 ├── constants/
 │   └── theme.ts                 # Design Tokens (Colores, Tipografías, Espaciado)
 ├── services/                    # Conexiones con Firebase, GPS y Cámara
 │   ├── firebase.ts              # Configuración e inicialización de SDK
 │   ├── locationService.ts       # Wrapper de Expo Location
 │   └── mediaService.ts          # Wrapper de Expo ImagePicker y Storage
 ├── stores/
 │   └── useCarritoStore.ts       # Estado global con Zustand
 └── types/
     └── index.ts                 # Interfaces TypeScript del sistema
```

---

## 🚀 ¿Cómo correr la aplicación?

1. Iniciar el servidor de desarrollo de Expo:
   ```bash
   npx expo start
   ```

2. **Probar en celular físico (Recomendado):**
   * Descargá la app **Expo Go** desde Play Store (Android) o App Store (iOS).
   * Escaneá el código QR que aparece en la terminal o en la solapa del navegador.

3. **Probar en Emulador Android:**
   * Abrí Android Studio, iniciá tu AVD (Virtual Device) y presioná la tecla `a` en la terminal.

---

## 👥 Equipo de Desarrollo

Proyecto desarrollado por el equipo de **Patitas Encontradas**:
* **Product Owner & Tech Lead:** Lead / Co-Desarrollador
* **Equipo de Desarrollo (7 Integrantes):** Células de Auth, UI/Feed y Hardware/GPS.

---

⭐ *¡Gracias por visitar nuestro proyecto! Si tenés sugerencias o encontrás algún bug, abrí un Issue o Pull Request.*
