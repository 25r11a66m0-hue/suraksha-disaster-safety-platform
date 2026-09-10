import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Read environment variables safely across client and server environments.
 */
const getEnvVar = (key: string): string | undefined => {
  try {
    // Vite client-side environment variable access
    const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env;
    if (metaEnv) {
      const val = metaEnv[key];
      if (val) return val;
    }
  } catch {
    // In environments where import.meta is restricted
  }

  try {
    // Node.js fallback if evaluated in server/build context
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[key];
      if (val) return val;
    }
  } catch {
    // process.env not accessible
  }

  return undefined;
};

const cleanEnv = (val?: string) => {
  if (!val) return val;
  return val.replace(/^["']|["']$/g, '');
};

// Retrieve environment credentials
const apiKey = cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_API_KEY : undefined));
const authDomain = cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_AUTH_DOMAIN : undefined));
const projectId = cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID || (typeof process !== 'undefined' ? (process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID) : undefined));
const storageBucket = cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_STORAGE_BUCKET : undefined));
const messagingSenderId = cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID : undefined));
const appId = cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_APP_ID : undefined));

/**
 * True if minimum required credentials to connect to Firebase are set.
 * Requires at least apiKey and projectId.
 */
export const isFirebaseConfigured: boolean = Boolean(apiKey && projectId);

/**
 * Resolved Firebase options, or null if configuration is incomplete.
 */
export const firebaseConfig: FirebaseOptions | null = isFirebaseConfigured
  ? {
      apiKey: apiKey!,
      authDomain: authDomain || (projectId ? `${projectId}.firebaseapp.com` : undefined),
      projectId: projectId!,
      storageBucket: storageBucket || (projectId ? `${projectId}.appspot.com` : undefined),
      messagingSenderId: messagingSenderId || undefined,
      appId: appId || undefined
    }
  : null;

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

// Safe initialization with defensive error handling
if (isFirebaseConfigured && firebaseConfig) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    firestoreInstance = getFirestore(appInstance);
    console.info('[SURAKSHA Firebase] Firebase Auth and Firestore initialized successfully.');
  } catch (error) {
    console.warn(
      '[SURAKSHA Firebase] Failed to initialize Firebase with provided credentials. Running in fallback mode:',
      error
    );
    appInstance = null;
    authInstance = null;
    firestoreInstance = null;
  }
} else {
  // Silent or informational warning when environment variables are omitted
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.info(
      '[SURAKSHA Firebase] Firebase credentials not detected. The platform operates stably in offline-first/local fallback mode.'
    );
  }
}

/**
 * Exported Firebase application instance (null if unconfigured or failed)
 */
export const app: FirebaseApp | null = appInstance;

/**
 * Exported Firebase Authentication instance (null if unconfigured or failed)
 */
export const auth: Auth | null = authInstance;

/**
 * Exported Cloud Firestore instance (null if unconfigured or failed)
 */
export const db: Firestore | null = firestoreInstance;

/**
 * Access the Auth instance safely or return null with warning if unavailable.
 */
export function getFirebaseAuth(): Auth | null {
  if (!authInstance) {
    console.warn('[SURAKSHA Firebase] Auth requested but Firebase credentials are not configured.');
  }
  return authInstance;
}

/**
 * Access the Firestore instance safely or return null with warning if unavailable.
 */
export function getFirebaseFirestore(): Firestore | null {
  if (!firestoreInstance) {
    console.warn('[SURAKSHA Firebase] Firestore requested but Firebase credentials are not configured.');
  }
  return firestoreInstance;
}

/**
 * Access the FirebaseApp instance safely or return null if unconfigured.
 */
export function getFirebaseApp(): FirebaseApp | null {
  return appInstance;
}

export default {
  app,
  auth,
  db,
  isFirebaseConfigured,
  firebaseConfig,
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseApp
};
