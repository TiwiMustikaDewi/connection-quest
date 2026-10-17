import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sun, Award } from 'lucide-react';
import { sound } from '../../lib/sound';
import { useGame } from '../../hooks/useGame';
import { useLanguage } from '../../hooks/useLanguage';

// 1. High Five Mini-Game (Chapter 1 - Town Square)
export function HighFiveMiniGame({ onComplete }) {
  const { state } = useGame();
  const { language } = useLanguage();
  const isIndo = language === 'id';
  const [hasHighFived, setHasHighFived] = useState(false);

  const handleHighFive = () => {
    if (hasHighFived) return;
    sound.playSparkle(state.soundEnabled);
    setHasHighFived(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-3xl p-5 border-2 border-amber-300 shadow-soft text-center space-y-3"
    >
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
        <span>{isIndo ? 'Momen Koneksi Santai: Sambut Piko!' : 'Casual Connection: High-Five Piko!'}</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 font-medium">
        {isIndo
          ? 'Piko tersenyum lebar dan mengangkat tangannya. Sentuh telapak tangan Piko untuk melakukan High-Five!'
          : 'Piko smiles and raises their hand. Tap the palm to High-Five!'}
      </p>

      <div className="flex justify-center py-2 relative">
        <AnimatePresence>
          {hasHighFived ? (
            <motion.div
              key="celebrate"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [1, 1.2, 1], rotate: 0 }}
              className="px-5 py-3 rounded-2xl bg-amber-400 border-2 border-amber-500 shadow-bouncy text-amber-950 font-extrabold text-sm flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-amber-600" />
              <span>{isIndo ? 'HIGH-FIVE SUKSES! ✨' : 'HIGH-FIVE SUCCESS! ✨'}</span>
            </motion.div>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.85 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              onClick={handleHighFive}
              className="w-20 h-20 rounded-full bg-amber-300 hover:bg-amber-400 border-4 border-amber-400 shadow-bouncy flex flex-col items-center justify-center cursor-pointer group"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">🖐️</span>
              <span className="text-[10px] font-extrabold text-amber-950 mt-0.5">TOS!</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[11px] text-amber-800/80 font-semibold">
        {hasHighFived
          ? (isIndo ? 'Piko merasa sangat dihargai dan bersemangat!' : 'Piko feels welcomed and energized!')
          : (isIndo ? '👉 Ketuk tombol tangan di atas' : '👉 Tap the hand button above')}
      </p>
    </motion.div>
  );
}

// 2. Lantern Light-Up Mini-Game (Chapter 2 - Quiet Garden)
export function LanternMiniGame({ onComplete }) {
  const { state } = useGame();
  const { language } = useLanguage();
  const isIndo = language === 'id';

  const [litLanterns, setLitLanterns] = useState([false, false, false]);

  const toggleLantern = (idx) => {
    if (litLanterns[idx]) return;
    sound.playSelect(state.soundEnabled);
    const updated = [...litLanterns];
    updated[idx] = true;
    setLitLanterns(updated);

    if (updated.every(Boolean)) {
      sound.playSparkle(state.soundEnabled);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1400);
    }
  };

  const allLit = litLanterns.every(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-r from-teal-100 via-emerald-100 to-teal-50 rounded-3xl p-5 border-2 border-teal-300 shadow-soft text-center space-y-3"
    >
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-900">
        <Sun className="w-4 h-4 text-amber-500 fill-amber-400" />
        <span>{isIndo ? 'Momen Empati: Nyalakan Lentera Tenang Nori' : 'Empathy Moment: Light Nori\'s Lanterns'}</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 font-medium">
        {isIndo
          ? 'Nori ingin melihat jalur taman terang benderang. Sentuh ke-3 lentera bambu berikut untuk menyalakannya satu per satu!'
          : 'Nori wants the garden path to glow peacefully. Tap each of the 3 lanterns to light them up!'}
      </p>

      {/* 3 Interactive Lanterns */}
      <div className="flex justify-center gap-4 py-2">
        {litLanterns.map((isLit, idx) => (
          <motion.button
            key={idx}
            type="button"
            whileHover={!isLit ? { scale: 1.15 } : undefined}
            whileTap={!isLit ? { scale: 0.9 } : undefined}
            onClick={() => toggleLantern(idx)}
            className={`w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
              isLit
                ? 'bg-amber-300 border-amber-400 shadow-md shadow-amber-300/60 scale-105'
                : 'bg-white/80 border-teal-300 hover:bg-teal-50'
            }`}
          >
            <span className="text-2xl">{isLit ? '🏮' : '🎋'}</span>
            <span className={`text-[10px] font-bold mt-1 ${isLit ? 'text-amber-950' : 'text-slate-500'}`}>
              {isLit ? (isIndo ? 'Menyala ✨' : 'Lit ✨') : (isIndo ? 'Sentuh' : 'Tap')}
            </span>
          </motion.button>
        ))}
      </div>

      <p className="text-[11px] text-teal-800 font-semibold">
        {allLit
          ? (isIndo ? 'Taman bersinar teduh! Nori tersenyum penuh rasa aman.' : 'The grove shines gently! Nori smiles with comfort.')
          : (isIndo ? `Lentera menyala: ${litLanterns.filter(Boolean).length} / 3` : `Lanterns lit: ${litLanterns.filter(Boolean).length} / 3`)}
      </p>
    </motion.div>
  );
}

// 3. Harmonic Bridge Puzzle Mini-Game (Chapter 3 - Community Workshop)
export function BridgeMiniGame({ onComplete }) {
  const { state } = useGame();
  const { language } = useLanguage();
  const isIndo = language === 'id';
  const [isBridged, setIsBridged] = useState(false);

  const handleConnect = () => {
    if (isBridged) return;
    sound.playSparkle(state.soundEnabled);
    setIsBridged(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-r from-indigo-100 via-violet-100 to-indigo-50 rounded-3xl p-5 border-2 border-indigo-300 shadow-soft text-center space-y-3"
    >
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-900">
        <Award className="w-4 h-4 text-indigo-600" />
        <span>{isIndo ? 'Momen Kolaborasi: Satukan Dua Sudut Pandang!' : 'Collaboration Moment: Bridge the Two Views!'}</span>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 font-medium">
        {isIndo
          ? 'Tim Musik (Panggung) dan Tim Stan Warga sedang mencari titik temu. Sentuh jembatan penghubung di bawah ini!'
          : 'Music Stage Team and Interactive Craft Team are seeking alignment. Tap the bridge to unite them!'}
      </p>

      <div className="flex items-center justify-center gap-2 py-2">
        <div className="p-3 rounded-2xl bg-white border border-indigo-200 text-xs font-bold text-indigo-900">
          🎵 Tim Musik
        </div>

        <motion.button
          type="button"
          whileHover={!isBridged ? { scale: 1.15 } : undefined}
          whileTap={!isBridged ? { scale: 0.9 } : undefined}
          onClick={handleConnect}
          className={`px-4 py-2.5 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer ${
            isBridged
              ? 'bg-amber-400 border-2 border-amber-500 text-amber-950 shadow-md scale-105'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white animate-pulse'
          }`}
        >
          {isBridged ? '🌉 TERHUBUNG HARMONI ✨' : '🤝 Satukan!'}
        </motion.button>

        <div className="p-3 rounded-2xl bg-white border border-indigo-200 text-xs font-bold text-indigo-900">
          🎨 Stan Warga
        </div>
      </div>

      <p className="text-[11px] text-indigo-800 font-semibold">
        {isBridged
          ? (isIndo ? 'Bumi terkesima! Perbedaan pendapat berubah menjadi karya bersama.' : 'Bumi is thrilled! Differences transformed into mutual creation.')
          : (isIndo ? '👉 Ketuk tombol "Satukan" di tengah' : '👉 Tap the "Unite" button in the center')}
      </p>
    </motion.div>
  );
}
