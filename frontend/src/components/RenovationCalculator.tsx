import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import type { RenovationType } from '../types/valuation';
import { formatIndianCurrency } from '../utils/formatters';
import {
  Wrench,
  CheckCircle2,
  Hammer,
  Paintbrush,
  Maximize,
  Home,
  RotateCcw,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Building2,
} from 'lucide-react';

const RENOVATION_TYPE_IDS: { id: RenovationType; icon: any; multiplier: string }[] = [
  { id: 'kitchen_bath', icon: Hammer, multiplier: '1.75x' },
  { id: 'paint_flooring', icon: Paintbrush, multiplier: '1.55x' },
  { id: 'extra_room', icon: Maximize, multiplier: '2.10x' },
  { id: 'facade', icon: Home, multiplier: '1.65x' },
  { id: 'full_makeover', icon: Layers, multiplier: '1.85x' },
];

export const RenovationCalculator: React.FC = () => {
  const { t } = useTranslation();
  const {
    renovationState,
    renovationResult,
    calculateRenovationROI,
    resetToNewIntake,
    propertyInput,
    setStep,
  } = useValuation();

  const [upgradeTier, setUpgradeTier] = useState<'standard' | 'premium' | 'luxury'>('premium');

  const handleTypeChange = (type: RenovationType) => {
    calculateRenovationROI({ renovationType: type });
  };

  const selectedPkg = RENOVATION_TYPE_IDS.find((item) => item.id === renovationState.renovationType) || RENOVATION_TYPE_IDS[0];
  const typeTitle = t(`renovation_extra.types.${selectedPkg.id}`);
  const typeDesc = t(`renovation_extra.desc.${selectedPkg.id}`);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-950 text-xs font-black mb-3 shadow-2xs">
          <Wrench className="w-3.5 h-3.5 text-purple-700" />
          <span>{t('renovation_extra.simulator_badge')}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('renovation.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          {t('renovation.subtitle')}
        </p>
      </div>

      {/* Main Renovation ROI Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Renovation Type Selector & Quality Tier */}
        <div className="lg:col-span-2 space-y-6">
          {/* Renovation Upgrade Types */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-cream-300 shadow-xl space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-cream-200 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{t('renovation.select_upgrade')}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-cream-100 px-2 py-0.5 rounded-lg border border-cream-200">
                Small-Town ROI Multipliers
              </span>
            </h3>

            <div className="space-y-3">
              {RENOVATION_TYPE_IDS.map((item) => {
                const isSelected = renovationState.renovationType === item.id;
                const Icon = item.icon;
                const title = t(`renovation_extra.types.${item.id}`);
                const desc = t(`renovation_extra.desc.${item.id}`);
                const hint = t(`renovation_extra.roi_hints.${item.id}`);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 shadow-md ring-2 ring-purple-500/20'
                        : 'border-cream-300 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-purple-600 text-white shadow-md' : 'bg-cream-100 text-slate-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <span>{title}</span>
                          <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md border border-purple-200">
                            {item.multiplier} Value Impact
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{desc}</p>
                        <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-1 border border-purple-200/60">
                          {hint}
                        </span>
                      </div>
                    </div>

                    {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upgrade Scope & Finish Quality Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-cream-300 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-cream-200 pb-3">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-700" />
                <span>{t('renovation.budget_label')} & Quality Grade</span>
              </span>
              <span className="text-xs font-black text-purple-900 bg-purple-100 px-3 py-1 rounded-xl border border-purple-200 uppercase tracking-wider">
                {upgradeTier} Grade Scope
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUpgradeTier('standard')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  upgradeTier === 'standard'
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-black shadow-sm ring-2 ring-purple-400/30'
                    : 'border-cream-300 bg-cream-50/50 text-slate-700 hover:border-purple-200'
                }`}
              >
                <div className="text-xs font-black">Standard Refresh</div>
                <p className="text-[10px] text-slate-500 mt-1">Essential sanitary + basic painting</p>
                <div className="mt-2 text-[10px] font-bold text-purple-700">1.35x Multiplier</div>
              </button>

              <button
                type="button"
                onClick={() => setUpgradeTier('premium')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  upgradeTier === 'premium'
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-black shadow-sm ring-2 ring-purple-400/30'
                    : 'border-cream-300 bg-cream-50/50 text-slate-700 hover:border-purple-200'
                }`}
              >
                <div className="text-xs font-black">Premium Upgrade</div>
                <p className="text-[10px] text-slate-500 mt-1">Vitrified tiles + modular fittings</p>
                <div className="mt-2 text-[10px] font-bold text-purple-700">1.75x Multiplier</div>
              </button>

              <button
                type="button"
                onClick={() => setUpgradeTier('luxury')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  upgradeTier === 'luxury'
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-black shadow-sm ring-2 ring-purple-400/30'
                    : 'border-cream-300 bg-cream-50/50 text-slate-700 hover:border-purple-200'
                }`}
              >
                <div className="text-xs font-black">Ultra Luxury</div>
                <p className="text-[10px] text-slate-500 mt-1">Italian marble + turnkey facade</p>
                <div className="mt-2 text-[10px] font-bold text-purple-700">2.10x Multiplier</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: ROI Projected Summary Card & Live API Slot */}
        <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white border-2 border-purple-800 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-400/30">
                {t('renovation.projected_roi')}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Micro-Market Model</span>
              </span>
            </div>

            {/* Selected Package Header */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-purple-300 uppercase font-bold tracking-wider">Active Upgrade Package</span>
              <h4 className="text-base font-black text-white">{typeTitle}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{typeDesc}</p>
            </div>

            {/* Valuation Engine Live Calculation Card */}
            <div className="p-4 rounded-2xl bg-purple-900/40 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-200 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>Projected Value Uplift</span>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
                  +{renovationResult?.roiPercentage || 65}% Est. ROI
                </span>
              </div>

              <div className="bg-black/50 p-3 rounded-xl border border-white/10 text-center space-y-1">
                <span className="text-[10px] text-purple-300 uppercase font-mono tracking-wider block">
                  Value Addition
                </span>
                <div className="text-lg sm:text-xl font-black text-amber-300 font-mono tracking-tight">
                  +{formatIndianCurrency(renovationResult?.potentialValueChange || Math.round(renovationState.renovationCost * 1.75))}
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Post-Renovation: {formatIndianCurrency(renovationResult?.potentialPostRenovationValue || (renovationState.currentValue + Math.round(renovationState.renovationCost * 1.75)))}
                </p>
              </div>
            </div>

            {/* Factor Breakdown Summary */}
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex justify-between items-center text-purple-200 py-1.5 border-b border-purple-800/60">
                <span>Property Locality</span>
                <span className="font-bold text-white">{propertyInput.location || 'Local Micro-Market'}</span>
              </div>
              <div className="flex justify-between items-center text-purple-200 py-1.5 border-b border-purple-800/60">
                <span>Value Multiplier Index</span>
                <span className="font-mono font-bold text-amber-300">{selectedPkg.multiplier} Value Return</span>
              </div>
              <div className="flex justify-between items-center text-emerald-300 font-bold bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>ROI Expectation</span>
                </span>
                <span className="text-xs font-black text-emerald-300">High Demand Boost</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-purple-800/80">
            <button
              type="button"
              onClick={() => setStep('valuation')}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>← Back to Valuation Result</span>
            </button>

            <button
              type="button"
              onClick={resetToNewIntake}
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
              <span>{t('nav.new_check')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
