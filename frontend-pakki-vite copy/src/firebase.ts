
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4cpvORpAaTBFPUoUJ5kTUh7pmo9nJRZw",
  authDomain: "eduhub-pakki.firebaseapp.com",
  databaseURL: "https://eduhub-pakki-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eduhub-pakki",
  storageBucket: "eduhub-pakki.firebasestorage.app",
  messagingSenderId: "186054430152",
  appId: "1:186054430152:web:7fb76b4af1b3d7b2e004fd",
  measurementId: "G-KH1P37LYGQ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize the Realtime Database

export { database };