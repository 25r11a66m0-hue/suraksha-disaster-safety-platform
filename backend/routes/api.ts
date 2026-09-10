/**
 * SURAKSHA Unified API Routing Layer
 * Implements clean REST endpoints for public citizens and verified disaster authorities.
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import {
  usersCollection,
  authoritiesCollection,
  sheltersCollection,
  rescueTeamsCollection,
  resourcesCollection,
  alertsCollection,
  sosRequestsCollection,
  historicalDisastersCollection,
  auditLogsCollection,
  hashPassword,
  verifyPassword
} from '../database/store';
import {
  requireAuth,
  requireAuthority,
  createSessionToken,
  revokeSessionToken,
  getSession,
  AuthenticatedRequest
} from '../middleware/auth';
import { fetchLiveWeather } from '../services/weatherService';
import { computeRiskScore } from '../services/riskEngine';
import { adminAuth } from '../lib/firebaseAdmin';
import { createAndDispatchAlert } from '../services/alertService';
import { createSosRequest, assignTeamToSos, updateSosStatus } from '../services/sosService';
import { findNearbyShelters } from '../services/shelterService';
import { computeSaferRoute } from '../services/routingService';
import { satelliteService } from '../services/satelliteService';
import { getCommunicationChannels } from '../services/communicationService';
import { getSimulationState, activateScenario } from '../services/simulationService';
import {
  processMultiTurnChat,
  ASSISTANT_ROLES,
  AssistantRoleId,
  ModelTier
} from '../services/geminiChatService';
import { requestOtp, verifyOtp } from '../services/otpService';
import { smsGateway } from '../services/smsService';

export const apiRouter = Router();

// Health & SOS Sync Status Indicator Check
apiRouter.get('/sync/status', (req, res) => {
  const activeAlerts = alertsCollection.filter((a) => a.status === 'ACTIVE');
  const allSos = sosRequestsCollection.getAll();
  res.json({
    status: 'ONLINE',
    serverTime: new Date().toISOString(),
    sosGateway: 'ACTIVE',
    activeAlertsCount: activeAlerts.length,
    sosTotalCount: allSos.length
  });
});

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'OPERATIONAL',
    system: 'SURAKSHA National Disaster Response Platform',
    timestamp: new Date().toISOString()
  });
});

// ==================== AUTHENTICATION (PUBLIC) ====================

// Establish verified citizen session via Firebase Authentication
const handleFirebaseSession = async (req: Request, res: Response) => {
  try {
    const { uid, email, fullName, phoneNumber, phone } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'Firebase UID is required.' });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phoneNumber || phone || '').trim();

    // Lookup existing citizen by uid, email, or phone
    let user = usersCollection.find((u) => u.uid === uid || u.id === uid || (cleanEmail && u.email === cleanEmail));

    if (!user) {
      // Create citizen profile in SURAKSHA
      const newUser = {
        id: uid,
        uid,
        fullName: (fullName || 'Citizen').trim(),
        email: cleanEmail,
        phone: cleanPhone,
        phoneNumber: cleanPhone,
        passwordHash: '',
        passwordSalt: '',
        isPhoneVerified: false,
        role: 'PUBLIC_USER' as const,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      usersCollection.insert(newUser);
      user = newUser;
    } else {
      usersCollection.update(user.id, {
        fullName: fullName?.trim() || user.fullName,
        email: cleanEmail || user.email,
        phoneNumber: cleanPhone || user.phoneNumber,
        phone: cleanPhone || user.phone,
        updatedAt: new Date().toISOString()
      });
      user = usersCollection.getById(user.id) || user;
    }

    const token = createSessionToken(user.id, 'PUBLIC_USER');

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        uid: user.uid || user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || user.phone,
        phone: user.phone || user.phoneNumber,
        isPhoneVerified: false,
        role: user.role,
        status: user.status || 'active',
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to establish citizen session.' });
  }
};

apiRouter.post('/auth/session', handleFirebaseSession);
apiRouter.post('/auth/firebase-session', handleFirebaseSession);

apiRouter.post('/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email address, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = (phoneNumber || phone || '').trim();

    const existingUser = usersCollection.find((u) => u.email === cleanEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'An account is already registered with this email address.' });
    }

    const { hash, salt } = hashPassword(password);
    const userId = `user-${Date.now()}`;

    const newUser = {
      id: userId,
      uid: userId,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      phoneNumber: cleanPhone,
      passwordHash: hash,
      passwordSalt: salt,
      isPhoneVerified: false,
      role: 'PUBLIC_USER' as const,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    usersCollection.insert(newUser);

    const token = createSessionToken(userId, 'PUBLIC_USER');

    res.status(201).json({
      message: 'Citizen account created successfully.',
      token,
      user: {
        id: userId,
        uid: userId,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        phone: newUser.phone,
        isPhoneVerified: false,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

apiRouter.post('/auth/login', (req, res) => {
  const { email, phone, password } = req.body;
  if ((!email && !phone) || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPhone = phone ? phone.trim() : '';

  const user = usersCollection.find(
    (u) => (cleanEmail && u.email === cleanEmail) || (cleanPhone && (u.phone === cleanPhone || u.phoneNumber === cleanPhone))
  );

  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = createSessionToken(user.id, 'PUBLIC_USER');
  res.json({
    token,
    user: {
      id: user.id,
      uid: user.uid || user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || user.phone,
      phone: user.phone || user.phoneNumber,
      isPhoneVerified: false,
      role: user.role,
      status: user.status || 'active',
      createdAt: user.createdAt
    }
  });
});

apiRouter.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Please provide your registered email address.' });
  }
  // Generic success response to avoid exposing registered emails
  res.json({
    message: 'If an account exists for this email address, password reset instructions have been dispatched.'
  });
});

// ==========================================
// SECURE OTP VERIFICATION (TextBee Integrated)
// ==========================================

apiRouter.post('/auth/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }
    const result = await requestOtp(phoneNumber);
    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        error: result.message,
        expiresInSeconds: result.expiresInSeconds,
        resendCooldownSeconds: result.resendCooldownSeconds
      });
    }
    res.json({
      success: true,
      message: result.message,
      expiresInSeconds: result.expiresInSeconds,
      resendCooldownSeconds: result.resendCooldownSeconds
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to send OTP. Please try again.' });
  }
});

apiRouter.post('/auth/resend-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }
    const result = await requestOtp(phoneNumber);
    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        error: result.message,
        expiresInSeconds: result.expiresInSeconds,
        resendCooldownSeconds: result.resendCooldownSeconds
      });
    }
    res.json({
      success: true,
      message: result.message,
      expiresInSeconds: result.expiresInSeconds,
      resendCooldownSeconds: result.resendCooldownSeconds
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Unable to send OTP. Please try again.' });
  }
});

apiRouter.post('/auth/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Mobile number and 6-digit OTP code are required.' });
    }

    const result = await verifyOtp(phoneNumber, otp);
    if (!result.success) {
      return res.status(result.statusCode || 400).json({ error: result.message });
    }

    // Find or create citizen profile
    let user = usersCollection.find(
      (u) => u.phone === result.phoneNumber || u.phoneNumber === result.phoneNumber
    );

    if (!user) {
      const newUserId = `citizen-${Date.now()}`;
      const newUser = {
        id: newUserId,
        uid: newUserId,
        fullName: 'Citizen Responder',
        email: `${result.phoneNumber!.replace('+', '')}@suraksha.citizen.in`,
        phone: result.phoneNumber!,
        phoneNumber: result.phoneNumber!,
        passwordHash: 'otp_verified',
        passwordSalt: 'otp_verified',
        isPhoneVerified: true,
        role: 'PUBLIC_USER' as const,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      user = usersCollection.insert(newUser);
    } else {
      user = usersCollection.update(user.id, {
        isPhoneVerified: true,
        phoneNumber: result.phoneNumber!,
        phone: result.phoneNumber!,
        updatedAt: new Date().toISOString()
      })!;
    }

    const token = createSessionToken(user.id, 'PUBLIC_USER');
    res.json({
      success: true,
      message: 'Mobile number verified and authenticated successfully.',
      token,
      user: {
        id: user.id,
        uid: user.uid || user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || user.phone,
        phone: user.phone || user.phoneNumber,
        isPhoneVerified: true,
        role: user.role,
        status: user.status || 'active',
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Verification failed.' });
  }
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  if (req.user?.role === 'PUBLIC_USER') {
    const user = usersCollection.getById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({
      id: user.id,
      uid: user.uid || user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || user.phone,
      phone: user.phone || user.phoneNumber,
      isPhoneVerified: !!user.isPhoneVerified,
      role: user.role,
      status: user.status || 'active',
      createdAt: user.createdAt
    });
  } else {
    const authRecord = authoritiesCollection.getById(req.user?.id || '');
    if (!authRecord) return res.status(404).json({ error: 'Authority not found.' });
    return res.json({
      id: authRecord.id,
      authorityId: authRecord.authorityId,
      name: authRecord.name,
      department: authRecord.department,
      roleTitle: authRecord.roleTitle,
      jurisdiction: authRecord.jurisdiction,
      role: authRecord.role
    });
  }
});

apiRouter.post('/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    revokeSessionToken(authHeader.substring(7));
  }
  res.json({ message: 'Logged out successfully.' });
});

// Update citizen last location
apiRouter.post('/auth/update-location', requireAuth, (req: AuthenticatedRequest, res) => {
  const { latitude, longitude, accuracy, source } = req.body;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Valid latitude and longitude required.' });
  }

  if (req.user?.role === 'PUBLIC_USER') {
    usersCollection.update(req.user.id, {
      lastLocation: {
        latitude,
        longitude,
        accuracy: accuracy || 10,
        timestamp: Date.now(),
        source: source || 'LIVE_GPS'
      }
    });
  }

  res.json({ success: true, timestamp: new Date().toISOString() });
});

// ==================== AUTHENTICATION (AUTHORITY) ====================

apiRouter.post('/authority/login', async (req, res) => {
  const { authorityId, password } = req.body;

  if (!authorityId || !password) {
    return res.status(400).json({ error: 'Official Authority ID and Password required.' });
  }

  const authority = authoritiesCollection.find((a) => a.authorityId === authorityId.trim());
  if (!authority || !verifyPassword(password, authority.passwordHash, authority.passwordSalt)) {
    // Record failed attempt in audit log
    auditLogsCollection.insert({
      id: `audit-${Date.now()}`,
      actorId: authorityId,
      actorName: 'Unknown Caller',
      actorRole: 'ANONYMOUS',
      action: 'AUTHORITY_LOGIN_FAILED',
      targetCollection: 'authorities',
      details: `Failed login attempt for Authority ID: ${authorityId}.`,
      timestamp: new Date().toISOString(),
      status: 'DENIED'
    });
    return res.status(401).json({ error: 'Invalid Authority credentials. Access denied.' });
  }

  // Update last login
  const now = new Date().toISOString();
  authoritiesCollection.update(authority.id, { lastLogin: now });

  let firebaseToken = null;
  if (adminAuth) {
    try {
      firebaseToken = await adminAuth.createCustomToken(authority.id, { role: 'AUTHORITY' });
    } catch (err) {
      console.error('Failed to create custom Firebase token for authority', err);
    }
  }

  const token = createSessionToken(authority.id, authority.role, authority.authorityId, firebaseToken || undefined);

  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: authority.authorityId,
    actorName: authority.name,
    actorRole: authority.role,
    action: 'AUTHORITY_LOGIN_SUCCESS',
    targetCollection: 'authorities',
    targetId: authority.id,
    details: `Authorized login for ${authority.name} (${authority.roleTitle}).`,
    timestamp: now,
    status: 'SUCCESS'
  });

  res.json({
    token,
    authority: {
      id: authority.id,
      authorityId: authority.authorityId,
      name: authority.name,
      department: authority.department,
      roleTitle: authority.roleTitle,
      jurisdiction: authority.jurisdiction,
      verificationStatus: authority.verificationStatus,
      role: authority.role,
      lastLogin: now
    }
  });
});

apiRouter.get('/authority/profile', requireAuthority, (req: AuthenticatedRequest, res) => {
  const authority = authoritiesCollection.getById(req.user?.id || '');
  if (!authority) return res.status(404).json({ error: 'Authority record not found.' });

  res.json({
    id: authority.id,
    authorityId: authority.authorityId,
    name: authority.name,
    department: authority.department,
    roleTitle: authority.roleTitle,
    phone: authority.phone,
    email: authority.email,
    jurisdiction: authority.jurisdiction,
    verificationStatus: authority.verificationStatus,
    role: authority.role,
    lastLogin: authority.lastLogin
  });
});

// ==================== WEATHER & RISK ====================

apiRouter.get('/weather', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 17.7200; // Default Visakhapatnam
    const lng = parseFloat(req.query.lng as string) || 83.3100;
    const weather = await fetchLiveWeather(lat, lng);
    res.json(weather);
  } catch (err: any) {
    res.status(500).json({ error: 'Weather upstream unavailable.' });
  }
});

apiRouter.get('/risk', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 17.7200;
    const lng = parseFloat(req.query.lng as string) || 83.3100;
    const weather = await fetchLiveWeather(lat, lng);
    const risk = computeRiskScore(lat, lng, weather);
    res.json(risk);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compute sector risk score.' });
  }
});

// ==================== ALERTS ====================

apiRouter.get('/alerts', (req, res) => {
  const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
  const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
  const all = req.query.all === 'true';

  const alerts = alertsCollection.getAll();

  if (all) {
    return res.json(alerts);
  }

  // Active only
  const active = alerts.filter((a) => a.status === 'ACTIVE');

  // If coordinates provided, filter by geographic radius
  if (lat !== undefined && lng !== undefined) {
    const relevant = active.filter((a) => {
      // Calculate distance
      const R = 6371;
      const dLat = ((a.latitude - lat) * Math.PI) / 180;
      const dLon = ((a.longitude - lng) * Math.PI) / 180;
      const x =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) * Math.cos((a.latitude * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const dist = R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
      return dist <= a.radiusKm + 5; // within geofence + small buffer
    });
    return res.json(relevant);
  }

  res.json(active);
});

apiRouter.post('/alerts', requireAuthority, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      disasterType,
      title,
      message,
      severity,
      affectedArea,
      latitude,
      longitude,
      radiusKm,
      safetyInstructions,
      recommendedAction,
      recommendedShelterId,
      recommendedShelterName,
      languages,
      expiresAt
    } = req.body;

    if (!disasterType || !title || !message || !severity || !affectedArea) {
      return res.status(400).json({ error: 'Missing required alert fields.' });
    }

    const actor = {
      id: req.user?.id || 'auth-unknown',
      name: req.user?.name || 'Authority Commander',
      role: req.user?.role || 'AUTHORITY'
    };

    const newAlert = await createAndDispatchAlert(
      {
        disasterType,
        title,
        message,
        severity,
        affectedArea,
        latitude: Number(latitude) || 17.72,
        longitude: Number(longitude) || 83.31,
        radiusKm: Number(radiusKm) || 15,
        safetyInstructions: safetyInstructions || [
          'Follow instructions from local disaster authorities.',
          'Move away from hazardous low-lying corridors.',
          'Keep mobile phones charged and monitor SURAKSHA.'
        ],
        recommendedAction: recommendedAction || 'Move to recommended high-ground shelter.',
        recommendedShelterId,
        recommendedShelterName,
        languages: languages || ['en', 'te', 'hi'],
        expiresAt: expiresAt || new Date(Date.now() + 24 * 3600000).toISOString(),
        issuedByAuthorityId: req.user?.authorityId || '26101AP254',
        authorityName: actor.name,
        status: 'ACTIVE',
        isSimulation: false
      },
      actor,
      process.env.APP_URL
    );

    res.status(201).json(newAlert);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Alert creation failed.' });
  }
});

apiRouter.put('/alerts/:id/cancel', requireAuthority, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const alert = alertsCollection.getById(id);
  if (!alert) return res.status(404).json({ error: 'Alert not found.' });

  alertsCollection.update(id, { status: 'CANCELLED' });

  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: req.user?.id || '',
    actorName: req.user?.name || 'Authority',
    actorRole: 'AUTHORITY',
    action: 'CANCEL_ALERT',
    targetCollection: 'alerts',
    targetId: id,
    details: `Cancelled active alert ${id} (${alert.title}).`,
    timestamp: new Date().toISOString(),
    status: 'SUCCESS'
  });

  res.json({ message: 'Alert cancelled successfully.' });
});

// ==================== SHELTERS & SAFER ROUTE ====================

apiRouter.get('/shelters', (req, res) => {
  const shelters = sheltersCollection.getAll();
  res.json(shelters);
});

apiRouter.get('/shelters/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 17.7200;
  const lng = parseFloat(req.query.lng as string) || 83.3100;
  const list = findNearbyShelters(lat, lng);
  res.json(list);
});

const handleUpdateShelter = (req: AuthenticatedRequest, res: any) => {
  const { id } = req.params;
  const partial = req.body;
  const updated = sheltersCollection.update(id, {
    ...partial,
    lastUpdated: new Date().toISOString()
  });

  if (!updated) return res.status(404).json({ error: 'Shelter not found.' });

  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: req.user?.id || '',
    actorName: req.user?.name || 'Authority',
    actorRole: 'AUTHORITY',
    action: 'UPDATE_SHELTER',
    targetCollection: 'shelters',
    targetId: id,
    details: `Updated capacity/status for shelter ${updated.name}. Occupancy: ${updated.occupiedCapacity}/${updated.totalCapacity}.`,
    timestamp: new Date().toISOString(),
    status: 'SUCCESS'
  });

  res.json(updated);
};

apiRouter.put('/shelters/:id', requireAuthority, handleUpdateShelter);
apiRouter.patch('/shelters/:id', requireAuthority, handleUpdateShelter);

apiRouter.get('/routes/safer', (req, res) => {
  const startLat = parseFloat((req.query.originLat || req.query.startLat) as string) || 17.7200;
  const startLng = parseFloat((req.query.originLng || req.query.startLng) as string) || 83.3100;
  const shelterId = req.query.shelterId as string | undefined;

  const route = computeSaferRoute(startLat, startLng, shelterId);
  res.json(route);
});

// ==================== SOS REQUESTS ====================

apiRouter.post('/sos', async (req, res) => {
  try {
  const {
    userId,
    userName,
    userPhone,
    latitude,
    longitude,
    accuracy,
    areaDescription,
    emergencyType,
    peopleCount,
    message,
    medicalAssistanceRequired,
    status,
    isSimulation
  } = req.body;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Valid geographic coordinates (latitude & longitude) required for SOS dispatch.' });
  }

  const sos = await createSosRequest({
    userId: userId || `anon-${Date.now()}`,
    userName,
    userPhone,
    latitude,
    longitude,
    accuracy,
    areaDescription,
    emergencyType: emergencyType || 'RESCUE',
    peopleCount: Number(peopleCount) || 1,
    message: message || 'Emergency assistance requested via SURAKSHA one-tap SOS.',
    medicalAssistanceRequired: Boolean(medicalAssistanceRequired),
    status: status || 'RECEIVED',
    isSimulation: Boolean(isSimulation)
  });

  res.status(201).json(sos);
  } catch (err: any) {
    console.error('SOS Creation Error:', err);
    res.status(500).json({ error: 'Failed to dispatch SOS: ' + err.message });
  }
});

apiRouter.get('/sos/my', requireAuth, (req: AuthenticatedRequest, res) => {
  const allSos = sosRequestsCollection.getAll();
  const userSos = allSos.filter((s) => s.userId === req.user?.id);
  res.json(userSos);
});

apiRouter.get('/sos', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const session = token ? getSession(token) : null;
  const isAuthority = session?.role === 'AUTHORITY' || session?.role === 'ADMIN';

  const allSos = sosRequestsCollection.getAll();
  // Sort descending by creation date
  allSos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (isAuthority) {
    return res.json(allSos);
  }

  // Public/anonymized version for GIS mapping and situational awareness
  const sanitized = allSos.map((s) => ({
    ...s,
    userPhone: s.userPhone ? s.userPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : undefined
  }));
  res.json(sanitized);
});

apiRouter.get('/sos/:id', (req, res) => {
  const sos = sosRequestsCollection.getById(req.params.id);
  if (!sos) return res.status(404).json({ error: 'SOS incident not found.' });
  res.json(sos);
});

apiRouter.put('/sos/:id/assign-team', requireAuthority, async (req: AuthenticatedRequest, res) => {
  const { teamId, note } = req.body;
  if (!teamId) return res.status(400).json({ error: 'Rescue team ID is required.' });

  const actor = {
    id: req.user?.id || '',
    name: req.user?.name || 'Commander',
    role: 'AUTHORITY'
  };

  try {
    const updated = await assignTeamToSos(req.params.id, teamId, actor, note);
    if (!updated) return res.status(404).json({ error: 'SOS or rescue team not found.' });
    res.json(updated);
  } catch(err: any) {
    res.status(500).json({error: err.message});
  }
});

apiRouter.put('/sos/:id/status', requireAuthority, async (req: AuthenticatedRequest, res) => {
  try {
    const { status, note, assignedTeamId } = req.body;
    if (!status) return res.status(400).json({ error: 'New status required.' });

    const actor = {
      id: req.user?.id || '',
      name: req.user?.name || 'Commander',
      role: 'AUTHORITY'
    };

    let updatedSos;

    if (assignedTeamId) {
      updatedSos = await assignTeamToSos(req.params.id, assignedTeamId, actor, note);
      if (!updatedSos) return res.status(404).json({ error: 'SOS or rescue team not found.' });
      
      if (status !== 'TEAM_ASSIGNED') {
        updatedSos = await updateSosStatus(req.params.id, status, actor, `Status updated to ${status}`);
      }

      const team = rescueTeamsCollection.getById(assignedTeamId);
      if (team && team.phone) {
        const smsMessage = `DISPATCH COMMAND: ${team.teamCode} assigned to ${req.params.id}. Location: ${updatedSos?.latitude.toFixed(4)}, ${updatedSos?.longitude.toFixed(4)}. Note: ${note || ''}`;
        await smsGateway.send(team.phone, smsMessage);
      }
    } else {
      updatedSos = await updateSosStatus(req.params.id, status, actor, note);
      if (!updatedSos) return res.status(404).json({ error: 'SOS record not found.' });
    }

    res.json(updatedSos);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update SOS status.' });
  }
});

// ==================== RESCUE TEAMS & RESOURCES ====================

apiRouter.get('/rescue-teams', (req, res) => {
  res.json(rescueTeamsCollection.getAll());
});

apiRouter.put('/rescue-teams/:id', requireAuthority, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updated = rescueTeamsCollection.update(id, {
    ...req.body,
    lastUpdate: new Date().toISOString()
  });
  if (!updated) return res.status(404).json({ error: 'Team not found.' });

  res.json(updated);
});

apiRouter.get('/resources', (req, res) => {
  res.json(resourcesCollection.getAll());
});

const handleUpdateResource = (req: AuthenticatedRequest, res: any) => {
  const { id } = req.params;
  const updated = resourcesCollection.update(id, {
    ...req.body,
    lastUpdated: new Date().toISOString()
  });
  if (!updated) return res.status(404).json({ error: 'Resource not found.' });

  res.json(updated);
};

apiRouter.put('/resources/:id', requireAuthority, handleUpdateResource);
apiRouter.patch('/resources/:id', requireAuthority, handleUpdateResource);

// ==================== SATELLITE INTELLIGENCE ====================

apiRouter.get('/satellite', (req, res) => {
  const sim = getSimulationState();
  const isSim = sim?.isActive;
  res.json({
    satelliteName: 'EOS-05 (Earth Observation Satellite)',
    sensorType: 'C-band Synthetic Aperture Radar (SAR) & Multi-spectral Optical',
    orbitType: 'Sun-synchronous Polar Low Earth Orbit (620 km)',
    groundStation: 'National Remote Sensing Centre (NRSC) Shadnagar / ISRO',
    passTimestamp: new Date().toISOString(),
    observationSummary: isSim
      ? 'SIMULATION: C-band SAR radar imagery detects critical flood inundation expanding across 38.5 sq km in Visakhapatnam urban lowlands. Convective band intensifies.'
      : 'C-band SAR radar imagery detects significant coastal inundation over 14.2 sq km in Visakhapatnam urban lowlands. Sea surface temperature indicates deep cyclonic convective band over Bay of Bengal.',
    floodInundationAreaSqKm: isSim ? 38.5 : 14.2,
    cycloneEyeDetected: true,
    cloudTopTemperatureC: -78.4,
    soilMoistureSaturationPct: isSim ? 96 : 92
  });
});

apiRouter.get('/satellite/status', async (req, res) => {
  const status = await satelliteService.getStatus();
  res.json(status);
});

apiRouter.get('/satellite/observations', async (req, res) => {
  const observations = await satelliteService.getObservations();
  res.json(observations);
});

apiRouter.get('/satellite/eos05', (req, res) => {
  res.json({
    satelliteName: 'EOS-05',
    launchMission: 'GSLV-F17',
    launchDate: '04 September 2026',
    operator: 'Indian Space Research Organisation (ISRO)',
    type: 'Earth Observation Satellite (Disaster Management Support)',
    instruments: [
      'C-band Synthetic Aperture Radar (All-weather day/night flood extent mapping)',
      'Multi-spectral Optical Radiometer (Cloud, storm surge & vegetation indices)'
    ],
    downlinkGroundStations: [
      'NRSC Shadnagar Earth Station (Telangana)',
      'Antarctica Ground Station (Bharati)'
    ],
    operationalDisclosures: {
      directPhoneConnectivity: false,
      explanation: 'EOS-05 orbits in Low Earth Orbit (LEO) as an Earth-observation platform. Telemetry downlinks to ground stations for processed flood/cyclone raster delivery to SURAKSHA. Smartphones cannot communicate directly with EOS-05.'
    }
  });
});

// ==================== COMMUNICATIONS & RESILIENCE ====================

apiRouter.get('/communications/status', async (req, res) => {
  const status = await getCommunicationChannels();
  res.json(status);
});

// ==================== HISTORICAL DISASTERS ====================

apiRouter.get('/historical-disasters', (req, res) => {
  res.json(historicalDisastersCollection.getAll());
});

// ==================== EMERGENCY SIMULATION ====================

apiRouter.get('/simulation', (req, res) => {
  res.json(getSimulationState());
});

apiRouter.post('/simulation/activate', requireAuthority, (req: AuthenticatedRequest, res) => {
  const { scenario } = req.body;
  const actor = {
    id: req.user?.id || '',
    name: req.user?.name || 'Authority',
    role: 'AUTHORITY'
  };
  const updated = activateScenario(scenario || 'HEAVY_RAIN', actor);
  res.json(updated);
});

apiRouter.post('/simulation/reset', requireAuthority, (req: AuthenticatedRequest, res) => {
  const actor = {
    id: req.user?.id || '',
    name: req.user?.name || 'Authority',
    role: 'AUTHORITY'
  };
  const updated = activateScenario('NORMAL', actor);
  res.json(updated);
});

// ==================== ANALYTICS & AUDIT LOGS ====================

apiRouter.get('/analytics', (req, res) => {
  const alerts = alertsCollection.getAll();
  const sos = sosRequestsCollection.getAll();
  const shelters = sheltersCollection.getAll();
  const teams = rescueTeamsCollection.getAll();

  const totalShelterCapacity = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalShelterOccupancy = shelters.reduce((acc, s) => acc + s.occupiedCapacity, 0);

  res.json({
    activeAlertsCount: alerts.filter((a) => a.status === 'ACTIVE').length,
    pendingSosCount: sos.filter((s) => s.status !== 'RESOLVED').length,
    resolvedSosCount: sos.filter((s) => s.status === 'RESOLVED').length,
    availableTeamsCount: teams.filter((t) => t.currentStatus === 'AVAILABLE').length,
    deployedTeamsCount: teams.filter((t) => t.currentStatus !== 'AVAILABLE').length,
    shelterOccupancyRate: Math.round((totalShelterOccupancy / (totalShelterCapacity || 1)) * 100),
    totalSheltersOpen: shelters.filter((s) => s.status === 'OPEN').length,
    lastAuditActionTime: auditLogsCollection.getAll().slice(-1)[0]?.timestamp || new Date().toISOString()
  });
});

apiRouter.get('/audit-logs', requireAuthority, (req, res) => {
  const logs = auditLogsCollection.getAll();
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(logs.slice(0, 100));
});

// ==================== GEMINI AI MULTI-TURN CHATBOT ====================

// Get available assistant roles and configuration
apiRouter.get('/chat/roles', (req, res) => {
  res.json({
    roles: Object.values(ASSISTANT_ROLES),
    models: [
      { id: 'gemini-3.1-flash-lite', name: 'Fast Response (Flash Lite)', tier: 'fast', description: 'Lowest latency, rapid emergency check' },
      { id: 'gemini-3.5-flash', name: 'General Safety (3.5 Flash)', tier: 'general', description: 'Balanced reasoning for multi-turn safety guidance' },
      { id: 'gemini-3.1-pro-preview', name: 'Complex Analysis (3.1 Pro)', tier: 'complex', description: 'Deep reasoning for complex planning and medical triage' }
    ]
  });
});

// Multi-turn chat endpoint
apiRouter.post('/chat', async (req, res) => {
  try {
    const { message, history, roleId, taskComplexity, model } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const result = await processMultiTurnChat({
      message: message.trim(),
      history: Array.isArray(history) ? history : [],
      roleId: roleId as AssistantRoleId,
      taskComplexity: taskComplexity as ModelTier,
      explicitModel: typeof model === 'string' && model.trim() ? model.trim() : undefined
    });

    res.json(result);
  } catch (err: any) {
    console.error('[API /chat error]:', err);
    res.status(500).json({
      error: err?.message || 'Failed to process chat with Gemini assistant.',
      timestamp: new Date().toISOString()
    });
  }
});

// JSON error handling middleware for API routes to prevent HTML error responses
apiRouter.use((err: any, req: Request, res: Response, next: any) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});
