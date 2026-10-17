import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Trophy, Award, CheckCircle2 } from 'lucide-react';
import { sound } from '../../lib/sound';
import { useGame } from '../../hooks/useGame';
import { useLanguage } from '../../hooks/useLanguage';

// ==================== MINI-GAME 1: TANGKAP BINTANG FESTIVAL ====================
export function StarCatcherMiniGame({ onComplete }) {
  const { state } = useGame();
  const { language } = useLanguage();
  const isIndo = language === 'id';

  const [collected, setCollected] = useState(0);
  const [stars, setStars] = useState([
    { id: 1, x: 20, y: 30, icon: '⭐', labelId: 'Inisiatif', labelEn: 'Initiative' },
    { id: 2, x: 75, y: 25, icon: '🎈', labelId: 'Ceria', labelEn: 'Joy' },
    { id: 3, x: 45, y: 55, icon: '🌟', labelId: 'Energi', labelEn: 'Energy' },
    { id: 4, x: 15, y: 70, icon: '🎉', labelId: 'Harmoni', labelEn: 'Harmony' },
    { id: 5, x: 80, y: 65, icon: '✨', labelId: 'Semangat', labelEn: 'Spirit' },
  ]);

  const target = 5;
  const isFinished = collected >= target;

  const handleCatch = (id) => {
    sound.playPop(state.soundEnabled);
    setStars((prev) => prev.filter((s) => s.id !== id));
    setCollected((prev) => {
      const next = prev + 1;
      if (next >= target) {
        sound.playSparkle(state.soundEnabled);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1500);
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-r from-amber-100/95 via-orange-100/90 to-yellow-100/95 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-soft text-center space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 min-w-0 truncate">
          <Star className="w-4 h-4 fill-amber-400 text-amber-600 shrink-0" />
          <span className="truncate">{isIndo ? 'Mini Game: Kumpulkan Bintang Festival!' : 'Mini Game: Catch the Festival Stars!'}</span>
        </span>
        <span className="text-xs font-extrabold text-amber-950 bg-amber-300 px-2.5 py-1 rounded-full border border-amber-400 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none">
          <span className="text-sm leading-none">⭐</span>
          <span className="leading-none whitespace-nowrap">{collected} / {target}</span>
        </span>
      </div>

      <p className="text-xs text-slate-700 font-medium">
        {isIndo
          ? 'Ketuk semua bintang & balon yang melayang di bawah ini untuk mengumpulkan semangat festival!'
          : 'Tap all the floating stars and balloons below to gather the festival spirit!'}
      </p>

      {/* Floating Interactive Playfield */}
      <div className="relative w-full h-36 bg-white/70 rounded-2xl border-2 border-dashed border-amber-300 overflow-hidden">
        <AnimatePresence>
          {stars.map((star) => (
            <motion.button
              key={star.id}
              type="button"
              initial={{ scale: 0 }}
              animate={{
                scale: [1, 1.15, 1],
                y: [0, -8, 0],
                x: [0, 4, 0],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2 + star.id * 0.3 }}
              style={{ top: `${star.y}%`, left: `${star.x}%` }}
              onClick={() => handleCatch(star.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl bg-amber-200/90 hover:bg-amber-300 border-2 border-amber-400 shadow-xs cursor-pointer active:scale-90 transition-transform flex flex-col items-center select-none"
            >
              <span className="text-xl">{star.icon}</span>
              <span className="text-[9px] font-bold text-amber-950">{isIndo ? star.labelId : star.labelEn}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        {isFinished && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-amber-300/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-1"
          >
            <Trophy className="w-8 h-8 text-amber-900 fill-amber-400 animate-bounce" />
            <h4 className="font-extrabold text-sm text-amber-950">
              {isIndo ? 'SEMANGAT FESTIVAL TERKUMPUL! 🎉' : 'FESTIVAL SPIRIT GATHERED! 🎉'}
            </h4>
            <p className="text-[11px] text-amber-900 font-medium">
              {isIndo ? 'Karakter melompat kegirangan!' : 'The mascot is jumping with joy!'}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== MINI-GAME 2: ZEN LANTERN HARMONY ====================
export function ZenLanternMiniGame({ onComplete }) {
  const { state } = useGame();
  const { language } = useLanguage();
  const isIndo = language === 'id';

  const [activeNotes, setActiveNotes] = useState([false, false, false]);

  const lanternNotes = [
    { id: 0, nameId: 'Lentera 1 (Kehangatan)', nameEn: 'Lantern 1 (Warmth)', icon: '🏮', freq: 523.25 },
    { id: 1, nameId: 'Lentera 2 (Kenyamanan)', nameEn: 'Lantern 2 (Comfort)', icon: '🏮', freq: 659.25 },
    { id: 2, nameId: 'Lentera 3 (Kedamaian)', nameEn: 'Lantern 3 (Peace)', icon: '🏮', freq: 783.99 },
  ];

  const handleLight = (idx) => {
    if (activeNotes[idx]) return;
    sound.playSelect(state.soundEnabled);
    const updated = [...activeNotes];
    updated[idx] = true;
    setActiveNotes(updated);

    if (updated.every(Boolean)) {
      sound.playSparkle(state.soundEnabled);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }
  };

  const isAllLit = activeNotes.every(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-r from-teal-100/95 via-emerald-100/90 to-teal-50/95 rounded-3xl p-4 sm:p-5 border-2 border-teal-300 shadow-soft text-center space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5 min-w-0 truncate">
          <Sparkles className="w-4 h-4 text-teal-600 fill-teal-400 shrink-0" />
          <span className="truncate">{isIndo ? 'Mini Game: Nyalakan Melodi Lentera Nori!' : 'Mini Game: Light Nori\'s Zen Lanterns!'}</span>
        </span>
        <span className="text-xs font-extrabold text-teal-950 bg-teal-300 px-2.5 py-1 rounded-full border border-teal-400 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none">
          <span className="text-sm leading-none">✨</span>
          <span className="leading-none whitespace-nowrap">{activeNotes.filter(Boolean).length} / 3</span>
        </span>
      </div>

      <p className="text-xs text-slate-700 font-medium">
        {isIndo
          ? 'Sentuh ke-3 lentera bambu berikut untuk mengalirkan cahaya melodi dan menenangkan suasana taman!'
          : 'Tap all 3 bamboo lanterns below to trigger soothing melody notes and light up the grove!'}
      </p>

      {/* 3 Large Interactive Glowing Lanterns */}
      <div className="grid grid-cols-3 gap-3 py-1">
        {lanternNotes.map((item, idx) => {
          const isLit = activeNotes[idx];
          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={!isLit ? { scale: 1.08, y: -4 } : undefined}
              whileTap={!isLit ? { scale: 0.92 } : undefined}
              onClick={() => handleLight(idx)}
              className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isLit
                  ? 'bg-amber-300 border-amber-400 shadow-lg shadow-amber-300/60 scale-102'
                  : 'bg-white/85 border-teal-200 hover:bg-teal-50'
              }`}
            >
              <motion.span
                animate={isLit ? { scale: [1, 1.2, 1], rotate: [0, 4, -4, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-3xl"
              >
                {item.icon}
              </motion.span>
              <span className={`text-[10px] font-bold mt-1.5 ${isLit ? 'text-amber-950' : 'text-slate-600'}`}>
                {isLit ? (isIndo ? 'Bercahaya ✨' : 'Lit ✨') : (isIndo ? 'Sentuh ➔' : 'Tap ➔')}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="text-[11px] text-teal-800 font-semibold">
        {isAllLit
          ? (isIndo ? '🌸 Pendaran cahaya magis menyelimuti taman! Nori merasa damai.' : '🌸 Magical glow warms the garden! Nori feels calm.')
          : (isIndo ? 'Ketuk lentera yang belum menyala' : 'Tap remaining unlit lanterns')}
      </p>
    </motion.div>
  );
}

// ==================== MINI-GAME 3: HARMONY BLUEPRINT BUILDER ====================
export function BlueprintBuilderMiniGame({ onComplete }) {
  const { state } = useGame();
  const { language } = useLanguage();
  const isIndo = language === 'id';

  const [placed, setPlaced] = useState({ stage: false, stalls: false, garden: false });

  const modules = [
    { id: 'stage', titleId: '🎵 Panggung Musik Terbuka', titleEn: '🎵 Open Music Stage', descId: 'Di tengah alun-alun' },
    { id: 'stalls', titleId: '🏮 Stan Lentera Nori', titleEn: '🏮 Nori\'s Lantern Stalls', descId: 'Mengelilingi panggung' },
    { id: 'garden', titleId: '🌸 Area Interaksi Warga', titleEn: '🌸 Community Lounge', descId: 'Ruang ngobrol santai' },
  ];

  const handlePlace = (id) => {
    if (placed[id]) return;
    sound.playSelect(state.soundEnabled);
    const updated = { ...placed, [id]: true };
    setPlaced(updated);

    if (Object.values(updated).every(Boolean)) {
      sound.playSparkle(state.soundEnabled);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }
  };

  const isComplete = Object.values(placed).every(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-r from-indigo-100/95 via-violet-100/90 to-indigo-50/95 rounded-3xl p-4 sm:p-5 border-2 border-indigo-300 shadow-soft text-center space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 min-w-0 truncate">
          <Award className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="truncate">{isIndo ? 'Mini Game: Rancang Denah Harmoni Bersama!' : 'Mini Game: Build the Harmony Blueprint!'}</span>
        </span>
        <span className="text-xs font-extrabold text-indigo-950 bg-indigo-300 px-2.5 py-1 rounded-full border border-indigo-400 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 leading-none">
          <span className="text-sm leading-none">📐</span>
          <span className="leading-none whitespace-nowrap">{Object.values(placed).filter(Boolean).length} / 3</span>
        </span>
      </div>

      <p className="text-xs text-slate-700 font-medium">
        {isIndo
          ? 'Sentuh setiap modul denah berikut untuk memasangnya ke tata letak festival!'
          : 'Tap each layout module below to fit them into the shared festival blueprint!'}
      </p>

      {/* 3 Modular Puzzle Pieces */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {modules.map((mod) => {
          const isFitted = placed[mod.id];
          return (
            <motion.button
              key={mod.id}
              type="button"
              whileHover={!isFitted ? { scale: 1.04, y: -2 } : undefined}
              whileTap={!isFitted ? { scale: 0.96 } : undefined}
              onClick={() => handlePlace(mod.id)}
              className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                isFitted
                  ? 'bg-amber-300 border-amber-400 shadow-xs'
                  : 'bg-white/90 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {isIndo ? mod.titleId : mod.titleEn}
                </span>
                {isFitted && <CheckCircle2 className="w-4 h-4 text-amber-900" />}
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                {isFitted ? (isIndo ? 'Terpasang Sempurna ✓' : 'Fitted in Blueprint ✓') : (isIndo ? 'Ketuk untuk Pasang' : 'Tap to Place')}
              </span>
            </motion.button>
          );
        })}
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-2.5 rounded-xl bg-amber-400 border border-amber-500 text-amber-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-4 h-4 fill-amber-700" />
          <span>{isIndo ? 'KOLABORASI HARMONIS TERCIPTA! 🏆' : 'HARMONIC COLLABORATION UNLOCKED! 🏆'}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
