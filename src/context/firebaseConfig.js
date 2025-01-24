// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"; // Only import the auth-related functions

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9nt_HhMiND0LaG16gZ62nJUjl7hx5kjM", // Replace with your API key
  authDomain: "userauth-2b884.firebaseapp.com", // Replace with your Auth domain
  projectId: "userauth-2b884", // Replace with your project ID
  storageBucket: "userauth-2b884.firebasestorage.app", // Replace with your Storage bucket
  messagingSenderId: "563733651336", // Replace with your sender ID
  appId: "1:563733651336:web:5ff4171f22216e1038a43d", // Replace with your App ID
  measurementId: "G-JZNWGXYKKT" // Optional, used only if you use Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
