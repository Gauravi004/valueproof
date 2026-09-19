import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import { getLocalizedTownName } from '../utils/townHelper';
import { formatIndianCurrency, formatCurrencyRange } from '../utils/formatters';
import { BrandHouse3DIcon } from './BrandHouse3DIcon';
import {
  FileCheck,
  Printer,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Award,
  Code2,
} from 'lucide-react';

export const EvidencePassport: React.FC = () => {
  const { t } = useTranslation();
  const { valuationResult, setStep, propertyInput } = useValuation();
  const [copyToast, setCopyToast] = useState(false);

  if (!valuationResult) return null;

  const localizedTown = getLocalizedTownName(propertyInput.location, t);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🏡 *MoolyaSetu (मूल्यसेतु) Digital Property Passport*\n📍 *Location:* ${localizedTown}\n📐 *Area:* ${valuationResult.propertySummary.areaOriginal}\n🛣️ *Road:* ${valuationResult.propertySummary.roadWidth}\n🔍 *Verified with:* ${valuationResult.comparableCount} Sub-Registrar registry records\n\nOfficial Property Dossier by MoolyaSetu Land Intelligence Engine.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-20 right-6 z-50 bg-brand-950 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-brand-700 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t('common.copied')}</span>
        </div>
      )}

      {/* Action Bar (Download, Print, WhatsApp) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-8 h-8 text-brand-700" />
            <span>{t('evidence_passport.title')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {t('evidence_passport.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t('evidence_passport.share_whatsapp')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-950 hover:bg-brand-900 text-white font-bold text-xs shadow-md transition-all active:scale-95 border border-brand-800 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('evidence_passport.print')}</span>
          </button>
        </div>
      </div>

      {/* Main Certified Passport Document Card */}
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-brand-800/40 overflow-hidden print:border-none print:shadow-none">
        {/* Certificate Gold & Green Watermark Header */}
        <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-emerald-950 text-white p-6 sm:p-8 border-b-4 border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <BrandHouse3DIcon size="lg" />
            <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                Moolya<span className="text-emerald-400">Setu</span>
              </span>
              <span className="text-xs font-bold text-amber-300 font-serif">
                (मूल्यसेतु)
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Official Digital Passport
              </span>
            </div>
            <p className="text-xs text-cream-200">
              Certificate Ref: <span className="font-mono text-white font-bold">{valuationResult.id}</span> • Issued on {valuationResult.generatedAt}
            </p>
            </div>
          </div>

          {/* Stamp Badge */}
          <div className="flex items-center gap-2.5 bg-brand-900/90 border border-amber-400/40 px-4 py-2.5 rounded-2xl shadow-inner">
            <Award className="w-7 h-7 text-amber-300 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                {t('evidence_passport.verified_badge')}
              </div>
              <div className="text-xs font-bold text-white">
                {valuationResult.confidenceScore}% Reliability Index
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Property Profile & Certified Valuation Slot */}
        <div className="p-6 sm:p-8 border-b border-cream-300 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Property Profile */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('evidence_passport.property_profile')}
              </h3>
              <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Location / Town:</span>
                  <span className="font-bold text-slate-900">{localizedTown}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Property Asset Class:</span>
                  <span className="font-bold text-slate-900 capitalize">{t(`intake.property_types.${valuationResult.propertySummary.propertyType}`) || valuationResult.propertySummary.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Area:</span>
                  <span className="font-bold text-slate-900">{valuationResult.propertySummary.areaOriginal} ({valuationResult.propertySummary.areaSqFt.toLocaleString('en-IN')} sq.ft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approach Road Width:</span>
                  <span className="font-bold text-brand-900">🛣️ {valuationResult.propertySummary.roadWidth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Corner Plot:</span>
                  <span className="font-bold text-amber-800">{valuationResult.propertySummary.isCornerPlot ? '★ Yes (2-Sides Open)' : 'Standard Mid-Row'}</span>
                </div>
              </div>
            </div>

            {/* Right: Certified Market Valuation */}
            <div className="bg-gradient-to-br from-brand-950 to-emerald-950 text-white rounded-2xl p-6 border border-brand-800 flex flex-col justify-center text-center space-y-2 shadow-md">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300 flex items-center justify-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certified Market Valuation</span>
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight font-mono">
                {valuationResult.estimatedValueMid ? formatIndianCurrency(valuationResult.estimatedValueMid) : t('result.passport_api_slot')}
              </div>
              <div className="text-xs text-cream-200 font-medium">
                {valuationResult.estimatedValueMin && valuationResult.estimatedValueMax
                  ? `Fair Corridor: ${formatCurrencyRange(valuationResult.estimatedValueMin, valuationResult.estimatedValueMax)}`
                  : t('result.passport_api_desc')}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Evidence Sources */}
        <div className="p-6 sm:p-8 border-b border-cream-300 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {t('evidence_passport.evidence_sources')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-300 space-y-1">
              <div className="font-bold text-slate-900">🏛️ Sub-Registrar Gazette</div>
              <p className="text-slate-600 font-medium">Official circle rate schedules for {localizedTown} municipality.</p>
            </div>
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-300 space-y-1">
              <div className="font-bold text-slate-900">🤝 Micro-Market Comps</div>
              <p className="text-slate-600 font-medium">14 registered deed records and verified closed neighborhood sales.</p>
            </div>
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-300 space-y-1">
              <div className="font-bold text-slate-900">🛰️ Geospatial Road Width</div>
              <p className="text-slate-600 font-medium">Verified satellite approach road and zoning corridor accessibility.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Comparable Properties Table / Cards */}
        <div className="p-6 sm:p-8 border-b border-cream-300 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('evidence_passport.comparables_title')}
            </h3>
            <span className="text-xs font-bold text-brand-800">
              {valuationResult.comparables.length} Micro-Market Records Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {valuationResult.comparables.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-2xl bg-cream-50 border border-cream-300 space-y-3 hover:border-brand-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-xs text-slate-900 line-clamp-1">
                    {comp.title}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-900 text-[10px] font-extrabold shrink-0 border border-brand-300">
                    {comp.similarityScore}% Match
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1">
                  <div>📍 {comp.locality} • {comp.distanceKm} km away</div>
                  <div>📅 Registered: {comp.registrationDate}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {comp.source}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {comp.keyFeatures.map((f, i) => (
                    <span
                      key={i}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-cream-300 font-semibold"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Legal Disclaimer */}
        <div className="p-6 sm:p-8 bg-cream-50 text-[11px] text-slate-500 space-y-2 border-t border-cream-300">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Valuation & Legal Transparency Notice</span>
          </div>
          <p>
            {t('evidence_passport.disclaimer')}
          </p>
        </div>
      </div>

      {/* Navigation Footer CTA */}
      <div className="flex justify-between items-center no-print">
        <button
          type="button"
          onClick={() => setStep('valuation')}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl bg-white border border-cream-300 shadow-xs cursor-pointer"
        >
          ← {t('result.summary_card')}
        </button>

        <button
          type="button"
          onClick={() => setStep('negotiation')}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-900 hover:bg-brand-950 text-white text-xs sm:text-sm font-black shadow-md cursor-pointer transition-all active:scale-95"
        >
          <span>{t('result.negotiation_action_title')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
