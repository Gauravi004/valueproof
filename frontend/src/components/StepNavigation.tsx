import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import type { AppStep } from '../types/valuation';
import {
  BadgePercent,
  FileCheck,
  Scale,
  Wrench,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface StepItem {
  id: AppStep;
  labelKey: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
}

const STEPS: StepItem[] = [
  { id: 'valuation', labelKey: 'nav.valuation', icon: TrendingUp },
  { id: 'why_price', labelKey: 'nav.why_price', icon: BadgePercent },
  { id: 'evidence_passport', labelKey: 'nav.evidence_passport', icon: FileCheck, badge: 'Verified' },
  { id: 'negotiation', labelKey: 'nav.negotiation', icon: Scale },
  { id: 'renovation', labelKey: 'nav.renovation', icon: Wrench },
];

export const StepNavigation: React.FC = () => {
  const { t } = useTranslation();
  const { currentStep, setStep, valuationResult } = useValuation();

  if (!valuationResult || currentStep === 'intake' || currentStep === 'analysis') {
    return null;
  }

  return (
    <>
      {/* Desktop Stepper Bar */}
      <div className="hidden lg:block bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs no-print">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center justify-between py-2.5 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 min-w-max">
              {STEPS.map((step, index) => {
                const isActive = currentStep === step.id;
                const Icon = step.icon;

                return (
                  <React.Fragment key={step.id}>
                    {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 shrink-0" />}
                    <button
                      onClick={() => setStep(step.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-brand-400' : 'text-slate-500'
                        }`}
                      />
                      <span>{t(step.labelKey)}</span>
                      {step.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                            isActive
                              ? 'bg-brand-500 text-slate-950'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {step.badge}
                        </span>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-2 px-2 no-print safe-area-bottom">
        <div className="flex items-center justify-around">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-brand-700 font-bold scale-105'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-brand-100 text-brand-700' : 'bg-transparent text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] leading-tight text-center max-w-[64px] truncate">
                  {t(step.labelKey).split(' ')[0]}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 absolute -bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
