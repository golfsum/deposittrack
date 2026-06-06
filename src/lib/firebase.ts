import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  type Auth,
  getAuth,
  // @ts-expect-error getReactNativePersistence is exported by firebase/auth but
  // not always present in the published types depending on the build target.
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  // Surface misconfiguration early instead of getting cryptic auth errors later.
  console.warn(
    '[firebase] Missing EXPO_PUBLIC_FIREBASE_* env vars. Copy .env.example to .env and fill them in.',
  );
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Web uses the default browser persistence; native needs AsyncStorage-backed
// persistence so the session survives app restarts.
function resolveAuth(): Auth {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth throws if it was already initialised (e.g. Fast Refresh).
    return getAuth(app);
  }
}

export const auth = resolveAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
