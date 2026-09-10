/**
 * SURAKSHA Shelter Discovery Service
 * Proximity-based shelter filtering with real-time capacity and disaster risk ranking.
 */

import { Shelter } from '../../src/types';
import { sheltersCollection } from '../database/store';

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearbyShelters(latitude: number, longitude: number): Shelter[] {
  const all = sheltersCollection.getAll();

  const withDistance = all.map((s) => {
    const dist = getDistanceKm(latitude, longitude, s.latitude, s.longitude);
    return {
      ...s,
      distanceKm: Math.round(dist * 10) / 10
    };
  });

  // Sort by distance and capacity availability
  return withDistance.sort((a, b) => {
    // If one is closed/full, rank lower
    if (a.status === 'FULL' || a.status === 'CLOSED') return 1;
    if (b.status === 'FULL' || b.status === 'CLOSED') return -1;
    return (a.distanceKm || 0) - (b.distanceKm || 0);
  });
}
