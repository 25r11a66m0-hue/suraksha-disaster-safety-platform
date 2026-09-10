/**
 * SURAKSHA Citizen Authentication Engine
 * 
 * INTERNAL DEVELOPMENT NOTE:
 * Phone verification is temporarily disabled. Real Firebase Phone Authentication can be enabled later.
 * 
 * This module provides standard Email + Password authentication backed by Firebase Auth
 * and Cloud Firestore user profiles, with robust fallback for local development.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import type { UserProfile } from '../types';

export interface RegisterCitizenParams {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
}

export interface LoginCitizenParams {
  email: string;
  password: string;
}

export interface AuthSuccessResult {
  user: UserProfile;
  token: string;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Stores profile in Cloud Firestore in the 'users' collection
 */
export async function saveUserProfileToFirestore(
  uid: string,
  data: {
    fullName: string;
    email: string;
    phoneNumber?: string;
  }
): Promise<void> {
  if (!db) {
    console.warn('[SURAKSHA] Cloud Firestore instance is null. Skipping Firestore profile persistence.');
    return;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const existing = await getDoc(userDocRef);

    const now = serverTimestamp();
    const cleanPhone = data.phoneNumber?.trim() || '';

    if (!existing.exists()) {
      await setDoc(userDocRef, {
        uid,
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phoneNumber: cleanPhone,
        role: 'PUBLIC_USER',
        status: 'active',
        createdAt: now,
        updatedAt: now
      });
    } else {
      await updateDoc(userDocRef, {
        fullName: data.fullName.trim(),
        phoneNumber: cleanPhone || existing.data()?.phoneNumber || '',
        updatedAt: now
      });
    }
  } catch (err) {
    console.warn('[SURAKSHA] Failed to persist profile to Firestore:', err);
  }
}

/**
 * Loads user profile from Cloud Firestore in the 'users' collection
 */
export async function loadUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: uid,
      uid,
      fullName: data.fullName || 'Citizen',
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      phone: data.phoneNumber || '',
      role: 'PUBLIC_USER',
      status: data.status || 'active',
      isPhoneVerified: false, // Never claim phone is verified
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString()
    };
  } catch (err) {
    console.warn('[SURAKSHA] Failed to load profile from Firestore:', err);
    return null;
  }
}

/**
 * Registers a new citizen using Email + Password
 */
export async function registerCitizen(params: RegisterCitizenParams): Promise<AuthSuccessResult> {
  const { fullName, email, password, confirmPassword, phoneNumber } = params;

  if (!fullName || !fullName.trim()) {
    throw new Error('Please enter your full name.');
  }
  if (!email || !isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new Error('Passwords do not match. Please re-enter.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim();
  const cleanPhone = phoneNumber ? phoneNumber.trim() : '';

  // 1. If Firebase Auth is configured and available
  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: cleanName }).catch(() => {});

      // Persist profile to Firestore 'users' collection
      await saveUserProfileToFirestore(user.uid, {
        fullName: cleanName,
        email: cleanEmail,
        phoneNumber: cleanPhone
      });

      // Synchronize session with backend server
      const backendRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          fullName: cleanName,
          email: cleanEmail,
          phoneNumber: cleanPhone
        })
      });

      let token = '';
      if (backendRes.ok) {
        const sessionData = await backendRes.json();
        token = sessionData.token;
      } else {
        token = await user.getIdToken().catch(() => `firebase-${user.uid}`);
      }

      const profile: UserProfile = {
        id: user.uid,
        uid: user.uid,
        fullName: cleanName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        phone: cleanPhone,
        role: 'PUBLIC_USER',
        status: 'active',
        isPhoneVerified: false,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('suraksha_token', token);
      localStorage.setItem('suraksha_user', JSON.stringify(profile));

      return { user: profile, token };
    } catch (firebaseErr: any) {
      if (firebaseErr.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email address already exists. Please sign in.');
      } else if (firebaseErr.code === 'auth/invalid-email') {
        throw new Error('The email address entered is invalid.');
      } else if (firebaseErr.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.');
      }
      throw firebaseErr;
    }
  }

  // 2. Development / Local server fallback
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: cleanName,
      email: cleanEmail,
      password,
      phoneNumber: cleanPhone
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to register account.');
  }

  const profile: UserProfile = {
    id: data.user.id,
    uid: data.user.id,
    fullName: data.user.fullName,
    email: data.user.email,
    phoneNumber: data.user.phoneNumber || data.user.phone || '',
    phone: data.user.phone || data.user.phoneNumber || '',
    role: 'PUBLIC_USER',
    status: 'active',
    isPhoneVerified: false,
    createdAt: data.user.createdAt || new Date().toISOString()
  };

  localStorage.setItem('suraksha_token', data.token);
  localStorage.setItem('suraksha_user', JSON.stringify(profile));

  return { user: profile, token: data.token };
}

/**
 * Signs in an existing citizen using Email + Password
 */
export async function loginCitizen(params: LoginCitizenParams): Promise<AuthSuccessResult> {
  const { email, password } = params;

  if (!email || !isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password) {
    throw new Error('Password is required.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. If Firebase Auth is configured and available
  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // Load Firestore profile
      let firestoreProfile = await loadUserProfileFromFirestore(user.uid);

      const fullName = firestoreProfile?.fullName || user.displayName || 'Citizen';
      const phoneNumber = firestoreProfile?.phoneNumber || '';

      // Synchronize with backend session
      const backendRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          fullName,
          email: cleanEmail,
          phoneNumber
        })
      });

      let token = '';
      if (backendRes.ok) {
        const sessionData = await backendRes.json();
        token = sessionData.token;
      } else {
        token = await user.getIdToken().catch(() => `firebase-${user.uid}`);
      }

      const profile: UserProfile = {
        id: user.uid,
        uid: user.uid,
        fullName,
        email: cleanEmail,
        phoneNumber,
        phone: phoneNumber,
        role: 'PUBLIC_USER',
        status: firestoreProfile?.status || 'active',
        isPhoneVerified: false,
        createdAt: firestoreProfile?.createdAt || new Date().toISOString()
      };

      localStorage.setItem('suraksha_token', token);
      localStorage.setItem('suraksha_user', JSON.stringify(profile));

      return { user: profile, token };
    } catch (firebaseErr: any) {
      if (
        firebaseErr.code === 'auth/user-not-found' ||
        firebaseErr.code === 'auth/wrong-password' ||
        firebaseErr.code === 'auth/invalid-credential'
      ) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      throw firebaseErr;
    }
  }

  // 2. Development / Local server fallback
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: cleanEmail,
      password
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid email or password.');
  }

  const profile: UserProfile = {
    id: data.user.id,
    uid: data.user.id,
    fullName: data.user.fullName,
    email: data.user.email,
    phoneNumber: data.user.phoneNumber || data.user.phone || '',
    phone: data.user.phone || data.user.phoneNumber || '',
    role: 'PUBLIC_USER',
    status: 'active',
    isPhoneVerified: false,
    createdAt: data.user.createdAt || new Date().toISOString()
  };

  localStorage.setItem('suraksha_token', data.token);
  localStorage.setItem('suraksha_user', JSON.stringify(profile));

  return { user: profile, token: data.token };
}

/**
 * Dispatches password reset email instructions
 */
export async function sendCitizenPasswordReset(email: string): Promise<void> {
  if (!email || !isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. If Firebase Auth is configured and available
  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        // Prevent user enumeration
        return;
      }
      throw err;
    }
  }

  // 2. Local fallback endpoint
  await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail })
  }).catch(() => {});
}

/**
 * Signs out the citizen from Firebase Auth and clears stored session tokens
 */
export async function logoutCitizen(): Promise<void> {
  try {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth).catch(() => {});
    }
  } catch {
    // Ignore sign out errors
  }

  try {
    const token = localStorage.getItem('suraksha_token');
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
  } catch {
    // Ignore fetch error on logout
  }

  localStorage.removeItem('suraksha_token');
  localStorage.removeItem('suraksha_user');
}

/**
 * Subscribes to Firebase onAuthStateChanged and persistent local session
 */
export function subscribeToAuthChanges(
  onUserChanged: (user: UserProfile | null, token: string | null) => void
): () => void {
  // If Firebase Auth is available, subscribe directly to onAuthStateChanged
  if (isFirebaseConfigured && auth) {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        let token = '';
        try {
          token = await firebaseUser.getIdToken();
          localStorage.setItem('suraksha_token', token);
        } catch (err) {
          console.error('Failed to get Firebase ID token:', err);
          token = localStorage.getItem('suraksha_token') || '';
        }

        let profile = await loadUserProfileFromFirestore(firebaseUser.uid);
        if (!profile) {
          profile = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            fullName: firebaseUser.displayName || 'Citizen',
            email: firebaseUser.email || '',
            role: 'PUBLIC_USER',
            status: 'active',
            isPhoneVerified: false,
            createdAt: new Date().toISOString()
          };
        }
        
        // Let the app know we are authenticated
        onUserChanged(profile, token);
      } else {
        // Firebase signed out or unauthenticated
        const storedUser = localStorage.getItem('suraksha_user');
        const storedToken = localStorage.getItem('suraksha_token');
        if (storedUser && storedToken) {
          try {
            onUserChanged(JSON.parse(storedUser), storedToken);
          } catch {
            onUserChanged(null, null);
          }
        } else {
          onUserChanged(null, null);
        }
      }
    });

    return unsubscribe;
  }

  // Fallback if Firebase Auth is not active
  const storedUser = localStorage.getItem('suraksha_user');
  const storedToken = localStorage.getItem('suraksha_token');
  if (storedUser && storedToken) {
    try {
      onUserChanged(JSON.parse(storedUser), storedToken);
    } catch {
      onUserChanged(null, null);
    }
  } else {
    onUserChanged(null, null);
  }

  return () => {};
}
