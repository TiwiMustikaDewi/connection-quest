import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, MessageCircleHeart, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MiloSprite, LumiSprite, KikoSprite } from '../components/characters/AvatarSprite';
import { sound } from '../lib/sound';

export function WelcomePage() {
  const { t, language } = useLanguage();
  const { state, hasStarted } = useGame();
  const navigate = useNavigate();
  const [activeSpeech, setActiveSpeech] = useState(null);

  const isIndo = language === 'id';

  const handleStart = () => {
    sound.playSelect(state.soundEnabled);
    if (hasStarted) {
      navigate('/game');
    } else {
      try {
        localStorage.removeItem('connection_quest_reflection_v1');
      } catch (err) {
        console.warn(err);
      }
      navigate('/register');
    }
  };

  const handleBuddyClick = (buddyName, speechId, speechEn) => {
    sound.playPop(state.soundEnabled);
    setActiveSpeech(isIndo ? speechId : speechEn);
    setTimeout(() => {
      setActiveSpeech(null);
    }, 3500);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-5 py-4">
      {/* Top Banner Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="yellow" icon={Sparkles} className="text-xs uppercase tracking-wider px-3.5 py-1.5 shadow-xs">
          {t('common.eventTitle')}
        </Badge>
      </motion.div>

      {/* Main Title Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center space-y-2 max-w-md"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight font-display drop-shadow-xs">
          Connection <span className="text-amber-500 underline decoration-amber-300 decoration-wavy decoration-2">Quest</span>
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-600">
          {t('welcome.tagline')}
        </p>
      </motion.div>

      {/* Mascot Preview Showcase Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full"
      >
        <Card variant="glass" className="relative overflow-hidden text-center border-2 border-amber-200/80 p-5 sm:p-6">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

          {/* Floating Buddy Speech Bubble */}
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeSpeech ? (
                <motion.div
                  key="bubble"
                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="px-3 py-1 rounded-full bg-amber-300 text-amber-950 font-bold text-xs shadow-xs border border-amber-400"
                >
                  💬 {activeSpeech}
                </motion.div>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  {isIndo ? '👉 Klik maskot untuk menyapa mereka!' : '👉 Click any mascot to hear them speak!'}
                </span>
              )}
            </AnimatePresence>
          </div>

          {/* Three Mascots in a row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end justify-items-center py-2">
            {/* Milo */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleBuddyClick('Milo', 'Halo! Aku Milo, siap bikin hari ini penuh senyum! ☀️', 'Hi! I am Milo, ready to bring sunny smiles! ☀️')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-28 flex items-end">
                <MiloSprite className="w-24 h-24 sm:w-28 sm:h-28" />
              </div>
              <span className="mt-2 text-xs font-bold text-amber-800 bg-amber-100/90 group-hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 transition-colors">
                Milo
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block mt-0.5">Sunny Buddy</span>
            </motion.div>

            {/* Lumi */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleBuddyClick('Lumi', 'Tenang saja... kita dengarkan ceritamu perlahan. 🌿', 'Take it easy... we will listen gently. 🌿')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-28 flex items-end">
                <LumiSprite className="w-24 h-24 sm:w-28 sm:h-28" />
              </div>
              <span className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-100/90 group-hover:bg-emerald-200 px-2 py-0.5 rounded-full border border-emerald-300 transition-colors">
                Lumi
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block mt-0.5">Calm Buddy</span>
            </motion.div>

            {/* Kiko */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleBuddyClick('Kiko', 'Ayo jelajahi petualangan baru bersama! ✨', 'Let us dive into bold new adventures! ✨')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="h-28 flex items-end">
                <KikoSprite className="w-24 h-24 sm:w-28 sm:h-28" />
              </div>
              <span className="mt-2 text-xs font-bold text-indigo-800 bg-indigo-100/90 group-hover:bg-indigo-200 px-2 py-0.5 rounded-full border border-indigo-300 transition-colors">
                Kiko
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block mt-0.5">Bold Buddy</span>
            </motion.div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            {t('welcome.description')}
          </p>
        </Card>
      </motion.div>

      {/* Primary Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full flex flex-col items-center gap-2"
      >
        <Button
          size="lg"
          variant="primary"
          onClick={handleStart}
          className="w-full max-w-xs text-base py-4"
          icon={ArrowRight}
        >
          {hasStarted ? t('welcome.resumeCta') : t('welcome.startCta')}
        </Button>
      </motion.div>

      {/* Feature Highlights Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full pt-1"
      >
        <div className="bg-white/85 p-3 rounded-2xl border border-amber-100 shadow-2xs flex items-center sm:flex-col sm:text-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{t('welcome.features.decision')}</h4>
            <p className="text-[11px] text-slate-500">{t('welcome.features.decisionDesc')}</p>
          </div>
        </div>

        <div className="bg-white/85 p-3 rounded-2xl border border-amber-100 shadow-2xs flex items-center sm:flex-col sm:text-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
            <MessageCircleHeart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{t('welcome.features.bilingual')}</h4>
            <p className="text-[11px] text-slate-500">{t('welcome.features.bilingualDesc')}</p>
          </div>
        </div>

        <div className="bg-white/85 p-3 rounded-2xl border border-amber-100 shadow-2xs flex items-center sm:flex-col sm:text-center gap-3">
          <div className="p-2 rounded-xl bg-violet-100 text-violet-700 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">{t('welcome.features.outcome')}</h4>
            <p className="text-[11px] text-slate-500">{t('welcome.features.outcomeDesc')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
