import fs from 'fs';
let content = fs.readFileSync('backend/services/sosService.ts', 'utf-8');

// createSosRequest
content = content.replace(
  "sosRequestsCollection.insert(newRecord as any);\n  if (adminDb) {\n    await adminDb.collection('sosIncidents').doc(sosId).set(newRecord);\n  }",
  "if (adminDb) {\n    await adminDb.collection('sosIncidents').doc(sosId).set(newRecord);\n  }\n  sosRequestsCollection.insert(newRecord as any);"
);

// assignTeamToSos
let oldAssign = `  const updatedSos = sosRequestsCollection.update(sosId, {
    status: 'TEAM_ASSIGNED',
    assignedTeamId: team.id,
    assignedTeamName: team.name,
    updatedAt: now,
    statusHistory: updatedHistory
  });
  if (adminDb) {
    await adminDb.collection('sosIncidents').doc(sosId).set(updatedSos, { merge: true });
  }`;
let newAssign = `  const updatedFields = {
    status: 'TEAM_ASSIGNED' as SosStatus,
    assignedTeamId: team.id,
    assignedTeamName: team.name,
    updatedAt: now,
    statusHistory: updatedHistory
  };
  if (adminDb) {
    await adminDb.collection('sosIncidents').doc(sosId).set(updatedFields, { merge: true });
  }
  const updatedSos = sosRequestsCollection.update(sosId, updatedFields);`;
content = content.replace(oldAssign, newAssign);

// updateSosStatus
let oldStatus = `  const updated = sosRequestsCollection.update(sosId, {
    status: newStatus,
    updatedAt: now,
    statusHistory: updatedHistory
  });
  if (adminDb) {
    await adminDb.collection('sosIncidents').doc(sosId).set(updated, { merge: true });
  }`;
let newStatus = `  const updatedFields = {
    status: newStatus,
    updatedAt: now,
    statusHistory: updatedHistory
  };
  if (adminDb) {
    await adminDb.collection('sosIncidents').doc(sosId).set(updatedFields, { merge: true });
  }
  const updated = sosRequestsCollection.update(sosId, updatedFields);`;
content = content.replace(oldStatus, newStatus);

fs.writeFileSync('backend/services/sosService.ts', content);
