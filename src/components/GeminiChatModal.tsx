/**
 * SURAKSHA Gemini AI Disaster Chat Interface
 * 
 * Implements multi-turn conversation with scrollable thread, role switching,
 * model speed tier selection (flash-lite, 3.5-flash, 3.1-pro), and top Back navigation.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
  HeartPulse,
  ShieldAlert,
  Building2,
  Radio,
  Zap,
  Cpu,
  BrainCircuit,
  PhoneCall,
  Check,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { BackButton } from './BackButton';

export type AssistantRoleId = 'first_aid' | 'disaster_survival' | 'civil_protection' | 'incident_command';
export type ModelTier = 'fast' | 'general' | 'complex';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  roleId?: AssistantRoleId;
  roleName?: string;
  isFallback?: boolean;
}

interface RoleConfig {
  id: AssistantRoleId;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  tagline: string;
  systemSummary: string;
  suggestedPrompts: string[];
}

const ROLES: RoleConfig[] = [
  {
    id: 'first_aid',
    name: 'Emergency First Aid & Life Safety',
    shortName: 'First Aid',
    icon: <HeartPulse size={16} className="text-[#8B3A3A]" />,
    tagline: 'Urgent medical stabilization & CPR before rescue teams arrive',
    systemSummary: 'Prioritizes life-saving triage, CPR steps, bleeding control, and shock treatment.',
    suggestedPrompts: [
      'How do I perform hands-only CPR on an adult?',
      'How to control severe arterial bleeding from a limb?',
      'Immediate first aid treatment for a heatstroke victim?',
      'What to do for someone who nearly drowned in floodwater?'
    ]
  },
  {
    id: 'disaster_survival',
    name: 'Disaster Survival & Evacuation',
    shortName: 'Survival & Evacuation',
    icon: <ShieldAlert size={16} className="text-[#D4A373]" />,
    tagline: 'Active cyclone, flood, earthquake, & landslide survival tactics',
    systemSummary: 'Immediate physical survival, safe room selection, and evacuation route logistics.',
    suggestedPrompts: [
      'What should I do immediately during a sudden earthquake?',
      'What emergency supplies belong in a 72-hour cyclone Go-Bag?',
      'How to safely evacuate a flooded house with elderly family?',
      'How can I purify contaminated flood water for drinking?'
    ]
  },
  {
    id: 'civil_protection',
    name: 'NDMA & Civil Protection Advisor',
    shortName: 'NDMA & Schemes',
    icon: <Building2 size={16} className="text-[#5A5A40]" />,
    tagline: 'Official NDMA/SDRF disaster relief guidelines, helplines & compensation',
    systemSummary: 'Provides verified official Indian civil protection advisories and relief documentation.',
    suggestedPrompts: [
      'What do NDMA Yellow, Orange, and Red weather alerts mean?',
      'What documents do I need to claim SDRF flood damage relief?',
      'What are the official national and state disaster helpline numbers?',
      'What relief materials are provided at government evacuation centers?'
    ]
  },
  {
    id: 'incident_command',
    name: 'Command & Triage Operations',
    shortName: 'Incident Command',
    icon: <Radio size={16} className="text-[#434338]" />,
    tagline: 'Tactical incident triage, shelter logistics, and team dispatch analysis',
    systemSummary: 'Assists rescue teams and incident commanders with sitreps and tactical triage.',
    suggestedPrompts: [
      'Generate a standardized SitRep template for a flood zone.',
      'How to triage multiple rescue requests with limited boat teams?',
      'Recommended protocol for industrial chemical hazard containment?',
      'Shelter sanitation checklist to prevent waterborne disease outbreaks.'
    ]
  }
];

interface ModelOption {
  tier: ModelTier;
  id: string;
  name: string;
  speed: string;
  badge: string;
  icon: React.ReactNode;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    tier: 'fast',
    id: 'gemini-3.1-flash-lite',
    name: 'Fast Response',
    speed: 'Ultra-low latency',
    badge: '3.1 Flash-Lite',
    icon: <Zap size={14} className="text-[#D4A373]" />
  },
  {
    tier: 'general',
    id: 'gemini-3.5-flash',
    name: 'General Safety',
    speed: 'Balanced intelligence',
    badge: '3.5 Flash',
    icon: <Cpu size={14} className="text-[#5A5A40]" />
  },
  {
    tier: 'complex',
    id: 'gemini-3.1-pro-preview',
    name: 'Complex Analysis',
    speed: 'Deep reasoning',
    badge: '3.1 Pro Preview',
    icon: <BrainCircuit size={14} className="text-[#8B3A3A]" />
  }
];

import { LanguageCode, TRANSLATIONS } from '../i18n/translations';

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromPageLabel?: string;
  initialRole?: AssistantRoleId;
  initialPrompt?: string;
  language?: LanguageCode;
}

const STORAGE_KEY = 'suraksha_gemini_chat_history_v1';

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({
  isOpen,
  onClose,
  fromPageLabel = 'Public Dashboard',
  initialRole = 'disaster_survival',
  initialPrompt,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeRole, setActiveRole] = useState<AssistantRoleId>(initialRole);
  const [modelTier, setModelTier] = useState<ModelTier>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content:
          'Namaste. I am SURAKSHA\'s Gemini Disaster Safety Assistant.\n\nI provide real-time, multi-turn emergency guidance on:\n- **Life-saving first aid & CPR**\n- **Evacuation tactics during cyclones, floods, & earthquakes**\n- **NDMA & SDRF relief guidelines & helplines**\n\nHow can I help you stay safe today?',
        timestamp: new Date().toISOString(),
        modelUsed: 'gemini-3.5-flash',
        roleId: 'disaster_survival',
        roleName: 'Disaster Survival & Evacuation'
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial role and prompt
  useEffect(() => {
    if (initialRole) setActiveRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    if (isOpen && initialPrompt && initialPrompt.trim()) {
      setInputMessage(initialPrompt.trim());
    }
  }, [isOpen, initialPrompt]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  if (!isOpen) return null;

  const currentRoleConfig = ROLES.find((r) => r.id === activeRole) || ROLES[1];

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputMessage).trim();
    if (!messageText || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    const nextHistory = [...messages, newUserMessage];
    setMessages(nextHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare history payload for server-side multi-turn processing
      const historyPayload = nextHistory
        .filter((m) => m.id !== 'welcome-1')
        .slice(-12)
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: historyPayload,
          roleId: activeRole,
          taskComplexity: modelTier
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with HTTP ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No advice received. In urgent danger, call 112.',
        timestamp: data.timestamp || new Date().toISOString(),
        modelUsed: data.modelUsed,
        roleId: data.roleId || activeRole,
        roleName: data.roleName || currentRoleConfig.name,
        isFallback: data.isFallback
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('[GeminiChatModal] Error sending message:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          `**Safety Advisory Notice:**\n` +
          `Unable to connect to the cloud Gemini engine. If this is a life-threatening emergency, immediately call **112 (National Emergency Helpline)** or **108 (Ambulance)**.\n\n` +
          `*(Error: ${err?.message || 'Network timeout'})*`,
        timestamp: new Date().toISOString(),
        modelUsed: 'Offline Emergency Fallback',
        roleId: activeRole,
        isFallback: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all conversation history with the safety assistant?')) {
      const resetWelcome: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          `Conversation cleared. I am ready to help with **${currentRoleConfig.name}**.\n\nAsk any question or pick a suggested topic below.`,
        timestamp: new Date().toISOString(),
        modelUsed: 'gemini-3.5-flash',
        roleId: activeRole,
        roleName: currentRoleConfig.name
      };
      setMessages([resetWelcome]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl h-[94vh] sm:h-[88vh] bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e8e4db] flex flex-col overflow-hidden">
        {/* Top Header with Back Navigation */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#e8e4db] bg-[#fdfbf7] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <BackButton
              onClick={onClose}
              label={fromPageLabel}
              id="gemini-chat-top-back"
            />
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#e8e4db]">
              <div className="w-8 h-8 rounded-xl bg-[#edf0ea] border border-[#d8ded3] flex items-center justify-center text-[#5A5A40]">
                <Bot size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#434338] leading-tight flex items-center gap-1.5 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                  {t.surakshaAiAssistant || 'SURAKSHA AI Assistant'}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#e9ebe4] text-[#5A5A40]">
                    {t.gemini3 || 'Gemini 3'}
                  </span>
                </h2>
                <p className="text-[11px] text-[#7a7a67]">
                  {t.aiSubtitle || 'Multi-turn emergency & disaster civil safety intelligence'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#8B3A3A] bg-[#faecea] border border-[#efc7c3] rounded-full hover:bg-[#f5dad6] transition-colors"
              title="Immediate Emergency Helpline 112"
            >
              <PhoneCall size={12} />
              <span>112</span>
            </a>
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 rounded-xl text-[#8c8c73] hover:text-[#434338] hover:bg-[#f1efe9] transition-colors cursor-pointer"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#8c8c73] hover:text-[#434338] hover:bg-[#f1efe9] transition-colors cursor-pointer"
              title="Close chat"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Role & Model Controls Strip */}
        <div className="px-4 py-2.5 sm:px-6 bg-[#f7f5f0] border-b border-[#e8e4db] flex flex-col gap-2 shrink-0">
          {/* Role selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c8c73] shrink-0 mr-1">
              {t.roleLabel || 'Role:'}
            </span>
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  activeRole === role.id
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-white text-[#5A5A40] border border-[#e8e4db] hover:bg-[#f0ede6]'
                }`}
              >
                {role.icon}
                <span>{role.shortName}</span>
              </button>
            ))}
          </div>

          {/* Model selector & role summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c8c73]">
                {t.modelSpeed || 'Model Speed:'}
              </span>
              <div className="inline-flex bg-white border border-[#e8e4db] rounded-lg p-0.5 shadow-2xs">
                {MODEL_OPTIONS.map((opt) => {
                  let localizedBadge = opt.badge;
                  if (opt.badge === 'Fast') localizedBadge = t.fastResponse || 'Fast Response';
                  else if (opt.badge === 'General') localizedBadge = t.generalSafety || 'General Safety';
                  else if (opt.badge === 'Complex') localizedBadge = t.complexAnalysis || 'Complex Analysis';

                  return (
                    <button
                      key={opt.tier}
                      type="button"
                      onClick={() => setModelTier(opt.tier)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        modelTier === opt.tier
                          ? 'bg-[#5A5A40] text-white shadow-xs'
                          : 'text-[#7a7a67] hover:text-[#434338]'
                      }`}
                      title={`${opt.name} (${opt.speed})`}
                    >
                      {opt.icon}
                      <span>{localizedBadge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-[#7a7a67] hidden md:block italic truncate max-w-xs">
              {currentRoleConfig.tagline}
            </p>
          </div>
        </div>

        {/* Scrollable Chat Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fdfbf7]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Speaker metadata */}
                <div className="flex items-center gap-2 mb-1 px-1 text-[10px] font-semibold text-[#8c8c73]">
                  {isUser ? (
                    <span>{t.you || 'You'}</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#5A5A40]">
                      <Bot size={12} />
                      <span>{msg.roleName || (t.surakshaAiAssistant || 'SURAKSHA Safety Advisor')}</span>
                      {msg.modelUsed && (
                        <span className="bg-[#e9ebe4] text-[#5A5A40] px-1.5 py-0.2 rounded font-mono text-[9px]">
                          {msg.modelUsed}
                        </span>
                      )}
                    </span>
                  )}
                  <span>•</span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#5A5A40] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white border border-[#e8e4db] text-[#434338] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words font-sans">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-[#e8e4db]/60 flex items-center justify-between text-[10px] text-[#8c8c73]">
                      <span className="italic">
                        {msg.isFallback ? (t.emergencyOfflineProtocol || 'Emergency offline protocol') : (t.aiSafetyGuidance || 'AI Safety Guidance')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 text-[#7a7a67] hover:text-[#434338] transition-colors cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <Check size={11} className="text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">{t.copiedBtn || 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>{t.copyBtn || 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="bg-white border border-[#e8e4db] rounded-2xl rounded-tl-xs p-3.5 shadow-2xs flex items-center gap-2 text-xs text-[#7a7a67]">
                <RefreshCw size={14} className="animate-spin text-[#5A5A40]" />
                <span className="font-medium">{t.consultingGemini || 'Consulting Gemini Disaster Safety Engine...'}</span>
                <span className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts for active role */}
        <div className="px-4 py-2 sm:px-6 bg-[#f7f5f0] border-t border-[#e8e4db] overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c8c73] shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-[#D4A373]" />
              {t.suggestionsLabel || 'Suggestions:'}
            </span>
            {currentRoleConfig.suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 text-[11px] font-medium bg-white text-[#5A5A40] border border-[#e8e4db] rounded-full hover:bg-[#e9ece3] transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 sm:p-4 bg-[#fdfbf7] border-t border-[#e8e4db] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`${t.askRolePlaceholder || 'Ask'} ${currentRoleConfig.name}... (${t.pressEnterToSend || 'Press Enter to send'})`}
                rows={2}
                disabled={isLoading}
                className="w-full p-3 text-xs sm:text-sm bg-white border border-[#e8e4db] rounded-2xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338] resize-none placeholder:text-[#8c8c73]"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="h-12 w-12 rounded-2xl bg-[#5A5A40] hover:bg-[#4a4a34] text-white flex items-center justify-center transition-all shadow-sm shadow-[#5A5A40]/20 disabled:opacity-40 cursor-pointer shrink-0"
              aria-label="Send emergency question"
            >
              {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>

          {/* Emergency Safety Footer Disclaimer */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#8c8c73] px-1">
            <span className="flex items-center gap-1 text-[#8B3A3A] font-medium">
              <AlertTriangle size={11} />
              {t.inLifeThreateningDanger || 'In life-threatening danger,'} {t.call112Immediately || 'call 112 / 108 immediately.'}
            </span>
            <span className="hidden sm:inline">
              {t.roleLabel || 'Role:'} <strong className="text-[#434338]">{currentRoleConfig.shortName}</strong> • {t.modelSpeed || 'Model:'} <strong className="text-[#434338]">{modelTier}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
