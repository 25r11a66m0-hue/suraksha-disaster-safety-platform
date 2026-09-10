/**
 * INTERNAL DEVELOPMENT NOTE:
 * Phone verification is temporarily disabled. Real Firebase Phone Authentication can be enabled later.
 * 
 * Modular reference for future Real Firebase Phone Authentication implementation.
 */

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
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

declare global {
  interface Window {
    surakshaRecaptchaVerifier?: RecaptchaVerifier | null;
  }
}

/**
 * Format raw phone input to standard E.164 format.
 * Defaults to India (+91) if 10 digits are provided without a leading country code.
 */
export function formatToE164(rawPhone: string): string {
  const cleaned = rawPhone.trim().replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  // Default to India country code (+91) for standard 10-digit Indian mobile numbers
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }
  // If user entered 0 followed by 10 digits
  if (/^0\d{10}$/.test(cleaned)) {
    return `+91${cleaned.slice(1)}`;
  }
  // If user entered 91 followed by 10 digits
  if (/^91\d{10}$/.test(cleaned)) {
    return `+${cleaned}`;
  }
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

/**
 * Validates E.164 phone number structure (e.g. +919876543210).
 */
export function isValidE164(phoneNumber: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(phoneNumber);
}

/**
 * Initializes and binds the Firebase reCAPTCHA verifier to a DOM container.
 */
export function setupRecaptcha(
  containerId: string,
  onSolved?: () => void,
  onExpired?: () => void
): RecaptchaVerifier {
  if (!auth) {
    throw new Error(
      'Phone verification is currently unavailable. Please try again later. (Firebase Auth instance is null)'
    );
  }

  // Clear previous verifier if present to prevent memory leaks or dual widgets
  if (window.surakshaRecaptchaVerifier) {
    try {
      window.surakshaRecaptchaVerifier.clear();
    } catch {
      // Ignore cleanup error
    }
    window.surakshaRecaptchaVerifier = null;
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'normal',
    callback: () => {
      if (onSolved) onSolved();
    },
    'expired-callback': () => {
      if (onExpired) onExpired();
    }
  });

  window.surakshaRecaptchaVerifier = verifier;
  return verifier;
}

/**
 * Clears the active reCAPTCHA instance.
 */
export function clearRecaptcha(): void {
  if (window.surakshaRecaptchaVerifier) {
    try {
      window.surakshaRecaptchaVerifier.clear();
    } catch {
      // Ignore cleanup error
    }
    window.surakshaRecaptchaVerifier = null;
  }
}

export interface SendOtpResult {
  confirmationResult: ConfirmationResult;
  formattedPhoneNumber: string;
}

/**
 * Initiates real Firebase Phone Authentication.
 * Firebase delivers a real verification code via SMS to the provided phone number.
 * No simulated or local OTP is generated.
 */
export async function sendFirebasePhoneOtp(
  rawPhone: string,
  verifier: RecaptchaVerifier
): Promise<SendOtpResult> {
  if (!isFirebaseConfigured || !auth) {
    const devDetails =
      'Configuration Required: Firebase Phone Authentication requires VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, and Phone Auth enabled in the Firebase Console.';
    const error = new Error('Phone verification is currently unavailable. Please try again later.');
    (error as any).developerDetails = devDetails;
    throw error;
  }

  const formatted = formatToE164(rawPhone);
  if (!isValidE164(formatted)) {
    throw new Error('Please enter a valid phone number with country code (e.g. +91 98765 43210).');
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(auth, formatted, verifier);
    return {
      confirmationResult,
      formattedPhoneNumber: formatted
    };
  } catch (err: any) {
    // Transform Firebase specific errors into clear actionable messages
    if (err.code === 'auth/invalid-phone-number') {
      throw new Error('The phone number entered is not formatted correctly in international format.');
    } else if (err.code === 'auth/missing-phone-number') {
      throw new Error('Phone number is required.');
    } else if (err.code === 'auth/quota-exceeded') {
      const error = new Error('Phone verification quota exceeded for this project. Please try again later.');
      (error as any).developerDetails =
        'Firebase SMS quota reached. In Firebase Console, enable billing or configure Firebase Test Phone Numbers for development.';
      throw error;
    } else if (err.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please wait a few minutes before requesting another verification code.');
    } else if (err.code === 'auth/captcha-check-failed') {
      throw new Error('reCAPTCHA verification failed. Please check your network and complete the captcha challenge.');
    } else if (err.code === 'auth/operation-not-allowed') {
      const error = new Error('Phone verification is currently unavailable. Please try again later.');
      (error as any).developerDetails =
        'Phone authentication is not enabled in your Firebase project. Go to Firebase Console -> Authentication -> Sign-in method -> Phone and enable it.';
      throw error;
    }

    throw err;
  }
}

/**
 * Submits the user-entered verification code to Firebase for actual verification.
 * Only Firebase's successful confirmation authenticates the user.
 */
export async function verifyFirebasePhoneOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<User> {
  const trimmed = otpCode.trim();
  if (!trimmed || trimmed.length < 6) {
    throw new Error('Please enter the complete 6-digit verification code received via SMS.');
  }

  try {
    const userCredential = await confirmationResult.confirm(trimmed);
    return userCredential.user;
  } catch (err: any) {
    if (err.code === 'auth/invalid-verification-code') {
      throw new Error('The verification code you entered is invalid. Please check the SMS and try again.');
    } else if (err.code === 'auth/code-expired') {
      throw new Error('This verification code has expired. Please request a new code.');
    } else if (err.code === 'auth/session-expired') {
      throw new Error('Verification session has expired. Please enter your phone number and request a new code.');
    }
    throw err;
  }
}

/**
 * Creates or updates the user profile document in Cloud Firestore.
 */
export async function syncFirestoreUserProfile(
  firebaseUser: User,
  profileData?: {
    fullName?: string;
    dob?: string;
    email?: string;
  }
): Promise<void> {
  if (!db) {
    console.warn('[SURAKSHA Firebase] Firestore instance is null. Skipping profile write to Firestore.');
    return;
  }

  try {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const existingSnap = await getDoc(userDocRef);

    if (!existingSnap.exists()) {
      await setDoc(userDocRef, {
        id: firebaseUser.uid,
        fullName: profileData?.fullName?.trim() || 'Citizen',
        phone: firebaseUser.phoneNumber || '',
        dob: profileData?.dob || '',
        email: profileData?.email?.trim() || '',
        isPhoneVerified: true,
        role: 'PUBLIC_USER',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(userDocRef, {
        isPhoneVerified: true,
        fullName: profileData?.fullName?.trim() || existingSnap.data()?.fullName || 'Citizen',
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('[SURAKSHA Firebase] Firestore profile synchronization warning:', err);
    // Continue session establishment even if Firestore write is blocked by rules
  }
}

/**
 * Establishes an authenticated SURAKSHA session after Firebase confirms the phone verification.
 */
export async function establishSurakshaSession(
  firebaseUser: User,
  profileData?: {
    fullName?: string;
    dob?: string;
    email?: string;
    consentEmergencySms?: boolean;
  }
): Promise<{ token: string; user: UserProfile }> {
  const idToken = await firebaseUser.getIdToken().catch(() => '');

  const response = await fetch('/api/auth/firebase-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uid: firebaseUser.uid,
      phone: firebaseUser.phoneNumber,
      fullName: profileData?.fullName || '',
      dob: profileData?.dob || '',
      email: profileData?.email || '',
      consentEmergencySms: profileData?.consentEmergencySms ?? true,
      idToken
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to establish verified citizen session.');
  }

  localStorage.setItem('suraksha_token', data.token);
  return {
    token: data.token,
    user: data.user
  };
}
