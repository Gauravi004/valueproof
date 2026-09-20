import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import { getLocalizedTownName } from '../utils/townHelper';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Loader2,
  Circle,
  Radar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface AnalysisStepItem {
  id: string;
  labelKey: string;
  fallbackText: string;
}

const ANALYSIS_STEPS: AnalysisStepItem[] = [
  { id: 'details', labelKey: 'analysis.steps.details', fallbackText: 'Property details' },
  { id: 'location', labelKey: 'analysis.steps.location', fallbackText: 'Location' },
  { id: 'facilities', labelKey: 'analysis.steps.facilities', fallbackText: 'Nearby facilities' },
  { id: 'comparables', labelKey: 'analysis.steps.comparables', fallbackText: 'Comparable properties' },
  { id: 'locality', labelKey: 'analysis.steps.locality', fallbackText: 'Locality factors' },
  { id: 'calculating', labelKey: 'analysis.steps.calculating', fallbackText: 'Calculating valuation' },
  { id: 'explanation', labelKey: 'analysis.steps.explanation', fallbackText: 'Preparing explanation' },
];

export const AnalysisLoadingScreen: React.FC = () => {
  const { t } = useTranslation();
  const { setStep, valuationResult, propertyInput } = useValuation();
  const [currentProgressIndex, setCurrentProgressIndex] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);

  const localizedTown = getLocalizedTownName(propertyInput.location, t);

  const insights = [
    t('analysis_extra.insight1', { location: localizedTown }) || `Checking sub-registrar circle rate registry for ${localizedTown}...`,
    t('analysis_extra.insight2', { roadWidth: propertyInput.roadWidth }) || `Analyzing road width multiplier (${propertyInput.roadWidth}) & corner plot premium...`,
    t('analysis_extra.insight3') || `Scanning 14 recent comparable transactions within 1.5 km radius...`,
    t('analysis_extra.insight4') || `Calculating CPWD structural depreciation index for small-town localities...`,
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentProgressIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    const insightInterval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % insights.length);
    }, 1200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(insightInterval);
    };
  }, [insights.length]);

  useEffect(() => {
    if (currentProgressIndex >= ANALYSIS_STEPS.length && valuationResult) {
      const finishTimeout = setTimeout(() => {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#22c55e', '#16a34a', '#f59e0b', '#0f172a'],
          });
        } catch (e) {}

        setStep('valuation');
      }, 500);

      return () => clearTimeout(finishTimeout);
    }
  }, [currentProgressIndex, valuationResult, setStep]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border-2 border-cream-300 p-6 sm:p-8 space-y-6">
        {/* Top Radar Animation */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative w-22 h-22 rounded-3xl bg-slate-950 flex items-center justify-center shadow-xl shadow-brand-900/20 mb-4 overflow-hidden border border-brand-700">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/30 via-transparent to-transparent animate-pulse" />
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan" />
            <Radar className="w-10 h-10 text-emerald-400 animate-spin-slow" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-100 text-brand-950 text-[10px] font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
            <span>MoolyaSetu Engine v2.4</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('analysis.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs font-medium">
            {t('analysis.subtitle')}
          </p>
        </div>

        {/* 7-Step Progressive Checklist */}
        <div className="space-y-2 bg-cream-50/70 p-4 rounded-2xl border border-cream-200">
          {ANALYSIS_STEPS.map((step, index) => {
            const isCompleted = index < currentProgressIndex;
            const isCurrent = index === currentProgressIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isCurrent
                    ? 'bg-white shadow-xs border border-brand-200 text-brand-950 font-bold scale-[1.01]'
                    : isCompleted
                    ? 'text-slate-800'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span>{t(step.labelKey) !== step.labelKey ? t(step.labelKey) : step.fallbackText}</span>
                </div>

                {isCompleted && (
                  <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Sub-Registrar Data Scan Feed */}
        <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-brand-800 text-xs flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <div className="font-mono text-[11px] text-cream-200 truncate">
            {insights[insightIndex]}
          </div>
        </div>
      </div>
    </div>
  );
};
