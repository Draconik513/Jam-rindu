import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, off, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCe52IjZGMTjksHRizfK9z53P7-atY9aFM",
  authDomain: "jam-rindu.firebaseapp.com",
  databaseURL: "https://jam-rindu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jam-rindu",
  storageBucket: "jam-rindu.appspot.com",
  messagingSenderId: "361620759028",
  appId: "1:361620759028:web:c45ec826a4ca41543359a1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push, onValue, off, remove };