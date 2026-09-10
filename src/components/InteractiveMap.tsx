import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocationCoordinates, Shelter, EmergencyAlert, SaferRoute, SosRequest } from '../types';
import { LanguageCode, TRANSLATIONS } from '../i18n/translations';
import { Layers, Navigation, ExternalLink, MapPin } from 'lucide-react';

interface InteractiveMapProps {
  userLocation: LocationCoordinates;
  shelters?: Shelter[];
  activeAlert?: EmergencyAlert | null;
  saferRoute?: SaferRoute | null;
  sosRequests?: SosRequest[];
  heightClass?: string;
  language?: LanguageCode;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  userLocation,
  shelters = [],
  activeAlert,
  saferRoute,
  sosRequests = [],
  heightClass = 'h-72 sm:h-96',
  language = 'en'
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.latitude, userLocation.longitude],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and layers when props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. User Location Marker with Pulsing Ring
    const userMarkerHtml = `
      <div style="background-color: #434338; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #FFFFFF; box-shadow: 0 0 10px rgba(67,67,56,0.6);"></div>
    `;
    const userIcon = L.divIcon({
      html: userMarkerHtml,
      className: 'custom-user-marker',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
      .bindPopup(`<strong>Your Location</strong><br>${userLocation.cityName || 'Current Area'}<br>${userLocation.latitude.toFixed(4)}°N, ${userLocation.longitude.toFixed(4)}°E`);
    layerGroup.addLayer(userMarker);

    // Accuracy Circle
    if (userLocation.accuracy) {
      const accCircle = L.circle([userLocation.latitude, userLocation.longitude], {
        radius: Math.min(500, userLocation.accuracy),
        color: '#5A5A40',
        fillColor: '#5A5A40',
        fillOpacity: 0.1,
        weight: 1
      });
      layerGroup.addLayer(accCircle);
    }

    // 2. Active Alert Geofence Radius
    if (activeAlert) {
      const alertCircle = L.circle([activeAlert.latitude, activeAlert.longitude], {
        radius: activeAlert.radiusKm * 1000,
        color: activeAlert.severity === 'CRITICAL' ? '#8B3A3A' : '#D4A373',
        fillColor: activeAlert.severity === 'CRITICAL' ? '#8B3A3A' : '#D4A373',
        fillOpacity: 0.14,
        weight: 2,
        dashArray: '6, 6'
      }).bindPopup(`<strong>${activeAlert.title}</strong><br>Severity: ${activeAlert.severity}<br>Radius: ${activeAlert.radiusKm} km`);
      layerGroup.addLayer(alertCircle);
    }

    // 3. Shelters
    shelters.forEach((shelter) => {
      const shelterMarkerHtml = `
        <div style="background-color: #5A5A40; width: 22px; height: 22px; border-radius: 6px; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.25);">
          H
        </div>
      `;
      const shelterIcon = L.divIcon({
        html: shelterMarkerHtml,
        className: 'custom-shelter-marker',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const sMarker = L.marker([shelter.latitude, shelter.longitude], { icon: shelterIcon })
        .bindPopup(`
          <div style="font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <strong style="color: #434338;">${shelter.name}</strong><br>
            Status: ${shelter.status}<br>
            Capacity: ${shelter.occupiedCapacity}/${shelter.totalCapacity}<br>
            <a href="https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${shelter.latitude},${shelter.longitude}&travelmode=driving" target="_blank" style="color: #5A5A40; font-weight: bold;">Navigate with Google Maps &rarr;</a>
          </div>
        `);
      layerGroup.addLayer(sMarker);
    });

    // 4. Safer Route Polylines
    if (saferRoute) {
      // Recommended Route (Sage Green)
      const safeLine = L.polyline(saferRoute.recommendedRoute.waypoints, {
        color: '#5A5A40',
        weight: 5,
        opacity: 0.88
      }).bindPopup(`<strong>${saferRoute.recommendedRoute.name}</strong><br>Risk: Low &bull; ${saferRoute.recommendedRoute.distanceKm} km`);
      layerGroup.addLayer(safeLine);

      // Avoid Route (Terracotta dashed)
      if (saferRoute.avoidRoute) {
        const avoidLine = L.polyline(saferRoute.avoidRoute.waypoints, {
          color: '#8B3A3A',
          weight: 4,
          opacity: 0.75,
          dashArray: '8, 8'
        }).bindPopup(`<strong>${saferRoute.avoidRoute.name}</strong><br>CRITICAL HAZARD - AVOID`);
        layerGroup.addLayer(avoidLine);
      }
    }

    // 5. SOS Incidents
    sosRequests.forEach((sos) => {
      const sosMarkerHtml = `
        <div style="background-color: #8B3A3A; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: bold; box-shadow: 0 0 8px rgba(139, 58, 58, 0.8);">!</div>
      `;
      const sosIcon = L.divIcon({
        html: sosMarkerHtml,
        className: 'custom-sos-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const sosMarker = L.marker([sos.latitude, sos.longitude], { icon: sosIcon })
        .bindPopup(`<strong>${sos.id}</strong><br>${sos.emergencyType} (${sos.peopleCount} people)<br>Status: ${sos.status}`);
      layerGroup.addLayer(sosMarker);
    });

    // Pan to user location
    map.setView([userLocation.latitude, userLocation.longitude], 13);
  }, [userLocation, shelters, activeAlert, saferRoute, sosRequests]);

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#e8e4db] shadow-xs">
      <div ref={mapContainerRef} className={`w-full ${heightClass}`} />

      {/* Floating map controls pill */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#fdfbf7]/95 hover:bg-[#fdfbf7] text-[#434338] border border-[#e8e4db] rounded-full text-xs font-semibold shadow-xs transition-colors"
        >
          <ExternalLink size={13} className="text-[#5A5A40]" />
          <span>{t.openInGoogleMaps}</span>
        </a>
      </div>

      {/* Legend strip at bottom */}
      <div className="bg-[#fdfbf7]/95 border-t border-[#e8e4db] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-[#7a7a67]">
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#434338] border border-white inline-block"></span>
            {t.you}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#5A5A40] inline-block"></span>
            {t.shelters}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 bg-[#5A5A40] rounded-full inline-block"></span>
            {t.legendSafeRoute}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 bg-[#8B3A3A] border-b border-dashed inline-block"></span>
            {t.hazardZone}
          </span>
        </div>
        <span className="text-[#8c8c73] text-[9px] uppercase tracking-wider">
          {t.gisSectorVectorView || 'GIS Sector Vector View'}
        </span>
      </div>
    </div>
  );
};
