import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Gamepad2, X, Star, Zap } from 'lucide-react';
import { ArcadeStarfallCatcher } from './ArcadeStarfallCatcher';
import { ArcadeBridgeCircuit } from './ArcadeBridgeCircuit';
import { useLanguage } from '../../hooks/useLanguage';
import { sound } from '../../lib/sound';

export function ArcadeGameCenterModal({ isOpen, onClose }) {
  const { language } = useLanguage();
  const isIndo = language === 'id';

  const [activeGame, setActiveGame] = useState(null); // 'starfall' | 'bridge' | null

  if (!isOpen) return null;

  const handleSelectGame = (gameId) => {
    sound.playSelect(true);
    setActiveGame(gameId);
  };

  const handleBackToMenu = () => {
    sound.playPop(true);
    setActiveGame(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-4 sm:p-6 max-w-xl w-full max-h-[92vh] overflow-y-auto border-2 border-amber-300 shadow-2xl flex flex-col space-y-4 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-300 text-amber-950 flex items-center justify-center shadow-xs">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 leading-tight">
                {isIndo ? 'Connectopia Arcade Zone 🎮' : 'Connectopia Arcade Zone 🎮'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isIndo ? 'Mainkan game interaktif seru kapan saja!' : 'Play interactive mini-games anytime!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeGame && (
              <button
                type="button"
                onClick={handleBackToMenu}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                {isIndo ? '← Pilih Game' : '← Menu'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!activeGame ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
            {/* Game 1: Starfall Catcher */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectGame('starfall')}
              className="p-4 rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:bg-amber-100/60 cursor-pointer shadow-xs space-y-2 transition-all flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-300 border border-amber-400 flex items-center justify-center text-2xl shadow-xs">
                  ⭐
                </div>
                <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                  <span>Starfall Catcher Rush</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isIndo
                    ? 'Tangkap bintang & balon persahabatan yang jatuh dari langit sebelum waktu habis! Hindari awan badai.'
                    : 'Catch falling friendship stars and balloons before time runs out! Avoid storm clouds.'}
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-block w-full text-center py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-xl shadow-xs">
                  {isIndo ? 'Mainkan Sekarang ➔' : 'Play Now ➔'}
                </span>
              </div>
            </motion.div>

            {/* Game 2: Lantern Bridge Circuit */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectGame('bridge')}
              className="p-4 rounded-3xl border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-emerald-50 hover:bg-teal-100/60 cursor-pointer shadow-xs space-y-2 transition-all flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-300 border border-teal-400 flex items-center justify-center text-2xl shadow-xs">
                  🏮
                </div>
                <h4 className="font-extrabold text-sm text-teal-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-teal-500 text-teal-600" />
                  <span>Lantern Bridge Circuit</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isIndo
                    ? 'Putar pipa lentera bambu untuk mengalirkan cahaya persahabatan dari Taman Lentera ke Bengkel Komunitas!'
                    : 'Rotate bamboo light conduits to link the light from Quiet Garden to Community Workshop!'}
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-block w-full text-center py-2 bg-teal-400 hover:bg-teal-500 text-teal-950 font-bold text-xs rounded-xl shadow-xs">
                  {isIndo ? 'Pecahkan Puzzle ➔' : 'Solve Puzzle ➔'}
                </span>
              </div>
            </motion.div>
          </div>
        ) : activeGame === 'starfall' ? (
          <div className="w-full">
            <ArcadeStarfallCatcher onComplete={handleBackToMenu} onSkip={handleBackToMenu} />
          </div>
        ) : (
          <div className="w-full">
            <ArcadeBridgeCircuit onComplete={handleBackToMenu} onSkip={handleBackToMenu} />
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
}
