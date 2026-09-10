/**
 * SURAKSHA Authentication & Role-Based Authorization Middleware
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { usersCollection, authoritiesCollection } from '../database/store';

// Token session storage (In memory / token map)
interface SessionData {
  userId: string;
  role: 'PUBLIC_USER' | 'AUTHORITY' | 'ADMIN';
  authorityId?: string;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionData>();

export function createSessionToken(userId: string, role: 'PUBLIC_USER' | 'AUTHORITY' | 'ADMIN', authorityId?: string, overrideToken?: string): string {
  const token = overrideToken || crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { userId, role, authorityId, expiresAt });
  return token;
}

export function revokeSessionToken(token: string) {
  activeSessions.delete(token);
}

export function getSession(token: string): SessionData | null {
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return null;
  }
  return session;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'PUBLIC_USER' | 'AUTHORITY' | 'ADMIN';
    authorityId?: string;
    name: string;
  };
}

import { adminAuth } from '../lib/firebaseAdmin';

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.substring(7);

  // Try verifying as a Firebase ID token first
  if (adminAuth) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      
      if (decodedToken.role === 'AUTHORITY') {
        const authRecord = authoritiesCollection.getById(decodedToken.uid);
        if (!authRecord) return res.status(401).json({ error: 'Authority account not found.' });
        req.user = {
          id: authRecord.id,
          role: 'AUTHORITY',
          authorityId: authRecord.authorityId,
          name: authRecord.name
        };
      } else {
        const userRecord = usersCollection.getById(decodedToken.uid);
        req.user = {
          id: decodedToken.uid,
          role: 'PUBLIC_USER',
          name: userRecord ? userRecord.fullName : (decodedToken.name || 'Citizen')
        };
      }
      return next();
    } catch (error) {
      // Token is not a valid Firebase ID token, fallback to checking local sessions
    }
  }

  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please re-authenticate.' });
  }

  if (session.role === 'AUTHORITY' || session.role === 'ADMIN') {
    const authRecord = authoritiesCollection.getById(session.userId);
    if (!authRecord) return res.status(401).json({ error: 'Authority account not found.' });
    req.user = {
      id: authRecord.id,
      role: session.role,
      authorityId: authRecord.authorityId,
      name: authRecord.name
    };
  } else {
    const userRecord = usersCollection.getById(session.userId);
    if (!userRecord) return res.status(401).json({ error: 'User record not found.' });
    req.user = {
      id: userRecord.id,
      role: 'PUBLIC_USER',
      name: userRecord.fullName
    };
  }

  next();
}

export function requireAuthority(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'AUTHORITY' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Access restricted to verified disaster response authorities.' });
    }
    next();
  });
}
