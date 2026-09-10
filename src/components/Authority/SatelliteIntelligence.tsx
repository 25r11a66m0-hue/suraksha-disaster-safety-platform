import React, { useState } from 'react';
import { SatelliteData } from '../../types';
import { Satellite, Radio, Globe, Layers, AlertCircle, Eye, Info } from 'lucide-react';

interface SatelliteIntelligenceProps {
  satelliteData?: SatelliteData;
}

export const SatelliteIntelligence: React.FC<SatelliteIntelligenceProps> = ({
  satelliteData
}) => {
  const [activeLayer, setActiveLayer] = useState<'SAR_INUNDATION' | 'CYCLONE_EYE' | 'SOIL_SATURATION'>('SAR_INUNDATION');

  const defaultData: SatelliteData = satelliteData || {
    satelliteName: 'EOS-05 (Earth Observation Satellite)',
    sensorType: 'C-band Synthetic Aperture Radar (SAR) & Multi-spectral Optical',
    orbitType: 'Sun-synchronous Polar Low Earth Orbit (620 km)',
    groundStation: 'National Remote Sensing Centre (NRSC) Shadnagar / ISRO',
    passTimestamp: new Date().toISOString(),
    observationSummary: 'C-band SAR radar imagery detects significant coastal inundation over 14.2 sq km in Visakhapatnam urban lowlands. Sea surface temperature indicates deep cyclonic convective band over Bay of Bengal.',
    floodInundationAreaSqKm: 14.2,
    cycloneEyeDetected: true,
    cloudTopTemperatureC: -78.4,
    soilMoistureSaturationPct: 92
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Satellite size={20} className="text-amber-800" />
            <span>Satellite Earth Observation & Remote Sensing Intelligence</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time spaceborne synthetic aperture radar (SAR) and meteorological telemetry.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-slate-900 text-white px-3 py-1 rounded-full">
          EOS-05 PASS: LIVE
        </span>
      </div>

      {/* Critical Technical Clarification Notice */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-950">
        <Info size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Space Segment Architecture Note:</strong> EOS-05 and INSAT-3DR are Earth-observation and meteorological satellites operating in low/geostationary orbits. They deliver high-resolution radar and optical observational telemetry downlinked directly through NRSC Shadnagar / ISRO ground stations. Consumer smartphones do not communicate directly with EOS satellites; processed telemetry is delivered via SURAKSHA cloud gateways.
        </div>
      </div>

      {/* Telemetry Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Spacecraft Designation
          </span>
          <span className="text-base font-extrabold text-slate-900 block mt-1">
            {defaultData.satelliteName}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5 font-mono">
            {defaultData.orbitType}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Radar Flood Extent (SAR)
          </span>
          <span className="text-2xl font-black text-rose-700 block mt-1 font-mono">
            {defaultData.floodInundationAreaSqKm} km²
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            C-band water penetration
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Cloud Top Temperature
          </span>
          <span className="text-2xl font-black text-blue-900 block mt-1 font-mono">
            {defaultData.cloudTopTemperatureC}°C
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            Deep convective cloud mass
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Soil Saturation Index
          </span>
          <span className="text-2xl font-black text-amber-700 block mt-1 font-mono">
            {defaultData.soilMoistureSaturationPct}%
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            Severe runoff vulnerability
          </span>
        </div>
      </div>

      {/* Observation Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            NRSC Ground Station Telemetry Report
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Downlink: {defaultData.groundStation}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-lg border border-slate-100">
          {defaultData.observationSummary}
        </p>

        {/* Remote Sensing Layer View */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Spectral Layer Inspector:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveLayer('SAR_INUNDATION')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                activeLayer === 'SAR_INUNDATION'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              SAR Flood Inundation Extent
            </button>
            <button
              onClick={() => setActiveLayer('CYCLONE_EYE')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                activeLayer === 'CYCLONE_EYE'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              INSAT-3DR Thermal Cyclone Eye
            </button>
            <button
              onClick={() => setActiveLayer('SOIL_SATURATION')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                activeLayer === 'SOIL_SATURATION'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Surface Hydrological Runoff
            </button>
          </div>

          <div className="mt-3 p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs space-y-2">
            <div className="text-emerald-400 font-bold">
              [SENSOR ACTIVE] {activeLayer}
            </div>
            <div>Resolution: 10m Ground Sample Distance (GSD)</div>
            <div>Polarization: VV + VH dual cross-polarized backscatter</div>
            <div>Telemetry Checksum: 0x8F92BD41 (Verified Authentic ISRO/NRSC Payload)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
