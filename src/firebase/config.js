// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFKu1k7lWCW80J_5sHnfNCcedebouMu1E",
  authDomain: "gigflow-91466.firebaseapp.com",
  projectId: "gigflow-91466",
  storageBucket: "gigflow-91466.firebasestorage.app",
  messagingSenderId: "88515517544",
  appId: "1:88515517544:web:f019a801c22e660fd0afdd",
  measurementId: "G-ZDLBYR7FRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);