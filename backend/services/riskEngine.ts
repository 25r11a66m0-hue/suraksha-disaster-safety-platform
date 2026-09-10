/**
 * SURAKSHA Deterministic Risk Engine
 * Multi-factor vulnerability and hazards assessment.
 * Combines live meteorological indicators, topography/coastal vulnerability, active alerts,
 * and historical inundation parameters into a deterministic 0-100 score.
 */

import { RiskAnalysis, SeverityLevel, DisasterType, WeatherData } from '../../src/types';
import { alertsCollection, simulationStateCollection } from '../database/store';

// Known high-risk coastal / low-lying reference coordinates (e.g. Visakhapatnam Beach Road, Gajuwaka lowlands)
const COASTAL_VULNERABLE_AREAS = [
  { name: 'RK Beach Lowland Belt', lat: 17.712, lng: 83.324, baseRisk: 25 },
  { name: 'Gajuwaka Industrial Drainage Basin', lat: 17.691, lng: 83.218, baseRisk: 22 },
  { name: 'Madhurawada Floodplain Corridor', lat: 17.815, lng: 83.355, baseRisk: 20 },
  { name: 'Bheemunipatnam (Bheemili) Coastal Estuary', lat: 17.892, lng: 83.454, baseRisk: 24 }
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function computeRiskScore(
  latitude: number,
  longitude: number,
  weather: WeatherData
): RiskAnalysis {
  // Check if an emergency simulation is currently overriding parameters
  const sim = simulationStateCollection.getById('singleton_sim_state');
  const isSim = sim?.isActive;

  // Factor 1: Rainfall & Precipitation Intensity (Weight: 30%)
  const rainfall = isSim ? sim.simulatedRainfallMm : weather.rainfallMm;
  const rainProb = weather.rainProbability;
  let rainFactorScore = 0;
  if (rainfall > 70) rainFactorScore = 95;
  else if (rainfall > 40) rainFactorScore = 80;
  else if (rainfall > 20) rainFactorScore = 60;
  else if (rainfall > 5) rainFactorScore = 35;
  else rainFactorScore = Math.min(25, rainProb * 0.25);

  // Factor 2: Wind Speed & Storm Gale (Weight: 25%)
  const windSpeed = isSim ? sim.simulatedWindSpeedKmH : weather.windSpeedKmH;
  let windFactorScore = 0;
  if (windSpeed > 100) windFactorScore = 98; // Cyclone gale
  else if (windSpeed > 65) windFactorScore = 82;
  else if (windSpeed > 45) windFactorScore = 60;
  else if (windSpeed > 25) windFactorScore = 30;
  else windFactorScore = 12;

  // Factor 3: Topographic & Low-lying Coastal Proximity (Weight: 20%)
  let proximityScore = 10; // Default baseline
  let closestAreaName = 'Inland Plateau';
  for (const zone of COASTAL_VULNERABLE_AREAS) {
    const dist = getDistanceKm(latitude, longitude, zone.lat, zone.lng);
    if (dist < 3) {
      proximityScore = Math.max(proximityScore, zone.baseRisk * 3.2);
      closestAreaName = zone.name;
    } else if (dist < 8) {
      proximityScore = Math.max(proximityScore, zone.baseRisk * 1.8);
      closestAreaName = zone.name;
    }
  }

  // Factor 4: Active Official Emergency Alerts in Radius (Weight: 25%)
  const activeAlerts = alertsCollection.filter((a) => a.status === 'ACTIVE');
  let alertSeverityBonus = 0;
  let matchingHazard: DisasterType = 'FLOOD';
  for (const alert of activeAlerts) {
    const dist = getDistanceKm(latitude, longitude, alert.latitude, alert.longitude);
    if (dist <= alert.radiusKm) {
      matchingHazard = alert.disasterType;
      if (alert.severity === 'CRITICAL') alertSeverityBonus = Math.max(alertSeverityBonus, 95);
      else if (alert.severity === 'HIGH') alertSeverityBonus = Math.max(alertSeverityBonus, 78);
      else if (alert.severity === 'MODERATE') alertSeverityBonus = Math.max(alertSeverityBonus, 45);
      else alertSeverityBonus = Math.max(alertSeverityBonus, 20);
    }
  }

  // If simulation is active, override with simulated scenario parameters
  if (isSim && sim) {
    if (sim.currentScenario === 'CRITICAL_FLOOD' || sim.currentScenario === 'CYCLONE') {
      matchingHazard = sim.currentScenario === 'CYCLONE' ? 'CYCLONE' : 'FLOOD';
      alertSeverityBonus = 92;
    } else if (sim.currentScenario === 'FLOOD') {
      matchingHazard = 'FLOOD';
      alertSeverityBonus = 72;
    } else if (sim.currentScenario === 'HEAVY_RAIN') {
      matchingHazard = 'EXTREME_RAIN';
      alertSeverityBonus = 55;
    }
  }

  // Weighted sum calculation:
  // Rain: 30%, Wind: 25%, Topography: 20%, Active Alerts: 25%
  const computedScore = Math.round(
    rainFactorScore * 0.30 +
    windFactorScore * 0.25 +
    proximityScore * 0.20 +
    alertSeverityBonus * 0.25
  );

  const finalScore = Math.min(100, Math.max(0, computedScore));

  let riskLevel: SeverityLevel = 'LOW';
  if (finalScore >= 81) riskLevel = 'CRITICAL';
  else if (finalScore >= 61) riskLevel = 'HIGH';
  else if (finalScore >= 31) riskLevel = 'MODERATE';
  else riskLevel = 'LOW';

  const factors = [
    {
      name: 'Precipitation & Water Volume',
      score: Math.round(rainFactorScore),
      weight: 30,
      description: `${rainfall} mm recorded/forecast. Rate is ${weather.rainfallIntensity.toLowerCase()}.`
    },
    {
      name: 'Wind & Atmospheric Disturbance',
      score: Math.round(windFactorScore),
      weight: 25,
      description: `${windSpeed} km/h recorded in sector.`
    },
    {
      name: 'Terrain & Inundation Sensitivity',
      score: Math.round(proximityScore),
      weight: 20,
      description: `Proximity to ${closestAreaName}. Inundation susceptibility index applied.`
    },
    {
      name: 'Verified Authority Directives',
      score: Math.round(alertSeverityBonus),
      weight: 25,
      description: alertSeverityBonus > 0 ? `Active official alert within sector radius.` : `No critical warnings active in immediate 15km.`
    }
  ];

  let summaryText = 'Normal baseline conditions. Monitor local advisories during monsoon periods.';
  if (riskLevel === 'CRITICAL') {
    summaryText = `CRITICAL HAZARD DETECTED: Rapid inundation/cyclonic threat in this sector. Execute evacuation to designated shelter immediately.`;
  } else if (riskLevel === 'HIGH') {
    summaryText = `HIGH DISASTER RISK: Severe precipitation or gale winds impacting low-lying roads. Prepare emergency supplies and avoid coastal corridors.`;
  } else if (riskLevel === 'MODERATE') {
    summaryText = `MODERATE RISK: Weather disturbance observed. Waterlogging potential on low arterial roads. Stay tuned to SURAKSHA.`;
  }

  return {
    riskScore: finalScore,
    riskLevel,
    primaryHazard: matchingHazard,
    factors,
    timestamp: new Date().toISOString(),
    freshness: isSim ? 'SIMULATION' : weather.freshness,
    summaryText
  };
}
