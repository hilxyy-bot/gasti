import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation, formatMonthNameWithLang } from '../utils/translations';

interface LanguageContextType {
  language: LanguageCode;
  currentLanguage: Language;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatMonth: (yearMonth: string) => string;
  supportedLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('gasti_language');
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved as LanguageCode;
    }
    // Check browser navigator language
    const browserLang = navigator.language.slice(0, 2);
    if (SUPPORTED_LANGUAGES.some((l) => l.code === browserLang)) {
      return browserLang as LanguageCode;
    }
    return 'es'; // Default to Spanish
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('gasti_language', lang);
  };

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  const formatMonth = (yearMonth: string) => {
    return formatMonthNameWithLang(yearMonth, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage,
        setLanguage,
        t,
        formatMonth,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
