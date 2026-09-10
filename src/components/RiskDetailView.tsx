import React from 'react';
import { RiskAnalysis } from '../types';
import { BackButton } from './BackButton';
import {
  ShieldAlert,
  AlertTriangle,
  Waves,
  Mountain,
  Droplets,
  Layers,
  ArrowUpRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface RiskDetailViewProps {
  risk: RiskAnalysis | null;
  onBack: () => void;
  backLabel?: string;
  onNavigateToShelters?: () => void;
  language?: LanguageCode;
}

export const RiskDetailView: React.FC<RiskDetailViewProps> = ({
  risk,
  onBack,
  backLabel,
  onNavigateToShelters,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!risk) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <BackButton onClick={onBack} label={backLabel || t.back} />
        </div>
        <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
          <ShieldAlert size={36} className="mx-auto text-slate-300 animate-pulse" />
          <h2 className="text-base font-bold text-slate-800">
            {t.computingRiskAnalysis}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t.aggregatingElevation}
          </p>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-600' };
      case 'HIGH':
        return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' };
      case 'MODERATE':
        return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-600' };
      default:
        return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-600' };
    }
  };

  const colors = getRiskColor(risk.riskLevel);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <BackButton onClick={onBack} label={backLabel || t.back} />
        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
          {risk.riskLevel} {t.riskIndex}
        </span>
      </div>

      {/* Main Risk Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t.multiHazardDiagnostic}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {t.hazardVulnerabilityIndex}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {risk.summaryText}
          </p>
        </div>

        {/* Big Score Gauge */}
        <div className={`p-6 rounded-2xl border ${colors.border} ${colors.bg} space-y-3`}>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.compositeHazardScore}
            </span>
            <span className={`text-4xl font-black ${colors.text}`}>
              {risk.riskScore} <span className="text-lg font-normal text-slate-500">/ 100</span>
            </span>
          </div>
          <div className="w-full h-3.5 bg-white/80 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
              style={{ width: `${risk.riskScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 pt-1">
            {t.primaryHazard}: <strong>{risk.primaryHazard}</strong>
          </p>
        </div>

        {/* Hazard Contributing Factors Breakdown */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers size={16} className="text-slate-600" />
            <span>{t.hazardIndexWeights}</span>
          </h2>
          <div className="space-y-2.5">
            {risk.factors.map((factor, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{factor.name}</span>
                  <span className="font-mono font-bold text-slate-700 px-2 py-0.5 bg-white border border-slate-200 rounded">
                    {t.score}: {factor.score}/100 ({t.weight}: {Math.round(factor.weight * 100)}%)
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {factor.description}
                </p>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      factor.score > 70 ? 'bg-rose-500' : factor.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evacuation Directive */}
        {onNavigateToShelters && risk.riskScore >= 50 && (
          <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-amber-950 text-sm block">
                {t.elevatedActionRecommended}
              </span>
              <p className="text-amber-800">
                {t.residentsAdvised}
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToShelters}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg shadow-2xs cursor-pointer transition-colors"
            >
              {t.locateSafeShelters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
