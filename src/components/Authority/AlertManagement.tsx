import React, { useState } from 'react';
import { EmergencyAlert, DisasterType, SeverityLevel, Shelter } from '../../types';
import { Send, AlertTriangle, Radio, CheckCircle2, ShieldAlert, MessageSquare, Phone, Users } from 'lucide-react';
import { BackButton } from '../BackButton';

interface AlertManagementProps {
  alerts: EmergencyAlert[];
  shelters: Shelter[];
  authToken: string;
  onAlertCreated: (newAlert: EmergencyAlert) => void;
  onRefreshAlerts: () => void;
}

export const AlertManagement: React.FC<AlertManagementProps> = ({
  alerts,
  shelters,
  authToken,
  onAlertCreated,
  onRefreshAlerts
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [disasterType, setDisasterType] = useState<DisasterType>('FLOOD');
  const [severity, setSeverity] = useState<SeverityLevel>('CRITICAL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [affectedArea, setAffectedArea] = useState('Visakhapatnam Coastal Sector');
  const [latitude, setLatitude] = useState(17.7121);
  const [longitude, setLongitude] = useState(83.3245);
  const [radiusKm, setRadiusKm] = useState(15);
  const [recommendedAction, setRecommendedAction] = useState('Evacuate lowlands and proceed to nearest cyclone shelter immediately.');
  const [recommendedShelterId, setRecommendedShelterId] = useState(shelters[0]?.id || '');
  const [safetyInstructionsText, setSafetyInstructionsText] = useState(
    'Move to 2nd floor or higher immediately.\nDo not drive or walk through flood waters.\nKeep phone on battery saver and listen for NDRF whistles.'
  );
  const [publishState, setPublishState] = useState<'IDLE' | 'PUBLISHING' | 'DISPATCHING'>('IDLE');
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishState('PUBLISHING');
    setDispatchResult(null);
    setErrorMsg(null);

    const safetyInstructions = safetyInstructionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      // Small timeout to visually show the transition from publishing to dispatching
      setTimeout(() => {
         setPublishState(prev => prev === 'PUBLISHING' ? 'DISPATCHING' : prev);
      }, 800);

      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          disasterType,
          severity,
          title,
          message,
          affectedArea,
          latitude: Number(latitude),
          longitude: Number(longitude),
          radiusKm: Number(radiusKm),
          recommendedAction,
          safetyInstructions,
          recommendedShelterId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch alert.');

      onAlertCreated(data);
      setDispatchResult(data);
      setPublishState('IDLE');
      setIsCreating(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to broadcast alert.');
      setPublishState('IDLE');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Emergency Alert & Broadcast Dispatcher
          </h2>
          <p className="text-xs text-slate-500">
            Publish official alerts and dispatch instant geofenced SMS notifications to registered citizens.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Send size={14} />
          <span>{isCreating ? 'CLOSE COMPOSER' : 'COMPOSE & BROADCAST ALERT'}</span>
        </button>
      </div>

      {/* Alert Composer Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreateAlert}
          className="bg-white border-2 border-rose-600 rounded-xl p-6 shadow-md space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Radio size={18} className="text-rose-600 animate-pulse" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-950">
                Broadcast Alert Transmitter
              </h3>
            </div>
            <BackButton
              onClick={() => setIsCreating(false)}
              label="Alerts Desk"
              hasUnsavedChanges={Boolean(title.trim() || message.trim())}
              confirmMessage="You have entered alert details. Are you sure you want to go back and discard the draft?"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Disaster Classification:
              </label>
              <select
                value={disasterType}
                onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-semibold"
              >
                <option value="FLOOD">FLOOD</option>
                <option value="CYCLONE">CYCLONE</option>
                <option value="EARTHQUAKE">EARTHQUAKE</option>
                <option value="LANDSLIDE">LANDSLIDE</option>
                <option value="HEAVY_RAINFALL">HEAVY RAINFALL</option>
                <option value="TSUNAMI">TSUNAMI</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Threat Severity Level:
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-semibold"
              >
                <option value="LOW">LOW</option>
                <option value="MODERATE">MODERATE</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Alert Headline:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FLASH FLOOD INUNDATION WARNING"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Public Advisory Message:
            </label>
            <textarea
              rows={2}
              required
              placeholder="Detailed threat warning message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Affected Corridor / Area:
              </label>
              <input
                type="text"
                required
                value={affectedArea}
                onChange={(e) => setAffectedArea(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Radius (km):
              </label>
              <input
                type="number"
                min={1}
                max={250}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Designated Evacuation Shelter:
              </label>
              <select
                value={recommendedShelterId}
                onChange={(e) => setRecommendedShelterId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              >
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.availableCapacity} beds)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Immediate Safety Instructions (One per line):
            </label>
            <textarea
              rows={3}
              value={safetyInstructionsText}
              onChange={(e) => setSafetyInstructionsText(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={publishState !== 'IDLE'}
              className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {publishState !== 'IDLE' && <div className="w-3 h-3 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>}
              {publishState === 'PUBLISHING' ? 'Publishing...' : publishState === 'DISPATCHING' ? 'Dispatching...' : 'PUBLISH & DISPATCH BROADCAST'}
            </button>
          </div>
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}
        </form>
      )}

      {/* Broadcast Delivery Confirmation Report */}
      {dispatchResult?.smsStats && (
        <div className={`p-4 border rounded-xl space-y-2 ${dispatchResult.smsStats.sent > 0 || dispatchResult.smsStats.pending > 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'}`}>
          <div className={`flex items-center gap-2 font-bold text-sm ${dispatchResult.smsStats.sent > 0 || dispatchResult.smsStats.pending > 0 ? 'text-emerald-900' : 'text-amber-900'}`}>
            {dispatchResult.smsStats.sent > 0 || dispatchResult.smsStats.pending > 0 ? (
              <>
                <CheckCircle2 size={18} className="text-emerald-700" />
                <span>Published & dispatched successfully.</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} className="text-amber-700" />
                <span>Alert published, but broadcast dispatch failed.</span>
              </>
            )}
          </div>
          <div className={`text-xs ${dispatchResult.smsStats.sent > 0 || dispatchResult.smsStats.pending > 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
            Total Target Devices in Geofence: <strong>{dispatchResult.smsStats.targetedUsers}</strong> &bull; Successful Gateway Deliveries: <strong>{dispatchResult.smsStats.sent + dispatchResult.smsStats.pending}</strong>
          </div>
          <div className="bg-white/80 p-3 rounded-lg text-xs font-mono text-slate-700 border border-emerald-200">
            <strong>Sample Alert Sent:</strong>
            <p className="mt-1 text-slate-900 font-semibold">{dispatchResult.title}: {dispatchResult.recommendedAction}</p>
          </div>
        </div>
      )}

      {/* Existing Alerts Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Active and Broadcast History
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {alerts.length} Total Alerts in Database
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Alert ID</th>
                <th className="p-3">Disaster</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Affected Area</th>
                <th className="p-3">Radius</th>
                <th className="p-3">Authority</th>
                <th className="p-3">Status</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {alerts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="p-3 font-mono font-bold text-slate-900">{a.id}</td>
                  <td className="p-3 font-bold text-slate-800">{a.disasterType}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        a.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-900'
                          : a.severity === 'HIGH'
                          ? 'bg-orange-100 text-orange-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {a.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{a.affectedArea}</td>
                  <td className="p-3 font-mono text-slate-600">{a.radiusKm} km</td>
                  <td className="p-3 text-slate-600">{a.authorityName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono">
                    {new Date(a.createdAt).toLocaleDateString()} {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
