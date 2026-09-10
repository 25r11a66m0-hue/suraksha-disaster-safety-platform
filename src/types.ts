/**
 * SURAKSHA: National Natural Disaster Safety, Alert, Evacuation & Emergency Response Platform
 * Core TypeScript Definitions
 */

export type Role = 'PUBLIC_USER' | 'AUTHORITY' | 'ADMIN';

export type DisasterType =
  | 'FLOOD'
  | 'CYCLONE'
  | 'EARTHQUAKE'
  | 'LANDSLIDE'
  | 'TSUNAMI'
  | 'HEATWAVE'
  | 'EXTREME_RAIN'
  | 'STORM'
  | 'FIRE'
  | 'OTHER';

export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DataFreshness = 'LIVE' | 'RECENT' | 'CACHED' | 'SIMULATION' | 'UNAVAILABLE';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  cityName?: string;
  areaName?: string;
  source: 'LIVE_GPS' | 'SEARCHED_MANUAL';
}

export interface UserProfile {
  id: string;
  uid?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  phone?: string; // backwards compatibility
  dob?: string;
  isPhoneVerified?: boolean;
  role: 'PUBLIC_USER';
  status?: 'active' | 'pending' | 'suspended';
  createdAt: string;
  updatedAt?: string;
  lastLocation?: LocationCoordinates;
}

export interface AuthorityProfile {
  id: string;
  authorityId: string; // e.g. "26101AP254"
  name: string;
  department: string;
  roleTitle: string;
  phone: string;
  email: string;
  jurisdiction: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REVOKED';
  role: 'AUTHORITY' | 'ADMIN';
  lastLogin: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  rainfallMm: number;
  rainfallIntensity: 'NONE' | 'LIGHT' | 'MODERATE' | 'HEAVY' | 'EXTREME';
  rainProbability: number;
  humidity: number;
  windSpeedKmH: number;
  windDirection: string;
  visibilityKm?: number;
  timestamp: string;
  freshness: DataFreshness;
  stationName: string;
}

export interface RiskAnalysis {
  riskScore: number; // 0 - 100
  riskLevel: SeverityLevel;
  primaryHazard: DisasterType;
  factors: {
    name: string;
    score: number;
    weight: number;
    description: string;
  }[];
  timestamp: string;
  freshness: DataFreshness;
  summaryText: string;
}

export interface EmergencyAlert {
  id: string;
  disasterType: DisasterType;
  title: string;
  message: string;
  severity: SeverityLevel;
  affectedArea: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  safetyInstructions: string[];
  recommendedAction: string;
  recommendedShelterId?: string;
  recommendedShelterName?: string;
  languages: ('en' | 'te' | 'hi')[];
  issuedAt: string;
  expiresAt: string;
  issuedByAuthorityId: string;
  authorityName: string;
  status: 'ACTIVE' | 'DRAFT' | 'EXPIRED' | 'CANCELLED';
  isSimulation?: boolean;
  smsStats?: {
    targetedUsers: number;
    sent: number;
    pending: number;
    failed: number;
  };
}

export type SosEmergencyType = 'RESCUE' | 'MEDICAL' | 'FOOD' | 'WATER' | 'OTHER';

export type SosStatus =
  | 'DRAFT'
  | 'CONFIRMATION_PENDING'
  | 'CONFIRMED'
  | 'SENDING'
  | 'SENT'
  | 'FAILED'
  | 'OFFLINE_QUEUED'
  | 'RECEIVED'
  | 'AUTHORITY_NOTIFIED'
  | 'TEAM_ASSIGNED'
  | 'DISPATCHED'
  | 'TEAM_REACHED'
  | 'RESOLVED';

export type SyncStatus = 'ONLINE' | 'SYNCING' | 'OFFLINE';

export interface OtpSendResponse {
  success: boolean;
  message: string;
  expiresInSeconds: number;
  resendCooldownSeconds: number;
}

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
}

export interface SosRequest {
  id: string; // e.g. "SOS-10427"
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
  status: SosStatus;
  createdAt: string;
  updatedAt: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  authorityNotes?: string;
  statusHistory: {
    status: SosStatus;
    timestamp: string;
    note?: string;
    updatedBy?: string;
  }[];
  isSimulation?: boolean;
}

export type ShelterStatus = 'OPEN' | 'LIMITED' | 'FULL' | 'CLOSED';

export interface Shelter {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  state: string;
  totalCapacity: number;
  occupiedCapacity: number;
  availableCapacity: number;
  status: ShelterStatus;
  riskLevel: SeverityLevel;
  facilities: {
    food: boolean;
    water: boolean;
    medical: boolean;
    sanitation: boolean;
    powerBackup: boolean;
    accessibilityRamp: boolean;
  };
  contactPhone: string;
  contactPerson: string;
  distanceKm?: number;
  lastUpdated: string;
}

export interface SaferRoute {
  id: string;
  destinationShelter: Shelter;
  recommendedRoute: {
    name: string;
    distanceKm: number;
    estimatedMinutes: number;
    riskScore: number;
    riskLevel: SeverityLevel;
    safePoints: string[];
    waypoints: [number, number][];
    safetyAdvise: string;
  };
  avoidRoute?: {
    name: string;
    distanceKm: number;
    estimatedMinutes: number;
    riskScore: number;
    riskLevel: SeverityLevel;
    hazardReasons: string[];
    waypoints: [number, number][];
  };
}

export type TeamStatus = 'AVAILABLE' | 'ASSIGNED' | 'EN_ROUTE' | 'ON_SCENE' | 'RESTING' | 'UNAVAILABLE';
export type RescueTeamStatus = TeamStatus;

export interface RescueTeam {
  id: string;
  teamCode: string; // e.g. "NDRF-10-A"
  name: string;
  unit: string;
  membersCount: number;
  personnelCount?: number;
  commander: string;
  leaderName?: string;
  phone: string;
  contactPhone?: string;
  vehicleType: string;
  equipment: string[];
  latitude: number;
  longitude: number;
  currentStatus: TeamStatus;
  assignedSosId?: string;
  lastUpdate: string;
}

export interface DisasterResource {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  quantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  allocated: number;
  unit: string;
  status: 'SURPLUS' | 'ADEQUATE' | 'AVAILABLE' | 'LOW' | 'CRITICAL';
  storageHub: string;
  location: string;
  lastUpdated: string;
}

export interface SatelliteData {
  satelliteName: string;
  sensorType: string;
  orbitType: string;
  groundStation: string;
  passTimestamp: string;
  observationSummary: string;
  floodInundationAreaSqKm: number;
  cycloneEyeDetected: boolean;
  cloudTopTemperatureC: number;
  soilMoistureSaturationPct: number;
}

export type SimulationScenario = 'NORMAL' | 'HEAVY_RAIN' | 'FLOOD' | 'CYCLONE' | 'CRITICAL_FLOOD' | 'LANDSLIDE';

export interface SatelliteObservation {
  id: string;
  satelliteName: 'EOS-05' | 'CARTOSAT-3' | 'INSAT-3DR';
  mission: string;
  organization: 'ISRO' | 'NRSC' | 'MOSDAC' | 'Bhuvan';
  launchDate: string;
  observationType: 'FLOOD_EXTENT' | 'WATER_SPREAD' | 'CYCLONE_CLOUD' | 'LANDSLIDE_RISK' | 'COASTAL_INUNDATION';
  acquisitionTime: string;
  processedTime: string;
  coverageArea: string;
  centerCoordinates: [number, number];
  confidenceScore: number; // 0 - 100
  dataStatus: DataFreshness;
  affectedAreaSqKm: number;
  summaryAnalysis: string;
  isSimulatedLayer?: boolean;
}

export interface HistoricalDisaster {
  id: string;
  name: string;
  disasterType: DisasterType;
  year: number;
  date: string;
  region: string;
  peakRainfallMm?: number;
  windSpeedMaxKmH?: number;
  floodLevelMeters?: number;
  affectedPopulationEstimate: number;
  evacuatedCount: number;
  sheltersActivated: number;
  responseDurationDays: number;
  keyLessons: string;
}

export interface AuditLog {
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
}

export interface SimulationState {
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
}
