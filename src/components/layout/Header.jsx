import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, RotateCcw, Trophy } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useGame } from '../../hooks/useGame';
import { LanguageToggle } from '../common/LanguageToggle';
import { SoundToggle } from '../common/SoundToggle';
import { BgmMusicToggle } from '../common/BgmMusicToggle';
import { ConfirmResetModal } from '../common/ConfirmResetModal';
import { AvatarSprite } from '../characters/AvatarSprite';

export function Header() {
  const { t, language } = useLanguage();
  const isIndo = language === 'id';
  const { state, resetGame, hasStarted } = useGame();
  const location = useLocation();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleReset = () => {
    resetGame();
    setShowConfirmReset(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full px-2.5 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md bg-[#FFFDF9]/90 border-b border-amber-100/80 shadow-2xs">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand / Title (Compact & Non-wrapping) */}
        <Link
          to="/"
          className="flex items-center gap-1.5 group transition shrink-0"
          aria-label={t('common.appName')}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-300 flex items-center justify-center text-amber-900 shadow-xs group-hover:rotate-6 transition-transform shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-slate-800 text-xs sm:text-sm font-display tracking-tight leading-tight">
              {t('common.appName')}
            </span>
            <span className="text-[9px] text-amber-700/80 font-medium hidden md:inline">
              AFL Winter Peak 2026
            </span>
          </div>
        </Link>

        {/* Right Controls (Slim, compact icon cluster) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Active Avatar & Name Pill if registered - only on larger screens */}
          {hasStarted && (
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-slate-700">
              <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center bg-white border border-amber-200 shrink-0">
                <AvatarSprite avatarId={state.participant.avatarId} className="w-4 h-4" animated={false} />
              </div>
              <span className="max-w-[70px] truncate text-[11px]">{state.participant.name}</span>
            </div>
          )}

          {/* Leaderboard Link Button */}
          <Link
            to="/leaderboard"
            className="p-1.5 sm:p-2 rounded-full bg-white/90 border border-amber-200/80 text-amber-700 hover:text-amber-900 hover:bg-amber-100/60 active:scale-95 transition cursor-pointer shadow-xs shrink-0"
            title={isIndo ? 'Lihat Peringkat Leaderboard' : 'View Leaderboard'}
            aria-label="Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-300 text-amber-600" />
          </Link>

          {/* Reset button (visible when game has started) */}
          {hasStarted && location.pathname !== '/' && (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              title={t('common.reset')}
              className="p-1.5 sm:p-2 rounded-full bg-white/90 border border-amber-200/80 text-slate-500 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition cursor-pointer shadow-xs shrink-0"
              aria-label={t('common.reset')}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Background Music Toggle */}
          <BgmMusicToggle className="p-1.5 sm:p-2 shrink-0" />

          {/* Sound Toggle */}
          <SoundToggle className="p-1.5 sm:p-2 shrink-0" />

          {/* Language Toggle (Compact single-pill) */}
          <LanguageToggle className="px-2 py-1 text-[11px]" />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmResetModal
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        onConfirm={handleReset}
      />
    </header>
  );
}
