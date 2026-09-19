'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  FileCheck,
  Layers,
  Database,
  AlertTriangle,
  Clock,
  Printer
} from 'lucide-react';
import { EvidencePassport } from '@/types/valuation';

interface EvidencePassportModalProps {
  passport: EvidencePassport;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidencePassportModal: React.FC<EvidencePassportModalProps> = ({
  passport,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const strength = passport.evidence_strength;
  const strengthColor =
    strength.label === 'Strong'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : strength.label === 'Moderate'
      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white">Official Evidence Passport</h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${strengthColor}`}>
                  {strength.label} ({strength.score}/100)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audited Calculation Trail & Data Provenance Manifest
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Print Passport"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm">
          {/* Section 1: Provenance & Sample Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>1. Data Provenance & Pool Volume</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Records Analyzed</span>
                <strong className="text-base text-white font-mono">{passport.total_records_analyzed}</strong>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Records Used in Final Rate</span>
                <strong className="text-base text-emerald-400 font-mono">{passport.records_used_in_valuation}</strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block">Manifest Timestamp</span>
                <span className="text-xs text-slate-300 font-mono">{new Date(passport.generated_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Sources Sampled:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
                {passport.sources_summary.map((src, i) => (
                  <li key={i}>{src}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 2: Evidence Strength Audit Reasons */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>2. Code-Governed Confidence Factors</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              {strength.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Step-by-Step Calculation Audit Trail */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>3. Step-by-Step Mathematical Audit Trail</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              {passport.calculation_steps.map((step, idx) => (
                <div key={idx} className="text-xs text-slate-300 font-mono border-b border-slate-900 pb-1.5 last:border-none">
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Documented Limitations & Disclaimers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>4. Disclosures & Known Limitations</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
              {passport.limitations.map((lim, idx) => (
                <p key={idx} className="text-xs text-amber-300/90 flex items-start space-x-2">
                  <span>•</span>
                  <span>{lim}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
