import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';
import { EmergencyAlert } from '../types';
import {
  ShieldAlert,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
  Square,
  CheckSquare,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface SafetyGuideProps {
  language: LanguageCode;
  activeAlert?: EmergencyAlert | null;
  onOpenFullGuide?: () => void;
}

export type DisasterTypeKey = 'FLOOD' | 'CYCLONE' | 'EARTHQUAKE' | 'FIRE' | 'LANDSLIDE' | 'GENERAL';

interface ChecklistItem {
  id: string;
  text: string;
}

export const DISASTER_CHECKLISTS: Record<DisasterTypeKey, { title: string; items: ChecklistItem[] }> = {
  FLOOD: {
    title: 'Flood Evacuation & High-Ground Checklist',
    items: [
      { id: 'fl-1', text: 'Move to higher ground immediately' },
      { id: 'fl-2', text: 'Avoid walking or driving through floodwater' },
      { id: 'fl-3', text: 'Keep emergency documents and essential items with you' },
      { id: 'fl-4', text: 'Follow official evacuation instructions' },
      { id: 'fl-5', text: 'Stay away from electrical hazards and submerged power lines' }
    ]
  },
  CYCLONE: {
    title: 'Cyclone Shelter & Storm Surge Checklist',
    items: [
      { id: 'cy-1', text: 'Move indoors to a safe reinforced location' },
      { id: 'cy-2', text: 'Stay away from windows, glass doors, and external walls' },
      { id: 'cy-3', text: 'Secure loose outdoor objects if safe to do so' },
      { id: 'cy-4', text: 'Keep emergency supplies and battery lighting ready' },
      { id: 'cy-5', text: 'Follow official evacuation instructions' }
    ]
  },
  EARTHQUAKE: {
    title: 'Earthquake Response & Evacuation Checklist',
    items: [
      { id: 'eq-1', text: 'Drop, Cover and Hold On during shaking' },
      { id: 'eq-2', text: 'Move away from windows, heavy furniture, and unstable objects' },
      { id: 'eq-3', text: 'After shaking stops, follow official evacuation instructions' },
      { id: 'eq-4', text: 'Avoid damaged buildings and shattered masonry' },
      { id: 'eq-5', text: 'Check for official emergency updates and aftershock warnings' }
    ]
  },
  FIRE: {
    title: 'Structure & Wildfire Evacuation Checklist',
    items: [
      { id: 'fr-1', text: 'Leave the building immediately using the safest available exit' },
      { id: 'fr-2', text: 'Do not use elevators during a building fire' },
      { id: 'fr-3', text: 'Stay low to avoid toxic smoke and heat' },
      { id: 'fr-4', text: 'Follow official evacuation instructions' },
      { id: 'fr-5', text: 'Do not re-enter until emergency authorities say it is safe' }
    ]
  },
  LANDSLIDE: {
    title: 'Landslide & Slope Hazard Checklist',
    items: [
      { id: 'ls-1', text: 'Move away from unstable slopes and active drainage paths' },
      { id: 'ls-2', text: 'Follow official evacuation instructions' },
      { id: 'ls-3', text: 'Avoid areas with active landslide risk or debris flows' },
      { id: 'ls-4', text: 'Stay alert for additional ground movement or unusual rumbling' },
      { id: 'ls-5', text: 'Wait for official clearance before returning to the area' }
    ]
  },
  GENERAL: {
    title: 'General Emergency Preparedness Checklist',
    items: [
      { id: 'gn-1', text: 'Prepare a 72-hour emergency Go-Bag with essentials' },
      { id: 'gn-2', text: 'Identify nearest official evacuation shelter in your sector' },
      { id: 'gn-3', text: 'Keep mobile phones charged and power banks ready' },
      { id: 'gn-4', text: 'Review family emergency communication plan' },
      { id: 'gn-5', text: 'Monitor official SURAKSHA / NDMA alert advisories' }
    ]
  }
};

export const SafetyGuide: React.FC<SafetyGuideProps> = ({
  language,
  activeAlert,
  onOpenFullGuide
}) => {
  // Determine initial disaster type from activeAlert if present
  const detectDisasterType = (): DisasterTypeKey => {
    if (activeAlert?.disasterType) {
      const typeUpper = activeAlert.disasterType.toUpperCase();
      if (typeUpper.includes('FLOOD')) return 'FLOOD';
      if (typeUpper.includes('CYCLONE') || typeUpper.includes('STORM')) return 'CYCLONE';
      if (typeUpper.includes('EARTHQUAKE')) return 'EARTHQUAKE';
      if (typeUpper.includes('FIRE')) return 'FIRE';
      if (typeUpper.includes('LANDSLIDE')) return 'LANDSLIDE';
    }
    return activeAlert ? 'FLOOD' : 'GENERAL';
  };

  const [selectedDisaster, setSelectedDisaster] = useState<DisasterTypeKey>(detectDisasterType);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Auto-sync tab when active alert changes
  useEffect(() => {
    const detected = detectDisasterType();
    setSelectedDisaster(detected);
  }, [activeAlert?.id, activeAlert?.disasterType]);

  // Load saved checklist state for selected disaster from localStorage
  useEffect(() => {
    const storageKey = `suraksha_checklist_${selectedDisaster}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch {
        setCheckedItems({});
      }
    } else {
      setCheckedItems({});
    }
  }, [selectedDisaster]);

  const toggleCheck = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem(`suraksha_checklist_${selectedDisaster}`, JSON.stringify(next));
      } catch {
        // ignore localStorage quota errors
      }
      return next;
    });
  };

  const resetChecklist = () => {
    setCheckedItems({});
    localStorage.removeItem(`suraksha_checklist_${selectedDisaster}`);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const guides = t.emergencyInstructions;

  // Fallback translation mapping for protocols
  const currentProtocolGuide =
    selectedDisaster === 'GENERAL'
      ? guides.FLOOD
      : guides[selectedDisaster as keyof typeof guides] || guides.FLOOD;

  const currentChecklist = t.checklists?.[selectedDisaster] || DISASTER_CHECKLISTS[selectedDisaster] || DISASTER_CHECKLISTS.GENERAL;
  const completedCount = currentChecklist.items.filter((item) => checkedItems[item.id]).length;
  const totalCount = currentChecklist.items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getDisasterName = (type: DisasterTypeKey): string => {
    switch (type) {
      case 'FLOOD': return t.disasterFlood;
      case 'CYCLONE': return t.disasterCyclone;
      case 'EARTHQUAKE': return t.disasterEarthquake;
      case 'FIRE': return t.disasterFire;
      case 'LANDSLIDE': return t.disasterLandslide;
      default: return t.disasterGeneral;
    }
  };

  return (
    <div className="bg-[#fdfbf7] border border-[#e8e4db] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Active Alert Integration Header */}
      {activeAlert ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-xl text-red-700 shrink-0 mt-0.5">
              <ShieldAlert size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-red-700 text-white rounded-full">
                  {t.activeAlertInSectorText}
                </span>
                <span className="text-xs font-bold text-red-900">
                  {activeAlert.severity} &bull; {activeAlert.disasterType}
                </span>
              </div>
              <h4 className="text-sm font-bold text-red-950 mt-1">
                {activeAlert.title}
              </h4>
              <p className="text-xs text-red-800 mt-0.5">
                {t.directActionLabel}: {activeAlert.recommendedAction || t.viewActionPlan}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-800 bg-red-100/80 px-3 py-1.5 rounded-full border border-red-200">
              <ShieldCheck size={14} />
              <span>{t.protocolsActiveText}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-[#f5f2ea] border border-[#e8e4db] rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#5A5A40]">
            <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
            <span>
              {t.noActiveAlertInSectorText}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c8c73] bg-white px-2.5 py-1 rounded-full border border-[#e8e4db]">
            {t.standardReadinessText}
          </span>
        </div>
      )}

      {/* Main Guide Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <BookOpen size={20} className="text-[#5A5A40]" />
            <h3
              className="text-lg font-bold text-[#434338] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {t.safetyGuideTitle}
            </h3>
          </div>
          <p className="text-xs text-[#8c8c73] leading-relaxed">
            {t.safetyGuideSubtitle}
          </p>
        </div>
        {onOpenFullGuide && (
          <button
            type="button"
            onClick={onOpenFullGuide}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] hover:text-[#434338] hover:underline cursor-pointer shrink-0"
          >
            <span>{t.openComprehensivePortalText}</span>
            <ExternalLink size={13} />
          </button>
        )}
      </div>

      {/* Disaster selector tabs */}
      <div className="flex flex-wrap gap-2">
        {(['FLOOD', 'CYCLONE', 'EARTHQUAKE', 'FIRE', 'LANDSLIDE', 'GENERAL'] as const).map((type) => {
          const isCurrentActiveDisaster =
            activeAlert &&
            activeAlert.disasterType &&
            activeAlert.disasterType.toUpperCase().includes(type);

          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedDisaster(type)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedDisaster === type
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white border border-[#e8e4db] text-[#7a7a67] hover:bg-[#f1efe9] hover:text-[#434338]'
              }`}
            >
              {isCurrentActiveDisaster && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              )}
              <span>{getDisasterName(type)}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE EVACUATION CHECKLIST SECTION                 */}
      {/* ========================================================= */}
      <div className="bg-white border border-[#e8e4db] rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0ece3]">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#5A5A40]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#434338]">
                {currentChecklist.title}
              </h4>
            </div>
            <p className="text-[11px] text-[#8c8c73] mt-0.5">
              {t.interactiveChecklistDesc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#5A5A40] bg-[#f1efe9] px-3 py-1 rounded-full">
              {completedCount} / {totalCount} {t.ofCompletedText} ({progressPercent}%)
            </span>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={resetChecklist}
                className="text-[11px] text-[#8c8c73] hover:text-[#8B3A3A] flex items-center gap-1 cursor-pointer"
                title={t.resetBtnText}
              >
                <RotateCcw size={12} />
                <span>{t.resetBtnText}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#f1efe9] h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercent === 100
                ? 'bg-emerald-600'
                : progressPercent >= 60
                ? 'bg-[#5A5A40]'
                : 'bg-amber-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Interactive Checklist Items */}
        <div className="space-y-2.5 pt-1">
          {currentChecklist.items.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onClick={() => toggleCheck(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCheck(item.id);
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#5A5A40] ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-[#faf8f4] border-[#e8e4db] text-[#434338] hover:bg-[#f3efe7]'
                }`}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  className="shrink-0 text-[#5A5A40]"
                  aria-hidden="true"
                >
                  {isChecked ? (
                    <CheckSquare size={18} className="text-emerald-700 fill-emerald-100" />
                  ) : (
                    <Square size={18} className="text-[#8c8c73]" />
                  )}
                </button>
                <span
                  className={`text-xs font-medium leading-relaxed ${
                    isChecked ? 'line-through text-slate-500' : 'text-[#434338]'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Official Disclaimer */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-900 leading-relaxed">
          <AlertTriangle size={15} className="text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>{t.officialNoticeTitle}</strong> {t.officialNoticeText}
          </span>
        </div>
      </div>

      {/* 3 Columns: BEFORE, DURING, AFTER PROTOCOLS */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a7a67] mb-3">
          {t.phasedSurvivalTitle} ({getDisasterName(selectedDisaster)})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BEFORE */}
          <div className="bg-white border border-[#e8e4db] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#e8e4db]">
              <Clock size={15} className="text-[#5A5A40]" />
              <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5A5A40]">
                {t.beforePrepPhase}
              </h5>
            </div>
            <ul className="space-y-2">
              {currentProtocolGuide.before.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#434338] leading-relaxed">
                  <span className="text-[#5A5A40] font-bold">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DURING */}
          <div className="bg-[#faf3eb] border border-[#ecdacb] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#ecdacb]">
              <AlertCircle size={15} className="text-[#B37D4E]" />
              <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B37D4E]">
                {t.duringSurvivalPhase}
              </h5>
            </div>
            <ul className="space-y-2">
              {currentProtocolGuide.during.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#434338] font-medium leading-relaxed">
                  <span className="text-[#D4A373] font-bold">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AFTER */}
          <div className="bg-[#eef1eb] border border-[#d8ded3] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#d8ded3]">
              <CheckCircle2 size={15} className="text-[#5A5A40]" />
              <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5A5A40]">
                {t.afterRecoveryPhase}
              </h5>
            </div>
            <ul className="space-y-2">
              {currentProtocolGuide.after.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#434338] leading-relaxed">
                  <span className="text-[#5A5A40] font-bold">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
