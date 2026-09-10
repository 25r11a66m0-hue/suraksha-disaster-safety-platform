import React from 'react';
import { BookOpen, Calendar, Wind, CloudRain, Users, Award } from 'lucide-react';

const HISTORICAL_EVENTS = [
  {
    id: 'HIST-HUDHUD-2014',
    name: 'Very Severe Cyclonic Storm Hudhud',
    year: 'October 12, 2014',
    location: 'Visakhapatnam Landfall (Kailasagiri coast)',
    peakWinds: '215 km/h (Gusts up to 260 km/h)',
    rainfall: '380 mm in 24 hours',
    evacuatedCount: '248,000 citizens evacuated',
    impactSummary: 'Immense infrastructure damage to Visakhapatnam port, telecommunication towers, and electrical grid. The eye passed directly over the city.',
    lessonsLearned: [
      'Terrestrial cell towers suffered 82% failure within 4 hours; offline-first citizen safety apps are essential.',
      'Underground power cabling and resilient shelter generators prevented total hospital shutdown.',
      'Deterministic early warning SMS saved hundreds of fishermen and coastal hutment dwellers.'
    ]
  },
  {
    id: 'HIST-GULAB-2021',
    name: 'Cyclonic Storm Gulab',
    year: 'September 26, 2021',
    location: 'North Andhra Coastal Corridor (Kalingapatnam)',
    peakWinds: '95 km/h',
    rainfall: '280 mm intense localized downpours',
    evacuatedCount: '85,000 citizens evacuated',
    impactSummary: 'Severe flash flooding and inundation across low-lying railway corridors and national highway underpasses.',
    lessonsLearned: [
      'Lowland roads become deathtraps even with moderate cyclones; evacuation routing must actively steer people away from subways.',
      'Community shelter food and medical supplies must be pre-positioned at least 18 hours prior to landfall.'
    ]
  },
  {
    id: 'HIST-VIZAG-FLOOD-2020',
    name: 'Visakhapatnam Urban Inundation Event',
    year: 'October 14, 2020',
    location: 'Gajuwaka & Madhurawada Basin',
    peakWinds: '55 km/h',
    rainfall: '210 mm in 6 hours',
    evacuatedCount: '32,000 citizens evacuated',
    impactSummary: 'Reservoir spillway overflow combined with high astronomical tide caused widespread residential waterlogging up to 1.8 meters.',
    lessonsLearned: [
      'Live radar-derived rainfall thresholds provide critical 45-minute head start before street level flooding begins.',
      'Crowdsourced citizen SOS GPS coordinates dramatically reduced SDRF boat dispatch delays.'
    ]
  }
];

export const HistoricalArchive: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen size={20} className="text-amber-800" />
          <span>Historical Disaster Records & Institutional Knowledge</span>
        </h2>
        <p className="text-xs text-slate-500">
          Documented Andhra Pradesh coastal cyclonic storms, post-disaster reviews, and lessons applied to SURAKSHA.
        </p>
      </div>

      <div className="space-y-5">
        {HISTORICAL_EVENTS.map((event) => (
          <div
            key={event.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block">
                  {event.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {event.name}
                </h3>
                <span className="text-xs text-slate-500">{event.location}</span>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold self-start sm:self-auto">
                {event.year}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Peak Wind Velocity:</span>
                <span className="font-extrabold text-slate-900">{event.peakWinds}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">24-Hour Precipitation:</span>
                <span className="font-extrabold text-blue-900">{event.rainfall}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Preventative Evacuations:</span>
                <span className="font-extrabold text-emerald-800">{event.evacuatedCount}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {event.impactSummary}
            </p>

            {/* Lessons applied */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Key Lessons Incorporated into System:
              </span>
              <ul className="space-y-1.5">
                {event.lessonsLearned.map((lesson, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-amber-600 font-bold">&bull;</span>
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
