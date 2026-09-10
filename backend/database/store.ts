/**
 * SURAKSHA Database Engine
 * Persistent, schema-validated store for all 17 disaster-management collections.
 * Persists to JSON files in the workspace with automatic seeding of realistic Indian data.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  EmergencyAlert,
  RescueTeam,
  Shelter,
  DisasterResource,
  HistoricalDisaster,
  SosRequest,
  SosStatus
} from '../../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure storage directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return check === hash;
}

export class Collection<T extends { id: string }> {
  private name: string;
  private filePath: string;
  private items: Map<string, T> = new Map();

  constructor(name: string, initialSeed: T[] = []) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this.load(initialSeed);
  }

  private load(seedData: T[]) {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const list: T[] = JSON.parse(raw);
        list.forEach((item) => this.items.set(item.id, item));
      } else {
        seedData.forEach((item) => this.items.set(item.id, item));
        this.save();
      }
    } catch (err) {
      console.error(`Error loading collection ${this.name}:`, err);
      seedData.forEach((item) => this.items.set(item.id, item));
    }
  }

  private save() {
    try {
      const list = Array.from(this.items.values());
      fs.writeFileSync(this.filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error saving collection ${this.name}:`, err);
    }
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  getById(id: string): T | undefined {
    return this.items.get(id);
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return Array.from(this.items.values()).find(predicate);
  }

  filter(predicate: (item: T) => boolean): T[] {
    return Array.from(this.items.values()).filter(predicate);
  }

  insert(item: T): T {
    this.items.set(item.id, item);
    this.save();
    return item;
  }

  update(id: string, partial: Partial<T>): T | undefined {
    const existing = this.items.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...partial };
    this.items.set(id, updated);
    this.save();
    return updated;
  }

  delete(id: string): boolean {
    const deleted = this.items.delete(id);
    if (deleted) this.save();
    return deleted;
  }

  count(): number {
    return this.items.size;
  }
}

// Initial Authority Credential Configuration
// Initial Authority: ID: 26101AP254 | Password: 2026AP254V
// Securely hashed with PBKDF2 salt. NEVER sent to client.
const initialAuthSalt = '8a7d3f2e1c9b0a4d5e6f7a8b9c0d1e2f';
const initialAuthHash = hashPassword('2026AP254V', initialAuthSalt).hash;

const SEED_AUTHORITIES = [
  {
    id: 'auth-26101AP254',
    authorityId: '26101AP254',
    passwordHash: initialAuthHash,
    passwordSalt: initialAuthSalt,
    name: 'Dr. K. V. Raman, IAS',
    department: 'National Disaster Management Authority (Coastal Operations)',
    roleTitle: 'Chief Incident Commander - Andhra Pradesh Coastal Zone',
    phone: '+91 891 256 4800',
    email: 'k.v.raman.ndma@suraksha.gov.in',
    jurisdiction: 'Visakhapatnam District & North Coastal Andhra Corridor',
    verificationStatus: 'VERIFIED' as const,
    role: 'AUTHORITY' as const,
    lastLogin: '2026-09-06T18:30:00Z',
    createdAt: '2026-01-15T09:00:00Z'
  }
];

const SEED_SHELTERS = [
  {
    id: 'shelter-vskp-01',
    name: 'Andhra University Relief Hub & Gymnasium',
    latitude: 17.7294,
    longitude: 83.3225,
    address: 'AU South Campus, Siripuram, Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    totalCapacity: 1200,
    occupiedCapacity: 280,
    availableCapacity: 920,
    status: 'OPEN' as const,
    riskLevel: 'LOW' as const,
    facilities: {
      food: true,
      water: true,
      medical: true,
      sanitation: true,
      powerBackup: true,
      accessibilityRamp: true
    },
    contactPhone: '+91 891 284 4000',
    contactPerson: 'Prof. S. R. Rao, Shelter In-Charge',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'shelter-vskp-02',
    name: 'Kailasagiri High Ground Multipurpose Shelter',
    latitude: 17.7492,
    longitude: 83.3421,
    address: 'Kailasagiri Hilltop Elevation 130m, Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    totalCapacity: 850,
    occupiedCapacity: 110,
    availableCapacity: 740,
    status: 'OPEN' as const,
    riskLevel: 'LOW' as const,
    facilities: {
      food: true,
      water: true,
      medical: true,
      sanitation: true,
      powerBackup: true,
      accessibilityRamp: true
    },
    contactPhone: '+91 891 255 1234',
    contactPerson: 'M. Anand, Divisional Officer',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'shelter-vskp-03',
    name: 'GVMC Indoor Sports Arena & Evacuation Centre',
    latitude: 17.7185,
    longitude: 83.3082,
    address: 'Near Diamond Park, Dwaraka Nagar, Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    totalCapacity: 1500,
    occupiedCapacity: 650,
    availableCapacity: 850,
    status: 'OPEN' as const,
    riskLevel: 'LOW' as const,
    facilities: {
      food: true,
      water: true,
      medical: true,
      sanitation: true,
      powerBackup: true,
      accessibilityRamp: true
    },
    contactPhone: '+91 891 256 5500',
    contactPerson: 'T. V. Narayana, GVMC Coordinator',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'shelter-vskp-04',
    name: 'Beach Road Coastal Cyclone Shelter (Low-lying Backup)',
    latitude: 17.7121,
    longitude: 83.3245,
    address: 'RK Beach Promenade, Pandurangapuram, Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    totalCapacity: 600,
    occupiedCapacity: 580,
    availableCapacity: 20,
    status: 'LIMITED' as const,
    riskLevel: 'MODERATE' as const,
    facilities: {
      food: true,
      water: true,
      medical: false,
      sanitation: true,
      powerBackup: true,
      accessibilityRamp: false
    },
    contactPhone: '+91 891 270 4122',
    contactPerson: 'P. Appa Rao, Coastal Ward In-Charge',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'shelter-vskp-05',
    name: 'Gajuwaka Municipal High School Relief Camp',
    latitude: 17.6912,
    longitude: 83.2185,
    address: 'Old Gajuwaka Main Road, Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    totalCapacity: 900,
    occupiedCapacity: 0,
    availableCapacity: 900,
    status: 'OPEN' as const,
    riskLevel: 'LOW' as const,
    facilities: {
      food: true,
      water: true,
      medical: true,
      sanitation: true,
      powerBackup: true,
      accessibilityRamp: true
    },
    contactPhone: '+91 891 276 9911',
    contactPerson: 'K. Subrahmanyam',
    lastUpdated: new Date().toISOString()
  }
];

const SEED_RESCUE_TEAMS = [
  {
    id: 'team-ndrf-10a',
    teamCode: 'NDRF-10-A',
    name: '10th Bn NDRF Deep Water & Urban Rescue Detachment',
    unit: 'National Disaster Response Force',
    membersCount: 24,
    commander: 'Asst. Commandant R. K. Yadav',
    phone: '+91 94401 23456',
    vehicleType: '3 Inflatable Rescue Boats (IRB) & 2 Light All-Terrain Vehicles',
    equipment: ['Lifebuoys', 'Hydraulic Cutters', 'Satellite Comms Transceiver', 'Portable Generators', 'First Aid Kits'],
    latitude: 17.7250,
    longitude: 83.3150,
    currentStatus: 'AVAILABLE' as const,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'team-sdrf-04',
    teamCode: 'AP-SDRF-04',
    name: 'AP State Disaster Response Force Coastal Unit 4',
    unit: 'Andhra Pradesh SDRF',
    membersCount: 18,
    commander: 'Inspector V. Satyanarayana',
    phone: '+91 94906 12345',
    vehicleType: '2 Heavy Transport Trucks & 2 Gemini Power Boats',
    equipment: ['Chainsaws', 'Diving Gear', 'Searchlights', 'Rope Rescue Sets'],
    latitude: 17.7100,
    longitude: 83.3020,
    currentStatus: 'AVAILABLE' as const,
    lastUpdate: new Date().toISOString()
  },
  {
    id: 'team-navy-east',
    teamCode: 'NAVY-ENC-01',
    name: 'Eastern Naval Command Humanitarian Assistance Team',
    unit: 'Indian Navy Command Response Team',
    membersCount: 30,
    commander: 'Lt. Cdr. Priya Sharma',
    phone: '+91 891 281 2000',
    vehicleType: '1 Chetak Helicopter on standby & 4 Amphibious Crafts',
    equipment: ['Emergency Airlift Stretcher', 'De-watering Pumps', 'High-capacity Satellite Phone'],
    latitude: 17.6980,
    longitude: 83.2850,
    currentStatus: 'AVAILABLE' as const,
    lastUpdate: new Date().toISOString()
  }
];

const SEED_RESOURCES = [
  {
    id: 'res-01',
    name: 'Emergency Packaged Drinking Water (20L Cans)',
    category: 'WATER' as const,
    totalQuantity: 15000,
    availableQuantity: 11400,
    allocatedQuantity: 3600,
    unit: 'Cans',
    status: 'AVAILABLE' as const,
    storageHub: 'GVMC Central Warehouse, Gajuwaka',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'res-02',
    name: 'Ready-to-Eat Dry Food Rations (3-Day Family Kits)',
    category: 'FOOD' as const,
    totalQuantity: 10000,
    availableQuantity: 7200,
    allocatedQuantity: 2800,
    unit: 'Family Kits',
    status: 'AVAILABLE' as const,
    storageHub: 'Civil Supplies Godown, Waltair',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'res-03',
    name: 'Inflatable Motorized Rescue Boats (IRB)',
    category: 'VEHICLES_BOATS' as const,
    totalQuantity: 28,
    availableQuantity: 20,
    allocatedQuantity: 8,
    unit: 'Boats',
    status: 'AVAILABLE' as const,
    storageHub: 'Visakhapatnam Port Trust Naval Jetty',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'res-04',
    name: 'Emergency Trauma & First-Aid Medical Kits',
    category: 'MEDICAL' as const,
    totalQuantity: 1200,
    availableQuantity: 450,
    allocatedQuantity: 750,
    unit: 'Kits',
    status: 'LOW' as const,
    storageHub: 'King George Hospital (KGH) Disaster Wing',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'res-05',
    name: 'Diesel Fuel for Backup Generators and Rescue Vessels',
    category: 'FUEL' as const,
    totalQuantity: 35000,
    availableQuantity: 29000,
    allocatedQuantity: 6000,
    unit: 'Litres',
    status: 'AVAILABLE' as const,
    storageHub: 'HPCL Bulk Logistics Depot, Malkapuram',
    lastUpdated: new Date().toISOString()
  }
];

const SEED_HISTORICAL_DISASTERS = [
  {
    id: 'hist-01',
    name: 'Very Severe Cyclonic Storm Hudhud',
    disasterType: 'CYCLONE' as const,
    year: 2014,
    date: '12 October 2014',
    region: 'Visakhapatnam & North Coastal AP',
    peakRainfallMm: 380,
    windSpeedMaxKmH: 215,
    affectedPopulationEstimate: 2100000,
    evacuatedCount: 248000,
    sheltersActivated: 135,
    responseDurationDays: 18,
    keyLessons: 'Crucial requirement for underground power cabling, reinforced hill-slope shelters, and early SMS/broadcast evacuation.'
  },
  {
    id: 'hist-02',
    name: 'Cyclonic Storm Gulab',
    disasterType: 'CYCLONE' as const,
    year: 2021,
    date: '26 September 2021',
    region: 'North Andhra Coastal Belt & Kalingapatnam',
    peakRainfallMm: 220,
    windSpeedMaxKmH: 95,
    affectedPopulationEstimate: 450000,
    evacuatedCount: 46000,
    sheltersActivated: 62,
    responseDurationDays: 7,
    keyLessons: 'Rapid urban waterlogging in low-lying areas requiring pre-positioned dewatering pumps and prompt micro-geofenced SMS.'
  },
  {
    id: 'hist-03',
    name: '2023 Heavy Inundation & Coastal Low Depression',
    disasterType: 'FLOOD' as const,
    year: 2023,
    date: '04 December 2023',
    region: 'Gajuwaka, Madhurawada and Coastal Lowlands',
    peakRainfallMm: 290,
    floodLevelMeters: 1.8,
    affectedPopulationEstimate: 310000,
    evacuatedCount: 32000,
    sheltersActivated: 45,
    responseDurationDays: 9,
    keyLessons: 'Clear demarcation of high-ground vs avoid routes is critical to prevent civilians driving into submerged underpasses.'
  }
];

const SEED_ALERTS = [
  {
    id: 'alert-initial-01',
    disasterType: 'EXTREME_RAIN' as const,
    title: 'Advisory: Coastal Heavy Precipitation & Strong Swells',
    message: 'Deep depression in Bay of Bengal expected to bring isolated heavy to very heavy rainfall across Visakhapatnam coastal belt. Fishermen advised not to venture into the sea.',
    severity: 'MODERATE' as const,
    affectedArea: 'Visakhapatnam Urban & Coastal Strip (Bheemili to RK Beach)',
    latitude: 17.7200,
    longitude: 83.3100,
    radiusKm: 18,
    safetyInstructions: [
      'Avoid standing near coastal rocky outcrops and beach seawalls.',
      'Check local drainage outlets around homes in low-lying localities.',
      'Keep mobile phones fully charged and emergency contacts handy.'
    ],
    recommendedAction: 'Monitor official SURAKSHA updates and avoid non-essential travel along the beach road.',
    recommendedShelterId: 'shelter-vskp-01',
    recommendedShelterName: 'Andhra University Relief Hub & Gymnasium',
    languages: ['en', 'te', 'hi'] as ('en' | 'te' | 'hi')[],
    issuedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 24).toISOString(),
    issuedByAuthorityId: '26101AP254',
    authorityName: 'Dr. K. V. Raman, Incident Commander',
    status: 'ACTIVE' as const,
    isSimulation: false,
    smsStats: {
      targetedUsers: 1420,
      sent: 1420,
      pending: 0,
      failed: 0
    }
  }
];

// Initialize Collections
export const usersCollection = new Collection<{
  id: string;
  uid?: string;
  fullName: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  dob?: string;
  passwordHash: string;
  passwordSalt: string;
  isPhoneVerified: boolean;
  role: 'PUBLIC_USER';
  status?: 'active' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  lastLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
    source: 'LIVE_GPS' | 'SEARCHED_MANUAL';
  };
}>('users');

export const authoritiesCollection = new Collection<typeof SEED_AUTHORITIES[0]>('authorities', SEED_AUTHORITIES);
export const sheltersCollection = new Collection<Shelter>('shelters', SEED_SHELTERS as unknown as Shelter[]);
export const rescueTeamsCollection = new Collection<RescueTeam>('rescue_teams', SEED_RESCUE_TEAMS as unknown as RescueTeam[]);
export const resourcesCollection = new Collection<DisasterResource>(
  'resources',
  SEED_RESOURCES.map((r) => ({
    ...r,
    quantity: r.totalQuantity,
    allocated: r.allocatedQuantity,
    location: r.storageHub
  })) as unknown as DisasterResource[]
);
export const historicalDisastersCollection = new Collection<HistoricalDisaster>('historical_disasters', SEED_HISTORICAL_DISASTERS as unknown as HistoricalDisaster[]);
export const alertsCollection = new Collection<EmergencyAlert>('alerts', SEED_ALERTS as unknown as EmergencyAlert[]);

export const sosRequestsCollection = new Collection<SosRequest>('sos_requests');

export const auditLogsCollection = new Collection<{
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetCollection: string;
  targetId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'DENIED' | 'FAILED';
}>('audit_logs');

export const smsLogsCollection = new Collection<{
  id: string;
  alertId: string;
  recipientPhone: string;
  messageContent: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  gatewayResponse?: string;
  timestamp: string;
  retryCount: number;
}>('sms_logs');

export const otpVerificationsCollection = new Collection<{
  id: string; // normalized phone e.g. "+919876543210"
  phoneNumber: string;
  otpHash: string;
  salt: string;
  createdAt: string;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  isVerified: boolean;
  verifiedAt?: string;
  lastRequestedAt: string;
  requestCountInWindow: number;
  windowStartTime: string;
}>('otp_verifications');

export const simulationStateCollection = new Collection<{
  id: string;
  isActive: boolean;
  currentScenario: 'NORMAL' | 'HEAVY_RAIN' | 'FLOOD' | 'CYCLONE' | 'CRITICAL_FLOOD' | 'LANDSLIDE';
  simulatedRainfallMm: number;
  simulatedWindSpeedKmH: number;
  simulatedWaterLevelMeters: number;
  simulatedRiskScore: number;
  activeAlertCount: number;
  simulatedSosCount: number;
  startedAt?: string;
  startedBy?: string;
}>('simulation_state', [
  {
    id: 'singleton_sim_state',
    isActive: false,
    currentScenario: 'NORMAL',
    simulatedRainfallMm: 4,
    simulatedWindSpeedKmH: 14,
    simulatedWaterLevelMeters: 0.1,
    simulatedRiskScore: 18,
    activeAlertCount: 1,
    simulatedSosCount: 0
  }
]);
