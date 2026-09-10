import React, { useState } from 'react';
import { BackButton } from './BackButton';
import {
  Shield,
  PhoneCall,
  CheckSquare,
  Square,
  AlertTriangle,
  Waves,
  Wind,
  Mountain,
  Flame,
  LifeBuoy,
  FileText,
  Flashlight,
  Droplets,
  Package,
  Bot
} from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface SafetyDetailViewProps {
  onBack: () => void;
  backLabel?: string;
  onOpenChatbot?: (prompt?: string, role?: 'first_aid' | 'disaster_survival' | 'civil_protection' | 'incident_command') => void;
  language?: LanguageCode;
}

export const SafetyDetailView: React.FC<SafetyDetailViewProps> = ({
  onBack,
  backLabel,
  onOpenChatbot,
  language = 'en'
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const EMERGENCY_CONTACTS = [
    { name: t.nationalEmergency112, number: '112', purpose: t.emergencyHelplines },
    { name: t.ndmaControlRoom, number: '1078', purpose: t.officialNdmaGuidelines },
    { name: t.sdmaControlRoom, number: '1070', purpose: t.disasterPreparednessStandards },
    { name: t.deocDispatch, number: '1077', purpose: t.districtCollectorate },
    { name: t.coastGuardSAR, number: '1554', purpose: t.coastalDistress },
    { name: t.ambulance108, number: '108', purpose: t.medicalTrauma }
  ];

  const EVACUATION_KIT_ITEMS = [
    { id: 'water', label: 'Potable Drinking Water (At least 3 Litres per person)', category: 'Hydration' },
    { id: 'food', label: 'Ready-to-eat dry rations (Biscuits, nuts, ORS packets)', category: 'Nutrition' },
    { id: 'meds', label: 'Essential prescription medicines & basic first-aid kit', category: 'Medical' },
    { id: 'torch', label: 'LED Flashlight / Torch with extra spare dry batteries', category: 'Lighting' },
    { id: 'docs', label: 'Aadhaar cards, insurance & property deeds in waterproof pouch', category: 'Identity' },
    { id: 'power', label: 'Charged power bank with mobile phone USB charging cables', category: 'Communication' },
    { id: 'cash', label: 'Emergency cash in small denominations (ATMs lose grid power)', category: 'Finance' },
    { id: 'whistle', label: 'Emergency rescue whistle & high-visibility cloth', category: 'Signaling' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <BackButton onClick={onBack} label={backLabel || t.back} />
        <span className="text-xs font-semibold text-slate-500">
          {t.officialNdmaGuidelines}
        </span>
      </div>

      {/* Main Safety Content */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t.disasterPreparednessStandards}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {t.citizenSurvivalDirectory}
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            {t.citizenSurvivalSubtitle}
          </p>
        </div>

        {/* Emergency Helplines Grid */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <PhoneCall size={16} className="text-rose-700" />
            <span>{t.emergencyHelplines}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.number}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">{contact.name}</span>
                  <span className="text-slate-500 text-[11px]">{contact.purpose}</span>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg shrink-0 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <PhoneCall size={12} />
                  <span>{contact.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Evacuation Bag Checklist */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package size={16} className="text-emerald-700" />
              <span>{t.emergencyGoBagTitle}</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-800">
              {Object.values(checkedItems).filter(Boolean).length} / {EVACUATION_KIT_ITEMS.length} {t.packed}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            {t.keepPrepackedBag}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {EVACUATION_KIT_ITEMS.map((item) => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-3 transition-colors cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <Square size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={`font-semibold ${isChecked ? 'line-through text-emerald-800' : 'text-slate-900'}`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {t.category}: {item.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specific Hazard Directives */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {t.criticalDirectivesPhase}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Wind size={16} className="text-amber-700" />
                <span>{t.duringSevereCyclones}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                {t.emergencyInstructions.CYCLONE.during.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Waves size={16} className="text-blue-700" />
                <span>{t.duringUrbanFlooding}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                {t.emergencyInstructions.FLOOD.during.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Safety Assistant Callout */}
        {onOpenChatbot && (
          <div className="p-5 bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#edf0ea] border border-[#d8ded3] flex items-center justify-center text-[#5A5A40] shrink-0 mt-0.5">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#434338] font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                  {t.haveCustomQuestions}
                </h3>
                <p className="text-xs text-[#7a7a67] mt-0.5">
                  {t.consultAiAssistant}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenChatbot('What safety precautions should I take for my specific emergency?', 'disaster_survival')}
              className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Bot size={14} />
              <span>{t.askAiAssistant}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
