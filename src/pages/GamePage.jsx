import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Gamepad2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useGame } from '../hooks/useGame';
import { SceneRenderer } from '../components/game/SceneRenderer';
import { IndicatorToast } from '../components/game/IndicatorToast';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { BgmMusicToggle } from '../components/common/BgmMusicToggle';
import { ArcadeGameCenterModal } from '../components/game/ArcadeGameCenterModal';
import { STORY_SCENES, calculateEnding, CHAPTERS_META } from '../data/chapters/storyData';
import { sound } from '../lib/sound';

export function GamePage() {
  const { language } = useLanguage();
  const { state, setScene, recordChoice, setEnding } = useGame();
  const navigate = useNavigate();

  const [activeToast, setActiveToast] = useState(null);
  const [showArcadeModal, setShowArcadeModal] = useState(false);

  const isIndo = language === 'id';

  // Current Scene resolution
  const currentSceneId = state.currentSceneId && STORY_SCENES[state.currentSceneId]
    ? state.currentSceneId
    : 'ch1_intro';

  const currentScene = STORY_SCENES[currentSceneId];
  const currentChapter = currentScene?.chapter || state.currentChapter || 1;
  const chapterMeta = CHAPTERS_META.find((c) => c.chapter === currentChapter) || CHAPTERS_META[0];
  const isInterlude = Boolean(currentScene?.isInterludeGame);


  // Handler for advancing narrative dialogue
  const handleAdvanceScene = () => {
    if (!currentScene) return;

    if (currentScene.nextSceneId) {
      const nextScene = STORY_SCENES[currentScene.nextSceneId];
      const nextChapter = nextScene?.chapter || currentChapter;
      setScene(currentScene.nextSceneId, nextChapter);
    } else {
      // Reached the end of Chapter 3!
      sound.playSparkle(state.soundEnabled);
      const computedEnding = calculateEnding(state.indicators);
      setEnding(computedEnding);
      navigate('/ending');
    }
  };

  // Handler for picking one of the 3 decisions
  const handleMakeChoice = (choice) => {
    if (!choice) return;

    // Trigger toast notification for indicator increases
    if (choice.impact?.indicators) {
      setActiveToast(choice.impact.indicators);
      setTimeout(() => {
        setActiveToast(null);
      }, 2500);
    }

    const nextScene = STORY_SCENES[choice.reactionSceneId];
    const nextChapter = nextScene?.chapter || currentChapter;

    recordChoice({
      sceneId: currentScene.id,
      choiceId: choice.id,
      indicatorDeltas: choice.impact?.indicators || {},
      relationshipDeltas: choice.impact?.relationships || {},
      nextSceneId: choice.reactionSceneId,
      nextChapter,
    });
  };

  return (
    <div className="flex-1 flex flex-col max-w-xl mx-auto w-full py-2 space-y-3">
      {/* Indicator Floating Toast notification */}
      <IndicatorToast toastData={activeToast} />

      {/* Top Header Card: Chapter & Controls Bar */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-3xl border border-amber-200/80 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          {isInterlude ? (
            <Badge variant="emerald" icon={Gamepad2} className="text-xs">
              {isIndo ? 'Game Interlude: Tantangan Seru!' : 'Arcade Interlude Challenge!'}
            </Badge>
          ) : (
            <Badge variant="yellow" icon={BookOpen} className="text-xs">
              {isIndo ? chapterMeta.titleId : chapterMeta.titleEn}
            </Badge>
          )}

          {/* Quick Controls: Music Pill & Arcade Game Center */}
          <div className="flex items-center gap-1.5">
            <BgmMusicToggle variant="pill" />

            <button
              type="button"
              onClick={() => setShowArcadeModal(true)}
              className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 transition cursor-pointer shadow-xs"
              title={isIndo ? 'Buka Game Arcade Kapan Saja' : 'Open Arcade Mini-Games'}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-0.5">
          <span>{isIndo ? `Lokasi: ${chapterMeta.locationId}` : `Location: ${chapterMeta.locationEn}`}</span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {isIndo
                ? `Keputusan: ${state.choices.length} / 9`
                : `Decisions: ${state.choices.length} / 9`}
            </span>
          </div>
        </div>

        <ProgressBar
          current={currentChapter}
          total={3}
          label=""
        />
      </div>

      {/* Main Scene Engine (Visual Novel or Full Arcade Interlude) */}
      <SceneRenderer
        scene={currentScene}
        chapter={currentChapter}
        onAdvanceScene={handleAdvanceScene}
        onMakeChoice={handleMakeChoice}
      />

      {/* Standalone Arcade Game Center Modal */}
      <ArcadeGameCenterModal
        isOpen={showArcadeModal}
        onClose={() => setShowArcadeModal(false)}
      />
    </div>
  );
}
