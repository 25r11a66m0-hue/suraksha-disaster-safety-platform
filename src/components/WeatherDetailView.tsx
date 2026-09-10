import React from 'react';
import { WeatherData } from '../types';
import { BackButton } from './BackButton';
import {
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Radio,
  Eye,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building
} from 'lucide-react';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface WeatherDetailViewProps {
  weather: WeatherData | null;
  onBack: () => void;
  backLabel?: string;
  onRefresh?: () => void;
  language?: LanguageCode;
}

export const WeatherDetailView: React.FC<WeatherDetailViewProps> = ({
  weather,
  onBack,
  backLabel,
  onRefresh,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!weather) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="pb-2 border-b border-slate-200">
          <BackButton onClick={onBack} label={backLabel || t.back} />
        </div>
        <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
          <CloudRain size={36} className="mx-auto text-slate-300 animate-pulse" />
          <h2 className="text-base font-bold text-slate-800">
            {t.weatherUnavailable}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t.weatherUnavailableDesc}
          </p>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              {t.retryConnection}
            </button>
          )}
        </div>
      </div>
    );
  }

  const getFreshnessBadge = (freshness: string) => {
    switch (freshness) {
      case 'LIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            {t.freshnessLive}
          </span>
        );
      case 'RECENT':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {t.freshnessRecent}
          </span>
        );
      case 'CACHED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            {t.freshnessCached}
          </span>
        );
      case 'SIMULATION':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            {t.freshnessSimulation}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {t.weatherUnavailable}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <BackButton onClick={onBack} label={backLabel || t.back} />
        <div className="flex items-center gap-2">
          {getFreshnessBadge(weather.freshness)}
        </div>
      </div>

      {/* Main Meteorological Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Source and Station Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.observingGroundStation}
            </span>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              {weather.stationName}
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {t.downlink}: {new Date(weather.timestamp).toLocaleString(language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { timeStyle: 'medium', dateStyle: 'short' })}
          </span>
        </div>

        {/* Primary Reading Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">{t.ambientSurfaceTemperature}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900">
                {weather.temperature}°C
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                ({t.feelsLike} {weather.feelsLike}°C)
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700 pt-1">
              {weather.condition}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-xs text-slate-500 font-medium">{t.accumulatedRainfall}</span>
            <div className="text-3xl font-black text-slate-900">
              {weather.rainfallMm} mm
            </div>
            <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md uppercase ${
              weather.rainfallIntensity === 'EXTREME'
                ? 'bg-rose-100 text-rose-800'
                : weather.rainfallIntensity === 'HEAVY'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {weather.rainfallIntensity} {t.intensity}
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-xs text-slate-500 font-medium">{t.windVectorsGusts}</span>
            <div className="text-3xl font-black text-slate-900">
              {weather.windSpeedKmH} km/h
            </div>
            <span className="text-xs text-slate-600 font-medium">
              {t.direction}: <strong>{weather.windDirection}</strong>
            </span>
          </div>
        </div>

        {/* Detailed Environmental Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Droplets size={14} className="text-blue-600" />
              <span>{t.humidity}</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{weather.humidity}%</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <CloudRain size={14} className="text-emerald-600" />
              <span>{t.rainProbability}</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{weather.rainProbability}%</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Eye size={14} className="text-slate-600" />
              <span>{t.surfaceVisibility}</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{weather.visibilityKm || 8.5} km</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Compass size={14} className="text-amber-600" />
              <span>{t.barometricTrend}</span>
            </div>
            <span className="text-lg font-bold text-slate-900">1004 hPa</span>
          </div>
        </div>

        {/* Doppler Radar Attribution & Truthful Disclosure */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Building size={15} className="text-slate-600" />
            <span>{t.meteorologicalAttribution}</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {t.meteorologicalAttributionDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
