import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

let firebaseApp: FirebaseApp;
const useEmulator = () => import.meta.env.VITE_USE_FIREBASE_EMULATOR;

export const setupFirebase = () => {
  try {
    firebaseApp = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASEURL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
      appId: import.meta.env.VITE_FIREBASE_APPID,
    });
  } catch (error) {
    console.error({ error });
  }
};

let auth: Auth;
let firestore: ReturnType<typeof getFirestore>;
let storage: ReturnType<typeof getStorage>;

export const useAuth = async () => {
  auth = getAuth(firebaseApp);
  if (useEmulator()) {
    console.log('use emulator');
    const authUrl = 'http://127.0.0.1:9099';
    await fetch(authUrl);
    console.log('connected emulator');
    connectAuthEmulator(auth, authUrl);
    console.log('done');
  }
  return auth;
};

export const useFirestore = () => {
  if (!firestore) {
    firestore = getFirestore();
    if (useEmulator()) {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    }
  }
  return firestore;
};

export const useStorage = () => {
  if (!storage) {
    storage = getStorage();
    if (useEmulator()) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  }
  return storage;
};

// https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
