import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, RotateCcw, ArrowRight, Zap } from 'lucide-react';
import { AvatarSprite } from '../characters/AvatarSprite';
import { useGame } from '../../hooks/useGame';
import { useLanguage } from '../../hooks/useLanguage';
import { sound } from '../../lib/sound';

const ITEM_TYPES = [
  { type: 'star', icon: '⭐', labelId: 'Bintang Inisiatif', labelEn: 'Star of Initiative', pts: 10, color: 'text-amber-400' },
  { type: 'heart', icon: '💖', labelId: 'Hati Empati', labelEn: 'Heart of Empathy', pts: 15, color: 'text-rose-400' },
  { type: 'balloon', icon: '🎈', labelId: 'Balon Persahabatan', labelEn: 'Friendship Balloon', pts: 20, color: 'text-sky-400' },
  { type: 'gem', icon: '🌈', labelId: 'Kristal Harmoni', labelEn: 'Harmony Crystal', pts: 35, color: 'text-violet-400', isBonus: true },
  { type: 'cloud', icon: '🌧️', labelId: 'Awan Ragu', labelEn: 'Hesitation Cloud', pts: -10, isHazard: true },
];

let globalSpawnId = 0;

export function ArcadeStarfallCatcher({ onComplete, onSkip }) {
  const { state } = useGame();
  const { language } = useLanguage();
  const isIndo = language === 'id';

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isGameOver, setIsGameOver] = useState(false);
  const [collectedStats, setCollectedStats] = useState({ star: 0, heart: 0, balloon: 0, gem: 0, cloud: 0 });

  // Floating notifications (popups on catch)
  const [popups, setPopups] = useState([]);

  // Mascot position (in percentage 5% to 95%)
  const [basketX, setBasketX] = useState(50);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);

  // Falling items active on screen
  const [items, setItems] = useState([]);

  const containerRef = useRef(null);
  const requestRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const scoreRef = useRef(score);
  const comboRef = useRef(combo);
  const basketXRef = useRef(basketX);

  const soundOn = state.soundEnabled;

  // Keep refs synchronized in useEffect
  useEffect(() => {
    scoreRef.current = score;
    comboRef.current = combo;
    basketXRef.current = basketX;
  }, [score, combo, basketX]);

  // Finish game callback
  const finishGame = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    sound.playSparkle(soundOn);
  }, [soundOn]);

  // Start the game
  const startGame = useCallback(() => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(25);
    setBasketX(50);
    setItems([]);
    setPopups([]);
    setCollectedStats({ star: 0, heart: 0, balloon: 0, gem: 0, cloud: 0 });
    setIsGameOver(false);
    setIsPlaying(true);
    lastSpawnRef.current = Date.now();
    sound.init();
    sound.playSelect(soundOn);
  }, [soundOn]);

  // Popup helper
  const addPopup = useCallback((text, x, color) => {
    globalSpawnId += 1;
    const id = `popup-${globalSpawnId}`;
    setPopups((prev) => [...prev, { id, text, x, color }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 900);
  }, []);

  // Handle item caught
  const handleCatchItem = useCallback((item) => {
    if (item.isHazard) {
      sound.playMiss(soundOn);
      setCombo(0);
      setScore((s) => Math.max(0, s + item.pts));
      setCollectedStats((c) => ({ ...c, cloud: c.cloud + 1 }));
      addPopup('-10 🌧️', item.x, 'text-rose-600 font-bold');
      return;
    }

    // Success catch
    const currentCombo = comboRef.current + 1;
    setCombo(currentCombo);
    setMaxCombo((prev) => Math.max(prev, currentCombo));

    const comboMultiplier = currentCombo >= 6 ? 3 : currentCombo >= 3 ? 2 : 1;
    const gained = item.pts * comboMultiplier;

    setScore((s) => s + gained);
    setCollectedStats((c) => ({ ...c, [item.type]: (c[item.type] || 0) + 1 }));

    sound.playCatch(soundOn, comboMultiplier);
    if (currentCombo === 3 || currentCombo === 6) {
      sound.playComboFanfare(soundOn);
    }

    const popupText = comboMultiplier > 1 ? `+${gained} (x${comboMultiplier}!)` : `+${gained}`;
    addPopup(popupText, item.x, item.isBonus ? 'text-amber-500 font-extrabold scale-110' : 'text-amber-900 font-bold');
  }, [soundOn, addPopup]);

  // Handle Keyboard movement
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setIsMovingLeft(true);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setIsMovingRight(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setIsMovingLeft(false);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setIsMovingRight(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  // Game countdown timer
  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, finishGame]);

  // Touch / Mouse dragging support
  const handleTouchMove = (e) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, relativeX)));
  };

  // Main Animation / Game Physics loop
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // 1. Move basket if keys are held
      if (isMovingLeft) {
        setBasketX((prev) => Math.max(10, prev - 70 * dt));
      } else if (isMovingRight) {
        setBasketX((prev) => Math.min(90, prev + 70 * dt));
      }

      // 2. Spawn items periodically
      const now = Date.now();
      if (now - lastSpawnRef.current > 750) {
        lastSpawnRef.current = now;
        globalSpawnId += 1;
        const randomType = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
        const newItem = {
          id: `item-${globalSpawnId}`,
          type: randomType.type,
          icon: randomType.icon,
          pts: randomType.pts,
          isHazard: Boolean(randomType.isHazard),
          isBonus: Boolean(randomType.isBonus),
          x: 12 + Math.random() * 76,
          y: -5,
          speed: 38 + Math.random() * 26,
        };
        setItems((prev) => [...prev, newItem]);
      }

      // 3. Move items and check collisions
      const currentX = basketXRef.current;
      const basketY = 82;
      const hitWidth = 14;

      setItems((prevItems) => {
        const remaining = [];

        for (const item of prevItems) {
          const nextY = item.y + item.speed * dt;

          // Check collision with basket
          if (nextY >= basketY - 6 && nextY <= basketY + 8) {
            const distanceX = Math.abs(item.x - currentX);
            if (distanceX < hitWidth) {
              handleCatchItem(item);
              continue;
            }
          }

          // Off bottom of screen
          if (nextY > 105) {
            if (!item.isHazard) {
              setCombo(0);
            }
            continue;
          }

          remaining.push({ ...item, y: nextY });
        }

        return remaining;
      });

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isMovingLeft, isMovingRight, handleCatchItem]);

  // Mascot display
  const mascotId = state.participant.avatarId || 'milo';
  const targetScore = 100;
  const starsEarned = score >= 160 ? 3 : score >= 90 ? 2 : score >= 40 ? 1 : 0;

  return (
    <div className="w-full flex-1 flex flex-col space-y-3">
      {/* Top Arcade Status Bar */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-300 p-3 rounded-3xl border-2 border-amber-400 shadow-soft flex items-center justify-between text-amber-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-white/90 flex items-center justify-center shadow-xs">
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/80">
              {isIndo ? 'Skor Festival' : 'Festival Score'}
            </div>
            <div className="text-lg font-black leading-none">{score}</div>
          </div>
        </div>

        {/* Combo Multiplier Tag */}
        {combo >= 2 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="px-2.5 py-1 rounded-full bg-white/95 border border-amber-400 shadow-xs flex items-center gap-1 text-xs font-black text-amber-900"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
            <span>COMBO x{combo >= 6 ? 3 : 2}!</span>
          </motion.div>
        )}

        {/* Timer */}
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900/80">
            {isIndo ? 'Sisa Waktu' : 'Time Left'}
          </div>
          <div className={`text-lg font-black leading-none ${timeLeft <= 5 ? 'text-rose-700 animate-pulse' : ''}`}>
            ⏳ {timeLeft}s
          </div>
        </div>
      </div>

      {/* Main Arcade Play Area */}
      <div
        ref={containerRef}
        onMouseMove={handleTouchMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[360px] sm:h-[400px] rounded-3xl overflow-hidden border-3 border-amber-300 shadow-lg select-none cursor-pointer bg-gradient-to-b from-sky-400 via-amber-100 to-amber-200"
      >
        {/* Floating Clouds Background */}
        <div className="absolute top-4 left-6 w-24 h-8 bg-white/70 rounded-full blur-xs pointer-events-none" />
        <div className="absolute top-12 right-8 w-32 h-10 bg-white/60 rounded-full blur-xs pointer-events-none" />
        <div className="absolute top-20 left-1/3 w-28 h-7 bg-white/50 rounded-full blur-xs pointer-events-none" />

        {/* Pre-Game Start Overlay */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-2xl max-w-sm w-full space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-xs">
                ⭐
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                {isIndo ? 'Interlude: Connectopia Starfall Catcher!' : 'Interlude: Starfall Catcher Rush!'}
              </h3>
              <p className="text-xs text-slate-600">
                {isIndo
                  ? 'Kumpulkan bintang & balon persahabatan yang berjatuhan! Geser dengan panah keyboard, mouse, atau tombol sentuh di bawah.'
                  : 'Catch the falling festival stars and balloons! Move with arrow keys, mouse, or touch controls.'}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700 bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
                <div>⭐ {isIndo ? 'Bintang (+10)' : 'Star (+10)'}</div>
                <div>💖 {isIndo ? 'Hati (+15)' : 'Heart (+15)'}</div>
                <div>🎈 {isIndo ? 'Balon (+20)' : 'Balloon (+20)'}</div>
                <div className="text-rose-600">🌧️ {isIndo ? 'Awan (-10)' : 'Cloud (-10)'}</div>
              </div>

              <div className="flex gap-2 pt-1">
                {onSkip && (
                  <button
                    type="button"
                    onClick={onSkip}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                  >
                    {isIndo ? 'Lewati' : 'Skip'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={startGame}
                  className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-extrabold text-xs shadow-md shadow-amber-400/40 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Sparkles className="w-4 h-4 fill-amber-800 text-amber-900" />
                  <span>{isIndo ? 'Mulai Main!' : 'Start Catching!'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Game Over / Victory Modal */}
        {isGameOver && (
          <div className="absolute inset-0 z-30 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-5 border-2 border-amber-400 shadow-2xl max-w-sm w-full space-y-3"
            >
              <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-300 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-md">
                🏆
              </div>

              <div>
                <h3 className="text-base font-extrabold text-amber-950">
                  {isIndo ? 'FESTIVAL STARFALL SELESAI!' : 'STARFALL RUSH COMPLETE!'}
                </h3>
                <p className="text-xs text-slate-600">
                  {score >= targetScore
                    ? (isIndo ? 'Luar biasa! Semangat persahabatan terkumpul penuh!' : 'Incredible! Festival spirit is overflowing!')
                    : (isIndo ? 'Usaha yang bagus! Kamu berhasil mengumpulkan keceriaan.' : 'Great effort! You caught plenty of joy.')}
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-1.5 text-2xl">
                <span className={starsEarned >= 1 ? 'text-amber-400' : 'text-slate-300'}>⭐</span>
                <span className={starsEarned >= 2 ? 'text-amber-400' : 'text-slate-300'}>⭐</span>
                <span className={starsEarned >= 3 ? 'text-amber-400' : 'text-slate-300'}>⭐</span>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-left font-medium">
                <div>
                  <span className="text-slate-500">{isIndo ? 'Total Skor:' : 'Total Score:'}</span>{' '}
                  <span className="font-extrabold text-amber-950">{score}</span>
                </div>
                <div>
                  <span className="text-slate-500">{isIndo ? 'Max Combo:' : 'Max Combo:'}</span>{' '}
                  <span className="font-extrabold text-amber-950">{maxCombo}x</span>
                </div>
                <div>
                  <span className="text-slate-500">{isIndo ? 'Bintang/Balon:' : 'Items Caught:'}</span>{' '}
                  <span className="font-extrabold text-amber-950">{collectedStats.star + collectedStats.balloon + collectedStats.heart}</span>
                </div>
                <div>
                  <span className="text-slate-500">{isIndo ? 'Bonus Hubungan:' : 'Bond Bonus:'}</span>{' '}
                  <span className="font-bold text-emerald-700">{isIndo ? '+2 Inisiatif' : '+2 Initiative'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={startGame}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  title={isIndo ? 'Main Lagi' : 'Play Again'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onComplete}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 font-extrabold text-xs shadow-md shadow-amber-400/40 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                >
                  <span>{isIndo ? 'Lanjut ke Bab 2: Taman Lentera' : 'Continue to Chapter 2: Lantern Grove'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Falling items */}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-md select-none transition-transform"
          >
            <div className={`text-2xl sm:text-3xl ${item.isBonus ? 'animate-spin' : ''}`}>
              {item.icon}
            </div>
          </div>
        ))}

        {/* Catch Popups (+15, COMBO!) */}
        <AnimatePresence>
          {popups.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -30, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{ left: `${p.x}%`, bottom: '22%' }}
              className={`absolute -translate-x-1/2 text-xs sm:text-sm pointer-events-none ${p.color}`}
            >
              {p.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Mascot Basket at Bottom */}
        <div
          style={{ left: `${basketX}%` }}
          className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-[left] duration-75"
        >
          {/* Catch Basket Glow */}
          <div className="w-16 h-4 bg-amber-400/40 rounded-full blur-xs -mb-2" />

          {/* Golden Catching Basket Bowl */}
          <div className="w-18 h-7 bg-amber-400 border-2 border-amber-600 rounded-b-2xl shadow-md flex items-center justify-center text-xs font-bold text-amber-950 z-20">
            🧺
          </div>

          {/* Mascot Sprite */}
          <AvatarSprite avatarId={mascotId} className="w-18 h-18 sm:w-20 sm:h-20 -mt-2" />
        </div>
      </div>

      {/* Touch Screen On-Screen Movement Controls */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onMouseDown={() => setIsMovingLeft(true)}
          onMouseUp={() => setIsMovingLeft(false)}
          onTouchStart={() => setIsMovingLeft(true)}
          onTouchEnd={() => setIsMovingLeft(false)}
          className="py-3 bg-white/90 hover:bg-amber-100 active:bg-amber-300 border-2 border-amber-300 text-amber-950 font-bold rounded-2xl text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1 select-none active:scale-98 transition-all"
        >
          <span>◀</span>
          <span>{isIndo ? 'Geser Kiri' : 'Move Left'}</span>
        </button>

        <button
          type="button"
          onMouseDown={() => setIsMovingRight(true)}
          onMouseUp={() => setIsMovingRight(false)}
          onTouchStart={() => setIsMovingRight(true)}
          onTouchEnd={() => setIsMovingRight(false)}
          className="py-3 bg-white/90 hover:bg-amber-100 active:bg-amber-300 border-2 border-amber-300 text-amber-950 font-bold rounded-2xl text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1 select-none active:scale-98 transition-all"
        >
          <span>{isIndo ? 'Geser Kanan' : 'Move Right'}</span>
          <span>▶</span>
        </button>
      </div>
    </div>
  );
}
