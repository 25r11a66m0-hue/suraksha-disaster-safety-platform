/**
 * SURAKSHA Citizen Authentication Modal
 * 
 * Flows:
 * 1. Secure Phone OTP Verification using TextBee SMS Gateway
 * 2. Email + Password Registration & Login (Firebase Auth & Cloud Firestore)
 * 3. Password Recovery Workflow
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import {
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  X,
  Smartphone,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { registerCitizen, loginCitizen, sendCitizenPasswordReset } from '../lib/firebaseAuth';
import { BackButton } from './BackButton';

type AuthMode = 'PHONE_OTP' | 'SIGN_IN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'RESET_SENT';

interface PublicAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  initialMode?: 'SIGN_IN' | 'REGISTER' | 'PHONE_OTP';
  fromPageLabel?: string;
  isPage?: boolean;
  language?: LanguageCode;
}

export const PublicAuthModal: React.FC<PublicAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'PHONE_OTP',
  fromPageLabel = 'Main Dashboard',
  isPage = false,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [authHistory, setAuthHistory] = useState<AuthMode[]>([]);

  // Email Password Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Phone OTP Fields
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(300);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setAuthHistory([]);
      setErrorMsg(null);
      setSuccessMsg(null);
      setPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setOtpSent(false);
      setOtpCooldown(0);
    }
  }, [isOpen, initialMode]);

  // Resend Countdown Timer
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  if (!isOpen) return null;

  const navigateAuthMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;
    setAuthHistory((prev) => [...prev, mode]);
    setMode(nextMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const getBackLabel = (): string => {
    if (authHistory.length > 0) {
      const prevMode = authHistory[authHistory.length - 1];
      if (prevMode === 'PHONE_OTP') return 'Mobile OTP';
      if (prevMode === 'SIGN_IN') return 'Sign In';
      if (prevMode === 'REGISTER') return 'Register';
      if (prevMode === 'FORGOT_PASSWORD') return 'Password Recovery';
      return 'Previous';
    }
    if (mode === 'REGISTER' || mode === 'FORGOT_PASSWORD' || mode === 'RESET_SENT') {
      return 'Sign In';
    }
    return fromPageLabel;
  };

  const handleAuthBack = () => {
    if (mode === 'REGISTER' && (fullName.trim() || email.trim() || password)) {
      const confirmDiscard = window.confirm(
        'You have unsaved information in the registration form. Are you sure you want to go back?'
      );
      if (!confirmDiscard) return;
    }

    if (authHistory.length > 0) {
      const nextHistory = [...authHistory];
      const prevMode = nextHistory.pop()!;
      setAuthHistory(nextHistory);
      setMode(prevMode);
      setErrorMsg(null);
      setSuccessMsg(null);
    } else {
      if (mode === 'FORGOT_PASSWORD' || mode === 'RESET_SENT' || mode === 'REGISTER') {
        setMode('PHONE_OTP');
        setErrorMsg(null);
        setSuccessMsg(null);
      } else {
        onClose();
      }
    }
  };

  const handleClose = () => {
    if (mode === 'REGISTER' && (fullName.trim() || email.trim() || password)) {
      const confirmDiscard = window.confirm(
        'You have unsaved registration information. Are you sure you want to go back?'
      );
      if (!confirmDiscard) return;
    }
    onClose();
  };

  // ==========================================
  // OTP HANDLERS (TextBee Integrated)
  // ==========================================

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otpPhone.trim()) {
      setErrorMsg('Please enter your 10-digit Indian mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: otpPhone })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      setOtpSent(true);
      setOtpCooldown(data.resendCooldownSeconds || 60);
      setOtpExpiresIn(data.expiresInSeconds || 300);
      setSuccessMsg(data.message || 'OTP sent successfully to your registered mobile number.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpCooldown > 0) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: otpPhone })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to send OTP. Please try again.');
      }

      setOtpCooldown(data.resendCooldownSeconds || 60);
      setOtpExpiresIn(data.expiresInSeconds || 300);
      setSuccessMsg(data.message || 'OTP sent successfully to your registered mobile number.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: otpPhone,
          otp: otpCode.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Incorrect or expired verification code.');
      }

      if (data.token) {
        localStorage.setItem('suraksha_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('suraksha_user', JSON.stringify(data.user));
      }

      onLoginSuccess(data.user, data.token || '');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // PASSWORD AUTH HANDLERS
  // ==========================================

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginCitizen({
        email: email.trim(),
        password
      });

      onLoginSuccess(result.user, result.token);
      onClose();
    } catch (err: any) {
      console.error('Sign in error:', err);
      const msg = err?.message || 'Failed to sign in. Please verify credentials.';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setErrorMsg('Invalid email or password. Please check your credentials.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerCitizen({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim() || undefined
      });

      setSuccessMsg('Account created successfully!');
      onLoginSuccess(result.user, result.token);
      onClose();
    } catch (err: any) {
      console.error('Registration error:', err);
      const msg = err?.message || 'Registration failed.';
      if (msg.includes('email-already-in-use')) {
        setErrorMsg('An account with this email address already exists. Please sign in instead.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await sendCitizenPasswordReset(resetEmail.trim());
      setMode('RESET_SENT');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setErrorMsg(err?.message || 'Failed to send reset email. Please verify the address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        isPage
          ? 'min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 bg-[#f5f5f0] w-full animate-in fade-in duration-150'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150'
      }
    >
      <div
        className={
          isPage
            ? 'w-full max-w-md bg-[#fdfbf7] rounded-3xl shadow-sm border border-[#e8e4db] overflow-hidden flex flex-col'
            : 'w-full max-w-md bg-[#fdfbf7] rounded-3xl shadow-xl border border-[#e8e4db] overflow-hidden flex flex-col max-h-[92vh]'
        }
      >
        {/* Top Header with Back Navigation */}
        <div className="p-5 pb-2 flex items-center justify-between border-b border-[#e8e4db]/60">
          <BackButton
            onClick={handleAuthBack}
            label={getBackLabel()}
            id="auth-top-back-btn"
          />
          {!isPage && (
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-[#8c8c73] hover:text-[#434338] hover:bg-[#f1efe9] transition-colors cursor-pointer"
              aria-label="Close authentication"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Title Area matching SURAKSHA Mobile & Desktop Archetype */}
        <div className="px-6 pt-4 pb-2">
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#434338] font-serif"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {mode === 'PHONE_OTP' && t.citizenVerification}
            {mode === 'SIGN_IN' && t.welcomeBack}
            {mode === 'REGISTER' && t.createAccount}
            {mode === 'FORGOT_PASSWORD' && t.passwordRecovery}
            {mode === 'RESET_SENT' && t.checkEmailInbox}
          </h2>
          <p className="text-xs sm:text-sm text-[#7a7a67] font-medium mt-1">
            {mode === 'PHONE_OTP' && 'Fast, secure phone verification via TextBee SMS Gateway.'}
            {mode === 'SIGN_IN' && 'Sign in to access your alerts, family safety, and shelter status.'}
            {mode === 'REGISTER' && 'Register your citizen profile for emergency services.'}
            {mode === 'FORGOT_PASSWORD' && 'Enter your registered email to receive reset instructions.'}
            {mode === 'RESET_SENT' && 'Password reset instructions sent to your email.'}
          </p>
        </div>

        {/* Auth Mode Tabs */}
        {(mode === 'PHONE_OTP' || mode === 'SIGN_IN' || mode === 'REGISTER') && (
          <div className="flex border-b border-[#e8e4db] mx-6 mt-2 text-xs font-semibold text-[#8c8c73]">
            <button
              type="button"
              id="auth-tab-phone-otp"
              onClick={() => navigateAuthMode('PHONE_OTP')}
              className={`flex-1 pb-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'PHONE_OTP'
                  ? 'text-[#5A5A40] border-b-2 border-[#5A5A40] font-bold'
                  : 'hover:text-[#434338]'
              }`}
            >
              <Smartphone size={13} />
              <span>{t.mobileOtp}</span>
            </button>
            <button
              type="button"
              id="auth-tab-password"
              onClick={() => navigateAuthMode('SIGN_IN')}
              className={`flex-1 pb-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'SIGN_IN'
                  ? 'text-[#5A5A40] border-b-2 border-[#5A5A40] font-bold'
                  : 'hover:text-[#434338]'
              }`}
            >
              <Lock size={13} />
              <span>{t.password}</span>
            </button>
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => navigateAuthMode('REGISTER')}
              className={`flex-1 pb-3 text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'REGISTER'
                  ? 'text-[#5A5A40] border-b-2 border-[#5A5A40] font-bold'
                  : 'hover:text-[#434338]'
              }`}
            >
              <User size={13} />
              <span>{t.register}</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className={`p-6 ${isPage ? '' : 'overflow-y-auto'}`}>
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-[#faecea] border border-[#efc7c3] rounded-2xl text-xs text-[#8B3A3A] font-medium flex items-start gap-2.5">
              <AlertCircle size={16} className="text-[#8B3A3A] shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: PHONE OTP VERIFICATION                             */}
          {/* ========================================================= */}
          {mode === 'PHONE_OTP' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                      {t.indianMobileNumber}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-[#5A5A40]">
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        maxLength={10}
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-14 pr-3.5 py-3 text-sm bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338] font-mono tracking-wider font-semibold"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-[#8c8c73] mt-1.5">
                      We will send a cryptographically secure 6-digit OTP valid for 5 minutes.
                    </p>
                  </div>

                  <button
                    type="submit"
                    id="auth-send-otp-btn"
                    disabled={isLoading || otpPhone.trim().length < 10}
                    className="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-bold text-xs rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{t.dispatchingOtp}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.sendOtp}</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-white border border-[#e8e4db] rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#8c8c73] block text-[10px] uppercase">OTP Dispatched To:</span>
                      <span className="font-mono font-bold text-[#434338]">+91 {otpPhone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="text-xs text-[#5A5A40] hover:underline font-semibold cursor-pointer"
                    >
                      {t.changeNumber}
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                      {t.enter6DigitOtp}
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-3.5 py-3 text-center text-lg tracking-[0.4em] bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338] font-mono font-bold"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-[#8c8c73]">
                      <span>Max 3 attempts per code</span>
                      <span>Expires in 5 minutes</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="auth-verify-otp-btn"
                    disabled={isLoading || otpCode.trim().length !== 6}
                    className="w-full py-3.5 px-4 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-bold text-xs rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>{t.verifyingOtp}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.verifyOtpContinue}</span>
                        <CheckCircle2 size={15} />
                      </>
                    )}
                  </button>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[#8c8c73]">Didn't receive code?</span>
                    {otpCooldown > 0 ? (
                      <span className="text-[#8c8c73] font-mono">
                        Resend in {otpCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-[#5A5A40] hover:text-[#434338] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>{t.resendOtp}</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: EMAIL / PASSWORD SIGN IN                           */}
          {/* ========================================================= */}
          {mode === 'SIGN_IN' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73]">
                    {t.password}
                  </label>
                  <button
                    type="button"
                    onClick={() => navigateAuthMode('FORGOT_PASSWORD')}
                    className="text-[11px] text-[#5A5A40] hover:text-[#434338] font-semibold cursor-pointer"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="auth-password-signin-btn"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-semibold text-xs rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>{t.signIn}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 3: REGISTER NEW CITIZEN                               */}
          {/* ========================================================= */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                  {t.fullName}
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                    {t.password}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                  {t.indianMobileNumber} <span className="text-[#8c8c73] font-normal lowercase">(optional — for SMS alerts)</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338] font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="auth-register-submit-btn"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-semibold text-xs rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>{t.createAccount}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 4: FORGOT PASSWORD                                    */}
          {/* ========================================================= */}
          {mode === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="p-3 bg-[#faf3eb] border border-[#ecdacb] rounded-xl text-xs text-[#B37D4E]">
                <p className="font-semibold mb-0.5">{t.passwordRecovery}</p>
                <p>We'll dispatch a secure recovery link to reset your account credentials.</p>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8c8c73] block mb-1">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                id="auth-forgot-submit-btn"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-semibold text-xs rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Dispatching recovery email...</span>
                  </>
                ) : (
                  <>
                    <span>{t.passwordRecovery}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 5: RESET SENT CONFIRMATION                            */}
          {/* ========================================================= */}
          {mode === 'RESET_SENT' && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#434338]">{t.checkEmailInbox}</h3>
                <p className="text-xs text-[#7a7a67] mt-1">
                  If an account exists for {resetEmail}, you will receive a secure password reset link.
                </p>
              </div>
              <button
                type="button"
                id="auth-return-signin-btn"
                onClick={() => navigateAuthMode('SIGN_IN')}
                className="w-full py-2.5 px-4 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                {t.returnToSignIn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
