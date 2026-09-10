import React from 'react';
import { ShieldLogo } from './ShieldLogo';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import { Shield, ShieldAlert, ArrowRight, PhoneCall, Globe } from 'lucide-react';

interface EntryScreenProps {
  onSelectPublic: () => void;
  onSelectAuthority: () => void;
  onOpenHelpline: () => void;
  onOpenPublicAuth?: () => void;
  language?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({
  onSelectPublic,
  onSelectAuthority,
  onOpenHelpline,
  onOpenPublicAuth,
  language = 'en',
  onLanguageChange
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-10 bg-[#f5f5f0]">
      <div className="relative w-full max-w-lg bg-[#fdfbf7] border border-[#e8e4db] rounded-3xl shadow-sm p-8 sm:p-10 text-center overflow-hidden">
        {/* Ambient decorative natural accents */}
        <div className="w-48 h-48 bg-[#D4A373] rounded-full opacity-10 absolute -right-12 -bottom-12 pointer-events-none"></div>
        <div className="w-36 h-36 bg-[#5A5A40] rounded-full opacity-5 absolute -left-8 -top-8 pointer-events-none"></div>

        {/* Quick Language Switcher Bar */}
        {onLanguageChange && (
          <div className="flex items-center justify-center gap-1.5 mb-6 relative z-10">
            <span className="text-xs text-[#8c8c73] flex items-center gap-1 mr-1">
              <Globe size={13} />
            </span>
            {[
              { code: 'en', label: 'English' },
              { code: 'te', label: 'తెలుగు' },
              { code: 'hi', label: 'हिन्दी' }
            ].map((l) => (
              <button
                key={l.code}
                type="button"
                id={`entry-lang-${l.code}`}
                onClick={() => onLanguageChange(l.code as LanguageCode)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-white border border-[#e8e4db] text-[#7a7a67] hover:bg-[#f1efe9]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* Logo and Shield Emblem */}
        <div className="flex justify-center mb-6 relative z-10">
          <ShieldLogo size={68} showText={false} />
        </div>

        <h1
          className="text-4xl font-bold tracking-tight text-[#434338] mb-2 font-serif relative z-10"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {t.appName}
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#8c8c73] mb-3 relative z-10">
          {t.entryProtectionTag}
        </p>
        <div className="mb-8 max-w-sm mx-auto leading-relaxed relative z-10">
          <p className="text-lg font-serif italic text-[#5A5A40]">
            {t.entryQuote}
          </p>
          <span className="block text-xs not-italic text-[#8c8c73] mt-1 font-sans tracking-wide">
            {t.entryQuoteTagline}
          </span>
        </div>

        {/* Primary Selection Options */}
        <div className="space-y-4 mb-8 relative z-10">
          <button
            onClick={onSelectPublic}
            id="entry-public-portal-btn"
            className="w-full group flex items-center justify-between p-5 bg-white hover:bg-[#f1efe9] border border-[#e8e4db] hover:border-[#5A5A40] rounded-2xl text-left transition-all shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#eef1eb] text-[#5A5A40] rounded-xl group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                <Shield size={24} />
              </div>
              <div>
                <h2
                  className="font-bold text-[#434338] text-base group-hover:text-[#5A5A40] font-serif"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {t.publicPortalCardTitle}
                </h2>
                <p className="text-xs text-[#8c8c73]">
                  {t.publicPortalCardDesc}
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-[#8c8c73] group-hover:text-[#5A5A40] transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onSelectAuthority}
            id="entry-authority-desk-btn"
            className="w-full group flex items-center justify-between p-5 bg-white hover:bg-[#f1efe9] border border-[#e8e4db] hover:border-[#D4A373] rounded-2xl text-left transition-all shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#faf3eb] text-[#D4A373] rounded-xl group-hover:bg-[#D4A373] group-hover:text-white transition-colors">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h2
                  className="font-bold text-[#434338] text-base group-hover:text-[#B37D4E] font-serif"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {t.authorityDeskCardTitle}
                </h2>
                <p className="text-xs text-[#8c8c73]">
                  {t.authorityDeskCardDesc}
                </p>
              </div>
            </div>
            <ArrowRight size={18} className="text-[#8c8c73] group-hover:text-[#D4A373] transition-transform group-hover:translate-x-1" />
          </button>

          {onOpenPublicAuth && (
            <div className="pt-2 text-center">
              <button
                type="button"
                id="entry-citizen-account-btn"
                onClick={onOpenPublicAuth}
                className="text-xs font-semibold text-[#5A5A40] hover:text-[#434338] underline underline-offset-4 decoration-[#D4A373] cursor-pointer transition-colors"
              >
                {t.citizenAccountLink}
              </button>
            </div>
          )}
        </div>

        {/* Notice line */}
        <div className="pt-5 border-t border-[#e8e4db] relative z-10">
          <p className="text-xs text-[#8c8c73] leading-relaxed mb-4 font-normal">
            {t.entryOfficialAdvisories}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#7a7a67]">
            <a
              href="tel:112"
              className="flex items-center gap-1.5 text-[#8B3A3A] hover:text-[#6b2c2c] transition-colors"
            >
              <PhoneCall size={13} />
              {t.nationalEmergencyNumber}
            </a>
            <span className="text-[#e8e4db] hidden sm:inline">&bull;</span>
            <a
              href="tel:1070"
              className="flex items-center gap-1.5 text-[#5A5A40] hover:text-[#434338] transition-colors"
            >
              {t.disasterHelplineNumber}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
