import React, { useState } from 'react';
import { AuthorityProfile } from '../types';
import { ShieldAlert, X, Lock, KeyRound, AlertCircle, PhoneCall, HelpCircle, Building2 } from 'lucide-react';
import { BackButton } from './BackButton';
import { auth } from '../lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';

interface AuthorityAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (authority: AuthorityProfile, token: string) => void;
}

type AuthorityViewMode = 'LOGIN' | 'RECOVERY_HELP';

export const AuthorityAuthModal: React.FC<AuthorityAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<AuthorityViewMode>('LOGIN');
  const [authorityId, setAuthorityId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleBack = () => {
    if (mode === 'RECOVERY_HELP') {
      setMode('LOGIN');
      setErrorMsg(null);
    } else {
      if (authorityId.trim() || password) {
        const confirmClose = window.confirm('You have entered credentials. Are you sure you want to go back?');
        if (!confirmClose) return;
      }
      onClose();
    }
  };

  const handleClose = () => {
    if (authorityId.trim() || password) {
      const confirmClose = window.confirm('You have entered credentials. Are you sure you want to exit?');
      if (!confirmClose) return;
    }
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/authority/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorityId: authorityId.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication rejected. Verify credentials.');

      try {
        if (auth) {
          const userCredential = await signInWithCustomToken(auth, data.token);
          const idToken = await userCredential.user.getIdToken();
          data.token = idToken;
        }
      } catch (err) {
        console.error('Failed to sign in to Firebase with custom token', err);
      }

      localStorage.setItem('suraksha_auth_token', data.token);
      onLoginSuccess(data.authority, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#434338]/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#fdfbf7] rounded-3xl shadow-xl border border-[#e8e4db] overflow-hidden flex flex-col">
        {/* Official Header */}
        <div className="bg-[#5A5A40] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4A373] text-white rounded-xl">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3
                className="text-base font-bold tracking-tight font-serif"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                AUTHORITY COMMAND ACCESS
              </h3>
              <p className="text-xs text-white/80">
                Disaster Response & Emergency Operations Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Back Navigation Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#f5f2ea] border-b border-[#e8e4db]">
          <BackButton
            onClick={handleBack}
            label={mode === 'RECOVERY_HELP' ? 'Command Login' : 'Entry Portal'}
          />
          <span className="text-[10px] font-bold text-[#8c8c73] uppercase tracking-wider">
            {mode === 'LOGIN' ? 'Officer Verification' : 'Passkey Recovery Help'}
          </span>
        </div>

        {/* Security Warning Notice */}
        <div className="bg-[#faf3eb] px-6 py-2.5 border-b border-[#ecdacb] text-xs text-[#B37D4E] font-medium leading-relaxed">
          Authorised emergency response personnel only. All access attempts and administrative operations are recorded in immutable audit logs.
        </div>

        {/* Form Body */}
        {mode === 'LOGIN' ? (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-[#faecea] border border-[#efc7c3] rounded-xl text-xs text-[#8B3A3A] font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="text-[#8B3A3A] flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block mb-1">
                Official Authority ID
              </label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 26101AP254"
                  value={authorityId}
                  onChange={(e) => setAuthorityId(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono font-bold bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none uppercase text-[#434338]"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73]">
                  Access Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('RECOVERY_HELP')}
                  className="text-[11px] text-[#5A5A40] hover:text-[#434338] font-medium underline cursor-pointer"
                >
                  Credential Help?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                <input
                  type="password"
                  required
                  placeholder="Enter authority passkey"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-semibold text-xs rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Verifying Identity & Role...' : 'AUTHENTICATE & ENTER COMMAND'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="p-4 bg-white border border-[#e8e4db] rounded-2xl space-y-3">
              <div className="flex items-center gap-2.5 text-[#5A5A40] font-bold text-xs">
                <Building2 size={16} />
                <span>State Emergency Operations Centre (SEOC) Help Desk</span>
              </div>
              <p className="text-xs text-[#5c5c4e] leading-relaxed">
                Authority passkeys are provisioned by District Disaster Management Authorities (DDMA) or the State Emergency Operations Centre.
              </p>
              <div className="p-3 bg-[#f5f2ea] rounded-xl space-y-1 text-xs">
                <p className="font-semibold text-[#434338]">Dedicated Verification Helplines:</p>
                <p className="font-mono text-[#5A5A40] font-bold">State Control Room: 1070 / 0891-2565112</p>
                <p className="font-mono text-[#5A5A40] font-bold">NDRF Battalion Dispatch: 011-24363260</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMode('LOGIN')}
              className="w-full py-2.5 px-4 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-semibold text-xs rounded-full transition-all uppercase tracking-wider cursor-pointer"
            >
              Return to Command Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
