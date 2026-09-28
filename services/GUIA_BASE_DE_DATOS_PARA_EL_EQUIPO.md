# 🐾 Guía de Conexión a Firebase para el Equipo

¡Buenas! Para evitar que tengan que configurar manualmente Firebase en cada pantalla (claves de API, persistencia en AsyncStorage para React Native, etc.), ya está creada la **clase orquestadora de conexión (patrón Singleton)**: `ConexionFirebase`.

Ustedes se encargan de escribir la lógica y las consultas de sus pantallas, pero la conexión la obtienen en una sola línea.

---

## 🚀 1. ¿Cómo obtener la conexión?

No tienen que inicializar Firebase ni configurar nada raro. Solo importan la conexión:

```typescript
import { db, auth } from '@/services/firebase';

// O si prefieren usar la clase orquestadora:
import { ConexionFirebase } from '@/services/ConexionFirebase';
const db = ConexionFirebase.obtenerFirestore();
const auth = ConexionFirebase.obtenerAuth();
```

---

## 🔐 2. Autenticación con Firebase Auth
> 📁 Para quien trabaje en `login.tsx`, `register.tsx` o `perfil.tsx`

Importan `auth` desde el servicio de Firebase y usan las funciones oficiales del SDK:

```typescript
import { auth } from '@/services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
```

### Iniciar Sesión (`login.tsx`):
```typescript
try {
  const credencial = await signInWithEmailAndPassword(auth, email.trim(), password);
  const usuario = credencial.user;
  console.log('Usuario autenticado con UID:', usuario.uid);
  router.replace('/(tabs)');
} catch (error: any) {
  Alert.alert('Error al iniciar sesión', error.message);
}
```

### Registrar Usuario (`register.tsx`):
```typescript
try {
  const credencial = await createUserWithEmailAndPassword(auth, email.trim(), password);
  console.log('Cuenta creada:', credencial.user.email);
  router.replace('/(tabs)');
} catch (error: any) {
  Alert.alert('Error al registrarse', error.message);
}
```

### Cerrar Sesión:
```typescript
await signOut(auth);
router.replace('/(auth)/login');
```

---

## 📢 3. Guardar y Leer Datos en Firestore (CRUD)
> 📁 Para quien trabaje en `publicarAlerta.tsx`, `index.tsx`, `mapa.tsx`, etc.

Importan `db` desde el servicio y las funciones de Firestore que necesiten:

```typescript
import { db } from '@/services/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
```

### Publicar una Alerta / Guardar en la Base de Datos (`publicarAlerta.tsx`):
```typescript
try {
  const docRef = await addDoc(collection(db, 'alertas'), {
    nombre: 'Milo',
    especie: 'PERRO',
    estado: 'PERDIDO',
    descripcion: 'Caniche toy con collar azul',
    ubicacion: 'Barrio Champagnat, Pilar',
    contacto: '11 2345-6789',
    coordenadas: {
      latitude: -34.4497,
      longitude: -58.9194,
    },
    fechaCreacion: new Date().toISOString(),
  });

  Alert.alert('¡Éxito!', `Alerta publicada con ID: ${docRef.id}`);
} catch (error: any) {
  Alert.alert('Error', 'No se pudo guardar en la base de datos');
}
```

### Leer Alertas para el Feed (`index.tsx`):
```typescript
try {
  const querySnapshot = await getDocs(collection(db, 'alertas'));
  const listaMascotas = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  setMascotas(listaMascotas);
} catch (error) {
  console.error('Error al obtener alertas:', error);
}
```

### Filtrar (por ejemplo solo mascotas 'PERDIDO'):
```typescript
const q = query(collection(db, 'alertas'), where('estado', '==', 'PERDIDO'));
const querySnapshot = await getDocs(q);
const perdidos = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
```

### Actualizar un Documento (Marcar como Encontrado):
```typescript
const docRef = doc(db, 'alertas', idAlerta);
await updateDoc(docRef, { estado: 'ENCONTRADO' });
```

---

## 🎯 En Resumen:
* **`services/ConexionFirebase.ts`**: Es el Singleton que orquesta la conexión a Firebase para que no tengan que configurar tokens ni SDKs.
* **`services/firebase.ts`**: Es el archivo donde pueden importar directamente `{ db, auth, storage }`.
* **Sus componentes**: Cada uno importa `{ db, auth }` y escribe la lógica de su pantalla aprendiendo a interactuar con Firebase.
