import React, { useState } from 'react';
import { SimulationScenario } from '../../types';
import { Activity, RotateCcw, AlertTriangle, CloudRain, Wind, Waves, ShieldAlert } from 'lucide-react';

interface SimulationControlProps {
  currentScenario: SimulationScenario;
  isSimulating: boolean;
  authToken: string;
  onSimulationChanged: () => void;
}

const SCENARIOS: {
  id: SimulationScenario;
  title: string;
  desc: string;
  badge: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}[] = [
  {
    id: 'NORMAL',
    title: 'NORMAL OPERATIONS',
    desc: 'Live real-world telemetry and authentic data feeds from Open-Meteo & field stations.',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: ShieldAlert
  },
  {
    id: 'HEAVY_RAIN',
    title: 'HEAVY RAINFALL DRILL',
    desc: 'Simulates 58mm/hr intense monsoon rain, moderate street waterlogging, and elevated drainage pressure.',
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: CloudRain
  },
  {
    id: 'FLOOD',
    title: 'URBAN INUNDATION DRILL',
    desc: 'Simulates severe low-lying urban inundation (112mm rain), Beach Road underpass blockages, and high shelter load.',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: Waves
  },
  {
    id: 'CYCLONE',
    title: 'COASTAL CYCLONE DRILL',
    desc: 'Simulates severe tropical cyclonic storm with 135 km/h winds, storm surge threat, power outages, and coastal evacuations.',
    badge: 'bg-orange-100 text-orange-950 border-orange-300',
    icon: Wind
  },
  {
    id: 'CRITICAL_FLOOD',
    title: 'CATASTROPHIC FLASH FLOOD',
    desc: 'Simulates reservoir outflow surge, 92/100 risk score, multiple SOS distress calls, and mass evacuation routing.',
    badge: 'bg-rose-100 text-rose-950 border-rose-300',
    icon: AlertTriangle
  },
  {
    id: 'LANDSLIDE',
    title: 'HILLSLOPE LANDSLIDE DRILL',
    desc: 'Simulates severe hillside debris blockages along Kailasagiri & Simhachalam ghat roads with trapped passenger buses.',
    badge: 'bg-amber-200 text-amber-950 border-amber-400',
    icon: Activity
  }
];

export const SimulationControl: React.FC<SimulationControlProps> = ({
  currentScenario,
  isSimulating,
  authToken,
  onSimulationChanged
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleActivateScenario = async (scenario: SimulationScenario) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ scenario })
      });

      if (!res.ok) throw new Error('Failed to update disaster simulation state.');

      onSimulationChanged();
      setIsUpdating(false);
    } catch (err: any) {
      alert(err.message);
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity size={20} className="text-purple-700" />
            <span>Disaster Exercise & Scenario Simulation Engine</span>
          </h2>
          <p className="text-xs text-slate-500">
            Simulate realistic disaster scenarios to test public warnings, shelter routing, and rescue team response times.
          </p>
        </div>

        {isSimulating && (
          <button
            disabled={isUpdating}
            onClick={() => handleActivateScenario('NORMAL')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>RESET TO NORMAL (LIVE DATA)</span>
          </button>
        )}
      </div>

      {/* Simulation Active Indicator Banner */}
      {isSimulating && (
        <div className="p-4 bg-purple-100 border-2 border-purple-500 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-600 animate-ping"></div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-900 block">
                SIMULATION EXERCISE ACTIVE ACROSS ALL SYSTEM VIEWS
              </span>
              <h3 className="text-base font-extrabold text-purple-950">
                Current Scenario: {currentScenario}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 bg-purple-900 text-white rounded-md text-xs font-bold uppercase tracking-wider">
            DRILL MODE
          </span>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCENARIOS.map((sc) => {
          const Icon = sc.icon;
          const isActive = currentScenario === sc.id;

          return (
            <div
              key={sc.id}
              className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-purple-50/50 border-purple-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                    <Icon size={20} className={isActive ? 'text-purple-700' : 'text-slate-600'} />
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${sc.badge}`}>
                    {isActive ? 'CURRENT' : sc.id}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {sc.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {sc.desc}
                </p>
              </div>

              <button
                disabled={isUpdating || isActive}
                onClick={() => handleActivateScenario(sc.id)}
                className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase tracking-wider disabled:opacity-50 ${
                  isActive
                    ? 'bg-purple-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isActive ? 'SCENARIO ACTIVE' : `ACTIVATE ${sc.id}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
