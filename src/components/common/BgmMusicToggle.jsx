import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { sound } from '../../lib/sound';
import { useLanguage } from '../../hooks/useLanguage';

export function BgmMusicToggle({ className = '', variant = 'compact' }) {
  const { language } = useLanguage();
  const isIndo = language === 'id';

  const [isPlaying, setIsPlaying] = useState(sound.isBgmPlaying);

  useEffect(() => {
    // Subscribe to sound engine state updates
    const unsubscribe = sound.subscribe((state) => {
      setIsPlaying(state.isBgmPlaying);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    sound.init();
    sound.toggleBgm();
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
          isPlaying
            ? 'bg-amber-300 border-amber-400 text-amber-950 shadow-amber-300/40'
            : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-50'
        } ${className}`}
        title={isPlaying ? (isIndo ? 'Matikan Musik Latar' : 'Pause Music') : (isIndo ? 'Putar Musik Ceria' : 'Play Cheerful BGM')}
      >
        <div className="flex items-center gap-1">
          <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-amber-900' : 'text-slate-400'}`} />
          {isPlaying && (
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-2.5 bg-amber-900 rounded-full animate-pulse" />
              <span className="w-0.5 h-3.5 bg-amber-900 rounded-full animate-pulse delay-100" />
              <span className="w-0.5 h-1.5 bg-amber-900 rounded-full animate-pulse delay-200" />
            </span>
          )}
        </div>
        <span>{isPlaying ? (isIndo ? 'Musik: Aktif ♫' : 'BGM: On ♫') : (isIndo ? 'Nyalakan Musik' : 'Play Music')}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isPlaying ? (isIndo ? 'Musik Latar Aktif (Klik untuk Matikan)' : 'Music Playing (Click to Pause)') : (isIndo ? 'Putar Musik Latar Ceria' : 'Play Background Music')}
      className={`
        p-2 rounded-full border transition cursor-pointer shadow-xs flex items-center justify-center relative
        ${
          isPlaying
            ? 'bg-amber-100/90 border-amber-300 text-amber-800 hover:bg-amber-200'
            : 'bg-white/90 border-amber-200/80 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
        }
        ${className}
      `}
      aria-label="Toggle Background Music"
    >
      <Music className={`w-4 h-4 ${isPlaying ? 'text-amber-800' : 'text-slate-400'}`} />
      {isPlaying && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
        </span>
      )}
    </button>
  );
}
