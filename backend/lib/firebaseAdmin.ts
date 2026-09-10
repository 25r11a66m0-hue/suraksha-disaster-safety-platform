import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let db: Firestore | null = null;
let adminAuth: Auth | null = null;

const cleanEnv = (val?: string) => {
  if (!val) return val;
  return val.replace(/^["']|["']$/g, '');
};

try {
  const projectId = cleanEnv(process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID);
  
  if (getApps().length === 0) {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      const privateKey = cleanEnv(process.env.FIREBASE_PRIVATE_KEY)!.replace(/\\n/g, '\n');
      const clientEmail = cleanEnv(process.env.FIREBASE_CLIENT_EMAIL)!;
      
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId
      });
    } else {
      initializeApp({
        projectId: projectId,
      });
    }
  }
  
  db = getFirestore();
  db.settings({ ignoreUndefinedProperties: true });
  adminAuth = getAuth();
  console.log('Firebase Admin initialized successfully in backend for project:', projectId);
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}

export { db as adminDb, adminAuth };