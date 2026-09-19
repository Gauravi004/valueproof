'use client';

import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white">ValueProof</span>
              <p className="text-xs text-slate-400">
                Evidence before price. India-first property valuation & decision-support intelligence.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              FastAPI + Pydantic V2
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              Next.js 15 + TypeScript
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              Google Gemini 2.5
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
              n8n Orchestration
            </span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          <p>
            © 2026 ValueProof. Built as a demonstration of transparent, evidence-first property intelligence. Benchmark transaction datasets are synthetic for illustrative purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};
