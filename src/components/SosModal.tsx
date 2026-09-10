import React, { useState, useEffect } from 'react';
import { SosEmergencyType, LocationCoordinates, SosRequest, EmergencyAlert } from '../types';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import {
  AlertOctagon,
  X,
  MapPin,
  Users,
  HeartPulse,
  Send,
  AlertCircle,
  ShieldAlert,
  Clock,
  Phone,
  User,
  CheckCircle2,
  ArrowLeft,
  Info
} from 'lucide-react';
import { BackButton } from './BackButton';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: LocationCoordinates;
  userName?: string;
  userPhone?: string;
  userId?: string;
  activeAlert?: EmergencyAlert | null;
  onSosSubmitted: (sos: SosRequest) => void;
  language?: LanguageCode;
}

type ModalStep = 'INPUT_FORM' | 'CONFIRMATION_STEP_1' | 'CONFIRMATION_STEP_2' | 'TRANSMITTING';

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  userName,
  userPhone,
  userId,
  activeAlert,
  onSosSubmitted,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [step, setStep] = useState<ModalStep>('INPUT_FORM');
  const [emergencyType, setEmergencyType] = useState<SosEmergencyType>('RESCUE');
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const [medicalAssistance, setMedicalAssistance] = useState<boolean>(false);
  const [areaDescription, setAreaDescription] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [requestTimestamp, setRequestTimestamp] = useState<string>('');

  // Persist draft SOS so accidental page refreshes do not lose emergency details
  useEffect(() => {
    if (!isOpen) return;
    const savedDraft = localStorage.getItem('suraksha_draft_sos');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.emergencyType) setEmergencyType(parsed.emergencyType);
        if (parsed.peopleCount) setPeopleCount(parsed.peopleCount);
        if (typeof parsed.medicalAssistance === 'boolean') setMedicalAssistance(parsed.medicalAssistance);
        if (parsed.areaDescription) setAreaDescription(parsed.areaDescription);
        if (parsed.message) setMessage(parsed.message);
      } catch {
        // ignore parse errors
      }
    }
    setRequestTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const draft = {
        emergencyType,
        peopleCount,
        medicalAssistance,
        areaDescription,
        message,
        timestamp: Date.now()
      };
      localStorage.setItem('suraksha_draft_sos', JSON.stringify(draft));
    }
  }, [isOpen, emergencyType, peopleCount, medicalAssistance, areaDescription, message]);

  if (!isOpen) return null;

  const hasUnsavedData = Boolean(
    areaDescription.trim() || message.trim() || peopleCount > 1 || medicalAssistance
  );

  const handleBackOrClose = () => {
    if (step === 'CONFIRMATION_STEP_2') {
      setStep('CONFIRMATION_STEP_1');
      return;
    }
    if (step === 'CONFIRMATION_STEP_1') {
      setStep('INPUT_FORM');
      return;
    }
    if (hasUnsavedData) {
      const confirmDiscard = window.confirm(
        'You have entered SOS emergency details. Are you sure you want to go back without transmitting?'
      );
      if (!confirmDiscard) return;
    }
    localStorage.removeItem('suraksha_draft_sos');
    onClose();
  };

  const handleProceedToFirstConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setRequestTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    setStep('CONFIRMATION_STEP_1');
  };

  const handleProceedToSecondConfirmation = () => {
    setErrorMsg(null);
    setStep('CONFIRMATION_STEP_2');
  };

  const handleFinalSend = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setStep('TRANSMITTING');

    const hasLocation = typeof userLocation?.latitude === 'number' && typeof userLocation?.longitude === 'number';

    const payload = {
      userId: userId || `user-anon-${Date.now()}`,
      userName: userName || 'Citizen Requester',
      userPhone: userPhone || undefined,
      latitude: hasLocation ? userLocation.latitude : 17.72,
      longitude: hasLocation ? userLocation.longitude : 83.31,
      accuracy: userLocation.accuracy || 10,
      areaDescription: areaDescription || userLocation.areaName || 'Sector Zone',
      emergencyType,
      peopleCount: Number(peopleCount) || 1,
      message: message || `Emergency ${emergencyType} assistance needed.`,
      medicalAssistanceRequired: medicalAssistance,
      status: 'RECEIVED' as const
    };

    try {
      // Check if browser is offline
      if (!navigator.onLine) {
        const offlineId = `SOS-OFFLINE-${Date.now()}`;
        const offlineSos: SosRequest = {
          id: offlineId,
          ...payload,
          userPhone: payload.userPhone || '+91 Unverified Phone',
          status: 'OFFLINE_QUEUED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [
            {
              status: 'CONFIRMED',
              timestamp: new Date().toISOString(),
              note: 'Distress beacon confirmed by citizen offline.'
            },
            {
              status: 'OFFLINE_QUEUED',
              timestamp: new Date().toISOString(),
              note: 'Saved locally on device. Waiting for connection to transmit to Incident Command.'
            }
          ]
        };

        const existingQueue = JSON.parse(localStorage.getItem('suraksha_offline_sos_queue') || '[]');
        existingQueue.push(offlineSos);
        localStorage.setItem('suraksha_offline_sos_queue', JSON.stringify(existingQueue));
        localStorage.setItem('suraksha_active_sos', JSON.stringify(offlineSos));
        localStorage.removeItem('suraksha_draft_sos');

        setIsSubmitting(false);
        onSosSubmitted(offlineSos);
        onClose();
        return;
      }

      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to dispatch SOS distress beacon.');
      }

      const createdSos: SosRequest = await res.json();
      localStorage.setItem('suraksha_active_sos', JSON.stringify(createdSos));
      localStorage.removeItem('suraksha_draft_sos');

      setIsSubmitting(false);
      onSosSubmitted(createdSos);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setStep('CONFIRMATION_STEP_2');
      setErrorMsg(err.message || 'Transmission failed. You may retry or save locally.');
    }
  };

  const hasLocation = typeof userLocation?.latitude === 'number' && typeof userLocation?.longitude === 'number';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#434338]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#fdfbf7] rounded-3xl shadow-2xl border border-[#e8e4db] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#8B3A3A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertOctagon size={24} className="animate-pulse shrink-0" />
            <div>
              <h3
                className="text-lg font-bold tracking-tight font-serif"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {t.sosTitle}
              </h3>
              <p className="text-xs text-white/80">
                {step === 'INPUT_FORM' && t.sosSubtitle}
                {step === 'CONFIRMATION_STEP_1' && 'Double Confirmation 1 of 2: Review Information'}
                {step === 'CONFIRMATION_STEP_2' && 'Double Confirmation 2 of 2: Final Dispatch Confirmation'}
                {step === 'TRANSMITTING' && 'Transmitting to Emergency Incident Command...'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleBackOrClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Global Back Navigation Bar */}
        <div className="flex items-center justify-between px-5 py-2 bg-[#f5f2ea] border-b border-[#e8e4db]">
          <button
            type="button"
            onClick={handleBackOrClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] hover:text-[#434338] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>
              {step === 'INPUT_FORM' && t.backToPortal}
              {step === 'CONFIRMATION_STEP_1' && t.backToEdit}
              {step === 'CONFIRMATION_STEP_2' && t.backToEdit}
              {step === 'TRANSMITTING' && t.cancel}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                step === 'INPUT_FORM'
                  ? 'bg-amber-500'
                  : step === 'CONFIRMATION_STEP_1'
                  ? 'bg-orange-500'
                  : 'bg-red-600 animate-ping'
              }`}
            />
            <span className="text-[10px] font-bold text-[#8B3A3A] uppercase tracking-wider">
              {step === 'INPUT_FORM' && 'Details'}
              {step === 'CONFIRMATION_STEP_1' && 'Step 1 Review'}
              {step === 'CONFIRMATION_STEP_2' && 'Step 2 Final'}
              {step === 'TRANSMITTING' && 'Transmitting'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: INITIAL SOS INPUT FORM                            */}
        {/* ========================================================= */}
        {step === 'INPUT_FORM' && (
          <form onSubmit={handleProceedToFirstConfirmation} className="p-6 overflow-y-auto space-y-4">
            {errorMsg && (
              <div className="p-3 bg-[#faecea] border border-[#efc7c3] rounded-xl text-xs text-[#8B3A3A] font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="text-[#8B3A3A] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Attached GPS Coordinates */}
            <div className="p-3.5 bg-white border border-[#e8e4db] rounded-2xl flex items-start gap-3">
              <MapPin size={16} className="text-[#8B3A3A] mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-[#434338] block">
                  {t.liveCoordinates || 'Target Coordinates:'}
                </span>
                {hasLocation ? (
                  <>
                    <span className="font-mono text-[#7a7a67]">
                      {userLocation.latitude.toFixed(4)}°N, {userLocation.longitude.toFixed(4)}°E (&plusmn;{userLocation.accuracy || 10}m {t.gpsAccuracy || 'accuracy'})
                    </span>
                    <p className="text-[11px] text-[#8c8c73] mt-0.5">
                      Source: {userLocation.source === 'LIVE_GPS' ? 'Verified Live GPS' : 'Sector Position'}
                    </p>
                  </>
                ) : (
                  <span className="text-amber-700 font-medium">
                    Location permission not granted. Coordinates cannot be transmitted.
                  </span>
                )}
              </div>
            </div>

            {/* Emergency Type Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block mb-2">
                {t.emergencyType}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['RESCUE', 'MEDICAL', 'FOOD', 'WATER', 'OTHER'] as const).map((type) => {
                  const typeLabel =
                    type === 'RESCUE'
                      ? t.rescue
                      : type === 'MEDICAL'
                      ? t.medical
                      : type === 'FOOD'
                      ? t.food
                      : type === 'WATER'
                      ? t.water
                      : t.other;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmergencyType(type)}
                      className={`py-2 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        emergencyType === type
                          ? 'bg-[#8B3A3A] text-white border-[#8B3A3A] shadow-xs'
                          : 'bg-white border-[#e8e4db] text-[#434338] hover:bg-[#f1efe9]'
                      }`}
                    >
                      {typeLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* People Count & Medical Assistance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block mb-1">
                  {t.numberOfPeople}
                </label>
                <input
                  type="number"
                  min={1}
                  max={250}
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2 text-sm font-semibold bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#434338]">
                  <input
                    type="checkbox"
                    checked={medicalAssistance}
                    onChange={(e) => setMedicalAssistance(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8B3A3A] focus:ring-[#8B3A3A] border-[#e8e4db]"
                  />
                  <span className="flex items-center gap-1.5">
                    <HeartPulse size={15} className="text-[#8B3A3A]" />
                    {t.urgentMedicalAid}
                  </span>
                </label>
              </div>
            </div>

            {/* Specific Area / Landmark Description */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block mb-1">
                {t.buildingLandmark}
              </label>
              <input
                type="text"
                placeholder={t.areaDescriptionPlaceholder || 'e.g. 2nd floor, opposite Shiva temple, water reached stairs'}
                value={areaDescription}
                onChange={(e) => setAreaDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
              />
            </div>

            {/* Additional notes */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block mb-1">
                {t.additionalMessage}
              </label>
              <textarea
                rows={2}
                placeholder={t.messagePlaceholder || 'Elderly people, infants, or immediate danger details...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] focus:outline-none text-[#434338]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                id="sos-submit-step1-btn"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#8B3A3A] hover:bg-[#722d2d] text-white font-bold text-xs rounded-full shadow-md shadow-[#8B3A3A]/20 transition-all uppercase tracking-wider cursor-pointer"
              >
                <span>{t.proceedToConfirm}</span>
              </button>
              <button
                type="button"
                id="sos-cancel-btn"
                onClick={handleBackOrClose}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-[#eae6dc] text-[#5A5A40] font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <p className="text-[11px] text-center text-[#8c8c73]">
                {t.continueToVerification || 'Double confirmation required before distress beacon is transmitted to incident command.'}
              </p>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: FIRST CONFIRMATION SCREEN (SUMMARY REVIEW)        */}
        {/* ========================================================= */}
        {step === 'CONFIRMATION_STEP_1' && (
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
              <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold block">{t.sosStep1 || 'Double Confirmation: Step 1 of 2'}</span>
                <span>
                  Please carefully review the exact information that will be transmitted to Incident Command and SDRF rescue forces.
                </span>
              </div>
            </div>

            {/* Summary Grid */}
            <div className="bg-white border border-[#e8e4db] rounded-2xl p-4 space-y-3 divide-y divide-[#f0ece3]">
              {/* Profile / Identifier */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#8c8c73] flex items-center gap-1.5">
                  <User size={14} className="text-[#5A5A40]" />
                  Citizen Profile
                </span>
                <span className="font-bold text-[#434338]">
                  {userName || 'Unregistered Citizen (Anonymous)'}
                </span>
              </div>

              {/* Contact Information */}
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-[#8c8c73] flex items-center gap-1.5">
                  <Phone size={14} className="text-[#5A5A40]" />
                  Emergency Contact
                </span>
                <span className="font-semibold text-[#434338]">
                  {userPhone ? (
                    <span className="font-mono text-emerald-700 font-bold">{userPhone}</span>
                  ) : (
                    <span className="text-amber-700 italic">No phone configured</span>
                  )}
                </span>
              </div>

              {/* Exact Location Coordinates */}
              <div className="text-xs pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#8c8c73] flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#8B3A3A]" />
                    Distress Location
                  </span>
                  <span className="font-semibold text-[#434338]">
                    {areaDescription || userLocation.areaName || 'Sector Zone'}
                  </span>
                </div>
                {hasLocation ? (
                  <p className="font-mono text-[11px] text-[#7a7a67] mt-1 pl-5">
                    {userLocation.latitude.toFixed(5)}°N, {userLocation.longitude.toFixed(5)}°E (&plusmn;{userLocation.accuracy || 10}m)
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-700 mt-1 pl-5 font-semibold">
                    Location unavailable &mdash; coordinates will not be transmitted.
                  </p>
                )}
              </div>

              {/* Emergency Type & Headcount */}
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-[#8c8c73] flex items-center gap-1.5">
                  <AlertOctagon size={14} className="text-[#8B3A3A]" />
                  {t.emergencyType || 'Emergency & Headcount'}
                </span>
                <span className="font-bold text-[#8B3A3A]">
                  {emergencyType} &bull; {peopleCount} {peopleCount === 1 ? 'Person' : 'People'}
                </span>
              </div>

              {/* Medical Assistance Flag */}
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-[#8c8c73] flex items-center gap-1.5">
                  <HeartPulse size={14} className="text-[#8B3A3A]" />
                  {t.urgentMedicalAid || 'Medical Assistance'}
                </span>
                <span className={`font-bold ${medicalAssistance ? 'text-red-700' : 'text-slate-600'}`}>
                  {medicalAssistance ? (t.medicalNeeded || 'CRITICAL - MEDICAL AID REQUIRED') : (t.noMedicalNeeded || 'No Critical Trauma')}
                </span>
              </div>

              {/* Time of Request */}
              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-[#8c8c73] flex items-center gap-1.5">
                  <Clock size={14} className="text-[#5A5A40]" />
                  Request Time
                </span>
                <span className="font-mono text-[#434338]">{requestTimestamp}</span>
              </div>

              {/* Relevant Active Alert Info */}
              {activeAlert && (
                <div className="text-xs pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8c8c73] flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-amber-700" />
                      Active Sector Advisory
                    </span>
                    <span className="font-bold text-amber-800 text-[11px]">
                      {activeAlert.severity} {activeAlert.disasterType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 pl-5">
                    {activeAlert.title}
                  </p>
                </div>
              )}

              {/* Responders Note */}
              {message && (
                <div className="text-xs pt-2">
                  <span className="text-[#8c8c73] block mb-0.5">Notes for Rescue Crew:</span>
                  <p className="italic text-[#434338] bg-[#f9f7f2] p-2 rounded-lg text-[11px]">
                    "{message}"
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                id="sos-confirm-step1-btn"
                onClick={handleProceedToSecondConfirmation}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#8B3A3A] hover:bg-[#722d2d] text-white font-bold text-xs rounded-full shadow-md shadow-[#8B3A3A]/20 transition-all uppercase tracking-wider cursor-pointer"
              >
                <span>{t.confirmDistressSignal || 'Confirm Distress Signal'}</span>
              </button>
              <button
                type="button"
                id="sos-back-edit-btn"
                onClick={() => setStep('INPUT_FORM')}
                className="w-full py-2 px-4 bg-white border border-[#e8e4db] hover:bg-[#f1efe9] text-[#434338] font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                {t.backToEdit || 'Back to Edit'}
              </button>
              <button
                type="button"
                id="sos-cancel-step1-btn"
                onClick={handleBackOrClose}
                className="w-full py-2 px-4 bg-transparent hover:bg-[#eae6dc] text-[#8c8c73] font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                {t.cancel || 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: SECOND CONFIRMATION STEP (FINAL SEND)              */}
        {/* ========================================================= */}
        {step === 'CONFIRMATION_STEP_2' && (
          <div className="p-6 overflow-y-auto space-y-5">
            {errorMsg && (
              <div className="p-3 bg-[#faecea] border border-[#efc7c3] rounded-xl text-xs text-[#8B3A3A] font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="text-[#8B3A3A] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Solemn Dispatch Notice */}
            <div className="p-5 bg-red-50 border-2 border-red-400 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-[#8B3A3A] flex items-center justify-center mx-auto">
                <AlertOctagon size={28} className="animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-red-950 uppercase tracking-wide">
                {t.sosStep2 || 'Final Emergency Dispatch Confirmation'}
              </h4>
              <p className="text-xs text-red-800 leading-relaxed">
                By tapping <strong>SEND SOS</strong>, a high-priority distress beacon with your coordinates,
                medical requirement, and incident details will be transmitted directly to the{' '}
                <strong>District Incident Command & State Disaster Response Forces (SDRF)</strong>.
              </p>
              <div className="pt-2 border-t border-red-200 text-[11px] text-red-700 font-medium">
                Emergency teams and sirens may be mobilized to your reported location.
              </div>
            </div>

            {/* Quick Summary Pill */}
            <div className="bg-white border border-[#e8e4db] rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#434338] block">{emergencyType} DISTRESS SIGNAL</span>
                <span className="text-[11px] text-[#8c8c73]">{peopleCount} people &bull; {areaDescription || 'Sector Location'}</span>
              </div>
              <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded-full uppercase">
                Ready to Transmit
              </span>
            </div>

            {/* Final Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                id="sos-final-send-btn"
                onClick={handleFinalSend}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#8B3A3A] hover:bg-[#722d2d] text-white font-black text-sm rounded-full shadow-lg shadow-[#8B3A3A]/30 transition-all uppercase tracking-widest cursor-pointer disabled:opacity-50"
              >
                <Send size={18} />
                <span>{isSubmitting ? 'TRANSMITTING DISTRESS BEACON...' : (t.transmitSosNow || 'Transmit SOS Now')}</span>
              </button>
              <button
                type="button"
                id="sos-back-review-btn"
                onClick={() => setStep('CONFIRMATION_STEP_1')}
                className="w-full py-2.5 px-4 bg-white border border-[#e8e4db] hover:bg-[#f1efe9] text-[#434338] font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                {t.backToEdit || 'Back to Edit'}
              </button>
              <button
                type="button"
                id="sos-cancel-final-btn"
                onClick={handleBackOrClose}
                className="w-full py-2 px-4 bg-transparent hover:bg-[#eae6dc] text-[#8c8c73] font-semibold text-xs rounded-full transition-colors cursor-pointer"
              >
                {t.cancel || 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: TRANSMITTING STATUS                                */}
        {/* ========================================================= */}
        {step === 'TRANSMITTING' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 text-[#8B3A3A] flex items-center justify-center mx-auto animate-pulse">
              <Send size={26} className="animate-bounce" />
            </div>
            <h4 className="text-base font-bold text-[#434338]">
              TRANSMITTING SOS DISTRESS BEACON...
            </h4>
            <p className="text-xs text-[#7a7a67] max-w-xs mx-auto">
              Packaging verified coordinates, medical status, and contact telemetry for Incident Command.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
