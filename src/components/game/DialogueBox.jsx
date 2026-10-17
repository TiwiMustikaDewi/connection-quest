import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Award, Sparkles } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import { useLanguage } from '../../hooks/useLanguage';
import { useGame } from '../../hooks/useGame';
import { sound } from '../../lib/sound';

export function DialogueBox({
  speakerName,
  text,
  onAdvance,
  showAdvancePrompt = true,
  isFinalScene = false,
  className = '',
}) {
  const { language } = useLanguage();
  const { state } = useGame();
  const isIndo = language === 'id';

  const handleAdvance = () => {
    sound.playPop(state.soundEnabled);
    if (onAdvance) onAdvance();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full rounded-3xl bg-white/95 backdrop-blur-md border-2 border-amber-200 shadow-soft p-4 sm:p-5 flex flex-col justify-between min-h-[140px] ${className}`}
    >
      {/* Speaker Name Tag */}
      {speakerName && (
        <div className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-amber-400 border border-amber-500 shadow-xs flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 fill-amber-700 text-amber-900" />
          <span className="text-xs font-bold text-amber-950 font-display tracking-wide">
            {speakerName}
          </span>
        </div>
      )}

      {/* Dialogue Content */}
      <div className="pt-2 sm:pt-3 text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
        <TypewriterText text={text} speed={20} />
      </div>

      {/* Action / Advance Button Prompt */}
      {onAdvance && (
        <div className="flex justify-end pt-3">
          {isFinalScene ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleAdvance}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 border-2 border-amber-500 shadow-bouncy transition cursor-pointer animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>
                {isIndo
                  ? 'Lihat Gaya Koneksimu & Buat Action Plan 🏆'
                  : 'Reveal Connection Style & Build Action Plan 🏆'}
              </span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </motion.button>
          ) : (
            showAdvancePrompt && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdvance}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-200/90 hover:bg-amber-300 text-amber-950 border border-amber-400 shadow-2xs transition cursor-pointer"
              >
                <span>{isIndo ? 'Lanjutkan ➔' : 'Next ➔'}</span>
              </motion.button>
            )
          )}
        </div>
      )}
    </motion.div>
  );
}
