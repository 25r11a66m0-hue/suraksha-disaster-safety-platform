import React, { useState } from 'react';
import { RescueTeam, RescueTeamStatus } from '../../types';
import { Truck, Users, Phone, ShieldCheck, Wrench, Radio, CheckCircle2 } from 'lucide-react';

interface RescueTeamsManagerProps {
  teams: RescueTeam[];
  authToken: string;
  onTeamsUpdated: () => void;
}

export const RescueTeamsManager: React.FC<RescueTeamsManagerProps> = ({
  teams,
  authToken,
  onTeamsUpdated
}) => {
  const [selectedTeam, setSelectedTeam] = useState<RescueTeam | null>(null);
  const [newStatus, setNewStatus] = useState<RescueTeamStatus>('AVAILABLE');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (teamId: string, status: RescueTeamStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/rescue-teams/${teamId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error('Failed to update team readiness.');

      onTeamsUpdated();
      setIsUpdating(false);
      setSelectedTeam(null);
    } catch (err: any) {
      alert(err.message);
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Disaster Response Teams & Readiness Roster
          </h2>
          <p className="text-xs text-slate-500">
            NDRF, SDRF, Indian Navy Detachments, and District Emergency Quick Reaction Units.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          {teams.length} Deployed Field Detachments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block">
                  {team.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {team.name}
                </h3>
              </div>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  team.currentStatus === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : team.currentStatus === 'ON_SCENE'
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {team.currentStatus}
              </span>
            </div>

            {/* Commander & Personnel */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Commander:</span>
                <span className="font-semibold text-slate-800">{team.leaderName}</span>
                <a href={`tel:${team.contactPhone}`} className="text-blue-700 block text-[11px] font-mono">
                  {team.contactPhone}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Strength:</span>
                <span className="font-semibold text-slate-800">{team.personnelCount} Trained Responders</span>
                <span className="text-slate-500 block text-[11px]">
                  {team.assignedSosId ? `Assigned: ${team.assignedSosId}` : 'No active incident'}
                </span>
              </div>
            </div>

            {/* Equipment Inventory */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Tactical Gear & Vehicles:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {team.equipment.map((eq, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[11px] font-medium"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Status Switcher Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 font-medium">Readiness:</span>
              <div className="flex gap-1.5">
                {(['AVAILABLE', 'EN_ROUTE', 'ON_SCENE', 'RESTING'] as const).map((st) => (
                  <button
                    key={st}
                    disabled={isUpdating || team.currentStatus === st}
                    onClick={() => handleStatusUpdate(team.id, st)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors cursor-pointer disabled:opacity-40 ${
                      team.currentStatus === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
