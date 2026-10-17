import React, { useEffect } from 'react';
import { Header } from './Header';
import { useLanguage } from '../../hooks/useLanguage';
import { useGame } from '../../hooks/useGame';
import { sound } from '../../lib/sound';

export function AppLayout({ children }) {
  const { t } = useLanguage();
  const { state } = useGame();

  // Auto-start audio and sound effects by default when user enters the web
  useEffect(() => {
    // Attempt immediate start
    sound.init();
    if (state.soundEnabled && !sound.isBgmPlaying && !sound.userMutedBgm) {
      sound.startBgm();
    }

    // Modern browsers require a user interaction (tap/click/key) to unlock AudioContext
    const handleFirstInteraction = () => {
      sound.init();
      if (state.soundEnabled && !sound.isBgmPlaying && !sound.userMutedBgm) {
        sound.startBgm();
      }
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [state.soundEnabled]);

  return (
    <div className="min-h-screen flex flex-col bg-connectopia text-slate-800">
      <Header />
      
      <main className="flex-1 w-full max-w-xl mx-auto flex flex-col px-4 py-4 sm:py-6">
        {children}
      </main>

      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-amber-100/60 bg-white/40">
        <p className="font-medium">
          {t('common.eventTitle')} • {t('common.subTitle')}
        </p>
      </footer>
    </div>
  );
}
