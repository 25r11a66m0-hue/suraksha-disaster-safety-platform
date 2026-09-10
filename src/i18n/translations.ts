/**
 * SURAKSHA Multi-Language Emergency Translation Dictionary
 * Supported: English (en), Telugu (te), Hindi (hi)
 */

export type LanguageCode = 'en' | 'te' | 'hi';

export interface EmergencyActionItem {
  title: string;
  before: string[];
  during: string[];
  after: string[];
}

export interface ChecklistItemTranslation {
  id: string;
  text: string;
}

export interface TranslationDictionary {
  // Brand & Slogans
  appName: string;
  subTitle: string;
  tagline: string;
  publicSafetyNotice: string;
  publicRole: string;
  authorityRole: string;

  // Global Navigation & Common
  home: string;
  homeNav: string;
  alerts: string;
  alertsNav: string;
  shelterNav: string;
  designatedShelters: string;
  route: string;
  routeNav: string;
  saferRouteBtn: string;
  sos: string;
  sosNav: string;
  sosButton: string;
  requestSosBtn: string;
  shelterBtn: string;
  safetyGuidesBtn: string;
  accuracy: string;
  lastUpdated: string;
  recommendedShelter: string;
  navigateGoogleMaps: string;
  offlineNotice: string;
  simulationDrillActive: string;
  aiAssistant: string;
  settings: string;
  signIn: string;
  signOut: string;
  authorityPortal: string;
  selectLanguage: string;
  back: string;
  backTo: string;
  cancel: string;
  confirm: string;
  save: string;
  close: string;
  loading: string;
  success: string;
  error: string;
  warning: string;
  search: string;
  details: string;
  inspect: string;
  viewAll: string;
  navigate: string;
  call: string;
  online: string;
  syncing: string;
  offline: string;

  // Entry Screen
  entryQuote: string;
  entryQuoteTagline: string;
  entryProtectionTag: string;
  publicPortalCardTitle: string;
  publicPortalCardDesc: string;
  authorityDeskCardTitle: string;
  authorityDeskCardDesc: string;
  citizenAccountLink: string;
  entryOfficialAdvisories: string;
  nationalEmergencyNumber: string;
  disasterHelplineNumber: string;

  // Citizen Authentication & Verification
  citizenAuthTitle: string;
  citizenAuthSubtitle: string;
  tabPhoneOtp: string;
  tabEmailSignIn: string;
  tabRegister: string;
  tabForgotPassword: string;
  phoneOtpNotice: string;
  mobileNumberLabel: string;
  mobileNumberPlaceholder: string;
  sendOtpBtn: string;
  sendingOtpBtn: string;
  resendInSeconds: string;
  otpCodeLabel: string;
  otpCodePlaceholder: string;
  verifyOtpBtn: string;
  verifyingBtn: string;
  resendOtpBtn: string;
  fullNameLabel: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  cityDistrictLabel: string;
  emergencyContactLabel: string;
  createAccountBtn: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  forgotPasswordLink: string;
  sendResetLinkBtn: string;
  otpSentSuccess: string;
  loginSuccessMsg: string;
  invalidPhoneErr: string;
  invalidOtpErr: string;
  passwordLengthErr: string;
  passwordMismatchErr: string;
  fillAllFieldsErr: string;
  confirmDiscardForm: string;

  // Home Page, Telemetry & Cards
  distressAssistanceTitle: string;
  distressAssistanceSub: string;
  distressAssistanceDesc: string;
  sectorVulnerability: string;
  riskScoreOutOf100: string;
  primaryThreat: string;
  deterministicFactors: string;
  inspectRiskDiagnostics: string;
  meteorologicalTelemetry: string;
  feelsLikeTemp: string;
  rainfallVolume: string;
  precipitationChance: string;
  windSpeed: string;
  heading: string;
  humidity: string;
  moistureSaturation: string;
  visibility: string;
  lineOfSight: string;
  telemetry: string;
  inspectRadar: string;
  monitoredSector: string;
  useLiveLocation: string;
  searchLocation: string;
  liveLocation: string;
  currentRisk: string;
  weatherSnapshot: string;
  searchLocationPlaceholder: string;
  liveMeteorologyBadge: string;
  viewActionPlan: string;

  // Alerts
  activeAlerts: string;
  activeAlertsTitle: string;
  noActiveAlerts: string;
  criticalSeverityBadge: string;
  highSeverityBadge: string;
  moderateSeverityBadge: string;
  lowSeverityBadge: string;
  affectedZoneLabel: string;
  directActionLabel: string;
  issuedByLabel: string;
  shareAlertBtn: string;
  copiedBadge: string;
  call112Btn: string;
  evacuateNow: string;

  // SOS Distress
  sosModalTitle: string;
  sosModalSubtitle: string;
  sosStep1: string;
  sosStep2: string;
  sosStep3: string;
  emergencyType: string;
  sosTypeRescue: string;
  sosTypeMedical: string;
  sosTypeCollapse: string;
  sosTypeEvacuation: string;
  sosTypeOther: string;
  peopleCountLabel: string;
  medicalAssistanceCheckbox: string;
  areaDescriptionLabel: string;
  areaDescriptionPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  liveCoordinates: string;
  gpsAccuracy: string;
  falseSosWarning: string;
  continueToVerification: string;
  confirmAndTransmit: string;
  transmittingSos: string;
  sosTransmittedSuccess: string;
  cancelSosBtn: string;
  activeIncidentTracker: string;
  stepReceived: string;
  stepReceivedDesc: string;
  stepNotified: string;
  stepNotifiedDesc: string;
  stepAssigned: string;
  stepAssignedDesc: string;
  stepDispatched: string;
  stepDispatchedDesc: string;
  stepOnScene: string;
  stepOnSceneDesc: string;
  stepResolved: string;
  stepResolvedDesc: string;

  // Shelters
  sheltersTitle: string;
  sheltersSubtitle: string;
  facilitiesInSector: string;
  occupancyLoad: string;
  available: string;
  cleanFoodRations: string;
  potableWater: string;
  medicalSupport: string;
  powerGenerator: string;
  rampAccess: string;
  saferRouteBtnSmall: string;
  mapsBtnSmall: string;
  detailsAndFacilities: string;

  // Safer Route
  saferRoutingTitle: string;
  elevationOverShortcut: string;
  saferRoutingSubtitle: string;
  changeTargetShelter: string;
  targetEvacuationDestination: string;
  recommendedSafeRoute: string;
  lowRisk: string;
  distance: string;
  estTransit: string;
  riskScore: string;
  safetyAdvantages: string;
  travelAdvisory: string;
  hazardPathDoNotUse: string;
  criticalDanger: string;

  // Safety Guide & Checklists
  safetyGuideTitle: string;
  safetyGuideSubtitle: string;
  beforeTab: string;
  duringTab: string;
  afterTab: string;
  checklistTitle: string;
  itemsCompleted: string;
  resetChecklist: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  languageSettingTitle: string;
  browserGeoPermissions: string;
  locationEnabled: string;
  permissionDenied: string;
  offlineDataResilience: string;
  clearOfflineCacheBtn: string;

  // Disaster Types
  disasterFlood: string;
  disasterCyclone: string;
  disasterEarthquake: string;
  disasterFire: string;
  disasterLandslide: string;
  disasterGeneral: string;

  // Phased Protocol Titles & Checklists
  phasedSurvivalTitle: string;
  beforePrepPhase: string;
  duringSurvivalPhase: string;
  afterRecoveryPhase: string;
  officialNoticeTitle: string;
  officialNoticeText: string;
  activeAlertInSectorText: string;
  protocolsActiveText: string;
  noActiveAlertInSectorText: string;
  standardReadinessText: string;
  openComprehensivePortalText: string;
  interactiveChecklistDesc: string;
  ofCompletedText: string;
  resetBtnText: string;
  askAiBtn: string;
  startMultiTurnChatBtn: string;
  sectorDisasterMapTitle: string;
  sectorDisasterMapDesc: string;

  // Shelter finder & details
  filterAllShelters: string;
  filterOpenShelters: string;
  filterWaterShelters: string;
  filterFoodShelters: string;
  filterMedicalShelters: string;
  searchSheltersPlaceholder: string;
  spotsAvailableText: string;
  liveAvailableBadge: string;
  navigateSaferRouteBtn: string;
  viewShelterDetailsBtn: string;
  shelterStatusOpen: string;
  shelterStatusLimited: string;
  shelterStatusFull: string;
  shelterStatusClosed: string;

  // Safer Route details
  saferEvacuationCorridorTitle: string;
  highGroundRouteBadge: string;
  hazardAvoidanceNotice: string;
  elevationOverDistanceText: string;
  stepByStepDirectionsTitle: string;
  openInGoogleMapsBtn: string;
  changeTargetDestinationBtn: string;

  // Map Controls & Legend
  mapLayersTitle: string;
  layerRiskZonesLabel: string;
  layerSheltersLabel: string;
  layerEvacRouteLabel: string;
  layerRadarLabel: string;
  legendHighRiskFlood: string;
  legendDesignatedShelter: string;

  // Emergency Contacts & Kit
  emergencyContactsTitle: string;
  evacuationKitTitle: string;
  dialDirectly: string;

  // Risk Levels
  riskLevels: {
    LOW: string;
    MODERATE: string;
    HIGH: string;
    CRITICAL: string;
  };

  // Emergency Action Instructions
  emergencyInstructions: Record<string, EmergencyActionItem>;

  yes: string;
  no: string;
  full: string;
  vacant: string;
  packed: string;
  category: string;
  intensity: string;
  score: string;
  weight: string;
  direction: string;
  district: string;
  published: string;
  validUntil: string;
  loggedAt: string;
  incidentId: string;
  downlink: string;
  drillMode: string;
  simulationDrill: string;
  webBroadcastActive: string;
  smsGatewayNotConfigured: string;
  statusReflectsTelemetry: string;
  statusSteps: string;
  verifiedProgression: string;
  copiedText: string;
  dashboard: string;
  welcomeBack: string;
  changeNumber: string;
  enter6DigitOtp: string;
  indianMobileNumber: string;
  checkEmailInbox: string;
  returnToSignIn: string;
  register: string;
  createAccount: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  passwordRecovery: string;
  mobileOtp: string;
  sendOtp: string;
  dispatchingOtp: string;
  verifyOtpContinue: string;
  verifyingOtp: string;
  resendOtp: string;
  citizenVerification: string;
  backToPortal: string;
  backToEdit: string;
  refreshStatus: string;
  retryConnection: string;
  shareAlert: string;
  call112: string;
  call112Helpline: string;
  ambulance108: string;
  nationalEmergency112: string;
  sdmaControlRoom: string;
  ndmaControlRoom: string;
  districtCollectorate: string;
  coastGuardSAR: string;
  coastalDistress: string;
  emergencyHelplines: string;
  callShelter: string;
  callCommander: string;
  inspectSaferRoute: string;
  navigateSaferRoute: string;
  locateSafeShelters: string;
  viewShelterDetails: string;
  askAiAssistant: string;
  consultAiAssistant: string;
  haveCustomQuestions: string;
  highSeverity: string;
  moderateAdvisory: string;
  lowWatch: string;
  highRisk: string;
  moderateRisk: string;
  criticalRisk: string;
  immediateDirective: string;
  officialDirective: string;
  affectedAreaLabel: string;
  affectedCorridor: string;
  issuingAuthority: string;
  issuedBy: string;
  whatToDoNow: string;
  residentsAdvised: string;
  disseminationChannelsStatus: string;
  hazardVulnerabilityIndex: string;
  sectorVulnerabilityIndex: string;
  compositeHazardScore: string;
  riskIndex: string;
  primaryHazard: string;
  deterministicRiskFactors: string;
  hazardIndexWeights: string;
  locationSafetyLevel: string;
  elevatedActionRecommended: string;
  computingRiskAnalysis: string;
  multiHazardDiagnostic: string;
  designatedSafeReliefShelter: string;
  recommendedReliefShelter: string;
  spotsAvailable: string;
  currentOccupancy: string;
  availableCapacity: string;
  capacityBeds: string;
  shelterInCharge: string;
  shelterIdLabel: string;
  verifiedFacilities: string;
  facilityAvailable: string;
  facilityNotPresent: string;
  foodRations: string;
  cleanWater: string;
  medicalAid: string;
  sanitationRestrooms: string;
  approxAway: string;
  distanceFromGps: string;
  computeHighGroundRoute: string;
  aggregatingElevation: string;
  ambientSurfaceTemperature: string;
  feelsLike: string;
  accumulatedRainfall: string;
  rainProbability: string;
  windVectorsGusts: string;
  surfaceVisibility: string;
  barometricTrend: string;
  meteorologicalAttribution: string;
  meteorologicalAttributionDesc: string;
  observingGroundStation: string;
  auditTelemetry: string;
  weatherUnavailable: string;
  weatherUnavailableDesc: string;
  freshnessLive: string;
  freshnessRecent: string;
  freshnessCached: string;
  freshnessSimulation: string;
  lastFieldUpdate: string;
  trappedOrInjured: string;
  requestOfficialAssistance: string;
  triggerSos: string;
  activeIncident: string;
  sosIncidentStatus: string;
  personsTrapped: string;
  medicalAttention: string;
  medicalTrauma: string;
  locationLandmark: string;
  citizenNote: string;
  assignedUnit: string;
  awaitingAllocation: string;
  eocTriagingDesc: string;
  eocDispatchNotes: string;
  offlineSosWaiting: string;
  deocDispatch: string;
  officialAuditLog: string;
  sosTitle: string;
  sosSubtitle: string;
  proceedToConfirm: string;
  confirmDistressSignal: string;
  transmitSosNow: string;
  rescue: string;
  medical: string;
  food: string;
  water: string;
  other: string;
  numberOfPeople: string;
  urgentMedicalAid: string;
  buildingLandmark: string;
  additionalMessage: string;
  emergencyNature: string;
  requiredUrgently: string;
  notRequested: string;
  reportedBy: string;
  locationLabel: string;
  verifiedIncidentCoordinates: string;
  citizenSurvivalDirectory: string;
  citizenSurvivalSubtitle: string;
  officialNdmaGuidelines: string;
  safetyActionChecklist: string;
  emergencyGoBagTitle: string;
  keepPrepackedBag: string;
  evacuationKitItems: string;
  criticalDirectivesPhase: string;
  disasterPreparednessStandards: string;
  duringUrbanFlooding: string;
  duringSevereCyclones: string;

  // Disaster Preparedness Checklists
  checklists: Record<string, { title: string; items: ChecklistItemTranslation[] }>;
  askSurakshaAi: string;
  surakshaAiAssistant: string;
  gemini3: string;
  aiSubtitle: string;
  roleLabel: string;
  modelSpeed: string;
  fastResponse: string;
  generalSafety: string;
  complexAnalysis: string;
  aiSafetyGuidance: string;
  emergencyOfflineProtocol: string;
  copyBtn: string;
  copiedBtn: string;
  consultingGemini: string;
  suggestionsLabel: string;
  askRolePlaceholder: string;
  pressEnterToSend: string;
  inLifeThreateningDanger: string;
  call112Immediately: string;
  you: string;
  gisSectorVectorView: string;
  hazardZone: string;
  shelters: string;
  legendSafeRoute: string;
  openInGoogleMaps: string;
  acquiringGps: string;
  useMyLiveLocation: string;
  enterLocationManually: string;
  searchIndianLocation: string;
  selectIndianDisasterRiskZone: string;
}
export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    yes: "Yes",
    no: "No",
    full: "Full",
    vacant: "Vacant",
    packed: "Packed",
    category: "Category",
    intensity: "Intensity",
    score: "Score",
    weight: "Weight",
    direction: "Direction",
    district: "District",
    published: "Published",
    validUntil: "Valid Until",
    loggedAt: "Logged At",
    incidentId: "Incident ID",
    downlink: "Downlink",
    drillMode: "DRILL MODE",
    simulationDrill: "Simulation Drill Active",
    webBroadcastActive: "Web Broadcast Active",
    smsGatewayNotConfigured: "SMS gateway simulation active",
    statusReflectsTelemetry: "Status reflects live telemetry",
    statusSteps: "Status Progression",
    verifiedProgression: "Verified Progression",
    copiedText: "Copied to clipboard",
    dashboard: "Dashboard",
    welcomeBack: "Welcome back",
    changeNumber: "Change Phone Number",
    enter6DigitOtp: "Enter 6-digit verification code",
    indianMobileNumber: "10-digit Indian Mobile Number",
    checkEmailInbox: "Check your email inbox for password reset instructions.",
    returnToSignIn: "Return to Sign In",
    register: "Register",
    createAccount: "Create Account",
    fullName: "Full Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    passwordRecovery: "Password Recovery",
    mobileOtp: "Mobile OTP",
    sendOtp: "Send OTP",
    dispatchingOtp: "Sending OTP...",
    verifyOtpContinue: "Verify & Continue",
    verifyingOtp: "Verifying OTP...",
    resendOtp: "Resend OTP",
    citizenVerification: "Citizen Verification",
    backToPortal: "Back to Portal",
    backToEdit: "Back to Edit",
    refreshStatus: "Refresh Status",
    retryConnection: "Retry Connection",
    shareAlert: "Share Alert",
    call112: "Call 112",
    call112Helpline: "Call 112 National Emergency",
    ambulance108: "Ambulance: 108",
    nationalEmergency112: "National Emergency: 112",
    sdmaControlRoom: "SDMA State Control Room: 1070",
    ndmaControlRoom: "NDMA National Control: 011-26701728",
    districtCollectorate: "District Collectorate Control Room: 1077",
    coastGuardSAR: "Coast Guard Maritime Search & Rescue: 1554",
    coastalDistress: "Coastal Fishermen Distress: 1093",
    emergencyHelplines: "Official Emergency Helplines",
    callShelter: "Call Shelter Desk",
    callCommander: "Call Incident Commander",
    inspectSaferRoute: "Inspect Safer Route",
    navigateSaferRoute: "Navigate Safer Route",
    locateSafeShelters: "Locate Nearest Safe Shelters",
    viewShelterDetails: "View Shelter Details",
    askAiAssistant: "Ask SURAKSHA AI Assistant",
    consultAiAssistant: "Consult AI Safety Assistant",
    haveCustomQuestions: "Have specific questions about this situation?",
    highSeverity: "HIGH SEVERITY",
    moderateAdvisory: "MODERATE ADVISORY",
    lowWatch: "LOW RISK WATCH",
    highRisk: "High Risk",
    moderateRisk: "Moderate Risk",
    criticalRisk: "Critical Risk",
    immediateDirective: "Immediate Directive",
    officialDirective: "Official Directive",
    affectedAreaLabel: "Affected Area",
    affectedCorridor: "Affected Corridor",
    issuingAuthority: "Issuing Authority",
    issuedBy: "Issued By",
    whatToDoNow: "What To Do Now",
    residentsAdvised: "Residents in this sector are strongly advised to take immediate precautions.",
    disseminationChannelsStatus: "Dissemination Channels Status",
    hazardVulnerabilityIndex: "Hazard & Vulnerability Diagnostics",
    sectorVulnerabilityIndex: "Sector Vulnerability Index",
    compositeHazardScore: "Composite Multi-Hazard Score",
    riskIndex: "Risk Index",
    primaryHazard: "Primary Hazard",
    deterministicRiskFactors: "Deterministic Risk Factors",
    hazardIndexWeights: "Hazard Index Weight Distribution",
    locationSafetyLevel: "Location Safety Level",
    elevatedActionRecommended: "Elevated action recommended based on real-time telemetry.",
    computingRiskAnalysis: "Computing multi-factor risk analysis...",
    multiHazardDiagnostic: "Multi-Hazard Diagnostic",
    designatedSafeReliefShelter: "Designated Safe Relief Shelter",
    recommendedReliefShelter: "Recommended Relief Shelter",
    spotsAvailable: "spots available",
    currentOccupancy: "Current Occupancy",
    availableCapacity: "Available Capacity",
    capacityBeds: "Capacity (Beds)",
    shelterInCharge: "Shelter In-Charge",
    shelterIdLabel: "Shelter ID",
    verifiedFacilities: "Verified Shelter Amenities & Facilities",
    facilityAvailable: "Available on Premises",
    facilityNotPresent: "Not Available",
    foodRations: "Food Rations",
    cleanWater: "Clean Drinking Water",
    medicalAid: "Medical Aid & First Aid",
    sanitationRestrooms: "Sanitation & Restrooms",
    approxAway: "away",
    distanceFromGps: "Distance from your location",
    computeHighGroundRoute: "Computing high-ground safe corridor...",
    aggregatingElevation: "Aggregating digital elevation model (DEM) and flood hazard zones...",
    ambientSurfaceTemperature: "Ambient Surface Temperature",
    feelsLike: "Feels Like",
    accumulatedRainfall: "Accumulated Rainfall (24h)",
    rainProbability: "Precipitation Probability",
    windVectorsGusts: "Wind Vectors & Peak Gusts",
    surfaceVisibility: "Surface Visibility",
    barometricTrend: "Barometric Pressure & Trend",
    meteorologicalAttribution: "Meteorological Station & Radar Telemetry",
    meteorologicalAttributionDesc: "Doppler radar imagery, rainfall gauge grids, and ocean buoy sensors.",
    observingGroundStation: "Observing Station",
    auditTelemetry: "Audit Telemetry",
    weatherUnavailable: "Weather Telemetry Unavailable",
    weatherUnavailableDesc: "Could not retrieve live sensor readings for this sector.",
    freshnessLive: "LIVE SENSOR",
    freshnessRecent: "RECENT TELEMETRY",
    freshnessCached: "CACHED TELEMETRY",
    freshnessSimulation: "SIMULATION SENSOR",
    lastFieldUpdate: "Last field update",
    trappedOrInjured: "Trapped or Injured in Immediate Danger?",
    requestOfficialAssistance: "Request official NDRF/SDRF emergency assistance with live GPS broadcast.",
    triggerSos: "TRIGGER SOS DISTRESS",
    activeIncident: "Active Emergency Incident",
    sosIncidentStatus: "SOS Distress Incident Status",
    personsTrapped: "Persons Trapped / In Danger",
    medicalAttention: "Medical Attention Required",
    medicalTrauma: "Critical Trauma / Urgent Medical",
    locationLandmark: "Reported Landmark / Location",
    citizenNote: "Citizen Note for Responders",
    assignedUnit: "Assigned Response Unit",
    awaitingAllocation: "Awaiting unit allocation from District EOC...",
    eocTriagingDesc: "District Emergency Operations Center is triaging distress telemetry.",
    eocDispatchNotes: "Incident Command Field Notes",
    offlineSosWaiting: "Distress beacon saved locally on device. Will automatically transmit once internet connectivity is restored.",
    deocDispatch: "District DEOC Dispatch Desk: 1077",
    officialAuditLog: "Official Incident Audit Timeline",
    sosTitle: "Emergency SOS Distress Beacon",
    sosSubtitle: "Broadcast immediate GPS distress to Indian Emergency Command & NDRF",
    proceedToConfirm: "Proceed to Coordinate Verification →",
    confirmDistressSignal: "Confirm Distress Signal →",
    transmitSosNow: "TRANSMIT SOS NOW",
    rescue: "Rescue",
    medical: "Medical",
    food: "Food",
    water: "Water",
    other: "Other",
    numberOfPeople: "Number of People Needing Help",
    urgentMedicalAid: "Urgent Medical Assistance Required",
    buildingLandmark: "Specific Landmark / Floor / Location",
    additionalMessage: "Additional Notes for Rescue Team",
    emergencyNature: "Emergency Nature",
    requiredUrgently: "Required Urgently",
    notRequested: "Not Requested",
    reportedBy: "Reported By",
    locationLabel: "Location",
    verifiedIncidentCoordinates: "Verified Incident Coordinates",
    citizenSurvivalDirectory: "Citizen Survival & Evacuation Directory",
    citizenSurvivalSubtitle: "Comprehensive disaster survival playbooks, grab-and-go kit checklists, and verified helplines.",
    officialNdmaGuidelines: "Official NDMA Guidelines",
    safetyActionChecklist: "Preparedness Action Checklist",
    emergencyGoBagTitle: "72-Hour Emergency Evacuation Kit (Go-Bag)",
    keepPrepackedBag: "Keep a pre-packed waterproof bag ready by your main exit containing these essentials:",
    evacuationKitItems: "Kit Essentials Check",
    criticalDirectivesPhase: "Critical Directives by Phase",
    disasterPreparednessStandards: "Standard Civil Protection Protocols",
    duringUrbanFlooding: "During Urban Flooding",
    duringSevereCyclones: "During Severe Cyclones",
    askSurakshaAi: "Ask SURAKSHA AI",
    surakshaAiAssistant: "SURAKSHA AI Assistant",
    gemini3: "Gemini 3",
    aiSubtitle: "Multi-turn emergency & disaster civil safety intelligence",
    roleLabel: "Role:",
    modelSpeed: "Model Speed:",
    fastResponse: "Fast Response",
    generalSafety: "General Safety",
    complexAnalysis: "Complex Analysis",
    aiSafetyGuidance: "AI Safety Guidance",
    emergencyOfflineProtocol: "Emergency offline protocol",
    copyBtn: "Copy",
    copiedBtn: "Copied",
    consultingGemini: "Consulting Gemini Disaster Safety Engine...",
    suggestionsLabel: "Suggestions:",
    askRolePlaceholder: "Ask",
    pressEnterToSend: "Press Enter to send",
    inLifeThreateningDanger: "In life-threatening danger,",
    call112Immediately: "call 112 / 108 immediately.",
    you: "You",
    gisSectorVectorView: "GIS Sector Vector View",
    hazardZone: "Hazard Zone",
    shelters: "Shelters",
    legendSafeRoute: "Safe Route",
    openInGoogleMaps: "Open in Google Maps",
    acquiringGps: "Acquiring GPS...",
    useMyLiveLocation: "USE MY LIVE LOCATION",
    enterLocationManually: "Enter Location Manually",
    searchIndianLocation: "Search Indian location (e.g. Visakhapatnam)...",
    selectIndianDisasterRiskZone: "Select Indian Disaster Risk Zone / City:",
    appName: 'SURAKSHA',
    subTitle: 'National Disaster Response Platform',
    tagline: 'Know the Risk. Find the Safe Way.',
    publicSafetyNotice: 'Emergency information provided for safety and preparedness across India.',
    publicRole: 'Citizen / Public',
    authorityRole: 'Disaster Authority',

    home: 'Home',
    homeNav: 'Home',
    alerts: 'Alerts',
    alertsNav: 'Alerts',
    shelterNav: 'Shelter',
    designatedShelters: 'Designated Shelters',
    route: 'Safer Route',
    routeNav: 'Route',
    saferRouteBtn: 'Find Safer Route',
    sos: 'Emergency SOS',
    sosNav: 'SOS',
    sosButton: 'REQUEST EMERGENCY SOS',
    requestSosBtn: 'REQUEST EMERGENCY SOS',
    shelterBtn: 'Find Emergency Shelter',
    safetyGuidesBtn: 'Disaster Safety Guidelines',
    accuracy: 'Accuracy',
    lastUpdated: 'Updated',
    recommendedShelter: 'Recommended Shelter',
    navigateGoogleMaps: 'Navigate via Google Maps',
    offlineNotice: 'Weak/No connection. Using cached emergency data.',
    simulationDrillActive: 'SIMULATION DRILL ACTIVE: DATA AND DRILLS ARE FOR EXERCISE PURPOSES',
    aiAssistant: 'AI Assistant',
    settings: 'Settings',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    authorityPortal: 'Authority Portal',
    selectLanguage: 'Select Language',
    back: 'Back',
    backTo: 'Back to',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    close: 'Close',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    search: 'Search',
    details: 'Details',
    inspect: 'Inspect Details',
    viewAll: 'View All',
    navigate: 'Navigate',
    call: 'Call',
    online: 'ONLINE',
    syncing: 'SYNCING',
    offline: 'OFFLINE',

    entryQuote: '“Nature does not hurry, yet everything is accomplished.”',
    entryQuoteTagline: 'Know the Risk. Find the Safe Way.',
    entryProtectionTag: 'Protection • Safety • Assistance',
    publicPortalCardTitle: 'PUBLIC PORTAL',
    publicPortalCardDesc: 'For Citizens • Hyperlocal Risk, Shelters, Safe Routes & SOS',
    authorityDeskCardTitle: 'AUTHORITY DESK',
    authorityDeskCardDesc: 'For Verified Disaster Response Authorities & Emergency Center',
    citizenAccountLink: 'Citizen Account: Sign In or Register →',
    entryOfficialAdvisories: 'Official early warning, civil protection advisories, and disaster evacuation logistics.',
    nationalEmergencyNumber: 'National Emergency: 112',
    disasterHelplineNumber: 'Disaster Helpline: 1070',

    citizenAuthTitle: 'Citizen Verification & Access',
    citizenAuthSubtitle: 'Secure Disaster Safety & Emergency Beacon Access',
    tabPhoneOtp: 'Phone OTP',
    tabEmailSignIn: 'Sign In',
    tabRegister: 'Register',
    tabForgotPassword: 'Password Recovery',
    phoneOtpNotice: 'Direct SMS verification powered by official emergency gateway',
    mobileNumberLabel: 'Mobile Number (with +91)',
    mobileNumberPlaceholder: '+91 98765 43210',
    sendOtpBtn: 'Send OTP via SMS',
    sendingOtpBtn: 'Sending OTP...',
    resendInSeconds: 'Resend in',
    otpCodeLabel: '6-Digit Verification Code',
    otpCodePlaceholder: 'Enter 6-digit OTP',
    verifyOtpBtn: 'Verify & Continue',
    verifyingBtn: 'Verifying...',
    resendOtpBtn: 'Resend OTP',
    fullNameLabel: 'Full Name',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    cityDistrictLabel: 'Residential City / District',
    emergencyContactLabel: 'Emergency Contact Phone',
    createAccountBtn: 'Create Citizen Account',
    alreadyHaveAccount: 'Already registered?',
    dontHaveAccount: 'Need an account?',
    forgotPasswordLink: 'Forgot password?',
    sendResetLinkBtn: 'Send Password Reset Link',
    otpSentSuccess: 'Verification code sent successfully to your mobile.',
    loginSuccessMsg: 'Successfully verified. Welcome to SURAKSHA.',
    invalidPhoneErr: 'Please enter a valid 10-digit Indian mobile number.',
    invalidOtpErr: 'Please enter a valid 6-digit verification code.',
    passwordLengthErr: 'Password must be at least 6 characters.',
    passwordMismatchErr: 'Passwords do not match.',
    fillAllFieldsErr: 'Please fill in all required fields.',
    confirmDiscardForm: 'You have unsaved details. Are you sure you want to go back?',

    distressAssistanceTitle: 'Emergency SOS & Distress Assistance',
    distressAssistanceSub: 'Direct Priority Link to Disaster Response Command',
    distressAssistanceDesc: 'Trapped by rising flood water, facing immediate medical emergency, or need structural rescue? Trigger an instant GPS distress beacon with your live coordinates.',
    sectorVulnerability: 'Sector Vulnerability Index',
    riskScoreOutOf100: '/ 100 Risk Score',
    primaryThreat: 'Primary Threat',
    deterministicFactors: 'Deterministic Risk Factors',
    inspectRiskDiagnostics: 'Inspect Detailed Risk Diagnostics & Contours →',
    meteorologicalTelemetry: 'Meteorological Telemetry',
    feelsLikeTemp: 'Feels like',
    rainfallVolume: 'Rainfall Volume',
    precipitationChance: 'Precipitation Chance',
    windSpeed: 'Wind Speed',
    heading: 'Heading',
    humidity: 'Humidity',
    moistureSaturation: 'Moisture saturation',
    visibility: 'Visibility',
    lineOfSight: 'Line of sight',
    telemetry: 'Telemetry',
    inspectRadar: 'Inspect Radar & Telemetry →',
    monitoredSector: 'Monitored Sector',
    useLiveLocation: 'USE MY LIVE LOCATION',
    searchLocation: 'Search Location Manually',
    liveLocation: 'Use My Live Location',
    currentRisk: 'Current Risk Level',
    weatherSnapshot: 'Live Weather',
    searchLocationPlaceholder: 'Search city, district, or PIN code...',
    liveMeteorologyBadge: 'LIVE METEOROLOGY',
    viewActionPlan: 'VIEW ACTION PLAN & SHELTER',

    activeAlerts: 'Active Emergency Alerts',
    activeAlertsTitle: 'Active Emergency Alerts & Official Advisories',
    noActiveAlerts: 'No critical emergency alerts in your immediate radius.',
    criticalSeverityBadge: 'CRITICAL SEVERITY',
    highSeverityBadge: 'HIGH SEVERITY',
    moderateSeverityBadge: 'MODERATE SEVERITY',
    lowSeverityBadge: 'LOW SEVERITY',
    affectedZoneLabel: 'Affected Zone:',
    directActionLabel: 'Direct Action:',
    issuedByLabel: 'Issued by',
    shareAlertBtn: 'Share Alert',
    copiedBadge: 'Copied',
    call112Btn: 'Call 112',
    evacuateNow: 'Evacuate to Safe Ground',

    sosModalTitle: 'Emergency SOS Distress Beacon',
    sosModalSubtitle: 'Broadcast immediate GPS distress to Indian Emergency Command & NDRF',
    sosStep1: 'Emergency Details',
    sosStep2: 'Verify Live GPS',
    sosStep3: 'Transmit Distress',
    emergencyType: 'Nature of Emergency',
    sosTypeRescue: 'Flooding / Inundation (Water Rescue)',
    sosTypeMedical: 'Immediate Medical Emergency',
    sosTypeCollapse: 'Structural Collapse / Trapped under Debris',
    sosTypeEvacuation: 'Elderly / Disabled Evacuation Assistance',
    sosTypeOther: 'Other Life-Threatening Hazard',
    peopleCountLabel: 'Number of People Needing Help',
    medicalAssistanceCheckbox: 'Critical Medical Aid Needed (Injuries, Oxygen, Urgent Treatment)',
    areaDescriptionLabel: 'Exact Location Landmark / Floor',
    areaDescriptionPlaceholder: 'e.g. 2nd floor balcony near water overhead tank, blue gate house',
    messageLabel: 'Message / Special Notes for Rescue Team',
    messagePlaceholder: 'Water depth, medical status, elderly or children present...',
    liveCoordinates: 'Live GPS Coordinates',
    gpsAccuracy: 'Accuracy: ±{acc}m',
    falseSosWarning: 'Strict Warning: False distress calls impede genuine rescue operations and are strictly punishable by law.',
    continueToVerification: 'Continue to Coordinate Verification →',
    confirmAndTransmit: 'Confirm & Broadcast Distress Beacon',
    transmittingSos: 'Broadcasting Distress Beacon to Command...',
    sosTransmittedSuccess: 'Emergency distress beacon broadcast successfully. Responders alerted.',
    cancelSosBtn: 'Cancel Distress Call',
    activeIncidentTracker: 'ACTIVE EMERGENCY INCIDENT',
    stepReceived: 'RECEIVED',
    stepReceivedDesc: 'SOS packet logged at Incident Gateway',
    stepNotified: 'EOC NOTIFIED',
    stepNotifiedDesc: 'Disaster Commander triaged incident',
    stepAssigned: 'TEAM ASSIGNED',
    stepAssignedDesc: 'Rescue unit designated to coordinate',
    stepDispatched: 'DISPATCHED',
    stepDispatchedDesc: 'Responders en route to GPS coordinates',
    stepOnScene: 'ON SCENE',
    stepOnSceneDesc: 'Responders reached incident perimeter',
    stepResolved: 'RESOLVED',
    stepResolvedDesc: 'Citizens secured & medical triage complete',

    sheltersTitle: 'Designated Emergency Shelters',
    sheltersSubtitle: 'Relief centres, cyclone shelters, and high-ground relief camps sorted by proximity.',
    facilitiesInSector: 'Facilities in Sector',
    occupancyLoad: 'Occupancy Load',
    available: 'available',
    cleanFoodRations: 'Clean Food Rations',
    potableWater: 'Potable Water',
    medicalSupport: 'Medical Support',
    powerGenerator: 'Power Generator',
    rampAccess: 'Ramp Access',
    saferRouteBtnSmall: 'SAFER ROUTE',
    mapsBtnSmall: 'MAPS',
    detailsAndFacilities: 'Details & Facilities',

    saferRoutingTitle: 'Safer Evacuation Routing',
    elevationOverShortcut: 'ELEVATION > SHORTCUT',
    saferRoutingSubtitle: 'Routing prioritizes high ground and storm surge avoidance over shortest transit distance.',
    changeTargetShelter: 'Change Target Shelter',
    targetEvacuationDestination: 'Target Evacuation Destination',
    recommendedSafeRoute: 'RECOMMENDED SAFE ROUTE',
    lowRisk: 'LOW RISK',
    distance: 'Distance:',
    estTransit: 'Est. Transit:',
    riskScore: 'Risk Score:',
    safetyAdvantages: 'Safety Advantages:',
    travelAdvisory: 'Travel Advisory:',
    hazardPathDoNotUse: 'HAZARD PATH • DO NOT USE',
    criticalDanger: 'CRITICAL DANGER',

    safetyGuideTitle: 'Official Disaster Safety Guidelines & Checklists',
    safetyGuideSubtitle: 'Standard operating civil protection procedures approved by NDMA.',
    beforeTab: 'BEFORE (PREPARATION)',
    duringTab: 'DURING (ACTION)',
    afterTab: 'AFTER (RECOVERY)',
    checklistTitle: 'Interactive Preparedness Checklist',
    itemsCompleted: 'items completed',
    resetChecklist: 'Reset Checklist',

    settingsTitle: 'System Preferences & Settings',
    settingsSubtitle: 'Manage your localized language, browser location permissions, offline data resilience cache, and inspect live operational gateway health.',
    languageSettingTitle: 'Application Language (భాష / भाषा)',
    browserGeoPermissions: 'Browser Geolocation Permissions',
    locationEnabled: 'LOCATION ENABLED',
    permissionDenied: 'PERMISSION DENIED',
    offlineDataResilience: 'Offline Data Resilience & Local Cache',
    clearOfflineCacheBtn: 'Clear Local Cache & Reset State',

    disasterFlood: 'Flood',
    disasterCyclone: 'Cyclone',
    disasterEarthquake: 'Earthquake',
    disasterFire: 'Fire',
    disasterLandslide: 'Landslide',
    disasterGeneral: 'General Readiness',

    phasedSurvivalTitle: 'Phased Disaster Survival Protocols',
    beforePrepPhase: 'BEFORE • Preparation',
    duringSurvivalPhase: 'DURING • Active Survival',
    afterRecoveryPhase: 'AFTER • Recovery & All-Clear',
    officialNoticeTitle: 'Official Authority Notice:',
    officialNoticeText: 'This interactive checklist provides standardized emergency preparedness guidance. During an active disaster, always prioritize live instructions issued by District Incident Command, Police, SDRF, and NDRF rescue personnel.',
    activeAlertInSectorText: 'ACTIVE ALERT IN SECTOR',
    protocolsActiveText: 'Protocols Active',
    noActiveAlertInSectorText: 'NO CRITICAL ACTIVE ALERT IN YOUR SECTOR. Displaying general preparedness guidelines.',
    standardReadinessText: 'Standard Readiness',
    openComprehensivePortalText: 'Open Comprehensive Portal',
    interactiveChecklistDesc: 'Interactive survival checklist saved locally to this device.',
    ofCompletedText: 'completed',
    resetBtnText: 'Reset',
    askAiBtn: 'Ask AI',
    startMultiTurnChatBtn: 'Start Multi-Turn Chat',
    sectorDisasterMapTitle: 'Sector Disaster Safety & Evacuation Map',
    sectorDisasterMapDesc: 'Live visualization of current position, flood geofence, relief shelters, and high-ground routes.',

    filterAllShelters: 'All Shelters',
    filterOpenShelters: 'Open & Operational',
    filterWaterShelters: 'Potable Water',
    filterFoodShelters: 'Food Rations',
    filterMedicalShelters: 'Medical Aid',
    searchSheltersPlaceholder: 'Search shelter by name, locality, or sector...',
    spotsAvailableText: 'spots available',
    liveAvailableBadge: 'Live Available',
    navigateSaferRouteBtn: 'Navigate Safer Route',
    viewShelterDetailsBtn: 'View Details & Facilities',
    shelterStatusOpen: 'OPERATIONAL / ACCEPTING EVACUEES',
    shelterStatusLimited: 'NEAR CAPACITY / LIMITED ENTRY',
    shelterStatusFull: 'AT MAXIMUM CAPACITY',
    shelterStatusClosed: 'CURRENTLY CLOSED',

    saferEvacuationCorridorTitle: 'Safer Evacuation Corridor',
    highGroundRouteBadge: 'HIGH-GROUND ROUTE • LOW RISK',
    hazardAvoidanceNotice: 'Avoid submerged underpasses and coastal surge corridors.',
    elevationOverDistanceText: 'Elevation prioritized over speed for flood safety.',
    stepByStepDirectionsTitle: 'Turn-by-Turn Safe Navigation Path',
    openInGoogleMapsBtn: 'Open in Google Maps',
    changeTargetDestinationBtn: 'Change Destination Shelter',

    mapLayersTitle: 'Map Layers',
    layerRiskZonesLabel: 'Risk Geofence',
    layerSheltersLabel: 'Shelters',
    layerEvacRouteLabel: 'Safe Route',
    layerRadarLabel: 'Radar Runoff',
    legendHighRiskFlood: 'Flood Inundation Zone',
    legendDesignatedShelter: 'Designated Relief Shelter',

    emergencyContactsTitle: 'National & State Emergency Contacts',
    evacuationKitTitle: '72-Hour Emergency Evacuation Kit Check',
    dialDirectly: 'Dial Directly',

    riskLevels: {
      LOW: 'Low Risk',
      MODERATE: 'Moderate Risk',
      HIGH: 'High Risk',
      CRITICAL: 'Critical Risk'
    },

    emergencyInstructions: {
      FLOOD: {
        title: 'Flooding & Inundation',
        before: [
          'Know your nearest high-ground relief shelter and evacuation route.',
          'Secure important documents in waterproof bags and keep phone charged.',
          'Stock 3 days of clean drinking water, dry food, and basic medicines.'
        ],
        during: [
          'Move to higher ground immediately. Do not wait for water levels to rise.',
          'Never attempt to walk, swim, or drive through moving flood waters.',
          'Avoid all electrical poles, downed wires, and submerged equipment.',
          'Follow official evacuation instructions promptly.'
        ],
        after: [
          'Do not return home until emergency authorities declare it safe.',
          'Boil all drinking water or use water purification tablets.',
          'Beware of snakes and dangerous wildlife in receded floodwaters.',
          'Report damaged infrastructure and gas leaks to municipal authorities.'
        ]
      },
      CYCLONE: {
        title: 'Severe Cyclone & Gale Storm',
        before: [
          'Board up or secure windows with protective shutters or boards.',
          'Trim dead branches and secure loose outdoor objects like tin sheets.',
          'Keep a battery-operated radio and emergency lights accessible.'
        ],
        during: [
          'Remain indoors in the strongest part of the building away from glass.',
          'Beware of the "Eye of the Storm" — calm winds will be followed by violent reverse winds.',
          'Turn off electricity mains and domestic gas valves.',
          'Move to designated cyclone shelters if instructed by authorities.'
        ],
        after: [
          'Do not step outside until official all-clear is broadcasted.',
          'Watch out for broken glass, dangling wires, and weak tree limbs.',
          'Provide first aid to injured neighbours and signal for help if needed.'
        ]
      },
      EARTHQUAKE: {
        title: 'Earthquake & Tremor',
        before: [
          'Fasten heavy shelves and cabinets securely to walls.',
          'Identify safe spots in each room: under sturdy tables or against interior walls.',
          'Practice DROP, COVER, and HOLD ON drills with your family.'
        ],
        during: [
          'DROP to your hands and knees. COVER your head and neck under a sturdy table.',
          'HOLD ON until shaking stops. Stay away from glass windows and tall furniture.',
          'If outdoors, move to an open area away from buildings, wires, and overpasses.'
        ],
        after: [
          'Expect aftershocks. Be ready to drop, cover, and hold on again.',
          'Check for gas leaks and open fires. Extinguish small fires immediately.',
          'Do not use elevators. Use stairs carefully.'
        ]
      },
      LANDSLIDE: {
        title: 'Landslide & Hill Slope Hazard',
        before: [
          'Watch for warning signs like sticking doors, cracking ground, or tilting trees.',
          'Know evacuation routes away from steep slopes and natural drainage paths.'
        ],
        during: [
          'Move quickly away from the path of a slide or debris flow.',
          'If escape is not possible, curl into a tight ball and protect your head.'
        ],
        after: [
          'Stay away from the slide area. Additional slides frequently follow.',
          'Check for injured or trapped people without entering the danger zone directly.'
        ]
      }
    },

    checklists: {
      FLOOD: {
        title: 'Flood Evacuation & High-Ground Checklist',
        items: [
          { id: 'fl-1', text: 'Move to higher ground immediately' },
          { id: 'fl-2', text: 'Avoid walking or driving through floodwater' },
          { id: 'fl-3', text: 'Keep emergency documents and essential items with you' },
          { id: 'fl-4', text: 'Follow official evacuation instructions' },
          { id: 'fl-5', text: 'Stay away from electrical hazards and submerged power lines' }
        ]
      },
      CYCLONE: {
        title: 'Cyclone Shelter & Storm Surge Checklist',
        items: [
          { id: 'cy-1', text: 'Move indoors to a safe reinforced location' },
          { id: 'cy-2', text: 'Stay away from windows, glass doors, and external walls' },
          { id: 'cy-3', text: 'Secure loose outdoor objects if safe to do so' },
          { id: 'cy-4', text: 'Keep emergency supplies and battery lighting ready' },
          { id: 'cy-5', text: 'Follow official evacuation instructions' }
        ]
      },
      EARTHQUAKE: {
        title: 'Earthquake Response & Evacuation Checklist',
        items: [
          { id: 'eq-1', text: 'Drop, Cover and Hold On during shaking' },
          { id: 'eq-2', text: 'Move away from windows, heavy furniture, and unstable objects' },
          { id: 'eq-3', text: 'After shaking stops, follow official evacuation instructions' },
          { id: 'eq-4', text: 'Avoid damaged buildings and shattered masonry' },
          { id: 'eq-5', text: 'Check for official emergency updates and aftershock warnings' }
        ]
      },
      FIRE: {
        title: 'Urban & Structural Fire Evacuation Checklist',
        items: [
          { id: 'fr-1', text: 'Evacuate immediately via fire escape stairs (never use elevators)' },
          { id: 'fr-2', text: 'Stay low under smoke to avoid toxic inhalation' },
          { id: 'fr-3', text: 'Feel doors for heat with the back of your hand before opening' },
          { id: 'fr-4', text: 'Assemble at designated safe staging perimeter' },
          { id: 'fr-5', text: 'Alert fire emergency responders via 112/101' }
        ]
      },
      LANDSLIDE: {
        title: 'Landslide Warning & Hillside Evacuation Checklist',
        items: [
          { id: 'ls-1', text: 'Evacuate uphill slopes and natural runoff channels' },
          { id: 'ls-2', text: 'Listen for unusual cracking sounds, tumbling boulders, or muddy flows' },
          { id: 'ls-3', text: 'Relocate to reinforced shelter on solid bedrock' },
          { id: 'ls-4', text: 'Avoid river valleys and low-lying drainage paths' },
          { id: 'ls-5', text: 'Report slope cracks to disaster response authorities' }
        ]
      },
      GENERAL: {
        title: 'General Disaster Readiness Checklist',
        items: [
          { id: 'gn-1', text: 'Verify closest designated government shelter location' },
          { id: 'gn-2', text: 'Maintain fully charged mobile phone and power bank' },
          { id: 'gn-3', text: 'Store 3-day supply of drinking water and essential medicines' },
          { id: 'gn-4', text: 'Keep emergency cash and identity cards in sealed plastic' },
          { id: 'gn-5', text: 'Monitor official SURAKSHA alerts for civil advisories' }
        ]
      }
    }
  },

  te: {
    yes: "అవును",
    no: "కాదు",
    full: "పూర్తిగా నిండింది",
    vacant: "ఖాళీగా ఉంది",
    packed: "ప్యాక్ చేయబడింది",
    category: "వర్గం",
    intensity: "తీవ్రత",
    score: "స్కోరు",
    weight: "వెయిటేజీ",
    direction: "దిశ",
    district: "జిల్లా",
    published: "ప్రచురించబడింది",
    validUntil: "చెల్లుబాటు గడువు",
    loggedAt: "నమోదైన సమయం",
    incidentId: "సంఘటన ID",
    downlink: "డౌన్‌లింక్",
    drillMode: "మాక్ డ్రిల్ మోడ్",
    simulationDrill: "సిమ్యులేషన్ డ్రిల్ సక్రియంగా ఉంది",
    webBroadcastActive: "వెబ్ ప్రసారం సక్రియంగా ఉంది",
    smsGatewayNotConfigured: "SMS గేట్‌వే సిమ్యులేషన్ సక్రియం",
    statusReflectsTelemetry: "స్థితి లైవ్ టెలిమెట్రీని ప్రతిబింబిస్తుంది",
    statusSteps: "స్థితి పురోగతి",
    verifiedProgression: "ధృవీకరించబడిన పురోగతి",
    copiedText: "క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది",
    dashboard: "డ్యాష్‌బోర్డ్",
    welcomeBack: "పునఃస్వాగతం",
    changeNumber: "ఫోన్ నంబర్ మార్చండి",
    enter6DigitOtp: "6 అంకెల ధృవీకరణ కోడ్‌ను నమోదు చేయండి",
    indianMobileNumber: "10 అంకెల భారతీయ మొబైల్ నంబర్",
    checkEmailInbox: "పాస్‌వర్డ్ రీసెట్ సూచనల కోసం మీ ఇమెయిల్‌ను తనిఖీ చేయండి.",
    returnToSignIn: "సైన్ ఇన్ పేజీకి తిరిగి వెళ్లండి",
    register: "నమోదు చేసుకోండి",
    createAccount: "ఖాతాను సృష్టించండి",
    fullName: "పూర్తి పేరు",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారణ",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    passwordRecovery: "పాస్‌వర్డ్ పునరుద్ధరణ",
    mobileOtp: "మొబైల్ OTP",
    sendOtp: "OTP పంపండి",
    dispatchingOtp: "OTP పంపబడుతోంది...",
    verifyOtpContinue: "ధృవీకరించి కొనసాగండి",
    verifyingOtp: "OTP ధృవీకరించబడుతోంది...",
    resendOtp: "OTP మళ్ళీ పంపండి",
    citizenVerification: "పౌర ధృవీకరణ",
    backToPortal: "పోర్టల్‌కు తిరిగి వెళ్లండి",
    backToEdit: "సవరణకు తిరిగి వెళ్లండి",
    refreshStatus: "స్థితిని రీఫ్రెష్ చేయండి",
    retryConnection: "కనెక్షన్‌ని మళ్ళీ ప్రయత్నించండి",
    shareAlert: "హెచ్చరికను షేర్ చేయండి",
    call112: "112 కి కాల్ చేయండి",
    call112Helpline: "112 జాతీయ అత్యవసర కాల్",
    ambulance108: "అంబులెన్స్: 108",
    nationalEmergency112: "జాతీయ అత్యవసర సహాయం: 112",
    sdmaControlRoom: "రాష్ట్ర విపత్తు నియంత్రణ: 1070",
    ndmaControlRoom: "NDMA జాతీయ నియంత్రణ: 011-26701728",
    districtCollectorate: "జిల్లా కలెక్టరేట్ నియంత్రణ: 1077",
    coastGuardSAR: "కోస్ట్ గార్డ్ సముద్ర రక్షణ: 1554",
    coastalDistress: "తీరప్రాంత జాలర్ల రక్షణ: 1093",
    emergencyHelplines: "అధికారిక అత్యవసర హెల్ప్‌లైన్లు",
    callShelter: "ఆశ్రయ డెస్క్‌కి కాల్ చేయండి",
    callCommander: "ఇన్సిడెంట్ కమాండర్‌కి కాల్ చేయండి",
    inspectSaferRoute: "సురక్షిత మార్గాన్ని పరిశీలించండి",
    navigateSaferRoute: "సురక్షిత మార్గంలో ప్రయాణించండి",
    locateSafeShelters: "సమీప సురక్షిత ఆశ్రయాలను కనుగొనండి",
    viewShelterDetails: "ఆశ్రయం వివరాలను చూడండి",
    askAiAssistant: "సురక్ష AI సహాయకుడిని అడగండి",
    consultAiAssistant: "AI భద్రతా సహాయకుడిని సంప్రదించండి",
    haveCustomQuestions: "ఈ పరిస్థితి గురించి నిర్దిష్ట ప్రశ్నలు ఉన్నాయా?",
    highSeverity: "అధిక తీవ్రత",
    moderateAdvisory: "మధ్యస్థ సలహా",
    lowWatch: "తక్కువ ప్రమాద నిఘా",
    highRisk: "అధిక ప్రమాదం",
    moderateRisk: "మధ్యస్థ ప్రమాదం",
    criticalRisk: "తీవ్రమైన ప్రమాదం",
    immediateDirective: "తక్షణ ఆదేశం",
    officialDirective: "అధికారిక ఆదేశం",
    affectedAreaLabel: "ప్రభావిత ప్రాంతం",
    affectedCorridor: "ప్రభావిత కారిడార్",
    issuingAuthority: "జారీ చేసిన అధికారి",
    issuedBy: "జారీ చేసినవారు",
    whatToDoNow: "ఇప్పుడు ఏమి చేయాలి",
    residentsAdvised: "ఈ ప్రాంతంలోని నివాసితులు తక్షణ జాగ్రత్తలు తీసుకోవాలని సూచించడమైనది.",
    disseminationChannelsStatus: "సమాచార ప్రసార మార్గాల స్థితి",
    hazardVulnerabilityIndex: "ప్రమాదం & దుర్బలత్వ నిర్ధారణ",
    sectorVulnerabilityIndex: "ప్రాంతీయ దుర్బలత్వ సూచిక",
    compositeHazardScore: "సమగ్ర బహుళ-ప్రమాద స్కోరు",
    riskIndex: "ప్రమాద సూచిక",
    primaryHazard: "ప్రధాన ప్రమాదం",
    deterministicRiskFactors: "ప్రమాదాన్ని నిర్ణయించే అంశాలు",
    hazardIndexWeights: "ప్రమాద సూచిక వెయిటేజీ విభజన",
    locationSafetyLevel: "ప్రాంత భద్రతా స్థాయి",
    elevatedActionRecommended: "రియల్-టైమ్ టెలిమెట్రీ ఆధారంగా అప్రమత్తత అవసరం.",
    computingRiskAnalysis: "బహుళ-కారకాల ప్రమాద విశ్లేషణ లెక్కించబడుతోంది...",
    multiHazardDiagnostic: "బహుళ-ప్రమాద నిర్ధారణ",
    designatedSafeReliefShelter: "గుర్తింపు పొందిన సురక్షిత సహాయ ఆశ్రయం",
    recommendedReliefShelter: "సిఫార్సు చేయబడిన సహాయ ఆశ్రయం",
    spotsAvailable: "స్థలాలు అందుబాటులో ఉన్నాయి",
    currentOccupancy: "ప్రస్తుత ఆక్రమణ",
    availableCapacity: "అందుబాటులో ఉన్న సామర్థ్యం",
    capacityBeds: "సామర్థ్యం (పడకలు)",
    shelterInCharge: "ఆశ్రయం ఇన్‌ఛార్జ్",
    shelterIdLabel: "ఆశ్రయం ID",
    verifiedFacilities: "ధృవీకరించబడిన ఆశ్రయ సౌకర్యాలు",
    facilityAvailable: "ఆవరణలో అందుబాటులో ఉంది",
    facilityNotPresent: "అందుబాటులో లేదు",
    foodRations: "ఆహార నిల్వలు",
    cleanWater: "స్వచ్ఛమైన తాగునీరు",
    medicalAid: "వైద్య సహాయం & ప్రథమ చికిత్స",
    sanitationRestrooms: "పారిశుధ్యం & మరుగుదొడ్లు",
    approxAway: "దూరంలో",
    distanceFromGps: "మీ స్థానం నుండి దూరం",
    computeHighGroundRoute: "ఎత్తైన సురక్షిత కారిడార్ లెక్కించబడుతోంది...",
    aggregatingElevation: "డిజిటల్ ఎలివేషన్ మరియు వరద ప్రమాద మండలాల పరిశీలన...",
    ambientSurfaceTemperature: "ఉపరితల ఉష్ణోగ్రత",
    feelsLike: "అనిపించే ఉష్ణోగ్రత",
    accumulatedRainfall: "కురిసిన వర్షపాతం (24 గం.)",
    rainProbability: "వర్షం పడే సంభావ్యత",
    windVectorsGusts: "గాలి వేగం & తీవ్ర గాలులు",
    surfaceVisibility: "ఉపరితల దృశ్యమానత",
    barometricTrend: "వాయుపీడనం & ధోరణి",
    meteorologicalAttribution: "వాతావరణ కేంద్రం & రాడార్ టెలిమెట్రీ",
    meteorologicalAttributionDesc: "డాప్లర్ రాడార్ చిత్రాలు, వర్షపాత గేజ్ గ్రిడ్‌లు మరియు సముద్ర బోయ్ సెన్సార్లు.",
    observingGroundStation: "పరిశీలన కేంద్రం",
    auditTelemetry: "టెలిమెట్రీ తనిఖీ",
    weatherUnavailable: "వాతావరణ సమాచారం అందుబాటులో లేదు",
    weatherUnavailableDesc: "ఈ ప్రాంతానికి ప్రత్యక్ష సెన్సార్ డేటా లభించలేదు.",
    freshnessLive: "లైవ్ సెన్సార్",
    freshnessRecent: "ఇటీవలి టెలిమెట్రీ",
    freshnessCached: "కాష్ చేయబడిన డేటా",
    freshnessSimulation: "సిమ్యులేషన్ సెన్సార్",
    lastFieldUpdate: "చివరి ఫీల్డ్ అప్‌డేట్",
    trappedOrInjured: "తక్షణ ప్రమాదంలో చిక్కుకున్నారా లేదా గాయపడ్డారా?",
    requestOfficialAssistance: "లైవ్ GPS ప్రసారంతో అధికారిక NDRF/SDRF అత్యవసర సహాయాన్ని అభ్యర్థించండి.",
    triggerSos: "SOS అత్యవసర సంకేతాన్ని పంపండి",
    activeIncident: "సక్రియ అత్యవసర సంఘటన",
    sosIncidentStatus: "SOS అత్యవసర సంఘటన స్థితి",
    personsTrapped: "ప్రమాదంలో ఉన్న వ్యక్తులు",
    medicalAttention: "వైద్య సహాయం అవసరం",
    medicalTrauma: "తీవ్రమైన గాయం / అత్యవసర వైద్యం",
    locationLandmark: "తెలిపిన ప్రదేశం / ల్యాండ్‌మార్క్",
    citizenNote: "రక్షకుల కోసం పౌరుడి గమనిక",
    assignedUnit: "కేటాయించిన రెస్పాన్స్ బృందం",
    awaitingAllocation: "జిల్లా EOC నుండి బృందం కేటాయింపు కోసం వేచి ఉంది...",
    eocTriagingDesc: "జిల్లా అత్యవసర కార్యకలాపాల కేంద్రం సంకేతాన్ని సమీక్షిస్తోంది.",
    eocDispatchNotes: "ఇన్సిడెంట్ కమాండ్ ఫీల్డ్ నోట్స్",
    offlineSosWaiting: "సంక్షోభ సంకేతం పరికరంలో స్థానికంగా భద్రపరచబడింది. ఇంటర్నెట్ రాగానే స్వయంచాలకంగా పంపబడుతుంది.",
    deocDispatch: "జిల్లా డిఈఓసి డెస్క్: 1077",
    officialAuditLog: "అధికారిక సంఘటన ఆడిట్ టైమ్‌లైన్",
    sosTitle: "అత్యవసర SOS సంక్షోభ సంకేతం",
    sosSubtitle: "భారతీయ అత్యవసర కమాండ్ మరియు NDRFకి తక్షణ GPS సంక్షోభాన్ని ప్రసారం చేయండి",
    proceedToConfirm: "సమన్వయ ధృవీకరణకు వెళ్లండి →",
    confirmDistressSignal: "సంక్షోభ సంకేతాన్ని నిర్ధారించండి →",
    transmitSosNow: "ఇప్పుడే SOS పంపండి",
    rescue: "రక్షణ",
    medical: "వైద్యం",
    food: "ఆహారం",
    water: "నీరు",
    other: "ఇతర",
    numberOfPeople: "సహాయం అవసరమైన వ్యక్తుల సంఖ్య",
    urgentMedicalAid: "అత్యవసర వైద్య సహాయం అవసరం",
    buildingLandmark: "నిర్దిష్ట ప్రదేశం / అంతస్తు / ల్యాండ్‌మార్క్",
    additionalMessage: "రెస్క్యూ బృందం కోసం అదనపు గమనికలు",
    emergencyNature: "అత్యవసర స్వభావం",
    requiredUrgently: "తక్షణం అవసరం",
    notRequested: "అభ్యర్థించలేదు",
    reportedBy: "తెలిపినవారు",
    locationLabel: "స్థానం",
    verifiedIncidentCoordinates: "ధృవీకరించబడిన సంఘటన అక్షాంశ రేఖాంశాలు",
    citizenSurvivalDirectory: "పౌర మనుగడ & తరలింపు మార్గదర్శి",
    citizenSurvivalSubtitle: "సమగ్ర విపత్తు మనుగడ ప్రణాళికలు, ఎమర్జెన్సీ కిట్ చెక్‌లిస్టులు మరియు అధికారిక హెల్ప్‌లైన్లు.",
    officialNdmaGuidelines: "అధికారిక NDMA మార్గదర్శకాలు",
    safetyActionChecklist: "సన్నద్ధత కార్యాచరణ చెక్‌లిస్ట్",
    emergencyGoBagTitle: "72 గంటల అత్యవసర కిట్ (గో-బ్యాగ్)",
    keepPrepackedBag: "ఈ క్రింది నిత్యావసరాలతో కూడిన వాటర్‌ప్రూఫ్ బ్యాగ్‌ను మీ ఇంటి ప్రధాన ద్వారం వద్ద సిద్ధంగా ఉంచండి:",
    evacuationKitItems: "కిట్ నిత్యావసరాల తనిఖీ",
    criticalDirectivesPhase: "దశల వారీగా కీలక ఆదేశాలు",
    disasterPreparednessStandards: "ప్రామాణిక పౌర రక్షణ నిబంధనలు",
    duringUrbanFlooding: "పట్టణ వరదల సమయంలో",
    duringSevereCyclones: "తీవ్ర తుఫానుల సమయంలో",
    askSurakshaAi: "సురక్ష AIని అడగండి",
    surakshaAiAssistant: "సురక్ష AI సహాయకుడు",
    gemini3: "జెమిని 3",
    aiSubtitle: "మల్టీ-టర్న్ అత్యవసర & పౌర భద్రతా ఇంటెలిజెన్స్",
    roleLabel: "పాత్ర:",
    modelSpeed: "మోడల్ వేగం:",
    fastResponse: "వేగవంతమైన స్పందన",
    generalSafety: "సాధారణ భద్రత",
    complexAnalysis: "సంక్లిష్ట విశ్లేషణ",
    aiSafetyGuidance: "AI భద్రతా మార్గదర్శకత్వం",
    emergencyOfflineProtocol: "అత్యవసర ఆఫ్‌లైన్ ప్రోటోకాల్",
    copyBtn: "కాపీ",
    copiedBtn: "కాపీ చేయబడింది",
    consultingGemini: "జెమిని భద్రతా ఇంజిన్‌ను సంప్రదిస్తోంది...",
    suggestionsLabel: "సూచనలు:",
    askRolePlaceholder: "అడగండి",
    pressEnterToSend: "పంపడానికి Enter నొక్కండి",
    inLifeThreateningDanger: "ప్రాణాపాయం ఉన్నట్లయితే,",
    call112Immediately: "వెంటనే 112 / 108 కి కాల్ చేయండి.",
    you: "మీరు",
    gisSectorVectorView: "GIS సెక్టార్ వెక్టర్ వ్యూ",
    hazardZone: "ప్రమాద ప్రాంతం",
    shelters: "ఆశ్రయాలు",
    legendSafeRoute: "సురక్షిత మార్గం",
    openInGoogleMaps: "Google Mapsలో తెరవండి",
    acquiringGps: "GPSని పొందుతోంది...",
    useMyLiveLocation: "నా ప్రస్తుత స్థానాన్ని ఉపయోగించండి",
    enterLocationManually: "మాన్యువల్‌గా స్థానాన్ని నమోదు చేయండి",
    searchIndianLocation: "భారతీయ ప్రాంతాన్ని వెతకండి (ఉదా. విశాఖపట్నం)...",
    selectIndianDisasterRiskZone: "విపత్తు ముప్పు ఉన్న ప్రాంతాన్ని / నగరాన్ని ఎంచుకోండి:",
    appName: 'సురక్ష (SURAKSHA)',
    subTitle: 'జాతీయ విపత్తు స్పందన వేదిక',
    tagline: 'ప్రమాదాన్ని గుర్తించండి. సురక్షిత మార్గాన్ని ఎంచుకోండి.',
    publicSafetyNotice: 'భారతదేశ వ్యాప్తంగా భద్రత మరియు ముందస్తు సన్నద్ధత కోసం అధికారిక సమాచారం.',
    publicRole: 'పౌరులు / ప్రజా విభాగం',
    authorityRole: 'విపత్తు నిర్వహణ అధికారి',

    home: 'హోమ్',
    homeNav: 'హోమ్',
    alerts: 'హెచ్చరికలు',
    alertsNav: 'హెచ్చరికలు',
    shelterNav: 'పునరావాసం',
    designatedShelters: 'నిర్దేశిత పునరావాస కేంద్రాలు',
    route: 'సురక్షిత మార్గం',
    routeNav: 'మార్గం',
    saferRouteBtn: 'సురక్షిత మార్గం కనుగొనండి',
    sos: 'అత్యవసర SOS',
    sosNav: 'SOS',
    sosButton: 'అత్యవసర SOS సహాయం అభ్యర్థించండి',
    requestSosBtn: 'అత్యవసర SOS సహాయం అభ్యర్థించండి',
    shelterBtn: 'పునరావాస కేంద్రాన్ని కనుగొనండి',
    safetyGuidesBtn: 'విపత్తు భద్రతా సూచనలు',
    accuracy: 'ఖచ్చితత్వం',
    lastUpdated: 'నవీకరించబడింది',
    recommendedShelter: 'సిఫార్సు చేయబడిన పునరావాస కేంద్రం',
    navigateGoogleMaps: 'గూగుల్ మ్యాప్స్ ద్వారా మార్గం',
    offlineNotice: 'ఇంటర్నెట్ అందుబాటులో లేదు. కాష్ చేసిన సమాచారం చూపిస్తోంది.',
    simulationDrillActive: 'సిమ్యులేషన్ మాక్ డ్రిల్ యాక్టివ్: సమాచారం మరియు డ్రిల్స్ శిక్షణ కోసం మాత్రమే',
    aiAssistant: 'AI అసిస్టెంట్',
    settings: 'సెట్టింగ్‌లు',
    signIn: 'సైన్ ఇన్',
    signOut: 'సైన్ అవుట్',
    authorityPortal: 'అధికారిక పోర్టల్',
    selectLanguage: 'భాషను ఎంచుకోండి',
    back: 'వెనుకకు',
    backTo: 'తిరిగి వెళ్లండి:',
    cancel: 'రద్దు చేయండి',
    confirm: 'ధృవీకరించండి',
    save: 'భద్రపరచండి',
    close: 'మూసివేయండి',
    loading: 'లోడ్ అవుతోంది...',
    success: 'విజయవంతం',
    error: 'లోపం',
    warning: 'హెచ్చరిక',
    search: 'వెతకండి',
    details: 'వివరాలు',
    inspect: 'వివరాలు చూడండి',
    viewAll: 'అన్నీ చూడండి',
    navigate: 'మార్గదర్శకత్వం',
    call: 'కాల్ చేయండి',
    online: 'ఆన్‌లైన్',
    syncing: 'సింక్ అవుతోంది',
    offline: 'ఆఫ్‌లైన్',

    entryQuote: '“ప్రకృతి తొందరపడదు, కానీ ప్రతిదీ నెరవేరుస్తుంది.”',
    entryQuoteTagline: 'ప్రమాదాన్ని గుర్తించండి. సురక్షిత మార్గాన్ని ఎంచుకోండి.',
    entryProtectionTag: 'రక్షణ • భద్రత • సహాయం',
    publicPortalCardTitle: 'పౌర ప్రజా పోర్టల్',
    publicPortalCardDesc: 'పౌరుల కోసం • స్థానిక విపత్తు ప్రమాదం, పునరావాసం, సురక్షిత మార్గాలు & SOS',
    authorityDeskCardTitle: 'విపత్తు నిర్వహణ విభాగం',
    authorityDeskCardDesc: 'ధృవీకరించబడిన విపత్తు ప్రతిస్పందన అధికారులు & కమాండ్ సెంటర్ కోసం',
    citizenAccountLink: 'పౌర ఖాతా: సైన్ ఇన్ లేదా నమోదు చేసుకోండి →',
    entryOfficialAdvisories: 'అధికారిక ముందస్తు హెచ్చరికలు, పౌర రక్షణ సలహాలు మరియు సహాయక చర్యలు.',
    nationalEmergencyNumber: 'జాతీయ అత్యవసర విభాగం: 112',
    disasterHelplineNumber: 'విపత్తు హెల్ప్‌లైన్: 1070',

    citizenAuthTitle: 'పౌర ధృవీకరణ & ప్రవేశం',
    citizenAuthSubtitle: 'సురక్షిత విపత్తు రక్షణ & అత్యవసర బీకాన్ ప్రాప్యత',
    tabPhoneOtp: 'ఫోన్ OTP',
    tabEmailSignIn: 'సైన్ ఇన్',
    tabRegister: 'నమోదు చేసుకోండి',
    tabForgotPassword: 'పాస్‌వర్డ్ రికవరీ',
    phoneOtpNotice: 'అధికారిక అత్యవసర గేట్‌వే ద్వారా నేరుగా SMS ధృవీకరణ',
    mobileNumberLabel: 'మొబైల్ నంబర్ (+91 తో)',
    mobileNumberPlaceholder: '+91 98765 43210',
    sendOtpBtn: 'SMS ద్వారా OTP పంపండి',
    sendingOtpBtn: 'OTP పంపుతోంది...',
    resendInSeconds: 'మళ్లీ పంపే సమయం:',
    otpCodeLabel: '6 అంకెల ధృవీకరణ కోడ్',
    otpCodePlaceholder: '6 అంకెల OTP నమోదు చేయండి',
    verifyOtpBtn: 'ధృవీకరించి కొనసాగించండి',
    verifyingBtn: 'ధృవీకరిస్తోంది...',
    resendOtpBtn: 'OTP మళ్లీ పంపండి',
    fullNameLabel: 'పూర్తి పేరు',
    emailLabel: 'ఈమెయిల్ చిరునామా',
    passwordLabel: 'పాస్‌వర్డ్',
    confirmPasswordLabel: 'పాస్‌వర్డ్‌ను నిర్ధారించండి',
    cityDistrictLabel: 'నివాస నగరం / జిల్లా',
    emergencyContactLabel: 'అత్యవసర సంప్రదింపు ఫోన్',
    createAccountBtn: 'పౌర ఖాతాను సృష్టించండి',
    alreadyHaveAccount: 'ఇప్పటికే నమోదు చేసుకున్నారా?',
    dontHaveAccount: 'ఖాతా లేదా?',
    forgotPasswordLink: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    sendResetLinkBtn: 'పాస్‌వర్డ్ రీసెట్ లింక్ పంపండి',
    otpSentSuccess: 'ధృవీకరణ కోడ్ మీ మొబైల్‌కు విజయవంతంగా పంపబడింది.',
    loginSuccessMsg: 'విజయవంతంగా ధృవీకరించబడింది. సురక్షకు స్వాగతం.',
    invalidPhoneErr: 'దయచేసి సరైన 10 అంకెల భారతీయ మొబైల్ నంబర్‌ను నమోదు చేయండి.',
    invalidOtpErr: 'దయచేసి సరైన 6 అంకెల ధృవీకరణ కోడ్‌ను నమోదు చేయండి.',
    passwordLengthErr: 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.',
    passwordMismatchErr: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.',
    fillAllFieldsErr: 'దయచేసి అవసరమైన అన్ని వివరాలను పూరించండి.',
    confirmDiscardForm: 'మీరు నమోదు చేసిన వివరాలు భద్రపరచబడలేదు. మీరు వెనుకకు వెళ్లాలనుకుంటున్నారా?',

    distressAssistanceTitle: 'అత్యవసర SOS & సహాయక విభాగం',
    distressAssistanceSub: 'విపత్తు నిర్వహణ విభాగానికి నేరుగా ప్రాధాన్యత లింక్',
    distressAssistanceDesc: 'వరద నీటిలో చిక్కుకున్నారా, తక్షణ వైద్య సహాయం కావాలా లేక భవన శిథిలాల నుండి రక్షణ అవసరమా? మీ ప్రత్యక్ష స్థానంతో తక్షణ GPS అత్యవసర సంకేతాన్ని పంపండి.',
    sectorVulnerability: 'ప్రాంతీయ విపత్తు ప్రమాద సూచిక',
    riskScoreOutOf100: '/ 100 ప్రమాద స్కోరు',
    primaryThreat: 'ప్రధాన ప్రమాదం',
    deterministicFactors: 'ప్రమాద కారకాల విశ్లేషణ',
    inspectRiskDiagnostics: 'సవివరమైన విపత్తు విశ్లేషణ & మ్యాప్ వివరాలు →',
    meteorologicalTelemetry: 'వాతావరణ పరిశీలన సమాచారం',
    feelsLikeTemp: 'అనిపించే ఉష్ణోగ్రత',
    rainfallVolume: 'వర్షపాతం పరిమాణం',
    precipitationChance: 'వర్ష సూచన సంభావ్యత',
    windSpeed: 'గాలి వేగం',
    heading: 'దిశ',
    humidity: 'తేమ శాతం',
    moistureSaturation: 'వాతావరణ తేమ',
    visibility: 'దృశ్యమానత',
    lineOfSight: 'దూరపు చూపు',
    telemetry: 'టెలిమెట్రీ',
    inspectRadar: 'డాప్లర్ రడార్ & వాతావరణ వివరాలు →',
    monitoredSector: 'పర్యవేక్షించబడుతున్న ప్రాంతం',
    useLiveLocation: 'నా ప్రస్తుత లొకేషన్ ఉపయోగించు',
    searchLocation: 'లొకేషన్ వెతకండి',
    liveLocation: 'నా ప్రస్తుత లొకేషన్ ఉపయోగించు',
    currentRisk: 'ప్రస్తుత ప్రమాద స్థాయి',
    weatherSnapshot: 'వాతావరణ వివరాలు',
    searchLocationPlaceholder: 'నగరం, జిల్లా లేదా పిన్ కోడ్ వెతకండి...',
    liveMeteorologyBadge: 'ప్రత్యక్ష వాతావరణం',
    viewActionPlan: 'రక్షణ ప్రణాళిక & పునరావాసం చూడండి',

    activeAlerts: 'క్రియాశీల అత్యవసర హెచ్చరికలు',
    activeAlertsTitle: 'క్రియాశీల అత్యవసర హెచ్చరికలు & అధికారిక సూచనలు',
    noActiveAlerts: 'మీ ప్రాంతంలో ఎటువంటి తీవ్రమైన హెచ్చరికలు లేవు.',
    criticalSeverityBadge: 'తీవ్రమైన ప్రమాదం (CRITICAL)',
    highSeverityBadge: 'అధిక ప్రమాదం (HIGH)',
    moderateSeverityBadge: 'మధ్యస్థ ప్రమాదం (MODERATE)',
    lowSeverityBadge: 'తక్కువ ప్రమాదం (LOW)',
    affectedZoneLabel: 'ప్రభావిత ప్రాంతం:',
    directActionLabel: 'తక్షణ చర్య:',
    issuedByLabel: 'జారీ చేసిన విభాగం:',
    shareAlertBtn: 'హెచ్చరికను పంచుకోండి',
    copiedBadge: 'కాపీ చేయబడింది',
    call112Btn: '112 కు కాల్ చేయండి',
    evacuateNow: 'సురక్షిత ప్రాంతానికి తరలిపోండి',

    sosModalTitle: 'అత్యవసర SOS రక్షణ బీకాన్',
    sosModalSubtitle: 'భారత అత్యవసర కమాండ్ & NDRF కు ప్రత్యక్ష GPS సహాయ సంకేతాన్ని పంపండి',
    sosStep1: 'అత్యవసర వివరాలు',
    sosStep2: 'ప్రత్యక్ష GPS ధృవీకరణ',
    sosStep3: 'రక్షణ సంకేతం ప్రసారం',
    emergencyType: 'విపత్తు / అత్యవసర స్వభావం',
    sosTypeRescue: 'వరద ముంపు / నీటిలో చిక్కుకోవడం (రెస్క్యూ)',
    sosTypeMedical: 'తక్షణ అత్యవసర వైద్యం',
    sosTypeCollapse: 'భవనం కూలిపోవడం / శిథిలాల కింద చిక్కుకోవడం',
    sosTypeEvacuation: 'వృద్ధులు / దివ్యాంగుల తరలింపు సహాయం',
    sosTypeOther: 'ఇతర ప్రాణాపాయ పరిస్థితి',
    peopleCountLabel: 'సహాయం అవసరమైన వ్యక్తుల సంఖ్య',
    medicalAssistanceCheckbox: 'తీవ్రమైన వైద్య సహాయం అవసరం (గాయాలు, ఆక్సిజన్, అత్యవసర చికిత్స)',
    areaDescriptionLabel: 'ఖచ్చితమైన ప్రదేశం / ల్యాండ్‌మార్క్ / అంతస్తు',
    areaDescriptionPlaceholder: 'ఉదా. నీటి ట్యాంక్ సమీపంలోని 2వ అంతస్తు బాల్కనీ, నీలిరంగు గేటు ఇల్లు',
    messageLabel: 'రెస్క్యూ బృందానికి సందేశం / ప్రత్యేక సూచనలు',
    messagePlaceholder: 'నీటి లోతు, బాధితుల ఆరోగ్య పరిస్థితి, వృద్ధులు లేదా పిల్లలు ఉన్నారా...',
    liveCoordinates: 'ప్రత్యక్ష GPS అక్షాంశ రేఖాంశాలు',
    gpsAccuracy: 'ఖచ్చితత్వం: ±{acc}మీ',
    falseSosWarning: 'కఠిన హెచ్చరిక: తప్పుడు SOS సందేశాలు పంపడం చట్టరీత్యా నేరం. ఇది ఇతరుల ప్రాణరక్షణకు ఆటంకం కలిగిస్తుంది.',
    continueToVerification: 'కోఆర్డినేట్స్ ధృవీకరణకు కొనసాగించండి →',
    confirmAndTransmit: 'ధృవీకరించి అత్యవసర బీకాన్ ప్రసారం చేయండి',
    transmittingSos: 'కమాండ్ సెంటర్‌కు బీకాన్ ప్రసారం చేయబడుతోంది...',
    sosTransmittedSuccess: 'అత్యవసర బీకాన్ విజయవంతంగా ప్రసారం చేయబడింది. రెస్క్యూ బృందాలు అప్రమత్తమయ్యాయి.',
    cancelSosBtn: 'SOS కాల్‌ను రద్దు చేయండి',
    activeIncidentTracker: 'క్రియాశీల అత్యవసర సంఘటన',
    stepReceived: 'స్వీకరించబడింది',
    stepReceivedDesc: 'ఇన్సిడెంట్ గేట్‌వే వద్ద SOS లాగ్ చేయబడింది',
    stepNotified: 'కమాండ్ సెంటర్‌కు సమాచారం',
    stepNotifiedDesc: 'విపత్తు కమాండర్ ద్వారా ప్రాధాన్యత నిర్ణయం',
    stepAssigned: 'బృందం కేటాయించబడింది',
    stepAssignedDesc: 'సహాయక బృందం నిర్దేశించబడింది',
    stepDispatched: 'బృందం బయలుదేరింది',
    stepDispatchedDesc: 'లొకేషన్‌కు రెస్క్యూ బృందం బయలుదేరింది',
    stepOnScene: 'స్థలానికి చేరుకుంది',
    stepOnSceneDesc: 'రెస్క్యూ బృందం సంఘటనా స్థలానికి చేరుకుంది',
    stepResolved: 'పరిష్కరించబడింది',
    stepResolvedDesc: 'పౌరులు సురక్షితంగా రక్షించబడ్డారు',

    sheltersTitle: 'నిర్దేశిత అత్యవసర పునరావాస కేంద్రాలు',
    sheltersSubtitle: 'సమీపంలోని పునరావాస కేంద్రాలు, తుఫాను ఆశ్రయాలు మరియు ఎత్తైన రిలీఫ్ క్యాంపులు.',
    facilitiesInSector: 'ప్రాంతంలోని కేంద్రాలు',
    occupancyLoad: 'ప్రస్తుత సామర్థ్యం',
    available: 'ఖాళీగా ఉన్నవి',
    cleanFoodRations: 'స్వచ్ఛమైన ఆహారం',
    potableWater: 'తాగునీరు',
    medicalSupport: 'వైద్య సహాయం',
    powerGenerator: 'విద్యుత్ జనరేటర్',
    rampAccess: 'ర్యాంప్ సౌకర్యం',
    saferRouteBtnSmall: 'సురక్షిత మార్గం',
    mapsBtnSmall: 'మ్యాప్స్',
    detailsAndFacilities: 'సౌకర్యాలు & వివరాలు',

    saferRoutingTitle: 'సురక్షిత తరలింపు మార్గదర్శకత్వం',
    elevationOverShortcut: 'ఎత్తైన మార్గం > దగ్గరి దారి',
    saferRoutingSubtitle: 'తక్కువ దూరం కన్నా వరద మరియు ముంపు లేని ఎత్తైన సురక్షిత మార్గానికే ప్రాధాన్యత.',
    changeTargetShelter: 'లక్ష్య పునరావాస కేంద్రాన్ని మార్చండి',
    targetEvacuationDestination: 'తరలింపు గమ్యస్థానం',
    recommendedSafeRoute: 'సిఫార్సు చేయబడిన సురక్షిత మార్గం',
    lowRisk: 'తక్కువ ప్రమాదం',
    distance: 'దూరం:',
    estTransit: 'అంచనా సమయం:',
    riskScore: 'ప్రమాద స్కోరు:',
    safetyAdvantages: 'భద్రతా ప్రయోజనాలు:',
    travelAdvisory: 'ప్రయాణ సలహా:',
    hazardPathDoNotUse: 'ప్రమాదకర మార్గం • ఉపయోగించవద్దు',
    criticalDanger: 'తీవ్ర ప్రమాదం',

    safetyGuideTitle: 'అధికారిక విపత్తు భద్రతా మార్గదర్శకాలు & చెక్‌లిస్ట్',
    safetyGuideSubtitle: 'NDMA ఆమోదించిన అధికారిక పౌర రక్షణ మార్గదర్శకాలు.',
    beforeTab: 'ముందు (ముందస్తు సన్నద్ధత)',
    duringTab: 'జరుగుతున్నప్పుడు (తక్షణ చర్య)',
    afterTab: 'తరువాత (పునరుద్ధరణ)',
    checklistTitle: 'సన్నద్ధత చెక్‌లిస్ట్',
    itemsCompleted: 'అంశాలు పూర్తయ్యాయి',
    resetChecklist: 'రీసెట్ చేయండి',

    settingsTitle: 'సిస్టమ్ ప్రాధాన్యతలు & సెట్టింగ్‌లు',
    settingsSubtitle: 'మీ భాష, లొకేషన్ అనుమతులు, ఆఫ్‌లైన్ డేటా కాష్ మరియు గేట్‌వే స్థితిని నిర్వహించండి.',
    languageSettingTitle: 'అనువర్తన భాష (భాష / भाषा)',
    browserGeoPermissions: 'లొకేషన్ అనుమతులు',
    locationEnabled: 'లొకేషన్ ప్రారంభించబడింది',
    permissionDenied: 'అనుమతి నిరాకరించబడింది',
    offlineDataResilience: 'ఆఫ్‌లైన్ డేటా & స్థానిక కాష్',
    clearOfflineCacheBtn: 'కాష్‌ను క్లియర్ చేసి రీసెట్ చేయండి',

    disasterFlood: 'వరద',
    disasterCyclone: 'తుఫాను',
    disasterEarthquake: 'భూకంపం',
    disasterFire: 'అగ్నిప్రమాదం',
    disasterLandslide: 'కొండచరియలు',
    disasterGeneral: 'సాధారణ ముందస్తు సన్నద్ధత',

    phasedSurvivalTitle: 'విపత్తు రక్షణ దశలవారీ మార్గదర్శకాలు',
    beforePrepPhase: 'ముందు • ముందస్తు సన్నద్ధత',
    duringSurvivalPhase: 'సమయంలో • తక్షణ ప్రాణ రక్షణ',
    afterRecoveryPhase: 'తర్వాత • పునరుద్ధరణ & క్షేమం',
    officialNoticeTitle: 'అధికారిక ప్రభుత్వ హెచ్చరిక:',
    officialNoticeText: 'ఈ చెక్‌లిస్ట్ ప్రామాణిక విపత్తు ముందస్తు సన్నద్ధత సూచనలను అందిస్తుంది. విపత్తు సమయంలో ఎల్లప్పుడూ జిల్లా విపత్తు విభాగం, పోలీస్, SDRF మరియు NDRF రక్షణ బృందాల ప్రత్యక్ష ఆదేశాలను ఖచ్చితంగా పాటించండి.',
    activeAlertInSectorText: 'మీ ప్రాంతంలో ప్రమాద హెచ్చరిక అమలులో ఉంది',
    protocolsActiveText: 'రక్షణ మార్గదర్శకాలు అమలులో ఉన్నాయి',
    noActiveAlertInSectorText: 'మీ ప్రాంతంలో ఎటువంటి తీవ్రమైన హెచ్చరికలు లేవు. సాధారణ సన్నద్ధత సూచనలను చూడండి.',
    standardReadinessText: 'సాధారణ సన్నద్ధత',
    openComprehensivePortalText: 'పూర్తి విపత్తు సమాచారం చూడండి',
    interactiveChecklistDesc: 'ఈ పరికరంలో స్థానికంగా భద్రపరచబడే రక్షణ చెక్‌లిస్ట్.',
    ofCompletedText: 'పూర్తయింది',
    resetBtnText: 'రీసెట్ చేయండి',
    askAiBtn: 'AI ని అడగండి',
    startMultiTurnChatBtn: 'AI తో సంభాషణ ప్రారంభించండి',
    sectorDisasterMapTitle: 'ప్రాంతీయ విపత్తు భద్రత & తరలింపు మ్యాప్',
    sectorDisasterMapDesc: 'ప్రస్తుత స్థానం, వరద ప్రాంతాలు, పునరావాస కేంద్రాలు మరియు సురక్షిత ఎత్తైన మార్గాల ప్రత్యక్ష దృశ్యం.',

    filterAllShelters: 'అన్ని కేంద్రాలు',
    filterOpenShelters: 'పనిచేస్తున్నవి / అందుబాటులో ఉన్నవి',
    filterWaterShelters: 'తాగునీరు',
    filterFoodShelters: 'ఆహారం & రేషన్',
    filterMedicalShelters: 'వైద్య సదుపాయం',
    searchSheltersPlaceholder: 'పేరు, వీధి లేదా ప్రాంతం ద్వారా వెతకండి...',
    spotsAvailableText: 'స్థలాలు అందుబాటులో ఉన్నాయి',
    liveAvailableBadge: 'ప్రత్యక్ష లభ్యత',
    navigateSaferRouteBtn: 'సురక్షిత మార్గం ద్వారా వెళ్ళండి',
    viewShelterDetailsBtn: 'సదుపాయాలు & పూర్తి వివరాలు',
    shelterStatusOpen: 'అందుబాటులో ఉంది / బాధితులను చేర్చుకుంటున్నారు',
    shelterStatusLimited: 'దాదాపు నిండిపోయింది / పరిమిత ప్రవేశం',
    shelterStatusFull: 'పూర్తిగా నిండిపోయింది',
    shelterStatusClosed: 'ప్రస్తుతం మూసివేయబడింది',

    saferEvacuationCorridorTitle: 'సురక్షిత తరలింపు మార్గం',
    highGroundRouteBadge: 'ఎత్తైన సురక్షిత దారి • తక్కువ ప్రమాదం',
    hazardAvoidanceNotice: 'నీటిలో మునిగిన అండర్‌పాస్‌లు మరియు తీరప్రాంత వరదలను నివారించండి.',
    elevationOverDistanceText: 'వరద రక్షణ కొరకు వేగం కంటే ఎత్తైన మార్గానికే ప్రాధాన్యత.',
    stepByStepDirectionsTitle: 'అంచెలవారీ సురక్షిత మార్గదర్శకాలు',
    openInGoogleMapsBtn: 'గూగుల్ మ్యాప్స్‌లో తెరవండి',
    changeTargetDestinationBtn: 'పునరావాస కేంద్రాన్ని మార్చండి',

    mapLayersTitle: 'మ్యాప్ లేయర్లు',
    layerRiskZonesLabel: 'ప్రమాద మండలం',
    layerSheltersLabel: 'పునరావాస కేంద్రాలు',
    layerEvacRouteLabel: 'సురక్షిత మార్గం',
    layerRadarLabel: 'రాడార్ వర్షపాతం',
    legendHighRiskFlood: 'తీవ్ర వరద ముంపు ప్రాంతం',
    legendDesignatedShelter: 'ప్రభుత్వ గుర్తింపు పొందిన పునరావాస కేంద్రం',

    emergencyContactsTitle: 'జాతీయ & రాష్ట్ర అత్యవసర సంప్రదింపు నంబర్లు',
    evacuationKitTitle: '72 గంటల అత్యవసర కిట్ తనిఖీ',
    dialDirectly: 'నేరుగా కాల్ చేయండి',

    riskLevels: {
      LOW: 'తక్కువ ప్రమాదం',
      MODERATE: 'మధ్యస్థ ప్రమాదం',
      HIGH: 'అధిక ప్రమాదం',
      CRITICAL: 'తీవ్రమైన ప్రమాదం (హెచ్చరిక)'
    },

    emergencyInstructions: {
      FLOOD: {
        title: 'వరదలు & ముంపు ప్రమాదం',
        before: [
          'సమీపంలోని ఎత్తైన పునరావాస కేంద్రాన్ని మరియు సురక్షిత మార్గాన్ని ముందుగానే తెలుసుకోండి.',
          'ముఖ్యమైన పత్రాలను వాటర్‌ప్రూఫ్ కవర్లలో భద్రపరచుకోండి, ఫోన్‌ను ఛార్జ్ చేసి ఉంచండి.',
          '3 రోజులకు సరిపడా తాగునీరు, పొడి ఆహారం, ప్రాథమిక మందులు సిద్ధంగా ఉంచుకోండి.'
        ],
        during: [
          'వెంటనే ఎత్తైన ప్రాంతాలకు చేరుకోండి. నీటి మట్టం పెరిగే వరకు వేచి ఉండవద్దు.',
          'ప్రవహించే వరద నీటిలో నడవడానికి, ఈత కొట్టడానికి లేదా వాహనాలు నడపడానికి ప్రయత్నించవద్దు.',
          'విద్యుత్ స్తంభాలు మరియు తెగిపడిన తీగలకు దూరంగా ఉండండి.',
          'అధికారుల ఖాళీ ఆదేశాలను వెంటనే పాటించండి.'
        ],
        after: [
          'అధికారులు సురక్షితమని చెప్పే వరకు ఇంటికి తిరిగి వెళ్లవద్దు.',
          'తాగునీటిని కాచి చల్లార్చి మాత్రమే తాగండి లేదా శుద్ధీకరణ మాత్రలు వాడండి.',
          'వరద నీరు తగ్గిన తర్వాత పాములు మరియు విష కీటకాల పట్ల అప్రమత్తంగా ఉండండి.',
          'దెబ్బతిన్న భవనాలు, రోడ్లు మరియు గ్యాస్ లీకేజీల గురించి అధికారులకు సమాచారం ఇవ్వండి.'
        ]
      },
      CYCLONE: {
        title: 'తీవ్ర తుఫాను & పెనుగాలులు',
        before: [
          'కిటికీలు మరియు తలుపులను సురక్షితంగా మూసివేయండి.',
          'ఇంటి చుట్టూ ఉన్న చెట్ల ఎండిన కొమ్మలను నరికివేయండి, రేకుల పైకప్పులను గట్టిగా బిగించండి.',
          'బ్యాటరీ రేడియో మరియు ఎమర్జెన్సీ లైట్లు సిద్ధంగా ఉంచుకోండి.'
        ],
        during: [
          'ఇంట్లోనే కిటికీలకు దూరంగా బలమైన గదిలో ఉండండి.',
          'విద్యుత్ మెయిన్స్ మరియు గ్యాస్ సిలిండర్లను ఆపివేయండి.',
          'తుఫాను కన్ను (ఐ ఆఫ్ ది స్టార్మ్) సమయంలో ప్రశాంతత తర్వాత మళ్లీ తీవ్రమైన ఎదురుగాలులు వస్తాయి, బయటకు రావద్దు.',
          'అధికారులు సూచిస్తే తక్షణమే తుఫాను పునరావాస కేంద్రానికి తరలిపోండి.'
        ],
        after: [
          'అధికారిక క్లియరెన్స్ వచ్చేవరకు బయటకు రావద్దు.',
          'విరిగిపడిన విద్యుత్ తీగలు మరియు కూలిన చెట్లను తాకవద్దు.',
          'గాయపడిన ఇరుగుపొరుగు వారికి ప్రాథమిక చికిత్స అందించండి.'
        ]
      },
      EARTHQUAKE: {
        title: 'భూకంపం & భూ ప్రకంపనలు',
        before: [
          'ఇంట్లో పడిపోయే భారీ వస్తువులు, అల్మారాలను గోడలకు సురక్షితంగా బిగించండి.',
          'బలమైన టేబుల్ కింద కూర్చునే పద్ధతిని కుటుంబంతో ప్రాక్టీస్ చేయండి.',
          'ప్రతి గదిలో సురక్షిత ప్రదేశాలను గుర్తించండి.'
        ],
        during: [
          'కిందకి వంగి, బలమైన టేబుల్ కింద తల దాచుకోండి (DROP, COVER, HOLD).',
          'కిటికీలు, అద్దాలు మరియు ఎత్తైన ఫర్నిచర్‌కు దూరంగా ఉండండి.',
          'బయట ఉంటే భవనాలు, విద్యుత్ స్తంభాలు మరియు ఫ్లైఓవర్లకు దూరంగా ఖాళీ మైదానంలోకి వెళ్లండి.'
        ],
        after: [
          'తదుపరి ప్రకంపనల (ఆఫ్టర్‌షాక్స్) పట్ల జాగ్రత్త వహించండి.',
          'లిఫ్ట్‌లను ఎట్టిపరిస్థితుల్లోనూ ఉపయోగించవద్దు, మెట్లను మాత్రమే వాడండి.',
          'గ్యాస్ లీక్ లేదా షార్ట్ సర్క్యూట్‌లను తనిఖీ చేసి మెయిన్స్ ఆఫ్ చేయండి.'
        ]
      },
      LANDSLIDE: {
        title: 'కొండచరియలు విరిగిపడటం & కొండ వాలు ప్రమాదాలు',
        before: [
          'కొండ వాలులలో ఏర్పడే పగుళ్లు, నేల కుంగిపోవడం గమనించండి.',
          'కొండచరియలు పడే సహజ నీటి ప్రవాహ మార్గాలను ముందుగానే తెలుసుకోండి.'
        ],
        during: [
          'ప్రమాద మార్గం నుండి వెంటనే పక్కకు తప్పుకోండి.',
          'తప్పించుకోలేకపోతే తలను కాపాడుకుంటూ గుండ్రంగా ముడుచుకోండి.'
        ],
        after: [
          'కొండచరియలు విరిగిన ప్రాంతానికి దూరంగా ఉండండి, మళ్లీ పడే ప్రమాదం ఉంది.',
          'ప్రమాద ప్రాంతంలోకి నేరుగా వెళ్లకుండా సహాయక బృందాలకు సమాచారం అందించండి.'
        ]
      }
    },

    checklists: {
      FLOOD: {
        title: 'వరద తరలింపు & ఎత్తైన ప్రాంత రక్షణ చెక్‌లిస్ట్',
        items: [
          { id: 'fl-1', text: 'వెంటనే సమీపంలోని ఎత్తైన ప్రాంతానికి చేరుకోండి' },
          { id: 'fl-2', text: 'ప్రవహించే వరద నీటిలో నడవద్దు లేదా వాహనాలు నడపవద్దు' },
          { id: 'fl-3', text: 'ముఖ్యమైన పత్రాలు, మందులు మరియు విలువైన వస్తువులు వెంట ఉంచుకోండి' },
          { id: 'fl-4', text: 'అధికారిక తరలింపు ఆదేశాలను వెంటనే పాటించండి' },
          { id: 'fl-5', text: 'విద్యుత్ స్తంభాలు మరియు నీటిలో మునిగిన వైర్లకు దూరంగా ఉండండి' }
        ]
      },
      CYCLONE: {
        title: 'తుఫాను రక్షణ & షెల్టర్ చెక్‌లిస్ట్',
        items: [
          { id: 'cy-1', text: 'బలమైన భవనం లేదా పునరావాస కేంద్రంలో ఉండండి' },
          { id: 'cy-2', text: 'కిటికీలు, గాజు తలుపులు మరియు బాహ్య గోడలకు దూరంగా ఉండండి' },
          { id: 'cy-3', text: 'ఇంటి బయట ఉన్న వదులుగా ఉండే వస్తువులను భద్రపరచండి' },
          { id: 'cy-4', text: 'ఎమర్జెన్సీ లైట్లు, బ్యాటరీలు, రేడియో సిద్ధంగా ఉంచుకోండి' },
          { id: 'cy-5', text: 'అధికారుల ఖాళీ ఆదేశాలను ఖచ్చితంగా పాటించండి' }
        ]
      },
      EARTHQUAKE: {
        title: 'భూకంప ప్రతిస్పందన చెక్‌లిస్ట్',
        items: [
          { id: 'eq-1', text: 'ప్రకంపనల సమయంలో కిందకి వంగి, తల దాచుకుని, పట్టుకోండి (Drop, Cover, Hold)' },
          { id: 'eq-2', text: 'కిటికీలు, భారీ అల్మారాలు మరియు వేలాడే వస్తువులకు దూరంగా ఉండండి' },
          { id: 'eq-3', text: 'ప్రకంపనలు ఆగిన తర్వాత సురక్షితంగా బయటకు రండి' },
          { id: 'eq-4', text: 'దెబ్బతిన్న భవనాలు మరియు కూలిన గోడల వద్దకు వెళ్లవద్దు' },
          { id: 'eq-5', text: 'అధికారిక హెచ్చరికలు మరియు తదుపరి ప్రకంపనల వివరాలు గమనించండి' }
        ]
      },
      FIRE: {
        title: 'అగ్నిప్రమాద తరలింపు చెక్‌లిస్ట్',
        items: [
          { id: 'fr-1', text: 'ఫైర్ ఎస్కేప్ మెట్ల ద్వారా వెంటనే బయటకు రండి (లిఫ్ట్ వాడవద్దు)' },
          { id: 'fr-2', text: 'పొగ ఎక్కువగా ఉంటే నేలకు దగ్గరగా వంగి నడవండి' },
          { id: 'fr-3', text: 'తలుపులు తెరిచే ముందు వాటిని చేతి వెనుక భాగంతో తాకి వేడిని తనిఖీ చేయండి' },
          { id: 'fr-4', text: 'నిర్దేశిత సురక్షిత బహిరంగ ప్రదేశంలో సమకూరండి' },
          { id: 'fr-5', text: '112 లేదా 101 కు కాల్ చేసి అగ్నిమాపక విభాగానికి తెలపండి' }
        ]
      },
      LANDSLIDE: {
        title: 'కొండచరియల రక్షణ చెక్‌లిస్ట్',
        items: [
          { id: 'ls-1', text: 'కొండ వాలులు మరియు కొండ వాగుల మార్గాల నుండి దూరంగా ఉండండి' },
          { id: 'ls-2', text: 'రాళ్లు రాలడం, నేల పగుళ్లు లేదా అనుమానాస్పద శబ్దాలు గమనించండి' },
          { id: 'ls-3', text: 'బలమైన పునాదులు ఉన్న సురక్షిత ఆశ్రయానికి వెళ్లండి' },
          { id: 'ls-4', text: 'లోయలు మరియు మురుగు కాలువల వద్ద నిలబడవద్దు' },
          { id: 'ls-5', text: 'కొండచరియల ప్రమాదం గురించి అధికారులకు తెలియజేయండి' }
        ]
      },
      GENERAL: {
        title: 'సాధారణ విపత్తు ముందస్తు సన్నద్ధత చెక్‌లిస్ట్',
        items: [
          { id: 'gn-1', text: 'సమీపంలోని అధికారిక పునరావాస కేంద్రాన్ని తెలుసుకోండి' },
          { id: 'gn-2', text: 'మొబైల్ ఫోన్ మరియు పవర్ బ్యాంక్‌ను ఫుల్ ఛార్జ్ చేసి ఉంచుకోండి' },
          { id: 'gn-3', text: '3 రోజులకు సరిపడా తాగునీరు మరియు అవసరమైన మందులు భద్రపరచండి' },
          { id: 'gn-4', text: 'అత్యవసర నగదు మరియు గుర్తింపు కార్డులను వాటర్‌ప్రూఫ్ కవర్‌లో ఉంచండి' },
          { id: 'gn-5', text: 'సురక్ష అధికారిక హెచ్చరికలను ఎప్పటికప్పుడు గమనించండి' }
        ]
      }
    }
  },

  hi: {
    yes: "हाँ",
    no: "नहीं",
    full: "भर चुका है",
    vacant: "रिक्त",
    packed: "पैक किया हुआ",
    category: "श्रेणी",
    intensity: "तीव्रता",
    score: "स्कोर",
    weight: "भार",
    direction: "दिशा",
    district: "ज़िला",
    published: "प्रकाशित",
    validUntil: "वैधता",
    loggedAt: "दर्ज समय",
    incidentId: "घटना ID",
    downlink: "डाउनलिंक",
    drillMode: "मॉक ड्रिल मोड",
    simulationDrill: "सिमुलेशन ड्रिल सक्रिय",
    webBroadcastActive: "वेब प्रसारण सक्रिय",
    smsGatewayNotConfigured: "SMS गेटवे सिमुलेशन सक्रिय",
    statusReflectsTelemetry: "स्थिति लाइव टेलीमेट्री दर्शाती है",
    statusSteps: "स्थिति प्रगति",
    verifiedProgression: "सत्यापित प्रगति",
    copiedText: "क्लिपबोर्ड पर कॉपी किया गया",
    dashboard: "डैशबोर्ड",
    welcomeBack: "वापसी पर स्वागत",
    changeNumber: "फ़ोन नंबर बदलें",
    enter6DigitOtp: "6 अंकों का सत्यापन कोड दर्ज करें",
    indianMobileNumber: "10 अंकों का भारतीय मोबाइल नंबर",
    checkEmailInbox: "पासवर्ड रीसेट निर्देशों के लिए अपना ईमेल देखें।",
    returnToSignIn: "साइन इन पर वापस जाएं",
    register: "पंजीकरण करें",
    createAccount: "खाता बनाएं",
    fullName: "पूरा नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि",
    forgotPassword: "पासवर्ड भूल गए?",
    passwordRecovery: "पासवर्ड पुनर्प्राप्ति",
    mobileOtp: "मोबाइल OTP",
    sendOtp: "OTP भेजें",
    dispatchingOtp: "OTP भेजा जा रहा है...",
    verifyOtpContinue: "सत्यापित कर आगे बढ़ें",
    verifyingOtp: "OTP सत्यापित हो रहा है...",
    resendOtp: "OTP पुनः भेजें",
    citizenVerification: "नागरिक सत्यापन",
    backToPortal: "पोर्टल पर वापस जाएं",
    backToEdit: "संपादन पर वापस जाएं",
    refreshStatus: "स्थिति रीफ़्रेश करें",
    retryConnection: "कनेक्शन पुनः प्रयास करें",
    shareAlert: "अलर्ट साझा करें",
    call112: "112 पर कॉल करें",
    call112Helpline: "112 राष्ट्रीय आपातकाल कॉल",
    ambulance108: "एम्बुलेंस: 108",
    nationalEmergency112: "राष्ट्रीय आपातकाल: 112",
    sdmaControlRoom: "राज्य आपदा नियंत्रण कक्ष: 1070",
    ndmaControlRoom: "NDMA राष्ट्रीय नियंत्रण: 011-26701728",
    districtCollectorate: "ज़िला कलेक्ट्रेट नियंत्रण कक्ष: 1077",
    coastGuardSAR: "तटरक्षक समुद्री खोज व बचाव: 1554",
    coastalDistress: "तटीय मछुआरा संकट: 1093",
    emergencyHelplines: "आधिकारिक आपातकालीन हेल्पलाइन",
    callShelter: "आश्रय डेस्क पर कॉल करें",
    callCommander: "घटना कमांडर को कॉल करें",
    inspectSaferRoute: "सुरक्षित मार्ग देखें",
    navigateSaferRoute: "सुरक्षित मार्ग पर नेविगेट करें",
    locateSafeShelters: "निकटतम सुरक्षित आश्रय खोजें",
    viewShelterDetails: "आश्रय का विवरण देखें",
    askAiAssistant: "सुरक्षा AI सहायक से पूछें",
    consultAiAssistant: "AI सुरक्षा सहायक से सलाह लें",
    haveCustomQuestions: "क्या इस स्थिति के बारे में आपके कोई प्रश्न हैं?",
    highSeverity: "उच्च गंभीरता",
    moderateAdvisory: "मध्यम परामर्श",
    lowWatch: "कम जोखिम निगरानी",
    highRisk: "उच्च जोखिम",
    moderateRisk: "मध्यम जोखिम",
    criticalRisk: "अति गंभीर जोखिम",
    immediateDirective: "तत्काल निर्देश",
    officialDirective: "आधिकारिक निर्देश",
    affectedAreaLabel: "प्रभावित क्षेत्र",
    affectedCorridor: "प्रभावित गलियारा",
    issuingAuthority: "जारीकर्ता प्राधिकरण",
    issuedBy: "द्वारा जारी",
    whatToDoNow: "अब क्या करें",
    residentsAdvised: "इस क्षेत्र के निवासियों को तत्काल सावधानी बरतने की सलाह दी जाती है।",
    disseminationChannelsStatus: "प्रसार चैनलों की स्थिति",
    hazardVulnerabilityIndex: "आपदा व संवेदनशीलता निदान",
    sectorVulnerabilityIndex: "क्षेत्रीय संवेदनशीलता सूचकांक",
    compositeHazardScore: "समग्र बहु-आपदा स्कोर",
    riskIndex: "जोखिम सूचकांक",
    primaryHazard: "प्रमुख ख़तरा",
    deterministicRiskFactors: "जोखिम निर्धारक कारक",
    hazardIndexWeights: "आपदा सूचकांक भार वितरण",
    locationSafetyLevel: "स्थान सुरक्षा स्तर",
    elevatedActionRecommended: "रीयल-टाइम टेलीमेट्री के आधार पर सतर्कता बरतने की सलाह है।",
    computingRiskAnalysis: "बहु-कारक जोखिम विश्लेषण की गणना की जा रही है...",
    multiHazardDiagnostic: "बहु-आपदा नैदानिक",
    designatedSafeReliefShelter: "नामित सुरक्षित राहत आश्रय",
    recommendedReliefShelter: "अनुशंसित राहत आश्रय",
    spotsAvailable: "स्थान उपलब्ध",
    currentOccupancy: "वर्तमान उपस्थिति",
    availableCapacity: "उपलब्ध क्षमता",
    capacityBeds: "क्षमता (बिस्तर)",
    shelterInCharge: "आश्रय प्रभारी",
    shelterIdLabel: "आश्रय ID",
    verifiedFacilities: "सत्यापित आश्रय सुविधाएं",
    facilityAvailable: "परिसर में उपलब्ध",
    facilityNotPresent: "उपलब्ध नहीं",
    foodRations: "खाद्य सामग्री",
    cleanWater: "स्वच्छ पेयजल",
    medicalAid: "चिकित्सा सहायता व प्राथमिक उपचार",
    sanitationRestrooms: "स्वच्छता व शौचालय",
    approxAway: "दूरी पर",
    distanceFromGps: "आपके स्थान से दूरी",
    computeHighGroundRoute: "ऊंचे सुरक्षित मार्ग की गणना की जा रही है...",
    aggregatingElevation: "डिजिटल एलिवेशन और बाढ़ क्षेत्रों का विश्लेषण जारी है...",
    ambientSurfaceTemperature: "सतही तापमान",
    feelsLike: "महसूस होने वाला तापमान",
    accumulatedRainfall: "कुल वर्षा (24 घंटे)",
    rainProbability: "वर्षा की संभावना",
    windVectorsGusts: "हवा की गति व तेज झोंके",
    surfaceVisibility: "सतह की दृश्यता",
    barometricTrend: "वायुमंडलीय दबाव व रुझान",
    meteorologicalAttribution: "मौसम केंद्र एवं रडार टेलीमेट्री",
    meteorologicalAttributionDesc: "डॉप्लर रडार चित्र, वर्षा मापक ग्रिड और समुद्री बोया सेंसर।",
    observingGroundStation: "मौसम प्रेक्षण केंद्र",
    auditTelemetry: "टेलीमेट्री ऑडिट",
    weatherUnavailable: "मौसम डेटा अनुपलब्ध",
    weatherUnavailableDesc: "इस क्षेत्र के लिए लाइव सेंसर डेटा प्राप्त नहीं हो सका।",
    freshnessLive: "लाइव सेंसर",
    freshnessRecent: "हालिया टेलीमेट्री",
    freshnessCached: "कैश किया डेटा",
    freshnessSimulation: "सिमुलेशन सेंसर",
    lastFieldUpdate: "अंतिम फ़ील्ड अपडेट",
    trappedOrInjured: "क्या आप तुरंत खतरे में फंसे या घायल हैं?",
    requestOfficialAssistance: "लाइव GPS प्रसारण के साथ आधिकारिक NDRF/SDRF आपातकालीन सहायता प्राप्त करें।",
    triggerSos: "SOS संकट संकेत भेजें",
    activeIncident: "सक्रिय आपातकालीन घटना",
    sosIncidentStatus: "SOS संकट घटना की स्थिति",
    personsTrapped: "फंसे हुए / खतरे में व्यक्ति",
    medicalAttention: "चिकित्सा सहायता आवश्यक",
    medicalTrauma: "गंभीर चोट / आपातकालीन चिकित्सा",
    locationLandmark: "बताया गया स्थान / पहचान",
    citizenNote: "बचाव दल हेतु नागरिक का संदेश",
    assignedUnit: "तैनात बचाव दल",
    awaitingAllocation: "ज़िला EOC से टीम आवंटन की प्रतीक्षा है...",
    eocTriagingDesc: "ज़िला आपातकालीन संचालन केंद्र संकट डेटा की समीक्षा कर रहा है।",
    eocDispatchNotes: "घटना कमान फ़ील्ड नोट्स",
    offlineSosWaiting: "संकट संकेत डिवाइस पर सुरक्षित है। इंटरनेट बहाल होते ही स्वतः प्रसारित हो जाएगा।",
    deocDispatch: "ज़िला DEOC डेस्क: 1077",
    officialAuditLog: "आधिकारिक घटना ऑडिट समयरेखा",
    sosTitle: "आपातकालीन SOS संकट बीकन",
    sosSubtitle: "भारतीय आपातकालीन कमान और NDRF को तत्काल GPS संकट संकेत भेजें",
    proceedToConfirm: "निर्देशांक सत्यापन हेतु आगे बढ़ें →",
    confirmDistressSignal: "संकट संकेत की पुष्टि करें →",
    transmitSosNow: "अभी SOS भेजें",
    rescue: "बचाव",
    medical: "चिकित्सा",
    food: "भोजन",
    water: "पानी",
    other: "अन्य",
    numberOfPeople: "मदद की ज़रूरत वाले लोगों की संख्या",
    urgentMedicalAid: "तत्काल चिकित्सा सहायता आवश्यक",
    buildingLandmark: "विशिष्ट स्थान / मंज़िल / पहचान",
    additionalMessage: "बचाव दल के लिए अतिरिक्त विवरण",
    emergencyNature: "आपातकाल की प्रकृति",
    requiredUrgently: "अति आवश्यक",
    notRequested: "आवश्यक नहीं",
    reportedBy: "द्वारा सूचित",
    locationLabel: "स्थान",
    verifiedIncidentCoordinates: "सत्यापित घटना निर्देशांक",
    citizenSurvivalDirectory: "नागरिक उत्तरजीविता एवं निकासी निर्देशिका",
    citizenSurvivalSubtitle: "व्यापक आपदा उत्तरजीविता मार्गदर्शिका, आपातकालीन किट चेकलिस्ट और हेल्पलाइन।",
    officialNdmaGuidelines: "आधिकारिक NDMA दिशानिर्देश",
    safetyActionChecklist: "तैयारी कार्य चेकलिस्ट",
    emergencyGoBagTitle: "72-घंटे की आपातकालीन किट (गो-बैग)",
    keepPrepackedBag: "घर के मुख्य द्वार के पास इन आवश्यक वस्तुओं से भरा वाटरप्रूफ बैग तैयार रखें:",
    evacuationKitItems: "किट की आवश्यक वस्तुएं",
    criticalDirectivesPhase: "चरणबद्ध महत्वपूर्ण निर्देश",
    disasterPreparednessStandards: "मानक नागरिक सुरक्षा नियम",
    duringUrbanFlooding: "शहरी बाढ़ के दौरान",
    duringSevereCyclones: "भीषण चक्रवात के दौरान",
    askSurakshaAi: "सुरक्षा AI से पूछें",
    surakshaAiAssistant: "सुरक्षा AI सहायक",
    gemini3: "जेमिनी 3",
    aiSubtitle: "मल्टी-टर्न आपातकालीन व नागरिक सुरक्षा इंटेलिजेंस",
    roleLabel: "भूमिका:",
    modelSpeed: "मॉडल गति:",
    fastResponse: "तेज़ प्रतिक्रिया",
    generalSafety: "सामान्य सुरक्षा",
    complexAnalysis: "जटिल विश्लेषण",
    aiSafetyGuidance: "AI सुरक्षा मार्गदर्शन",
    emergencyOfflineProtocol: "आपातकालीन ऑफ़लाइन प्रोटोकॉल",
    copyBtn: "कॉपी करें",
    copiedBtn: "कॉपी किया गया",
    consultingGemini: "जेमिनी सुरक्षा इंजन से संपर्क किया जा रहा है...",
    suggestionsLabel: "सुझाव:",
    askRolePlaceholder: "पूछें",
    pressEnterToSend: "भेजने के लिए Enter दबाएं",
    inLifeThreateningDanger: "जानलेवा खतरे में होने पर,",
    call112Immediately: "तुरंत 112 / 108 पर कॉल करें।",
    you: "आप",
    gisSectorVectorView: "GIS सेक्टर वेक्टर व्यू",
    hazardZone: "खतरे का क्षेत्र",
    shelters: "आश्रय",
    legendSafeRoute: "सुरक्षित मार्ग",
    openInGoogleMaps: "Google Maps में खोलें",
    acquiringGps: "GPS प्राप्त किया जा रहा है...",
    useMyLiveLocation: "मेरे वर्तमान स्थान का उपयोग करें",
    enterLocationManually: "मैन्युअल रूप से स्थान दर्ज करें",
    searchIndianLocation: "भारतीय स्थान खोजें (उदा. विशाखापत्तनम)...",
    selectIndianDisasterRiskZone: "आपदा जोखिम क्षेत्र / शहर चुनें:",
    appName: 'सुरक्षा (SURAKSHA)',
    subTitle: 'राष्ट्रीय आपदा प्रतिक्रिया मंच',
    tagline: 'खतरे को पहचानें। सुरक्षित रास्ता चुनें।',
    publicSafetyNotice: 'भारत भर में सुरक्षा और आपदा तैयारी के लिए आधिकारिक सार्वजनिक सूचना।',
    publicRole: 'नागरिक / जनसाधारण',
    authorityRole: 'आपदा प्रबंधन अधिकारी',

    home: 'होम',
    homeNav: 'होम',
    alerts: 'अलर्ट',
    alertsNav: 'अलर्ट',
    shelterNav: 'आश्रय',
    designatedShelters: 'नामित राहत शिविर',
    route: 'सुरक्षित मार्ग',
    routeNav: 'मार्ग',
    saferRouteBtn: 'सुरक्षित मार्ग खोजें',
    sos: 'आपातकालीन SOS',
    sosNav: 'SOS',
    sosButton: 'आपातकालीन SOS सहायता का अनुरोध करें',
    requestSosBtn: 'आपातकालीन SOS अनुरोध',
    shelterBtn: 'निकटतम राहत शिविर खोजें',
    safetyGuidesBtn: 'आपदा सुरक्षा दिशानिर्देश',
    accuracy: 'सटीकता',
    lastUpdated: 'अद्यतित',
    recommendedShelter: 'अनुशंसित राहत शिविर',
    navigateGoogleMaps: 'गूगल मैप्स से नेविगेट करें',
    offlineNotice: 'कमज़ोर/कोई नेटवर्क नहीं। कैश की गई जानकारी का उपयोग हो रहा है।',
    simulationDrillActive: 'सिमुलेशन अभ्यास सक्रिय: डेटा और अभ्यास केवल परीक्षण हेतु हैं',
    aiAssistant: 'AI सहायक',
    settings: 'सेटिंग्स',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    authorityPortal: 'प्राधिकरण पोर्टल',
    selectLanguage: 'भाषा चुनें',
    back: 'वापस',
    backTo: 'वापस जाएं:',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सहेजें',
    close: 'बंद करें',
    loading: 'लोड हो रहा है...',
    success: 'सफलता',
    error: 'त्रुटि',
    warning: 'चेतावनी',
    search: 'खोजें',
    details: 'विवरण',
    inspect: 'विस्तृत विवरण देखें',
    viewAll: 'सभी देखें',
    navigate: 'नेविगेट करें',
    call: 'कॉल करें',
    online: 'ऑनलाइन',
    syncing: 'सिंक हो रहा है',
    offline: 'ऑफ़लाइन',

    entryQuote: '“प्रकृति जल्दबाजी नहीं करती, फिर भी सब कुछ पूरा होता है।”',
    entryQuoteTagline: 'खतरे को पहचानें। सुरक्षित रास्ता चुनें।',
    entryProtectionTag: 'संरक्षण • सुरक्षा • सहायता',
    publicPortalCardTitle: 'नागरिक सार्वजनिक पोर्टल',
    publicPortalCardDesc: 'नागरिकों हेतु • स्थानीय जोखिम, राहत शिविर, सुरक्षित मार्ग एवं SOS',
    authorityDeskCardTitle: 'आपदा प्राधिकरण डेस्क',
    authorityDeskCardDesc: 'सत्यापित आपदा प्रतिक्रिया अधिकारियों एवं आपातकालीन केंद्र हेतु',
    citizenAccountLink: 'नागरिक खाता: साइन इन करें या नया खाता बनाएं →',
    entryOfficialAdvisories: 'आधिकारिक पूर्व चेतावनी, नागरिक सुरक्षा सलाह और आपदा निकासी प्रबंधन।',
    nationalEmergencyNumber: 'राष्ट्रीय आपातकाल: 112',
    disasterHelplineNumber: 'आपदा हेल्पलाइन: 1070',

    citizenAuthTitle: 'नागरिक सत्यापन एवं प्रवेश',
    citizenAuthSubtitle: 'सुरक्षित आपदा राहत एवं आपातकालीन बीकन पहुंच',
    tabPhoneOtp: 'फ़ोन OTP',
    tabEmailSignIn: 'साइन इन',
    tabRegister: 'नया खाता',
    tabForgotPassword: 'पासवर्ड रीसेट',
    phoneOtpNotice: 'आधिकारिक आपातकालीन गेटवे द्वारा सीधा SMS सत्यापन',
    mobileNumberLabel: 'मोबाइल नंबर (+91 सहित)',
    mobileNumberPlaceholder: '+91 98765 43210',
    sendOtpBtn: 'SMS द्वारा OTP भेजें',
    sendingOtpBtn: 'OTP भेजा जा रहा है...',
    resendInSeconds: 'पुनः भेजने का समय:',
    otpCodeLabel: '6 अंकों का सत्यापन कोड',
    otpCodePlaceholder: '6 अंकों का OTP दर्ज करें',
    verifyOtpBtn: 'सत्यापित करें और आगे बढ़ें',
    verifyingBtn: 'सत्यापित हो रहा है...',
    resendOtpBtn: 'OTP पुनः भेजें',
    fullNameLabel: 'पूरा नाम',
    emailLabel: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    cityDistrictLabel: 'निवास का शहर / ज़िला',
    emergencyContactLabel: 'आपातकालीन संपर्क नंबर',
    createAccountBtn: 'नागरिक खाता बनाएं',
    alreadyHaveAccount: 'क्या पहले से खाता है?',
    dontHaveAccount: 'क्या नया खाता चाहिए?',
    forgotPasswordLink: 'पासवर्ड भूल गए?',
    sendResetLinkBtn: 'पासवर्ड रीसेट लिंक भेजें',
    otpSentSuccess: 'सत्यापन कोड आपके मोबाइल पर सफलतापूर्वक भेज दिया गया है।',
    loginSuccessMsg: 'सत्यापन सफल हुआ। सुरक्षा में आपका स्वागत है।',
    invalidPhoneErr: 'कृपया एक मान्य 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें।',
    invalidOtpErr: 'कृपया एक मान्य 6 अंकों का सत्यापन कोड दर्ज करें।',
    passwordLengthErr: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
    passwordMismatchErr: 'पासवर्ड मेल नहीं खा रहे हैं।',
    fillAllFieldsErr: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
    confirmDiscardForm: 'आपके पास असहेजे गए विवरण हैं। क्या आप निश्चित रूप से वापस जाना चाहते हैं?',

    distressAssistanceTitle: 'आपातकालीन SOS एवं संकट सहायता',
    distressAssistanceSub: 'आपदा राहत कमांड सेंटर से सीधा प्राथमिकता संपर्क',
    distressAssistanceDesc: 'बाढ़ के पानी में फंसे हैं, तत्काल चिकित्सा सहायता की आवश्यकता है या बचाव चाहिए? अपने सटीक लाइव जीपीएस निर्देशांकों के साथ तुरंत संकट संकेत भेजें।',
    sectorVulnerability: 'क्षेत्रीय संवेदनशीलता सूचकांक',
    riskScoreOutOf100: '/ 100 जोखिम स्कोर',
    primaryThreat: 'प्राथमिक ख़तरा',
    deterministicFactors: 'जोखिम निर्धारक कारक',
    inspectRiskDiagnostics: 'विस्तृत जोखिम निदान एवं रूपरेखा देखें →',
    meteorologicalTelemetry: 'मौसम संबंधी टेलीमेट्री',
    feelsLikeTemp: 'अनुभूत तापमान',
    rainfallVolume: 'वर्षा की मात्रा',
    precipitationChance: 'वर्षा की संभावना',
    windSpeed: 'हवा की गति',
    heading: 'दिशा',
    humidity: 'आर्द्रता',
    moistureSaturation: 'नमी संतृप्ति',
    visibility: 'दृश्यता',
    lineOfSight: 'दृष्टि सीमा',
    telemetry: 'टेलीमेट्री',
    inspectRadar: 'डॉप्लर रडार और टेलीमेट्री विवरण देखें →',
    monitoredSector: 'निगरानी क्षेत्र',
    useLiveLocation: 'मेरी लाइव लोकेशन का उपयोग करें',
    searchLocation: 'स्थान खोजें',
    liveLocation: 'मेरी लाइव लोकेशन का उपयोग करें',
    currentRisk: 'वर्तमान जोखिम स्तर',
    weatherSnapshot: 'मौसम की जानकारी',
    searchLocationPlaceholder: 'शहर, ज़िला या पिन कोड खोजें...',
    liveMeteorologyBadge: 'लाइव मौसम',
    viewActionPlan: 'कार्य योजना एवं आश्रय देखें',

    activeAlerts: 'सक्रिय आपातकालीन अलर्ट',
    activeAlertsTitle: 'सक्रिय आपातकालीन अलर्ट एवं आधिकारिक परामर्श',
    noActiveAlerts: 'आपके निकटतम दायरे में कोई गंभीर आपातकालीन अलर्ट नहीं है।',
    criticalSeverityBadge: 'अत्यधिक गंभीर (CRITICAL)',
    highSeverityBadge: 'उच्च जोखिम (HIGH)',
    moderateSeverityBadge: 'मध्यम जोखिम (MODERATE)',
    lowSeverityBadge: 'कम जोखिम (LOW)',
    affectedZoneLabel: 'प्रभावित क्षेत्र:',
    directActionLabel: 'प्रत्यक्ष कार्रवाई:',
    issuedByLabel: 'जारीकर्ता:',
    shareAlertBtn: 'अलर्ट साझा करें',
    copiedBadge: 'कॉपी किया गया',
    call112Btn: '112 पर कॉल करें',
    evacuateNow: 'सुरक्षित स्थान पर जाएं',

    sosModalTitle: 'आपातकालीन SOS संकट बीकन',
    sosModalSubtitle: 'भारतीय आपातकालीन कमान एवं NDRF को तत्काल GPS संकट संकेत प्रसारित करें',
    sosStep1: 'आपातकालीन विवरण',
    sosStep2: 'लाइव GPS सत्यापन',
    sosStep3: 'संकट संकेत प्रसारण',
    emergencyType: 'आपातकाल का प्रकार',
    sosTypeRescue: 'बाढ़ / जलभराव (जल बचाव)',
    sosTypeMedical: 'तत्काल चिकित्सा आपातकाल',
    sosTypeCollapse: 'भवन ढहना / मलबे में फंसे होना',
    sosTypeEvacuation: 'वृद्ध / दिव्यांग निकासी सहायता',
    sosTypeOther: 'अन्य जानलेवा ख़तरा',
    peopleCountLabel: 'मदद की आवश्यकता वाले व्यक्तियों की संख्या',
    medicalAssistanceCheckbox: 'गंभीर चिकित्सा सहायता की आवश्यकता (चोट, ऑक्सीजन, तत्काल उपचार)',
    areaDescriptionLabel: 'सटीक स्थान का लैंडमार्क / मंज़िल',
    areaDescriptionPlaceholder: 'उदा. ओवरहेड पानी की टंकी के पास दूसरी मंजिल की बालकनी, नीला गेट',
    messageLabel: 'बचाव दल के लिए संदेश / विशेष विवरण',
    messagePlaceholder: 'पानी की गहराई, पीड़ितों की स्थिति, वृद्ध या बच्चे मौजूद हैं...',
    liveCoordinates: 'लाइव GPS निर्देशांक',
    gpsAccuracy: 'सटीकता: ±{acc}मी',
    falseSosWarning: 'कड़ी चेतावनी: झूठी संकट कॉल वास्तविक बचाव कार्यों में बाधा डालती है और कानूनन दंडनीय है।',
    continueToVerification: 'निर्देशांक सत्यापन के लिए आगे बढ़ें →',
    confirmAndTransmit: 'पुष्टि करें एवं संकट बीकन प्रसारित करें',
    transmittingSos: 'कमांड सेंटर को संकट बीकन भेजा जा रहा है...',
    sosTransmittedSuccess: 'आपातकालीन संकट बीकन सफलतापूर्वक प्रसारित किया गया। बचाव दल सतर्क हैं।',
    cancelSosBtn: 'संकट कॉल रद्द करें',
    activeIncidentTracker: 'सक्रिय आपातकालीन घटना',
    stepReceived: 'प्राप्त हुआ',
    stepReceivedDesc: 'इंसिडेंट गेटवे पर SOS दर्ज हुआ',
    stepNotified: 'कमांड सेंटर सूचित',
    stepNotifiedDesc: 'आपदा कमांडर द्वारा घटना की समीक्षा',
    stepAssigned: 'दल नियुक्त',
    stepAssignedDesc: 'बचाव दल को जिम्मेदारी सौंपी गई',
    stepDispatched: 'दल रवाना',
    stepDispatchedDesc: 'निर्देशांकों के लिए बचाव दल रवाना',
    stepOnScene: 'घटनास्थल पर पहुंचे',
    stepOnSceneDesc: 'बचाव दल घटनास्थल पर पहुंच गया है',
    stepResolved: 'समाधान पूर्ण',
    stepResolvedDesc: 'नागरिक सुरक्षित, बचाव कार्य पूर्ण',

    sheltersTitle: 'नामित आपातकालीन राहत शिविर',
    sheltersSubtitle: 'निकटतम राहत केंद्र, चक्रवात आश्रय और ऊंचे स्थानों पर स्थापित शिविर।',
    facilitiesInSector: 'क्षेत्र में कुल केंद्र',
    occupancyLoad: 'वर्तमान ऑक्यूपेंसी',
    available: 'उपलब्ध',
    cleanFoodRations: 'भोजन एवं राशन',
    potableWater: 'पेयजल',
    medicalSupport: 'चिकित्सा सहायता',
    powerGenerator: 'पावर जनरेटर',
    rampAccess: 'रैंप की सुविधा',
    saferRouteBtnSmall: 'सुरक्षित मार्ग',
    mapsBtnSmall: 'मैप्स',
    detailsAndFacilities: 'सुविधाएं एवं विवरण',

    saferRoutingTitle: 'सुरक्षित निकासी मार्ग',
    elevationOverShortcut: 'ऊंचाई > छोटा रास्ता',
    saferRoutingSubtitle: 'कम दूरी के बजाय बाढ़ और जलभराव से मुक्त ऊंचे सुरक्षित मार्ग को प्राथमिकता।',
    changeTargetShelter: 'लक्षित राहत आश्रय बदलें',
    targetEvacuationDestination: 'निकासी गंतव्य',
    recommendedSafeRoute: 'अनुशंसित सुरक्षित मार्ग',
    lowRisk: 'कम जोखिम',
    distance: 'दूरी:',
    estTransit: 'अनुमानित समय:',
    riskScore: 'जोखिम स्कोर:',
    safetyAdvantages: 'सुरक्षा लाभ:',
    travelAdvisory: 'यात्रा परामर्श:',
    hazardPathDoNotUse: 'ख़तरे का मार्ग • प्रयोग न करें',
    criticalDanger: 'अत्यंत ख़तरनाक',

    safetyGuideTitle: 'आधिकारिक आपदा सुरक्षा दिशानिर्देश एवं चेकलिस्ट',
    safetyGuideSubtitle: 'NDMA द्वारा अनुमोदित आधिकारिक नागरिक सुरक्षा प्रक्रियाएं।',
    beforeTab: 'पहले (पूर्व तैयारी)',
    duringTab: 'दौरान (कार्रवाई)',
    afterTab: 'बाद में (सुधार कार्य)',
    checklistTitle: 'इंटरैक्टिव तैयारी चेकलिस्ट',
    itemsCompleted: 'कार्य पूर्ण',
    resetChecklist: 'चेकलिस्ट रीसेट करें',

    settingsTitle: 'सिस्टम प्राथमिकताएं एवं सेटिंग्स',
    settingsSubtitle: 'अपनी भाषा, स्थान अनुमतियां, ऑफ़लाइन डेटा कैश और गेटवे स्थिति प्रबंधित करें।',
    languageSettingTitle: 'एप्लिकेशन की भाषा (భాష / भाषा)',
    browserGeoPermissions: 'ब्राउज़र स्थान अनुमतियां',
    locationEnabled: 'स्थान चालू है',
    permissionDenied: 'अनुमति अस्वीकृत',
    offlineDataResilience: 'ऑफ़लाइन डेटा एवं स्थानीय कैश',
    clearOfflineCacheBtn: 'लोकल कैश साफ़ करें और रीसेट करें',

    disasterFlood: 'बाढ़',
    disasterCyclone: 'चक्रवात',
    disasterEarthquake: 'भूकंप',
    disasterFire: 'आग',
    disasterLandslide: 'भूस्खलन',
    disasterGeneral: 'सामान्य आपदा तैयारी',

    phasedSurvivalTitle: 'आपदा सुरक्षा चरणबद्ध दिशानिर्देश',
    beforePrepPhase: 'पहले • पूर्व तैयारी',
    duringSurvivalPhase: 'दौरान • आपातकालीन जीवन रक्षा',
    afterRecoveryPhase: 'बाद में • पुनर्प्राप्ति एवं सुरक्षा',
    officialNoticeTitle: 'आधिकारिक प्रशासनिक सूचना:',
    officialNoticeText: 'यह चेकलिस्ट आपातकालीन तैयारी के लिए मानक मार्गदर्शन प्रदान करती है। सक्रिय आपदा के दौरान हमेशा जिला आपदा प्रबंधन, पुलिस, SDRF और NDRF बचाव दल के प्रत्यक्ष निर्देशों का पालन करें।',
    activeAlertInSectorText: 'आपके क्षेत्र में आपातकालीन चेतावनी सक्रिय है',
    protocolsActiveText: 'सुरक्षा नियम सक्रिय',
    noActiveAlertInSectorText: 'आपके क्षेत्र में कोई गंभीर आपदा अलर्ट नहीं है। सामान्य तैयारी दिशानिर्देश देखें।',
    standardReadinessText: 'मानक तैयारी',
    openComprehensivePortalText: 'विस्तृत आपदा पोर्टल खोलें',
    interactiveChecklistDesc: 'इस उपकरण में स्थानीय रूप से सुरक्षित की जाने वाली चेकलिस्ट।',
    ofCompletedText: 'पूर्ण हुआ',
    resetBtnText: 'रीसेट करें',
    askAiBtn: 'AI से पूछें',
    startMultiTurnChatBtn: 'AI सहायक से बातचीत करें',
    sectorDisasterMapTitle: 'क्षेत्रीय आपदा सुरक्षा एवं निकासी मानचित्र',
    sectorDisasterMapDesc: 'वर्तमान स्थान, बाढ़ क्षेत्र, राहत शिविर और ऊंचे सुरक्षित मार्गों का सीधा दृश्य।',

    filterAllShelters: 'सभी राहत शिविर',
    filterOpenShelters: 'सक्रिय एवं खुले',
    filterWaterShelters: 'पीने का पानी',
    filterFoodShelters: 'भोजन सामग्री',
    filterMedicalShelters: 'चिकित्सा सहायता',
    searchSheltersPlaceholder: 'नाम, मोहल्ले या क्षेत्र से राहत शिविर खोजें...',
    spotsAvailableText: 'स्थान उपलब्ध हैं',
    liveAvailableBadge: 'लाइव उपलब्धता',
    navigateSaferRouteBtn: 'सुरक्षित रास्ते से जाएं',
    viewShelterDetailsBtn: 'सुविधाएं एवं विवरण देखें',
    shelterStatusOpen: 'सक्रिय / शरणार्थियों का प्रवेश जारी',
    shelterStatusLimited: 'लगभग भर चुका है / सीमित प्रवेश',
    shelterStatusFull: 'पूर्ण क्षमता पर / स्थान शेष नहीं',
    shelterStatusClosed: 'वर्तमान में बंद',

    saferEvacuationCorridorTitle: 'सुरक्षित निकासी गलियारा',
    highGroundRouteBadge: 'ऊंची भूमि का रास्ता • न्यूनतम जोखिम',
    hazardAvoidanceNotice: 'जलमग्न अंडरपास और तटीय बहाव वाले रास्तों से बचें।',
    elevationOverDistanceText: 'बाढ़ से सुरक्षा हेतु दूरी से अधिक ऊंचाई को प्राथमिकता दी गई है।',
    stepByStepDirectionsTitle: 'चरण-दर-चरण सुरक्षित मार्गदर्शन',
    openInGoogleMapsBtn: 'गूगल मैप्स में खोलें',
    changeTargetDestinationBtn: 'राहत शिविर बदलें',

    mapLayersTitle: 'मानचित्र लेयर्स',
    layerRiskZonesLabel: 'जोखिम क्षेत्र',
    layerSheltersLabel: 'राहत शिविर',
    layerEvacRouteLabel: 'सुरक्षित मार्ग',
    layerRadarLabel: 'रडार वर्षा बहाव',
    legendHighRiskFlood: 'अत्यधिक बाढ़ प्रभावित क्षेत्र',
    legendDesignatedShelter: 'नामित सरकारी राहत शिविर',

    emergencyContactsTitle: 'राष्ट्रीय एवं राज्य आपातकालीन संपर्क',
    evacuationKitTitle: '72-घंटे की आपातकालीन किट जांच',
    dialDirectly: 'सीधे कॉल करें',

    riskLevels: {
      LOW: 'कम जोखिम',
      MODERATE: 'मध्यम जोखिम',
      HIGH: 'उच्च जोखिम',
      CRITICAL: 'अत्यधिक गंभीर जोखिम'
    },

    emergencyInstructions: {
      FLOOD: {
        title: 'बाढ़ एवं जलभराव का खतरा',
        before: [
          'निकटतम ऊंचे राहत शिविर और सुरक्षित निकासी मार्ग की जानकारी रखें।',
          'ज़रूरी दस्तावेज़ों को वाटरप्रूफ बैग में रखें और फोन चार्ज रखें।',
          '3 दिन के लिए पीने का पानी, सूखा भोजन और आवश्यक दवाइयाँ तैयार रखें।'
        ],
        during: [
          'तुरंत ऊंचे स्थानों पर जाएं। जलस्तर बढ़ने की प्रतीक्षा न करें।',
          'बहते बाढ़ के पानी में चलने, तैरने या गाड़ी चलाने की कोशिश कभी न करें।',
          'बिजली के खंभों, गिरे हुए तारों और बिजली के उपकरणों से दूर रहें।',
          'प्रशासन द्वारा दिए गए निकासी निर्देशों का तुरंत पालन करें।'
        ],
        after: [
          'जब तक प्रशासन सुरक्षित घोषित न करे, घर वापस न लौटें।',
          'पानी उबालकर ही पिएं या शुद्धिकरण गोलियों का उपयोग करें।',
          'बाढ़ के पानी के हटने के बाद सांपों और कीड़े-मकोड़ों से सावधान रहें।',
          'क्षतिग्रस्त बुनियादी ढांचे और गैस रिसाव की सूचना तुरंत प्रशासन को दें।'
        ]
      },
      CYCLONE: {
        title: 'भीषण चक्रवात एवं आंधी-तूफान',
        before: [
          'खिड़कियों और दरवाजों को सुरक्षित रूप से बंद रखें।',
          'आस-पास के सूखे पेड़ों की शाखाओं को काट लें, टिन की चादरों को कसकर बांधें।',
          'बैटरी रेडियो और टॉर्च चालू स्थिति में तैयार रखें।'
        ],
        during: [
          'घर के सबसे मजबूत हिस्से में रहें और कांच की खिड़कियों से दूर रहें।',
          'बिजली के मुख्य स्विच और गैस सिलेंडर बंद कर दें।',
          'तूफान की आंख (शांत समय) में बाहर न निकलें, इसके तुरंत बाद विपरीत दिशा से प्रचंड हवाएं चलती हैं।',
          'निर्देश मिलने पर तुरंत पक्के चक्रवात राहत आश्रय में चले जाएं।'
        ],
        after: [
          'आधिकारिक सूचना मिलने तक बाहर न निकलें।',
          'टूटे हुए तारों और गिरे हुए पेड़ों को न छुएं।',
          'घायल पड़ोसियों को प्राथमिक उपचार दें और जरूरत पड़ने पर मदद मांगें।'
        ]
      },
      EARTHQUAKE: {
        title: 'भूकंप एवं झटके',
        before: [
          'अलमारी और भारी सामान को दीवारों से अच्छी तरह सुरक्षित बांधें।',
          'परिवार के साथ मजबूत मेज के नीचे छिपने का अभ्यास करें (Drop, Cover, Hold)।',
          'प्रत्येक कमरे में सुरक्षित स्थानों की पहचान करें।'
        ],
        during: [
          'झुकें, सिर ढकें और मजबूत मेज को पकड़ें (DROP, COVER, HOLD)।',
          'खिड़कियों, कांच और भारी फर्नीचर से दूर रहें।',
          'यदि खुले मैदान में हैं तो इमारतों, बिजली के तारों और ओवरपास से दूर रहें।'
        ],
        after: [
          'भूकंप के बाद के झटकों (आफ्टरशॉक्स) के लिए तैयार रहें।',
          'लिफ्ट का उपयोग न करें, केवल सीढ़ियों का प्रयोग करें।',
          'गैस रिसाव या आग की जांच करें और मुख्य स्विच बंद कर दें।'
        ]
      },
      LANDSLIDE: {
        title: 'भूस्खलन (पहाड़ धंसना) एवं मलबा बहाव',
        before: [
          'पहाड़ी ढलानों में आई दरारों, झुके हुए पेड़ों और बदलते जल प्रवाह पर नज़र रखें।',
          'निकासी के सुरक्षित रास्तों की पहचान करें।'
        ],
        during: [
          'मलबे के बहाव के रास्ते से तुरंत दूर हटें।',
          'यदि बचना संभव न हो तो सिर को दोनों हाथों से ढककर गोल मुड़ जाएं।'
        ],
        after: [
          'भूस्खलन वाले क्षेत्र से दूर रहें क्योंकि दोबारा मिट्टी धंसने का खतरा रहता है।',
          'खतरे वाले क्षेत्र में सीधे प्रवेश किए बिना प्रशासन को सूचित करें।'
        ]
      }
    },

    checklists: {
      FLOOD: {
        title: 'बाढ़ निकासी एवं उच्च भूमि सुरक्षा चेकलिस्ट',
        items: [
          { id: 'fl-1', text: 'तुरंत निकटतम ऊंचे स्थान या राहत शिविर की ओर जाएं' },
          { id: 'fl-2', text: 'बहते हुए बाढ़ के पानी में पैदल या वाहन से न जाएं' },
          { id: 'fl-3', text: 'ज़रूरी दस्तावेज़, दवाएं और कीमती सामान वाटरप्रूफ बैग में रखें' },
          { id: 'fl-4', text: 'प्रशासन के आधिकारिक निकासी निर्देशों का तुरंत पालन करें' },
          { id: 'fl-5', text: 'बिजली के खंभों और पानी में डूबे तारों से सुरक्षित दूरी बनाए रखें' }
        ]
      },
      CYCLONE: {
        title: 'चक्रवात आश्रय एवं तूफान सुरक्षा चेकलिस्ट',
        items: [
          { id: 'cy-1', text: 'पक्के मजबूत कमरे या नामित चक्रवात आश्रय में शरण लें' },
          { id: 'cy-2', text: 'कांच की खिड़कियों, दरवाजों और बाहरी दीवारों से दूर रहें' },
          { id: 'cy-3', text: 'घर के बाहर रखे ढीले सामान और टिन की चादरों को सुरक्षित बांधें' },
          { id: 'cy-4', text: 'टॉर्च, बैटरी, रेडियो और आवश्यक सामग्री तैयार रखें' },
          { id: 'cy-5', text: 'प्रशासन द्वारा दिए गए निर्देशों का गंभीरता से पालन करें' }
        ]
      },
      EARTHQUAKE: {
        title: 'भूकंप सुरक्षा एवं बचाव चेकलिस्ट',
        items: [
          { id: 'eq-1', text: 'झटकों के दौरान झुकें, सिर ढकें और मेज को पकड़ें (Drop, Cover, Hold)' },
          { id: 'eq-2', text: 'खिड़कियों, अलमारियों और भारी सामान से दूर रहें' },
          { id: 'eq-3', text: 'झटके रुकने के बाद सावधानीपूर्वक खुले स्थान पर जाएं' },
          { id: 'eq-4', text: 'क्षतिग्रस्त इमारतों और दरार पड़ी दीवारों के पास न जाएं' },
          { id: 'eq-5', text: 'आफ्टरशॉक्स के लिए तैयार रहें और आधिकारिक सूचनाएं सुनें' }
        ]
      },
      FIRE: {
        title: 'आग से बचाव एवं निकासी चेकलिस्ट',
        items: [
          { id: 'fr-1', text: 'आपातकालीन सीढ़ियों से तुरंत बाहर निकलें (लिफ्ट का उपयोग कभी न करें)' },
          { id: 'fr-2', text: 'धुएं से बचने के लिए ज़मीन के पास झुककर चलें' },
          { id: 'fr-3', text: 'दरवाजा खोलने से पहले हाथ के पिछले हिस्से से छूकर गर्मी जांचें' },
          { id: 'fr-4', text: 'नामित सुरक्षित खुले स्थान पर एकत्रित हों' },
          { id: 'fr-5', text: '112 या 101 पर कॉल कर अग्निशमन दल को सूचित करें' }
        ]
      },
      LANDSLIDE: {
        title: 'भूस्खलन चेतावनी एवं निकासी चेकलिस्ट',
        items: [
          { id: 'ls-1', text: 'पहाड़ी ढलानों और प्राकृतिक बहाव नालों से तुरंत दूर जाएं' },
          { id: 'ls-2', text: 'पत्थर गिरने, दरारें पड़ने या मलबे के बहाव की आवाज़ों पर ध्यान दें' },
          { id: 'ls-3', text: 'मजबूत चट्टान या ठोस धरातल पर स्थित आश्रय में जाएं' },
          { id: 'ls-4', text: 'नदी घाटियों और निचले जलमार्गों के पास खड़े न हों' },
          { id: 'ls-5', text: 'भूस्खलन की सूचना तुरंत आपातकालीन प्रशासन को दें' }
        ]
      },
      GENERAL: {
        title: 'सामान्य आपदा तैयारी चेकलिस्ट',
        items: [
          { id: 'gn-1', text: 'अपने निकटतम सरकारी राहत शिविर का पता जानें' },
          { id: 'gn-2', text: 'मोबाइल फोन और पावर बैंक को हमेशा पूरी तरह चार्ज रखें' },
          { id: 'gn-3', text: 'कम से कम 3 दिन का पीने का पानी और जरूरी दवाइयां रखें' },
          { id: 'gn-4', text: 'आपातकालीन नकदी और पहचान पत्र वाटरप्रूफ पाउच में रखें' },
          { id: 'gn-5', text: 'सुरक्षा ऐप पर आधिकारिक अलर्ट और सलाह नियमित रूप से देखें' }
        ]
      }
    }
  }
};
