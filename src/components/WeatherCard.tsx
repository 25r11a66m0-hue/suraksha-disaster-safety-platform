import React from 'react';
import { WeatherData } from '../types';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import { CloudRain, Wind, Droplets, Thermometer, Compass, Eye, Clock, Radio } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  onInspectDetails?: () => void;
  language?: LanguageCode;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onInspectDetails, language = 'en' }) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const getFreshnessBadge = (freshness: string) => {
    switch (freshness) {
      case 'LIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#edf1eb] text-[#5A5A40] border border-[#d8ded3]">
            <Radio size={10} className="text-[#5A5A40] animate-pulse" />
            LIVE METEOROLOGY
          </span>
        );
      case 'RECENT':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#f1efe9] text-[#7a7a67] border border-[#e8e4db]">
            RECENT
          </span>
        );
      case 'CACHED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#faf3eb] text-[#B37D4E] border border-[#ecdacb]">
            CACHED / STALE
          </span>
        );
      case 'SIMULATION':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#f1efe9] text-[#5A5A40] border border-[#e8e4db]">
            SIMULATION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#f1efe9] text-[#7a7a67]">
            UNAVAILABLE
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#e8e4db] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#edf1eb] text-[#5A5A40] rounded-lg">
              <CloudRain size={18} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8c8c73]">
              {t.meteorologicalTelemetry}
            </span>
          </div>
          {getFreshnessBadge(weather.freshness)}
        </div>

        {/* Main Temperature & Condition banner */}
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-5xl font-light text-[#5A5A40] font-serif"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {weather.temperature}°C
              </span>
              <span className="text-xs text-[#8c8c73] font-medium">
                ({t.feelsLike} {weather.feelsLike}°C)
              </span>
            </div>
            <div
              className="text-base font-serif italic text-[#434338] mt-1"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {weather.condition}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-[#8c8c73] uppercase tracking-[0.2em] block mb-1">
              {t.rainfallVolume}
            </span>
            <span
              className="text-3xl font-light text-[#434338] font-serif block"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {weather.rainfallMm} mm
            </span>
            <span className="text-[11px] block text-[#8c8c73]">
              {weather.rainProbability}% {t.precipitationChance}
            </span>
          </div>
        </div>
      </div>

      {/* Detail Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-[#e8e4db]">
        <div className="p-3 bg-[#fdfbf7] border border-[#e8e4db] rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#8c8c73] mb-1">
            <Wind size={12} className="text-[#5A5A40]" />
            <span>{t.windSpeed}</span>
          </div>
          <span className="text-sm font-bold text-[#434338] block font-mono">
            {weather.windSpeedKmH} km/h
          </span>
          <span className="text-[10px] text-[#8c8c73] block">
            Heading: {weather.windDirection}
          </span>
        </div>

        <div className="p-3 bg-[#fdfbf7] border border-[#e8e4db] rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#8c8c73] mb-1">
            <Droplets size={12} className="text-[#5A5A40]" />
            <span>{t.humidity}</span>
          </div>
          <span className="text-sm font-bold text-[#434338] block font-mono">
            {weather.humidity}%
          </span>
          <span className="text-[10px] text-[#8c8c73] block">
            Moisture saturation
          </span>
        </div>

        <div className="p-3 bg-[#fdfbf7] border border-[#e8e4db] rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#8c8c73] mb-1">
            <Eye size={12} className="text-[#5A5A40]" />
            <span>{t.visibility}</span>
          </div>
          <span className="text-sm font-bold text-[#434338] block font-mono">
            {weather.visibilityKm || '8.5'} km
          </span>
          <span className="text-[10px] text-[#8c8c73] block">
            Line of sight
          </span>
        </div>

        <div className="p-3 bg-[#fdfbf7] border border-[#e8e4db] rounded-xl">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#8c8c73] mb-1">
            <Clock size={12} className="text-[#5A5A40]" />
            <span>Telemetry</span>
          </div>
          <span className="text-sm font-bold text-[#434338] block truncate font-mono">
            {weather.freshness}
          </span>
          <span className="text-[10px] text-[#8c8c73] block truncate" title={weather.stationName}>
            {weather.stationName.split('/')[0]}
          </span>
        </div>
      </div>

      {onInspectDetails && (
        <div className="mt-4 pt-3 border-t border-[#e8e4db] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#7a7a67]">IMD Doppler Radar active</span>
          <button
            type="button"
            onClick={onInspectDetails}
            className="text-xs font-semibold text-[#5A5A40] hover:text-[#434338] underline flex items-center gap-1 cursor-pointer"
          >
            <span>Inspect Radar & Telemetry &rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
};
