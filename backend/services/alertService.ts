/**
 * SURAKSHA Alert Management & Geographic Targeting Service
 */

import { EmergencyAlert } from '../../src/types';
import { adminDb } from '../lib/firebaseAdmin';

import { alertsCollection, usersCollection, auditLogsCollection } from '../database/store';
import { dispatchEmergencySms } from './smsService';

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function createAndDispatchAlert(
  data: Omit<EmergencyAlert, 'id' | 'issuedAt' | 'smsStats'>,
  actor: { id: string; name: string; role: string },
  appUrl?: string
): Promise<EmergencyAlert> {
  const alertId = `alert-${Date.now()}`;
  const now = new Date().toISOString();

  // Find all registered users whose last known location falls within the alert's radius
  const allUsers = usersCollection.getAll();
  const targetedPhoneNumbers: string[] = [];

  for (const user of allUsers) {
    if (user.lastLocation) {
      const dist = getDistanceKm(
        data.latitude,
        data.longitude,
        user.lastLocation.latitude,
        user.lastLocation.longitude
      );
      if (dist <= data.radiusKm) {
        if (user.phone) targetedPhoneNumbers.push(user.phone);
      }
    }
  }

  // Also include priority baseline demo responders in the zone if user list is small
  if (targetedPhoneNumbers.length === 0) {
    targetedPhoneNumbers.push('+91 891 256 4800'); // District control room test recipient
  }

  // Dispatch SMS
  const smsStats = await dispatchEmergencySms(
    alertId,
    targetedPhoneNumbers,
    data.title,
    data.affectedArea,
    data.recommendedAction,
    appUrl || 'https://suraksha.gov.in'
  );

  const fullAlert: EmergencyAlert = {
    ...data,
    id: alertId,
    issuedAt: now,
    smsStats: {
      targetedUsers: targetedPhoneNumbers.length,
      sent: smsStats.sent,
      pending: smsStats.pending,
      failed: smsStats.failed
    }
  };

  if (adminDb) {
    await adminDb.collection('emergencyAlerts').doc(alertId).set(fullAlert);
  }
  alertsCollection.insert(fullAlert as any);

  // Audit log
  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: 'CREATE_AND_DISPATCH_ALERT',
    targetCollection: 'alerts',
    targetId: alertId,
    details: `Issued ${data.severity} ${data.disasterType} alert covering ${data.affectedArea} (${data.radiusKm} km radius). Targeted ${targetedPhoneNumbers.length} users.`,
    timestamp: now,
    status: 'SUCCESS'
  });

  return fullAlert;
}
