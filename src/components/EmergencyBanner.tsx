import React from 'react';
import { EmergencyAlert } from '../types';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import { AlertOctagon, ArrowRight, ShieldAlert } from 'lucide-react';

interface EmergencyBannerProps {
  activeAlert: EmergencyAlert;
  onOpenEmergencyView: () => void;
  language?: LanguageCode;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  activeAlert,
  onOpenEmergencyView,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isCritical = activeAlert.severity === 'CRITICAL' || activeAlert.severity === 'HIGH';

  return (
    <div
      role="alert"
      className={`border rounded-2xl p-5 shadow-xs transition-all ${
        isCritical
          ? 'bg-[#fbf1f0] border-[#ecd3cf] text-[#434338]'
          : 'bg-[#faf3eb] border-[#ecdacb] text-[#434338]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 ${
              isCritical ? 'bg-[#8B3A3A] text-white' : 'bg-[#D4A373] text-white'
            }`}
          >
            <ShieldAlert size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-white/90 border border-current text-[#8B3A3A]">
                {activeAlert.severity} {t.activeAlerts}
              </span>
              <span className="text-xs text-[#8c8c73]">
                {t.issuedBy} {activeAlert.authorityName}
              </span>
            </div>
            <h4
              className="text-base font-bold mt-1 text-[#434338] leading-snug font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {activeAlert.title}
            </h4>
            <p className="text-xs text-[#7a7a67] mt-1 line-clamp-2 leading-relaxed">
              {activeAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenEmergencyView}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all shadow-sm cursor-pointer flex-shrink-0 ${
            isCritical
              ? 'bg-[#8B3A3A] hover:bg-[#722d2d] shadow-[#8B3A3A]/15'
              : 'bg-[#5A5A40] hover:bg-[#4a4a34] shadow-[#5A5A40]/15'
          }`}
        >
          <span>{t.viewActionPlan}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
