import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import { getLocalizedTownName } from '../utils/townHelper';
import { formatIndianCurrency, formatCurrencyRange } from '../utils/formatters';
import {
  Sparkles,
  ArrowRight,
  Building,
  ShieldCheck,
  Code2,
} from 'lucide-react';

export const PriceBreakdown: React.FC = () => {
  const { t } = useTranslation();
  const { valuationResult, setStep, propertyInput } = useValuation();

  if (!valuationResult) return null;

  const localizedTown = getLocalizedTownName(propertyInput.location, t);
  const breakdown = valuationResult.price_breakdown;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t('result.evidence_drivers')}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('why_price.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          {t('why_price.subtitle')}
        </p>
      </div>

      {/* Main Breakdown Card */}
      <div className="bg-white rounded-3xl shadow-xl border-2 border-cream-300 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 bg-[#072b17] text-white flex items-center justify-between border-b border-brand-800">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-400" />
            <span className="font-black text-sm tracking-wide">
              {t('why_price.breakdown_heading')}
            </span>
          </div>
          <span className="text-xs text-amber-300 font-bold">
            📍 {localizedTown}
          </span>
        </div>

        {/* Breakdown Items List */}
        <div className="divide-y divide-cream-200 p-2 sm:p-4">
          {breakdown.map((item) => {
            const isBase = item.type === 'base';
            const isPositive = item.type === 'positive';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isBase
                    ? 'bg-cream-50/90 font-bold'
                    : isPositive
                    ? 'hover:bg-emerald-50/40'
                    : 'hover:bg-amber-50/40'
                }`}
              >
                {/* Left: Factor Name & Explanation */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-2xs ${
                        isBase
                          ? 'bg-brand-900 text-white'
                          : isPositive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isBase ? '🏛️' : isPositive ? '✓' : '−'}
                    </span>

                    <span className="text-sm sm:text-base font-black text-slate-900">
                      {t(item.labelKey) !== item.labelKey ? t(item.labelKey) : item.labelFallback}
                    </span>

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase ${
                        isPositive
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : item.type === 'negative'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-brand-100 text-brand-950 border border-brand-300'
                      }`}
                    >
                      {isBase ? 'Baseline' : isPositive ? 'Positive Multiplier' : 'Depreciation'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 pl-9 max-w-xl font-medium">
                    {item.explanation}
                  </p>
                </div>

                {/* Right: Rupee Impact & Factor Status */}
                <div className="pl-9 sm:pl-0 sm:text-right shrink-0 flex flex-col items-start sm:items-end gap-1">
                  {item.amount !== undefined && item.amount !== 0 && (
                    <span className={`text-sm font-mono font-black ${isBase ? 'text-brand-900' : isPositive ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {formatIndianCurrency(item.amount, { showPlus: isPositive && !isBase })}
                    </span>
                  )}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 border border-brand-200 text-brand-950 text-xs font-black">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                    <span>Evidence Aligned</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Total Estimated Value Footer */}
        <div className="p-6 bg-gradient-to-r from-brand-950 via-[#072b17] to-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-brand-800">
          <div className="space-y-1">
            <div className="text-xs uppercase font-black tracking-wider text-amber-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Certified Estimated Valuation</span>
            </div>
            <div className="text-xs text-cream-200/90 font-medium">
              Fair Corridor: {formatCurrencyRange(valuationResult.estimatedValueMin, valuationResult.estimatedValueMax)}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl font-black text-emerald-300 font-mono">
              {formatIndianCurrency(valuationResult.estimatedValueMid)}
            </div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">
              ● ₹{valuationResult.ratePerSqFt?.toLocaleString('en-IN')}/sq.ft
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={() => setStep('valuation')}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl bg-white border border-cream-300 shadow-xs cursor-pointer"
        >
          ← {t('result.summary_card')}
        </button>

        <button
          type="button"
          onClick={() => setStep('evidence_passport')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-900 hover:bg-brand-950 text-white text-xs sm:text-sm font-black shadow-md cursor-pointer transition-all active:scale-95"
        >
          <span>{t('result.passport_action_title')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
