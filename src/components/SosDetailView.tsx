import React from 'react';
import { SosRequest } from '../types';
import { BackButton } from './BackButton';
import {
  LifeBuoy,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  PhoneCall,
  Truck,
  AlertTriangle,
  RefreshCw,
  Shield,
  HeartPulse,
  Info
} from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface SosDetailViewProps {
  sos: SosRequest;
  onBack: () => void;
  backLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  language?: LanguageCode;
}

export const SosDetailView: React.FC<SosDetailViewProps> = ({
  sos,
  onBack,
  backLabel,
  onRefresh,
  isRefreshing = false,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const STATUS_STEPS: { key: SosRequest['status']; label: string; description: string }[] = [
    { key: 'RECEIVED', label: t.stepReceived || 'Signal Received', description: t.stepReceivedDesc || 'Distress signal received by SURAKSHA grid' },
    { key: 'AUTHORITY_NOTIFIED', label: t.stepNotified || 'Authority Notified', description: t.stepNotifiedDesc || 'Local incident command alerted' },
    { key: 'TEAM_ASSIGNED', label: t.stepAssigned || 'Team Assigned', description: t.stepAssignedDesc || 'Rescue team assigned to coordinate' },
    { key: 'DISPATCHED', label: t.stepDispatched || 'Dispatched', description: t.stepDispatchedDesc || 'Emergency personnel are en route' },
    { key: 'TEAM_REACHED', label: t.stepOnScene || 'Team on Scene', description: t.stepOnSceneDesc || 'Rescue team has arrived at coordinates' },
    { key: 'RESOLVED', label: t.stepResolved || 'Resolved', description: t.stepResolvedDesc || 'Emergency has been successfully resolved' }
  ];

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === sos.status);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <BackButton onClick={onBack} label={backLabel || t.back} />
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer transition-colors"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{t.refreshStatus}</span>
            </button>
          )}
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-2xs cursor-pointer transition-colors"
          >
            <PhoneCall size={13} />
            <span>{t.call112Helpline}</span>
          </a>
        </div>
      </div>

      {/* Main SOS Tracking Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <LifeBuoy size={22} className="animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {t.incidentId}: {sos.id}
                </span>
                {sos.isSimulation && (
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-100 text-purple-800 rounded-md uppercase">
                    {t.drillMode}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-0.5">
                {t.sosIncidentStatus}
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 text-xs font-black uppercase rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              {sos.status.replace(/_/g, ' ')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              {t.loggedAt} {new Date(sos.createdAt).toLocaleTimeString(language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Real Status Progression Stepper */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>{t.verifiedProgression}</span>
            <span className="text-slate-500 font-normal">
              {t.statusReflectsTelemetry}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200 shadow-2xs'
                      : isPast
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                      : 'bg-white border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold">0{idx + 1}</span>
                    {isPast ? (
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-200" />
                    )}
                  </div>
                  <span className={`font-bold leading-tight ${isCurrent ? 'text-rose-950' : 'text-slate-800'}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 leading-snug">
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident Particulars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <span className="text-slate-500 block">{t.reportedBy}:</span>
            <span className="font-bold text-slate-800 text-sm">
              {sos.userName || 'Citizen'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.emergencyNature}:</span>
            <span className="font-bold text-rose-800 text-sm">
              {sos.emergencyType}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.personsTrapped}:</span>
            <span className="font-bold text-slate-900 text-sm">
              {sos.peopleCount}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">{t.medicalAttention}:</span>
            <span className={`font-bold text-sm ${sos.medicalAssistanceRequired ? 'text-rose-700' : 'text-slate-700'}`}>
              {sos.medicalAssistanceRequired ? t.requiredUrgently : t.notRequested}
            </span>
          </div>
        </div>

        {/* GPS Coordinates & Map Pin */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <MapPin size={15} className="text-rose-600 shrink-0" />
            <span>{t.verifiedIncidentCoordinates}</span>
          </div>
          <p className="font-mono text-xs text-slate-700">
            Latitude: {sos.latitude.toFixed(6)}, Longitude: {sos.longitude.toFixed(6)} (±{sos.accuracy || 15}m)
          </p>
          {sos.areaDescription && (
            <p className="text-slate-600">
              <strong>{t.locationLandmark}:</strong> {sos.areaDescription}
            </p>
          )}
          {sos.message && (
            <p className="text-slate-600 pt-1 border-t border-slate-200">
              <strong>{t.citizenNote}:</strong> "{sos.message}"
            </p>
          )}
        </div>

        {/* Assigned Rescue Team Block if present */}
        {sos.assignedTeamName ? (
          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <Truck size={16} className="text-emerald-700" />
                <span>{t.assignedUnit}</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                ACTIVE
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{sos.assignedTeamName}</h3>
            {sos.authorityNotes && (
              <p className="text-xs text-slate-700 bg-white/70 p-3 rounded-lg border border-emerald-100">
                <strong>{t.eocDispatchNotes}:</strong> {sos.authorityNotes}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t.awaitingAllocation}</p>
              <p className="text-amber-800 mt-0.5">
                {t.eocTriagingDesc}
              </p>
            </div>
          </div>
        )}

        {/* Audit History Log */}
        {sos.statusHistory && sos.statusHistory.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t.officialAuditLog}
            </h2>
            <div className="space-y-1.5">
              {sos.statusHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-slate-400" />
                    <span className="font-bold text-slate-800">{item.status.replace(/_/g, ' ')}</span>
                    {item.note && <span className="text-slate-500">&bull; {item.note}</span>}
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(item.timestamp).toLocaleTimeString(language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
