import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { SupportedLanguage, LanguageOption } from '../types/valuation';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import pa from '../locales/pa.json';
import mr from '../locales/mr.json';
import bn from '../locales/bn.json';
import gu from '../locales/gu.json';
import ta from '../locales/ta.json';
import te from '../locales/te.json';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', greeting: 'नमस्ते', subtext: 'अपनी प्रॉपर्टी की सही कीमत' },
  { code: 'en', name: 'English', nativeName: 'English', greeting: 'Hello', subtext: 'Evidence-backed Valuation' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', subtext: 'ਸਹੀ ਮੁੱਲ ਜਾਣੋ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', greeting: 'नमस्कार', subtext: 'प्रॉपर्टीचे खरे मूल्य' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', greeting: 'নমস্কার', subtext: 'সঠিক দাম জানুন' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', greeting: 'નમસ્તે', subtext: 'સાચી કિંમત ગણો' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', greeting: 'வணக்கம்', subtext: 'சரியான மதிப்பு' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', greeting: 'నమస్కారం', subtext: 'సరైన విలువ' },
];

const localeMap: Record<SupportedLanguage, any> = {
  en,
  hi,
  pa,
  mr,
  bn,
  gu,
  ta,
  te,
};

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguageOption: LanguageOption;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('moolyasetu_lang');
      if (saved && ['en', 'hi', 'pa', 'mr', 'bn', 'gu', 'ta', 'te'].includes(saved)) {
        return saved as SupportedLanguage;
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    return 'hi';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('moolyasetu_lang', language);
    } catch (e) {}
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const currentLanguageOption = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    let value: any = localeMap[language];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined) {
      let fallbackVal: any = localeMap['en'];
      for (const key of keys) {
        if (fallbackVal && typeof fallbackVal === 'object' && key in fallbackVal) {
          fallbackVal = fallbackVal[key];
        } else {
          fallbackVal = keyPath;
          break;
        }
      }
      value = fallbackVal;
    }

    if (typeof value !== 'string') {
      return keyPath;
    }

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// Also export useLanguage for convenience and developer ergonomics
export const useLanguage = useTranslation;
