import { getApp, getApps, initializeApp } from "firebase/app";
import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from "firebase/firestore";

// Construct configuration pulling cleanly from .env variables for security and ease of use
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Initialize the core Firebase App instance safely without duplication
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore with active offline-caching parameters
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

console.log(
  "☁️ SafeRoute Android Cloud Container layer initialized successfully.",
);

export { app, db };

