import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useGame } from '../../hooks/useGame';
import { sound } from '../../lib/sound';

export function ChoicePanel({ choices = [], onSelectChoice, className = '' }) {
  const { language } = useLanguage();
  const { state } = useGame();
  const isIndo = language === 'id';

  const handleSelect = (choice) => {
    sound.playSelect(state.soundEnabled);
    if (onSelectChoice) {
      onSelectChoice(choice);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className={`w-full space-y-2.5 ${className}`}
    >
      <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-amber-800">
        <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
        <span>{isIndo ? 'Pilih Respons Terbaikmu:' : 'Choose Your Response:'}</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {choices.map((choice, idx) => {
          const label = isIndo ? choice.labelId : choice.labelEn;
          const letter = String.fromCharCode(65 + idx); // A, B, C

          return (
            <motion.button
              key={choice.id || idx}
              type="button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => handleSelect(choice)}
              className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-white/90 hover:bg-amber-50/90 border-2 border-amber-200/90 hover:border-amber-400 shadow-soft transition cursor-pointer flex items-start gap-3 group"
            >
              {/* Option Letter Badge */}
              <div className="w-7 h-7 rounded-xl bg-amber-200 group-hover:bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-2xs font-display">
                {letter}
              </div>

              {/* Choice Label */}
              <div className="flex-1 text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900 leading-snug">
                {label}
              </div>

              <div className="text-slate-300 group-hover:text-amber-500 transition-colors pt-0.5">
                <MessageCircle className="w-4 h-4" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
