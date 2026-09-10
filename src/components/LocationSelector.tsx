import React, { useState } from 'react';
import { LocationCoordinates } from '../types';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import { Navigation, MapPin, Search, Compass, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface LocationSelectorProps {
  currentLocation: LocationCoordinates;
  onLocationChange: (loc: LocationCoordinates) => void;
  language?: LanguageCode;
}

const INDIAN_PRESETS = [
  { name: 'Visakhapatnam (Beach Road / Coastal)', lat: 17.7121, lng: 83.3245, area: 'Visakhapatnam Urban' },
  { name: 'Visakhapatnam (Siripuram / AU)', lat: 17.7294, lng: 83.3225, area: 'Siripuram' },
  { name: 'Visakhapatnam (Gajuwaka Lowlands)', lat: 17.6912, lng: 83.2185, area: 'Gajuwaka' },
  { name: 'Visakhapatnam (Madhurawada Valley)', lat: 17.8150, lng: 83.3550, area: 'Madhurawada' },
  { name: 'Vijayawada (Krishna River Basin)', lat: 16.5062, lng: 80.6480, area: 'Vijayawada Central' },
  { name: 'Hyderabad (Hussain Sagar / Musi Basin)', lat: 17.3850, lng: 78.4867, area: 'Hyderabad' },
  { name: 'Chennai (Marina Coastal Zone)', lat: 13.0827, lng: 80.2707, area: 'Chennai' },
  { name: 'Mumbai (Coastal Island City)', lat: 19.0760, lng: 72.8777, area: 'Mumbai' },
  { name: 'Guwahati (Brahmaputra Flood Corridor)', lat: 26.1445, lng: 91.7362, area: 'Guwahati' }
];

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentLocation,
  onLocationChange,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleUseLiveLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation hardware is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        onLocationChange({
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          accuracy: Math.round(pos.coords.accuracy),
          timestamp: pos.timestamp,
          cityName: 'Detected Live Area',
          areaName: `GPS Lat: ${pos.coords.latitude.toFixed(3)}, Lng: ${pos.coords.longitude.toFixed(3)}`,
          source: 'LIVE_GPS'
        });
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Location permission unavailable.';
        if (err.code === 1) msg = 'Location permission denied by browser settings. Please enter location manually below.';
        else if (err.code === 2) msg = 'Live location signal unavailable. Please search manually.';
        else if (err.code === 3) msg = 'Location request timed out. Please try again or search manually.';
        setGeoError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSelectPreset = (preset: typeof INDIAN_PRESETS[0]) => {
    setGeoError(null);
    onLocationChange({
      latitude: preset.lat,
      longitude: preset.lng,
      accuracy: 15,
      timestamp: Date.now(),
      cityName: preset.name.split('(')[0].trim(),
      areaName: preset.area,
      source: 'SEARCHED_MANUAL'
    });
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const filteredPresets = INDIAN_PRESETS.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e4db]">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-[#f1efe9] text-[#5A5A40] rounded-xl mt-0.5">
            <MapPin size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73]">
                Monitored Sector
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                  currentLocation.source === 'LIVE_GPS'
                    ? 'bg-[#eef1eb] text-[#5A5A40] border border-[#d8ded3]'
                    : 'bg-[#f1efe9] text-[#7a7a67] border border-[#e8e4db]'
                }`}
              >
                {currentLocation.source === 'LIVE_GPS' ? 'LIVE GPS' : 'SEARCHED'}
              </span>
            </div>
            <h3
              className="text-lg font-bold text-[#434338] mt-0.5 font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {currentLocation.cityName || 'Selected Sector'}
              {currentLocation.areaName && (
                <span className="text-xs font-normal text-[#8c8c73] ml-2 font-sans">
                  ({currentLocation.areaName})
                </span>
              )}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[#8c8c73] font-mono mt-1">
              <span>
                {currentLocation.latitude.toFixed(4)}°N, {currentLocation.longitude.toFixed(4)}°E
              </span>
              {currentLocation.accuracy && (
                <span>&bull; &plusmn;{currentLocation.accuracy}m accuracy</span>
              )}
            </div>
          </div>
        </div>

        {/* Live Location Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUseLiveLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-semibold rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 disabled:opacity-50 cursor-pointer"
          >
            <Navigation size={13} className={isLocating ? 'animate-spin' : ''} />
            <span>{isLocating ? (t.acquiringGps || 'Acquiring GPS...') : (t.useMyLiveLocation || 'USE MY LIVE LOCATION')}</span>
          </button>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2.5 bg-white border border-[#e8e4db] hover:bg-[#f1efe9] text-[#7a7a67] hover:text-[#434338] rounded-full text-xs font-medium transition-colors cursor-pointer"
            title="Search Location Manually"
          >
            <Search size={15} />
          </button>
        </div>
      </div>

      {/* Geolocation Error feedback */}
      {geoError && (
        <div className="mt-3 p-3 bg-[#fbf6f0] border border-[#ecdacb] rounded-xl flex items-start gap-2.5 text-xs text-[#8B3A3A]">
          <AlertCircle size={16} className="text-[#8B3A3A] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{geoError}</p>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="mt-1 text-xs font-bold text-[#5A5A40] underline hover:text-[#434338] cursor-pointer"
            >
              {t.enterLocationManually || 'Enter Location Manually'}
            </button>
          </div>
        </div>
      )}

      {/* Manual Search & City Selector Drawer */}
      {isSearchOpen && (
        <div className="mt-4 pt-4 border-t border-[#e8e4db]">
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c8c73]" />
            <input
              type="text"
              placeholder={t.searchIndianLocation || "Search Indian location (e.g. Visakhapatnam, RK Beach, Hyderabad)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-[#e8e4db] rounded-full focus:outline-none focus:ring-2 focus:ring-[#5A5A40] text-[#434338]"
              autoFocus
            />
          </div>

          <p className="text-[10px] font-bold text-[#8c8c73] uppercase tracking-[0.2em] mb-2.5">
            {t.selectIndianDisasterRiskZone || 'Select Indian Disaster Risk Zone / City:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {filteredPresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(p)}
                className="text-left p-3 rounded-xl bg-white border border-[#e8e4db] hover:border-[#5A5A40] hover:bg-[#f1efe9] transition-all cursor-pointer"
              >
                <div className="text-xs font-bold text-[#434338]">{p.name}</div>
                <div className="text-[10px] text-[#8c8c73] font-mono">
                  {p.lat.toFixed(3)}°N, {p.lng.toFixed(3)}°E
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
