import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Lightbulb, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { useLanguage } from '../../hooks/useLanguage';
import { sound } from '../../lib/sound';
import { AvatarSprite } from '../characters/AvatarSprite';

// Directions helper
const OPPOSITE = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

const BASE_OPENINGS = {
  I: ['left', 'right'],
  L: ['top', 'right'],
  T: ['left', 'top', 'right'],
  X: ['top', 'right', 'bottom', 'left'],
};

// Compute effective openings after N rotations (90 deg clockwise each)
function getRotatedOpenings(type, rotation) {
  const dirOrder = ['top', 'right', 'bottom', 'left'];
  const base = BASE_OPENINGS[type] || [];
  return base.map((dir) => {
    const idx = dirOrder.indexOf(dir);
    return dirOrder[(idx + rotation) % 4];
  });
}

// Initial Level 1: 3x3 Grid (Winding valley S-curve puzzle - no direct straight line possible)
const LEVEL_1_TILES = [
  // Row 0
  { id: 't0_0', type: 'L', rot: 3 }, // Target rot: 1 (openings: right, bottom)
  { id: 't0_1', type: 'L', rot: 0 }, // Target rot: 2 (openings: bottom, left)
  { id: 't0_2', type: 'L', rot: 1 }, // Decoy / Side (openings: right, bottom)
  // Row 1 (Start & End row)
  { id: 't1_0', type: 'L', rot: 1 }, // START: Target rot: 3 (openings: left, top -> routes light UP, impossible to go straight!)
  { id: 't1_1', type: 'I', rot: 0 }, // CENTER: Target rot: 1 (vertical: top, bottom -> connects top-middle to bottom-middle!)
  { id: 't1_2', type: 'L', rot: 3 }, // END: Target rot: 1 (openings: right, bottom -> receives light from DOWN, exits to goal!)
  // Row 2
  { id: 't2_0', type: 'L', rot: 2 }, // Decoy / Side (openings: bottom, left)
  { id: 't2_1', type: 'L', rot: 2 }, // Target rot: 0 (openings: top, right)
  { id: 't2_2', type: 'L', rot: 1 }, // Target rot: 3 (openings: left, top)
];

// Winning solution path order for the smart hint system
const SOLUTION_STEPS = [
  { idx: 3, targetRot: 3 }, // t1_0: Left in from Nori, Top out
  { idx: 0, targetRot: 1 }, // t0_0: Bottom in from t1_0, Right out
  { idx: 1, targetRot: 2 }, // t0_1: Left in from t0_0, Bottom out into center
  { idx: 4, targetRot: 1, isI: true }, // t1_1: Top in from t0_1, Bottom out into row 2
  { idx: 7, targetRot: 0 }, // t2_1: Top in from t1_1, Right out
  { idx: 8, targetRot: 3 }, // t2_2: Left in from t2_1, Top out into goal tile
  { idx: 5, targetRot: 1 }, // t1_2: Bottom in from t2_2, Right out to Bengkel Bumi
];

export function ArcadeBridgeCircuit({ onComplete, onSkip }) {
  const { state } = useGame();
  const { language } = useLanguage();
  const isIndo = language === 'id';
  const soundOn = state.soundEnabled;

  const [tiles, setTiles] = useState(LEVEL_1_TILES);
  const [moves, setMoves] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  // Rows and Cols
  const rows = 3;
  const cols = 3;

  // BFS to compute which tiles are energized from Start (1, 0)
  const poweredTileIds = useMemo(() => {
    const startTile = tiles[1 * cols + 0]; // (1, 0)
    const startOpenings = getRotatedOpenings(startTile.type, startTile.rot);

    // If start tile doesn't open to 'left' (the festival energy feed), nothing flows
    if (!startOpenings.includes('left')) {
      return new Set();
    }

    const powered = new Set([startTile.id]);
    const queue = [{ r: 1, c: 0, tile: startTile }];

    while (queue.length > 0) {
      const { r, c, tile } = queue.shift();
      const currentOpenings = getRotatedOpenings(tile.type, tile.rot);

      // Check all 4 neighbors
      const neighbors = [
        { r: r - 1, c, dir: 'top' },
        { r, c: c + 1, dir: 'right' },
        { r: r + 1, c, dir: 'bottom' },
        { r, c: c - 1, dir: 'left' },
      ];

      for (const n of neighbors) {
        if (n.r < 0 || n.r >= rows || n.c < 0 || n.c >= cols) continue;
        const neighborTile = tiles[n.r * cols + n.c];
        if (powered.has(neighborTile.id)) continue;

        const neighborOpenings = getRotatedOpenings(neighborTile.type, neighborTile.rot);

        // Check if both current tile opens to neighbor, and neighbor opens to current tile
        if (currentOpenings.includes(n.dir) && neighborOpenings.includes(OPPOSITE[n.dir])) {
          powered.add(neighborTile.id);
          queue.push({ r: n.r, c: n.c, tile: neighborTile });
        }
      }
    }

    return powered;
  }, [tiles, rows, cols]);

  // Derived victory state: End tile (1, cols - 1) is powered AND opens to 'right'
  const isSolved = useMemo(() => {
    // Safety check: Player must have made at least 1 move or used 1 hint
    if (moves === 0 && hintsUsed === 0) return false;
    const endTile = tiles[1 * cols + (cols - 1)];
    const endOpenings = getRotatedOpenings(endTile.type, endTile.rot);
    return poweredTileIds.has(endTile.id) && endOpenings.includes('right');
  }, [tiles, cols, poweredTileIds, moves, hintsUsed]);

  // Trigger victory fanfare when isSolved becomes true
  useEffect(() => {
    if (isSolved && !showVictory) {
      sound.playCircuitConnect(soundOn);
      const timer = setTimeout(() => {
        setShowVictory(true);
        sound.playSparkle(soundOn);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSolved, showVictory, soundOn]);

  // Rotate a tile 90 degrees clockwise
  const handleRotateTile = (idx) => {
    if (isSolved) return;
    sound.playRotate(soundOn);
    setMoves((m) => m + 1);
    setTiles((prev) => {
      const next = [...prev];
      const target = next[idx];
      next[idx] = {
        ...target,
        rot: (target.rot + 1) % 4,
      };
      return next;
    });
  };

  // Provide a smart hint: rotate one unaligned tile toward a winning orientation
  const handleUseHint = () => {
    if (isSolved) return;
    sound.playSelect(soundOn);
    setHintsUsed((h) => h + 1);

    setTiles((prev) => {
      const next = [...prev];
      for (const step of SOLUTION_STEPS) {
        const curRot = next[step.idx].rot;
        const isAligned = step.isI ? curRot % 2 === step.targetRot % 2 : curRot === step.targetRot;
        if (!isAligned) {
          next[step.idx] = { ...next[step.idx], rot: step.targetRot };
          return next;
        }
      }
      return next;
    });
  };

  const handleReset = () => {
    sound.playSelect(soundOn);
    setTiles(LEVEL_1_TILES);
    setMoves(0);
    setShowVictory(false);
  };

  const mascotId = state.participant.avatarId || 'milo';

  return (
    <div className="w-full flex-1 flex flex-col space-y-3">
      {/* Top Puzzle Status Bar */}
      <div className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-300 p-3 rounded-3xl border-2 border-teal-400 shadow-soft flex items-center justify-between text-teal-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-white/90 flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-900/80">
              {isIndo ? 'Status Aliran Jembatan' : 'Bridge Energy Flow'}
            </div>
            <div className="text-xs sm:text-sm font-black flex items-center gap-1">
              {isSolved ? (
                <span className="text-emerald-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                  {isIndo ? 'TERHUBUNG PENUH! ✨' : 'CONNECTED! ✨'}
                </span>
              ) : (
                <span>
                  {poweredTileIds.size} / 9 {isIndo ? 'Lentera Menyala' : 'Lanterns Lit'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Moves & Hint Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseHint}
            className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-amber-100 text-teal-900 border border-teal-300 text-xs font-bold cursor-pointer flex items-center gap-1 shadow-xs"
            title="Dapatkan petunjuk rotasi"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px]">{isIndo ? 'Petunjuk' : 'Hint'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-600 border border-teal-300 cursor-pointer shadow-xs"
            title="Reset Papan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Puzzle Playing Field */}
      <div className="relative w-full rounded-3xl overflow-hidden border-3 border-teal-300 shadow-lg p-4 sm:p-6 bg-gradient-to-b from-teal-900 via-emerald-800 to-teal-950 text-white flex flex-col justify-between items-center min-h-[360px]">
        {/* Story Objective Banner */}
        <div className="w-full text-center space-y-1 z-10">
          <h3 className="text-sm font-extrabold text-amber-300 flex items-center justify-center gap-1.5">
            <span>🏮</span>
            <span>{isIndo ? 'Interlude: Sambungkan Jembatan Lentera Lembah!' : 'Interlude: Connect the Lantern Bridge!'}</span>
            <span>🏮</span>
          </h3>
          <p className="text-[11px] text-teal-100 max-w-md mx-auto">
            {isIndo
              ? 'Ketuk ubin pipa bambu untuk memutarnya. Salurkan pendaran cahaya dari Lentera Nori (kiri) ke Bengkel Bumi (kanan)!'
              : 'Tap bamboo tiles to rotate them. Connect the light conduits from Nori\'s Garden (left) to Bumi\'s Workshop (right)!'}
          </p>
        </div>

        {/* 3x3 Conduit Grid with Left Entry & Right Exit nodes */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 my-3 z-10 w-full">
          {/* Left Entry Portal (Nori's Shrine) */}
          <div className="flex flex-col items-center gap-1 text-center select-none">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 border-2 border-amber-300 shadow-lg shadow-amber-400/60 flex items-center justify-center text-xl text-amber-950"
            >
              🏮
            </motion.div>
            <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">
              {isIndo ? 'Nori (Mulai)' : 'Nori (Start)'}
            </span>
            <div className="w-4 h-1 bg-amber-300 rounded-full animate-pulse" />
          </div>

          {/* Center 3x3 Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 p-2 rounded-3xl bg-slate-900/60 border-2 border-teal-500/50 backdrop-blur-md shadow-2xl">
            {tiles.map((tile, idx) => {
              const isPowered = poweredTileIds.has(tile.id);
              const rotationDegrees = tile.rot * 90;

              return (
                <motion.button
                  key={tile.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRotateTile(idx)}
                  className={`w-18 h-18 sm:w-22 sm:h-22 rounded-2xl border-2 cursor-pointer relative overflow-hidden transition-all duration-300 flex items-center justify-center ${
                    isPowered
                      ? 'bg-gradient-to-br from-amber-400/90 via-amber-300 to-yellow-200 border-amber-400 shadow-md shadow-amber-300/50'
                      : 'bg-teal-950/80 border-teal-700/60 hover:border-teal-400'
                  }`}
                >
                  {/* Rotating Conduit Graphic */}
                  <div
                    style={{ transform: `rotate(${rotationDegrees}deg)` }}
                    className="w-full h-full relative transition-transform duration-300 ease-out"
                  >
                    {/* SVG Conduit Paths */}
                    <svg viewBox="0 0 80 80" className="w-full h-full pointer-events-none">
                      {/* Straight Pipe (I) */}
                      {tile.type === 'I' && (
                        <>
                          <rect
                            x="0"
                            y="28"
                            width="80"
                            height="24"
                            rx="6"
                            fill={isPowered ? '#F59E0B' : '#0F766E'}
                            stroke={isPowered ? '#78350F' : '#042F2E'}
                            strokeWidth="2"
                          />
                          {isPowered && (
                            <line
                              x1="0"
                              y1="40"
                              x2="80"
                              y2="40"
                              stroke="#FEF08A"
                              strokeWidth="6"
                              strokeLinecap="round"
                              className="animate-pulse"
                            />
                          )}
                        </>
                      )}

                      {/* Corner Pipe (L: Top & Right) */}
                      {tile.type === 'L' && (
                        <>
                          <path
                            d="M 40 0 L 40 40 L 80 40"
                            stroke={isPowered ? '#F59E0B' : '#0F766E'}
                            strokeWidth="24"
                            strokeLinejoin="round"
                            fill="none"
                          />
                          <path
                            d="M 40 0 L 40 40 L 80 40"
                            stroke={isPowered ? '#78350F' : '#042F2E'}
                            strokeWidth="2"
                            fill="none"
                          />
                          {isPowered && (
                            <path
                              d="M 40 0 L 40 40 L 80 40"
                              stroke="#FEF08A"
                              strokeWidth="6"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                              fill="none"
                              className="animate-pulse"
                            />
                          )}
                        </>
                      )}

                      {/* T-Junction Pipe (T: Left, Top, Right) */}
                      {tile.type === 'T' && (
                        <>
                          <path
                            d="M 0 40 L 80 40 M 40 40 L 40 0"
                            stroke={isPowered ? '#F59E0B' : '#0F766E'}
                            strokeWidth="22"
                            strokeLinecap="square"
                            fill="none"
                          />
                          {isPowered && (
                            <path
                              d="M 0 40 L 80 40 M 40 40 L 40 0"
                              stroke="#FEF08A"
                              strokeWidth="6"
                              strokeLinecap="round"
                              fill="none"
                              className="animate-pulse"
                            />
                          )}
                        </>
                      )}

                      {/* Center Lantern Lamp node */}
                      <circle
                        cx="40"
                        cy="40"
                        r="9"
                        fill={isPowered ? '#FBBF24' : '#115E59'}
                        stroke={isPowered ? '#D97706' : '#042F2E'}
                        strokeWidth="2"
                      />
                      {isPowered && (
                        <circle cx="40" cy="40" r="4" fill="#FFFFFF" className="animate-ping" />
                      )}
                    </svg>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right Exit Portal (Bumi's Guild) */}
          <div className="flex flex-col items-center gap-1 text-center select-none">
            <motion.div
              animate={isSolved ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 flex items-center justify-center text-xl transition-all ${
                isSolved
                  ? 'bg-amber-400 border-amber-300 shadow-xl shadow-amber-300/80 text-amber-950'
                  : 'bg-teal-900 border-teal-700 text-teal-400'
              }`}
            >
              🔨
            </motion.div>
            <span className="text-[9px] font-bold text-teal-300 uppercase tracking-wider">
              {isIndo ? 'Bumi (Tujuan)' : 'Bumi (Goal)'}
            </span>
            <div
              className={`w-4 h-1 rounded-full ${isSolved ? 'bg-amber-300 animate-pulse' : 'bg-teal-700'}`}
            />
          </div>
        </div>

        {/* Bottom Mascot Guidance */}
        <div className="flex items-center gap-2 z-10 bg-slate-900/70 px-4 py-2 rounded-full border border-teal-500/50 text-xs shadow-md">
          <AvatarSprite avatarId={mascotId} className="w-6 h-6" animated={false} />
          <span className="text-teal-200 text-[11px] font-semibold">
            {isSolved
              ? (isIndo ? 'Hebat! Jembatan cahaya tersambung utuh!' : 'Awesome! The bridge is fully connected!')
              : moves === 0
              ? (isIndo ? '👆 Ketuk ubin pipa di atas untuk memutarnya!' : '👆 Tap the pipe tiles above to rotate them!')
              : (isIndo ? `Langkah: ${moves} kali putar` : `Moves: ${moves}`)}
          </span>
        </div>

        {/* Victory Celebration Modal */}
        <AnimatePresence>
          {showVictory && (
            <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white text-slate-800 rounded-3xl p-5 border-2 border-amber-400 shadow-2xl max-w-sm w-full space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-300 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-md">
                  🌉
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-amber-950">
                    {isIndo ? 'JEMBATAN PERSAHABATAN TERHUBUNG!' : 'HARMONY BRIDGE CONNECTED!'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {isIndo
                      ? 'Lentera-lentera di atas sungai kini menyala indah, menyatukan kedamaian Nori dengan semangat bengkel Bumi!'
                      : 'The river lanterns are glowing brightly, bridging Nori\'s peace with Bumi\'s workshop!'}
                  </p>
                </div>

                {/* Rating & Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-left font-medium">
                  <div>
                    <span className="text-slate-500">{isIndo ? 'Jumlah Putaran:' : 'Rotations:'}</span>{' '}
                    <span className="font-extrabold text-amber-950">{moves}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{isIndo ? 'Petunjuk:' : 'Hints:'}</span>{' '}
                    <span className="font-extrabold text-amber-950">{hintsUsed}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">{isIndo ? 'Bonus Hubungan:' : 'Bond Bonus:'}</span>{' '}
                    <span className="font-bold text-emerald-700">{isIndo ? '+2 Empati & +2 Adaptabilitas' : '+2 Empathy & +2 Adaptability'}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title={isIndo ? 'Ulangi Puzzle' : 'Retry Puzzle'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onComplete}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-xs shadow-md shadow-teal-500/40 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <span>{isIndo ? 'Lanjut ke Bab 3: Bengkel Bumi' : 'Continue to Chapter 3: Bumi\'s Workshop'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button for participants in a hurry */}
      {onSkip && !isSolved && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onSkip}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer underline underline-offset-2"
          >
            {isIndo ? 'Lewati Puzzle & Lanjut Cerita' : 'Skip Puzzle & Continue Story'}
          </button>
        </div>
      )}
    </div>
  );
}
