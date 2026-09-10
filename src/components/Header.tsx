import React from 'react';
import { ShieldLogo } from './ShieldLogo';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import { UserProfile, AuthorityProfile, SyncStatus } from '../types';
import { Shield, PhoneCall, Globe, Wifi, WifiOff, LogOut, UserCheck, Settings, Bot, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  publicUser: UserProfile | null;
  authorityUser: AuthorityProfile | null;
  onOpenPublicAuth: () => void;
  onOpenAuthorityAuth: () => void;
  onLogout: () => void;
  isOnline: boolean;
  syncStatus?: SyncStatus;
  activeRole: 'ENTRY' | 'PUBLIC_AUTH' | 'PUBLIC' | 'AUTHORITY';
  onNavigateHome: () => void;
  onOpenSettings?: () => void;
  onOpenChatbot?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  publicUser,
  authorityUser,
  onOpenPublicAuth,
  onOpenAuthorityAuth,
  onLogout,
  isOnline,
  syncStatus = 'ONLINE',
  activeRole,
  onNavigateHome,
  onOpenSettings,
  onOpenChatbot
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7] border-b border-[#e8e4db] shadow-xs">
      {/* Natural tricolor safety accent band */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#D4A373]"></div>
        <div className="w-1/3 bg-[#f5f5f0]"></div>
        <div className="w-1/3 bg-[#5A5A40]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand mark */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-[#5A5A40] rounded-xl p-1 cursor-pointer"
          aria-label="SURAKSHA Home"
        >
          <ShieldLogo size={34} />
        </button>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Helpline Pill */}
          <a
            href="tel:112"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#8B3A3A] bg-[#f8efed] border border-[#ecd5d2] rounded-full hover:bg-[#f3e4e1] transition-colors"
            title="National Emergency Helpline"
          >
            <PhoneCall size={13} className="text-[#8B3A3A]" />
            <span>112 {t.sosNav}</span>
          </a>

          {/* SOS & Alert Synchronization Status Indicator */}
          <div
            role="status"
            aria-live="polite"
            aria-label={`SOS and Alert Sync Status: ${syncStatus}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
              syncStatus === 'ONLINE'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : syncStatus === 'SYNCING'
                ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title={
              syncStatus === 'ONLINE'
                ? 'SOS & Alert Sync: ONLINE (Connected to Incident Command)'
                : syncStatus === 'SYNCING'
                ? 'SOS & Alert Sync: SYNCING (Synchronizing SOS/Alert Telemetry)'
                : 'SOS & Alert Sync: OFFLINE (Distress signals queued locally)'
            }
          >
            {syncStatus === 'ONLINE' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                <span className="font-bold tracking-wider">{t.online}</span>
              </>
            )}
            {syncStatus === 'SYNCING' && (
              <>
                <RefreshCw size={12} className="text-amber-600 animate-spin" />
                <span className="font-bold tracking-wider">{t.syncing}</span>
              </>
            )}
            {syncStatus === 'OFFLINE' && (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="font-bold tracking-wider">{t.offline}</span>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative inline-flex items-center" id="header-language-selector-wrap">
            <Globe size={14} className="absolute left-3 text-[#8c8c73] pointer-events-none" />
            <select
              id="header-language-select"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              aria-label={t.selectLanguage}
              className="pl-8 pr-3 py-1.5 text-xs font-medium text-[#434338] bg-[#f1efe9] border border-[#e8e4db] rounded-full hover:bg-[#e9e6df] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] cursor-pointer transition-colors"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          {/* AI Safety Assistant Button */}
          {onOpenChatbot && (
            <button
              type="button"
              id="header-ai-assistant-btn"
              onClick={onOpenChatbot}
              aria-label={t.aiAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5A5A40] bg-[#f2f4ee] hover:bg-[#e6ebd7] border border-[#d8ded3] rounded-full transition-all cursor-pointer shadow-2xs"
              title={t.aiAssistant}
            >
              <Bot size={14} className="text-[#5A5A40]" />
              <span className="hidden sm:inline">{t.aiAssistant}</span>
            </button>
          )}

          {/* Settings Button */}
          {onOpenSettings && (
            <button
              type="button"
              id="header-settings-btn"
              onClick={onOpenSettings}
              aria-label={t.settings}
              className="p-2 text-[#7a7a67] hover:text-[#434338] hover:bg-[#f1efe9] rounded-full transition-colors cursor-pointer"
              title={t.settings}
            >
              <Settings size={16} />
            </button>
          )}

          {/* User Auth Info / Switcher */}
          {authorityUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right text-xs leading-tight">
                <span className="font-semibold text-[#434338] flex items-center gap-1 justify-end">
                  <UserCheck size={12} className="text-[#5A5A40]" />
                  {authorityUser.name}
                </span>
                <span className="text-[#8c8c73] font-mono text-[10px]">{authorityUser.authorityId}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-[#7a7a67] hover:text-[#434338] hover:bg-[#f1efe9] rounded-full transition-colors cursor-pointer"
                title={t.signOut}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : publicUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right text-xs leading-tight">
                <span className="font-semibold text-[#434338]">{publicUser.fullName}</span>
                <span className="text-[#8c8c73] text-[10px]">{publicUser.email || publicUser.phoneNumber || publicUser.phone}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-[#7a7a67] hover:text-[#434338] hover:bg-[#f1efe9] rounded-full transition-colors cursor-pointer"
                title={t.signOut}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {activeRole !== 'PUBLIC_AUTH' && (
                <button
                  onClick={onOpenPublicAuth}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#5A5A40] bg-[#f1efe9] hover:bg-[#e9e6df] border border-[#e8e4db] rounded-full transition-colors cursor-pointer"
                >
                  {t.signIn}
                </button>
              )}
              <button
                onClick={onOpenAuthorityAuth}
                className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-white bg-[#5A5A40] hover:bg-[#4a4a34] rounded-full transition-colors shadow-sm shadow-[#5A5A40]/10 cursor-pointer"
              >
                {t.authorityPortal}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
