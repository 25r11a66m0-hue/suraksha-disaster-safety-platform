/**
 * SURAKSHA Secure OTP Verification Service (TextBee Integrated)
 * 
 * - Cryptographically secure 6-digit OTP generation (crypto.randomInt)
 * - Salted SHA-256 HMAC hashing - plaintext OTP is NEVER stored
 * - 5-minute strict expiration window
 * - Maximum 3 verification attempts per OTP
 * - Rate limiting: 60-second resend cooldown & 5 requests/hour ceiling
 * - TextBee official SMS gateway dispatch via environment variables:
 *   TEXTBEE_API_KEY, TEXTBEE_DEVICE_ID, SMS_SENDER_ID
 * - Zero OTP logging, zero credential leakage, zero OTP in responses
 */

import crypto from 'crypto';
import { otpVerificationsCollection, usersCollection, auditLogsCollection } from '../database/store';

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const HOURLY_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 3;

/**
 * Validates and normalizes Indian mobile numbers
 * Matches standard 10-digit Indian numbers starting with 6, 7, 8, 9
 * Standardizes to E.164 format: +91XXXXXXXXXX
 */
export function normalizeIndianPhoneNumber(rawPhone: string): { isValid: boolean; normalized: string; error?: string } {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { isValid: false, normalized: '', error: 'Mobile number is required.' };
  }

  // Remove whitespace, hyphens, parentheses
  let cleaned = rawPhone.replace(/[\s\-()]/g, '');

  // Strip leading + or 0
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Must be exactly 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(cleaned)) {
    return {
      isValid: false,
      normalized: '',
      error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
    };
  }

  return {
    isValid: true,
    normalized: `+91${cleaned}`
  };
}

/**
 * Generates a cryptographically secure random 6-digit OTP
 */
function generateSecureOtp(): string {
  // crypto.randomInt is cryptographically strong
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Hashes an OTP with a random salt. Plaintext OTP is NEVER stored.
 */
function hashOtp(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

/**
 * Dispatches an SMS via the official TextBee API gateway using server-side secrets
 */
async function sendSmsViaTextBee(recipient: string, message: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.TEXTBEE_API_KEY;
  const deviceId = process.env.TEXTBEE_DEVICE_ID;

  if (!apiKey || !deviceId) {
    console.error('[TextBee] Configuration error: TEXTBEE_API_KEY or TEXTBEE_DEVICE_ID is missing from environment.');
    return { success: false, error: 'TextBee credentials are not configured.' };
  }

  try {
    const response = await fetch('https://api.textbee.dev/api/v1/gateway/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        recipients: [recipient],
        message,
        deviceId
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('[TextBee] API returned error status:', response.status, data);
      return {
        success: false,
        error: data?.message || data?.error || `TextBee HTTP ${response.status}`
      };
    }

    const result = data?.data;
    if (result?.success === false || (typeof result?.failureCount === 'number' && result.failureCount > 0)) {
      console.error('[TextBee] Dispatch was rejected by gateway:', result);
      return {
        success: false,
        error: result?.message || 'TextBee rejected dispatch.'
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[TextBee] Network exception:', err?.message || err);
    return {
      success: false,
      error: err?.message || 'Failed to connect to TextBee gateway.'
    };
  }
}

/**
 * Request and issue a new secure OTP
 */
export async function requestOtp(rawPhone: string): Promise<{
  success: boolean;
  message: string;
  expiresInSeconds: number;
  resendCooldownSeconds: number;
  statusCode?: number;
}> {
  const { isValid, normalized, error } = normalizeIndianPhoneNumber(rawPhone);
  if (!isValid) {
    return {
      success: false,
      message: error || 'Invalid mobile number.',
      expiresInSeconds: 0,
      resendCooldownSeconds: 0,
      statusCode: 400
    };
  }

  const now = Date.now();
  const existing = otpVerificationsCollection.getById(normalized);

  // 1. Rate Limiting: 60-second cooldown between requests
  if (existing) {
    const timeSinceLast = now - new Date(existing.lastRequestedAt).getTime();
    if (timeSinceLast < RESEND_COOLDOWN_MS) {
      const waitRemaining = Math.ceil((RESEND_COOLDOWN_MS - timeSinceLast) / 1000);
      return {
        success: false,
        message: `Please wait ${waitRemaining} seconds before requesting a new OTP.`,
        expiresInSeconds: Math.max(0, Math.ceil((new Date(existing.expiresAt).getTime() - now) / 1000)),
        resendCooldownSeconds: waitRemaining,
        statusCode: 429
      };
    }

    // 2. Hourly Rate Limiting: Max 5 requests per hour
    const windowAge = now - new Date(existing.windowStartTime).getTime();
    if (windowAge < HOURLY_WINDOW_MS) {
      if (existing.requestCountInWindow >= MAX_REQUESTS_PER_HOUR) {
        const windowRemainingMins = Math.ceil((HOURLY_WINDOW_MS - windowAge) / 60000);
        return {
          success: false,
          message: `Too many OTP requests. Maximum ${MAX_REQUESTS_PER_HOUR} requests allowed per hour. Try again in ${windowRemainingMins} minutes.`,
          expiresInSeconds: 0,
          resendCooldownSeconds: 60,
          statusCode: 429
        };
      }
    }
  }

  // Generate cryptographically secure OTP & random salt
  const otp = generateSecureOtp();
  const salt = crypto.randomBytes(16).toString('hex');
  const otpHash = hashOtp(otp, salt);

  const createdAt = new Date(now).toISOString();
  const expiresAt = new Date(now + OTP_EXPIRY_MS).toISOString();

  // Manage window count
  let windowStartTime = existing?.windowStartTime || createdAt;
  let requestCountInWindow = 1;
  if (existing) {
    const windowAge = now - new Date(existing.windowStartTime).getTime();
    if (windowAge < HOURLY_WINDOW_MS) {
      requestCountInWindow = existing.requestCountInWindow + 1;
      windowStartTime = existing.windowStartTime;
    } else {
      windowStartTime = createdAt;
      requestCountInWindow = 1;
    }
  }

  // Save hashed OTP record in store (Only ONE active OTP per phone)
  otpVerificationsCollection.insert({
    id: normalized,
    phoneNumber: normalized,
    otpHash,
    salt,
    createdAt,
    expiresAt,
    attempts: 0,
    maxAttempts: MAX_VERIFY_ATTEMPTS,
    isVerified: false,
    lastRequestedAt: createdAt,
    requestCountInWindow,
    windowStartTime
  });

  // Production dispatch via configured TextBee SMS Gateway
  const senderId = process.env.SMS_SENDER_ID || 'SURAKSHA';
  const smsMessage = `${senderId}: Your SURAKSHA verification OTP is ${otp}. It expires in 5 minutes. Do not share this OTP with anyone.`;
  const smsResult = await sendSmsViaTextBee(normalized, smsMessage);

  if (!smsResult.success) {
    return {
      success: false,
      message: 'Unable to send OTP. Please try again.',
      expiresInSeconds: 0,
      resendCooldownSeconds: 0,
      statusCode: 502
    };
  }

  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: normalized,
    actorName: 'Citizen SMS Recipient',
    actorRole: 'PUBLIC_USER',
    action: 'OTP_DISPATCH_TEXTBEE',
    targetCollection: 'otp_verifications',
    targetId: normalized,
    details: `TextBee SMS gateway dispatched verification packet to ${normalized}.`,
    timestamp: createdAt,
    status: 'SUCCESS'
  });

  return {
    success: true,
    message: 'OTP sent successfully to your registered mobile number.',
    expiresInSeconds: 300,
    resendCooldownSeconds: 60
  };
}

/**
 * Verifies a submitted 6-digit OTP against the stored secure hash
 */
export async function verifyOtp(rawPhone: string, submittedOtp: string): Promise<{
  success: boolean;
  message: string;
  statusCode?: number;
  phoneNumber?: string;
}> {
  const { isValid, normalized, error } = normalizeIndianPhoneNumber(rawPhone);
  if (!isValid) {
    return { success: false, message: error || 'Invalid mobile number.', statusCode: 400 };
  }

  if (!submittedOtp || typeof submittedOtp !== 'string' || submittedOtp.trim().length !== 6) {
    return { success: false, message: 'Please enter a valid 6-digit verification code.', statusCode: 400 };
  }

  const cleanOtp = submittedOtp.trim();
  const record = otpVerificationsCollection.getById(normalized);

  if (!record) {
    return {
      success: false,
      message: 'No active OTP request found for this mobile number. Please request an OTP.',
      statusCode: 404
    };
  }

  const now = Date.now();
  const isExpired = now > new Date(record.expiresAt).getTime();

  if (isExpired) {
    return {
      success: false,
      message: 'This OTP has expired. Please request a new verification code.',
      statusCode: 410
    };
  }

  // Check attempt limit
  if (record.attempts >= record.maxAttempts) {
    return {
      success: false,
      message: 'Maximum verification attempts exceeded (3/3). For your security, this OTP is now invalid. Please request a new code.',
      statusCode: 429
    };
  }

  // Compare hashes strictly using HMAC-SHA256
  const computedHash = hashOtp(cleanOtp, record.salt);
  const isMatch = computedHash === record.otpHash;

  if (!isMatch) {
    const updatedAttempts = record.attempts + 1;
    const remainingAttempts = Math.max(0, record.maxAttempts - updatedAttempts);

    otpVerificationsCollection.update(normalized, {
      attempts: updatedAttempts
    });

    return {
      success: false,
      message: remainingAttempts > 0
        ? `Incorrect OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
        : 'Incorrect OTP. Maximum attempts exceeded (3/3). This OTP has been invalidated.',
      statusCode: 400
    };
  }

  // OTP Verified Successfully!
  const verifiedAt = new Date().toISOString();
  otpVerificationsCollection.update(normalized, {
    isVerified: true,
    verifiedAt
  });

  // Mark citizen's phone number as verified in users collection if exists
  const existingUser = usersCollection.find(
    (u) => u.phone === normalized || u.phoneNumber === normalized
  );

  if (existingUser) {
    usersCollection.update(existingUser.id, {
      isPhoneVerified: true,
      phoneNumber: normalized,
      phone: normalized,
      updatedAt: verifiedAt
    });
  }

  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: normalized,
    actorName: existingUser?.fullName || 'Verified Mobile Requester',
    actorRole: 'PUBLIC_USER',
    action: 'OTP_VERIFIED_SUCCESS',
    targetCollection: 'otp_verifications',
    targetId: normalized,
    details: `Mobile ${normalized} successfully authenticated and verified.`,
    timestamp: verifiedAt,
    status: 'SUCCESS'
  });

  return {
    success: true,
    message: 'Mobile number verified successfully.',
    phoneNumber: normalized
  };
}
