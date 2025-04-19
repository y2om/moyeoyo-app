// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCQk7avboGwp0PuNv7ggvXNb-A9M84xxSI",
    authDomain: "moyeoyo-8e39a.firebaseapp.com",
    projectId: "moyeoyo-8e39a",
    storageBucket: "moyeoyo-8e39a.firebasestorage.app",
    messagingSenderId: "354214304287",
    appId: "1:354214304287:web:21887f648c50e80926132a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
