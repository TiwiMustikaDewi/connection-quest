import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../../hooks/useGame';
import { useLanguage } from '../../hooks/useLanguage';
import { sound } from '../../lib/sound';

export function SoundToggle({ className = '' }) {
  const { state, toggleSound } = useGame();
  const { t } = useLanguage();
  const isMuted = !state.soundEnabled;

  const handleToggle = () => {
    sound.init();
    toggleSound();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isMuted ? t('common.soundOff') : t('common.soundOn')}
      className={`
        p-2 rounded-full bg-white/90 border border-amber-200/80 text-slate-600
        hover:text-amber-800 hover:bg-amber-50 active:scale-95 transition cursor-pointer shadow-xs
        ${className}
      `}
      aria-label={isMuted ? t('common.soundOff') : t('common.soundOn')}
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-slate-400" />
      ) : (
        <Volume2 className="w-4 h-4 text-amber-600" />
      )}
    </button>
  );
}
