import React from 'react';
import { EmergencyAlert, SosRequest, Shelter, DisasterResource } from '../../types';
import { BarChart3, TrendingUp, Users, Clock, ShieldCheck, Download } from 'lucide-react';

interface AnalyticsViewProps {
  alerts: EmergencyAlert[];
  sosRequests: SosRequest[];
  shelters: Shelter[];
  resources: DisasterResource[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  alerts,
  sosRequests,
  shelters,
  resources
}) => {
  const totalShelterCap = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalShelterOcc = shelters.reduce((acc, s) => acc + s.occupiedCapacity, 0);

  // Group SOS by type
  const typeCounts = sosRequests.reduce((acc, s) => {
    acc[s.emergencyType] = (acc[s.emergencyType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      district: 'Visakhapatnam Operational Command',
      summary: {
        totalAlertsDispatched: alerts.length,
        totalSosRequestsReceived: sosRequests.length,
        sosDistribution: typeCounts,
        shelterCapacity: totalShelterCap,
        shelterOccupancy: totalShelterOcc,
        overallEvacuationLoadPct: Math.round((totalShelterOcc / (totalShelterCap || 1)) * 100),
        activeStockpileCategories: resources.length
      },
      auditSignoff: 'District Disaster Management Authority (DDMA) AP'
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suraksha-operational-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 size={20} className="text-amber-800" />
            <span>Disaster Analytics & Post-Incident Reporting</span>
          </h2>
          <p className="text-xs text-slate-500">
            Performance indicators, shelter load factors, and distress response timelines.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Download size={14} />
          <span>EXPORT INCIDENT REPORT (JSON)</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Average Response Time
          </span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">
            14.2 min
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            From SOS logging to team dispatch
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Evacuation Load Factor
          </span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">
            {Math.round((totalShelterOcc / (totalShelterCap || 1)) * 100)}%
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {totalShelterOcc.toLocaleString()} / {totalShelterCap.toLocaleString()} beds occupied
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Distress Call Resolution Rate
          </span>
          <span className="text-3xl font-black text-emerald-700 mt-1 block">
            87.5%
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Successful rescue extractions
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            SMS Penetration
          </span>
          <span className="text-3xl font-black text-blue-900 mt-1 block">
            99.1%
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Gateway delivery success
          </span>
        </div>
      </div>

      {/* Distress Category Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          SOS Incidents by Emergency Category
        </h3>

        <div className="space-y-3">
          {(['RESCUE', 'MEDICAL', 'FOOD', 'WATER', 'OTHER'] as const).map((type) => {
            const count = typeCounts[type] || 0;
            const pct = Math.round((count / (sosRequests.length || 1)) * 100);

            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{type}</span>
                  <span>{count} incidents ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-700 h-full transition-all"
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
