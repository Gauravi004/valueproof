import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import type { Intent } from '../types/valuation';
import {
  Tag,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Coins,
  Compass,
} from 'lucide-react';

export const IntentSelectScreen: React.FC = () => {
  const { t, currentLanguageOption, setIsLanguageModalOpen } = useTranslation();
  const { propertyInput, updatePropertyInput, setStep } = useValuation();

  const handleSelectIntent = (intent: Intent) => {
    updatePropertyInput({ intent });
    setStep('intake');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center max-w-5xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-300 space-y-8">
      {/* Top Header Bar with Language Switcher */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep('language')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white transition-all border border-cream-300 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('intent_select.change_lang')}</span>
        </button>

        <button
          onClick={() => setIsLanguageModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-900/90 text-white hover:bg-brand-800 text-xs font-bold border border-brand-700 shadow-xs transition-all cursor-pointer"
        >
          <span>🌐 {currentLanguageOption.nativeName}</span>
          <span className="text-[10px] text-amber-300">({currentLanguageOption.name})</span>
        </button>
      </div>

      {/* Main Heading */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/90 border border-brand-300 text-brand-950 text-xs font-black uppercase tracking-wider mx-auto shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-700 animate-pulse" />
          <span>{t('intent_select.step_title')}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          {t('intent_select.heading')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium">
          {t('intent_select.subheading')}
        </p>
      </div>

      {/* Two Big Distinct Visual Action Cards: SELL vs BUY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-2">
        {/* 1. SELL MODE (With Authentic Indian House Seller Visual) */}
        <div
          onClick={() => handleSelectIntent('sell')}
          className={`group relative rounded-3xl border-2 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between bg-white hover:shadow-2xl hover:scale-[1.02] ${
            propertyInput.intent === 'sell'
              ? 'border-brand-700 shadow-xl shadow-brand-900/20 ring-4 ring-brand-600/30'
              : 'border-cream-300 hover:border-brand-600 shadow-md'
          }`}
        >
          {/* Card Hero Photo */}
          <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80"
              alt="Indian Independent House"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#072b17] via-[#072b17]/55 to-black/20" />

            {/* Top Seller Badge */}
            <div className="absolute top-3.5 left-3.5 bg-brand-950/90 backdrop-blur-md text-amber-300 border border-amber-400/50 px-3.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('intent_select.seller_tag')}</span>
            </div>

            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                {t('intent_select.seller_title')}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1 drop-shadow">
                {t('intent_select.seller_desc')}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-5 bg-gradient-to-b from-white to-cream-50/70 flex-1 flex flex-col justify-between">
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-brand-50/60 border border-brand-100">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span className="font-bold text-slate-800">{t('intent_select.seller_bullet1')}</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-brand-50/60 border border-brand-100">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span className="font-bold text-slate-800">{t('intent_select.seller_bullet2')}</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-brand-50/60 border border-brand-100">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <span className="font-bold text-slate-800">{t('intent_select.seller_bullet3')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200 flex items-center justify-between text-brand-900 font-black text-sm sm:text-base">
              <span className="group-hover:text-brand-700 transition-colors">{t('intent_select.seller_cta')}</span>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-brand-800 to-emerald-800 text-white flex items-center justify-center group-hover:translate-x-1.5 transition-transform shadow-md">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. BUY MODE (With Authentic Indian Plot / Society Buyer Visual) */}
        <div
          onClick={() => handleSelectIntent('buy')}
          className={`group relative rounded-3xl border-2 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between bg-white hover:shadow-2xl hover:scale-[1.02] ${
            propertyInput.intent === 'buy'
              ? 'border-blue-700 shadow-xl shadow-blue-900/20 ring-4 ring-blue-600/30'
              : 'border-cream-300 hover:border-blue-600 shadow-md'
          }`}
        >
          {/* Card Hero Photo */}
          <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80"
              alt="Freehold Plot Land"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b2545] via-[#0b2545]/55 to-black/20" />

            {/* Top Buyer Badge */}
            <div className="absolute top-3.5 left-3.5 bg-blue-950/90 backdrop-blur-md text-sky-300 border border-sky-400/50 px-3.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg">
              <ShoppingCart className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('intent_select.buyer_tag')}</span>
            </div>

            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                {t('intent_select.buyer_title')}
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 font-medium mt-1 drop-shadow">
                {t('intent_select.buyer_desc')}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-7 space-y-5 bg-gradient-to-b from-white to-sky-50/40 flex-1 flex flex-col justify-between">
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-sky-50/70 border border-sky-100">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span className="font-bold text-slate-800">{t('intent_select.buyer_bullet1')}</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-sky-50/70 border border-sky-100">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span className="font-bold text-slate-800">{t('intent_select.buyer_bullet2')}</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-sky-50/70 border border-sky-100">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span className="font-bold text-slate-800">{t('intent_select.buyer_bullet3')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200 flex items-center justify-between text-blue-900 font-black text-sm sm:text-base">
              <span className="group-hover:text-blue-700 transition-colors">{t('intent_select.buyer_cta')}</span>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-800 to-indigo-800 text-white flex items-center justify-center group-hover:translate-x-1.5 transition-transform shadow-md">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust & Verification Guarantee Strip */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs font-bold text-slate-600 border-t border-cream-200">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand-700" />
          <span>{t('intent_select.trust1')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-amber-600" />
          <span>{t('intent_select.trust2')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-blue-700" />
          <span>{t('intent_select.trust3')}</span>
        </div>
      </div>
    </div>
  );
};
