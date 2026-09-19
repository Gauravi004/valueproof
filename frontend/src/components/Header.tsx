import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import { BrandHouse3DIcon } from './BrandHouse3DIcon';
import { Globe, RotateCcw, Sparkles, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentLanguageOption, setIsLanguageModalOpen, t } = useTranslation();
  const { currentStep, resetToNewIntake, valuationResult, setStep } = useValuation();

  return (
    <header className="sticky top-0 z-30 bg-[#072b17] border-b border-brand-800/80 text-white shadow-lg no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name: MoolyaSetu (मूल्यसेतु) with 3D House Icon */}
        <div
          onClick={() => setStep('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* 3D House Logo */}
          <BrandHouse3DIcon size="md" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                Moolya<span className="text-emerald-400">Setu</span>
              </span>
              <span className="text-xs font-bold text-amber-300 font-serif hidden sm:inline">
                (मूल्यसेतु)
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {t('tagline_short')}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-cream-200/90 font-medium hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Home button */}
          {currentStep !== 'home' && (
            <button
              onClick={() => setStep('home')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-brand-900/90 hover:bg-brand-800 text-cream-100 border border-brand-700 transition-colors shadow-xs cursor-pointer"
            >
              {t('nav.home')}
            </button>
          )}

          {/* New / Reset Valuation Button */}
          {currentStep !== 'home' && currentStep !== 'language' && currentStep !== 'intent' && currentStep !== 'intake' && (
            <button
              onClick={resetToNewIntake}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-brand-900/80 hover:bg-brand-800 text-cream-100 border border-brand-700 transition-colors shadow-xs cursor-pointer"
              title="Start a new property valuation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t('nav.new_check')}</span>
            </button>
          )}

          {/* Registry Comps badge */}
          {valuationResult && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900 border border-brand-600/50 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{valuationResult.comparableCount} {t('result.verified_comps')}</span>
            </div>
          )}

          {/* Language Selector Trigger in Navbar: 🌐 English ▾ */}
          <button
            type="button"
            onClick={() => setIsLanguageModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-brand-900/95 hover:bg-brand-800 border border-brand-600/80 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer ring-1 ring-white/10"
            aria-label={t('common.change_language')}
          >
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="tracking-tight">{currentLanguageOption.nativeName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          </button>
        </div>
      </div>
    </header>
  );
};
