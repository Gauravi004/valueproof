'use client';

import React from 'react';
import {
  Compass,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Train,
  Wind,
  ShieldAlert,
  CheckCircle,
  Building,
  Info
} from 'lucide-react';
import { LocationIntelligence, LocationSignal } from '@/types/valuation';

interface LocationIntelligenceGridProps {
  intelligence: LocationIntelligence;
}

export const LocationIntelligenceGrid: React.FC<LocationIntelligenceGridProps> = ({
  intelligence,
}) => {
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'schools':
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      case 'healthcare':
        return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'markets':
      case 'retail':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'transport':
        return <Train className="w-4 h-4 text-emerald-400" />;
      case 'pollution':
        return <Wind className="w-4 h-4 text-teal-400" />;
      default:
        return <Building className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>Location Intelligence & Livability Signals</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Locality: {intelligence.locality}, {intelligence.city} • Provider: {intelligence.provider}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Livability Index: {intelligence.overall_liveability_score}/100
          </span>
        </div>
      </div>

      {/* Principle Note: Direct vs Contextual Demarcation */}
      <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Methodology Note:</strong> Location signals provide buyer sentiment and livability context. ValueProof does <em>not</em> invent arbitrary flat rupee premiums for nearby amenities, maintaining strict valuation integrity.
        </p>
      </div>

      {/* Contextual Summary */}
      <p className="mt-3 text-xs text-slate-300 leading-relaxed italic">
        &ldquo;{intelligence.contextual_summary}&rdquo;
      </p>

      {/* Signals Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {intelligence.signals.map((signal, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800">
                    {getIcon(signal.category)}
                  </div>
                  <span className="text-xs font-bold text-white">{signal.title}</span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    signal.rating === 'Strong' || signal.rating === 'High'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : signal.rating === 'Moderate'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {signal.rating}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">{signal.detail}</p>
            </div>

            {signal.distance_km && (
              <div className="mt-3 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500">
                <span>Distance from locus</span>
                <span className="font-mono text-slate-300">{signal.distance_km} km</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
