import React, { useState } from 'react';
import { Shelter } from '../../types';
import { Home, Users, Check, X, Phone, Plus, Edit2, ShieldCheck } from 'lucide-react';

interface SheltersManagerProps {
  shelters: Shelter[];
  authToken: string;
  onSheltersUpdated: () => void;
}

export const SheltersManager: React.FC<SheltersManagerProps> = ({
  shelters,
  authToken,
  onSheltersUpdated
}) => {
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);
  const [occupiedCapacity, setOccupiedCapacity] = useState<number>(0);
  const [status, setStatus] = useState<Shelter['status']>('OPEN');
  const [isUpdating, setIsUpdating] = useState(false);

  const startEdit = (shelter: Shelter) => {
    setEditingShelter(shelter);
    setOccupiedCapacity(shelter.occupiedCapacity);
    setStatus(shelter.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShelter) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/shelters/${editingShelter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          occupiedCapacity: Number(occupiedCapacity),
          status
        })
      });

      if (!res.ok) throw new Error('Failed to update shelter status.');

      onSheltersUpdated();
      setEditingShelter(null);
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
          <h2
            className="text-xl font-bold text-[#434338] font-serif"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Emergency Relief Shelters & Evacuation Logistics
          </h2>
          <p className="text-xs text-[#8c8c73] mt-0.5">
            Manage bed capacities, relief stockpiles, and intake statuses across cyclone centers.
          </p>
        </div>
      </div>

      {/* Edit Modal if open */}
      {editingShelter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#434338]/60 backdrop-blur-xs">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-md bg-[#fdfbf7] rounded-3xl shadow-xl border border-[#e8e4db] p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e4db]">
              <h3
                className="text-base font-bold text-[#434338] font-serif"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Update: {editingShelter.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingShelter(null)}
                className="p-1 rounded-full text-[#8c8c73] hover:text-[#434338] hover:bg-[#f1efe9] cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block mb-1">
                Occupied Capacity (Total {editingShelter.totalCapacity})
              </label>
              <input
                type="number"
                min={0}
                max={editingShelter.totalCapacity}
                value={occupiedCapacity}
                onChange={(e) => setOccupiedCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm font-semibold bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] text-[#434338]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c8c73] block mb-1">
                Facility Operating Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Shelter['status'])}
                className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-[#e8e4db] rounded-xl focus:ring-2 focus:ring-[#5A5A40] text-[#434338]"
              >
                <option value="OPEN">OPEN (Accepting Evacuees)</option>
                <option value="LIMITED">LIMITED (Near Capacity)</option>
                <option value="FULL">FULL (Direct to Secondary Shelter)</option>
                <option value="CLOSED">CLOSED (Inundated / Inactive)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingShelter(null)}
                className="px-4 py-2 border border-[#e8e4db] rounded-full text-xs font-semibold text-[#7a7a67] hover:bg-[#f1efe9] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2 bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-semibold rounded-full transition-all shadow-sm shadow-[#5A5A40]/15 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'SAVE CHANGES'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shelters.map((shelter) => (
          <div
            key={shelter.id}
            className="bg-[#fdfbf7] border border-[#e8e4db] rounded-3xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-mono font-semibold text-[#8c8c73]">
                  {shelter.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    shelter.status === 'OPEN'
                      ? 'bg-[#edf1eb] text-[#5A5A40] border border-[#d8ded3]'
                      : shelter.status === 'LIMITED'
                      ? 'bg-[#faf3eb] text-[#B37D4E] border border-[#ecdacb]'
                      : 'bg-[#faecea] text-[#8B3A3A] border border-[#efc7c3]'
                  }`}
                >
                  {shelter.status}
                </span>
              </div>

              <h3
                className="text-base font-bold text-[#434338] mb-1 font-serif"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {shelter.name}
              </h3>
              <p className="text-xs text-[#7a7a67] mb-3.5">
                {shelter.address}, {shelter.district}
              </p>

              {/* Capacity visual */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#e8e4db] mb-3.5 text-xs">
                <div className="flex justify-between font-semibold text-[#434338] mb-1.5">
                  <span>Occupancy</span>
                  <span className="text-[#7a7a67]">{shelter.occupiedCapacity} / {shelter.totalCapacity} ({shelter.availableCapacity} free)</span>
                </div>
                <div className="w-full bg-[#f1efe9] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5A5A40] h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (shelter.occupiedCapacity / shelter.totalCapacity) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Facilities tags */}
              <div className="flex flex-wrap gap-1.5 text-[10px] font-medium mb-3.5">
                <span className="px-2.5 py-1 bg-[#f1efe9] text-[#434338] rounded-full border border-[#e8e4db]">
                  Food: {shelter.facilities.food ? 'Yes' : 'No'}
                </span>
                <span className="px-2.5 py-1 bg-[#f1efe9] text-[#434338] rounded-full border border-[#e8e4db]">
                  Water: {shelter.facilities.water ? 'Yes' : 'No'}
                </span>
                <span className="px-2.5 py-1 bg-[#f1efe9] text-[#434338] rounded-full border border-[#e8e4db]">
                  Medical: {shelter.facilities.medical ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#e8e4db] flex items-center justify-between">
              <span className="text-[11px] text-[#8c8c73] font-mono">
                {shelter.contactPhone}
              </span>
              <button
                onClick={() => startEdit(shelter)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5A5A40] hover:text-[#434338] hover:bg-[#f1efe9] rounded-full transition-colors cursor-pointer"
              >
                <Edit2 size={12} />
                <span>Adjust Load</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
