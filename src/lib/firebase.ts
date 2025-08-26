// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "trackflow-rqzc1",
  "appId": "1:465524193845:web:b615ebfe3b37918551cf7c",
  "storageBucket": "trackflow-rqzc1.firebasestorage.app",
  "apiKey": "AIzaSyDymh1uRZoXwt9YzJ89FppY0KijZtTHHOY",
  "authDomain": "trackflow-rqzc1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "465524193845"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
