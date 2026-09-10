import React, { useState } from 'react';
import { EmergencyAlert, Shelter } from '../types';
import { BackButton } from './BackButton';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Shield,
  Navigation,
  PhoneCall,
  CheckCircle2,
  Radio,
  Share2,
  Check,
  Building2,
  ExternalLink
} from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface AlertDetailViewProps {
  alert: EmergencyAlert;
  onBack: () => void;
  backLabel?: string;
  recommendedShelter?: Shelter;
  onSelectShelter?: (shelter: Shelter) => void;
  onStartRouteToShelter?: (shelter: Shelter) => void;
  language?: LanguageCode;
}

export const AlertDetailView: React.FC<AlertDetailViewProps> = ({
  alert,
  onBack,
  backLabel,
  recommendedShelter,
  onSelectShelter,
  onStartRouteToShelter,
  language = 'en'
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleShare = () => {
    const text = `[SURAKSHA OFFICIAL ALERT] ${alert.title}\nSeverity: ${alert.severity}\nArea: ${alert.affectedArea}\nAction: ${alert.recommendedAction}\nCall 112 in immediate danger.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            {t.criticalDanger}
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            {t.highSeverity}
          </span>
        );
      case 'MODERATE':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
            {t.moderateAdvisory}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            {t.lowWatch}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <BackButton onClick={onBack} label={backLabel || t.back} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
            title="Copy alert for messaging"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            <span>{copied ? t.copiedText : t.shareAlert}</span>
          </button>
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-2xs cursor-pointer transition-colors"
          >
            <PhoneCall size={13} />
            <span>{t.call112}</span>
          </a>
        </div>
      </div>

      {/* Main Alert Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">
              {alert.id} &bull; {alert.disasterType}
            </span>
            {alert.isSimulation && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-md uppercase">
                {t.simulationDrill}
              </span>
            )}
          </div>
          {getSeverityBadge(alert.severity)}
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {alert.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 flex items-center gap-1.5">
            <MapPin size={15} className="text-rose-600 shrink-0" />
            <span><strong>{t.affectedAreaLabel}:</strong> {alert.affectedArea} ({alert.radiusKm} km)</span>
          </p>
        </div>

        {/* Alert Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <span className="text-slate-500 font-medium block">{t.issuingAuthority}:</span>
            <span className="font-bold text-slate-800">{alert.authorityName}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">{t.published}:</span>
            <span className="font-semibold text-slate-700">
              {new Date(alert.issuedAt).toLocaleString(language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">{t.validUntil}:</span>
            <span className="font-semibold text-slate-700">
              {new Date(alert.expiresAt).toLocaleString(language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </span>
          </div>
        </div>

        {/* Official Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {t.officialSummary}
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {alert.message}
          </p>
        </div>

        {/* Immediate Recommended Action */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle size={15} className="text-amber-700" />
            <span>{t.immediateDirective}</span>
          </div>
          <p className="text-sm font-semibold text-amber-950">
            {alert.recommendedAction}
          </p>
        </div>

        {/* Step-by-Step Actionable Checklist */}
        {alert.safetyInstructions && alert.safetyInstructions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{t.safetyActionChecklist}</span>
            </h2>
            <div className="space-y-2">
              {alert.safetyInstructions.map((inst, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{inst}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Shelter Section */}
        {recommendedShelter && (
          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <Building2 size={16} className="text-emerald-700" />
                <span>{t.recommendedReliefShelter}</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                {recommendedShelter.availableCapacity} {t.spotsAvailable}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{recommendedShelter.name}</h3>
              <p className="text-xs text-slate-600 mt-0.5">{recommendedShelter.address}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onStartRouteToShelter && (
                <button
                  type="button"
                  onClick={() => onStartRouteToShelter(recommendedShelter)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer transition-colors"
                >
                  <Navigation size={14} />
                  <span>{t.navigateSaferRoute}</span>
                </button>
              )}
              {onSelectShelter && (
                <button
                  type="button"
                  onClick={() => onSelectShelter(recommendedShelter)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  <span>{t.viewShelterDetails}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Real Data Behavior State Disclosure (Truthful System Status) */}
        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-600">{t.disseminationChannelsStatus}</span>
            <span className="text-[11px] font-mono text-slate-400">Audit ID: {alert.id}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
              <Radio size={14} className="text-emerald-600 shrink-0" />
              <span>{t.webBroadcastActive}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-600 shrink-0" />
              <span>{t.smsGatewayNotConfigured}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
