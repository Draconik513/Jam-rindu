// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, off, update } from "firebase/database";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Dapatkan Realtime Database instance
const db = getDatabase(app);

// Ekspor fungsi-fungsi dan db-nya
export { db, ref, push, onValue, off, update };
