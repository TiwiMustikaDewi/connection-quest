import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { NpcSprite } from '../characters/NpcSprite';
import { AvatarSprite } from '../characters/AvatarSprite';
import { DialogueBox } from './DialogueBox';
import { ChoicePanel } from './ChoicePanel';
import { MascotReactionEmote } from './MascotReactionEmote';
import { FantasyAnimatedBackground } from './FantasyAnimatedBackground';
import { StarCatcherMiniGame, ZenLanternMiniGame, BlueprintBuilderMiniGame } from './ArcadeMiniGames';
import { ArcadeStarfallCatcher } from './ArcadeStarfallCatcher';
import { ArcadeBridgeCircuit } from './ArcadeBridgeCircuit';
import { useLanguage } from '../../hooks/useLanguage';
import { useGame } from '../../hooks/useGame';
import { sound } from '../../lib/sound';

const LOCATION_BANNERS = {
  1: {
    bannerTextId: '🎪 Connectopia Plaza • Alun-Alun Festival',
    bannerTextEn: '🎪 Connectopia Plaza • Festival Grounds',
    decorIcon: '✨',
  },
  2: {
    bannerTextId: '🌿 Enchanted Grove • Taman Lentera Damai',
    bannerTextEn: '🌿 Enchanted Grove • Quiet Lantern Garden',
    decorIcon: '🌸',
  },
  3: {
    bannerTextId: '🔨 Artisan Guild • Bengkel Komunitas Bumi',
    bannerTextEn: '🔨 Artisan Guild • Community Workshop',
    decorIcon: '🏮',
  },
};

const STATIC_CONFETTI = [
  { x: -120, y: -110, rot: 45, color: 'bg-amber-400' },
  { x: 110, y: -130, rot: 90, color: 'bg-rose-400' },
  { x: -60, y: -160, rot: 135, color: 'bg-emerald-400' },
  { x: 80, y: -90, rot: 180, color: 'bg-sky-400' },
  { x: -140, y: -60, rot: 220, color: 'bg-violet-400' },
  { x: 130, y: -80, rot: 300, color: 'bg-amber-500' },
  { x: -20, y: -140, rot: 75, color: 'bg-rose-500' },
  { x: 40, y: -150, rot: 15, color: 'bg-emerald-500' },
  { x: -90, y: -120, rot: 190, color: 'bg-sky-500' },
  { x: 90, y: -110, rot: 260, color: 'bg-violet-500' },
];

export function SceneRenderer({
  scene,
  chapter = 1,
  onAdvanceScene,
  onMakeChoice,
}) {
  const { language } = useLanguage();
  const { state } = useGame();
  const isIndo = language === 'id';

  // Interactive Stage Elements State
  const [lanternLit, setLanternLit] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);

  const locConfig = LOCATION_BANNERS[chapter] || LOCATION_BANNERS[1];
  const isDecision = Boolean(scene?.isDecision);
  const isMiniGame = scene?.isMiniGame;
  const isFinalScene = !scene?.nextSceneId && !isDecision;

  // Companion Buddy reaction text
  const companionName = state.participant.avatarId
    ? state.participant.avatarId.charAt(0).toUpperCase() + state.participant.avatarId.slice(1)
    : 'Milo';

  const companionComment = (() => {
    if (isFinalScene) {
      return isIndo ? 'Misi selesai! Kamu hebat sekali! 🏆' : 'Mission complete! You were amazing! 🏆';
    }
    if (isMiniGame) {
      return isIndo ? 'Ayo mainkan gamenya! 🎮' : 'Let us play the game! 🎮';
    }
    if (isDecision) {
      return isIndo ? 'Pilih yang paling mencerminkan dirimu!' : 'Pick what resonates most with you!';
    }
    if (state.participant.avatarId === 'lumi') {
      return isIndo ? 'Dengarkan dengan tenang... 🌿' : 'Listen with a calm mind... 🌿';
    }
    if (state.participant.avatarId === 'kiko') {
      return isIndo ? 'Ayo kita bangun koneksi baru! ✨' : 'Let us forge new connections! ✨';
    }
    return isIndo ? 'Kamu pasti bisa! ☀️' : 'You got this! ☀️';
  })();

  const currentDialogue = isIndo ? scene?.textId : scene?.textEn;

  // Handle clicking stage toys
  const triggerConfetti = () => {
    sound.playSparkle(state.soundEnabled);
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 2000);
  };

  const toggleLantern = () => {
    sound.playSelect(state.soundEnabled);
    setLanternLit((prev) => !prev);
  };

  const openBlueprint = () => {
    sound.playPop(state.soundEnabled);
    setShowBlueprintModal(true);
  };

  // Full Arcade Interlude Games between chapters
  if (scene?.isInterludeGame === 'starfall_catcher') {
    return (
      <div className="w-full flex-1 flex flex-col justify-between space-y-3">
        <ArcadeStarfallCatcher onComplete={onAdvanceScene} onSkip={onAdvanceScene} />
      </div>
    );
  }

  if (scene?.isInterludeGame === 'bridge_circuit') {
    return (
      <div className="w-full flex-1 flex flex-col justify-between space-y-3">
        <ArcadeBridgeCircuit onComplete={onAdvanceScene} onSkip={onAdvanceScene} />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col justify-between space-y-3">
      {/* Living Animated Fantasy World Stage */}
      <div
        className="relative w-full rounded-3xl overflow-hidden border-2 border-amber-300/80 shadow-soft min-h-[300px] sm:min-h-[340px] flex flex-col justify-between p-4"
      >
        {/* Layer 1: Living Animated Fantasy Backdrop */}
        <FantasyAnimatedBackground chapter={chapter} />

        {/* Layer 2: Top Floating Location & Interactive Gadgets */}
        <div className="flex justify-between items-center z-20">
          <div className="px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-300/90 shadow-xs text-[11px] font-bold text-slate-800 backdrop-blur-xs flex items-center gap-1.5">
            <span>{locConfig.decorIcon}</span>
            <span>{isIndo ? locConfig.bannerTextId : locConfig.bannerTextEn}</span>
          </div>

          {/* Interactive Toys according to chapter */}
          <div className="flex items-center gap-2">
            {chapter === 1 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={triggerConfetti}
                className="px-2.5 py-1 rounded-full bg-amber-300 hover:bg-amber-400 border border-amber-400 text-xs font-bold text-amber-950 shadow-xs cursor-pointer flex items-center gap-1"
                title="Klik untuk meletuskan confetti!"
              >
                <span>🎉</span>
                <span className="text-[10px] hidden xs:inline">{isIndo ? 'Rayakan!' : 'Cheer!'}</span>
              </motion.button>
            )}

            {chapter === 2 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLantern}
                className={`px-2.5 py-1 rounded-full border text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1 transition-colors ${
                  lanternLit
                    ? 'bg-amber-300 border-amber-400 text-amber-950 shadow-md shadow-amber-300/50'
                    : 'bg-white/85 border-teal-300 text-teal-800'
                }`}
                title="Sentuh untuk menyalakan lentera bambu!"
              >
                <span>🏮</span>
                <span className="text-[10px] hidden xs:inline">
                  {lanternLit ? (isIndo ? 'Lentera Menyala' : 'Lantern Lit') : (isIndo ? 'Nyalakan Lentera' : 'Light Lantern')}
                </span>
              </motion.button>
            )}

            {chapter === 3 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={openBlueprint}
                className="px-2.5 py-1 rounded-full bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 text-indigo-900 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                title="Buka sketsa denah workshop!"
              >
                <span>📐</span>
                <span className="text-[10px] hidden xs:inline">{isIndo ? 'Lihat Denah' : 'Blueprint'}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Layer 3: Ambient Confetti Particle Explosion */}
        {confettiActive && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
            {STATIC_CONFETTI.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1.4, 0.8],
                  x: item.x,
                  y: item.y,
                  rotate: item.rot,
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className={`absolute w-3 h-3 rounded-full ${item.color}`}
              />
            ))}
          </div>
        )}

        {/* Ambient Warm Glow overlay when lantern lit in Garden */}
        {lanternLit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            className="absolute inset-0 bg-radial from-amber-300 via-transparent to-transparent pointer-events-none z-10"
          />
        )}

        {/* Layer 4: Living Character Stage (Companion & NPC) */}
        <div className="flex items-end justify-between px-2 sm:px-6 py-2 relative z-10">
          {/* Left: Companion Buddy Mascot with Emoticon Bubble */}
          <div className="flex flex-col items-center relative">
            <MascotReactionEmote emote={scene?.companionEmote} position="left" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mb-1.5 px-3 py-1 rounded-2xl bg-white/95 border border-amber-300 shadow-xs text-[10px] sm:text-xs font-bold text-amber-950 max-w-[130px] sm:max-w-[150px] text-center"
            >
              {companionComment}
            </motion.div>

            <AvatarSprite
              avatarId={state.participant.avatarId || 'milo'}
              className="w-22 h-22 sm:w-28 sm:h-28"
            />
            <span className="text-[10px] font-bold text-slate-800 bg-white/95 px-2.5 py-0.5 rounded-full border border-amber-300 mt-1 shadow-2xs">
              {state.participant.name ? `${state.participant.name} & ${companionName}` : companionName}
            </span>
          </div>

          {/* Right: NPC Character Sprite with Emoticon Bubble */}
          {scene?.npcId && (
            <div className="flex flex-col items-center relative">
              <MascotReactionEmote emote={scene?.npcEmote} position="right" />

              <NpcSprite
                npcId={scene.npcId}
                expression={scene.npcExpression || 'neutral'}
                className="w-24 h-24 sm:w-32 sm:h-32"
              />
              <span className="text-[11px] font-bold text-slate-800 bg-white/95 px-3 py-0.5 rounded-full border border-amber-400 mt-1 shadow-2xs">
                {scene.speaker}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Blueprint Sketch Modal (Chapter 3) - Portaled to document.body */}
      {showBlueprintModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-5 max-w-sm w-full border-2 border-indigo-300 shadow-2xl space-y-3 text-center my-auto"
          >
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <span>📐</span> {isIndo ? 'Sketsa Denah Kolaborasi Festival' : 'Festival Blueprint Concept'}
              </span>
              <button
                type="button"
                onClick={() => setShowBlueprintModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-950 text-left space-y-2 font-mono">
              <div className="border border-dashed border-indigo-300 p-2 rounded-lg text-center font-bold bg-white/80">
                [ 🎵 PANGGUNG TERBUKA MODULAR ]
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                <div className="border border-indigo-200 p-1.5 rounded bg-white">🏮 Stan Lentera Nori</div>
                <div className="border border-indigo-200 p-1.5 rounded bg-white">🎨 Meja Kreasi Warga</div>
              </div>
              <p className="text-[11px] text-slate-600 font-sans pt-1">
                {isIndo
                  ? 'Konsep kolaboratif menyatukan panggung musik di tengah dengan stan lentera dan interaksi warga mengelilinginya secara selaras.'
                  : 'Collaborative layout placing the open performance stage at center with interactive craft stalls circling around it.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowBlueprintModal(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {isIndo ? 'Tutup Sketsa' : 'Close Blueprint'}
            </button>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Interactive Interaction Area (Arcade Mini-Game, Dialogue, or Decision Choices) */}
      <AnimatePresence mode="wait">
        {isMiniGame === 'high_five' ? (
          <StarCatcherMiniGame key="mini-star-catcher" onComplete={onAdvanceScene} />
        ) : isMiniGame === 'lantern' ? (
          <ZenLanternMiniGame key="mini-zen-lantern" onComplete={onAdvanceScene} />
        ) : isMiniGame === 'bridge' ? (
          <BlueprintBuilderMiniGame key="mini-blueprint-builder" onComplete={onAdvanceScene} />
        ) : isDecision ? (
          <div key="decision-block" className="space-y-3">
            <DialogueBox
              speakerName={scene.speaker}
              text={currentDialogue}
              showAdvancePrompt={false}
              isFinalScene={false}
            />
            <ChoicePanel
              choices={scene.choices || []}
              onSelectChoice={onMakeChoice}
            />
          </div>
        ) : (
          <DialogueBox
            key="dialogue-block"
            speakerName={scene?.speaker}
            text={currentDialogue}
            onAdvance={onAdvanceScene}
            showAdvancePrompt={Boolean(scene?.nextSceneId)}
            isFinalScene={isFinalScene}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
