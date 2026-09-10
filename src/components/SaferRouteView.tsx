import React from 'react';
import { SaferRoute, LocationCoordinates } from '../types';
import { ShieldCheck, AlertOctagon, Navigation, ExternalLink, ArrowRight, Compass, CheckCircle2, XCircle } from 'lucide-react';
import { BackButton } from './BackButton';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface SaferRouteViewProps {
  route: SaferRoute;
  userLocation: LocationCoordinates;
  onChangeDestination: () => void;
  onBack?: () => void;
  backLabel?: string;
  language?: LanguageCode;
}

export const SaferRouteView: React.FC<SaferRouteViewProps> = ({
  route,
  userLocation,
  onChangeDestination,
  onBack,
  backLabel,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const dest = route.destinationShelter;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${dest.latitude},${dest.longitude}&travelmode=driving`;

  return (
    <div className="space-y-5">
      {onBack && (
        <div className="pb-1">
          <BackButton onClick={onBack} label={backLabel || t.back} />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2
              className="text-xl font-bold text-[#434338] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {t.saferRoutingTitle}
            </h2>
            <span className="px-3 py-0.5 text-[10px] font-bold bg-[#faf3eb] text-[#B37D4E] border border-[#ecdacb] rounded-full uppercase tracking-wider">
              {t.elevationOverShortcut}
            </span>
          </div>
          <p className="text-xs text-[#8c8c73] mt-0.5">
            {t.saferRoutingSubtitle}
          </p>
        </div>

        <button
          onClick={onChangeDestination}
          className="text-xs font-semibold text-[#5A5A40] hover:text-[#434338] underline self-start sm:self-auto cursor-pointer"
        >
          {t.changeTargetShelter}
        </button>
      </div>

      {/* Target Shelter Banner */}
      <div className="bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block mb-0.5">
            {t.targetEvacuationDestination}
          </span>
          <span
            className="text-base font-bold text-[#434338] font-serif"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {dest.name}
          </span>
          <span className="text-xs text-[#7a7a67] ml-2">({dest.address})</span>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-semibold rounded-full shadow-sm shadow-[#5A5A40]/15 transition-all whitespace-nowrap"
        >
          <ExternalLink size={13} />
          <span>{t.navigateGoogleMaps.toUpperCase()}</span>
        </a>
      </div>

      {/* Side-by-Side Comparison: Recommended vs Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recommended Route (Low Risk) */}
        <div className="bg-[#eef1eb] border-2 border-[#5A5A40] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={22} className="text-[#5A5A40]" />
                <span className="text-[11px] font-bold tracking-[0.15em] text-[#5A5A40] uppercase">
                  {t.recommendedSafeRoute}
                </span>
              </div>
              <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#5A5A40] text-white uppercase tracking-wider">
                {t.lowRisk}
              </span>
            </div>

            <h3
              className="text-lg font-bold text-[#434338] mb-2 font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {route.recommendedRoute.name}
            </h3>

            <div className="flex items-baseline gap-4 text-xs text-[#7a7a67] mb-4 pb-3 border-b border-[#d8ded3]">
              <div>
                {t.distance} <strong className="text-sm font-semibold text-[#434338]">{route.recommendedRoute.distanceKm} km</strong>
              </div>
              <div>
                {t.estTransit} <strong className="text-sm font-semibold text-[#434338]">{route.recommendedRoute.estimatedMinutes} mins</strong>
              </div>
              <div>
                {t.riskScore} <strong className="text-sm font-semibold text-[#5A5A40]">{route.recommendedRoute.riskScore}/100</strong>
              </div>
            </div>

            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#5A5A40] mb-2.5">
              {t.safetyAdvantages}
            </h4>
            <ul className="space-y-2 mb-5">
              {route.recommendedRoute.safePoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#434338]">
                  <CheckCircle2 size={14} className="text-[#5A5A40] flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#d8ded3] rounded-2xl p-4 text-xs text-[#5A5A40] font-medium leading-relaxed">
            <strong>{t.travelAdvisory}</strong> {route.recommendedRoute.safetyAdvise}
          </div>
        </div>

        {/* Avoid Route (High Risk) */}
        {route.avoidRoute && (
          <div className="bg-[#faf3eb] border-2 border-[#8B3A3A] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <AlertOctagon size={22} className="text-[#8B3A3A]" />
                  <span className="text-[11px] font-bold tracking-[0.15em] text-[#8B3A3A] uppercase">
                    {t.hazardPathDoNotUse}
                  </span>
                </div>
                <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#8B3A3A] text-white uppercase tracking-wider">
                  {t.criticalDanger}
                </span>
              </div>

              <h3
                className="text-lg font-bold text-[#434338] mb-2 font-serif"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {route.avoidRoute.name}
              </h3>

              <div className="flex items-baseline gap-4 text-xs text-[#7a7a67] mb-4 pb-3 border-b border-[#ecdacb]">
                <div>
                  {t.distance} <strong className="text-sm font-semibold text-[#434338]">{route.avoidRoute.distanceKm} km</strong>
                </div>
                <div>
                  {t.estTransit} <strong className="text-sm font-semibold text-[#8B3A3A]">{t.warning}</strong>
                </div>
                <div>
                  {t.riskScore} <strong className="text-sm font-semibold text-[#8B3A3A]">{route.avoidRoute.riskScore}/100</strong>
                </div>
              </div>

              <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B3A3A] mb-2.5">
                {t.hazardAvoidanceNotice}
              </h4>
              <ul className="space-y-2 mb-5">
                {route.avoidRoute.hazardReasons.map((hazard, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#434338]">
                    <XCircle size={14} className="text-[#8B3A3A] flex-shrink-0 mt-0.5" />
                    <span>{hazard}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#ecdacb] rounded-2xl p-4 text-xs text-[#8B3A3A] font-medium leading-relaxed">
              <strong>{t.warning}:</strong> {t.hazardAvoidanceNotice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
