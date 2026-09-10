import React from 'react';
import { Shelter, LocationCoordinates } from '../types';
import { Home, MapPin, Navigation, Phone, ExternalLink, Check, X, Users, AlertCircle } from 'lucide-react';
import { BackButton } from './BackButton';
import { TRANSLATIONS, LanguageCode } from '../i18n/translations';

interface ShelterFinderProps {
  shelters: Shelter[];
  userLocation: LocationCoordinates;
  onSelectShelterForRoute: (shelter: Shelter) => void;
  onSelectShelterDetail?: (shelter: Shelter) => void;
  onBack?: () => void;
  backLabel?: string;
  language?: LanguageCode;
}

export const ShelterFinder: React.FC<ShelterFinderProps> = ({
  shelters,
  userLocation,
  onSelectShelterForRoute,
  onSelectShelterDetail,
  onBack,
  backLabel,
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const getStatusBadge = (status: Shelter['status']) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#edf1eb] text-[#5A5A40] border border-[#d8ded3]">{t.shelterStatusOpen.split('/')[0].trim()}</span>;
      case 'LIMITED':
        return <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#faf3eb] text-[#B37D4E] border border-[#ecdacb]">{t.shelterStatusLimited.split('/')[0].trim()}</span>;
      case 'FULL':
        return <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#faecea] text-[#8B3A3A] border border-[#efc7c3]">{t.shelterStatusFull}</span>;
      case 'CLOSED':
        return <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#f1efe9] text-[#8c8c73] border border-[#e8e4db]">{t.shelterStatusClosed}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {onBack && (
        <div className="pb-1">
          <BackButton onClick={onBack} label={backLabel || t.back} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2
            className="text-xl font-bold text-[#434338] font-serif"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {t.sheltersTitle}
          </h2>
          <p className="text-xs text-[#8c8c73]">
            {t.sheltersSubtitle}
          </p>
        </div>
        <span className="text-xs font-semibold text-[#5A5A40] bg-[#f1efe9] border border-[#e8e4db] px-3.5 py-1 rounded-full self-start sm:self-auto">
          {shelters.length} {t.facilitiesInSector}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {shelters.map((shelter) => {
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${shelter.latitude},${shelter.longitude}&travelmode=driving`;
          const isCapacityAvailable = shelter.availableCapacity > 0 && shelter.status !== 'CLOSED';

          return (
            <div
              key={shelter.id}
              className="bg-white border border-[#e8e4db] hover:border-[#5A5A40]/40 rounded-3xl p-6 shadow-xs transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <h3
                    className="text-base font-bold text-[#434338] font-serif"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {shelter.name}
                  </h3>
                  {getStatusBadge(shelter.status)}
                </div>
                {shelter.distanceKm !== undefined && (
                  <span className="text-xs font-semibold text-[#5A5A40] bg-[#edf1eb] border border-[#d8ded3] px-3 py-0.5 rounded-full whitespace-nowrap self-start sm:self-auto font-mono">
                    {shelter.distanceKm} km
                  </span>
                )}
              </div>

              {/* Address */}
              <p className="text-xs text-[#7a7a67] mb-4 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#8c8c73] flex-shrink-0" />
                <span>{shelter.address}, {shelter.district}</span>
              </p>

              {/* Capacity Bar */}
              <div className="mb-4 bg-[#fdfbf7] p-4 rounded-2xl border border-[#e8e4db]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8c8c73]">
                    {t.occupancyLoad}
                  </span>
                  <span className="font-semibold text-[#434338]">
                    {shelter.occupiedCapacity} / {shelter.totalCapacity} ({shelter.availableCapacity} {t.available})
                  </span>
                </div>
                <div className="w-full bg-[#f1f0ec] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all rounded-full ${
                      shelter.occupiedCapacity / shelter.totalCapacity > 0.9
                        ? 'bg-[#8B3A3A]'
                        : shelter.occupiedCapacity / shelter.totalCapacity > 0.6
                        ? 'bg-[#D4A373]'
                        : 'bg-[#5A5A40]'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((shelter.occupiedCapacity / shelter.totalCapacity) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Facilities pills */}
              <div className="flex flex-wrap gap-2 mb-5 text-[11px]">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${shelter.facilities.food ? 'bg-[#edf1eb] text-[#5A5A40] border-[#d8ded3]' : 'bg-[#f1efe9] text-[#8c8c73] border-[#e8e4db]'}`}>
                  {shelter.facilities.food ? <Check size={12} /> : <X size={12} />} {t.cleanFoodRations}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${shelter.facilities.water ? 'bg-[#edf1eb] text-[#5A5A40] border-[#d8ded3]' : 'bg-[#f1efe9] text-[#8c8c73] border-[#e8e4db]'}`}>
                  {shelter.facilities.water ? <Check size={12} /> : <X size={12} />} {t.potableWater}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${shelter.facilities.medical ? 'bg-[#edf1eb] text-[#5A5A40] border-[#d8ded3]' : 'bg-[#f1efe9] text-[#8c8c73] border-[#e8e4db]'}`}>
                  {shelter.facilities.medical ? <Check size={12} /> : <X size={12} />} {t.medicalSupport}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${shelter.facilities.powerBackup ? 'bg-[#edf1eb] text-[#5A5A40] border-[#d8ded3]' : 'bg-[#f1efe9] text-[#8c8c73] border-[#e8e4db]'}`}>
                  {shelter.facilities.powerBackup ? <Check size={12} /> : <X size={12} />} {t.powerGenerator}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${shelter.facilities.accessibilityRamp ? 'bg-[#edf1eb] text-[#5A5A40] border-[#d8ded3]' : 'bg-[#f1efe9] text-[#8c8c73] border-[#e8e4db]'}`}>
                  {shelter.facilities.accessibilityRamp ? <Check size={12} /> : <X size={12} />} {t.rampAccess}
                </span>
              </div>

              {/* Contact info and Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#e8e4db]">
                <a
                  href={`tel:${shelter.contactPhone}`}
                  className="flex items-center gap-1.5 text-xs text-[#7a7a67] hover:text-[#434338] font-mono"
                >
                  <Phone size={13} className="text-[#8c8c73]" />
                  <span>{shelter.contactPerson}: {shelter.contactPhone}</span>
                </a>

                <div className="flex flex-wrap items-center gap-2">
                  {onSelectShelterDetail && (
                    <button
                      type="button"
                      onClick={() => onSelectShelterDetail(shelter)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3.5 py-2.5 bg-white border border-[#e8e4db] hover:bg-[#f1efe9] text-[#434338] text-xs font-semibold rounded-full transition-colors cursor-pointer"
                    >
                      <span>{t.detailsAndFacilities}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectShelterForRoute(shelter)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-semibold rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 cursor-pointer"
                  >
                    <Navigation size={13} />
                    <span>{t.saferRouteBtnSmall}</span>
                  </button>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-[#e8e4db] hover:bg-[#f1efe9] text-[#434338] text-xs font-semibold rounded-full transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span>{t.mapsBtnSmall}</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
