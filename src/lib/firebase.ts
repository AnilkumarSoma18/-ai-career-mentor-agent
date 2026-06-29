import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8VBUjK7HItAuLPVkyxLP3YG3Qyc79cvw",
  authDomain: "reference-cumulus-qrtgb.firebaseapp.com",
  projectId: "reference-cumulus-qrtgb",
  storageBucket: "reference-cumulus-qrtgb.firebasestorage.app",
  messagingSenderId: "1061006420206",
  appId: "1:1061006420206:web:3b5670fe428b43dff5ebff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore (targeting the specified database ID if present, otherwise default)
const databaseId = "ai-studio-aicareermentorag-10c61fd9-18b6-409d-b36b-13db6af2c1cd";
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
