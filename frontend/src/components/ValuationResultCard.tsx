import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import { getLocalizedTownName } from '../utils/townHelper';
import { formatIndianCurrency, formatCurrencyRange } from '../utils/formatters';
import { InteractiveTownMap } from './InteractiveTownMap';
import {
  ShieldCheck,
  FileCheck,
  Scale,
  Wrench,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  Code2,
} from 'lucide-react';

export const ValuationResultCard: React.FC = () => {
  const { t } = useTranslation();
  const { valuationResult, setStep, propertyInput } = useValuation();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  if (!valuationResult) return null;

  const localizedLocation = getLocalizedTownName(propertyInput.location, t);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* ================= 1. DIGITAL PROPERTY PASSPORT HERO CARD ================= */}
      <div className="relative bg-gradient-to-br from-[#072b17] via-[#0d3f24] to-[#14532d] rounded-3xl p-6 sm:p-10 text-white shadow-2xl overflow-hidden border-2 border-brand-600/80">
        {/* Subtle Watermark & Ambience Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Passport Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-700/60 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                {t('result.passport_badge')}
              </div>
              <div className="text-xs text-cream-200">
                {t('result.dossier_id')}: <span className="font-mono text-white font-bold">{valuationResult.id}</span> • {valuationResult.generatedAt}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('result.registry_linked')}</span>
          </div>
        </div>

        {/* Main Passport Content: Property Overview & Valuation API Slot */}
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{t('result.summary_card')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {localizedLocation}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                {t('result.verified_attribs')}: {propertyInput.area} {propertyInput.areaUnit.toUpperCase()} ({valuationResult.propertySummary.areaSqFt.toLocaleString('en-IN')} sq.ft) on {propertyInput.roadWidth} road.
              </p>
            </div>

            {/* Structured Valuation Price Response Slot (Backend API Connected) */}
            <div className="bg-black/45 backdrop-blur-md rounded-2xl p-5 sm:p-6 border-2 border-emerald-400/40 text-center sm:text-right shrink-0 space-y-2 shadow-2xl max-w-sm">
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center justify-center sm:justify-end gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certified Market Valuation</span>
              </div>
              
              <div className={`transition-all duration-700 ${revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="text-xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight">
                  {valuationResult.estimatedValueMid ? formatIndianCurrency(valuationResult.estimatedValueMid) : t('result.engine_ready')}
                </div>
                <div className="text-xs text-cream-200/90 font-medium mt-1">
                  {valuationResult.estimatedValueMin && valuationResult.estimatedValueMax
                    ? `Corridor: ${formatCurrencyRange(valuationResult.estimatedValueMin, valuationResult.estimatedValueMax)} (₹${valuationResult.ratePerSqFt?.toLocaleString('en-IN')}/sq.ft)`
                    : t('result.engine_desc')}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-center sm:justify-end gap-2 text-[10px] text-amber-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Deterministic Engine Verified</span>
              </div>
            </div>
          </div>

          {/* Property Verified Specifications Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">{t('result.asset_type')}</span>
              <span className="text-sm font-black text-white capitalize">{t(`intake.property_types.${valuationResult.propertySummary.propertyType}`) || valuationResult.propertySummary.propertyType}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">{t('result.land_parcel')}</span>
              <span className="text-sm font-black text-white">{valuationResult.propertySummary.areaOriginal}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">{t('result.approach_road')}</span>
              <span className="text-sm font-black text-amber-300">{valuationResult.propertySummary.roadWidth}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">{t('result.orientation')}</span>
              <span className="text-sm font-black text-emerald-300">
                {valuationResult.propertySummary.isCornerPlot ? t('result.corner_applied') : t('result.standard_plot')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. INTERACTIVE MICRO-LOCATION NEIGHBORHOOD MAP ================= */}
      <InteractiveTownMap valuation={valuationResult} />

      {/* ================= 3. WHY THIS PRICE? VALUATION FACTORS FRAMEWORK ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cream-300 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-brand-900 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-700" />
              <span>{t('result.evidence_drivers')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t('why_price.heading')}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {t('why_price.subtitle')}
            </p>
          </div>
        </div>

        {/* Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Factor 1: Circle Rate Baseline */}
          <div className="p-4.5 rounded-2xl bg-cream-50/80 border-2 border-cream-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-950 font-black flex items-center justify-center text-xs">
                  1
                </span>
                <span className="font-bold text-slate-900 text-sm">{t('why_price.factor1_title')}</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-brand-200 text-brand-950 border border-brand-300">
                {t('why_price.factor1_badge')}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {t('why_price.factor1_desc')}
            </p>
          </div>

          {/* Factor 2: Approach Road Width */}
          <div className="p-4.5 rounded-2xl bg-cream-50/80 border-2 border-cream-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-950 font-black flex items-center justify-center text-xs">
                  2
                </span>
                <span className="font-bold text-slate-900 text-sm">{t('why_price.factor2_title')} ({propertyInput.roadWidth})</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-950 border border-amber-300">
                {t('why_price.factor2_badge')}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {t('why_price.factor2_desc')}
            </p>
          </div>

          {/* Factor 3: Corner Plot Advantage */}
          <div className="p-4.5 rounded-2xl bg-cream-50/80 border-2 border-cream-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-950 font-black flex items-center justify-center text-xs">
                  3
                </span>
                <span className="font-bold text-slate-900 text-sm">{t('why_price.factor3_title')}</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-emerald-200 text-emerald-950 border border-emerald-300">
                {propertyInput.isCornerPlot ? `${t('why_price.factor3_badge')} (+8%)` : t('result.standard_plot')}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {t('why_price.factor3_desc')}
            </p>
          </div>

          {/* Factor 4: Civic Proximity */}
          <div className="p-4.5 rounded-2xl bg-cream-50/80 border-2 border-cream-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-950 font-black flex items-center justify-center text-xs">
                  4
                </span>
                <span className="font-bold text-slate-900 text-sm">{t('why_price.factor4_title')}</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-blue-200 text-blue-950 border border-blue-300">
                {t('why_price.factor4_badge')}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {t('why_price.factor4_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* ================= 4. NEARBY COMPARABLE PROPERTIES CARDS ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cream-300 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-brand-900 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('result.evidence_strength')}: {t('result.strong_evidence')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t('result.similar_properties')}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {t('result.similar_subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {valuationResult.comparables.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl border-2 border-cream-300 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Realistic Property Card Image */}
              <div className="h-40 w-full relative overflow-hidden bg-slate-200">
                <img
                  src={comp.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop&q=80'}
                  alt={comp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2.5 left-2.5 bg-brand-950/90 text-amber-300 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  📍 {comp.distanceKm} {t('result.km_away')}
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <div className="text-xs font-black line-clamp-1">{comp.title}</div>
                  <div className="text-[10px] text-cream-200 flex items-center justify-between mt-0.5 font-medium">
                    <span>{comp.locality}</span>
                    <span className="font-mono text-amber-300 font-bold">{comp.registrationDate}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 space-y-2 bg-cream-50/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{comp.areaSqFt.toLocaleString('en-IN')} sq.ft • {comp.propertyType}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-100 text-brand-900 border border-brand-200">
                    {t('result.deed_verified')}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {comp.source}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 5. QUICK NAVIGATION ACTION TILES ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          type="button"
          onClick={() => setStep('evidence_passport')}
          className="p-5 rounded-2xl bg-white hover:bg-brand-50/50 border-2 border-cream-300 hover:border-brand-600 text-left transition-all shadow-md hover:shadow-lg flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-900 flex items-center justify-center shadow-xs">
              <FileCheck className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-800 group-hover:translate-x-1.5 transition-all" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">{t('result.passport_action_title')}</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">{t('result.passport_action_desc')}</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStep('negotiation')}
          className="p-5 rounded-2xl bg-white hover:bg-amber-50/50 border-2 border-cream-300 hover:border-amber-600 text-left transition-all shadow-md hover:shadow-lg flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800 group-hover:translate-x-1.5 transition-all" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">{t('result.negotiation_action_title')}</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">{t('result.negotiation_action_desc')}</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStep('renovation')}
          className="p-5 rounded-2xl bg-white hover:bg-emerald-50/50 border-2 border-cream-300 hover:border-emerald-600 text-left transition-all shadow-md hover:shadow-lg flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 group-hover:translate-x-1.5 transition-all" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">{t('result.renovation_action_title')}</h4>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">{t('result.renovation_action_desc')}</p>
          </div>
        </button>
      </div>

      {/* Start Over Button */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => setStep('intake')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl bg-white hover:bg-cream-200 transition-all border border-cream-300 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('result.recalculate_btn')}</span>
        </button>
      </div>
    </div>
  );
};
