import React, { useState } from 'react';
import { SosRequest, SosStatus } from '../types';
import { AlertOctagon, CheckCircle2, Clock, ShieldCheck, Truck, Users, Phone, RefreshCw } from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface SosTrackerProps {
  sos: SosRequest;
  onRefresh: () => void;
  onInspectDetail?: () => void;
  language?: LanguageCode;
}

export const SosTracker: React.FC<SosTrackerProps> = ({ sos, onRefresh, onInspectDetail, language = 'en' }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const LIFECYCLE_STEPS: { status: SosStatus; label: string; desc: string }[] = [
    { status: 'RECEIVED', label: t.stepReceived || 'Signal Received', desc: t.stepReceivedDesc || 'Distress signal received by SURAKSHA grid' },
    { status: 'AUTHORITY_NOTIFIED', label: t.stepNotified || 'Authority Notified', desc: t.stepNotifiedDesc || 'Local incident command alerted' },
    { status: 'TEAM_ASSIGNED', label: t.stepAssigned || 'Team Assigned', desc: t.stepAssignedDesc || 'Rescue team assigned to coordinate' },
    { status: 'DISPATCHED', label: t.stepDispatched || 'Dispatched', desc: t.stepDispatchedDesc || 'Emergency personnel are en route' },
    { status: 'TEAM_REACHED', label: t.stepOnScene || 'Team on Scene', desc: t.stepOnSceneDesc || 'Rescue team has arrived at coordinates' },
    { status: 'RESOLVED', label: t.stepResolved || 'Resolved', desc: t.stepResolvedDesc || 'Emergency has been successfully resolved' }
  ];

  const getStepIndex = (status: SosStatus) => {
    return LIFECYCLE_STEPS.findIndex((s) => s.status === status);
  };

  const currentIndex = getStepIndex(sos.status);
  const isOffline = sos.id.startsWith('SOS-OFFLINE');

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="bg-[#fdfbf7] border-2 border-[#8B3A3A] rounded-3xl p-6 shadow-xs space-y-4">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e4db]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#faecea] text-[#8B3A3A] rounded-xl">
            <AlertOctagon size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#8c8c73] uppercase tracking-[0.2em]">
                {t.activeIncident}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#434338] text-white rounded-full">
                {sos.id}
              </span>
            </div>
            <h3
              className="text-base font-bold text-[#434338] mt-0.5 font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {sos.emergencyType} SOS &bull; {sos.peopleCount}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onInspectDetail && (
            <button
              type="button"
              onClick={onInspectDetail}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#e8e4db] hover:bg-[#f1efe9] rounded-full text-xs font-semibold text-[#434338] cursor-pointer transition-colors"
            >
              <span>{t.auditTelemetry}</span>
            </button>
          )}

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#e8e4db] hover:bg-[#f1efe9] rounded-full text-xs font-semibold text-[#434338] cursor-pointer transition-colors"
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-[#5A5A40]' : 'text-[#8c8c73]'} />
            <span>{t.refreshStatus}</span>
          </button>
        </div>
      </div>

      {/* Offline Status Warning if pending transmission */}
      {isOffline && (
        <div className="p-3.5 bg-[#faf3eb] border border-[#ecdacb] rounded-2xl text-xs text-[#B37D4E] font-semibold">
          {t.offlineSosWaiting}
        </div>
      )}

      
      {/* Latest Authority Message */}
      {sos.statusHistory && sos.statusHistory.length > 0 && sos.statusHistory[sos.statusHistory.length - 1].updatedBy && (
        <div className="p-4 bg-[#f0f4f8] border border-[#d9e2ec] rounded-2xl flex flex-col gap-1 text-xs">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#627d98]">Emergency Response Update</span>
          <p className="text-[#334e68] font-medium">{sos.statusHistory[sos.statusHistory.length - 1].note}</p>
        </div>
      )}

      {/* Lifecycle Progress Bar */}
      <div className="py-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={step.status}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-[#faecea] border-[#8B3A3A] text-[#8B3A3A] font-bold shadow-xs'
                    : isCompleted
                    ? 'bg-[#edf1eb] border-[#d8ded3] text-[#5A5A40] font-medium'
                    : 'bg-white border-[#e8e4db] text-[#8c8c73]'
                }`}
              >
                <div className="flex justify-center mb-1.5">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className={isCurrent ? 'text-[#8B3A3A]' : 'text-[#5A5A40]'} />
                  ) : (
                    <Clock size={16} className="text-[#8c8c73]/50" />
                  )}
                </div>
                <div className="text-[10px] uppercase tracking-[0.1em] font-bold leading-tight">
                  {step.label}
                </div>
                <p className="text-[9px] text-[#7a7a67] mt-1 line-clamp-2 leading-tight">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Team Card */}
      {sos.assignedTeamId && (
        <div className="p-4 bg-white border border-[#e8e4db] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#edf1eb] text-[#5A5A40] rounded-xl">
              <Truck size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8c8c73] block">
                {t.assignedUnit}
              </span>
              <strong className="text-[#434338] text-sm">{sos.assignedTeamName || 'Assigned Unit'}</strong>
              
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:+910000000000`}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#5A5A40] text-white rounded-full font-semibold hover:bg-[#4a4a34] transition-colors"
            >
              <Phone size={12} />
              <span>{t.callCommander}</span>
            </a>
          </div>
        </div>
      )}

      {/* Live Responders / Time Log */}
      <div className="pt-2 border-t border-[#e8e4db] text-xs text-[#8c8c73] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px]">
        <span>{t.loggedAt}: {new Date(sos.createdAt).toLocaleTimeString(language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN')}</span>
        <span>{t.locationLabel}: {sos.latitude.toFixed(4)}°N, {sos.longitude.toFixed(4)}°E</span>
      </div>
    </div>
  );
};
