import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Globe } from 'lucide-react';

export function LanguageToggle({ className = '' }) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`
        inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/90 border border-amber-200/80 rounded-full
        text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-950 active:scale-95 transition
        cursor-pointer shadow-xs shrink-0
        ${className}
      `}
      title={language === 'id' ? 'Ganti ke English (EN)' : 'Switch to Bahasa Indonesia (ID)'}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span className="text-[11px] font-extrabold text-amber-950">{language.toUpperCase()}</span>
    </button>
  );
}
