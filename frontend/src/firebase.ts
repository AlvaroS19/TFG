
/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:    import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Opcional: si quieres usar analytics, añade measurementId en tu .env
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Inicializa la app de Firebase
export const firebaseApp = initializeApp(firebaseConfig)

// Clientes que vas a usar en tus stores/componentes
export const firebaseAuth = getAuth(firebaseApp)
export const firebaseDb   = getFirestore(firebaseApp)
