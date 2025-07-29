// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe52IjZGMTjksHRizfK9z53P7-atY9aFM",
  authDomain: "jam-rindu.firebaseapp.com",
  databaseURL: "https://jam-rindu-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jam-rindu",
  storageBucket: "jam-rindu.firebasestorage.app",
  messagingSenderId: "361620759028",
  appId: "1:361620759028:web:c45ec826a4ca41543359a1",
  measurementId: "G-EVE0K0RMZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);