import fs from 'fs';
let content = fs.readFileSync('backend/services/alertService.ts', 'utf-8');

content = content.replace(
  "alertsCollection.insert(fullAlert as any);\n  if (adminDb) {\n    await adminDb.collection('emergencyAlerts').doc(alertId).set(fullAlert);\n  }",
  "if (adminDb) {\n    await adminDb.collection('emergencyAlerts').doc(alertId).set(fullAlert);\n  }\n  alertsCollection.insert(fullAlert as any);"
);

fs.writeFileSync('backend/services/alertService.ts', content);
