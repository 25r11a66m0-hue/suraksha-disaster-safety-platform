import React from 'react';
import { Shelter } from '../types';
import { BackButton } from './BackButton';
import {
  Building2,
  MapPin,
  PhoneCall,
  Users,
  CheckCircle2,
  XCircle,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Zap,
  Utensils,
  Droplets,
  HeartPulse,
  Sparkles,
  Accessibility
} from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface ShelterDetailViewProps {
  shelter: Shelter;
  onBack: () => void;
  backLabel?: string;
  onNavigateRoute: (shelter: Shelter) => void;
  language?: LanguageCode;
}

export const ShelterDetailView: React.FC<ShelterDetailViewProps> = ({
  shelter,
  onBack,
  backLabel,
  onNavigateRoute,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const occupancyPct = Math.min(100, Math.round((shelter.occupiedCapacity / (shelter.totalCapacity || 1)) * 100));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            {t.shelterStatusOpen}
          </span>
        );
      case 'LIMITED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
            {t.shelterStatusLimited}
          </span>
        );
      case 'FULL':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
            {t.shelterStatusFull}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
            {t.shelterStatusClosed}
          </span>
        );
    }
  };

  const facilitiesList = [
    { key: 'food', label: t.cleanFoodRations, icon: Utensils, available: shelter.facilities.food },
    { key: 'water', label: t.potableWater, icon: Droplets, available: shelter.facilities.water },
    { key: 'medical', label: t.medicalSupport, icon: HeartPulse, available: shelter.facilities.medical },
    { key: 'sanitation', label: t.sanitationRestrooms, icon: Sparkles, available: shelter.facilities.sanitation },
    { key: 'powerBackup', label: t.powerGenerator, icon: Zap, available: shelter.facilities.powerBackup },
    { key: 'accessibilityRamp', label: t.rampAccess, icon: Accessibility, available: shelter.facilities.accessibilityRamp }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <BackButton onClick={onBack} label={backLabel || t.back} />
        <div className="flex items-center gap-2">
          <a
            href={`tel:${shelter.contactPhone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer transition-colors"
          >
            <PhoneCall size={13} className="text-emerald-700" />
            <span>{t.callShelter}</span>
          </a>
          <button
            type="button"
            onClick={() => onNavigateRoute(shelter)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs cursor-pointer transition-colors"
          >
            <Navigation size={13} />
            <span>{t.saferRouteBtnSmall}</span>
          </button>
        </div>
      </div>

      {/* Main Shelter Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">
              {t.shelterIdLabel}: {shelter.id}
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-600 font-semibold">
              {t.district}: {shelter.district}, {shelter.state}
            </span>
          </div>
          {getStatusBadge(shelter.status)}
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {shelter.name}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 flex items-center gap-1.5">
            <MapPin size={15} className="text-slate-500 shrink-0" />
            <span>{shelter.address}</span>
          </p>
        </div>

        {/* Distance & Location Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <span className="text-slate-500 block">{t.distanceFromGps}:</span>
            <span className="font-bold text-slate-900 text-sm">
              {shelter.distanceKm !== undefined ? `${shelter.distanceKm.toFixed(1)} km` : '...'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.availableCapacity}:</span>
            <span className="font-bold text-emerald-700 text-sm">
              {shelter.availableCapacity} / {shelter.totalCapacity}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.locationSafetyLevel}:</span>
            <span className="font-bold text-slate-800 text-sm">
              {shelter.riskLevel}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.lastFieldUpdate}:</span>
            <span className="font-medium text-slate-700">
              {new Date(shelter.lastUpdated).toLocaleTimeString(language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Live Capacity Gauge */}
        <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 flex items-center gap-1.5">
              <Users size={14} className="text-slate-500" />
              <span>{t.currentOccupancy}: {shelter.occupiedCapacity}</span>
            </span>
            <span className={occupancyPct > 85 ? 'text-rose-700 font-bold' : 'text-slate-600'}>
              {occupancyPct}% {t.full} ({shelter.availableCapacity} {t.vacant})
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyPct > 90 ? 'bg-rose-600' : occupancyPct > 70 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
        </div>

        {/* Verified Facilities & Relief Supplies Checklist */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>{t.verifiedFacilities}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {facilitiesList.map((facility) => {
              const Icon = facility.icon;
              return (
                <div
                  key={facility.key}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    facility.available
                      ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={facility.available ? 'text-emerald-700' : 'text-slate-400'} />
                    <span className="font-medium">{facility.label}</span>
                  </div>
                  {facility.available ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>{t.facilityAvailable}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <XCircle size={14} className="text-slate-400" />
                      <span>{t.facilityNotPresent}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Administration & In-Charge Contact */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">{t.shelterInCharge}:</span>
            <span className="font-bold text-slate-900 text-sm">{shelter.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${shelter.contactPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <PhoneCall size={14} />
              <span>{shelter.contactPhone}</span>
            </a>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigateRoute(shelter)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            <Navigation size={15} />
            <span>{t.computeHighGroundRoute}</span>
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
          >
            <span>{t.openInGoogleMaps}</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
