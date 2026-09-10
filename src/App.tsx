import { db, isFirebaseConfigured } from './lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState, useEffect, useCallback } from 'react';
import {
  LocationCoordinates,
  WeatherData,
  RiskAnalysis,
  EmergencyAlert,
  Shelter,
  SaferRoute,
  SosRequest,
  RescueTeam,
  DisasterResource,
  SatelliteData,
  SimulationScenario,
  UserProfile,
  AuthorityProfile,
  SyncStatus
} from './types';
import { LanguageCode, TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { EntryScreen } from './components/EntryScreen';
import { LocationSelector } from './components/LocationSelector';
import { RiskCard } from './components/RiskCard';
import { WeatherCard } from './components/WeatherCard';
import { EmergencyBanner } from './components/EmergencyBanner';
import { EmergencyScreen } from './components/EmergencyScreen';
import { SafetyGuide } from './components/SafetyGuide';
import { ShelterFinder } from './components/ShelterFinder';
import { SaferRouteView } from './components/SaferRouteView';
import { SosModal } from './components/SosModal';
import { SosTracker } from './components/SosTracker';
import { InteractiveMap } from './components/InteractiveMap';
import { PublicAuthModal } from './components/PublicAuthModal';
import { AuthorityAuthModal } from './components/AuthorityAuthModal';
import { subscribeToAuthChanges, logoutCitizen } from './lib/firebaseAuth';

// Detail & Secondary Views (with production-grade back navigation)
import { AlertDetailView } from './components/AlertDetailView';
import { ShelterDetailView } from './components/ShelterDetailView';
import { SosDetailView } from './components/SosDetailView';
import { WeatherDetailView } from './components/WeatherDetailView';
import { RiskDetailView } from './components/RiskDetailView';
import { SafetyDetailView } from './components/SafetyDetailView';
import { SettingsView } from './components/SettingsView';
import { BackButton } from './components/BackButton';
import { GeminiChatModal, AssistantRoleId } from './components/GeminiChatModal';

// Authority Components
import { AuthorityLayout } from './components/Authority/AuthorityLayout';
import { CommandCenterHome } from './components/Authority/CommandCenterHome';
import { AlertManagement } from './components/Authority/AlertManagement';
import { SosDesk } from './components/Authority/SosDesk';
import { RescueTeamsManager } from './components/Authority/RescueTeamsManager';
import { SheltersManager } from './components/Authority/SheltersManager';
import { ResourcesManager } from './components/Authority/ResourcesManager';
import { SatelliteIntelligence } from './components/Authority/SatelliteIntelligence';
import { SimulationControl } from './components/Authority/SimulationControl';
import { HistoricalArchive } from './components/Authority/HistoricalArchive';
import { AnalyticsView } from './components/Authority/AnalyticsView';
import { AuditLogsView } from './components/Authority/AuditLogsView';

import {
  Home,
  AlertTriangle,
  Compass,
  Navigation,
  LifeBuoy,
  RefreshCw,
  PhoneCall,
  Shield,
  Bot,
  Sparkles
} from 'lucide-react';

export type ActiveView =
  | { type: 'ROOT' }
  | { type: 'ALERT_DETAIL'; alertId: string; fromContext?: string }
  | { type: 'SHELTER_DETAIL'; shelterId: string; fromContext?: string }
  | { type: 'SOS_DETAIL'; sosId: string; fromContext?: string }
  | { type: 'WEATHER_DETAIL'; fromContext?: string }
  | { type: 'RISK_DETAIL'; fromContext?: string }
  | { type: 'SAFETY_DETAIL'; fromContext?: string }
  | { type: 'SETTINGS'; fromContext?: string };

export function App() {
  // Navigation & Role State
  const [role, setRole] = useState<'ENTRY' | 'PUBLIC_AUTH' | 'PUBLIC' | 'AUTHORITY'>('ENTRY');
  const [publicTab, setPublicTab] = useState<'HOME' | 'ALERTS' | 'SHELTER' | 'ROUTE' | 'SOS'>('HOME');
  const [authorityTab, setAuthorityTab] = useState<string>('overview');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('suraksha_language') || localStorage.getItem('suraksha_lang');
      if (saved === 'en' || saved === 'te' || saved === 'hi') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });
  const [isEmergencyScreenOpen, setIsEmergencyScreenOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'ROOT' });

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('suraksha_language', lang);
      localStorage.setItem('suraksha_lang', lang);
    } catch {
      // ignore
    }
  };

  // Authentication State
  const [publicUser, setPublicUser] = useState<UserProfile | null>(() => {
    try {
      const storedUser = localStorage.getItem('suraksha_user');
      const storedToken = localStorage.getItem('suraksha_token');
      if (storedUser && storedToken) {
        return JSON.parse(storedUser);
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [authorityUser, setAuthorityUser] = useState<AuthorityProfile | null>(null);
  const [authToken, setAuthToken] = useState<string>(() => {
    return localStorage.getItem('suraksha_auth_token') || localStorage.getItem('suraksha_token') || '';
  });
  const [isPublicAuthOpen, setIsPublicAuthOpen] = useState(false);
  const [isAuthorityAuthOpen, setIsAuthorityAuthOpen] = useState(false);

  // Modals & Active Selections
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [activeSos, setActiveSos] = useState<SosRequest | null>(null);
  const [selectedSosForTriage, setSelectedSosForTriage] = useState<SosRequest | null>(null);

  // Gemini AI Chatbot State
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatInitialRole, setChatInitialRole] = useState<AssistantRoleId>('disaster_survival');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);

  // Geolocation & Network
  const [userLocation, setUserLocation] = useState<LocationCoordinates>({
    latitude: 17.7121,
    longitude: 83.3245,
    accuracy: 15,
    timestamp: Date.now(),
    cityName: 'Visakhapatnam',
    areaName: 'Beach Road / Coastal Sector',
    source: 'SEARCHED_MANUAL'
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Disaster Domain Data
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [risk, setRisk] = useState<RiskAnalysis | null>(null);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [saferRoute, setSaferRoute] = useState<SaferRoute | null>(null);
  const [sosRequests, setSosRequests] = useState<SosRequest[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([]);
  const [resources, setResources] = useState<DisasterResource[]>([]);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('NORMAL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('ONLINE');

  // Flush offline queued SOS requests when link returns
  const flushOfflineSosQueue = useCallback(async () => {
    const rawQueue = localStorage.getItem('suraksha_offline_sos_queue');
    if (!rawQueue) return;
    try {
      const offlineQueue: SosRequest[] = JSON.parse(rawQueue);
      if (!Array.isArray(offlineQueue) || offlineQueue.length === 0) return;

      setSyncStatus('SYNCING');
      const remaining: SosRequest[] = [];

      for (const sos of offlineQueue) {
        try {
          const res = await fetch('/api/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...sos,
              status: 'RECEIVED'
            })
          });
          if (!res.ok) {
            remaining.push(sos);
          } else {
            const confirmedSos: SosRequest = await res.json();
            setActiveSos(confirmedSos);
            localStorage.setItem('suraksha_active_sos', JSON.stringify(confirmedSos));
          }
        } catch {
          remaining.push(sos);
        }
      }

      if (remaining.length > 0) {
        localStorage.setItem('suraksha_offline_sos_queue', JSON.stringify(remaining));
      } else {
        localStorage.removeItem('suraksha_offline_sos_queue');
      }
      setSyncStatus('ONLINE');
    } catch (e) {
      console.error('Error flushing offline SOS queue:', e);
      setSyncStatus('OFFLINE');
    }
  }, []);

  // Connectivity Listener & SOS Synchronization Polling
  useEffect(() => {
    let isMounted = true;

    const checkSyncStatus = async () => {
      if (!navigator.onLine) {
        if (isMounted) {
          setIsOnline(false);
          setSyncStatus('OFFLINE');
        }
        return;
      }
      try {
        const res = await fetch('/api/sync/status');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsOnline(true);
            setSyncStatus(data.status || 'ONLINE');
          }
          const rawQueue = localStorage.getItem('suraksha_offline_sos_queue');
          if (rawQueue) {
            const parsed = JSON.parse(rawQueue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              await flushOfflineSosQueue();
            }
          }
        } else {
          if (isMounted) setSyncStatus('OFFLINE');
        }
      } catch {
        if (isMounted) setSyncStatus('OFFLINE');
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      checkSyncStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkSyncStatus();
    const interval = setInterval(checkSyncStatus, 20000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushOfflineSosQueue]);

  // History synchronized navigation handlers
  const navigateToView = useCallback((newView: ActiveView) => {
    try {
      window.history.pushState({
        role,
        publicTab,
        authorityTab,
        view: newView
      }, '');
    } catch {
      // In restricted iframe environments
    }
    setActiveView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [role, publicTab, authorityTab]);

  const handleGoBack = useCallback(() => {
    if (window.history.state && window.history.state.view && window.history.state.view.type !== 'ROOT') {
      window.history.back();
    } else {
      setActiveView({ type: 'ROOT' });
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        setActiveView(event.state.view);
        if (event.state.publicTab) setPublicTab(event.state.publicTab);
        if (event.state.role) {
          if (event.state.role === 'PUBLIC' && !localStorage.getItem('suraksha_user')) {
            setRole('PUBLIC_AUTH');
          } else {
            setRole(event.state.role);
          }
        }
      } else {
        setActiveView({ type: 'ROOT' });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectPublicTab = (tab: 'HOME' | 'ALERTS' | 'SHELTER' | 'ROUTE') => {
    setPublicTab(tab);
    setActiveView({ type: 'ROOT' });
    setIsEmergencyScreenOpen(false);
    try {
      window.history.replaceState({
        role: 'PUBLIC',
        publicTab: tab,
        view: { type: 'ROOT' }
      }, '');
    } catch {
      // ignore
    }
  };

  // Safe JSON helper to prevent HTML response parse errors
  const safeJson = async <T,>(res: Response): Promise<T | null> => {
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }
    try {
      return (await res.json()) as T;
    } catch {
      return null;
    }
  };

  // Primary Data Fetcher
  const loadDomainData = useCallback(async () => {
    try {
      // 1. Weather
      const weatherRes = await fetch(`/api/weather?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
      const weatherData = await safeJson<WeatherData>(weatherRes);
      if (weatherData) setWeather(weatherData);

      // 2. Risk
      const riskRes = await fetch(`/api/risk?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
      const riskData = await safeJson<RiskAnalysis>(riskRes);
      if (riskData) setRisk(riskData);

      // 3. Alerts
      const alertsRes = await fetch(`/api/alerts?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
      const alertsData = await safeJson<EmergencyAlert[]>(alertsRes);
      if (alertsData) setAlerts(alertsData);

      // 4. Shelters
      const sheltersRes = await fetch(`/api/shelters?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
      const shelterList = await safeJson<Shelter[]>(sheltersRes);
      if (shelterList) {
        setShelters(shelterList);

        // Fetch safer route to nearest shelter
        if (shelterList.length > 0) {
          const routeRes = await fetch(
            `/api/routes/safer?originLat=${userLocation.latitude}&originLng=${userLocation.longitude}&shelterId=${shelterList[0].id}`
          );
          const routeData = await safeJson<SaferRoute>(routeRes);
          if (routeData) setSaferRoute(routeData);
        }
      }

      // 5. SOS
      const sosHeaders: HeadersInit = {};
      if (authToken) {
        sosHeaders['Authorization'] = `Bearer ${authToken}`;
      }
      const sosRes = await fetch('/api/sos', { headers: sosHeaders });
      const sosList = await safeJson<SosRequest[]>(sosRes);
      if (sosList) {
        setSosRequests(sosList);
        // If active SOS exists for this session/user, update it
        setActiveSos((prev: SosRequest | null) => {
          if (prev) {
            const found = sosList.find((s: SosRequest) => s.id === prev.id);
            if (found && JSON.stringify(found) !== JSON.stringify(prev)) return found;
          }
          return prev;
        });
      }

      // 6. Rescue Teams
      const teamsRes = await fetch('/api/rescue-teams');
      const teamsData = await safeJson<RescueTeam[]>(teamsRes);
      if (teamsData) setRescueTeams(teamsData);

      // 7. Resources
      const resRes = await fetch('/api/resources');
      const resData = await safeJson<DisasterResource[]>(resRes);
      if (resData) setResources(resData);

      // 8. Satellite Data
      const satRes = await fetch('/api/satellite');
      const satData = await safeJson<SatelliteData>(satRes);
      if (satData) setSatelliteData(satData);

      // 9. Simulation State
      const simRes = await fetch('/api/simulation');
      const simData = await safeJson<{ currentScenario: SimulationScenario; isActive: boolean }>(simRes);
      if (simData) {
        setSimulationScenario(simData.currentScenario);
        setIsSimulating(simData.isActive);
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation.latitude, userLocation.longitude, authToken]);

  useEffect(() => {
    loadDomainData();
  }, [loadDomainData]);

  
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    let sosQuery: any = collection(db, 'sosIncidents');
    if (role !== 'AUTHORITY') {
      if (!publicUser?.id) return;
      sosQuery = query(collection(db, 'sosIncidents'), where('userId', '==', publicUser.id));
    }

    const unsubSos = onSnapshot(sosQuery, 
      (snap: any) => {
        const list = snap.docs.map((d: any) => d.data() as SosRequest);
        list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSosRequests(list);
        
        const stored = localStorage.getItem('suraksha_active_sos');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const found = list.find((s: any) => s.id === parsed.id);
            if (found) {
              setActiveSos(found);
              localStorage.setItem('suraksha_active_sos', JSON.stringify(found));
            }
          } catch(e) {}
        }
      },
      (error: any) => {
        console.error('Firestore SOS listener error. Permission denied or missing index:', error);
      }
    );

    const unsubAlerts = onSnapshot(collection(db, 'emergencyAlerts'), 
      (snap: any) => {
        const list = snap.docs.map((d: any) => d.data() as EmergencyAlert);
        list.sort((a: any, b: any) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
        setAlerts(list);
      },
      (error: any) => {
        console.error('Firestore Alerts listener error:', error);
      }
    );

    return () => {
      unsubSos();
      unsubAlerts();
    };
  }, [role, publicUser?.id]);



  // Handle Target Shelter selection for routing
  const handleSelectShelterForRoute = async (shelter: Shelter) => {
    try {
      const routeRes = await fetch(
        `/api/routes/safer?originLat=${userLocation.latitude}&originLng=${userLocation.longitude}&shelterId=${shelter.id}`
      );
      const routeData = await safeJson<SaferRoute>(routeRes);
      if (routeData) {
        setSaferRoute(routeData);
        setPublicTab('ROUTE');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Persistent Auth Session & Firebase onAuthStateChanged subscription
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user, token) => {
      if (user && token) {
        setPublicUser(user);
        setAuthToken(token);
      } else {
        setPublicUser(null);
        setAuthToken('');
      }
    });

    // Check authority session if stored
    const authAdminToken = localStorage.getItem('suraksha_auth_token');
    if (authAdminToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authAdminToken}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && (data.role === 'AUTHORITY' || data.role === 'ADMIN')) {
            setAuthorityUser(data);
            setAuthToken(authAdminToken);
          } else {
            localStorage.removeItem('suraksha_auth_token');
          }
        })
        .catch(() => {});
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Strict route protection: unauthenticated attempts to access PUBLIC routes redirect to Login
  useEffect(() => {
    if (role === 'PUBLIC' && !publicUser) {
      setRole('PUBLIC_AUTH');
    }
  }, [role, publicUser]);

  // Auth Handlers
  const handlePublicLoginSuccess = (user: UserProfile, token: string) => {
    setPublicUser(user);
    setAuthToken(token);
    setIsPublicAuthOpen(false);
    setActiveView({ type: 'ROOT' });
    setPublicTab('HOME');
    setIsEmergencyScreenOpen(false);
    setIsSosModalOpen(false);
    setRole('PUBLIC');
  };

  const handleAuthorityLoginSuccess = (auth: AuthorityProfile, token: string) => {
    setAuthorityUser(auth);
    setAuthToken(token);
    setIsAuthorityAuthOpen(false);
    setActiveView({ type: 'ROOT' });
    setRole('AUTHORITY');
  };

  const handleLogout = async () => {
    await logoutCitizen();
    setPublicUser(null);
    setAuthorityUser(null);
    setAuthToken('');
    localStorage.removeItem('suraksha_token');
    localStorage.removeItem('suraksha_user');
    localStorage.removeItem('suraksha_auth_token');
    setActiveView({ type: 'ROOT' });
    setPublicTab('HOME');
    setIsSosModalOpen(false);
    setIsEmergencyScreenOpen(false);
    setRole('PUBLIC_AUTH');
  };

  const handleOpenSosModal = () => {
    if (!publicUser) {
      setActiveView({ type: 'ROOT' });
      setRole('PUBLIC_AUTH');
      return;
    }
    setIsSosModalOpen(true);
  };

  // Translations
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const activeAlert = alerts.find((a) => a.status === 'ACTIVE');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-200">
      {/* Universal Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        publicUser={publicUser}
        authorityUser={authorityUser}
        onOpenPublicAuth={() => {
          setActiveView({ type: 'ROOT' });
          if (publicUser) {
            setPublicTab('HOME');
            setRole('PUBLIC');
          } else {
            setRole('PUBLIC_AUTH');
          }
        }}
        onOpenAuthorityAuth={() => setIsAuthorityAuthOpen(true)}
        onLogout={handleLogout}
        isOnline={isOnline}
        syncStatus={syncStatus}
        activeRole={role}
        onNavigateHome={() => {
          setActiveView({ type: 'ROOT' });
          if (role === 'PUBLIC' && publicUser) {
            setPublicTab('HOME');
          } else if (role === 'AUTHORITY' && authorityUser) {
            setAuthorityTab('overview');
          } else {
            setRole('ENTRY');
          }
        }}
        onOpenSettings={() => navigateToView({ type: 'SETTINGS', fromContext: role === 'PUBLIC' ? publicTab : 'Home' })}
        onOpenChatbot={() => {
          setChatInitialPrompt(undefined);
          setIsChatModalOpen(true);
        }}
      />

      {/* Global Simulation Exercise Banner */}
      {isSimulating && (
        <div className="bg-purple-900 text-white text-xs py-1 px-4 text-center font-bold tracking-wider uppercase flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-300 animate-ping"></span>
          <span>SIMULATION DRILL ACTIVE: {simulationScenario} &bull; DATA AND DRILLS ARE FOR EXERCISE PURPOSES</span>
        </div>
      )}

      {/* VIEW 1: ENTRY SCREEN */}
      {role === 'ENTRY' && (
        <main className="flex-1">
          {activeView.type === 'SETTINGS' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <SettingsView
                onBack={handleGoBack}
                backLabel="Entry Portal"
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
                userLocation={userLocation}
                onLocationChange={(loc) => {
                  setUserLocation(loc);
                  loadDomainData();
                }}
              />
            </div>
          ) : (
            <EntryScreen
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              onSelectPublic={() => {
                setActiveView({ type: 'ROOT' });
                if (publicUser) {
                  setPublicTab('HOME');
                  setRole('PUBLIC');
                } else {
                  setRole('PUBLIC_AUTH');
                }
              }}
              onSelectAuthority={() => {
                setActiveView({ type: 'ROOT' });
                if (authorityUser) setRole('AUTHORITY');
                else setIsAuthorityAuthOpen(true);
              }}
              onOpenHelpline={() => navigateToView({ type: 'SAFETY_DETAIL', fromContext: 'Entry Portal' })}
              onOpenPublicAuth={() => {
                setActiveView({ type: 'ROOT' });
                if (publicUser) {
                  setPublicTab('HOME');
                  setRole('PUBLIC');
                } else {
                  setRole('PUBLIC_AUTH');
                }
              }}
            />
          )}
        </main>
      )}

      {/* VIEW 2: CITIZEN VERIFICATION / LOGIN */}
      {role === 'PUBLIC_AUTH' && (
        <main className="flex-1 flex flex-col justify-center">
          <PublicAuthModal
            isOpen={true}
            isPage={true}
            onClose={() => {
              setActiveView({ type: 'ROOT' });
              setRole('ENTRY');
            }}
            onLoginSuccess={handlePublicLoginSuccess}
            fromPageLabel="Entry Portal"
            language={currentLanguage}
          />
        </main>
      )}

      {/* VIEW 3: CITIZEN PUBLIC PORTAL (AUTHENTICATED ONLY) */}
      {role === 'PUBLIC' && (
        !publicUser ? (
          <main className="flex-1 flex flex-col justify-center">
            <PublicAuthModal
              isOpen={true}
              isPage={true}
              onClose={() => {
                setActiveView({ type: 'ROOT' });
                setRole('ENTRY');
              }}
              onLoginSuccess={handlePublicLoginSuccess}
              fromPageLabel="Entry Portal"
              language={currentLanguage}
            />
          </main>
        ) : (
          <div className="flex-1 flex flex-col pb-20 sm:pb-8">
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* If secondary detail view is active */}
            {activeView.type !== 'ROOT' ? (
              <div className="space-y-6">
                {activeView.type === 'ALERT_DETAIL' && (() => {
                  const selectedAlert = alerts.find(a => a.id === activeView.alertId) || activeAlert || alerts[0];
                  const recShelter = shelters.find(s => s.id === selectedAlert?.recommendedShelterId) || shelters[0];
                  if (!selectedAlert) return null;
                  return (
                    <AlertDetailView
                      alert={selectedAlert}
                      onBack={handleGoBack}
                      backLabel={activeView.fromContext || 'Alerts'}
                      recommendedShelter={recShelter}
                      onSelectShelter={(shelter) => navigateToView({ type: 'SHELTER_DETAIL', shelterId: shelter.id, fromContext: selectedAlert.title })}
                      onStartRouteToShelter={(shelter) => {
                        handleSelectShelterForRoute(shelter);
                        handleSelectPublicTab('ROUTE');
                      }}
                    />
                  );
                })()}

                {activeView.type === 'SHELTER_DETAIL' && (() => {
                  const selectedShelter = shelters.find(s => s.id === activeView.shelterId) || shelters[0];
                  if (!selectedShelter) return null;
                  return (
                    <ShelterDetailView
                      shelter={selectedShelter}
                      onBack={handleGoBack}
                      backLabel={activeView.fromContext || 'Shelters'}
                      onNavigateRoute={(shelter) => {
                        handleSelectShelterForRoute(shelter);
                        handleSelectPublicTab('ROUTE');
                      }}
                    />
                  );
                })()}

                {activeView.type === 'SOS_DETAIL' && (() => {
                  const targetSos = sosRequests.find(s => s.id === activeView.sosId) || activeSos || sosRequests[0];
                  if (!targetSos) return null;
                  return (
                    <SosDetailView
                      sos={targetSos}
                      onBack={handleGoBack}
                      backLabel={activeView.fromContext || 'Emergency Desk'}
                      onRefresh={loadDomainData}
                    />
                  );
                })()}

                {activeView.type === 'WEATHER_DETAIL' && weather && (
                  <WeatherDetailView
                    weather={weather}
                    onBack={handleGoBack}
                    backLabel={activeView.fromContext || 'Dashboard'}
                    onRefresh={loadDomainData}
                  />
                )}

                {activeView.type === 'RISK_DETAIL' && risk && (
                  <RiskDetailView
                    risk={risk}
                    onBack={handleGoBack}
                    backLabel={activeView.fromContext || 'Dashboard'}
                    onNavigateToShelters={() => {
                      handleSelectPublicTab('SHELTER');
                    }}
                  />
                )}

                {activeView.type === 'SAFETY_DETAIL' && (
                  <SafetyDetailView
                    onBack={handleGoBack}
                    backLabel={activeView.fromContext || 'Home'}
                    onOpenChatbot={(prompt, role) => {
                      if (role) setChatInitialRole(role);
                      if (prompt) setChatInitialPrompt(prompt);
                      setIsChatModalOpen(true);
                    }}
                  />
                )}

                {activeView.type === 'SETTINGS' && (
                  <SettingsView
                    onBack={handleGoBack}
                    backLabel={activeView.fromContext || 'Back'}
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                    userLocation={userLocation}
                    onLocationChange={(loc) => {
                      setUserLocation(loc);
                      loadDomainData();
                    }}
                  />
                )}
              </div>
            ) : isEmergencyScreenOpen && activeAlert ? (
              <EmergencyScreen
                alert={activeAlert}
                shelter={shelters[0]}
                userLocation={userLocation}
                onNavigateToRoute={() => {
                  setIsEmergencyScreenOpen(false);
                  handleSelectPublicTab('ROUTE');
                }}
                onNavigateToShelters={() => {
                  setIsEmergencyScreenOpen(false);
                  handleSelectPublicTab('SHELTER');
                }}
                onOpenSos={() => {
                  setIsEmergencyScreenOpen(false);
                  handleOpenSosModal();
                }}
                onBack={() => setIsEmergencyScreenOpen(false)}
              />
            ) : (
              <>
                {/* Geolocation selector & accuracy pill */}
                <LocationSelector
                  currentLocation={userLocation}
                  onLocationChange={setUserLocation}
                />

                {/* Active Emergency Alert Banner (Shown on all tabs if within geofence) */}
                {activeAlert && (
                  <EmergencyBanner
                    activeAlert={activeAlert}
                    onOpenEmergencyView={() => navigateToView({ type: 'ALERT_DETAIL', alertId: activeAlert.id, fromContext: 'Dashboard' })}
                    language={currentLanguage}
                  />
                )}

                {/* Active SOS Tracker Card if citizen requested SOS */}
                {activeSos && (
                  <SosTracker
                    sos={activeSos}
                    onRefresh={loadDomainData}
                    onInspectDetail={() => navigateToView({ type: 'SOS_DETAIL', sosId: activeSos.id, fromContext: 'Incident Desk' })}
                  />
                )}

                {/* Navigation Pills on Desktop */}
                <div className="hidden sm:flex items-center gap-2 border-b border-slate-200 pb-3">
                  <button
                    onClick={() => handleSelectPublicTab('HOME')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      publicTab === 'HOME'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t.home}
                  </button>
                  <button
                    onClick={() => handleSelectPublicTab('ALERTS')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      publicTab === 'ALERTS'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t.activeAlerts} ({alerts.length})
                  </button>
                  <button
                    onClick={() => handleSelectPublicTab('SHELTER')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      publicTab === 'SHELTER'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t.designatedShelters} ({shelters.length})
                  </button>
                  <button
                    onClick={() => handleSelectPublicTab('ROUTE')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      publicTab === 'ROUTE'
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t.saferRouteBtn}
                  </button>
                  <button
                    onClick={handleOpenSosModal}
                    className="ml-auto px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-lg transition-colors shadow-2xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <LifeBuoy size={14} />
                    <span>{t.requestSosBtn}</span>
                  </button>
                </div>

                {/* TAB 1: HOME (Dashboard) */}
                {publicTab === 'HOME' && (
                  <div className="space-y-6">
                    {/* Emergency SOS & Distress Assistance Feature Card */}
                    <div className="bg-gradient-to-r from-rose-900 to-rose-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-rose-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 bg-rose-800/80 rounded-xl text-rose-200">
                            <LifeBuoy size={22} className="animate-pulse" />
                          </span>
                          <div>
                            <h3 className="text-base font-bold text-white font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                              Emergency SOS & Distress Assistance
                            </h3>
                            <span className="text-[11px] font-semibold text-rose-300">
                              Direct Priority Link to Disaster Response Command
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-rose-200 max-w-xl leading-relaxed pt-1">
                          Trapped by rising flood water, facing immediate medical emergency, or need structural rescue? Trigger an instant GPS distress beacon with your live coordinates.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={handleOpenSosModal}
                          className="w-full sm:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <LifeBuoy size={16} />
                          <span>{t.requestSosBtn}</span>
                        </button>
                      </div>
                    </div>

                    {/* Risk & Weather Side-by-Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {risk ? (
                        <RiskCard
                          risk={risk}
                          onInspectDetails={() => navigateToView({ type: 'RISK_DETAIL', fromContext: 'Dashboard' })}
                          language={currentLanguage}
                        />
                      ) : (
                        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                          Computing Sector Risk...
                        </div>
                      )}

                      {weather ? (
                        <WeatherCard
                          weather={weather}
                          onInspectDetails={() => navigateToView({ type: 'WEATHER_DETAIL', fromContext: 'Dashboard' })}
                          language={currentLanguage}
                        />
                      ) : (
                        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                          Connecting to Meteorological Telemetry...
                        </div>
                      )}
                    </div>

                    {/* SURAKSHA Gemini Disaster AI Assistant Card */}
                    <div className="bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#edf0ea] border border-[#d8ded3] flex items-center justify-center text-[#5A5A40] shrink-0 mt-0.5">
                          <Bot size={22} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#434338] font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                              SURAKSHA AI Disaster & Emergency Assistant
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#edf0ea] text-[#5A5A40]">
                              Gemini 3
                            </span>
                          </div>
                          <p className="text-xs text-[#7a7a67] mt-1 leading-relaxed">
                            Multi-turn guidance for emergency first aid & CPR, flood/cyclone survival tactics, and NDMA relief schemes.
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            <button
                              type="button"
                              onClick={() => {
                                setChatInitialRole('first_aid');
                                setChatInitialPrompt('How do I perform hands-only CPR on an adult?');
                                setIsChatModalOpen(true);
                              }}
                              className="text-[11px] font-semibold px-2.5 py-1 bg-white border border-[#e8e4db] rounded-full text-[#5A5A40] hover:bg-[#f2f4ee] cursor-pointer transition-colors"
                            >
                              🩺 CPR & First Aid
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setChatInitialRole('disaster_survival');
                                setChatInitialPrompt('What emergency supplies belong in a 72-hour cyclone Go-Bag?');
                                setIsChatModalOpen(true);
                              }}
                              className="text-[11px] font-semibold px-2.5 py-1 bg-white border border-[#e8e4db] rounded-full text-[#5A5A40] hover:bg-[#f2f4ee] cursor-pointer transition-colors"
                            >
                              🌪️ 72h Cyclone Go-Bag
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setChatInitialRole('civil_protection');
                                setChatInitialPrompt('What documents do I need to claim SDRF flood damage relief?');
                                setIsChatModalOpen(true);
                              }}
                              className="text-[11px] font-semibold px-2.5 py-1 bg-white border border-[#e8e4db] rounded-full text-[#5A5A40] hover:bg-[#f2f4ee] cursor-pointer transition-colors"
                            >
                              🏛️ NDMA & SDRF Claims
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setChatInitialPrompt(undefined);
                          setIsChatModalOpen(true);
                        }}
                        className="w-full md:w-auto px-4 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <Bot size={15} />
                        <span>Start Multi-Turn Chat</span>
                      </button>
                    </div>

                    {/* Interactive GIS Sector Map */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Sector Disaster Safety & Evacuation Map
                          </h3>
                          <p className="text-xs text-slate-500">
                            Live visualization of current position, flood geofence, relief shelters, and high-ground routes.
                          </p>
                        </div>
                        <button
                          onClick={loadDomainData}
                          className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50"
                          title="Refresh Telemetry"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>

                      <InteractiveMap
                        userLocation={userLocation}
                        shelters={shelters}
                        activeAlert={activeAlert || null}
                        saferRoute={saferRoute}
                        heightClass="h-72 sm:h-96"
                        language={currentLanguage}
                      />
                    </div>

                    {/* Official Multi-Lingual Safety Guides & Evacuation Checklists */}
                    <SafetyGuide
                      language={currentLanguage}
                      activeAlert={activeAlert}
                      onOpenFullGuide={() => navigateToView({ type: 'SAFETY_DETAIL', fromContext: 'Dashboard' })}
                    />
                  </div>
                )}

                {/* TAB 2: ALERTS */}
                {publicTab === 'ALERTS' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <BackButton onClick={() => handleSelectPublicTab('HOME')} label="Home" />
                        <h2 className="text-lg font-bold text-slate-900">
                          {t.activeAlerts} & Official Advisories
                        </h2>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {alerts.length} Warnings Published
                      </span>
                    </div>

                    <div className="space-y-3">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl p-5 shadow-2xs space-y-3 cursor-pointer"
                          onClick={() => navigateToView({ type: 'ALERT_DETAIL', alertId: alert.id, fromContext: 'Alerts' })}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold text-rose-700">
                              {alert.id} &bull; {alert.disasterType}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase ${
                                alert.severity === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-900'
                                  : alert.severity === 'HIGH'
                                  ? 'bg-orange-100 text-orange-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {alert.severity} SEVERITY
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900">
                            {alert.title}
                          </h3>

                          <p className="text-xs text-slate-700 leading-relaxed">
                            {alert.message}
                          </p>

                          <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-100">
                            <div><strong>Affected Zone:</strong> {alert.affectedArea} ({alert.radiusKm} km radius)</div>
                            <div><strong>Direct Action:</strong> {alert.recommendedAction}</div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Issued by {alert.authorityName}</span>
                            <span className="text-rose-700 hover:text-rose-800 font-bold underline cursor-pointer">
                              Open Action Plan &rarr;
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: SHELTERS */}
                {publicTab === 'SHELTER' && (
                  <ShelterFinder
                    shelters={shelters}
                    userLocation={userLocation}
                    onSelectShelterForRoute={handleSelectShelterForRoute}
                    onSelectShelterDetail={(shelter) => navigateToView({ type: 'SHELTER_DETAIL', shelterId: shelter.id, fromContext: 'Shelters' })}
                    onBack={() => handleSelectPublicTab('HOME')}
                    backLabel="Home"
                  />
                )}

                {/* TAB 4: SAFER ROUTE */}
                {publicTab === 'ROUTE' && (
                  saferRoute ? (
                    <SaferRouteView
                      route={saferRoute}
                      userLocation={userLocation}
                      onChangeDestination={() => handleSelectPublicTab('SHELTER')}
                      onBack={() => handleSelectPublicTab('SHELTER')}
                      backLabel="Shelters"
                    />
                  ) : (
                    <div className="p-12 bg-white border border-slate-200 rounded-xl text-center space-y-3">
                      <div className="flex justify-start">
                        <BackButton onClick={() => handleSelectPublicTab('HOME')} label="Home" />
                      </div>
                      <Compass size={32} className="mx-auto text-slate-300" />
                      <h3 className="text-sm font-bold text-slate-800">
                        Calculating Safer Evacuation Path
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Evaluating elevation layers, flood barrier status, and underpass risks to nearest shelter...
                      </p>
                    </div>
                  )
                )}
              </>
            )}
          </main>

          {/* Mobile Bottom Navigation Bar (5 Items) */}
          <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg flex items-center justify-around h-16 px-1">
            <button
              onClick={() => handleSelectPublicTab('HOME')}
              className={`flex flex-col items-center justify-center flex-1 py-1 ${
                publicTab === 'HOME' && activeView.type === 'ROOT' && !isEmergencyScreenOpen ? 'text-amber-800 font-bold' : 'text-slate-500'
              }`}
            >
              <Home size={18} />
              <span className="text-[10px] mt-0.5">{t.home}</span>
            </button>

            <button
              onClick={() => handleSelectPublicTab('ALERTS')}
              className={`flex flex-col items-center justify-center flex-1 py-1 ${
                publicTab === 'ALERTS' && activeView.type === 'ROOT' ? 'text-amber-800 font-bold' : 'text-slate-500'
              }`}
            >
              <AlertTriangle size={18} />
              <span className="text-[10px] mt-0.5">{t.activeAlerts}</span>
            </button>

            <button
              onClick={() => handleSelectPublicTab('SHELTER')}
              className={`flex flex-col items-center justify-center flex-1 py-1 ${
                publicTab === 'SHELTER' && activeView.type === 'ROOT' ? 'text-amber-800 font-bold' : 'text-slate-500'
              }`}
            >
              <Shield size={18} />
              <span className="text-[10px] mt-0.5">{t.designatedShelters}</span>
            </button>

            <button
              onClick={() => handleSelectPublicTab('ROUTE')}
              className={`flex flex-col items-center justify-center flex-1 py-1 ${
                publicTab === 'ROUTE' && activeView.type === 'ROOT' ? 'text-amber-800 font-bold' : 'text-slate-500'
              }`}
            >
              <Navigation size={18} />
              <span className="text-[10px] mt-0.5">{t.saferRouteBtn}</span>
            </button>

            <button
              onClick={handleOpenSosModal}
              className="flex flex-col items-center justify-center flex-1 py-1 text-rose-700 font-bold"
            >
              <LifeBuoy size={18} className="animate-pulse" />
              <span className="text-[10px] mt-0.5">{t.requestSosBtn}</span>
            </button>
          </nav>
        </div>
        )
      )}

      {/* VIEW 3: AUTHORITY COMMAND CENTER */}
      {role === 'AUTHORITY' && authorityUser && (
        <AuthorityLayout
          authority={authorityUser}
          alerts={alerts}
          sosRequests={sosRequests}
          teams={rescueTeams}
          isSimulating={isSimulating}
          activeTab={authorityTab}
          onSelectTab={setAuthorityTab}
          onLogout={handleLogout}
          onSwitchToPublic={() => {
            setActiveView({ type: 'ROOT' });
            if (publicUser) {
              setPublicTab('HOME');
              setRole('PUBLIC');
            } else {
              setRole('PUBLIC_AUTH');
            }
          }}
        >
          {authorityTab === 'overview' && (
            <CommandCenterHome
              alerts={alerts}
              sosRequests={sosRequests}
              shelters={shelters}
              teams={rescueTeams}
              resources={resources}
              weather={weather || {
                temperature: 28.5,
                feelsLike: 31.0,
                condition: 'Monsoon Showers',
                rainfallMm: 42.0,
                rainfallIntensity: 'HEAVY',
                rainProbability: 85,
                humidity: 92,
                windSpeedKmH: 48,
                windDirection: 'ESE',
                timestamp: Date.now(),
                freshness: 'LIVE',
                stationName: 'Visakhapatnam Cyclone Warning Centre'
              }}
              userLocation={userLocation}
              onNavigateTab={setAuthorityTab}
              onSelectSosForTriage={(sos) => {
                setSelectedSosForTriage(sos);
                setAuthorityTab('sos');
              }}
            />
          )}

          {authorityTab === 'alerts' && (
            <AlertManagement
              alerts={alerts}
              shelters={shelters}
              authToken={authToken}
              onAlertCreated={(newAlert) => {
                setAlerts([newAlert, ...alerts]);
              }}
              onRefreshAlerts={loadDomainData}
            />
          )}

          {authorityTab === 'sos' && (
            <SosDesk
              sosRequests={sosRequests}
              rescueTeams={rescueTeams}
              authToken={authToken}
              onSosUpdated={loadDomainData}
              selectedSosForTriage={selectedSosForTriage}
              onClearSelectedSos={() => setSelectedSosForTriage(null)}
            />
          )}

          {authorityTab === 'teams' && (
            <RescueTeamsManager
              teams={rescueTeams}
              authToken={authToken}
              onTeamsUpdated={loadDomainData}
            />
          )}

          {authorityTab === 'shelters' && (
            <SheltersManager
              shelters={shelters}
              authToken={authToken}
              onSheltersUpdated={loadDomainData}
            />
          )}

          {authorityTab === 'resources' && (
            <ResourcesManager
              resources={resources}
              authToken={authToken}
              onResourcesUpdated={loadDomainData}
            />
          )}

          {authorityTab === 'satellite' && (
            <SatelliteIntelligence satelliteData={satelliteData || undefined} />
          )}

          {authorityTab === 'simulation' && (
            <SimulationControl
              currentScenario={simulationScenario}
              isSimulating={isSimulating}
              authToken={authToken}
              onSimulationChanged={loadDomainData}
            />
          )}

          {authorityTab === 'archive' && <HistoricalArchive />}

          {authorityTab === 'analytics' && (
            <AnalyticsView
              alerts={alerts}
              sosRequests={sosRequests}
              shelters={shelters}
              resources={resources}
            />
          )}

          {authorityTab === 'audit' && (
            <AuditLogsView authToken={authToken} />
          )}

          {authorityTab === 'settings' && (
            <SettingsView
              onBack={() => setAuthorityTab('overview')}
              backLabel="Command Overview"
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              userLocation={userLocation}
              onLocationChange={(loc) => {
                setUserLocation(loc);
                loadDomainData();
              }}
            />
          )}
        </AuthorityLayout>
      )}

      {/* Floating Quick Action Button for AI Safety Assistant */}
      <button
        type="button"
        onClick={() => {
          setChatInitialPrompt(undefined);
          setIsChatModalOpen(true);
        }}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#5A5A40] hover:bg-[#4a4a34] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-[#8c8c73]/40 group"
        title="Ask SURAKSHA AI Disaster Safety Assistant"
        aria-label="Ask SURAKSHA AI Disaster Safety Assistant"
      >
        <Bot size={18} className="group-hover:rotate-12 transition-transform text-white" />
        <span className="text-xs font-bold tracking-wide">
          Ask AI
        </span>
      </button>

      {/* Global Modals */}
      <GeminiChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        fromPageLabel={role === 'ENTRY' ? 'Main Dashboard' : role === 'AUTHORITY' ? 'Command Desk' : 'Public Dashboard'}
        initialRole={chatInitialRole}
        initialPrompt={chatInitialPrompt}
        language={currentLanguage}
      />

      <SosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        userLocation={userLocation}
        userName={publicUser?.fullName}
        userPhone={publicUser?.phone}
        userId={publicUser?.id}
        activeAlert={activeAlert}
        onSosSubmitted={(sos) => {
          setActiveSos(sos);
          setSosRequests([sos, ...sosRequests]);
        }}
        language={currentLanguage}
      />

      <PublicAuthModal
        isOpen={isPublicAuthOpen}
        onClose={() => setIsPublicAuthOpen(false)}
        onLoginSuccess={handlePublicLoginSuccess}
        language={currentLanguage}
      />

      <AuthorityAuthModal
        isOpen={isAuthorityAuthOpen}
        onClose={() => setIsAuthorityAuthOpen(false)}
        onLoginSuccess={handleAuthorityLoginSuccess}
      />
    </div>
  );
}

export default App;
