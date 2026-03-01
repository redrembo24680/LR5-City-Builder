// Firebase конфігурація (клієнтська — тільки для Auth)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA9VWc04PTbUyN_BqnDLXGvK8VaE709K-s",
    authDomain: "lab4-d0132.firebaseapp.com",
    projectId: "lab4-d0132",
    storageBucket: "lab4-d0132.firebasestorage.app",
    messagingSenderId: "395141032649",
    appId: "1:395141032649:web:7c27282b0f481a8bc97b18",
    measurementId: "G-JEKJ85PXE2"
};

const app = initializeApp(firebaseConfig);

// Тільки Auth — Firestore тепер через сервер API
export const auth = getAuth(app);

export default app;
