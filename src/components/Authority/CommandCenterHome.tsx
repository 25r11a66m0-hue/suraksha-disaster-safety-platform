import React from 'react';
import {
  EmergencyAlert,
  SosRequest,
  Shelter,
  RescueTeam,
  DisasterResource,
  WeatherData,
  LocationCoordinates
} from '../../types';
import {
  AlertTriangle,
  Users,
  ShieldCheck,
  Truck,
  Activity,
  Radio,
  Send,
  Home,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { InteractiveMap } from '../InteractiveMap';

interface CommandCenterHomeProps {
  alerts: EmergencyAlert[];
  sosRequests: SosRequest[];
  shelters: Shelter[];
  teams: RescueTeam[];
  resources: DisasterResource[];
  weather: WeatherData;
  userLocation: LocationCoordinates;
  onNavigateTab: (tab: string) => void;
  onSelectSosForTriage: (sos: SosRequest) => void;
}

export const CommandCenterHome: React.FC<CommandCenterHomeProps> = ({
  alerts,
  sosRequests,
  shelters,
  teams,
  resources,
  weather,
  userLocation,
  onNavigateTab,
  onSelectSosForTriage
}) => {
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const pendingSos = sosRequests.filter((s) => s.status !== 'RESOLVED');
  const availableTeams = teams.filter((t) => t.currentStatus === 'AVAILABLE');
  const openShelters = shelters.filter((s) => s.status === 'OPEN');
  const totalShelterCap = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalShelterOcc = shelters.reduce((acc, s) => acc + s.occupiedCapacity, 0);

  return (
    <div className="space-y-6">
      {/* Top Operational Status Banner */}
      <div className="bg-[#fdfbf7] border border-[#e8e4db] rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-3 h-3 rounded-full bg-[#5A5A40] animate-ping"></div>
          <div>
            <h2
              className="text-base font-bold text-[#434338] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Operational Command: Visakhapatnam Coastal Incident Grid
            </h2>
            <p className="text-xs text-[#8c8c73] mt-0.5">
              National Disaster Response Framework &bull; Sector Coordinates {userLocation.latitude.toFixed(3)}°N, {userLocation.longitude.toFixed(3)}°E
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('alerts')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#8B3A3A] hover:bg-[#722d2d] text-white text-xs font-semibold rounded-full shadow-sm shadow-[#8B3A3A]/15 transition-all cursor-pointer"
          >
            <Send size={13} />
            <span>DISPATCH EMERGENCY ALERT</span>
          </button>
          <button
            onClick={() => onNavigateTab('simulation')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#faf3eb] hover:bg-[#f5ecdf] text-[#B37D4E] border border-[#ecdacb] text-xs font-semibold rounded-full transition-all cursor-pointer"
          >
            <Activity size={13} />
            <span>DRILL SIMULATION</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block">
            Active Alerts
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className="text-2xl font-bold text-[#8B3A3A] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {activeAlerts.length}
            </span>
            <span className="text-[10px] text-[#8c8c73] font-medium">Broadcasting</span>
          </div>
        </div>

        <div className="p-4 bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block">
            Pending SOS
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className="text-2xl font-bold text-[#D4A373] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {pendingSos.length}
            </span>
            <span className="text-[10px] text-[#8c8c73] font-medium">Triage Queue</span>
          </div>
        </div>

        <div className="p-4 bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block">
            Rescue Units Ready
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className="text-2xl font-bold text-[#5A5A40] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {availableTeams.length}
            </span>
            <span className="text-[10px] text-[#8c8c73] font-medium">/ {teams.length} Total</span>
          </div>
        </div>

        <div className="p-4 bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block">
            Shelter Occupancy
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className="text-2xl font-bold text-[#434338] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {Math.round((totalShelterOcc / (totalShelterCap || 1)) * 100)}%
            </span>
            <span className="text-[10px] text-[#8c8c73] font-medium">
              ({totalShelterOcc}/{totalShelterCap})
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block">
            Rainfall Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span
              className="text-2xl font-bold text-[#5A5A40] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {weather.rainfallMm}
            </span>
            <span className="text-[10px] text-[#8c8c73] font-medium">mm/hr</span>
          </div>
        </div>

        <div className="p-4 bg-[#fdfbf7] border border-[#e8e4db] rounded-2xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block">
            Telemetry Source
          </span>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-xs font-semibold text-[#434338] uppercase truncate">
              {weather.freshness}
            </span>
          </div>
        </div>
      </div>

      {/* Main Operational Map & Live SOS Triage Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-[#fdfbf7] border border-[#e8e4db] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3
              className="text-base font-bold text-[#434338] font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Sector GIS Operations Map
            </h3>
            <span className="text-xs text-[#8c8c73]">
              Active alerts, safe shelters & distress coordinates
            </span>
          </div>
          <InteractiveMap
            userLocation={userLocation}
            shelters={shelters}
            activeAlert={activeAlerts[0] || null}
            sosRequests={pendingSos}
            heightClass="h-80 sm:h-96"
          />
        </div>

        {/* SOS Live Triage Queue */}
        <div className="bg-[#fdfbf7] border border-[#e8e4db] rounded-3xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3.5">
            <h3
              className="text-base font-bold text-[#434338] flex items-center gap-2 font-serif"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <AlertTriangle size={17} className="text-[#8B3A3A]" />
              <span>Incoming SOS Queue</span>
            </h3>
            <button
              onClick={() => onNavigateTab('sos')}
              className="text-xs font-semibold text-[#5A5A40] hover:underline cursor-pointer"
            >
              Full Desk &rarr;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-96 pr-1">
            {pendingSos.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8c8c73]">
                No active unresolved SOS requests in sector.
              </div>
            ) : (
              pendingSos.map((sos) => (
                <div
                  key={sos.id}
                  onClick={() => onSelectSosForTriage(sos)}
                  className="p-3.5 rounded-2xl bg-white border border-[#e8e4db] hover:border-[#5A5A40] hover:bg-[#f1efe9] transition-all cursor-pointer text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono font-bold text-[#8B3A3A]">{sos.id}</span>
                    <span className="px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-[#434338] text-white uppercase tracking-wider">
                      {sos.status}
                    </span>
                  </div>
                  <div className="font-semibold text-[#434338]">
                    {sos.emergencyType} &bull; {sos.peopleCount} People
                  </div>
                  <p className="text-[11px] text-[#7a7a67] line-clamp-1 mt-0.5">
                    {sos.areaDescription || sos.message}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#8c8c73] mt-2.5 pt-2 border-t border-[#e8e4db]">
                    <span>{sos.assignedTeamName ? `Team: ${sos.assignedTeamName}` : 'UNASSIGNED'}</span>
                    <span>{new Date(sos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
