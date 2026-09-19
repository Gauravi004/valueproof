'use client';

import React from 'react';
import { ShieldCheck, FileCheck, ArrowUpRight, CheckCircle } from 'lucide-react';
import { ValuationResult } from '@/types/valuation';
import { formatINR, formatINRLakhCrore } from '@/lib/currency';

interface ValueHeroProps {
  result: ValuationResult;
  onOpenPassport: () => void;
}

export const ValueHero: React.FC<ValueHeroProps> = ({ result, onOpenPassport }) => {
  const strength = result.evidence_passport.evidence_strength;
  const strengthColor =
    strength.label === 'Strong'
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : strength.label === 'Moderate'
      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
      : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
              Deterministic Valuation
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center space-x-1 ${strengthColor}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                Evidence Strength: {strength.label} ({strength.score}/100)
              </span>
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {result.property_input.location.locality}, {result.property_input.location.city}
            </span>
          </div>

          {/* Primary Valuation Figure */}
          <div className="flex items-baseline space-x-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-mono">
              {formatINR(result.estimated_value)}
            </h1>
            <span className="text-xl sm:text-2xl font-bold text-emerald-400">
              ({formatINRLakhCrore(result.estimated_value)})
            </span>
          </div>

          {/* Unit Rate & Spec Subtitle */}
          <p className="mt-2 text-sm text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Benchmark Rate:{' '}
              <strong className="text-slate-200">
                ₹{Math.round(result.representative_price_per_sqft).toLocaleString('en-IN')}/sq.ft
              </strong>
            </span>
            <span>•</span>
            <span>
              Footprint:{' '}
              <strong className="text-slate-200">{result.property_input.area_sqft} sq.ft</strong>
            </span>
            <span>•</span>
            <span>
              Vintage:{' '}
              <strong className="text-slate-200">{result.property_input.age_years} yrs</strong>
            </span>
            <span>•</span>
            <span>
              Road:{' '}
              <strong className="text-slate-200">{result.property_input.road_width_ft} ft</strong>
            </span>
          </p>
        </div>

        {/* Passport Trigger Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3">
          <button
            onClick={onOpenPassport}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold flex items-center space-x-2 transition-all shadow-md group"
          >
            <FileCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Inspect Evidence Passport</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <span className="text-[11px] text-slate-500">
            {result.evidence_passport.records_used_in_valuation} comparables analyzed & audit-logged
          </span>
        </div>
      </div>
    </div>
  );
};
