import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_G3XR7fIyypuE9eGZCZAQ9q5doqQ2qNU",
  authDomain: "patitas-encontradas-2026.firebaseapp.com",
  projectId: "patitas-encontradas-2026",
  storageBucket: "patitas-encontradas-2026.firebasestorage.app",
  messagingSenderId: "633513717477",
  appId: "1:633513717477:web:d883f628d134d25b3fae0c",
  measurementId: "G-R10Z0R9NZ8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);