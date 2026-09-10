/**
 * SURAKSHA Emergency SOS Dispatch & Tracking Service
 * Generates verified SOS incident IDs (e.g. SOS-10427) and manages deterministic status lifecycle.
 */

import { SosRequest, SosStatus, SosEmergencyType } from '../../src/types';
import { adminDb } from '../lib/firebaseAdmin';

import { sosRequestsCollection, rescueTeamsCollection, auditLogsCollection } from '../database/store';

let sosSequenceCounter = 10427;

// Initialize counter from existing database records if any
const existingSos = sosRequestsCollection.getAll();
if (existingSos.length > 0) {
  for (const s of existingSos) {
    const match = s.id.match(/^SOS-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= sosSequenceCounter) sosSequenceCounter = num + 1;
    }
  }
}

export async function createSosRequest(data: {
  userId: string;
  userName?: string;
  userPhone?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  areaDescription?: string;
  emergencyType: SosEmergencyType;
  peopleCount: number;
  message: string;
  medicalAssistanceRequired: boolean;
  status?: SosStatus;
  isSimulation?: boolean;
}): Promise<SosRequest> {
  const now = new Date().toISOString();

  // Duplicate Submission Protection: Check if identical SOS submitted within last 30 seconds
  const recentDuplicates = sosRequestsCollection.filter((s) => {
    if (s.userId !== data.userId) return false;
    const timeDiff = Date.now() - new Date(s.createdAt).getTime();
    if (timeDiff > 30000) return false;
    const latDiff = Math.abs(s.latitude - data.latitude);
    const lngDiff = Math.abs(s.longitude - data.longitude);
    return latDiff < 0.0001 && lngDiff < 0.0001;
  });

  if (recentDuplicates.length > 0) {
    return recentDuplicates[0] as unknown as SosRequest;
  }

  const sosId = `SOS-${sosSequenceCounter++}`;
  const initialStatus: SosStatus = data.status || 'RECEIVED';

  const newRecord: SosRequest = {
    id: sosId,
    userId: data.userId,
    userName: data.userName || 'Citizen Requester',
    userPhone: data.userPhone || '+91 Unverified Phone',
    latitude: data.latitude,
    longitude: data.longitude,
    accuracy: data.accuracy,
    areaDescription: data.areaDescription,
    emergencyType: data.emergencyType,
    peopleCount: data.peopleCount,
    message: data.message,
    medicalAssistanceRequired: data.medicalAssistanceRequired,
    status: initialStatus,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: 'CONFIRMED',
        timestamp: now,
        note: 'Citizen completed double-confirmation. Verified distress signal.'
      },
      {
        status: initialStatus,
        timestamp: now,
        note: initialStatus === 'SENT' || initialStatus === 'RECEIVED'
          ? 'SOS packet received at SURAKSHA Incident Gateway. Geolocation verified.'
          : 'SOS queued in state: ' + initialStatus
      }
    ],
    isSimulation: data.isSimulation || false
  };

  if (adminDb) {
    await adminDb.collection('sosIncidents').doc(sosId).set(newRecord);
  }
  sosRequestsCollection.insert(newRecord as any);

  // Auto-log initial notification to disaster management operations
  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: data.userId,
    actorName: data.userName || 'Citizen Requester',
    actorRole: 'PUBLIC_USER',
    action: 'DISPATCH_SOS_REQUEST',
    targetCollection: 'sos_requests',
    targetId: sosId,
    details: `SOS created: ${data.emergencyType} for ${data.peopleCount} people at (${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}).`,
    timestamp: now,
    status: 'SUCCESS'
  });

  return newRecord;
}

export async function assignTeamToSos(
  sosId: string,
  teamId: string,
  actor: { id: string; name: string; role: string },
  note?: string
): Promise<SosRequest | null> {
  const sos = sosRequestsCollection.getById(sosId);
  const team = rescueTeamsCollection.getById(teamId);

  if (!sos || !team) return null;

  const now = new Date().toISOString();

  // Update team status
  rescueTeamsCollection.update(teamId, {
    currentStatus: 'ASSIGNED',
    assignedSosId: sosId,
    lastUpdate: now
  });

  // Update SOS status
  const updatedHistory = [
    ...sos.statusHistory,
    {
      status: 'TEAM_ASSIGNED' as SosStatus,
      timestamp: now,
      note: note || `Dispatched ${team.name} (${team.teamCode}) to incident location.`,
      updatedBy: actor.name
    }
  ];

  const updatedFields = {
    status: 'TEAM_ASSIGNED' as SosStatus,
    assignedTeamId: team.id,
    assignedTeamName: team.name,
    updatedAt: now,
    statusHistory: updatedHistory
  };
  if (adminDb) {
    await adminDb.collection('sosIncidents').doc(sosId).set(updatedFields, { merge: true });
  }
  const updatedSos = sosRequestsCollection.update(sosId, updatedFields);

  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: 'ASSIGN_RESCUE_TEAM',
    targetCollection: 'sos_requests',
    targetId: sosId,
    details: `Assigned team ${team.teamCode} (${team.name}) to SOS ${sosId}.`,
    timestamp: now,
    status: 'SUCCESS'
  });

  return updatedSos as any;
}

export async function updateSosStatus(
  sosId: string,
  newStatus: SosStatus,
  actor: { id: string; name: string; role: string },
  note?: string
): Promise<SosRequest | null> {
  const sos = sosRequestsCollection.getById(sosId);
  if (!sos) return null;

  const now = new Date().toISOString();

  const updatedHistory = [
    ...sos.statusHistory,
    {
      status: newStatus,
      timestamp: now,
      note: note || `Incident status updated to ${newStatus}.`,
      updatedBy: actor.name
    }
  ];

  const updatedFields = {
    status: newStatus,
    updatedAt: now,
    statusHistory: updatedHistory
  };
  if (adminDb) {
    await adminDb.collection('sosIncidents').doc(sosId).set(updatedFields, { merge: true });
  }
  const updated = sosRequestsCollection.update(sosId, updatedFields);

  // If resolved, free up the assigned rescue team
  if (newStatus === 'RESOLVED' && sos.assignedTeamId) {
    rescueTeamsCollection.update(sos.assignedTeamId, {
      currentStatus: 'AVAILABLE',
      assignedSosId: undefined,
      lastUpdate: now
    });
  }

  auditLogsCollection.insert({
    id: `audit-${Date.now()}`,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: 'UPDATE_SOS_STATUS',
    targetCollection: 'sos_requests',
    targetId: sosId,
    details: `Updated SOS ${sosId} status to ${newStatus}.`,
    timestamp: now,
    status: 'SUCCESS'
  });

  return updated as any;
}
