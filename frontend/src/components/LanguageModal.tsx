import React from 'react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { Check, X, Globe } from 'lucide-react';
import type { SupportedLanguage } from '../types/valuation';

export const LanguageModal: React.FC = () => {
  const { language, setLanguage, isLanguageModalOpen, setIsLanguageModalOpen, t } = useTranslation();

  if (!isLanguageModalOpen) return null;

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsLanguageModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">{t('language_select.step_title')}</h3>
              <p className="text-xs text-slate-400">{t('language_select.subheading')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8 Language Grid */}
        <div className="p-4 grid grid-cols-2 gap-2.5 max-h-[65vh] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-3.5 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-brand-500/15 border-brand-500/60 shadow-sm shadow-brand-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="text-base font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                    {lang.nativeName}
                  </div>
                  <div className="text-xs text-slate-400">{lang.name}</div>
                </div>
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-slate-950">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-slate-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/50 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Language preferences are saved automatically
          </p>
        </div>
      </div>
    </div>
  );
};
