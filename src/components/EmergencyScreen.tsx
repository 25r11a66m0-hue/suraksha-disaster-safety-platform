import React from 'react';
import { EmergencyAlert, Shelter, LocationCoordinates } from '../types';
import { ShieldAlert, MapPin, Navigation, Compass, AlertTriangle, ArrowLeft, ExternalLink, PhoneCall } from 'lucide-react';
import { BackButton } from './BackButton';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface EmergencyScreenProps {
  alert: EmergencyAlert;
  shelter?: Shelter;
  userLocation: LocationCoordinates;
  onNavigateToRoute: () => void;
  onNavigateToShelters: () => void;
  onOpenSos: () => void;
  onBack: () => void;
  language?: LanguageCode;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  alert,
  shelter,
  userLocation,
  onNavigateToRoute,
  onNavigateToShelters,
  onOpenSos,
  onBack,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const googleMapsUrl = shelter
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${shelter.latitude},${shelter.longitude}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`;

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Back button */}
      <div className="mb-4">
        <BackButton onClick={onBack} label={t.dashboard} />
      </div>

      {/* Emergency Header Card */}
      <div className="bg-rose-700 text-white rounded-xl p-6 shadow-md mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 text-xs font-black bg-white text-rose-800 rounded-full tracking-wider uppercase">
            {alert.severity} {t.activeAlerts}
          </span>
          <span className="text-xs text-rose-100 font-mono">
            {alert.disasterType}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {alert.title}
        </h1>

        <p className="text-sm text-rose-100 font-medium leading-relaxed mb-4">
          {alert.message}
        </p>

        <div className="flex items-center gap-2 text-xs text-rose-200 bg-rose-800/60 p-2.5 rounded-lg">
          <MapPin size={15} className="flex-shrink-0 text-white" />
          <span>{t.affectedCorridor}: <strong>{alert.affectedArea}</strong> ({alert.radiusKm} km)</span>
        </div>
      </div>

      {/* IMMEDIATE ACTION DIRECTIVES */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-5 mb-5 shadow-xs">
        <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900 mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          <span>{t.whatToDoNow}</span>
        </h2>

        <ol className="space-y-3">
          {alert.safetyInstructions.map((inst, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <p className="text-sm font-bold text-slate-800 leading-snug pt-0.5">
                {inst}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700">
          {t.officialDirective}: <span className="text-slate-900">{alert.recommendedAction}</span>
        </div>
      </div>

      {/* RECOMMENDED SHELTER & EVACUATION PATH */}
      {shelter && (
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {t.designatedSafeReliefShelter}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-200 text-emerald-950 rounded uppercase">
              {shelter.status}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            {shelter.name}
          </h3>
          <p className="text-xs text-slate-600 mb-3">
            {shelter.address} &bull; {t.approxAway} {shelter.distanceKm ?? 2.4} km
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-slate-700 bg-white/70 p-3 rounded-lg mb-4 border border-emerald-200/60">
            <div>{t.capacityBeds}: <strong className="text-emerald-800">{shelter.availableCapacity}</strong></div>
            <div>{t.cleanWater}: <strong className="text-emerald-800">{shelter.facilities.water ? t.yes : t.no}</strong></div>
            <div>{t.foodRations}: <strong className="text-emerald-800">{shelter.facilities.food ? t.yes : t.no}</strong></div>
            <div>{t.medicalAid}: <strong className="text-emerald-800">{shelter.facilities.medical ? t.yes : t.no}</strong></div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onNavigateToRoute}
              className="w-full flex items-center justify-center gap-2 p-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Navigation size={18} />
              <span>{t.inspectSaferRoute}</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 p-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink size={17} />
              <span>{t.navigateGoogleMaps}</span>
            </a>
          </div>
        </div>
      )}

      {/* LIFE-SAFETY SOS CARD */}
      <div className="bg-white border border-rose-300 rounded-xl p-5 text-center shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          {t.trappedOrInjured}
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          {t.requestOfficialAssistance}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenSos}
            className="w-full sm:w-auto px-6 py-3.5 bg-rose-700 hover:bg-rose-800 text-white font-black text-sm rounded-lg shadow-sm transition-colors uppercase tracking-wider cursor-pointer"
          >
            {t.triggerSos}
          </button>
          <a
            href="tel:112"
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall size={14} className="text-rose-700" />
            <span>{t.call112}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
