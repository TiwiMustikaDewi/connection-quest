import React, { useState, useEffect, useCallback } from 'react';
import { LanguageContext } from './languageContextDef';
import { translate } from '../data/translations';

const STORAGE_KEY = 'connection_quest_language_v1';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'en' || saved === 'id' ? saved : 'id';
    } catch {
      return 'id';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (err) {
      console.warn('Could not save language to localStorage:', err);
    }
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (lang === 'id' || lang === 'en') {
      setLanguageState(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'id' ? 'en' : 'id'));
  }, []);

  const t = useCallback(
    (path, params) => {
      return translate(language, path, params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
