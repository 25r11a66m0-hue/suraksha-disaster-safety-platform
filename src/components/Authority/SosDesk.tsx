import React, { useState } from 'react';
import { SosRequest, SosStatus, RescueTeam } from '../../types';
import { AlertOctagon, CheckCircle2, Truck, Users, HeartPulse, MapPin, Phone, MessageSquare, Filter } from 'lucide-react';
import { BackButton } from '../BackButton';
import { auth } from '../../lib/firebase';

interface SosDeskProps {
  sosRequests: SosRequest[];
  rescueTeams: RescueTeam[];
  authToken: string;
  onSosUpdated: () => void;
  selectedSosForTriage?: SosRequest | null;
  onClearSelectedSos?: () => void;
}

export const SosDesk: React.FC<SosDeskProps> = ({
  sosRequests,
  rescueTeams,
  authToken,
  onSosUpdated,
  selectedSosForTriage,
  onClearSelectedSos
}) => {
  const [activeSos, setActiveSos] = useState<SosRequest | null>(selectedSosForTriage || null);
  const [targetStatus, setTargetStatus] = useState<SosStatus>('AUTHORITY_NOTIFIED');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync selected SOS if passed from parent
  React.useEffect(() => {
    if (selectedSosForTriage) {
      setActiveSos(selectedSosForTriage);
      setTargetStatus(selectedSosForTriage.status);
      setSelectedTeamId(selectedSosForTriage.assignedTeamId || '');
    }
  }, [selectedSosForTriage]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSos) return;
    
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!selectedTeamId) {
      setErrorMsg('Please select a Disaster Response Unit before notifying the team.');
      return;
    }

    setIsUpdating(true);

    try {
      let token = authToken;
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      if (!token) {
        setErrorMsg('Authentication required. Missing token. Please re-authenticate as an Authority.');
        setIsUpdating(false);
        return;
      }

      const res = await fetch(`/api/sos/${activeSos.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: targetStatus,
          note: statusNote || `Status set to ${targetStatus} by Disaster Operations Officer.`,
          assignedTeamId: selectedTeamId || undefined
        })
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update SOS status.');

      setActiveSos(updated);
      setIsUpdating(false);
      setStatusNote('');
      setSuccessMsg('Response team notified successfully.');
      onSosUpdated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to notify response team.');
      setIsUpdating(false);
    }
  };

  const filteredSos = sosRequests.filter((s) => {
    if (filterType === 'ACTIVE') return s.status !== 'RESOLVED';
    if (filterType === 'RESOLVED') return s.status === 'RESOLVED';
    if (filterType === 'MEDICAL') return s.medicalAssistanceRequired;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Emergency SOS Incident Desk & Triage
          </h2>
          <p className="text-xs text-slate-500">
            Live monitoring, incident triage, and deployment coordination for distress calls.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
          {(['ALL', 'ACTIVE', 'MEDICAL', 'RESOLVED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                filterType === f
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: SOS List + Triage Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table/List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Distress Queue ({filteredSos.length} Incidents)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Auto-refreshed
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredSos.map((sos) => {
              const isSelected = activeSos?.id === sos.id;
              const isPending = sos.status !== 'RESOLVED';

              return (
                <div
                  key={sos.id}
                  onClick={() => {
                    setActiveSos(sos);
                    setTargetStatus(sos.status);
                    setSelectedTeamId(sos.assignedTeamId || '');
                  }}
                  className={`p-4 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/70 border-l-4 border-amber-600'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-rose-700 text-xs">
                        {sos.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          sos.status === 'RESOLVED'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {sos.status}
                      </span>
                      {sos.medicalAssistanceRequired && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold bg-red-600 text-white rounded">
                          <HeartPulse size={10} /> MEDICAL
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(sos.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 mb-1">
                    {sos.emergencyType} SOS &bull; {sos.peopleCount} Person(s) &bull; {sos.userName} ({sos.userPhone})
                  </div>

                  <p className="text-xs text-slate-600 mb-2">
                    {sos.areaDescription || sos.message}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-mono">
                      <MapPin size={11} className="text-slate-400" />
                      {sos.latitude.toFixed(4)}°N, {sos.longitude.toFixed(4)}°E
                    </span>
                    <span className="font-semibold text-slate-700">
                      {sos.assignedTeamName ? `Assigned: ${sos.assignedTeamName}` : 'NO TEAM ASSIGNED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Triage & Assignment Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          {activeSos ? (
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Incident Triage Action
                  </span>
                  <h3 className="text-base font-black text-rose-700 font-mono">
                    {activeSos.id}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <BackButton
                    onClick={() => {
                      setActiveSos(null);
                      if (onClearSelectedSos) onClearSelectedSos();
                    }}
                    label="Incident Queue"
                  />
                  {onClearSelectedSos && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSos(null);
                        onClearSelectedSos();
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Citizen Details */}
              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 border border-slate-200/60">
                <div className="flex justify-between">
                  <span className="text-slate-500">Citizen:</span>
                  <span className="font-bold text-slate-800">{activeSos.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <a href={`tel:${activeSos.userPhone}`} className="font-mono font-bold text-blue-700 underline">
                    {activeSos.userPhone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="font-mono text-slate-700">{activeSos.latitude.toFixed(4)}°N, {activeSos.longitude.toFixed(4)}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency:</span>
                  <span className="font-bold text-rose-700">{activeSos.emergencyType} ({activeSos.peopleCount} ppl)</span>
                </div>
              </div>

              {/* Lifecycle progression selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Update Lifecycle Status:
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as SosStatus)}
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="RECEIVED">RECEIVED (Logged)</option>
                  <option value="AUTHORITY_NOTIFIED">AUTHORITY_NOTIFIED (Triaged by EOC)</option>
                  <option value="TEAM_ASSIGNED">TEAM_ASSIGNED (Unit Assigned)</option>
                  <option value="DISPATCHED">DISPATCHED (En Route)</option>
                  <option value="TEAM_REACHED">TEAM_REACHED (On Scene)</option>
                  <option value="RESOLVED">RESOLVED (Secured)</option>
                </select>
              </div>

              {/* Assign Rescue Unit */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Assign Disaster Response Unit:
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  <option value="">-- No Team Assigned --</option>
                  {rescueTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.currentStatus} - {team.personnelCount} pax)
                    </option>
                  ))}
                </select>
              </div>

              {/* Operation note */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Command Dispatch Note:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inflatable motorized boat deployed with trauma medical kit..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isUpdating && <div className="w-3 h-3 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>}
                {isUpdating ? 'Notifying team...' : 'COMMIT STATUS & NOTIFY TEAM'}
              </button>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
                  {successMsg}
                </div>
              )}

              {/* History Trail in Drawer */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Status History Trail:
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {activeSos.statusHistory.map((h, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded text-[11px] text-slate-700 border border-slate-200/50">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>[{h.status}]</span>
                        <span className="font-mono font-normal text-slate-400">
                          {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{h.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <AlertOctagon size={36} className="mb-2 text-slate-300" />
              <p className="text-xs">Select any SOS incident from the distress queue to triage and assign rescue teams.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
