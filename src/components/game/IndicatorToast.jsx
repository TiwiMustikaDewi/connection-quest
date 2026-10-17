import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Compass, Shield } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const INDICATOR_ICONS = {
  initiative: Compass,
  empathy: Heart,
  adaptability: Sparkles,
  authenticity: Shield,
};

export function IndicatorToast({ toastData }) {
  const { language } = useLanguage();
  const isIndo = language === 'id';

  if (!toastData || Object.keys(toastData).length === 0) return null;

  const labels = {
    initiative: isIndo ? 'Inisiatif' : 'Initiative',
    empathy: isIndo ? 'Empati' : 'Empathy',
    adaptability: isIndo ? 'Adaptabilitas' : 'Adaptability',
    authenticity: isIndo ? 'Otentisitas' : 'Authenticity',
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {Object.entries(toastData).map(([key, value]) => {
          if (!value) return null;
          const IconComp = INDICATOR_ICONS[key] || Sparkles;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border-2 border-amber-300 shadow-pastel text-xs font-bold text-amber-900"
            >
              <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center">
                <IconComp className="w-3 h-3 fill-amber-500" />
              </div>
              <span>
                +{value} {labels[key]}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
