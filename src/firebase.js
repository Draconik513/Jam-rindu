// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, off, update } from "firebase/database";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCe52IjZGMTjksHRizfK9z53P7-atY9aFM",
  authDomain: "jam-rindu.firebaseapp.com",
  databaseURL: "https://jam-rindu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jam-rindu",
  storageBucket: "jam-rindu.appspot.com",
  messagingSenderId: "361620759028",
  appId: "1:361620759028:web:c45ec826a4ca41543359a1"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Dapatkan Realtime Database instance
const db = getDatabase(app);

// Ekspor fungsi-fungsi dan db-nya
export { db, ref, push, onValue, off, update };
