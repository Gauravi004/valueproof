'use client';

import React from 'react';
import { Target, Info } from 'lucide-react';
import { ValuationRange } from '@/types/valuation';
import { formatINR, formatINRLakhCrore } from '@/lib/currency';

interface RangeIndicatorProps {
  range: ValuationRange;
}

export const RangeIndicator: React.FC<RangeIndicatorProps> = ({ range }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Evidence Valuation Corridor
          </h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
          ±{range.spread_percentage}% Empirical Spread
        </span>
      </div>

      {/* Visual Corridor Bar */}
      <div className="relative pt-6 pb-4">
        {/* Horizontal Track */}
        <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-slate-700 via-emerald-500 to-indigo-500 opacity-60 rounded-full" />
        </div>

        {/* 3 Anchors (Low, Mid, High) */}
        <div className="flex justify-between items-start mt-3">
          {/* Low */}
          <div className="text-left">
            <span className="text-[11px] font-medium text-slate-400 block uppercase">
              Conservative Floor
            </span>
            <span className="text-sm font-bold text-slate-200 font-mono">
              {formatINR(range.low)}
            </span>
            <span className="text-xs text-slate-400 block">
              ({formatINRLakhCrore(range.low)})
            </span>
          </div>

          {/* Mid */}
          <div className="text-center -mt-8">
            <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-xs font-extrabold shadow-md mb-1">
              Midpoint
            </div>
            <div className="w-2.5 h-2.5 bg-emerald-400 rotate-45 mx-auto -mb-1 shadow" />
            <span className="text-sm font-extrabold text-emerald-400 font-mono block mt-1.5">
              {formatINR(range.mid)}
            </span>
            <span className="text-xs text-slate-300 block">
              ({formatINRLakhCrore(range.mid)})
            </span>
          </div>

          {/* High */}
          <div className="text-right">
            <span className="text-[11px] font-medium text-slate-400 block uppercase">
              Optimistic Ceiling
            </span>
            <span className="text-sm font-bold text-slate-200 font-mono">
              {formatINR(range.high)}
            </span>
            <span className="text-xs text-slate-400 block">
              ({formatINRLakhCrore(range.high)})
            </span>
          </div>
        </div>
      </div>

      {/* Rationale explanation */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start space-x-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p>{range.spread_rationale}</p>
      </div>
    </div>
  );
};
