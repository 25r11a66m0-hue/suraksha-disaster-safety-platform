import React, { useState } from 'react';
import { DisasterResource } from '../../types';
import { Package, Droplets, Utensils, LifeBuoy, HeartPulse, Zap, Fuel, Plus, Minus } from 'lucide-react';

interface ResourcesManagerProps {
  resources: DisasterResource[];
  authToken: string;
  onResourcesUpdated: () => void;
}

const RESOURCE_ICONS: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  WATER: Droplets,
  FOOD: Utensils,
  BOATS: LifeBuoy,
  MEDICAL: HeartPulse,
  POWER: Zap,
  FUEL: Fuel
};

export const ResourcesManager: React.FC<ResourcesManagerProps> = ({
  resources,
  authToken,
  onResourcesUpdated
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAdjustQuantity = async (resource: DisasterResource, delta: number) => {
    const newQty = Math.max(0, resource.quantity + delta);
    setUpdatingId(resource.id);

    try {
      const res = await fetch(`/api/resources/${resource.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ quantity: newQty })
      });

      if (!res.ok) throw new Error('Failed to update inventory.');

      onResourcesUpdated();
      setUpdatingId(null);
    } catch (err: any) {
      alert(err.message);
      setUpdatingId(null);
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
            Disaster Relief Stockpile & Logistics Warehouse
          </h2>
          <p className="text-xs text-[#8c8c73] mt-0.5">
            Strategic disaster stockpiles for Visakhapatnam District EOC and regional supply depots.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res) => {
          const Icon = RESOURCE_ICONS[res.category] || Package;
          const available = res.quantity - res.allocated;

          return (
            <div
              key={res.id}
              className="bg-[#fdfbf7] border border-[#e8e4db] rounded-3xl p-6 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#f1efe9] text-[#5A5A40] rounded-2xl">
                    <Icon size={20} className="text-[#5A5A40]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8c8c73] font-semibold block">
                      {res.id}
                    </span>
                    <h3
                      className="text-base font-bold text-[#434338] font-serif"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {res.name}
                    </h3>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    res.status === 'SURPLUS' || res.status === 'ADEQUATE'
                      ? 'bg-[#edf1eb] text-[#5A5A40] border border-[#d8ded3]'
                      : 'bg-[#faecea] text-[#8B3A3A] border border-[#efc7c3]'
                  }`}
                >
                  {res.status}
                </span>
              </div>

              {/* Stock numbers */}
              <div className="bg-white p-4 rounded-2xl border border-[#e8e4db] text-xs">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[#7a7a67]">Total Stockpile:</span>
                  <span
                    className="text-lg font-bold text-[#434338] font-serif"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {res.quantity.toLocaleString()} {res.unit}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#7a7a67]">
                  <span>Allocated to Field: {res.allocated}</span>
                  <span className="font-semibold text-[#5A5A40]">Available: {available}</span>
                </div>
              </div>

              {/* Warehouse Location */}
              <div className="text-[11px] text-[#8c8c73]">
                Depot: <span className="text-[#434338] font-medium">{res.location}</span>
              </div>

              {/* Adjust Stock Controls */}
              <div className="pt-3 border-t border-[#e8e4db] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#8c8c73]">Quick Adjust:</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={updatingId === res.id || res.quantity <= 0}
                    onClick={() => handleAdjustQuantity(res, -50)}
                    className="p-2 bg-white border border-[#e8e4db] hover:bg-[#f1efe9] rounded-xl text-[#434338] cursor-pointer disabled:opacity-40 transition-colors"
                    title="Deduct 50"
                  >
                    <Minus size={13} />
                  </button>
                  <button
                    disabled={updatingId === res.id}
                    onClick={() => handleAdjustQuantity(res, 50)}
                    className="p-2 bg-white border border-[#e8e4db] hover:bg-[#f1efe9] rounded-xl text-[#434338] cursor-pointer disabled:opacity-40 transition-colors"
                    title="Add 50"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
