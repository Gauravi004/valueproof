import React, { useState } from 'react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import type { SupportedLanguage } from '../types/valuation';
import { BrandHouse3DIcon } from './BrandHouse3DIcon';
import { ArrowRight, Check, Volume2, VolumeX, ShieldCheck, CheckCircle2 } from 'lucide-react';

const LANGUAGE_IMAGES: Record<string, string> = {
  hi: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=85',
  en: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=600&auto=format&fit=crop&q=85',
  pa: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=85',
  mr: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=85',
  bn: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=85',
  gu: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=85',
  ta: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=85',
  te: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&auto=format&fit=crop&q=85',
};

export const LanguageSelectScreen: React.FC = () => {
  const { language, setLanguage, t, currentLanguageOption } = useTranslation();
  const { setStep } = useValuation();
  const [isMuted, setIsMuted] = useState(true);

  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
  };

  const handleContinue = () => {
    setStep('intent');
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#041a0e] text-white selection:bg-brand-700 selection:text-white">
      {/* ================= BACKGROUND HD DRONE VIDEO ================= */}
      <video
        autoPlay
        loop
        muted={isMuted}
        playsInline
        poster="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&auto=format&fit=crop&q=85"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.52] contrast-[1.14]"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-small-town-surrounded-by-nature-41556-large.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Royal Dark Forest Green, Saffron & Mitti Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#072b17]/92 via-[#072b17]/65 to-[#072b17]/95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(7,43,23,0.85)_100%)] pointer-events-none" />

      {/* ================= TOP BRAND HEADER ================= */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between">
        {/* MoolyaSetu Bridge Logo */}
        <div className="flex items-center gap-3 select-none">
          <BrandHouse3DIcon size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                Moolya<span className="text-emerald-400 font-extrabold">Setu</span>
              </span>
              <span className="text-xs font-serif text-amber-300 font-bold">
                (मूल्यसेतु)
              </span>
            </div>
            <span className="text-[11px] text-amber-300 font-extrabold uppercase tracking-wider block -mt-0.5">
              {t('tagline')}
            </span>
          </div>
        </div>

        {/* Live Video & Selection Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-cream-200 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{t('language_select.video_badge')}</span>
        </div>
      </div>

      {/* ================= CENTER FROSTED GLASS CONTAINER WITH 8 LANGUAGES ================= */}
      <div className="relative z-20 max-w-4xl w-full mx-auto px-4 sm:px-6 my-auto py-8 sm:py-10 space-y-6">
        {/* Welcome Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-lg">
            <span>✨ {t('language_select.step_title')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            {t('language_select.welcome')}
          </h1>

          <p className="text-xs sm:text-sm text-cream-100 font-medium max-w-lg mx-auto drop-shadow">
            {t('language_select.subheading')}
          </p>
        </div>

        {/* 8-Language Grid Cards (Strict Single Radio Selection) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            const imgUrl = LANGUAGE_IMAGES[lang.code] || LANGUAGE_IMAGES.hi;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all text-left group flex flex-col justify-between backdrop-blur-md cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/90 shadow-2xl shadow-amber-500/25 ring-4 ring-amber-400/40 scale-[1.04] z-10'
                    : 'border-white/20 bg-black/45 hover:border-white/45 hover:bg-black/65 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Authentic Cultural Photo Slice */}
                <div className="h-20 w-full relative overflow-hidden bg-slate-900">
                  <img
                    src={imgUrl}
                    alt={lang.nativeName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  {/* Greeting Badge */}
                  <div className="absolute bottom-1.5 left-2.5 text-amber-300 font-black text-xs drop-shadow">
                    {lang.greeting}
                  </div>

                  {/* Radio Selection Indicator */}
                  <div className={`absolute top-2 right-2 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'w-6 h-6 bg-amber-400 text-slate-950 shadow-lg ring-2 ring-white/60'
                      : 'w-5 h-5 bg-black/60 border border-white/40 text-transparent'
                  }`}>
                    <Check className={`w-3.5 h-3.5 stroke-[3.5] ${isSelected ? 'text-slate-950' : 'text-transparent'}`} />
                  </div>
                </div>

                {/* Text Details */}
                <div className="p-3 space-y-1 flex-1 flex flex-col justify-between bg-black/30">
                  <div>
                    <div className={`text-base sm:text-lg font-black transition-colors ${
                      isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-200'
                    }`}>
                      {lang.nativeName}
                    </div>
                    <div className="text-[11px] font-medium text-cream-200/80">
                      {lang.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[10px]">
                    <span className="text-amber-400 font-mono font-bold uppercase">
                      {lang.code}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        {t('language_select.selected_badge')}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Language Feedback & Continue Action */}
        <div className="text-center pt-2 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/50 border border-white/15 text-xs text-cream-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {t('language_select.selected_label')}: <strong className="text-amber-300">{currentLanguageOption.nativeName} ({currentLanguageOption.name})</strong>
            </span>
          </div>

          <div>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto min-w-[320px] py-4 px-8 rounded-2xl bg-gradient-to-r from-saffron-500 via-amber-400 to-emerald-400 hover:from-saffron-400 hover:to-amber-300 text-slate-950 font-black text-base shadow-2xl shadow-saffron-500/30 hover:shadow-saffron-500/40 transition-all transform active:scale-95 inline-flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>{t('language_select.continue_btn')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR WITH AUDIO TOGGLE ================= */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-6 flex items-center justify-between text-xs text-cream-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t('language_select.trust_strip')}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white transition-colors cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span>{isMuted ? t('language_select.unmute') : t('language_select.mute')}</span>
        </button>
      </div>
    </div>
  );
};
