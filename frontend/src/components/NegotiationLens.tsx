import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import {
  Scale,
  CheckCircle2,
  ArrowRight,
  Tag,
  ShoppingCart,
  Cpu,
} from 'lucide-react';

export const NegotiationLens: React.FC = () => {
  const { t } = useTranslation();
  const { valuationResult, setStep, propertyInput } = useValuation();
  const isBuyer = propertyInput.intent === 'buy';
  const [activeStrategyTab, setActiveStrategyTab] = useState<'seller' | 'buyer'>(isBuyer ? 'buyer' : 'seller');

  useEffect(() => {
    setActiveStrategyTab(isBuyer ? 'buyer' : 'seller');
  }, [isBuyer]);

  if (!valuationResult) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black mb-3 shadow-2xs">
          <Scale className="w-3.5 h-3.5 text-amber-700" />
          <span>{isBuyer ? t('negotiation_extra.buyer_ammunition') : t('negotiation_extra.seller_defense')}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('negotiation.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
          {t('negotiation.subtitle')}
        </p>
      </div>

      {/* Main Strategy Corridor Card with Live API Slot */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cream-300 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-4">
          <div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {isBuyer ? t('negotiation.quote_price_label') : t('negotiation.asking_price_label')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
              <span className="font-mono">{propertyInput.location || 'Local Micro-Market'}</span>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
                {propertyInput.propertyType?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs">
              {t('negotiation_extra.badge_fair_deal')}
            </span>
            <span className="text-xs text-slate-600 font-bold bg-cream-100 px-3 py-1 rounded-xl border border-cream-300">
              {t('negotiation_extra.zone_fair')}
            </span>
          </div>
        </div>

        {/* Valuation Engine Live API Slot for Price Corridor */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-400/50 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-950 font-black flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-700" />
              <span>{t('result.engine_slot')}</span>
            </span>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
              {t('result.engine_ready')}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 text-center space-y-1.5 shadow-sm">
            <span className="text-[10px] text-amber-900 uppercase font-mono tracking-wider block font-bold">
              POST /api/valuation/negotiation-corridor
            </span>
            <div className="text-xl sm:text-2xl font-black text-brand-900 font-mono tracking-tight">
              [ Fair Market Corridor via API ]
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {t('result.engine_desc')}
            </p>
          </div>
        </div>

        {/* Strategic Corridor Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
            <div className="text-[11px] font-black text-blue-900 uppercase tracking-wider">
              {t('negotiation_extra.zone_discount')}
            </div>
            <div className="text-xs text-slate-700 font-medium leading-snug">
              {t('negotiation_extra.desc_discount_buyer')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-1">
            <div className="text-[11px] font-black text-emerald-900 uppercase tracking-wider">
              {t('negotiation_extra.zone_fair')}
            </div>
            <div className="text-xs text-slate-700 font-medium leading-snug">
              {t('negotiation_extra.desc_fair')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
            <div className="text-[11px] font-black text-rose-900 uppercase tracking-wider">
              {t('negotiation_extra.zone_high_resistance')}
            </div>
            <div className="text-xs text-slate-700 font-medium leading-snug">
              {t('negotiation_extra.desc_high_res_seller')}
            </div>
          </div>
        </div>
      </div>

      {/* Role Strategy Tabs (Seller Battlecard vs Buyer Battlecard) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cream-300 shadow-xl space-y-6">
        <div className="flex items-center gap-2 p-1.5 bg-cream-100 rounded-2xl border border-cream-300 w-fit">
          <button
            type="button"
            onClick={() => setActiveStrategyTab('seller')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeStrategyTab === 'seller'
                ? 'bg-brand-950 text-amber-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{t('intent_select.seller_tag')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStrategyTab('buyer')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeStrategyTab === 'buyer'
                ? 'bg-blue-950 text-sky-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{t('intent_select.buyer_tag')}</span>
          </button>
        </div>

        {/* Tab Content: Strategic Talking Points */}
        <div className="space-y-3">
          {activeStrategyTab === 'seller' ? (
            <>
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t('intent_select.seller_bullet1')}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Anchor your price with 100% verified sub-registrar transactions and gazette circle rate evidence.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t('intent_select.seller_bullet2')}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Highlight the {propertyInput.roadWidth} approach road and corner plot advantages during buyer walkthroughs.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t('intent_select.buyer_bullet1')}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Counter-offer with registered circle rate benchmarks and verifiable nearby neighborhood transactions.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t('intent_select.buyer_bullet2')}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Use recent registered comps within 1.5 km to prevent broker inflated quotation markups.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={() => setStep('valuation')}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl bg-white border border-cream-300 shadow-xs cursor-pointer"
        >
          ← {t('result.summary_card')}
        </button>

        <button
          type="button"
          onClick={() => setStep('renovation')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-900 hover:bg-brand-950 text-white text-xs sm:text-sm font-black shadow-md cursor-pointer transition-all active:scale-95"
        >
          <span>{t('result.renovation_action_title')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
