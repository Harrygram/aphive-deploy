// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNV5UahBHyHE7Gl7_LsKOBrLADBEW9yvI",
  authDomain: "aphive-capstoneproject.firebaseapp.com",
  projectId: "aphive-capstoneproject",
  storageBucket: "aphive-capstoneproject.appspot.com",
  messagingSenderId: "1098577796864",
  appId: "1:1098577796864:web:e29429c2025db20545dde5",
  measurementId: "G-HF495PH9W0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };