'use client';

import React from 'react';
import { Home, Calendar, MapPin, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { ScoredComparable } from '@/types/valuation';
import { formatINR, formatINRLakhCrore } from '@/lib/currency';

interface ComparablesListProps {
  comparables: ScoredComparable[];
  totalAnalyzed: number;
}

export const ComparablesList: React.FC<ComparablesListProps> = ({
  comparables,
  totalAnalyzed,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Home className="w-5 h-5 text-emerald-400" />
            <span>Comparable Properties Intelligence</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {totalAnalyzed} records analyzed in repository • Top {comparables.length} selected by multi-factor scoring
          </p>
        </div>

        <span className="text-[11px] font-medium px-2 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3" />
          <span>Demo / Synthetic Transactions</span>
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparables.map((comp) => {
          const simColor =
            comp.similarity_score >= 80
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : comp.similarity_score >= 65
              ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
              : 'text-slate-300 bg-slate-800 border-slate-700';

          return (
            <div
              key={comp.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
            >
              <div>
                {/* Header: ID + Similarity */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {comp.id}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${simColor}`}>
                    {comp.similarity_score}% Match
                  </span>
                </div>

                {/* Price & Unit Rate */}
                <div className="mb-2">
                  <span className="text-lg font-bold text-white font-mono block">
                    {formatINR(comp.price)}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    ₹{Math.round(comp.price_per_sqft).toLocaleString('en-IN')}/sq.ft
                  </span>
                </div>

                {/* Specs Badges */}
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300 mb-3">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {comp.area_sqft} sq.ft
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {comp.property_type.replace('_', ' ')}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {comp.age_years} yrs
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {comp.road_width_ft} ft road
                  </span>
                  {comp.corner_plot && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Corner
                    </span>
                  )}
                </div>

                {/* Locality & Distance */}
                <div className="text-xs text-slate-400 flex items-center space-x-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {comp.locality}, {comp.city}
                    {comp.distance_km ? ` (~${comp.distance_km} km)` : ''}
                  </span>
                </div>

                {/* Why Selected Reasons */}
                <div className="pt-2 border-t border-slate-900">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Why selected:
                  </span>
                  <ul className="space-y-1">
                    {comp.selection_reasons.slice(0, 3).map((reason, rIdx) => (
                      <li
                        key={rIdx}
                        className="text-[11px] text-slate-400 flex items-start space-x-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Source Footer */}
              <div className="mt-4 pt-2 border-t border-slate-900/80 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate max-w-[180px]">{comp.source}</span>
                <span>{comp.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
