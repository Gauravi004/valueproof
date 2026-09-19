'use client';

import React from 'react';
import { ShieldCheck, Activity, Globe, Sparkles } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage, TRANSLATIONS } from '@/lib/i18n';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  backendOnline: boolean;
  onLoadDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  backendOnline,
  onLoadDemo,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">ValueProof</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Evidence Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Quick Demo Preload */}
          <button
            onClick={onLoadDemo}
            className="hidden md:flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 hover:bg-indigo-900/60 transition-colors"
            title="Pre-fill Rajpura independent house demo dataset"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.loadDemo}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-md bg-slate-900 text-slate-200 border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
          </div>

          {/* Backend Status Indicator */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Activity className={`w-3.5 h-3.5 ${backendOnline ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">{backendOnline ? 'Deterministic Engine Ready' : 'Connecting API...'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
