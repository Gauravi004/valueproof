'use client';

import React, { useState } from 'react';
import { Scale, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { NegotiationAnalysis, ValuationRange } from '@/types/valuation';
import { formatINR } from '@/lib/currency';
import { analyzeNegotiationPosition } from '@/lib/api';

interface NegotiationLensCardProps {
  initialAnalysis?: NegotiationAnalysis | null;
  range: ValuationRange;
  locality: string;
}

export const NegotiationLensCard: React.FC<NegotiationLensCardProps> = ({
  initialAnalysis,
  range,
  locality,
}) => {
  const [askingInput, setAskingInput] = useState<string>(
    initialAnalysis?.asking_price ? initialAnalysis.asking_price.toString() : ''
  );
  const [analysis, setAnalysis] = useState<NegotiationAnalysis | null>(initialAnalysis || null);
  const [loading, setLoading] = useState(false);

  const handleRecalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(askingInput.replace(/,/g, ''));
    if (!val || val <= 0) return;

    setLoading(true);
    try {
      const res = await analyzeNegotiationPosition(val, range.mid, range.low, range.high, locality);
      setAnalysis(res);
    } catch (err) {
      console.error('Negotiation re-analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case 'above_range':
        return {
          label: 'Above Evidence Ceiling',
          color: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        };
      case 'below_range':
        return {
          label: 'Below Evidence Floor',
          color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      default:
        return {
          label: 'Supported Within Evidence Corridor',
          color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span>Negotiation Lens (Decision Support)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare any counter-offer or asking price against the empirical evidence bounds.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleRecalculate} className="mt-4 flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Enter Asking / Proposed Counter Price (INR)
          </label>
          <input
            type="number"
            value={askingInput}
            onChange={(e) => setAskingInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            placeholder="e.g. 8200000"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !askingInput}
          className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Evaluating...' : 'Evaluate Offer'}
        </button>
      </form>

      {/* Analysis Output */}
      {analysis && (
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs text-slate-400">
                Asking Price: <strong className="text-white font-mono">{formatINR(analysis.asking_price)}</strong>
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getPositionBadge(analysis.position).color}`}>
                {getPositionBadge(analysis.position).label}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {analysis.summary}
            </p>

            {/* Evidence points */}
            <div className="mt-4 pt-3 border-t border-slate-900">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Evidence-Backed Negotiation Signals:
              </span>
              <ul className="space-y-1.5">
                {analysis.evidence_points.map((point, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strict Decision Support Disclaimer */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
            <p>{analysis.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
