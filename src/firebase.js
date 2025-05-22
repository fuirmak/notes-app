// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSBX75vQ1_tv64zrWFbq0nMRr_y_fWYw4",
  authDomain: "note-app-a355a.firebaseapp.com",
  projectId: "note-app-a355a",
  storageBucket: "note-app-a355a.firebasestorage.app",
  messagingSenderId: "672321030260",
  appId: "1:672321030260:web:abcc7a29d4969288682921",
  measurementId: "G-8ZP2J4TWDJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

