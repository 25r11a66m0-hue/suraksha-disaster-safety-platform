import React from 'react';
import { RiskAnalysis, SeverityLevel } from '../types';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import { AlertTriangle, ShieldCheck, ShieldAlert, Activity, ChevronRight, Info } from 'lucide-react';

interface RiskCardProps {
  risk: RiskAnalysis;
  onInspectDetails?: () => void;
  language?: LanguageCode;
}

const SEVERITY_CONFIG: Record<SeverityLevel, {
  bgBadge: string;
  border: string;
  textBadge: string;
  progressColor: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}> = {
  LOW: {
    bgBadge: 'bg-[#edf1eb]',
    border: 'border-[#d8ded3]',
    textBadge: 'text-[#5A5A40]',
    progressColor: 'bg-[#5A5A40]',
    icon: ShieldCheck
  },
  MODERATE: {
    bgBadge: 'bg-[#faf3eb]',
    border: 'border-[#ecdacb]',
    textBadge: 'text-[#B37D4E]',
    progressColor: 'bg-[#D4A373]',
    icon: Activity
  },
  HIGH: {
    bgBadge: 'bg-[#f8ede6]',
    border: 'border-[#eecfc0]',
    textBadge: 'text-[#C05621]',
    progressColor: 'bg-[#C05621]',
    icon: AlertTriangle
  },
  CRITICAL: {
    bgBadge: 'bg-[#faecea]',
    border: 'border-[#efc7c3]',
    textBadge: 'text-[#8B3A3A]',
    progressColor: 'bg-[#8B3A3A]',
    icon: ShieldAlert
  }
};

export const RiskCard: React.FC<RiskCardProps> = ({ risk, onInspectDetails, language = 'en' }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const config = SEVERITY_CONFIG[risk.riskLevel];
  const Icon = config.icon;

  const severityLabel =
    risk.riskLevel === 'LOW'
      ? t.lowRisk
      : risk.riskLevel === 'MODERATE'
      ? t.moderateRisk
      : risk.riskLevel === 'HIGH'
      ? t.highRisk
      : t.criticalRisk;

  return (
    <div className="bg-white border border-[#e8e4db] rounded-3xl p-6 shadow-xs transition-all flex flex-col justify-between">
      <div>
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${config.bgBadge}`}>
              <Icon size={18} className={config.textBadge} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8c8c73]">
              {t.sectorVulnerabilityIndex}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {risk.freshness === 'SIMULATION' && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#f1efe9] text-[#7a7a67] border border-[#e8e4db] rounded-full uppercase tracking-wider">
                SIMULATION
              </span>
            )}
            <span className={`px-3 py-0.5 text-[11px] font-bold rounded-full ${config.bgBadge} ${config.textBadge} border ${config.border}`}>
              {severityLabel}
            </span>
          </div>
        </div>

        {/* Big Score and Summary */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
          <div className="flex items-baseline gap-2">
            <span
              className="text-5xl font-light text-[#434338] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {risk.riskScore}
            </span>
            <span className="text-xs font-semibold text-[#8c8c73] uppercase tracking-wider">/ 100 {t.riskScore}</span>
          </div>
          <span className="text-xs font-semibold text-[#7a7a67]">
            {t.primaryThreat}: <strong className="text-[#434338] uppercase font-serif tracking-wide">{risk.primaryHazard}</strong>
          </span>
        </div>

        {/* Progress Track */}
        <div className="h-2.5 w-full bg-[#f1f0ec] rounded-full overflow-hidden mb-4">
          <div
            className={`h-full ${config.progressColor} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(100, Math.max(5, risk.riskScore))}%` }}
          />
        </div>

        {/* Guidance summary text */}
        <p className="text-xs text-[#5A5A40] leading-relaxed font-medium bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl p-4 mb-4">
          {risk.summaryText}
        </p>
      </div>

      {/* Risk Factors Breakdown */}
      <div className="space-y-2 pt-2 border-t border-[#e8e4db]">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8c8c73] block">
          {t.deterministicRiskFactors}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {risk.factors.map((factor, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#fdfbf7] border border-[#e8e4db] rounded-xl text-xs"
            >
              <div className="flex justify-between items-center mb-1 font-semibold text-[#434338]">
                <span>{factor.name}</span>
                <span className="font-mono text-[#8c8c73] text-[11px]">{factor.score}/100</span>
              </div>
              <p className="text-[11px] text-[#7a7a67] leading-relaxed">
                {factor.description}
              </p>
            </div>
          ))}
        </div>

        {onInspectDetails && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onInspectDetails}
              className="text-xs font-semibold text-[#5A5A40] hover:text-[#434338] underline flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Detailed Risk Diagnostics & Contours &rarr;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
