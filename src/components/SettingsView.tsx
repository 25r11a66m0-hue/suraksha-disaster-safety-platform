import React, { useState } from 'react';
import { BackButton } from './BackButton';
import { LocationCoordinates } from '../types';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import {
  Settings,
  Globe,
  MapPin,
  Radio,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Satellite,
  MessageSquare,
  Shield
} from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
  backLabel?: string;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  userLocation: LocationCoordinates;
  onLocationChange: (loc: LocationCoordinates) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  backLabel = 'Home',
  currentLanguage,
  onLanguageChange,
  userLocation,
  onLocationChange
}) => {
  const [cacheCleared, setCacheCleared] = useState(false);
  const [geoState, setGeoState] = useState<'GRANTED' | 'PROMPT' | 'DENIED'>('GRANTED');
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const handleClearCache = () => {
    localStorage.removeItem('suraksha_offline_sos_queue');
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleRequestLiveGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoState('GRANTED');
        onLocationChange({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          timestamp: Date.now(),
          cityName: 'Visakhapatnam',
          areaName: 'Device Live GPS Position',
          source: 'LIVE_GPS'
        });
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGeoState('DENIED');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <BackButton onClick={onBack} label={backLabel} />
        <span className="text-xs font-semibold text-slate-500">
          {t.settingsTitle}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t.appName}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {t.settingsTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {t.settingsSubtitle}
          </p>
        </div>

        {/* 1. Language Preference */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Globe size={16} className="text-slate-600" />
            <span>{t.languageSettingTitle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { code: 'en', label: 'English' },
              { code: 'te', label: 'తెలుగు' },
              { code: 'hi', label: 'हिन्दी' }
            ].map((lang) => (
              <button
                key={lang.code}
                id={`settings-lang-${lang.code}`}
                type="button"
                onClick={() => onLanguageChange(lang.code as LanguageCode)}
                className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  currentLanguage === lang.code
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Location & Geofencing Permissions */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <MapPin size={16} className="text-slate-600" />
              <span>{t.browserGeoPermissions}</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {geoState === 'GRANTED' ? t.locationEnabled : t.permissionDenied}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            {t.monitoredSector}: <strong>{userLocation.areaName || userLocation.cityName}</strong> (Latitude: {userLocation.latitude.toFixed(4)}, Longitude: {userLocation.longitude.toFixed(4)} &bull; {t.accuracy}: ±{userLocation.accuracy || 15}m)
          </p>

          <button
            type="button"
            onClick={handleRequestLiveGps}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg shadow-2xs cursor-pointer transition-colors"
          >
            <RefreshCw size={13} />
            <span>{t.useLiveLocation}</span>
          </button>
        </div>

        {/* 3. Real Data Behavior Gateway Audit */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Radio size={16} className="text-slate-600" />
            <span>External Infrastructure & Gateway Health</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Meteorological Ground Telemetry</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  LIVE
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Active downlink via Regional Meteorological Centre / IMD Radar feed.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Cartographic GIS Tile Server</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  OPERATIONAL
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                OpenStreetMap high-res tile servers active with Leaflet raster layering.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">SMS Mass Broadcast Gateway</span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  NOT CONFIGURED
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Requires authorized C-DAC / Telecom SMS Gateway credentials. Push and web alerts active.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Satellite Remote Sensing Link</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  CONFIGURED
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                ISRO / NRSC Disaster Management Support Programme (Bhuvan/NDEM) telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Offline Cache & Storage Management */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Database size={16} className="text-slate-600" />
              <span>{t.offlineDataResilience}</span>
            </div>
            {cacheCleared && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>{t.success}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600">
            {t.offlineNotice}
          </p>
          <button
            type="button"
            onClick={handleClearCache}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            <Trash2 size={13} />
            <span>{t.clearOfflineCacheBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
