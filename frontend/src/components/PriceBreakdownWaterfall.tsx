'use client';

import React from 'react';
import { Plus, Minus, Equal, Layers, ArrowRight } from 'lucide-react';
import { ValuationAdjustment } from '@/types/valuation';
import { formatINR } from '@/lib/currency';

interface PriceBreakdownProps {
  baseValue: number;
  repPriceSqft: number;
  areaSqft: number;
  breakdown: ValuationAdjustment[];
  estimatedValue: number;
}

export const PriceBreakdownWaterfall: React.FC<PriceBreakdownProps> = ({
  baseValue,
  repPriceSqft,
  areaSqft,
  breakdown,
  estimatedValue,
}) => {
  const positiveAdjustments = breakdown.filter((a) => a.is_positive);
  const negativeAdjustments = breakdown.filter((a) => !a.is_positive);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Why This Price? (Mathematical Breakdown)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict formula: Base Comparable Rate × Area ± Documented Property Adjustments = Estimated Value.
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] font-semibold text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">BASE</span>
          <span>+</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">POSITIVE</span>
          <span>-</span>
          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">NEGATIVE</span>
          <span>=</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-white border border-slate-700">ESTIMATE</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {/* Step 1: Base Value */}
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-950 border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold">
              1
            </div>
            <div>
              <span className="text-sm font-semibold text-white">
                Base Comparable Value
              </span>
              <p className="text-xs text-slate-400">
                ₹{Math.round(repPriceSqft).toLocaleString('en-IN')}/sq.ft benchmark rate × {areaSqft} sq.ft
              </p>
            </div>
          </div>
          <span className="text-base font-bold text-white font-mono">
            {formatINR(baseValue)}
          </span>
        </div>

        {/* Step 2: Positive Adjustments */}
        {positiveAdjustments.map((adj, idx) => (
          <div
            key={`pos-${idx}`}
            className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40"
          >
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-emerald-400 text-xs font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-300">
                  {adj.category}
                </span>
                <p className="text-[11px] text-slate-400">{adj.description}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              +{formatINR(adj.amount_inr)}
            </span>
          </div>
        ))}

        {/* Step 3: Negative Adjustments */}
        {negativeAdjustments.map((adj, idx) => (
          <div
            key={`neg-${idx}`}
            className="flex items-center justify-between p-3 rounded-lg bg-rose-950/20 border border-rose-900/40"
          >
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded bg-rose-900/40 border border-rose-700/50 flex items-center justify-center text-rose-400 text-xs font-bold">
                <Minus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-rose-300">
                  {adj.category}
                </span>
                <p className="text-[11px] text-slate-400">{adj.description}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-rose-400 font-mono">
              {formatINR(adj.amount_inr)}
            </span>
          </div>
        ))}

        {/* Final Reconciliation Row */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/40 mt-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Equal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-extrabold uppercase tracking-wide text-white">
                Reconciled Estimated Property Value
              </span>
              <p className="text-xs text-emerald-400 font-medium">
                Deterministically validated through audited evidence
              </p>
            </div>
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-white font-mono">
            {formatINR(estimatedValue)}
          </span>
        </div>
      </div>
    </div>
  );
};
